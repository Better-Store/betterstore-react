import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
// @ts-ignore
import globalsCss from "../globals.css";

export const IframeWrapper = ({
  children,
  iframeRef,
  wrapperRef,
}: {
  children: React.ReactNode;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  wrapperRef: React.RefObject<HTMLDivElement>;
}) => {
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const reactRootRef = useRef<ReturnType<typeof createRoot> | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    const updateHeight = () => {
      const newHeight = iframeDoc.body.scrollHeight + 100;
      iframe.style.height = `${newHeight}px`;
    };

    const onLoad = () => {
      if (styleRef.current?.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current);
      }

      const style = iframeDoc.createElement("style");
      style.innerHTML = globalsCss;
      iframeDoc.head.appendChild(style);
      styleRef.current = style;

      const mountPoint =
        iframeDoc.getElementById("react-mount") ||
        iframeDoc.createElement("div");
      mountPoint.id = "react-mount";
      iframeDoc.body.appendChild(mountPoint);

      // Create React root inside iframe
      if (!reactRootRef.current) {
        reactRootRef.current = createRoot(mountPoint);
      }

      reactRootRef.current.render(children);
      updateHeight();
    };

    if (iframeDoc.readyState === "complete") onLoad();
    else iframe.addEventListener("load", onLoad);

    window.addEventListener("resize", updateHeight);

    return () => {
      iframe.removeEventListener("load", onLoad);
      window.removeEventListener("resize", updateHeight);

      if (styleRef.current?.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current);
      }

      // Safely unmount the root
      if (reactRootRef.current) {
        try {
          reactRootRef.current.unmount();
        } catch (error) {
          console.warn("Error during root unmount:", error);
        }
        reactRootRef.current = null;
      }
    };
  }, [iframeRef, children]);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        minHeight: "100vh",
        maxWidth: "1200px",
        position: "relative",
        overflowX: "hidden",
        marginInline: "auto",
        scrollbarWidth: "none",
        overflowY: "auto",
      }}
    >
      <iframe
        ref={iframeRef}
        style={{
          width: "100%",
          border: "none",
          minHeight: "100vh",
        }}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
      />
    </div>
  );
};
