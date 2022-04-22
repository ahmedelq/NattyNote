/* Deck.js -- Deck note UI. 
   Copyright (C) 2021-2022 Ahmad Alq.
   This file is part of NattyNote.
   NattyNote is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.
   NattyNote is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <https://www.gnu.org/licenses/>.  */

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
        e.stopPropagation();
        if (e.code === `Escape` || matchKey(e, userSettings.kybndg.deckBlur)) {
          this.current.blur();
          player.video.focus();
          player.video.scrollIntoView({ block: `end`, behavior: `smooth` });
        }
      }.bind(this)
    );
  }

  clear() {
    this.current.innerHTML = ``;
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
