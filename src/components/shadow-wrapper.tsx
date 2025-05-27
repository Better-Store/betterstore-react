import { createComponent } from "@lit-labs/react";
import { css, html, LitElement } from "lit";
import React from "react";

class ShadowHost extends LitElement {
  static styles = css``;
  render() {
    return html`<slot></slot>`;
  }
}

customElements.define("shadow-host", ShadowHost);

export const ShadowWrapper = createComponent({
  tagName: "shadow-host",
  elementClass: ShadowHost,
  react: React,
});
