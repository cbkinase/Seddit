import { NavLink, useParams } from "react-router-dom";
import moment from "moment";
// import { useDispatch, useSelector } from "react-redux";
import SubredditHover from "../SubredditHover";
import UserHover from "../UserHover";
import { useEffect, useState } from "react";
// import { getSubreddits } from "../../store/subreddits";
// import { getAllPosts } from "../../store/posts";
// import "./ShortPosts.css";
import OpenModalButton from "../OpenModalButton";
import DeletePostModal from "../DeletePostModal";
import EditPostModal from "../EditPostModal";
import LoadingSpinner from "../LoadingSpinner";
import { getAllPostComments } from "../../store/comments";
import { getSinglePost } from "../../store/posts";
import { useDispatch, useSelector } from "react-redux";
import CommentSection from "../CommentSection";
import CommentShareModal from "../CommentSection/CommentShareModal";
// import userReactedCheck from "../../utils/hasUserUpvoted";
import VotingSection from "../PostVotingSection/VotingSection";
import GenericNotFound from "../NotFound/GenericNotFound";
import timeSince from "../../utils/timeSince";
import useViewportWidth from "../../hooks/useViewportWidth";

// subreddit = use;

export default function IndividualFullPost({ user }) {
    // const dispatch = useDispatch();
    const { subredditName, postId } = useParams();
    const [commentsLoaded, setCommentsLoaded] = useState(false);
    const [mainLoaded, setMainLoaded] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const dispatch = useDispatch();
    const viewportWidth = useViewportWidth();
    const [divWidth, setDivWidth] = useState("100%");

    useEffect(() => {
        if (viewportWidth > 800) {
            setDivWidth(`600px`);
        }
        else {
            setDivWidth(`70vw`);
        }
    }, [viewportWidth])

    useEffect(() => {
        dispatch(getSinglePost(postId))
            .then((res) => {
                if (!res) {
                    setNotFound(true);
                }
            })
        dispatch(getAllPostComments(postId))
            .then(() => setCommentsLoaded(true));
    }, [dispatch, postId])

    const comments = useSelector(state => state.comments.Comments)

    const post = useSelector((state) => state.posts.Posts[postId]);
    const subreddit = post?.subreddit_info


    const shortenWord = (word, long = 20) => {
        if (!word) return null;
        if (word.length <= long) return word;
        return word.slice(0, long) + "...";
    };

    function isUserAuthToEdit(user, post) {
        if (!user) return null;
        return (
            user.id === post.author_info.id ||
            user.id === post.subreddit_info.owner_id
        );
    }

    if (notFound) {
        return <GenericNotFound />
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
                <div className="box-dec-1 subreddit-short-container post-short-container post-full-container">
                    <VotingSection post={post} user={user} />
                    <span className="subreddit-abridged-top post-prev-adjust-right">
                        <span className="subreddit-title-preview">
                            <NavLink
                                className="subreddit-title-nav"
                                to={`/r/${subreddit.name}`}
                                style={{ alignSelf: "revert" }}
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
                                <span className="hide-if-small">• posted by{" "}</span>
                                <NavLink
                                    style={{ margin: "0px 0px" }}
                                    className="card-username-link subreddit-preview"
                                    to={`/u/${post.author_info.username}`}
                                >
                                    <UserHover post={post} />
                                    {shortenWord(post.author_info.username, 10)}
                                </NavLink>{" "}
                                <span className="hide-if-small">{moment(Date.parse(post.created_at)).fromNow()}</span>
                                <span className="hide-if-big">{timeSince(post.created_at)}</span>
                            </span>
                        </span>
                    </span>
                    <div
                        className="subreddit-title-nav post-prev-adjust-right"
                    // to={`/r/${subreddit.name}/posts/${post.id}`}
                    >
                        <h2 className="card-info post-info-small">{post.title}</h2>
                    </div>
                    <div
                        className="subreddit-title-nav"
                        id="post-prev-attachment-container"
                    // to={`/r/${subreddit.name}/posts/${post.id}`}
                    >
                        {post.attachment && <a target="_blank" rel="noreferrer" href={post.attachment}>
                            <img
                                alt="post attachment"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/640px-Image_not_available.png";
                                }}
                                id="post-attachment-image"
                                src={post.attachment}
                            ></img>
                        </a>}
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
                            <div
                                style={{
                                    overflowWrap: "anywhere",
                                    marginBottom: "13px",
                                    marginLeft: "7px",
                                    marginTop: "-5px",
                                    lineHeight: "21px"
                                }}
                            >
                                 <div style={{width: divWidth}} className="dangerous-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                            </div>
                        </div>
                    }
                    {/* <h3 className="card-category">
                {subreddit.category &&
                    capitalizeFirstLetter(subreddit.category)}
            </h3> */}
                    <div className="post-footer-container">
                        <NavLink
                            style={{ marginLeft: "7px" }}
                            to={`/r/${subreddit.name}/posts/${post.id}`}
                            id="post-comment-upvote"
                        >
                            <i
                                // style={{ marginRight: "5px" }}
                                className="fa fa-comment"
                                aria-hidden="true"
                            ></i>
                            {post.num_comments}
                            <span className="hide-if-small"> Comment{post.num_comments !== 1 && "s"}</span>
                        </NavLink>
                        <OpenModalButton hideTextIfSmallScreen={true} renderShareButton={true} modalComponent={<CommentShareModal post={post} />} id="post-comment-upvote" style={{ marginLeft: "7px", border: "none" }} buttonText={"Share"} />
                        {/* <NavLink
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
                        </NavLink> */}
                        {/* {user && (
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
                        )} */}
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
                {commentsLoaded ? <CommentSection comments={comments} user={user} post={post} /> : <LoadingSpinner isShort={true} />}
            </div>
        </div>
    ) : (
        <LoadingSpinner />
    );
}
