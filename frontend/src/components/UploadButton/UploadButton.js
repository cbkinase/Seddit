import ellipsisIfLong from "../../utils/ellipsisIfLong";

export default function UploadButton({
    setAttachmentFn,
    attachment,
    handleFileInputChange,
    handleFileSelect,
    fileInputRef,
    setUpdateState,
}) {
    let fileName = attachment?.name || ellipsisIfLong(attachment, 20, true);

    function handleRemove(e) {
        e.preventDefault();
        setAttachmentFn(null);
        if (setUpdateState) {
            setUpdateState(true);
        }

    }
    return <div className="custom-button-wrapper">
        <div className="form-group">
            <input
                className="custom-file-input"
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
            />
            <button
                onClick={handleFileInputChange}
                className="button-leave adjust-btn-height-subreddit custom-button">
            </button>

            {attachment &&
                <div style={{ fontSize: "12px", marginTop: "2px" }}>
                    Selected File: {fileName}
                    <button
                        onClick={handleRemove} className="remove-attachment-btn">
                        &#215;
                    </button>
                </div>}

            {!attachment &&
                <p style={{ fontSize: "12px", fontStyle: "italic", marginTop: "2px" }}>
                    Optional: attachment
                </p>
            }
        </div>
    </div>
}
