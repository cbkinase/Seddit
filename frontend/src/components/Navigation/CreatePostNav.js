import { useHistory } from "react-router-dom";

export default function CreatePostNav() {
    const history = useHistory();
    const handleClick = (e) => {
        history.push("/submit");
    }
    const plusSvg = <svg stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" viewBox="0 0 17 17" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><g></g><path d="M16 9h-7v7h-1v-7h-7v-1h7v-7h1v7h7v1z"></path></svg>
    return (
    <span onClick={handleClick} className="create-post-nav tooltip">
        <span className="tooltiptext">Create Post</span>
        {plusSvg}
    </span>
    );
}
