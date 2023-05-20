import SingleComment from "./SingleComment";
import { useState } from "react";

export default function PostComments({ comments, user, sortingState }) {
    const [commentLevel, setCommentLevel] = useState(0);
    const topLevelComments = Object.values(comments).filter(comment => comment.parent_id === null);
    return (
    <>
    <div>
        {topLevelComments.map(comment =>
        <SingleComment
          commentLevel={commentLevel}
          setCommentLevel={setCommentLevel}
          key={comment.id}
          comment={comment}
          user={user}
          />)}
    </div>
    </>
    )
}
