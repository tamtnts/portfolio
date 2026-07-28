import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteScrollManager() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    let frameId;

    const scrollToLocation = () => {
      frameId = window.requestAnimationFrame(() => {
        const encodedTarget = hash.startsWith('#') ? hash.slice(1) : hash;

        if (encodedTarget) {
          let targetId = encodedTarget;

          try {
            targetId = decodeURIComponent(encodedTarget);
          } catch {
            // Keep the literal fragment when it is not valid URI-encoded text.
          }

          const target = document.getElementById(targetId);
          if (target) {
            target.scrollIntoView({ block: 'start' });
            return;
          }
        }

        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });
    };

    if (document.readyState === 'complete') {
      scrollToLocation();
    } else {
      window.addEventListener('load', scrollToLocation, { once: true });
    }

    return () => {
      window.removeEventListener('load', scrollToLocation);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [hash, pathname]);

  return null;
}
