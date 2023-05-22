import React from "react";
import { useModal } from "../../context/Modal";

function OpenModalButton({
    modalComponent, // component to render inside the modal
    buttonText, // text of the button that opens the modal
    onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
    onModalClose, // optional: callback function that will be called once the modal is closed
    className,
    id,
    style,
    renderEditButton,
    renderDeleteButton,
    commentNotLoggedIn,
    renderShareButton,
    renderDeleteButtonWithPadding,
}) {
    const { setModalContent, setOnModalClose } = useModal();

    const onClick = () => {
        if (onModalClose) setOnModalClose(onModalClose);
        setModalContent(modalComponent);
        if (onButtonClick) onButtonClick();
    };

    return (
        <button style={style} id={id} className={className} onClick={onClick}>
            {renderDeleteButton && (
                <i className="fa fa-trash" aria-hidden="true"></i>
            )}

            {renderDeleteButtonWithPadding && (
                <i style={{padding: "6px 6px"}} className="fas fa-trash"></i>
            )}

            {renderEditButton && (
                <i className="fa fa-edit" aria-hidden="true"></i>
            )}
            {renderShareButton && (
                <i
                // style={{ marginRight: "5px" }}
                className="fa fa-share"
                aria-hidden="true"
            ></i>
            )}
            {commentNotLoggedIn ? <>
                <i
        // style={{ marginRight: "5px" }}
        className="fa fa-comments"
        aria-hidden="true"
        ></i>
        <span style={{marginLeft: "5px", color: "grey", fontSize: "14px"}}>Reply</span>
            </> : null}
            {buttonText}
        </button>
    );
}

export default OpenModalButton;
