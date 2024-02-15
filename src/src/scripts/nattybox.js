/* nattybox.js -- . 
   Copyright (C) 2021-2023 Ahmad Alq.
   This file is part of NattyNote.
*/

const shortcutsMetadata = {
  promptCont: {
    label: `Prompt`,
    description: `Shows the note prompt without toggling the player.`,
    mods: [`altKey`],
    key: `KeyU`,
    printableKey: `U`,
  },
  promptToggle: {
    label: `Prompt+toggle`,
    description: `Shows the note prompt and toggles the player; stops it if it is playing and starts it if it is stopped.`,
    mods: [`altKey`],
    key: `KeyP`,
    printableKey: `P`,
  },
  promptScreenSh: {
    label: `Prompt+Screenshot`,
    description: `Same as Prompt but takes a screenshot of the current video frame.`,
    mods: [`altKey`, `shiftKey`],
    key: `KeyU`,
    printableKey: `U`,
  },
  promptToggleScreenSh: {
    label: `Prompt+Toggle+Screenshot`,
    description: `Same as Prompt+Toggle, but takes a screenshot of the current video frame.`,
    mods: [`altKey`, `shiftKey`],
    key: `KeyP`,
    printableKey: `P`,
  },
  exitPrompt: {
    label: `Close prompt`,
    description: `Close the prompt, discarding current note. Optional since it can always be called by \`Escape\`.`,
    mods: [],
    key: ``,
    printableKey: ``,
    optional: true,
  },
  deckFocus: {
    label: `Deck focus`,
    description: `Focus on the notes deck.`,
    mods: [`altKey`],
    key: `KeyK`,
    printableKey: `K`,
  },
  deckBlur: {
    label: `Deck blur`,
    description: `Removes focus from the notes deck and places it at the video player. It's optional since it can always be called by \`Escape\``,
    mods: [],
    key: ``,
    printableKey: ``,
    optional: true,
  },
};
console.log(shortcutsMetadata);
const defaultShortcuts = {
  promptCont: {
    label: `Prompt`,
    description: `Shows the note prompt without toggling the player.`,
    mods: [`altKey`],
    key: `KeyU`,
    printableKey: `U`,
  },
  promptToggle: {
    label: `Prompt+toggle`,
    description: `Shows the note prompt and toggles the player; stops it if it is playing and starts it if it is stopped.`,
    mods: [`altKey`],
    key: `KeyP`,
    printableKey: `P`,
  },
  commitNote: {
    label: `Commit note`,
    description: `Inserts the written note in the prompt into the deck`,
    mods: [`altKey`],
    key: `Enter`,
    printableKey: `Enter`,
  },
  promptScreenSh: {
    label: `Prompt+Screenshot`,
    description: `Same as Prompt but takes a screenshot of the current video frame.`,
    mods: [`altKey`, `shiftKey`],
    key: `KeyU`,
    printableKey: `U`,
  },
  promptToggleScreenSh: {
    label: `Prompt+Toggle+Screenshot`,
    description: `Same as Prompt+Toggle, but takes a screenshot of the current video frame.`,
    mods: [`altKey`, `shiftKey`],
    key: `KeyP`,
    printableKey: `P`,
  },
  exitPrompt: {
    label: `Close prompt`,
    description: `Close the prompt, discarding current note. Optional since it can always be called by \`Escape\`.`,
    mods: [],
    key: ``,
    printableKey: ``,
    optional: true,
  },
  deckFocus: {
    label: `Deck focus`,
    description: `Focus on the notes deck.`,
    mods: [`altKey`],
    key: `KeyK`,
    printableKey: `K`,
  },
  deckBlur: {
    label: `Deck blur`,
    description: `Removes focus from the notes deck and places it at the video player. It's optional since it can always be called by \`Escape\``,
    mods: [`altKey`],
    key: `KeyK`,
    printableKey: `K`,
    optional: true,
  },
  copyDeckContentToClipboard: {
    label: `Copy deck`,
    description: `Copies the entire deck to clipboard in html format (plaintext in Firefox)`,
    mods: [`altKey`],
    key: `KeyC`,
    printableKey: `C`,
  },
};

const templates = {
  note: `<p><a href="https://www.youtube.com/watch?v=(%VID_ID%)&t=(%TS_RAW%)s">(%TS_FORMATTED%)</a>(%NOTE%)</p>(%SCREENSHOT_FORMATTED%)`,
  screenshot: `<img src="(%SCREENSHOT_SRC%)"/>`,
  deck: `(%NOW%) <strong>(%VID_TITLE%)</strong> (%CH_NAME%)`,
};

const screenshotDefaults = {
  automaticDims: true,
  width: 1280,
  height: 720,
  format: `jpeg`,
  quality: 0.75,
};

const templateDescription = {
  note: {
    label: `Note template`,
    description: `When a note written in the prompt is committed, it will be formatted using this template before being inserted into the deck.`,
  },
  screenshot: {
    label: `Screenshot template`,
    description: `Specifies how a screenshot (if any) should be displayed. Used by SCREENSHOT_FORMATTED`,
  },
  deck: {
    label: `Deck initialization template`,
    description: `This template is inserted upon the first initialization of the deck.`,
  },
};

let userShortcuts = defaultShortcuts;
const userTemplates = templates;
const userScreenshot = screenshotDefaults;
const templateEls = [];
const screenShotEls = {
  automaticDims: { id: `screenshotUseDefaults` },
  width: { id: `screenshotWidth` },
  height: { id: `screenshotHeight` },
  format: { id: `screenshotFileType` },
  quality: { id: `screenshotQuality` },
};
const modifiedShortcuts = {};

// Temporary function until Firefox support manifest V3.
const load = async (keys) =>
  new Promise((res) => chrome.storage.sync.get(keys, (vals) => res(vals)));

function blurTextarea() {
  // Overcome issues related to `change` evt listener in chrome.

  templateEls.map((el) => el.blur());
}

window.onunload = blurTextarea;
window.onblur = blurTextarea;
window.addEventListener(`pagehide`, blurTextarea);

function initTemplates() {
  const templatesEl = document.getElementById(`templates`);

  for (const template in templates) {
    const div = document.createElement(`div`);
    const textarea = document.createElement(`textarea`);
    const label = document.createElement(`label`);
    textarea.innerText = userTemplates[template];
    textarea.id = template;
    textarea.spellcheck = false;
    label.for = template;
    label.classList.add(`help`);
    label.innerText = templateDescription[template].label || ``;
    label.title = templateDescription[template].description || ``;
    textarea.addEventListener(`change`, function () {
      chrome.storage.sync.set({ [template]: this.value });
    });
    div.appendChild(label);
    div.appendChild(textarea);
    templateEls.push(textarea);
    templatesEl.appendChild(div);
  }
}

function initScreenshotSettings() {
  Object.keys(screenShotEls).map((key) => {
    screenShotEls[key].el = document.getElementById(screenShotEls[key].id);
  });

  screenShotEls.automaticDims.el.checked = screenshotDefaults.automaticDims;
  screenShotEls.width.el.disabled = screenshotDefaults.automaticDims;
  screenShotEls.height.el.disabled = screenshotDefaults.automaticDims;
  screenShotEls.quality.el.disabled = screenshotDefaults.format === `png`;

  screenShotEls.automaticDims.el.addEventListener(`change`, function () {
    screenShotEls.width.el.disabled = this.checked;
    screenShotEls.height.el.disabled = this.checked;
  });

  screenShotEls.format.el.addEventListener(`change`, function () {
    screenShotEls.quality.el.disabled = this.value === `png`;
  });

  Object.keys(screenShotEls).map((key) => {
    const { el } = screenShotEls[key];
    if (el.type === `checkbox`) {
      el.checked = screenshotDefaults[key];
      el.addEventListener(`change`, function () {
        chrome.storage.sync.set({ [key]: this.checked }, () =>
          console.log(`setting ${key}:${this.checked}`)
        );
      });
    } else {
      el.value = screenshotDefaults[key];
      el.addEventListener(`change`, function () {
        chrome.storage.sync.set({ [key]: this.value });
      });
    }
  });
}

async function loadUserSettings() {
  const allSavedSettings =
    (await load([
      `shortcuts`,
      ...Object.keys(userScreenshot),
      ...Object.keys(userTemplates),
    ])) || {};

  console.log(allSavedSettings);
  const updateMyProps = (obj) =>
    Object.keys(obj).map(
      (key) =>
        (obj[key] =
          typeof allSavedSettings[key] === `undefined`
            ? obj[key]
            : allSavedSettings[key])
    );
  updateMyProps(userScreenshot);
  updateMyProps(userTemplates);
}

window.onload = async () => {
  await loadUserSettings();
  let loadedShortcuts = (await load(`shortcuts`))?.shortcuts || {};

  initTemplates();
  initScreenshotSettings();
  userShortcuts = { ...userShortcuts, ...loadedShortcuts };
  const shortcutsContainer = document.getElementById(`shortcuts`);
  for (const shortcut in userShortcuts) {
    const div = document.createElement(`div`);
    const label = document.createElement(`label`);
    label.for = shortcut;
    label.title = userShortcuts[shortcut]?.description || ``;
    label.innerText = userShortcuts[shortcut]?.label || ``;
    label.classList.add(`shortcutLabel`);
    div.appendChild(label);

    const kbdInput = document.createElement(`input`);
    kbdInput.type = `text`;
    kbdInput.dataset.kbdAction = shortcut;
    kbdInput.required = !userShortcuts[shortcut]?.optional;
    kbdInput.addEventListener(`keydown`, myFunction);
    kbdInput.addEventListener(`blur`, saveShortcut);
    kbdInput.value = renderKBDShortcut(userShortcuts[shortcut]);
    div.appendChild(kbdInput);

    shortcutsContainer.appendChild(div);
  }
};

function map(event) {
  const mods = [`ctrlKey`, `altKey`, `shiftKey`];
  const exclude = [`Meta`, `Control`, `Shift`, `Alt`];
  const finalKey = exclude.includes(event.key) ? `` : event.key || event.code;

  return {
    mods: mods.filter((m) => event[m]),
    key: finalKey ? event.code : ``,
    printableKey: finalKey,
  };
}

const areKbdEqual = (kbd1, kbd2) =>
  kbd1.key === kbd2.key &&
  kbd1.mods.length === kbd2.mods.length &&
  kbd1.mods.every((el) => kbd2.mods.includes(el));

const isKbdTaken = (kbd) =>
  Object.keys(userShortcuts)
    .map((action) =>
      areKbdEqual(kbd, userShortcuts[action]) ? userShortcuts[action].label : ``
    )
    .filter((e) => e)
    .pop();

function commitShortcut(action, newKbd, target) {
  const newShortcuts = {
    ...userShortcuts,
    [action]: { ...userShortcuts[action], ...newKbd },
  };
  userShortcuts = newShortcuts;
  chrome.storage.sync.set({ shortcuts: newShortcuts }, () => {
    target.value = renderKBDShortcut(newKbd);
  });
}

function saveShortcut(e) {
  const { kbdAction } = e.target.dataset;
  const kbd = modifiedShortcuts[kbdAction];
  const oldKbd = userShortcuts[kbdAction];

  if (!kbd || (!kbd.key && !userShortcuts[kbdAction].optional)) {
    e.target.value = renderKBDShortcut(oldKbd);
    return;
  }

  if (!areKbdEqual(kbd, oldKbd)) {
    // Difference --> save

    const duplicateAction = isKbdTaken(kbd);

    if ((oldKbd.optional && !kbd.key) || !duplicateAction) {
      commitShortcut(kbdAction, kbd, e.target);
      e.target.value = renderKBDShortcut(kbd);
    } else {
      const p = document.createElement(`p`);
      p.innerText = `${renderKBDShortcut(
        kbd
      )} is already used by '${duplicateAction}' action.`;
      p.style.display = `inline`;
      e.target.parentElement.append(p);
      e.target.style.borderColor = `red`;
      e.target.timeout = setTimeout(() => {
        e.target.value = renderKBDShortcut(oldKbd);
        e.target.style.borderColor = ``;
        p.remove();
      }, 2000);
    }
  }

  e.target.value = renderKBDShortcut(kbd);
  delete modifiedShortcuts[kbdAction];
}

function renderKBDShortcut(kbd) {
  const to = { ctrlKey: `Ctrl`, altKey: `Alt`, shiftKey: `Shift` };
  const mods = kbd.mods.map((m) => to[m]);
  return `${mods.join(`+`)}${mods.length ? `+` : ``}${
    kbd.printableKey
  }`.toUpperCase();
}

function myFunction(e) {
  const { kbdAction } = e.target.dataset;
  if (e.target.timeout) {
    window.clearTimeout(e.target.timeout);
    e.target.style.borderColor = ``;
    if (e.target.nextElementSibling) {
      e.target.nextElementSibling.remove();
    }

    delete e.target.timeout;
  }

  if (e.code === `Tab`) {
    return;
  }

  if (e.code === `Backspace`) {
    if (userShortcuts[kbdAction].optional) {
      modifiedShortcuts[kbdAction] = {
        mods: [],
        key: ``,
        printableKey: ``,
      };
    }

    return (e.target.value = ``);
  }

  e.stopPropagation();
  e.preventDefault();

  // Keys.push(e.key);
  const kbd = map(e);
  e.target.value = renderKBDShortcut(kbd);
  if (kbd.key) {
    modifiedShortcuts[kbdAction] = kbd;
  }
}
