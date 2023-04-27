import { useModal } from "../../context/Modal";
import { destroyPost } from "../../store/posts";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function DeletePostModal({ post }) {
    const { closeModal } = useModal();
    const history = useHistory();
    const dispatch = useDispatch();

    return (
        <div id="confirmModal" className="modal-delete">
            <div className="modal-content-delete">
                <h2 className="confirm-del-title">Confirm Deletion</h2>
                <p className="confirm-del-txt">
                    Are you sure you want to delete this post?
                </p>
                <div className="buttons">
                    <button
                        onClick={(e) => closeModal()}
                        className="one-button"
                        id="cancelBtn"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={(e) => {
                            dispatch(destroyPost(post.id));
                            closeModal();
                            history.push(`/r/${post.subreddit_info.name}`);
                        }}
                        className="one-button"
                        id="confirmBtn"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
