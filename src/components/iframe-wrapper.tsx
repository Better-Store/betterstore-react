import { MotionConfig } from "motion/react";
import React, { useCallback, useLayoutEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
// @ts-ignore
import globalsCss from "../globals.css";

interface IframeWrapperProps {
  children: React.ReactNode;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  wrapperRef: React.RefObject<HTMLDivElement>;
}

export const IframeWrapper: React.FC<IframeWrapperProps> = React.memo(
  ({ children, iframeRef, wrapperRef }) => {
    const styleRef = useRef<HTMLStyleElement | null>(null);
    const rootRef = useRef<ReturnType<typeof ReactDOM.createRoot> | null>(null);

    // inject your global CSS into the iframe’s <head>
    const injectStyles = useCallback((doc: Document) => {
      if (styleRef.current) styleRef.current.remove();
      const styleEl = doc.createElement("style");
      styleEl.textContent = globalsCss;
      doc.head.appendChild(styleEl);
      styleRef.current = styleEl;
    }, []);

    const handleLoad = useCallback(() => {
      const iframe = iframeRef.current!;
      const doc = iframe.contentDocument!;
      injectStyles(doc);

      // create a container for React inside the iframe
      let mountPoint = doc.getElementById("__react_mount__");
      if (!mountPoint) {
        mountPoint = doc.createElement("div");
        mountPoint.id = "__react_mount__";
        doc.body.appendChild(mountPoint);
      }

      // createRoot *once*
      if (!rootRef.current) {
        rootRef.current = ReactDOM.createRoot(mountPoint);
      }

      // render your tree inside the iframe’s React root,
      // wrapped in a MotionConfig so MotionOne binds to the iframe’s window/document
      rootRef.current.render(<MotionConfig>{children}</MotionConfig>);
    }, [children, iframeRef, injectStyles]);

    useLayoutEffect(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      iframe.addEventListener("load", handleLoad);
      // If the iframe is already loaded (cache, SSR, etc.)
      if (iframe.contentDocument?.readyState === "complete") {
        handleLoad();
      }

      return () => {
        iframe.removeEventListener("load", handleLoad);
        // unmount React on teardown
        rootRef.current?.unmount();
        styleRef.current?.remove();
      };
    }, [iframeRef, handleLoad]);

    return (
      <div
        ref={wrapperRef}
        className="w-full max-w-[1200px] min-h-screen mx-auto overflow-y-auto overflow-x-hidden relative"
      >
        <iframe
          ref={iframeRef}
          className="w-full min-h-screen border-0"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
        />
      </div>
    );
  }
);

IframeWrapper.displayName = "IframeWrapper";
