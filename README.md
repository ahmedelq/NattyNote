<h1 align="center">NattyNote</h1>
<p align="center">
  <img width="200px" src="/media/nattynote.png" alt="NattyNote logo"></img>
  <p align="center"><strong>Take time-stamped YouTube notes</strong></p>
</p>


<div align="center">
<a href="https://addons.mozilla.org/firefox/addon/nattynote/" target="_blank"><img alt="GitHub Issues" src="https://img.shields.io/amo/stars/nattynote?label=Firefox&style=for-the-badge&logo=firefox&logoColor=5B4636&color=F4ECD8&labelColor=dcd4c2" /></a>
<a href="https://chrome.google.com/webstore/detail/nattynote/lgopopmbcfmojhfmnlbhjhgepclocphh" target="_blank"><img alt="Chrome rating" src="https://img.shields.io/amo/stars/nattynote?label=Chrome&style=for-the-badge&logo=Google+Chrome&logoColor=5B4636&color=F4ECD8&labelColor=dcd4c2" /></a>
<a href="https://github.com/ahmedelq/NattyNote/blob/main/LICENSE" target="_blank"><img alt="GitHub license" src="https://img.shields.io/github/license/ahmedelq/NattyNote?=&style=for-the-badge&logo=GitHub&logoColor=5B4636&color=F4ECD8&labelColor=dcd4c2" /></a>
<a href="https://github.com/ahmedelq/NattyNote/issues" target="_blank"><img alt="GitHub Issues" src="https://img.shields.io/github/issues/ahmedelq/NattyNote?=&style=for-the-badge&logo=GitHub&logoColor=5B4636&color=F4ECD8&labelColor=dcd4c2" /></a>
</div>

## 📦 Installation

- [Firefox](https://addons.mozilla.org/firefox/addon/nattynote/)
- [Chrome](https://chrome.google.com/webstore/detail/nattynote/lgopopmbcfmojhfmnlbhjhgepclocphh)
- [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/nattynote/gmooiijhebkgflcopagccaajmafoobbi)

## ⭐ Overview
**NattyNote** is a powerful yet minimalist, keyboard-centric browser extension. It enables keyboard-savvy users to take time-stamped notes while watching YouTube videos, and easily copy it to their preferred note-taking/knowledge base app. 

### Features

- Lightweight. (~20kb)
- Automatically pause/play the video while and after taking notes.
- Take video snapshots.
- Custumizable shortcuts.
- Custumizable templates.
- Caption autocomplete.
- Auto save.
- Clickable timestamps.
- RTL support.

## ⚙️ How it works

- **Pause and capture**: Quickly capture key points by pressing `Alt+P` to pause the video, write your note, and save it with `Alt+Enter`. Timestamped notes will appear below the video for easy reference.
- **On-the-fly capture**: Use `Alt+U` to take notes directly without pausing the video.
- **Snapshots?**: Press `Shift` with any of the commands above to automatically take a snapshot of the video alongside your note.

![NattyNote preview](https://github.com/ahmedelq/NattyNote/blob/main/preview.gif)


## 👀 Preview

<p align="center">
  <img width="75%" src="/media/1.png" alt="How it works 1"></img>
  <img width="75%" src="/media/2.png" alt="How it works 2"></img>
  <img width="75%" src="/media/3.png" alt="How it works 3"></img>
  <img width="75%" src="/media/4.png" alt="How it works 4"></img>
  <img width="75%" src="/media/5.png" alt="How it works 5"></img>
  <img width="75%" src="/media/6.png" alt="How it works 6"></img>
</p>


## Tutorial

### Keyboard bindings
You can customize keybindings (shortcuts) via `NattyNote Icon` ➡️ `Settings`  ➡️ `Keybindings`.

Below are the default used keybindings:


| Name | Keybinding | Description |
|---|---|---|
| Prompt+Toggle | `ALT+P` | Shows the note prompt and toggles the player; stops it if it is playing and starts it if it is stopped. |
| Prompt | `ALT+U` | Shows the note prompt without toggling the player; if the player is playing it won't be paused and vice versa. |
| Prompt+Toggle+Snapshot | `SHIFT+ALT+P` | Same behavior as `Prompt+Toggle` but also takes a snapshot of the video. |
| Prompt+Snapshot | `SHIFT+ALT+U` | Same behavior as `Prompt` but also takes a snapshot of the video. |
| Exit prompt | None | Close the prompt, discarding current note. Optional since it can always be called by `Escape`. |
| Deck focus | `ALT+K` | Focus on the notes deck. |
| Deck blur | `ALT+K` | Removes focus from the notes deck and places it at the video player. It's optional since it can always be called by `Escape` |
| Copy deck content | `ALT+C` | Copies the entire deck to clipboard in `HTML` format (plaintext in Firefox). A combination of `CTRL+A` and `CTRL+C` is preferred in Firefox |

### Templates and variables
Templates allow you to fine-tune the output of the notes in `HTML`, with useful variables.
You can customize the templates via `NattyNote Icon` ➡️ `Settings`  ➡️ `Templates`.

There are 3 templates
| Name | Description | Default value | Example |
|---|---|---|---|
| Deck initialization template |  When you first take a note for the first time, this string will be added at the top of your notes. Useful to add metadata about the video.  | `(%NOW%) <strong>(%VID_TITLE%)</strong> (%CH_NAME%)` | ![Template init](https://github.com/ahmedelq/NattyNote/blob/main/media/tutorial_init_template.png) |
| Snapshot template | Describe how to wrap the `base64` encoded image when a snapshot is created. | `<img src="(%SCREENSHOT_SRC%)"/>` | ![Template snapshot](https://github.com/ahmedelq/NattyNote/blob/main/media/tutorial_snapshot_template.png) |
| Note template | Describe how to format a note when it is comitted. Note that `SCREENSHOT_FORMATTED` might be empty and will be substited with the `Snapshot template` desribed above.  | `<p><a href="https://www.youtube.com/watch?v=(%VID_ID%)&t=(%TS_RAW%)s">(%TS_FORMATTED%)</a>(%NOTE%)</p>(%SCREENSHOT_FORMATTED%)` | ![Template note](https://github.com/ahmedelq/NattyNote/blob/main/media/tutorial_note_template.png) |

**Variables**:
| Name | Code | Description | Example |
|---|---|---|---|
| Video ID | `VID_ID` | Stores YouTube unique video ID | `iw97uvIge7c` |
| Raw timestamp | `TS_RAW` | A in double-precision floating-point value that represents the timestamp in in seconds at which a particular note has been taken. | `47.543641` |
| Formatted timestamp | `TS_FORMATTED` | Human-friendly representaiton of the raw timestamp | `00:46` |
| Note | `NOTE` | This is the actual note taken by the user | `This is a note with a snapshot!` |
| Formatted snapshot | `SCREENSHOT_FORMATTED` | *A substitution for the `Snapshot template` desribed above. It might be empty (null) in case no snapshots were taken. | `<img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQA.../>` |
| Snapshot sourcecode | `SCREENSHOT_SRC` | A representaiton of a snapshot endeded in `base64` | `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQA..` |
| Current date and time | `NOW` | Current date and time | `2/15/2024, 3:59:33 PM` |
| Video title | `VID_TITLE` | Video title |  `Using Caffeine to Optimize...` |
| Channel name | `CH_NAME` | Channel name | `Andrew Huberman` |


### Auto-completion
![NattyNote Auto-completion](https://github.com/ahmedelq/NattyNote/blob/main/media/tutorial-inserting-caption.gif)

To enable caption auto-completion:
1. Turn-on YouTube captions, hit `c` (YouTube shortcut) or click the `CC` icon to activate closed captions.
2. Captions will appear faintly within the NattyNote prompt.
3. Auto-fill with `Tab` or `Enter` and it will insert the current caption text into prompt. 


## 🌱 Contribution

Please open an issue to:

- Add / suggest a feature.
- Report an issue.
- Improve code quality.

### Manual build

```bash
git clone https://github.com/ahmedelq/NattyNote.git
cd NattyNote/src
npm install
npm run serve:firefox
#Or, with chrome:
#npm run serve:chrome
```

### 🛣️ Future plans

- Add i18n support.
- Generalize to every video platform.
- Rewrite in TypeScript.

## 📜 License

NattyNote is released under [GPL-3.0 License](https://github.com/ahmedelq/NattyNote/blob/main/LICENSE). Check the LICENSE file for details.
