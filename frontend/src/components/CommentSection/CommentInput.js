import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function CommentInput({ user }) {

    const [commentContent, setCommentContent] = useState("");

    return (
        <>
        <div style={{width: "100%"}}>
        <p style={{marginBottom: "4px", fontSize: "12px"}}>Comment as <NavLink className="user-commenter-navlink" exact to={`/u/${user.username}`}>{user.username}</NavLink></p>
        <textarea onChange={
            e => {
                setCommentContent(e.target.value)
            }
        } rows={6} style={{width: "100%", padding: "8px 8px"}} placeholder="What are your thoughts?"></textarea>
        <button disabled={commentContent.trim().length === 0} className="button-join-mod">Comment</button>
        </div>
        </>
    )
}
