import UserHover from "../UserHover";
import moment from "moment";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import CommentFooter from "./CommentFooter";


export default function SingleComment({ comment, user, soloComment, post, sortingFunction }) {
    const [isDisplaying, setIsDisplaying] = useState(true);

    function toggleDisplayState() {
        setIsDisplaying(!isDisplaying);
    }

    function stateToDisplay() {
        if (isDisplaying) return "inherit"
        else return "none";
    }

    function setDivWidth() {
        if (window.visualViewport.width > 700) {
            return `${600 - comment.depth * 23}px`
        }
        else {
            return `${"100%" - comment.depth * 23}px`
        }
    }

    const shortenWord = (word, long = 20) => {
        if (!word) return null;
        if (word.length <= long) return word;
        return word.slice(0, long) + "...";
    };
    return (
        <>
        <div style={{height: "10px"}}></div>
        <div style={{marginLeft: "-5px",
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
            <div style={{width: setDivWidth()}} className="single-comment-content-main">
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
                    <span className="notosans" style={{display: stateToDisplay()}}>{comment.content}</span>
                    {isDisplaying ? <CommentFooter comment={comment} post={post} user={user} /> : null}
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
