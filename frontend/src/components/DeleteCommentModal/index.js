import { useModal } from "../../context/Modal";
import { destroyComment } from "../../store/comments";
// import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function DeleteCommentModal({ post, comment }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    return (
        <div id="confirmModal" className="modal-delete">
            <div className="modal-content-delete">
                <h2 className="confirm-del-title">Confirm Deletion</h2>
                <p className="confirm-del-txt">
                    Are you sure you want to delete this comment?
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
                            dispatch(destroyComment(comment.id, post.id));
                            closeModal();
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
