import { NavLink } from "react-router-dom";
import { useState } from "react";
import { createComment, editComment } from "../../store/comments";
import { useDispatch } from "react-redux";
import RichTextEditor from "./RichTextEditor";

export default function CommentInput({
    user,
    isCommentReply,
    commentContext,
    post,
    setIsReplying,
    content,
    editInProgress,
    setIsEditing }) {

    const [commentContent, setCommentContent] = useState(content || "");
    const [textCommentContent, setTextCommentContent] = useState("");
    const dispatch = useDispatch();

    const styleProps = {width: "100%", display: "flex", flexDirection: "column"};

    if (isCommentReply) {
        styleProps.marginTop = "15px";
    }

    async function handleSubmit() {
        let payload = {
            content: commentContent,
            post_id: post.id
        }
        // If the comment is a reply, set the parent id
        if (commentContext) {
            payload.parent_id = commentContext.id
        }
        // Handle edit
        if (editInProgress) {
            const data = await dispatch(editComment(payload, commentContext.id))

            if (!data.errors) {
                setIsEditing(false);
            }
            return;
        }
        const data = await dispatch(createComment(payload));
        if (!data.errors) {
            setCommentContent("");
            if (isCommentReply) {
                setIsReplying(false);
            }

        }
    }

    return (
        <>
        <div style={styleProps}>
        {isCommentReply ? null : <p style={{marginBottom: "4px", fontSize: "12px"}}>Comment as <NavLink className="user-commenter-navlink" exact to={`/u/${user.username}`}>{user.username}</NavLink></p>}

        <RichTextEditor setTextContent={setTextCommentContent} content={commentContent} setContent={setCommentContent} />
        {/* <textarea value={commentContent} onChange={
            e => {
                setCommentContent(e.target.value)
            }
        } rows={6} className="root-comment-input" style={{width: "97%", padding: "8px 8px"}} placeholder="What are your thoughts?"></textarea> */}

        <div style={{alignSelf: "flex-end", marginTop: "5px"}}>
        {isCommentReply ? <button onClick={e => {
            if (editInProgress) {
                setIsEditing(false);
            }
            setIsReplying(false);

            }} className="button-leave-mod" style={{alignSelf: "flex-end"}}>Cancel</button> : null}
        <button onClick={e => handleSubmit()} style={{alignSelf: "flex-end"}} disabled={textCommentContent.trim().length === 0} className="button-join-mod">
            {editInProgress
            ? "Edit"
            : isCommentReply ? "Reply" : "Comment"}
            </button>
        </div>
        </div>
        </>
    )
}
