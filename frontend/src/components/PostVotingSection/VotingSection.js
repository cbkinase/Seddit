import { useDispatch } from "react-redux";
import { voteOnPost, deletePostVote } from "../../store/posts";
import userReactedCheck from "../../utils/hasUserUpvoted";

export default function VotingSection({ post, user, currentUser }) {
    if (currentUser) {
        user = currentUser;
    }
    const votingState = userReactedCheck(user, post);
    const dispatch = useDispatch();

    let upvoteClassnames = "fa fa-arrow-up upvote-button fa-lg vote-adj-down";
    let downvoteClassnames = "fa fa-arrow-down fa-lg downvote-button vote-adj-down";
    if (votingState?.vote === "upvote") {
        upvoteClassnames += ` has-${votingState?.vote}`;
    }
    if (votingState?.vote === "downvote") {
        downvoteClassnames += ` has-${votingState?.vote}`;
    }

    async function handleUpvote(post) {
        await dispatch(voteOnPost(post.id, {"vote": "upvote"}));
    }

    async function handleDownvote(post) {
        await dispatch(voteOnPost(post.id, {"vote": "downvote"}));
    }

    async function handleDeleteVote(votingState, post) {
        await dispatch(deletePostVote(post.id, votingState?.id))
    }

    return (
        <div className="voting-section card-votes">
            <i
                onClick={(e) => {
                    if (!user) return null;
                    else {
                        votingState?.vote === "upvote"
                        ? handleDeleteVote(votingState, post)
                        : handleUpvote(post)
                    }
                }}
                className={upvoteClassnames}
                aria-hidden="true"
            ></i>
            <p className={`post-votes vote-adj-down has-${votingState?.vote}`}>
                {post.upvotes}
            </p>
            <i
                onClick={(e) => {
                    if (!user) return null;
                    else {
                        votingState?.vote === "downvote"
                        ? handleDeleteVote(votingState, post)
                        : handleDownvote(post)
                    }
                }}
                className={downvoteClassnames}
                aria-hidden="true"
            ></i>
        </div>
    );
}
