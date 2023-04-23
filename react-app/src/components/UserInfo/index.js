import "./userInfo.css"
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { useParams, NavLink, useLocation } from "react-router-dom";

export default function UserInfo({currentUser}) {
    const dispatch = useDispatch();
    const {userName} = useParams();
    const [user, setUser] = useState(null);
    const location = useLocation();

    const onUserEnding = (user, ending) => {
        return location.pathname.includes(`/u/${user.username}${ending}`);
    };

    useEffect(() => {
        const fn = async () => {
            let data = await fetch(`/api/users/u/${userName}`);
            let user = await data.json();
            setUser(user);
        }
        fn();

    }, [dispatch])
    // The whole currentUser.id === user.id business is to ensure the component gets re-rendered when a user edits their own profile
    return  user && <div className="user-page">
    <div className="header">
      <div className="avatar">
        <img src={currentUser.id === user.id ? currentUser.avatar : user.avatar} alt="Avatar"></img>
      </div>
      <div className="user-info">
        <h1 className="username">{currentUser.id === user.id ? currentUser.username : user.username}</h1>
        <div className="stats">
          <div className="stat-item">
            <span className="count">500</span>
            <span className="label">Karma</span>
          </div>
          <div className="stat-item">
            <span className="count">100</span>
            <span className="label">Posts</span>
          </div>
          <div className="stat-item">
            <span className="count">50</span>
            <span className="label">Comments</span>
          </div>
        </div>
        <div className="bio">
          <p>{currentUser.id === user.id ? currentUser.bio : user.bio}</p>
        </div>
      </div>
    </div>
    <div className="content">
      <div className="tabs">
        <ul>
          <li className={onUserEnding(user, "/posts") || location.pathname.toLowerCase() == `/u/${user.username.toLowerCase()}` ? "active" : ""} ><NavLink to={`/u/${user.username}/posts`}>Posts</NavLink></li>
          <li className={onUserEnding(user, "/comments") ? "active" : ""}><NavLink to={`/u/${user.username}/comments`}>Comments</NavLink></li>
        </ul>
      </div>
      <div className="post-list">
        <div className="post">
          <div className="post-info">
            <a href="#">r/example</a>
            <span className="dot"></span>
            <span className="date">Posted 2 hours ago</span>
          </div>
          <h2 className="post-title"><a href="#">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</a></h2>
          <div className="post-preview">
            <p>Sed venenatis lectus vel tellus iaculis consectetur. Sed accumsan, mauris vel ullamcorper lobortis, massa ipsum egestas diam, vitae ultricies lorem odio sed nulla.</p>
          </div>
          <div className="post-footer">
            <a href="#">123 upvotes</a>
            <span className="dot"></span>
            <a href="#">25 comments</a>
          </div>
        </div>
        <div className="post">
          <div className="post-info">
            <a href="#">r/example</a>
            <span className="dot"></span>
            <span className="date">Posted 3 hours ago</span>
          </div>
          <h2 className="post-title"><a href="#">Nullam semper lacus eget magna tempus, nec venenatis risus dapibus.</a></h2>
          <div className="post-preview">
            <p>Pellentesque ac sapien non quam congue ultricies. Duis faucibus nulla non velit tincidunt, at cursus sapien cursus.</p>
          </div>
          <div className="post-footer">
            <a href="#">321 upvotes</a>
            <span className="dot"></span>
            <a href="#">50 comments</a>
          </div>
        </div>
      </div>
    </div>
  </div>

}
