/* UIElement -- UI base class. 
   Copyright (C) 2021-2023 Ahmad Alq.
   This file is part of NattyNote.
*/

export class UIElement {
  constructor(DOMElement, styles = []) {
    this.current = DOMElement;
    this.root = document.createElement(`div`);
    this.shadow = this.root.attachShadow({ mode: `open` });
    this.shadow.appendChild(this.current);
    styles.unshift(`styles/common.css`);
    styles.map((style) => this.addStyle(style));
    this.preventOtherKbdBindings();
  }

  preventOtherKbdBindings() {
    this.current.addEventListener(`keyup`, (e) => {
      //const whitelist = [`Backspace`, `Delete`, `ArrowLeft`];
      e.stopPropagation();
    });

    this.current.addEventListener(`keydown`, (e) => {
      e.stopPropagation();
    });
  }

  addStyle(relPath) {
    if (!relPath) return;
    const href = chrome.runtime.getURL(relPath);
    const linkEl = document.createElement(`link`);
    linkEl.rel = `stylesheet`;
    linkEl.type = `text/css`;
    linkEl.href = href;
    this.shadow.appendChild(linkEl);
  }

  show() {
    this.current.classList.remove(`none`);
    this.current.classList.add(`block`);
  }

  hide() {
    this.current.blur();
    this.current.classList.remove(`block`);
    this.current.classList.add(`none`);
  }

  render(parent = document.body) {
    parent.appendChild(this.root);
  }
}
