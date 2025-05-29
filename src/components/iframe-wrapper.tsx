import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
// @ts-ignore if you're using ?inline loader
import globalsCss from "../globals.css";

export const IframeWrapper = ({
  children,
  iframeRef,
}: {
  children: React.ReactNode;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  wrapperRef: React.RefObject<HTMLDivElement>;
}) => {
  const [iframeBody, setIframeBody] = useState<HTMLElement | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    const onLoad = () => {
      // Remove previous style if it exists
      if (styleRef.current && styleRef.current.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current);
      }

      // Create and append new style
      const style = iframeDoc.createElement("style");
      style.innerHTML = globalsCss;
      iframeDoc.head.appendChild(style);
      styleRef.current = style;

      setIframeBody(iframeDoc.body);
    };

    // For first load
    if (iframeDoc.readyState === "complete") onLoad();
    else iframe.addEventListener("load", onLoad);

    return () => {
      iframe.removeEventListener("load", onLoad);
      // Cleanup style on unmount
      if (styleRef.current && styleRef.current.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current);
      }
    };
  }, [iframeRef]);

  return (
    <>
      <iframe
        ref={iframeRef}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          minHeight: "100vh",
        }}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
      />
      {iframeBody && ReactDOM.createPortal(children, iframeBody)}
    </>
  );
};
