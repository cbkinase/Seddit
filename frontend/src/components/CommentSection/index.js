import CommentInput from "./CommentInput";
import "./commentSection.css"

export default function CommentSection({comments, user}) {
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
        <div style={{width: setDivWidth()}} className="subreddit-short-container post-short-container post-full-container box-dec-1">
        {user ? <CommentInput user={user} /> : null}
        </div>
    </div>
    )
}
