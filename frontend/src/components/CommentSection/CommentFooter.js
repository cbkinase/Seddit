import CommentInput from "./CommentInput";
import { useState } from "react";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import EllipsisDropdown from "./EllipsisDropdown";
import CommentShareModal from "./CommentShareModal";


function toggleExtraCollapsed(setExtraCollapsed, extraCollapsed) {
    setExtraCollapsed(!extraCollapsed);
}

export default function CommentFooter({ comment, user, post }) {
    const [isReplying, setIsReplying] = useState(false);
    const [extraCollpased, setExtraCollapsed] = useState(true);

    return (
        <>
        <div style={{display: "flex", marginTop: "5px", marginLeft: "5px"}}>
            <VotingSection comment={comment} user={user} />
            <ReplySection comment={comment} user={user} setIsReplying={setIsReplying} />
            <OpenModalButton modalComponent={<CommentShareModal />} className="comment-footer-part" style={{padding: "8px 8px", marginLeft: "2px", fontSize: "14px", border: "none"}} buttonText={"Share"} />

            {/* {user.id === comment.author_info.id ? <ExtraSection comment={comment} user={user} extraCollapsed={extraCollpased} setExtraCollapsed={setExtraCollapsed} /> : null} */}
        </div>
        {isReplying ? <CommentInput user={user} isCommentReply={true} commentContext={comment} post={post} setIsReplying={setIsReplying} /> : null}
        </>
    )
}

function VotingSection({ comment, user }) {
    return (
        <div className="comment-voting-section">
            <i
                onClick={(e) => alert("Not yet implemented")}
                className="fa fa-arrow-up comment-upvote-button fa-lg "
                aria-hidden="true"
            ></i>
            <p className="comment-votes">
                {Math.floor(2 + Math.random() * 100)}
            </p>
            <i
                onClick={(e) => alert("Not yet implemented")}
                className="fa fa-arrow-down fa-lg comment-downvote-button"
                aria-hidden="true"
            ></i>
        </div>
    );
}

function ReplySection({ comment, setIsReplying, user }) {
    if (!user) {
        return (
            <>
            <OpenModalButton modalComponent={<LoginFormModal fromComment={true} />} className="comment-footer-part" commentNotLoggedIn={true} style={{ marginLeft: "5px", paddingLeft: "5px", paddingRight: "5px", border: "none"}}>
        </OpenModalButton>
            </>
        )
    }
    return (
        <>
        <div onClick={e => {
            setIsReplying(true);
            }} className="comment-footer-part" style={{paddingTop: "6px", marginLeft: "5px", paddingLeft: "5px", paddingRight: "5px"}}>
        <i
        // style={{ marginRight: "5px" }}
        className="fa fa-comments"
        aria-hidden="true"
        ></i>
        <span style={{marginLeft: "5px", color: "grey", fontSize: "14px"}}>Reply</span>
        </div>
        </>
    )
}

function ExtraSection({ comment, user, extraCollapsed, setExtraCollapsed }) {
    if (extraCollapsed) {
        return (
            <div onClick={e => toggleExtraCollapsed(setExtraCollapsed, extraCollapsed)} className="comment-footer-part" style={{marginTop: "3px"}}>
                <i style={{padding: "6px 6px"}} className="fas fa-ellipsis-h"></i>
            </div>
        )
    }
    return (

         <>
         <div className="comment-footer-part" style={{ marginLeft: "5px", paddingLeft: "5px", paddingRight: "5px", display: "flex", alignItems: "center"}}>
            <i style={{padding: "6px 6px"}} className="fas fa-edit"></i>
            {/* <span style={{ color: "grey", fontSize: "14px"}}>Edit</span> */}
        </div>
        <div className="comment-footer-part" style={{ marginLeft: "5px", paddingLeft: "5px", paddingRight: "5px", display: "flex", alignItems: "center"}}>
            <i style={{padding: "6px 6px"}} className="fas fa-trash"></i>
            {/* <span style={{ color: "grey", fontSize: "14px"}}>Delete</span> */}
        </div>
        </>
    )

}
