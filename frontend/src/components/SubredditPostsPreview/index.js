import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubreddits } from "../../store/subreddits";
import IndividualAbridgedPost from "../AbridgedPostOne";
import { getSubredditPosts } from "../../store/posts";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";

export default function SubredditPostsPreview({ user, subreddit, subreddits }) {
    const { subredditName } = useParams();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // dispatch(getSubreddits());
        dispatch(getSubredditPosts(subredditName)).then(() => setIsLoaded(true));
    }, [dispatch, subredditName]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // const subreddits = useSelector((state) => state.subreddits.Subreddits);
    const posts = useSelector((state) => state.posts.Posts);

    let allPostsArr = Object.values(posts);

    // allPostsArr = allPostsArr.filter(
    //     (post) => post.subreddit_info.id === subreddit.id
    // );

    const filteredPosts = allPostsArr.filter((post) => {
        return post.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        isLoaded ?
        <>
            <div style={{ height: "30px", backgroundColor: "#dae0e6" }}></div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: "20px",
                    paddingBottom: "20px",
                    backgroundColor: "#dae0e6",
                }}
            >
                <input
                    id="subreddit-search"
                    type="text"
                    placeholder="Search for a post by title"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="subreddit-short-main-container">
                {filteredPosts
                    .sort(
                        (a, b) =>
                            Date.parse(b.created_at) - Date.parse(a.created_at)
                    )
                    .map((post) => (
                        <IndividualAbridgedPost
                            key={post.id}
                            user={user}
                            post={post}
                            subreddit={subreddit}
                        />
                    ))}
            </div>
        </> : <LoadingSpinner />
    );
}
