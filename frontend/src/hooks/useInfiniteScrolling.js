import { useState, useEffect } from "react";

export default function useInfiniteScrolling() {
    const [page, setPage] = useState(1);

    const handleScroll = () => {
        const scrollTop = (document.documentElement
                           && document.documentElement.scrollTop)
                           || document.body.scrollTop;
        const scrollHeight = (document.documentElement
                              && document.documentElement.scrollHeight)
                              || document.body.scrollHeight;

        // Start loading more content when the user is within 0 pixels from the bottom.
        const bottomThreshold = 0;

        if (scrollTop + window.innerHeight + bottomThreshold >= scrollHeight) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return page


}
