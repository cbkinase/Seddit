import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IndividualAbridgedPost from "../AbridgedPostOne";
import { getSubredditPosts } from "../../store/posts";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import useInfiniteScrolling from "../../hooks/useInfiniteScrolling";

export default function SubredditPostsPreview({ user, subreddit, subreddits }) {
    const { subredditName } = useParams();
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const page = useInfiniteScrolling();

    useEffect(() => {
        dispatch(getSubredditPosts(subredditName, page, 10)).then(() => setIsLoaded(true));
    }, [dispatch, subredditName, page]);


    const posts = useSelector((state) => state.posts.Posts);

    let allPostsArr = Object.values(posts);

    const filteredPosts = allPostsArr;

    return (
        isLoaded ?
        <>
            <div style={{ height: "30px", backgroundColor: "#dae0e6" }}></div>
            <div className="subreddit-short-main-container">
                {filteredPosts
                    .sort(
                        (a, b) => b.id - a.id
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
