import "./noPostsUserProfile.css"
export default function NoPostsUserProfile({username, isComment, isSaved, isUpvoted, isDownvoted, isOwnProfile}) {
    function renderContent() {
      if (isUpvoted || isDownvoted) {
        return (
          <h2>Posts you {isUpvoted ? "upvote" : "downvote"} will appear here</h2>
        )
      }
      if (isSaved) {
        return <h2> You haven't saved any posts or comments yet</h2>
      }

      if (isOwnProfile) {
        return <h2>Looks like you don't have any {isComment ? "comments" : "posts"} yet!</h2>
      }

      else {
        return <h2>Looks like {username} doesn't have any {isComment ? "comments" : "posts"} yet!</h2>
      }

    }
    return <div className="no-posts-section">
    <img src="https://www.redditinc.com/assets/images/galleries/snoo-small.png" alt="No posts yet"></img>
    { renderContent()}
  </div>

}
