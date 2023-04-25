import React, { useState, useEffect } from "react";
import { useModal } from "../../context/Modal";
import { editSubreddit } from "../../store/subreddits";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

function EditCommunityModal({ subreddit }) {
    const categoryConverter = (str) => {
        switch (str) {
            case "art":
                return 1;
            case "entertainment":
                return 2;
            case "gaming":
                return 3;
            case "science":
                return 4;
            case "politics":
                return 5;
            default:
                return 0;
        }
    };
    const [communityName, setCommunityName] = useState(subreddit.name || "");
    const [communityCategory, setCommunityCategory] = useState(
        categoryConverter(subreddit.category) || ""
    );
    const [communityDescription, setCommunityDescription] = useState(
        subreddit.about || ""
    );
    const [communityPicture, setCommunityPicture] = useState(
        subreddit.main_pic || ""
    );
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const history = useHistory();

    useEffect(() => {
        let errors = [];
        if (communityDescription.length > 2000)
            errors.push("Description must be fewer than 2000 characters");
        // if (communityName.length > 21)
        //     errors.push("Name must be 21 or fewer characters");
        if (!communityName.length) errors.push("Name must be provided");
        if (communityName.length > 21) errors.push("Name must be shorter");

        setErrors(errors);
    }, [communityName, communityDescription]);

    async function handleSubmit(e) {
        e.preventDefault();
        setHasSubmitted(true);

        // setErrors(errors)
        if (errors.length) return;

        let editedSubreddit;

        if (!errors.length) {
            const payload = {
                name: communityName,
                about: communityDescription,
                category: Number(communityCategory),
                main_pic: communityPicture,
            };
            editedSubreddit = await dispatch(
                editSubreddit(payload, subreddit.id)
            );
        }

        if (editedSubreddit.errors) {
            setErrors([editSubreddit.errors]);
            return;
        } else {
            closeModal();
            history.push(`/r/${editedSubreddit.name}`);
        }
    }

    return (
        <div className="modal">
            <div className="modal-header">
                <h2>Customize your Community</h2>
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
                {/* <div className="form-group">
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
                </div> */}
                <div className="form-group">
                    <label
                        className="create-comm-label"
                        htmlFor="community-picture"
                    >
                        Community Picture
                    </label>
                    <input
                        className="create-comm-input"
                        type="text"
                        id="community-picture"
                        name="community-picture"
                        value={communityPicture}
                        onChange={(event) =>
                            setCommunityPicture(event.target.value)
                        }
                    />
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
                    {communityDescription.length <= 2000 ? (
                        <p style={{ fontSize: "12px" }}>
                            {2000 - communityDescription.length} character
                            {2000 - communityDescription.length !== 1 &&
                                "s"}{" "}
                            remaining
                        </p>
                    ) : (
                        <p style={{ fontSize: "12px", color: "red" }}>
                            You are {communityDescription.length - 2000}{" "}
                            character
                            {communityDescription.length - 2000 !== 1 &&
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
                    <button type="submit" className="btn-primary">
                        Edit Community
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditCommunityModal;
