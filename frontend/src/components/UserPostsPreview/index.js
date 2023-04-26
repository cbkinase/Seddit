import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubreddits } from "../../store/subreddits";
import IndividualAbridgedPost from "../AbridgedPostOne";
import { getAllPosts } from "../../store/posts";

export default function UserPostsPreview({ user }) {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(getSubreddits());
        dispatch(getAllPosts());
    }, [dispatch]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const subreddits = useSelector((state) => state.subreddits.Subreddits);
    const posts = useSelector((state) => state.posts.Posts);

    let allPostsArr = Object.values(posts);
    allPostsArr = allPostsArr.filter((post) => post.author_info.id === user.id);

    const filteredPosts = allPostsArr.filter((post) => {
        return post.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <>
            <div style={{ height: "30px", backgroundColor: "#dae0e6" }}></div>
            {/* <div
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
            </div> */}
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
                            subreddit={subreddits[post.subreddit_info.id]}
                        />
                    ))}
            </div>
        </>
    );
}
