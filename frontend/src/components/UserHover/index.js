import "../SubredditHover/subredditHover.css";

export default function UserHover({ subreddit, post, comment }) {
    let avatar;
    let username;
    let bio;
    let created_at;

    if (subreddit) {
        avatar = subreddit.owner_info.avatar;
        username = subreddit.owner_info.username;
        bio = subreddit.owner_info.bio;
        created_at = subreddit.owner_info.created_at;
    }

    if (post) {
        avatar = post.author_info.avatar;
        username = post.author_info.username;
        bio = post.author_info.bio;
        created_at = post.author_info.created_at;
    }

    if (comment) {
        avatar = comment.author_info.avatar;
        username = comment.author_info.username;
        bio = comment.author_info.bio;
        created_at = comment.author_info.created_at;
    }

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="hover-preview">
            <img
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                        "https://cdn-icons-png.flaticon.com/512/1384/1384051.png";
                }}
                alt="pic"
                src={avatar}
                className="hover-icon"
            ></img>
            <div className="hover-info">
                <h3 style={{ color: "black" }} className="hover-title">
                    {username}
                </h3>
                <div className="hover-stats">
                    <span className="members-count">
                        Member since {formatDate(created_at)}
                    </span>
                </div>
                <p
                    style={{ marginBottom: "10px" }}
                    className="hover-description"
                >
                    {bio}
                </p>
            </div>
            <button style={{ width: "100%" }} className="button-alt">
                View Profile
            </button>
        </div>
    );
}
