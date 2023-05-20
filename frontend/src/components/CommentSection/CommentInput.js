import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function CommentInput({ user, isCommentReply, commentContext, setIsReplying }) {

    const [commentContent, setCommentContent] = useState("");

    const styleProps = {width: "100%", display: "flex", flexDirection: "column"}

    if (isCommentReply) {
        styleProps.marginTop = "15px"
    }

    return (
        <>
        <div style={styleProps}>
        {isCommentReply ? null : <p style={{marginBottom: "4px", fontSize: "12px"}}>Comment as <NavLink className="user-commenter-navlink" exact to={`/u/${user.username}`}>{user.username}</NavLink></p>}
        <textarea onChange={
            e => {
                setCommentContent(e.target.value)
            }
        } rows={6} className="root-comment-input" style={{width: "97%", padding: "8px 8px"}} placeholder="What are your thoughts?"></textarea>
        <div style={{alignSelf: "flex-end", marginTop: "5px"}}>
        {isCommentReply ? <button onClick={e => setIsReplying(false)} className="button-leave-mod" style={{alignSelf: "flex-end"}}>Cancel</button> : null}
        <button style={{alignSelf: "flex-end"}} disabled={commentContent.trim().length === 0} className="button-join-mod">
            {isCommentReply ? "Reply" : "Comment"}
            </button>
        </div>
        </div>
        </>
    )
}
