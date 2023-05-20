import UserHover from "../UserHover";
import moment from "moment";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import CommentFooter from "./CommentFooter";


export default function SingleComment({ comment, user }) {
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
            return "600px"
        }
        else {
            return `80vw`
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
        <div className="single-comment-container">
            <div>

                <NavLink
                    style={{ margin: "0px 0px" }}
                    className="card-username-link subreddit-preview"
                    to={`/u/${comment.author_info.username}`}
                >
                    <UserHover comment={comment} />
                    <img className="user-avatar-preview" src={comment.author_info.avatar}></img>
                </NavLink>
                <div onClick={
                    e => toggleDisplayState()
                } className="comment-border-link"></div>
            </div>
            <div style={{width: setDivWidth()}} className="single-comment-content-main">
                <div>
                    <p>
                        <NavLink
                            style={{ margin: "0px 0px", fontWeight: "bold", fontSize: "12px" }}
                            className="subreddit-preview comment-author-name-link"
                            to={`/u/${comment.author_info.username}`}
                        >
                        <UserHover comment={comment} />
                        {shortenWord(comment.author_info.username, 20)}
                        </NavLink>
                        <span style={{color: "gray", fontSize: "12px", fontWeight: "normal"}}>{" "}· {moment(Date.parse(comment.created_at)).fromNow()}</span></p>
                </div>
                <div style={{marginTop: "8px"}}>
                    {isDisplaying ? null : <div>&nbsp;</div>}
                    <p className="notosans" style={{display: stateToDisplay()}}>{comment.content}</p>
                    {isDisplaying ? <CommentFooter comment={comment} user={user} /> : null}
                    {/* Display nested comments :) */}
                    {isDisplaying && comment.num_replies ? <div> {Object.values(comment.replies).map(reply => <SingleComment key={reply.id} comment={reply} user={user} />)} </div> : null}
                </div>
            </div>
        </div>
        <div style={{marginTop: "15px"}}></div>
        </>
    )
}
