import SingleComment from "./SingleComment";

export default function PostComments({ comments, user, sortingState, post }) {
    const topLevelComments = Object.values(comments).filter(comment => comment.parent_id === null);
    let sortingFunction;

    if (sortingState === "new") {
        sortingFunction = (a, b) =>
        Date.parse(b.created_at) -
        Date.parse(a.created_at)
    }

    return (
    <>
    <div style={{marginLeft: "-15px", width: "100%"}}>
        {topLevelComments.sort(sortingFunction).map(comment =>
        <SingleComment
          key={comment.id}
          comment={comment}
          user={user}
          post={post}
          sortingFunction={sortingFunction}
          />)}
    </div>
    </>
    )
}
