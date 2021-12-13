import { useEffect, useState } from "react";

const useAnimation = (animateTimout) => {
    const [animate, setAnimate] = useState(false);
    useEffect(() => {
        if (animate) {
            setTimeout(() => setAnimate(false), animateTimout);
        }
    }, [animate]);

    return [
        animate,
        () => setAnimate(true)
    ]
}

export default useAnimation;