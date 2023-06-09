import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import AbridgedSubredditDisplay from "./components/AbridgedSubredditInfo";
import AllPostsPreview from "./components/AllPostsPreview";
import ContentPolicy from "./components/ContentPolicy";
import UserAgreement from "./components/UserAgreement";
import PrivacyPolicy from "./components/PrivacyPolicy";
import SubredditPage from "./components/SubredditPage";
import UserInfo from "./components/UserInfo";
import IndividualFullPost from "./components/PostViewFull";
import ScrollToTop from "./components/ScrollToTop";
import LoadingSpinner from "./components/LoadingSpinner";
import AboutMe from "./components/AboutMe";
import GenericNotFound from "./components/NotFound/GenericNotFound";
import CreatePostPage from "./components/CreatePostPage";

function App() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        dispatch(authenticate()).then(() => setIsLoaded(true));
    }, [dispatch]);

    const user = useSelector((state) => state.session.user);

    return (
        <>
            <ScrollToTop />
            <Navigation isLoaded={isLoaded} />
            {isLoaded ? (
                <Switch>
                    <Route exact path="/">
                        <AboutMe />
                        <AllPostsPreview user={user} />
                    </Route>
                    <Route exact path="/explore">
                        <AboutMe />
                        <AbridgedSubredditDisplay user={user} />
                    </Route>
                    <Route exact path="/submit">
                        <CreatePostPage user={user} />
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
                    <Route path="/r/:subredditName/posts/:postId">
                        <AboutMe adjustDown={"short"} />
                        <IndividualFullPost user={user} />
                    </Route>
                    <Route path="/r/:subredditName">
                        {/* <AboutMe adjustDown={"far"} /> */}
                        <SubredditPage user={user} />
                    </Route>
                    <Route path="/u/:userName">
                        <UserInfo currentUser={user} />
                    </Route>
                    <Route path="*">
                        <GenericNotFound />
                    </Route>
                </Switch>
            ) : <LoadingSpinner />}
        </>
    );
}

export default App;
