import React, { useEffect, useState } from 'react';
import './subredditPage.css';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSubreddits } from '../../store/subreddits';

export default function SubredditPage() {
  const { subredditName } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [hasLoaded, setHasLoaded] = useState(false);
  let found = false;

  const handleJoinCommunity = async (subredditId, userId, subredditName) => {
    const res = await fetch(`/api/s/${subredditId}/subscribers`, {
        method: "POST",
    });

    const data = await res.json();
    if (data.success) {
        let btn = document.getElementById(
            `subreddit-${subredditId}-button`
        );
        btn.classList =
            "button-leave adjust-btn-height-subreddit";
        btn.innerText = "Joined";
        btn.onclick = (e) => alert(`Already joined r/${subredditName}!`);
        // btn.onclick = (e) => handleLeaveCommunity(subredditId, userId);
    } else {
        // alert("Please try again momentarily!");
    }
};

const handleLeaveCommunity = async (subredditId, userId, subredditName) => {
    const res = await fetch(`/api/s/${subredditId}/subscribers/${userId}`, {
        method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
        let btn = document.getElementById(
            `subreddit-${subredditId}-button`
        );
        btn.classList =
            "button-join adjust-btn-height-subreddit";
        btn.innerText = "Left Community";
        btn.onclick = (e) => alert(`Already left r/${subredditName}!`);
        // btn.onclick = (e) => handleJoinCommunity(subredditId, userId);
    } else {
        // alert("Please try again momentarily!");
    }
};

  useEffect(() => {
    const loadAndWait = async () => {
        await dispatch(getSubreddits());
        setHasLoaded(true)
    }
    loadAndWait()
  }, [dispatch]);
  const subreddits = useSelector(state => state.subreddits.Subreddits)
  const user = useSelector(state => state.session.user)
  let subreddit = subreddits && Object.values(subreddits).filter(subreddit => subreddit.name.toLowerCase() === subredditName.toLowerCase())[0]

  if (hasLoaded && subreddit) {
    found = true;
  }

  const capitalizeFirstLetter = (word) => {
    return word[0].toUpperCase() + word.slice(1);
};



  return found ?
  <div>
    <div className='subreddit-top-banner'></div>
    <div className='subreddit-title-banner'>
        <div className='subreddit-title'>
            <img className='subreddit-main-pic' src={subreddit.main_pic}></img>
            <h1 className='subreddit-main-name'>
                {capitalizeFirstLetter(subreddit.name)}
            </h1>
            {/* User is not in community already */}
            {user &&
                !Object.keys(subreddit.subscribers).includes(
                    user.id.toString()
                ) && (
                    <button
                        id={`subreddit-${subreddit.id}-button`}
                        onClick={(e) =>
                            handleJoinCommunity(
                                subreddit.id,
                                user.id,
                                subreddit.name
                            )
                        }
                        className="button-join adjust-btn-height-subreddit"
                    >
                        Join Community
                    </button>
                )}
            {/* User is in community already */}
            {user &&
                Object.keys(subreddit.subscribers).includes(
                    user.id.toString()
                ) && (
                    <button
                        onClick={(e) =>
                            handleLeaveCommunity(
                                subreddit.id,
                                user.id,
                                subreddit.name
                            )
                        }
                        // style={{padding: "2px 20px 2px 20px", lineHeight: 1}}
                        id={`subreddit-${subreddit.id}-button`}
                        className="button-leave adjust-btn-height-subreddit"
                    >
                        Joined
                    </button>
                )}

        </div>
        <div>
        <p className='subreddit-name'>
            r/{subreddit.name}
        </p>
        </div>
    </div>

    <div className='subreddit-remaining-info'>

    </div>

  </div>
  : <h1>Sorry, but this Community does not exist. Maybe you'd like to create it?</h1>
  }
