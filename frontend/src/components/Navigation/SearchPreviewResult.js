import { useHistory } from "react-router-dom";

export default function SearchPreviewResult({ result, type, closeMenu, setSearchQuery }) {
    const history = useHistory();
    let picSrc;
    let resName;
    let handleClick;
    // let displayNum;
    switch (type) {
        case "User": {
            picSrc = result.avatar;
            resName = `u/${result.username}`;
            handleClick = (e) => {
                history.push(`/${resName}`);
                closeMenu();
                setSearchQuery("");
            }
            // displayNum = result.karma;
            break;
        }
        case "Community": {
            picSrc = result.main_pic;
            resName = `r/${result.name}`;
            handleClick = (e) => {
                history.push(`/${resName}`);
                closeMenu();
                setSearchQuery("");
            }
            // displayNum = result.num_members;
            break;
        }
        default: {}
    }
    return (
        <div onClick={handleClick} className="result-container" style={{display: "flex", flexDirection: "row", width: "100%", alignItems: "center", padding: "2px 0px 2px 16px"}}>
            <div>
                <img height="28px" width="28px" style={{borderRadius: "50%", marginTop: "7px"}} alt="" src={picSrc}></img>
            </div>
            <div>
                <div>
                    <p style={{
                    fontSize: "14px",
                    // lineHeight: "18px",
                    padding: "6px 10px",
                    fontWeight: "bold",
                }}>{resName}</p>
                </div>
                <div>
                    <p style={{
                        fontSize: "12px",
                        // lineHeight: "16px",
                        color: "#7c7c7c",
                        marginLeft: "8px"
                    }}>{type}</p>
                    {/* <span>·</span>
                    <span></span> */}
                </div>
            </div>
        </div>
    );
}
