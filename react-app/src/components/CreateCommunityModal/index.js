import React, { useState, useEffect } from 'react';
import { useModal } from '../../context/Modal';
import { createSubreddit } from '../../store/subreddits';
import { useDispatch } from 'react-redux';

function CreateCommunityModal() {
  const [communityName, setCommunityName] = useState('');
  const [communityCategory, setCommunityCategory] = useState('');
  const [communityDescription, setCommunityDescription] = useState('');
  const [errors, setErrors] = useState([]);
  const {closeModal} = useModal();
  const dispatch = useDispatch();

  useEffect(() => {
    let errors = [];
    if (communityDescription.length > 2000) errors.push("Description must be fewer than 2000 characters");
    if (communityName.length > 21) errors.push("Name must be 21 or fewer characters");
    if (!communityName.length) errors.push("Name must be provided");

    setErrors(errors)

  }, [communityName, communityDescription])

  async function handleSubmit(e) {
    e.preventDefault();

    // setErrors(errors)
    if (errors.length) return;

    let subreddit

    if (!errors.length) {
        const payload = {name: communityName, about: communityDescription, category: Number(communityCategory)}
        subreddit = await dispatch(createSubreddit(payload))
    }
    console.log(subreddit);
    if (subreddit.errors) {
        setErrors([subreddit.errors]);
        return;

    }
    else {
        closeModal();
    }
  }

  return (
    <div className="modal">
      <div className="modal-header">
        <h2>Create a Community</h2>
        <button onClick={closeModal} className="modal-close-btn">&#215;</button>
      </div>
      {errors.map((error, idx) => <li style={{marginBottom: "15px", color: "red"}} key={idx}>{error}</li>)}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label
          className="create-comm-label" htmlFor="community-name">Community Name</label>
          <input
          className="create-comm-input"
            type="text"
            id="community-name"
            name="community-name"
            value={communityName}
            onChange={(event) => setCommunityName(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label
          className="create-comm-label" htmlFor="community-category">Community Category</label>
          <select
          className="create-comm-input"
            id="community-category"
            name="community-category"
            value={communityCategory}
            onChange={(event) => setCommunityCategory(event.target.value)}
          >
          <option value="">Select a category</option>
          <option value="1">Art</option>
          <option value="2">Entertainment</option>
          <option value="3">Gaming</option>
          <option value="4">Science</option>
          <option value="5">Politics</option>
          </select>
        </div>
        <div className="form-group">
          <label
          className="create-comm-label" htmlFor="community-description">Community Description</label>
          <textarea
          className="create-comm-input"
            id="community-description"
            name="community-description"
            value={communityDescription}
            onChange={(event) => setCommunityDescription(event.target.value)}
            rows="3"
          ></textarea>
        </div>
        <div className="form-actions">
        <button onClick={closeModal} type="button" className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create Community
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCommunityModal;
