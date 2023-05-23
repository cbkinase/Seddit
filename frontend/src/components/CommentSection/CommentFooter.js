import CommentInput from "./CommentInput";
import { useState } from "react";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import EllipsisDropdown from "./EllipsisDropdown";
import CommentShareModal from "./CommentShareModal";
import DeleteCommentModal from "../DeleteCommentModal";


function toggleExtraCollapsed(setExtraCollapsed, extraCollapsed) {
    setExtraCollapsed(!extraCollapsed);
}

export default function CommentFooter({ comment, user, post, isReplying, setIsReplying, isEditing, setIsEditing }) {

    const [extraCollpased, setExtraCollapsed] = useState(true);

    return (
        <>
        <div style={{display: "flex", marginTop: "5px", marginLeft: "5px"}}>
            <VotingSection comment={comment} user={user} />
            <ReplySection comment={comment} user={user} setIsReplying={setIsReplying} />
            <OpenModalButton modalComponent={<CommentShareModal post={post} />} className="comment-footer-part" style={{padding: "8px 8px", marginLeft: "2px", fontSize: "14px", border: "none"}} buttonText={"Share"} />

            {user?.id === comment.author_info.id ? <ExtraSection setIsEditing={setIsEditing} comment={comment} user={user} extraCollapsed={extraCollpased} setExtraCollapsed={setExtraCollapsed} post={post} /> : null}
        </div>
        {isReplying ? <CommentInput user={user} isCommentReply={true} commentContext={comment} post={post} setIsReplying={setIsReplying} setIsEditing={setIsEditing} /> : null}
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

function ExtraSection({ comment, user, extraCollapsed, setExtraCollapsed, post, setIsEditing }) {
    if (extraCollapsed) {
        return (
            <div onClick={e => toggleExtraCollapsed(setExtraCollapsed, extraCollapsed)} className="comment-footer-part" style={{marginTop: "0px"}}>
                <i style={{padding: "8px 8px", height: "17px"}} className="fas fa-ellipsis-h"></i>
            </div>
        )
    }
    return (

         <>
         <div onClick={e => setIsEditing(true)} className="comment-footer-part" style={{ paddingLeft: "5px", paddingRight: "5px", display: "flex", alignItems: "center"}}>
            <i style={{padding: "6px 6px", height: "17px"}} className="fas fa-edit"></i>
        </div>
        {/* <div className="comment-footer-part" style={{ marginLeft: "5px", paddingLeft: "5px", paddingRight: "5px", display: "flex", alignItems: "center"}}>
            <i style={{padding: "6px 6px"}} className="fas fa-trash"></i>
        </div> */}
        <OpenModalButton
                        style={{
                            border: "inherit",
                            cursor: "pointer",
                        }}
                        className="comment-footer-part"
                        renderDeleteButtonWithPadding={true}
                        modalComponent={<DeleteCommentModal comment={comment} post={post} />}
                        // buttonText="Delete"
                    ></OpenModalButton>
        </>
    )

}
