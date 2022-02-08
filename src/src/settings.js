/* Settings.js -- Loads default and user settings.
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

/* default keyboard bindings */
const kybndg = {
  promptCont: {
    mods: [`altKey`],
    key: `KeyU`,
    printableKey: `U`,
  },
  promptToggle: {
    mods: [`altKey`],
    key: `KeyP`,
    printableKey: `P`,
  },
  promptScreenSh: {
    mods: [`altKey`, `shiftKey`],
    key: `KeyU`,
    printableKey: `U`,
  },
  promptToggleScreenSh: {
    mods: [`altKey`, `shiftKey`],
    key: `KeyP`,
    printableKey: `P`,
  },
  exitPrompt: {
    mods: [],
    key: ``,
    printableKey: ``,
    optional: true,
  },
  deckFocus: {
    mods: [`altKey`],
    key: `KeyK`,
    printableKey: `K`,
  },
  deckBlur: {
    mods: [],
    key: ``,
    printableKey: ``,
    optional: true,
  },
  commitNote: {
    mods: [`altKey`],
    key: `Enter`,
    printableKey: `Enter`,
  },
};

/* Default templates */
const tmplts = {
  note: `<p><a href="https://www.youtube.com/watch?v=(%VID_ID%)&t=(%TS_RAW%)s">(%TS_FORMATTED%)</a> (%NOTE%)</p>(%SCREENSHOT_FORMATTED%)`,
  screenshot: `<img src="(%SCREENSHOT_SRC%)"/>`,
  deck: `(%NOW%) <strong>(%VID_TITLE%)</strong> (%CH_NAME%)`,
};

/* Default screenshot settings */
const ss = {
  automaticDims: true,
  width: 1280,
  height: 720,
  format: `jpeg`,
  quality: 0.75,
};

const userSettings = {};

(function () {
  const keys = [`shortcuts`, ...Object.keys(ss), ...Object.keys(tmplts)];

  chrome.storage.sync.get(keys, (settings) => {
    const getSubset = (obj) =>
      Object.keys(obj).reduce((obj, key) => {
        if (settings?.[key]) obj[key] = settings[key];
        return obj;
      }, {});

    userSettings.kybndg = settings?.shortcuts || kybndg;
    userSettings.tmplts = {
      ...tmplts,
      ...getSubset(tmplts),
    };

    userSettings.ss = {
      ...ss,
      ...getSubset(ss),
    };
  });
})();

export default userSettings;
