import {
    FacebookIcon,
    FacebookShareButton,
    TwitterIcon,
    TwitterShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    TelegramIcon,
    TelegramShareButton,
    WhatsappIcon,
    WhatsappShareButton,

} from 'react-share';
import { useHref } from 'react-router';

export default function CommentShareModal({ isPost, post }) {
    const shareUrl = shareUrl = `${window.location.protocol}//${window.location.host}/r/${post.subreddit_info.name}/posts/${post.id}`;
    const shareTitle = "Check out Cameron's Website :)";

    return (
        <>

            <div style={{display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "10px"}}>
                <h2 style={{fontWeight: "bold"}}>Share to...</h2>
            </div>

            <div style={{ display: "flex", width: "300px", height: "80px", marginTop: "10px", paddingLeft: "10px", paddingRight: "10px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <FacebookShareButton
                        url={shareUrl}
                        quote={shareTitle}
                    >
                        <FacebookIcon size={50} round />
                    </FacebookShareButton>
                    <span style={{ fontSize: "11px" }}>Facebook</span>
                </div>

                <div style={{ width: "10px" }}></div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <TwitterShareButton
                        url={shareUrl}
                        quote={shareTitle}
                    >
                        <TwitterIcon size={50} round />
                    </TwitterShareButton>
                    <span style={{ fontSize: "11px" }}>Twitter</span>
                </div>

                <div style={{ width: "10px" }}></div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <LinkedinShareButton
                        url={shareUrl}
                        quote={shareTitle}
                    >
                        <LinkedinIcon size={50} round />
                    </LinkedinShareButton>
                    <span style={{ fontSize: "11px" }}>LinkedIn</span>
                </div>

                <div style={{ width: "10px" }}></div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <TelegramShareButton
                        url={shareUrl}
                        quote={shareTitle}
                    >
                        <TelegramIcon size={50} round />
                    </TelegramShareButton>
                    <span style={{ fontSize: "11px" }}>Telegram</span>
                </div>

                <div style={{ width: "10px" }}></div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <WhatsappShareButton
                        url={shareUrl}
                        quote={shareTitle}
                    >
                        <WhatsappIcon size={50} round />
                    </WhatsappShareButton>
                    <span style={{ fontSize: "11px" }}>WhatsApp</span>
                </div>




            </div>
        </>
    )

}
