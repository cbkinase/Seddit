import { useDispatch } from "react-redux";
import { voteOnComment, deleteCommentVote } from "../../store/comments";
import userReactedCheck from "../../utils/hasUserUpvoted";
import { useParams } from "react-router-dom";

export default function VotingSection({ post, comment, user, currentUser, IsUserComments }) {
    const { userName } = useParams();

    if (currentUser) {
        user = currentUser;
    }
    const votingState = userReactedCheck(user, comment);
    const dispatch = useDispatch();

    let upvoteClassnames = "fa fa-arrow-up comment-upvote-button fa-lg";
    let downvoteClassnames = "fa fa-arrow-down fa-lg comment-downvote-button";

    if (votingState?.vote === "upvote") {
        upvoteClassnames += ` has-${votingState?.vote}`;
    }
    if (votingState?.vote === "downvote") {
        downvoteClassnames += ` has-${votingState?.vote}`;
    }

    async function handleUpvote(comment) {
        await dispatch(voteOnComment(comment.id, {"vote": "upvote", "post_id": post.id, IsUserComments}, IsUserComments, userName));
    }

    async function handleDownvote(comment) {
        await dispatch(voteOnComment(comment.id, {"vote": "downvote", "post_id": post.id, IsUserComments: IsUserComments}, IsUserComments, userName));
    }

    async function handleDeleteVote(votingState, comment) {
        await dispatch(deleteCommentVote(post.id, comment.id, votingState?.id, IsUserComments, userName))
    }

    return (
        <div className="comment-voting-section">
            <i
                onClick={(e) => {
                    if (!user) return null;
                    else {
                        votingState?.vote === "upvote"
                        ? handleDeleteVote(votingState, comment)
                        : handleUpvote(comment)
                    }
                }}
                className={upvoteClassnames}
                aria-hidden="true"
            ></i>
            <p style={{paddingLeft: "3px", paddingRight: "3px"}} className={`comment-votes has-${votingState?.vote}`}>
                {comment.upvotes}
            </p>
            <i
                onClick={(e) => {
                    if (!user) return null;
                    else {
                        votingState?.vote === "downvote"
                        ? handleDeleteVote(votingState, comment)
                        : handleDownvote(comment)
                    }
                }}
                className={downvoteClassnames}
                aria-hidden="true"
            ></i>
        </div>
    );
}

// function VotingSection({ comment, user }) {
//     const votingState = userReactedCheck(user, comment);

//     let upvoteClassnames = "fa fa-arrow-up comment-upvote-button fa-lg";
//     let downvoteClassnames = "fa fa-arrow-down fa-lg comment-downvote-button";

//     if (votingState === "upvote") {
//         upvoteClassnames += ` has-${votingState}`;
//     }
//     if (votingState === "downvote") {
//         downvoteClassnames += ` has-${votingState}`;
//     }

//     return (
//         <div className="comment-voting-section">
//             <i
//                 onClick={(e) => alert("Not yet implemented")}
//                 className={upvoteClassnames}
//                 aria-hidden="true"
//             ></i>
//             <p style={{paddingLeft: "3px", paddingRight: "3px"}} className={`comment-votes has-${votingState}`}>
//                 {comment.upvotes}
//             </p>
//             <i
//                 onClick={(e) => alert("Not yet implemented")}
//                 className={downvoteClassnames}
//                 aria-hidden="true"
//             ></i>
//         </div>
//     );
// }
