import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import { getSubreddits } from "./store/subreddits";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
    dispatch(getSubreddits())
  }, [dispatch]);

  const subreddits = useSelector(state => state.subreddits.Subreddits)

  const baseImgUrl = "data:image/png;base64, "

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && subreddits && (
        <Switch>
          <Route exact path="/">
            <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", padding: "20px 20px", backgroundColor: "#DAE0E6", marginLeft: "20vw", marginRight: "20vw"}}>
            {Object.values(subreddits).map(subreddit =>
            <div className="box-dec-1" style={{flexGrow: "0.33", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <br></br>
            <img style={{width: "100px", height: "100px"}} src={subreddit.main_pic}></img>
            <h1 style={{fontWeight: "bold", fontSize: "28px", padding: "10px 0px 10px 0px"}}>{subreddit.name}</h1>
            <h2 style={{flexGrow: "1"}}>{subreddit.about}</h2>
            <br></br>
            <h3 style={{alignSelf: "flex-end"}}>Category: {subreddit.category}</h3>
            </div>
            )}
            </div>
          </Route>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
