import SingleComment from "./SingleComment";

export default function PostComments({ comments, user, sortingState, post }) {
    const topLevelComments = Object.values(comments).filter(comment => comment.parent_id === null);
    return (
    <>
    <div>
        {topLevelComments.map(comment =>
        <SingleComment
          key={comment.id}
          comment={comment}
          user={user}
          post={post}
          />)}
    </div>
    </>
    )
}
