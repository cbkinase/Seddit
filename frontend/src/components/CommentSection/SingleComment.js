import UserHover from "../UserHover";
import moment from "moment";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import CommentFooter from "./CommentFooter";
import CommentInput from "./CommentInput";
import SoloCommentHeader from "../CommentsShort/SoloCommentHeader";
import useViewportWidth from "../../hooks/useViewportWidth";

export default function SingleComment({ comment, user, soloComment, post, sortingFunction, IsUserComments }) {
    const [isDisplaying, setIsDisplaying] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const viewportWidth = useViewportWidth();
    const [divWidth, setDivWidth] = useState("100%");

    function toggleDisplayState() {
        setIsDisplaying(!isDisplaying);
    }

    function stateToDisplay() {
        if (isDisplaying) return "inherit"
        else return "none";
    }

    useEffect(() => {
        if (viewportWidth > 800) {
            setDivWidth(`${600 - comment.depth * 23}px`);
        }
        else {
            setDivWidth(`calc(100% - ${comment.depth * 23}px)`)
        }
    }, [viewportWidth])

    const shortenWord = (word, long = 20) => {
        if (!word) return null;
        if (word.length <= long) return word;
        return word.slice(0, long) + "...";
    };
    return (
        <>
        {soloComment ? <SoloCommentHeader comment={comment} /> : null}
        <div style={{height: "10px"}}></div>
        <div style={{marginLeft: "-5px", alignSelf: "flex-start"
        // marginRight: setRightMargin(comment)
        }} className="single-comment-container">
            <div>

                <NavLink
                    style={{ margin: "0px 0px" }}
                    className="card-username-link subreddit-preview"
                    to={`/u/${comment.author_info.username}`}
                >
                    <UserHover comment={comment} />
                    <img alt="user-preview" className="user-avatar-preview" src={comment.author_info.avatar}></img>
                </NavLink>
                <div onClick={
                    e => toggleDisplayState()
                } className="comment-border-link"></div>
            </div>
            <div style={{width: divWidth}} className="single-comment-content-main">
                <div>
                    <span style={{marginLeft: "7px"}}>
                        <NavLink
                            style={{ margin: "0px 0px", fontSize: "12px" }}
                            className="subreddit-preview comment-author-name-link"
                            to={`/u/${comment.author_info.username}`}
                        >
                        <UserHover comment={comment} />
                        <span style={{fontWeight: "bold"}}>{shortenWord(comment.author_info.username, 20)}</span>
                        </NavLink>
                        {comment.author_info.id === post.author_info.id && <span className="OP-indicator">OP</span> }

                        <span style={{color: "gray", fontSize: "12px", fontWeight: "normal"}}>{" "}· {moment(Date.parse(comment.created_at)).fromNow()}</span>
                    </span>
                </div>
                <div style={{marginTop: "8px"}}>
                    {isDisplaying ? null : <div>&nbsp;</div>}
                    {isEditing
                    ? <CommentInput setIsReplying={setIsReplying} isCommentReply={true} user={user} commentContext={comment} post={post} editInProgress={true} setIsEditing={setIsEditing} content={comment.content} />
                    :<span className="notosans" style={{display: stateToDisplay()}}>{comment.content}</span>}
                    {isDisplaying ? <CommentFooter IsUserComments={IsUserComments} soloComment={soloComment} editInProgress={true} isEditing={isEditing} setIsEditing={setIsEditing} isReplying={isReplying} setIsReplying={setIsReplying} comment={comment} post={post} user={user} /> : null}
                    {/* Display nested comments :) */}
                    {isDisplaying && comment.num_replies && !soloComment
                    ? <div>
                      {Object.values(comment.replies).sort(sortingFunction).map(reply =>
                        <SingleComment
                          key={reply.id}
                          comment={reply}
                          user={user}
                          post={post}
                          sortingFunction={sortingFunction}
                          />)}
                    </div>
                    : null}
                </div>
            </div>
        </div>
        <div style={{marginTop: "15px"}}></div>
        </>
    )
}
