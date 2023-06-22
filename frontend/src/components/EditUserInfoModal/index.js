import React, { useState, useEffect, useRef } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { editUserInfo } from "../../store/session";
import { useHistory } from "react-router-dom";
import Popup from "../Popup";
import usePopup from "../../hooks/usePopup";
import UploadButton from "../UploadButton/UploadButton";

function EditModal({ user }) {
    const fileInputRef = useRef(null);
    const [showPopup, setShowPopup] = usePopup();
    const [picChanged, setPicChanged] = useState(false);
    const [name, setName] = useState(user.username);
    const [avatar, setAvatar] = useState(user.avatar);
    const [bio, setBio] = useState(user.bio || "");
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        let errors = [];
        if (!name.length) errors.push("Username must be provided");

        // if (name.length > 20)
        //     errors.push("Username must be fewer than 20 characters");

        setErrors(errors);
    }, [name, avatar, bio]);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleAvatarChange = (e) => {
        setAvatar(e.target.value);
    };

    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (errors.length) return;

        let editedUser;

        if (!errors.length) {
            const formData = new FormData();
            if (picChanged) {
                formData.append("avatar", avatar);
                if (avatar) {
                    setShowPopup(true);
                }
            }
            formData.append("username", name);
            formData.append("bio", bio)
            editedUser = await dispatch(editUserInfo(formData, user.id));
        }

        if (!editedUser || editedUser?.errors) {
            setErrors([editedUser?.errors]);
            return;
        } else {
            closeModal();
            history.push(`/u/${editedUser.username}`);
        }
    };

    function handleFileInputChange(event) {
        event.preventDefault();
        fileInputRef.current.click();
    }

    function handleFileSelect(event) {
        event.preventDefault();
        const file = fileInputRef.current.files[0];
        setAvatar(file);
        setPicChanged(true);
    }

    return (
        <>
        {showPopup && (
                <Popup textTitle={"File uploading"} textBody={"Upload in progress..."} />
            )}
            <div className="modal">
                <div className="modal-header">
                    <h2>Edit Profile</h2>
                    <button onClick={closeModal} className="modal-close-btn">
                        &#215;
                    </button>
                </div>
                {errors.map((error, idx) => (
                    <li style={{ marginBottom: "15px", color: "red" }} key={idx}>
                        {error}
                    </li>
                ))}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="create-comm-label" htmlFor="name">
                            Username
                        </label>
                        <input
                            className="create-comm-input"
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={handleNameChange}
                        />
                        {name.length <= 20 ? (
                            <p style={{ fontSize: "12px", marginTop: "3px" }}>
                                {20 - name.length} character
                                {20 - name.length !== 1 && "s"} remaining
                            </p>
                        ) : (
                            <p style={{ fontSize: "12px", color: "red", marginTop: "3px" }}>
                                You are {name.length - 20} character
                                {name.length - 20 !== 1 && "s"} above the allowed
                                limit
                            </p>
                        )}
                    </div>
                    {/* <div className="form-group">
                        <label className="create-comm-label" htmlFor="avatar">
                            Avatar
                        </label>
                        <input
                            className="create-comm-input"
                            type="text"
                            id="avatar"
                            name="avatar"
                            value={avatar}
                            onChange={handleAvatarChange}
                        />
                    </div> */}

                    <UploadButton
                        setAttachmentFn={setAvatar}
                        attachment={avatar}
                        handleFileInputChange={handleFileInputChange}
                        handleFileSelect={handleFileSelect}
                        fileInputRef={fileInputRef}
                        setUpdateState={setPicChanged}
                    />

                    <div className="form-group">
                        <label className="create-comm-label" htmlFor="bio">
                            Bio
                        </label>
                        <textarea
                            className="create-comm-input"
                            id="bio"
                            name="bio"
                            value={bio}
                            onChange={handleBioChange}
                        />
                        {bio.length <= 2000 ? (
                            <p style={{ fontSize: "12px" }}>
                                {2000 - bio.length} character
                                {2000 - bio.length !== 1 && "s"} remaining
                            </p>
                        ) : (
                            <p style={{ fontSize: "12px", color: "red" }}>
                                You are {bio.length - 2000} character
                                {bio.length - 2000 !== 1 && "s"} above the allowed
                                limit
                            </p>
                        )}
                    </div>
                    <div className="form-actions">
                        <button
                            onClick={closeModal}
                            type="button"
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={bio.length > 2000}
                            type="submit"
                            className="btn-primary"
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default EditModal;
