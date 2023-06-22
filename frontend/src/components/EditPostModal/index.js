import React, { useState, useEffect } from "react";
import { useModal } from "../../context/Modal";
// import { createPost } from "../../store/posts";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { editPost } from "../../store/posts";
import RichTextEditor from "../CommentSection/RichTextEditor";
import DOMPurify from 'dompurify';

function EditPostModal({ post, subreddit }) {
    const [communityName, setCommunityName] = useState(post.title);
    const [postText, setPostText] = useState("")
    const [communityPicture, setCommunityPicture] = useState(
        post.attachment || ""
    );
    const [communityDescription, setCommunityDescription] = useState(
        post.content || ""
    );
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const history = useHistory();
    let nameLengthMax = 300;
    useEffect(() => {
        let errors = [];

        if (postText.length > 2000)
            errors.push("Description must be fewer than 2000 characters");
        if (!communityName.length) errors.push("Title must be provided");
        if (communityName.length > nameLengthMax)
            errors.push("Title must be shorter");

        setErrors(errors);
    }, [communityName, postText, nameLengthMax]);

    async function handleSubmit(e) {
        e.preventDefault();
        setHasSubmitted(true);

        // setErrors(errors)
        if (errors.length) return;

        let ePost;

        if (!errors.length) {
            const formData = new FormData();
            if (communityPicture) formData.append("attachment", communityPicture);
            formData.append("content", DOMPurify.sanitize(communityDescription));
            formData.append("subreddit_id", subreddit.id);
            formData.append("title", communityName);
            ePost = await dispatch(editPost(formData, post.id));
        }

        if (ePost.errors) {
            setErrors([ePost.errors]);
            return;
        } else {
            closeModal();
            history.push(`/r/${subreddit.name}/posts/${post.id}`);
        }
    }

    return (
        <div className="modal">
            <div className="modal-header">
                <h2>Edit Post</h2>
                <button onClick={closeModal} className="modal-close-btn">
                    &#215;
                </button>
            </div>
            {errors.map((error, idx) =>
                error === "Title must be provided" && !hasSubmitted ? null : (
                    <li
                        style={{ marginBottom: "15px", color: "red" }}
                        key={idx}
                    >
                        {error}
                    </li>
                )
            )}
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        className="create-comm-input"
                        type="text"
                        id="community-name"
                        name="community-name"
                        placeholder="Title"
                        value={communityName}
                        onChange={(event) =>
                            setCommunityName(event.target.value)
                        }
                        required
                    />
                    {communityName.length <= nameLengthMax ? (
                        <p style={{ fontSize: "12px", marginTop: "3px" }}>
                            {nameLengthMax - communityName.length} character
                            {nameLengthMax - communityName.length !== 1 &&
                                "s"}{" "}
                            remaining
                        </p>
                    ) : (
                        <p
                            style={{
                                fontSize: "12px",
                                color: "red",
                                marginTop: "3px",
                            }}
                        >
                            You are {communityName.length - nameLengthMax}{" "}
                            character
                            {communityName.length - nameLengthMax !== 1 &&
                                "s"}{" "}
                            above the allowed limit
                        </p>
                    )}
                </div>
                <div className="form-group">
                    <input
                        className="create-comm-input"
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                            setCommunityPicture(event.target.files[0])
                        }
                    />
                    <p style={{fontSize: "12px", fontStyle: "italic"}}>Optional: choose a new attachment</p>
                </div>
                <div className="form-group">
                    <RichTextEditor
                        content={communityDescription}
                        setContent={setCommunityDescription}
                        setTextContent={setPostText}
                        isPost={true}
                    />
                    {postText.length <= 2000 ? (
                        <p
                            style={{
                                fontSize: "12px",
                            }}
                        >
                            {2000 - postText.length} character
                            {2000 - postText.length !== 1 &&
                                "s"}{" "}
                            remaining
                        </p>
                    ) : (
                        <p style={{ fontSize: "12px", color: "red" }}>
                            You are {postText.length - 2000}{" "}
                            character
                            {postText.length - 2000 !== 1 &&
                                "s"}{" "}
                            above the allowed limit
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
                        disabled={errors.length}
                        type="submit"
                        className="btn-primary"
                    >
                        Submit Edit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditPostModal;
