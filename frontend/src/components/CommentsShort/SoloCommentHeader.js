import "./shortComment.css";
import { NavLink } from "react-router-dom";
import SubredditHover from "../SubredditHover";
import UserHover from "../UserHover";

export default function SoloCommentHeader({ comment }) {
    const shortenWord = (word, long = 20) => {
        if (!word) return null;
        if (word.length <= long) return word;
        return word.slice(0, long) + "...";
    };
    const subredditName = comment.post_info.subreddit_info.name;
    const postAuthorName = comment.post_info.author_info.username;
    const subreddit = comment.post_info.subreddit_info;
    return <div style={{paddingTop: "5px", paddingBottom: "5px", borderBottom: "1px solid rgba(218, 224, 230, 0.65)", width: "100%", marginRight: "10px"}}>
        <i style={{fontSize: "20px", paddingRight: "5px"}} className="far fa-comment"></i>
        <NavLink className="solo-comment-header-author" exact to={`/u/${comment.author_info.username}`}>
            {comment.author_info.username}
        </NavLink>
        {" "}
        <span className="solo-comment-header-misc">commented on {" "}</span>

        <NavLink className="solo-comment-header-post" exact to={`/r/${subredditName}/posts/${comment.post_info.id}`}>
            {shortenWord(comment.post_info.title)}
        </NavLink>

        <span className="solo-comment-header-tiny">{" "}<span style={{paddingLeft: "3px", paddingRight: "3px"}}>•</span>{" "}</span>

        <NavLink
            style={{ margin: "0px 0px", marginLeft: "2px" }}
            className="subreddit-title-nav subreddit-preview"
            to={`/r/${subreddit.name}`}
        >
            <SubredditHover subreddit={subreddit} />
            <h1 className="card-title" style={{fontSize: "12px", paddingRight: "2px"}}>
                r/{shortenWord(subreddit.name, 10)}
            </h1>
        </NavLink>

        <span className="solo-comment-header-tiny">{" "}<span style={{paddingLeft: "3px", paddingRight: "3px"}}>•</span>{" "}</span>

        <span className="solo-comment-header-misc">Posted by{" "}</span>
        <NavLink
            style={{ margin: "0px 0px" }}
            className="card-username-link subreddit-preview solo-comment-header-misc"
            to={`/u/${postAuthorName}`}
        >
            <UserHover post={comment.post_info} />
            u/{shortenWord(postAuthorName, 10)}
        </NavLink>
    </div>
}
