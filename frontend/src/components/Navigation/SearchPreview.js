import SearchPreviewResult from "./SearchPreviewResult";
import "./SearchPreview.css";
import { useState, useEffect } from "react";
import SearchSeeMore from "./SearchSeeMore";

export default function SearchPreview({ query, closeMenu, setSearchQuery }) {
    const [communities, setCommunities] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {

            if (query.trim() === "") {
                setUsers([]);
                setCommunities([]);
                return;
            }
            const body = {
                search: query,
                include_only: "subreddits,users",
            }
            const res = await fetch("/api/search/?page=1&per_page=5", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            setUsers(data.users);
            setCommunities(data.subreddits);
        }
        fetchData();
    }, [query])

    return (
        <div className="search-preview-container">
            {users.length > 0 || communities.length > 0
                ? <>
                    {communities.length > 0 ? <div style={{paddingLeft: "0px", paddingRight: "0px", marginLeft: "0px", marginRight: "0px"}} id="Subreddits" className="preview-tabcontent">
                        <h3>Communities</h3>
                        {communities.map(subreddit => {
                            return <SearchPreviewResult key={subreddit.id} result={subreddit} type={"Community"} closeMenu={closeMenu} setSearchQuery={setSearchQuery} />
                        })}
                    </div> : null}
                   {users.length > 0 ? <div style={{paddingLeft: "0px", paddingRight: "0px", marginLeft: "0px", marginRight: "0px"}} id="Users" className="preview-tabcontent">
                        <h3>People</h3>
                        {users.map(user => {
                            return <SearchPreviewResult key={user.id} result={user} type={"User"} closeMenu={closeMenu} setSearchQuery={setSearchQuery} />
                        })}
                    </div> : null}
                </>
                :
                <p style={{
                    fontSize: "14px",
                    lineHeight: "18px",
                    padding: "12px 16px",
                    fontWeight: "bold",
                }}>No results found</p>
                }
                {query && <SearchSeeMore closeMenu={closeMenu} searchQuery={query} setSearchQuery={setSearchQuery} />}
        </div>
    )

}
