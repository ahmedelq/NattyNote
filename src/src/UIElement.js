/* UIElement -- . 
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

   import { refreshUI } from "./utils";

   export class UIElement {
     constructor(DOMElement, styles = []) {
       this.current = DOMElement;
       this.root = document.createElement(`div`);
       // this.root.style.setProperty('--background', userSettings?.cu?.backgroundColor);
       this.shadow = this.root.attachShadow({mode: `open`});
       this.shadow.appendChild(this.current);
       styles.unshift(`styles/common.css`);
       styles.map((style) => this.addStyle(style));
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
       refreshUI()
       this.current.classList.remove(`none`);
       this.current.classList.add(`block`);
     }
   
     hide() {
       this.current.blur();
       this.current.classList.remove(`block`);
       this.current.classList.add(`none`);
     }
   
     render(parent = document.body, topappend = Boolean) {
       if (topappend) {
         parent.prepend(this.root);
       }else {
         parent.appendChild(this.root);
       }
     }
   }
   