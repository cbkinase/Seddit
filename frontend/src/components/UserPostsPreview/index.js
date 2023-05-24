import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getSubreddits } from "../../store/subreddits";
import IndividualAbridgedPost from "../AbridgedPostOne";
import { getUserPosts } from "../../store/posts";
import LoadingSpinner from "../LoadingSpinner";
// import { getAllPosts } from "../../store/posts";

export default function UserPostsPreview({ user, currentUser }) {
    const [isLoaded, setIsLoaded] = useState(false);
    // console.log(username);
    const dispatch = useDispatch();
    // const dispatch = useDispatch();
    // const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(getUserPosts(user.username)).then(() => setIsLoaded(true))
    }, [dispatch, user]);

    // const handleSearchChange = (e) => {
    //     setSearchTerm(e.target.value);
    // };

    // const subreddits = useSelector((state) => state.subreddits.Subreddits);
    const posts = useSelector((state) => state.posts.Posts);

    // let allPostsArr = Object.values(posts);
    // allPostsArr = allPostsArr.filter((post) => post.author_info.id === user.id);

    // const filteredPosts = allPostsArr.filter((post) => {
    //     return post.title.toLowerCase().includes(searchTerm.toLowerCase());
    // });


    return (
        isLoaded ?
        <>
            <div style={{ height: "10px",
            //  backgroundColor: "#dae0e6"
             }}></div>
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
            {posts && <div className="subreddit-short-main-container">
                {Object.values(posts)
                    .sort(
                        (a, b) =>
                            Date.parse(b.created_at) - Date.parse(a.created_at)
                    )
                    .map((post) => (
                        <IndividualAbridgedPost
                            key={post.id}
                            user={user}
                            currentUser={currentUser}
                            post={post}
                            // subreddit={subreddits[post.subreddit_info.id]}
                        />
                    ))}
            </div>}
        </> : <LoadingSpinner />
    );
}
