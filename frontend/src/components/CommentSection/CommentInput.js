import { NavLink } from "react-router-dom";
import { useState } from "react";
import { createComment, editComment } from "../../store/comments";
import { useDispatch } from "react-redux";
import RichTextEditor from "./RichTextEditor";
import DOMPurify from 'dompurify';

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

    const styleProps = { width: "100%", display: "flex", flexDirection: "column" };

    if (isCommentReply) {
        styleProps.marginTop = "15px";
    }

    async function handleSubmit() {
        let payload = {
            content: DOMPurify.sanitize(commentContent),
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

    function handleCancel(e) {
        if (editInProgress) {
            setIsEditing(false);
        }
        setIsReplying(false);
    }

    return (
        <>
            <div style={styleProps}>
                {isCommentReply
                    ? null
                    :
                        <p style={{ marginBottom: "4px", fontSize: "12px" }}>
                            Comment as{" "}
                                <NavLink className="user-commenter-navlink" exact to={`/u/${user.username}`}>
                                    {user.username}
                                </NavLink>
                        </p>}

                <RichTextEditor
                    setTextContent={setTextCommentContent}
                    content={commentContent}
                    setContent={setCommentContent}
                />

                <div style={{ alignSelf: "flex-end", marginTop: "5px", display: "flex" }}>
                    {isCommentReply
                        ? <button
                            onClick={handleCancel}
                            className="button-leave-mod"
                            style={{ alignSelf: "flex-end" }}>
                                Cancel
                            </button>
                        : null}
                    <button
                        onClick={e => handleSubmit()}
                        style={{ alignSelf: "flex-end" }}
                        disabled={textCommentContent.trim().length === 0}
                        className="button-join-mod">
                        {editInProgress
                            ? "Edit"
                            : isCommentReply ? "Reply" : "Comment"}
                    </button>
                </div>
            </div>
        </>
    )
}
