import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IndividualAbridgedPost from "../AbridgedPostOne";
import { getAllPosts } from "../../store/posts";
import LoadingSpinner from "../LoadingSpinner";
import useInfiniteScrolling from "../../hooks/useInfiniteScrolling";

export default function AllPostsPreview({ user }) {
    const dispatch = useDispatch();
    const page = useInfiniteScrolling();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(getAllPosts(page, 10)).then(() => setIsLoaded(true));
    }, [dispatch, page]);

    const posts = useSelector((state) => state.posts.Posts);


    let items = Object.values(posts);

    return (
        <>
            <div style={{ height: "30px", backgroundColor: "#dae0e6" }}></div>
            <div className="subreddit-short-main-container">
                {isLoaded ? (
                    items
                        .sort(
                            (a, b) =>
                                b.id -
                                a.id
                        )
                        .map((post) => (
                            <IndividualAbridgedPost
                                key={post.id}
                                user={user}
                                post={post}
                            />
                        ))
                ) : (
                    <LoadingSpinner />
                )}
            </div>
        </>
    );
}
