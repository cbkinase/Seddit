import { useHistory } from "react-router-dom";

export default function SearchSeeMore({ closeMenu, searchQuery, setSearchQuery }) {
    const history = useHistory();

    const handleClick = (e) => {
        history.push(`/search?q=${searchQuery}`);
        closeMenu();
        setSearchQuery("");
    }
    return (
        <div onClick={handleClick} className="result-container" style={{ display: "flex", flexDirection: "row", width: "100%", alignItems: "center", padding: "8px 0px 8px 16px", marginTop: "5px" }}>
            <div>
                <i style={{ fontSize: "18px", color: "black" }} className="fas fa-search clickable-item"></i>
            </div>
            <div>
                <div>
                    <p style={{
                        fontSize: "14px",
                        padding: "6px 10px",
                    }}>Search for "{searchQuery}"</p>
                </div>
            </div>
        </div>
    );
}
