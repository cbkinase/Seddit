import "./noPostsUserProfile.css"
export default function NoPostsUserProfile({username, isComment}) {
    return <div class="no-posts-section">
    <img src="https://www.redditinc.com/assets/images/galleries/snoo-small.png" alt="No posts yet"></img>
    <h2>Looks like {username} doesn't have any {isComment ? "comments" : "posts"} yet!</h2>
  </div>

}
