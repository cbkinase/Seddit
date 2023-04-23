import { useModal } from "../../context/Modal"
import "./deleteSubredditModal.css"
import { destroySubreddit } from "../../store/subreddits";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function DeleteSubredditModal({subreddit}) {
    const {closeModal} = useModal();
    const history = useHistory();
    const dispatch = useDispatch();

    return <div id="confirmModal" className="modal-delete">
    <div className="modal-content-delete">
      <h2 className="confirm-del-title">Confirm Deletion</h2>
      <p className="confirm-del-txt">Are you sure you want to delete this subreddit?</p>
      <div className="buttons">
        <button onClick={e => closeModal()} className="one-button" id="cancelBtn">Cancel</button>
        <button onClick={e => {
            dispatch(destroySubreddit(subreddit.id));
            closeModal();
            history.push("/");
        }}  className="one-button" id="confirmBtn">Delete</button>
      </div>
    </div>
  </div>
}
