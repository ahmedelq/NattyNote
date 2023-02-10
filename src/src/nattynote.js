/* 
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
   import { getCurrentURL, goToEOL, matchKey, formatTime } from "./utils";
   import player from "./player";
   import Prompt from "./Prompt";
   import { Deck } from "./Deck";
   
   const state = {
     shouldPlayAfterPrompt: false,
     currentURL: null,
     isMainEvtListenerConsumed: true,
     updateURL() {
       this.currentURL = new URL(getCurrentURL());
     },
   };
   
   // JIT placeholder calculator
   const apropos = {
     get VID_URL() {
       return state.currentURL;
     },
     get VID_ID() {
       return (
         this.VID_URL.searchParams.get(`v`) ||
         [...this.VID_URL.pathname.matchAll(/\/embed\/(.+)\/?/g)]?.[0]?.[1]
       );
     },
     TS_RAW: null,
     NOTE: null,
     SCREENSHOT_SRC: null,
     set note(note) {
       this.NOTE = note;
     },
     get NOW() {
       return new Date().toLocaleString();
     },
     get TS_FORMATTED() {
       return this.TS_RAW ? formatTime(this.TS_RAW) : ``;
     },
     get SCREENSHOT_FORMATTED() {
       return this.SCREENSHOT_SRC ? format(userSettings.tmplts.screenshot) : ``;
     },
     get VID_TITLE() {
       return player.title;
     },
     get CH_NAME() {
       return player.channelName;
     },
   
     takeTimestamp() {
       this.TS_RAW = player.currentTime();
     },
     async takeScreenshot() {
       this.SCREENSHOT_SRC = await player.screenshot();
     },
     clear() {
       this.SCREENSHOT_SRC = null;
       this.NOTE = null;
       this.TS_RAW = null;
     },
   };
   
   const prompt = new Prompt();
   const deck = new Deck();
   
   /* Video changed --> cleanup */
   state.observer = new MutationObserver(() => {
     const currentURL = getCurrentURL();
   
     if (currentURL !== state.currentURL?.toString()) {
       console.log(`Video is changing!`);
       deck.sync();
       state.updateURL();
       prompt._escape();
       deck.hide();
       deck.clear();
       init();
     }
   });
   
   state.observer.observe(document, {
     attributes: false,
     childList: true,
     subtree: true,
   });
   
   function handelUIRender() {
     if (!prompt.root.isConnected) {
       prompt.render(document.body);
     }
   
     if (!deck.root.isConnected) {
       if (apropos.VID_URL.pathname.match(/\/embed\/(.+)\/?/g)) {
         deck.render(document.body);
         document.body.style.overflowY = `auto`;
       } else {
         deck.render(userSettings.cu.sidebarView ? document.getElementById("secondary") : document.querySelector(`#page-manager div#info`), userSettings.cu.sidebarView);
       }
     }
   
     deck.show();
   }
   
   async function init() {
     //TODO: replace with a promise-based `local.get` as soon as Firefox supports Manifest V3
     console.log(`Init: called!`);
     await new Promise(function (resolve, reject) {
       if (!getVidId()) {
         reject();
       }
   
       const vidId = getVidId();
       chrome.storage.local.get(vidId, function (store) {
         if (store && store[vidId]) {
           resolve(store[vidId]);
         } else {
           reject();
         }
       });
     })
       .then(async (cachedNote) => {
         document.removeEventListener(`keydown`, firstTime);
         state.isMainEvtListenerConsumed = true;
         await player.initialize();
         deck.metadata = { title: apropos.VID_TITLE, vidId: apropos.VID_ID };
         const savedNotes = strNodesToHTMLNodes(cachedNote?.content);
         makeClickableNodes(savedNotes);
   
         deck.appendChild(savedNotes);
         handelUIRender();
       })
       .catch(() => {
         if (state.isMainEvtListenerConsumed) {
           document.addEventListener(`keydown`, firstTime);
           state.isMainEvtListenerConsumed = false;
         }
       });
   }
   
   async function firstTime(e) {
     if (isProvoked(e)) {
       console.log(`First time: I got provoked`);
       await player.initialize();
       deck.metadata = { title: apropos.VID_TITLE, vidId: apropos.VID_ID };
       const intro = format(userSettings.tmplts.deck);
       deck.appendChild(intro);
       handelUIRender();
       this.removeEventListener(`keydown`, firstTime);
       state.isMainEvtListenerConsumed = true;
     }
   }
   
   document.addEventListener(`yt-navigate-start`, async () => {
     deck.sync();
   });
   
   window.addEventListener(`beforeunload`, () => {
     deck.sync();
   });
   
   // TODO : Can be improved!!
   function isProvoked(e) {
     return (
       getVidId() &&
       (matchKey(e, userSettings.kybndg.promptCont) ||
         matchKey(e, userSettings.kybndg.promptToggle) ||
         matchKey(e, userSettings.kybndg.promptScreenSh) ||
         matchKey(e, userSettings.kybndg.promptToggleScreenSh))
     );
   }
   
   // TODO : Can be improved!!
   async function handelKeyPress(e) {
     console.log(`handelKeyPress: `, e.code);
     if (matchKey(e, userSettings.kybndg.deckFocus)) {
       deck.root.scrollIntoView({ block: `center` });
       setTimeout(() => {
         deck.current.focus();
         goToEOL(deck.current);
         deck._scrollTillEnd();
       }, 0);
     }
   
     if (isProvoked(e)) {
       console.log(`time to wake up`);
       apropos.takeTimestamp();
       if (
         matchKey(e, userSettings.kybndg.promptToggle) ||
         matchKey(e, userSettings.kybndg.promptToggleScreenSh)
       ) {
         player.pause();
         state.shouldPlayAfterPrompt = true;
       }
   
       if (
         matchKey(e, userSettings.kybndg.promptScreenSh) ||
         matchKey(e, userSettings.kybndg.promptToggleScreenSh)
       ) {
         await apropos.takeScreenshot();
         prompt.showThumbnail(apropos.SCREENSHOT_SRC);
       }
   
       prompt.updateHint(player.getCurrentCaption());
       prompt.show();
     }
   }
   
   document.addEventListener(`keydown`, (e) => {
     handelKeyPress(e);
   });
   
   function postCleaning() {
     if (state.shouldPlayAfterPrompt) {
       player.play();
       state.shouldPlayAfterPrompt = false;
     }
     apropos.clear();
     if (player.video) player.video.focus();
   }
   
   // TODO: settings - should clear terminal after exit?
   document.addEventListener(`nn-prompt-exit`, () => {
     postCleaning();
   });
   
   function makeClickableTS(node) {
     console.log(`node`, node, typeof node);
     let VID_TS = node?.dataset?.nnSeek;
     if (!VID_TS) {
       VID_TS = apropos.TS_RAW;
       node.setAttribute(`data-nn-seek`, VID_TS);
     }
     node.addEventListener(`click`, (e) => {
       e.preventDefault();
       player.goTo(VID_TS);
       player.video.focus();
     });
     node.contentEditable = false;
   }
   
   function strNodesToHTMLNodes(stringNode) {
     const concreteTemplate = document.createElement(`template`);
     concreteTemplate.innerHTML = stringNode;
     return concreteTemplate.content.children;
   }
   
   function makeClickableNodes(nodeList) {
     Array.from(nodeList).map((el) => {
       const selector = `[data-nn-seek]`;
       if (el.matches(selector)) makeClickableTS(el);
       else [...el.querySelectorAll(selector)].map(makeClickableTS);
     });
   }
   
   document.addEventListener(`nn-add-note`, (e) => {
     const note = e.detail.note;
     apropos.note = note;
     const template = userSettings.tmplts.note;
     const formattedNote = strNodesToHTMLNodes(format(template));
     makeClickableNodes(formattedNote);
     deck.appendChild(formattedNote);
     postCleaning();
   });
   
   function format(template) {
     let formattedString = template;
     [...template.matchAll(/\(%([A-Z|_]+)%\)/g)].map(
       (el) => (formattedString = formattedString.replace(el[0], apropos[el[1]]))
     );
     return formattedString;
   }
   
   function getVidId() {
     const vidID = state.currentURL;
     return (
       vidID.searchParams.get(`v`) ||
       [...vidID.pathname.matchAll(/\/embed\/(.+)\/?/g)]?.[0]?.[1]
     );
   }
   