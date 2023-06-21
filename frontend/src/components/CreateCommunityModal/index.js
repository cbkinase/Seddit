import React, { useState, useEffect } from "react";
import { useModal } from "../../context/Modal";
import { createSubreddit } from "../../store/subreddits";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import RichTextEditor from "../CommentSection/RichTextEditor";
import DOMPurify from 'dompurify';

function CreateCommunityModal() {
    const [communityName, setCommunityName] = useState("");
    const [communityCategory, setCommunityCategory] = useState("");
    const [communityDescription, setCommunityDescription] = useState("");
    const [descriptionText, setDescriptionText] = useState("")
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const history = useHistory();

    useEffect(() => {
        let errors = [];
        let badChars = [
            " ",
            "/",
            "#",
            "@",
            "!",
            "%",
            "^",
            "&",
            "*",
            "(",
            ")",
            "=",
            "+",
            "[",
            "]",
            "?",
            ".",
            ",",
            "`",
            "~",
            "-",
            "<",
            ">",
            "\\",
            "|",
            ";",
            ":",
            "{",
            "}",
        ];
        if (descriptionText.length > 2000)
            errors.push("Description must be fewer than 2000 characters");
        if (badChars.some((char) => communityName.includes(char)))
            errors.push("Name must not contain special characters");
        if (!communityName.length) errors.push("Name must be provided");
        if (communityName.length > 21) errors.push("Name must be shorter");

        setErrors(errors);
    }, [communityName, descriptionText]);

    async function handleSubmit(e) {
        e.preventDefault();
        setHasSubmitted(true);

        // setErrors(errors)
        if (errors.length) return;

        let subreddit;

        if (!errors.length) {
            const payload = {
                name: communityName,
                about: DOMPurify.sanitize(communityDescription),
                category: Number(communityCategory),
            };
            subreddit = await dispatch(createSubreddit(payload));
        }

        if (subreddit.errors) {
            setErrors([subreddit.errors]);
            return;
        } else {
            closeModal();
            history.push(`/r/${subreddit.name}`);
        }
    }

    return (
        <div className="modal">
            <div className="modal-header">
                <h2>Create a Community</h2>
                <button onClick={closeModal} className="modal-close-btn">
                    &#215;
                </button>
            </div>
            {errors.map((error, idx) =>
                error === "Name must be provided" && !hasSubmitted ? null : (
                    <li
                        style={{ marginBottom: "15px", color: "red" }}
                        key={idx}
                    >
                        {error}
                    </li>
                )
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label
                        className="create-comm-label"
                        htmlFor="community-name"
                    >
                        Community Name
                    </label>
                    <input
                        className="create-comm-input"
                        type="text"
                        id="community-name"
                        name="community-name"
                        value={communityName}
                        onChange={(event) =>
                            setCommunityName(event.target.value)
                        }
                        required
                    />
                    {communityName.length <= 21 ? (
                        <p style={{ fontSize: "12px", marginTop: "3px" }}>
                            {21 - communityName.length} character
                            {21 - communityName.length !== 1 && "s"} remaining
                        </p>
                    ) : (
                        <p
                            style={{
                                fontSize: "12px",
                                color: "red",
                                marginTop: "3px",
                            }}
                        >
                            You are {communityName.length - 21} character
                            {communityName.length - 21 !== 1 && "s"} above the
                            allowed limit
                        </p>
                    )}
                </div>
                <div className="form-group">
                    <label
                        className="create-comm-label"
                        htmlFor="community-category"
                    >
                        Community Category
                    </label>
                    <select
                        className="create-comm-input"
                        id="community-category"
                        name="community-category"
                        value={communityCategory}
                        onChange={(event) =>
                            setCommunityCategory(event.target.value)
                        }
                    >
                        <option value="">Select a category</option>
                        <option value="1">Art</option>
                        <option value="2">Entertainment</option>
                        <option value="3">Gaming</option>
                        <option value="4">Science</option>
                        <option value="5">Politics</option>
                    </select>
                </div>
                <div className="form-group">
                    <label
                        className="create-comm-label"
                        htmlFor="community-description"
                    >
                        Community Description
                    </label>
                    <textarea
                        className="create-comm-input"
                        id="community-description"
                        name="community-description"
                        value={communityDescription}
                        onChange={(event) =>
                            setCommunityDescription(event.target.value)
                        }
                        rows="8"
                    ></textarea>
                    {descriptionText.length <= 2000 ? (
                        <p style={{ fontSize: "12px" }}>
                            {2000 - descriptionText.length} character
                            {2000 - descriptionText.length !== 1 &&
                                "s"}{" "}
                            remaining
                        </p>
                    ) : (
                        <p style={{ fontSize: "12px", color: "red" }}>
                            You are {descriptionText.length - 2000}{" "}
                            character
                            {descriptionText.length - 2000 !== 1 &&
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
                        Create Community
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateCommunityModal;
