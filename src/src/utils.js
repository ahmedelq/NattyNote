/* Utils.js -- Provides utilities. 
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

   export async function asyncLoad(element) {
     // dirty way to wait for components to load.
     // TODO: replace with a MutationObserver
   
     let MAX_TRIALS = 10;
     let captured;
     while (!(captured = document.querySelector(element)) && MAX_TRIALS) {
       await new Promise((r) => setTimeout(r, 250));
       MAX_TRIALS--;
     }
   
     return captured;
   }
   
   export function getCurrentURL() {
     return document.URL || document.location.href || window.location.href;
   }
   export function goToEOL(element) {
     const range = document.createRange();
     range.selectNodeContents(element);
     range.collapse(false);
     const selection = window.getSelection();
     selection.removeAllRanges();
     selection.addRange(range);
   }
   
   // TODO : Can be improved!!
   export function matchKey(e, {mods = [], key}) {
     if (!key) {
       return false;
     }
     const activatedModKeys = [`ctrlKey`, `altKey`, `shiftKey`].filter(
       (key) => e?.[key]
     );
     return (
       activatedModKeys.length === mods.length &&
       activatedModKeys.every((key) => mods.includes(key)) &&
       e.code === key
     );
   }
   
   export function formatTime(seconds) {
     let times = new Array(3);
     let base;
     for (let i = 0; i < times.length; i++) {
       base = 60 ** (2 - i);
       times[i] = Math.floor(seconds / base);
       seconds %= base;
     }
     const hrs = times.shift();
     times = times.map((x) => `00${x}`.slice(-2));
     if (hrs) {
       times.unshift(hrs);
     }
     return times.join(`:`);
   }
   
   export function refreshUI() {
     if (userSettings?.cu) {
       Object.keys(userSettings.cu).forEach(key => {
         if (key != "sidebarView" || key != "borderSize"){
           console.log(typeof userSettings.cu[key])
           document.documentElement.style.setProperty(`--${key}`, userSettings.cu[key] == true ? `${userSettings.cu.borderSize}px` : userSettings.cu[key] == false ? 0 : !isNaN(userSettings.cu[key])? `${userSettings.cu[key]}px` : userSettings.cu[key]);
         }
       });
     }
   }