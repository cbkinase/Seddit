import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IndividualAbridgedPost from "../AbridgedPostOne";
import { getUserPosts } from "../../store/posts";
import LoadingSpinner from "../LoadingSpinner";
import useInfiniteScrolling from "../../hooks/useInfiniteScrolling";

export default function UserPostsPreview({ user, currentUser }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const page = useInfiniteScrolling();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserPosts(user.username, page, 5)).then(() => setIsLoaded(true))
    }, [dispatch, user, page]);

    const posts = useSelector((state) => state.posts.Posts);

    return (
        isLoaded ?
        <>
            <div style={{ height: "10px",
             }}></div>
            {posts && <div className="subreddit-short-main-container">
                {Object.values(posts)
                    .sort(
                        (a, b) =>
                            b.id - a.id
                    )
                    .map((post) => (
                        <IndividualAbridgedPost
                            key={post.id}
                            user={user}
                            currentUser={currentUser}
                            post={post}
                        />
                    ))}
            </div>}
        </> : <LoadingSpinner />
    );
}
