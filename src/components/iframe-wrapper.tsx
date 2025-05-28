import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
// @ts-ignore if you're using ?inline loader
import globalsCss from "../globals.css";

export const IframeWrapper = ({ children }: { children: React.ReactNode }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeBody, setIframeBody] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    const onLoad = () => {
      const style = iframeDoc.createElement("style");
      style.innerHTML = globalsCss;
      iframeDoc.head.appendChild(style);

      setIframeBody(iframeDoc.body);
    };

    // For first load
    if (iframeDoc.readyState === "complete") onLoad();
    else iframe.addEventListener("load", onLoad);

    return () => iframe.removeEventListener("load", onLoad);
  }, []);

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
        sandbox="allow-same-origin allow-scripts"
      />
      {iframeBody && ReactDOM.createPortal(children, iframeBody)}
    </>
  );
};
