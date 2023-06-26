import SubredditDropdownController from "./SubredditDropdownController";
import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createPost } from "../../store/posts";
import "./CreatePost.css";


import RichTextEditor from "../CommentSection/RichTextEditor";
import DOMPurify from 'dompurify';
import "../CreatePostModal/CustomUploadButton.css";
import Popup from "../Popup";
import UploadButton from "../UploadButton/UploadButton";
import usePopup from "../../hooks/usePopup";

export default function CreatePostPage({ user, selectedSubreddit }) {
    const history = useHistory();
    const [subredditName, setSubredditName] = useState("");
    if (!user) history.push("/");

    const subreddit = useSelector(state => state.subreddits.UserSubreddits[subredditName]);



    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const [communityName, setCommunityName] = useState("");
    const [communityPicture, setCommunityPicture] = useState(null);
    const [communityDescription, setCommunityDescription] = useState("");
    const [postText, setPostText] = useState("")
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [showPopup, setShowPopup] = usePopup();
    let nameLengthMax = 300;

    useEffect(() => {
        let errors = [];

        if (postText.length > 2000)
            errors.push("Description must be fewer than 2000 characters");
        if (!communityName.length) errors.push("Title must be provided");
        if (communityName.length > nameLengthMax)
            errors.push("Title must be shorter");

        setErrors(errors);
    }, [communityName, postText, nameLengthMax, communityPicture, subredditName]);

    async function handleSubmit(e) {
        e.preventDefault();
        let newErrors = [];
        if (!subredditName) newErrors.push("Must select a subreddit!");
        setErrors(newErrors);
        setHasSubmitted(true);

        // setErrors(errors)
        if (errors.length || newErrors.length) return;

        let post;

        if (!errors.length) {
            const formData = new FormData();
            if (communityPicture) {
                formData.append("attachment", communityPicture);
                setShowPopup(true);
            }
            if (communityDescription) formData.append("content", DOMPurify.sanitize(communityDescription));
            formData.append("subreddit_id", subreddit.id);
            formData.append("title", communityName);
            post = await dispatch(createPost(formData));
        }

        if (post.errors) {
            setErrors([post.errors]);
            return;
        } else {
            history.push(`/r/${subreddit.name}/posts/${post.id}`);
        }
    }

    function handleFileInputChange(event) {
        event.preventDefault();
        fileInputRef.current.click();
    }

    function handleFileSelect(event) {
        event.preventDefault();
        const file = fileInputRef.current.files[0];
        setCommunityPicture(file);
    }

    return (<div className="create-post-main">
        {showPopup && (
            <Popup textTitle={"File uploading"} textBody={"Upload in progress..."} />
        )}
        <div className="create-post-subcontainer">
            <div>
                <h1 className="create-post-title">Create a post</h1>
            </div>
            <div>
                <SubredditDropdownController
                    user={user}
                    selectedSubreddit={selectedSubreddit}
                    subredditName={subredditName}
                    setSubredditName={setSubredditName} />
            </div>
            {errors.map((error, idx) =>
                error === "Title must be provided" && !hasSubmitted ? null : (
                    <li
                        style={{ marginBottom: "15px", marginTop: "10px", marginLeft: "25px", color: "red" }}
                        key={idx}
                    >
                        {error}
                    </li>
                )
            )}
            <form style={{backgroundColor: "white", borderRadius: "5px", padding: "20px 20px", marginLeft: "25px", marginTop: "7px", display: "flex", flexDirection: "column"}} encType="multipart/form-data" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        className="create-post-input"
                        type="text"
                        style={{fontSize: "14px", paddingLeft: "15px"}}
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

                <div style={{height: "50px"}}></div>

                <div style={{alignSelf: "center"}}>
                    <UploadButton
                        setAttachmentFn={setCommunityPicture}
                        attachment={communityPicture}
                        handleFileInputChange={handleFileInputChange}
                        handleFileSelect={handleFileSelect}
                        fileInputRef={fileInputRef}
                    />
                </div>

                <div style={{height: "50px"}}></div>

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
                <div style={{borderTop: "1px solid #EDEFF1", marginTop: "5px", paddingTop: "15px"}} className="form-actions">
                    <button
                        disabled={errors.length}
                        type="submit"
                        className="btn-primary"
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>
    </div>)
}
