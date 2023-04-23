import "../SubredditHover/subredditHover.css"

export default function UserHover({ subreddit }) {

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
      }

    return <div className="hover-preview">
    <img alt="pic" src={subreddit.owner_info.avatar} className="hover-icon"></img>
    <div className="hover-info">


      <h3 style={{color: "black"}} className="hover-title">{subreddit.owner_info.username}</h3>
      <div className="hover-stats">
        <span className="members-count">Member since {formatDate(subreddit.owner_info.created_at)}</span>
      </div>
      <p style={{marginBottom: "10px"}} className="hover-description">{subreddit.owner_info.bio}</p>
    </div>
    <button style={{width: "100%"}} className="button-alt">View Profile</button>
  </div>
}
