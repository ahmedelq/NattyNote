/* Deck.js -- Deck note UI. 
   Copyright (C) 2021-2023 Ahmad Alq.
   This file is part of NattyNote.
*/

import userSettings from "./settings";
import { UIElement } from "./UIElement";
import player from "./player";
import { matchKey, goToEOL } from "./utils";

export class Deck extends UIElement {
  constructor() {
    const input = document.createElement(`div`);
    input.id = `input`;
    input.setAttribute(`contenteditable`, ``);
    const style = [`styles/deck.css`];
    super(input, style);
    this.addEventListeners();
    this.show();
    this._timeoutID = 0;
    this.metadata = undefined;
  }

  addEventListeners() {
    // caching/saving the Deck's current content
    const observer = new MutationObserver(
      function () {
        if (this._timeoutID) {
          clearTimeout(this._timeoutID);
        }

        this._timeoutID = setTimeout(this.sync.bind(this), 2000);
      }.bind(this)
    );
    observer.observe(this.current, {
      attributes: false,
      childList: true,
      subtree: true,
      characterData: true,
    });

    this.current.addEventListener(
      `keydown`,
      function (e) {
        console.log(`[Deck]: Pressed: `, e);
        if (e.code === `Escape` || matchKey(e, userSettings.kybndg.deckBlur)) {
          this.current.blur();
          player.video.focus();
          player.video.scrollIntoView({ block: `end`, behavior: `smooth` });
        } else if (
          matchKey(e, userSettings.kybndg.copyDeckContentToClipboard)
        ) {
          this.copyContentToClipboard().then(() =>
            this.current.animate(
              {
                opacity: [1, 0.2, 0.2, 1],
              },
              {
                duration: 500,
              }
            )
          );
        }
      }.bind(this)
    );
  }

  clear() {
    this.current.innerHTML = ``;
  }

  async copyContentToClipboard() {
    if (typeof ClipboardItem !== `undefined`) {
      // ClipboardItem is not supported in Firefox
      const clipboarditem = new ClipboardItem({
        "text/html": new Blob([this.current.innerHTML], { type: `text/html` }),
      });
      return navigator.clipboard.write([clipboarditem]);
    } else {
      // if ClipboardItem is not supported, then do it the old way (text only)
      this.current.focus();

      const selection = window.getSelection();
      // save original selection range
      const oldRange = selection.getRangeAt(0).cloneRange();
      const range = document.createRange();
      range.selectNodeContents(this.current);
      selection.removeAllRanges();
      selection.addRange(range);
      const selectedContent = selection.toString();
      selection.removeAllRanges();
      selection.addRange(oldRange);
      return navigator.clipboard.writeText(selectedContent);
    }
  }

  appendChild(child) {
    if (child instanceof HTMLElement) {
      this.current.append(child);
    } else if (child instanceof HTMLCollection) {
      this.current.append(...child);
    } else {
      const p = document.createElement(`p`);
      p.innerHTML = child;
      this.current.appendChild(p);
    }

    this._scrollTillEnd();
  }
  _goToEOL() {
    goToEOL(this.current);
  }
  _scrollTillEnd() {
    this.current.scrollTop = this.current.scrollHeight;
  }

  sync(metadata) {
    this.metadata = metadata ? metadata : this.metadata;
    if (
      this.current?.innerHTML &&
      this.current?.isConnected &&
      this.current?.classList.contains(`block`)
    ) {
      chrome.storage.local.set({
        [this.metadata.vidId]: {
          content: this.current.innerHTML,
          timestamp: Date.now(),
          ...this.metadata,
        },
      });
    }
  }
}
