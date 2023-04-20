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
            <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", margin: "20px 20px"}}>
            {Object.values(subreddits).map(subreddit =>
            <div className="box-dec-1" style={{flexBasis: "30%"}}>
            <br></br>
            <img style={{width: "100px", height: "100px"}} src={subreddit.main_pic}></img>
            <h1 style={{fontWeight: "bold", fontSize: "28px"}}>{subreddit.name}</h1>
            <h2>{subreddit.about}</h2>
            <h3>Category: {subreddit.category}</h3>
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
