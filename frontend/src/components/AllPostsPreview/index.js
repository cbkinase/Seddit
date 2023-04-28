import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubreddits } from "../../store/subreddits";
import IndividualAbridgedPost from "../AbridgedPostOne";
import { getAllPosts } from "../../store/posts";
import LoadingSpinner from "../LoadingSpinner";

export default function AllPostsPreview({ user, subreddits }) {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);

    // useEffect(() => {
    //     // dispatch(getSubreddits());
    //     // dispatch(getAllPosts());
    // }, [dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                `/api/posts/?page=${page}&per_page=${10}`
            );
            let data = await response.json();
            data = Object.values(data.Posts);
            setItems((prevItems) => [...prevItems, ...data]);
        };

        fetchData();
    }, [page]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop ===
            document.documentElement.offsetHeight
        ) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // const subreddits = useSelector((state) => state.subreddits.Subreddits);
    // const posts = useSelector((state) => state.posts.Posts);

    // const allPostsArr = Object.values(posts);

    // const filteredPosts = allPostsArr.filter((post) => {
    //     return post.title.toLowerCase().includes(searchTerm.toLowerCase());
    // });

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
                {items.length > 0 && Object.values(subreddits).length > 0 ? (
                    items
                        .sort(
                            (a, b) =>
                                Date.parse(b.created_at) -
                                Date.parse(a.created_at)
                        )
                        .map((post) => (
                            <IndividualAbridgedPost
                                key={post.id}
                                user={user}
                                post={post}
                                subreddit={subreddits[post.subreddit_info.id]}
                            />
                        ))
                ) : (
                    <LoadingSpinner />
                )}
            </div>
        </>
    );
}
