import "./SearchBar.css";

export default function SearchBar() {
    return (
        // <div className="search-bar">
        //     <input role="search" autocomplete="off" type="text" className="search-input" placeholder="&#128269; Search Reddit" />
        // </div>
        <div className="search-bar-container">
        <form onSubmit={e => e.preventDefault()} action="" method="get">
            <input autoComplete="off" type="text" id="search-input" name="search-input" placeholder="Search Reddit" />
            <button type="submit" id="search-button">
                <i className="fas fa-search clickable-item"></i>
            </button>
        </form>
    </div>
    )
}
