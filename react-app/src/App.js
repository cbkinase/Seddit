import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import AbridgedSubredditDisplay from "./components/AbridgedSubredditInfo";
import ContentPolicy from "./components/ContentPolicy";
import UserAgreement from "./components/UserAgreement";
import PrivacyPolicy from "./components/PrivacyPolicy";
import SubredditPage from "./components/SubredditPage";
import UserInfo from "./components/UserInfo";

function App() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        dispatch(authenticate()).then(() => setIsLoaded(true));
    }, [dispatch]);

    const user = useSelector((state) => state.session.user);

    return (
        <>
            <Navigation isLoaded={isLoaded} />
            {isLoaded && (
                <Switch>
                    <Route exact path="/explore">
                        <AbridgedSubredditDisplay user={user} />
                    </Route>
                    <Route path="/login">
                        <LoginFormPage />
                    </Route>
                    <Route path="/signup">
                        <SignupFormPage />
                    </Route>
                    <Route path="/content-policy">
                        <ContentPolicy />
                    </Route>
                    <Route path="/agreement">
                        <UserAgreement />
                    </Route>
                    <Route path="/policy">
                        <PrivacyPolicy />
                    </Route>
                    <Route path="/r/:subredditName">
                        <SubredditPage />
                    </Route>
                    <Route path="/u/:userName">
                        <UserInfo currentUser={user} />
                    </Route>
                </Switch>
            )}
        </>
    );
}

export default App;
