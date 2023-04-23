import "./subredditHover.css"

export default function SubredditHover({ subreddit }) {

    return <div className="hover-preview">

    <div className="hover-info">
        <div style={{display: "flex", alignItems: "center"}}>
      <img alt="pic" src={subreddit.main_pic} className="hover-icon"></img>
      <h3 className="hover-title">r/{subreddit.name}</h3></div>
      <div className="hover-stats">
        <span className="members-count"><span style={{fontWeight: "bold"}}>{subreddit.numSubscribers}</span> member{subreddit.numSubscribers !== 1 && "s"}</span>
      </div>
      <p style={{marginBottom: "10px"}} className="hover-description">{subreddit.about}</p>
    </div>
    <button style={{width: "100%"}} className="button-join">View Community</button>
  </div>
}
