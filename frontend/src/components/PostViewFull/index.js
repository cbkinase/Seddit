import { NavLink, useParams } from "react-router-dom";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import SubredditHover from "../SubredditHover";
import UserHover from "../UserHover";
import { useEffect } from "react";
import { getSubreddits } from "../../store/subreddits";
import { getAllPosts } from "../../store/posts";
// import "./ShortPosts.css";
import OpenModalButton from "../OpenModalButton";
import DeletePostModal from "../DeletePostModal";
import EditPostModal from "../EditPostModal";

// subreddit = use;

export default function IndividualFullPost({ user, subreddits, posts }) {
    const dispatch = useDispatch();
    const { subredditName, postId } = useParams();

    function getSubredditFromName(subreddits, subredditName) {
        if (!subreddits.length) return undefined;
        return subreddits.find(
            (subreddit) =>
                subreddit.name.toLowerCase() === subredditName.toLowerCase()
        );
    }

    const subreddit = getSubredditFromName(
        Object.values(subreddits),
        subredditName
    );
    const post = posts[postId];

    const shortenWord = (word, long = 20) => {
        if (!word) return null;
        if (word.length < long) return word;
        return word.slice(0, long) + "...";
    };

    const ellipsisIfLong = (paragraph, long = 20) => {
        if (!paragraph) return null;
        let wordArr = paragraph.split(" ");
        let newStr = "";
        if (wordArr.length > long) {
            for (let i = 0; i < long; i++) {
                newStr += wordArr[i];
                if (i !== long - 1) newStr += " ";
            }

            newStr += "...";
            return newStr;
        }

        if (wordArr.length < long && paragraph.length > 100) {
            return paragraph.slice(0, 100) + "...";
        }
        return paragraph;
    };

    const capitalizeFirstLetter = (word) => {
        return word[0].toUpperCase() + word.slice(1);
    };

    function isUserAuthToEdit(user, post) {
        if (!user) return null;
        return (
            user.id === post.author_info.id ||
            user.id === post.subreddit_info.owner_id
        );
    }

    return post && subreddit ? (
        <div>
            <header className="subreddit-header">
                <NavLink to={`/r/${subreddit.name}`} className="subreddit-logo">
                    <img
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                                "https://i.redd.it/72kquwbkihq91.jpg";
                        }}
                        style={{
                            width: "57px",
                            height: "57px",
                            borderRadius: "50%",
                        }}
                        src={subreddit.main_pic}
                        alt="Logo"
                    />
                    <h1 className="subreddit-name">r/{subreddit.name}</h1>
                </NavLink>
            </header>
            <div className="subreddit-short-main-container">
                <div className="box-dec-1 subreddit-short-container post-short-container">
                    <VotingSection />
                    <span className="subreddit-abridged-top post-prev-adjust-right">
                        <span className="subreddit-title-preview">
                            <NavLink
                                className="subreddit-title-nav"
                                to={`/r/${subreddit.name}`}
                            >
                                <img
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "https://cdn-icons-png.flaticon.com/512/1384/1384051.png";
                                    }}
                                    alt="Pic"
                                    className="subreddit-preview-img"
                                    src={subreddit.main_pic}
                                ></img>
                            </NavLink>
                            <NavLink
                                style={{ margin: "0px 0px", marginLeft: "2px" }}
                                className="subreddit-title-nav subreddit-preview"
                                to={`/r/${subreddit.name}`}
                            >
                                <SubredditHover subreddit={subreddit} />
                                <h1 className="card-title">
                                    r/{shortenWord(subreddit.name, 10)}{" "}
                                </h1>
                            </NavLink>
                            <span className="subreddit-preview-creator">
                                {" "}
                                • posted by{" "}
                                <NavLink
                                    style={{ margin: "0px 0px" }}
                                    className="card-username-link subreddit-preview"
                                    to={`/u/${post.author_info.username}`}
                                >
                                    <UserHover post={post} />
                                    {shortenWord(post.author_info.username, 10)}
                                </NavLink>{" "}
                                {moment(Date.parse(post.created_at)).fromNow()}
                            </span>
                        </span>
                    </span>
                    <div
                        className="subreddit-title-nav post-prev-adjust-right"
                        // to={`/r/${subreddit.name}/posts/${post.id}`}
                    >
                        <h2 className="card-info">{post.title}</h2>
                    </div>
                    <div
                        className="subreddit-title-nav"
                        id="post-prev-attachment-container"
                        // to={`/r/${subreddit.name}/posts/${post.id}`}
                    >
                        <a target="_blank" href={post.attachment}>
                            <img
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";
                            }}
                            id="post-attachment-image"
                            src={post.attachment}
                        ></img>
                        </a>
                    </div>
                    {post.attachment && (
                        <span style={{ marginBottom: "20px" }}></span>
                    )}
                    {
                        <div
                            className="subreddit-title-nav"
                            id="post-prev-attachment-container"
                            // to={`/r/${subreddit.name}/posts/${post.id}`}
                        >
                            <p
                                style={{
                                    overflowWrap: "anywhere",
                                    marginBottom: "13px",
                                    marginLeft: "7px",
                                    marginTop: "-5px",
                                }}
                            >
                                {post.content}
                            </p>
                        </div>
                    }
                    {/* <h3 className="card-category">
                {subreddit.category &&
                    capitalizeFirstLetter(subreddit.category)}
            </h3> */}
                    <div className="post-footer-container">
                        <NavLink
                            style={{ marginLeft: "7px" }}
                            onClick={(e) => {
                                e.preventDefault();
                                alert("Not yet implemented");
                            }}
                            to={`/r/${subreddit.name}/posts/${post.id}`}
                            id="post-comment-upvote"
                        >
                            <i
                                // style={{ marginRight: "5px" }}
                                className="fa fa-comment"
                                aria-hidden="true"
                            ></i>
                            <span>
                                {Math.floor(2 + Math.random() * 10)} Comments
                            </span>
                        </NavLink>
                        <NavLink
                            style={{ marginLeft: "7px" }}
                            onClick={(e) => {
                                e.preventDefault();
                                alert("Not yet implemented");
                            }}
                            to={`/r/${subreddit.name}/posts/${post.id}`}
                            id="post-comment-upvote"
                        >
                            <i
                                // style={{ marginRight: "5px" }}
                                className="fa fa-share"
                                aria-hidden="true"
                            ></i>
                            <span>Share</span>
                        </NavLink>
                        {user && (
                            <NavLink
                                style={{ marginLeft: "7px" }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert("Not yet implemented");
                                }}
                                to={`/r/${subreddit.name}/posts/${post.id}`}
                                id="post-comment-upvote"
                            >
                                <i
                                    // style={{ marginRight: "5px" }}
                                    className="fa fa-bookmark"
                                    aria-hidden="true"
                                ></i>
                                <span>Save</span>
                            </NavLink>
                        )}
                        {isUserAuthToEdit(user, post) && (
                            <OpenModalButton
                                style={{
                                    marginLeft: "7px",
                                    backgroundColor: "inherit",
                                    border: "inherit",
                                    cursor: "pointer",
                                }}
                                id="post-comment-upvote"
                                renderEditButton={true}
                                modalComponent={
                                    <EditPostModal
                                        post={post}
                                        subreddit={subreddit}
                                    />
                                }
                                buttonText="Edit"
                            ></OpenModalButton>
                        )}
                        {isUserAuthToEdit(user, post) && (
                            <OpenModalButton
                                style={{
                                    marginLeft: "7px",
                                    backgroundColor: "inherit",
                                    border: "inherit",
                                    cursor: "pointer",
                                }}
                                id="post-comment-upvote"
                                renderDeleteButton={true}
                                modalComponent={<DeletePostModal post={post} />}
                                buttonText="Delete"
                            ></OpenModalButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <h1>Loading...</h1>
    );
}

function VotingSection() {
    return (
        <div className="voting-section card-votes">
            <i
                onClick={(e) => alert("Not yet implemented")}
                className="fa fa-arrow-up upvote-button fa-lg vote-adj-down"
                aria-hidden="true"
            ></i>
            <p className="post-votes vote-adj-down">
                {Math.floor(2 + Math.random() * 100)}
            </p>
            <i
                onClick={(e) => alert("Not yet implemented")}
                className="fa fa-arrow-down fa-lg downvote-button vote-adj-down"
                aria-hidden="true"
            ></i>
        </div>
    );
}
