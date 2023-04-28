import "../NoPostsUserProfile/noPostsUserProfile.css"
import OpenModalButton from "../OpenModalButton";
import CreatePostModal from "../CreatePostModal";
import SignupFormModal from "../SignupFormModal";
export default function NoPostsSubreddit({subreddit, user}) {

    function renderProperModalButton() {
        if (user) {
            return <OpenModalButton
            buttonText="get the discussion started?"
            className="no-posts-subreddit"
            modalComponent={<CreatePostModal
                subreddit={subreddit}
            />}
            ></OpenModalButton>
        }
        else {
            return <OpenModalButton
            className="no-posts-subreddit"
            buttonText="get the discussion started?"
            modalComponent={<SignupFormModal />}>
            </OpenModalButton>
        }
    }

    return <div class="no-posts-section">
    <img src="https://www.redditinc.com/assets/images/galleries/snoo-small.png" alt="No posts yet"></img>
    <h2>Looks like r/{subreddit.name} doesn't have any posts yet!</h2>
    <h2>Maybe you'd like to {renderProperModalButton()}</h2>
  </div>

}
