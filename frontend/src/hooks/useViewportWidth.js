import { useEffect, useState } from 'react';

export default function useViewportWidth() {
    const [viewportWidth, setViewportWidth] = useState(window.visualViewport.width);

    useEffect(() => {
        function handleResize() {
            setViewportWidth(window.visualViewport.width);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return viewportWidth;
}
