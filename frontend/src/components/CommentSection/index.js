import { useState } from "react";
import CommentInput from "./CommentInput";
import PostComments from "./PostComments";
import "./commentSection.css";

export default function CommentSection({comments, user, post}) {
    const [sortingBy, setSortingBy] = useState("new");

    function setDivWidth() {
        if (window.visualViewport.width > 700) {
            return "600px"
        }
        else {
            return `${window.visualViewport.width - 20}px`
        }
    }
    return (
    <div>
        <div style={{width: setDivWidth()}} className="subreddit-short-container post-short-container comment-short-container post-full-container box-dec-1">
        {user ? <CommentInput user={user} /> : null}
        {user ? <div style={{borderBottom: "1px solid #EDEFF1", height: "10px"}}></div> : null}
        <PostComments comments={comments} user={user} sortingState={sortingBy} post={post} />
        </div>
    </div>
    )
}
