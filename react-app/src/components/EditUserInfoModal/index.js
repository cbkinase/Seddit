import React, { useState } from "react";
import { useModal } from "../../context/Modal";

function EditModal({ user }) {
    const [name, setName] = useState(user.username);
    const [avatar, setAvatar] = useState(user.avatar);
    const [bio, setBio] = useState(user.bio);
    const { closeModal } = useModal();

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleAvatarChange = (e) => {
        setAvatar(e.target.value);
    };

    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(name, avatar, bio);
    };

    return (
        <div className="modal">
            <div className="modal-header">
                <h2>Edit Profile</h2>
                <button onClick={closeModal} className="modal-close-btn">
                    &#215;
                </button>
            </div>
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
                </div>
                <div className="form-group">
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
                </div>
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
    );
}

export default EditModal;
