/* Prompt.js -- Prompt UI. 
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

   import {UIElement} from "./UIElement";
   import userSettings from "./settings";
   import {goToEOL, matchKey} from "./utils";
   import close from "./icons/close.svg";
   
   export default class Prompt extends UIElement {
     constructor() {
       const container = document.createElement(`div`);
       const input = document.createElement(`div`);
       const toolbar = document.createElement(`div`);
       const wrapper = document.createElement(`div`);
       const thumbnail = document.createElement(`img`);
       const closeDiv = document.createElement(`div`);
   
       thumbnail.id = `thumbnail`;
       thumbnail.classList.add(`none`);
   
       closeDiv.id = `closeBtn`;
       closeDiv.innerHTML = close;
   
       toolbar.appendChild(closeDiv);
   
       toolbar.id = `toolbar`;
       container.id = `container`;
       input.id = `input`;
       input.setAttribute(`contenteditable`, ``);
       container.appendChild(toolbar);
       container.appendChild(input);
       container.input = input;
   
       wrapper.id = `wrapper`;
       wrapper.appendChild(container);
       wrapper.appendChild(thumbnail);
       wrapper.input = input;
       wrapper.thumbnail = thumbnail;
   
       const style = [`styles/prompt.css`];
       super(wrapper, style);
   
       closeDiv.addEventListener(`click`, this._escape.bind(this));
       closeDiv.title = `Esc`;
   
       console.log(this.current.input);
   
       this.addEventListners();
       this.hide();
       this.hint = ``;
       this.tooltip = toolbar;
       this.makeDrag();
     }
   
     makeDrag() {
       this.tooltip.onmousedown = function (event) {
         // ref: https://javascript.info/mouse-drag-and-drop
         /*
                                             TODO: improve UX;
                                               1. Bound the box to the current page.
                                               2. Add option to save the state.
                                             */
         const {current} = this;
         const {tooltip} = this;
   
         tooltip.style.cursor = `grabbing`;
         const shiftX = event.clientX - current.getBoundingClientRect().left;
         const shiftY = event.clientY - current.getBoundingClientRect().top;
   
         moveAt(event.pageX, event.pageY);
   
         function moveAt(pageX, pageY) {
           current.style.left = `${pageX - shiftX}px`;
           current.style.top = `${pageY - shiftY}px`;
         }
   
         function onMouseMove(event) {
           moveAt(event.pageX, event.pageY);
         }
   
         document.addEventListener(`mousemove`, onMouseMove);
   
         document.addEventListener(`mouseup`, function F() {
           document.removeEventListener(`mousemove`, onMouseMove);
           document.removeEventListener(`mouseup`, F);
   
           tooltip.style.cursor = `grab`;
         });
       }.bind(this);
   
       this.tooltip.ondragstart = function () {
         return false;
       };
     }
   
     showThumbnail(src) {
       this.current.thumbnail.src = src;
       this.current.thumbnail.classList.remove(`none`);
       this.current.thumbnail.classList.add(`block`);
     }
   
     _clearThumbnail() {
       this.current.thumbnail.src = ``;
       this.current.thumbnail.classList.add(`none`);
       this.current.thumbnail.classList.remove(`block`);
     }
   
     show() {
       super.show();
       setTimeout(() => {
         this.current.input.focus({preventScroll: true});
       }, 0);
     }
   
     hide() {
       this.current.input.blur();
       super.hide();
     }
   
     updateHint(hint) {
       if (
         this.hint instanceof HTMLElement &&
         this.current.input.contains(this.hint)
       ) {
         this.current.input.removeChild(this.hint);
       }
   
       this.hint = hint;
       if (!this.hint) {
         return;
       }
       this.hint = document.createElement(`span`);
       this.hint.appendChild(document.createTextNode(hint));
       this.hint.classList.add(`hint`);
       this.hint.setAttribute(`contenteditable`, `false`);
       this._insertHint();
     }
   
     _insertHint() {
       if (
         !this.current.input.innerText &&
         this.hint &&
         !this.current.input.contains(this.hint)
       ) {
         // if prompt is empty, show hint
         this.current.input.appendChild(this.hint);
         this._goToEOL();
       }
     }
   
     _goToEOL() {
       goToEOL(this.current.input);
     }
   
     _escape() {
       this.current.input.blur();
       this.hide();
       this.current.input.innerHTML = ``;
       document.dispatchEvent(new CustomEvent(`nn-prompt-exit`));
       this._clearThumbnail();
     }
   
     addEventListners() {
       this.current.input.addEventListener(`keydown`, (e) => {
         e.stopPropagation();
   
         if (e.code === `Tab`) {
           e.preventDefault();
         }
   
         if (this.hint && this.current.input.contains(this.hint)) {
           if (e.code === `Backspace`) {
             this.current.input.removeChild(this.hint);
           }
   
           if (e.code === `Tab` || e.code === `Enter`) {
             this.current.input.removeChild(this.hint);
             const el = document.createTextNode(this.hint.innerText);
             this.current.input.appendChild(el);
             this._goToEOL();
           }
         }
   
         if (matchKey(e, userSettings.kybndg.commitNote)) {
           const event = new CustomEvent(`nn-add-note`, {
             bubbles: true,
             detail: {note: this.current.input.innerHTML},
           });
           document.dispatchEvent(event);
           this.current.input.innerHTML = ``;
           this.hide();
           this._clearThumbnail();
         } else if (
           e.code === `Escape` ||
           matchKey(e, userSettings.kybndg.exitPrompt)
         ) {
           this._escape();
         }
       });
   
       this.current.input.addEventListener(`input`, () => {
         this._insertHint();
         if (
           this.hint &&
           this.current.input.contains(this.hint) &&
           this.current.input.childNodes.length > 1
         ) {
           this.current.input.removeChild(this.hint);
         }
       });
     }
   }
   