import { useEffect, useState } from "react";

export default function usePopup(timeout = 4900) {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => {
                setShowPopup(false);
            }, timeout);

            return () => clearTimeout(timer);
        }
    }, [showPopup, timeout]);

    return [showPopup, setShowPopup]

}
