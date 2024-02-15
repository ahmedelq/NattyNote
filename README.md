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

## ⚙️ How it works

Press `Alt+P`, the video will stop playing, a prompt will show up, write your note and then press `Alt+Enter`. Your timestamped notes will appear at the bottom of the video.
You can also press `Alt+U` to take notes without pausing the video. Hit the `Shift` key with the previous commands to take a snapshot!

![NattyNote preview](https://github.com/ahmedelq/NattyNote/blob/main/preview.gif)

## ⭐ Features

- Lightweight. (~20kb)
- Automatically pause/play the video while and after taking notes.
- Take video snapshots.
- Custumizable shortcuts.
- Custumizable templates.
- Caption autocomplete.
- Auto save.
- Clickable timestamps.
- RTL support.

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

## 👀 Preview

<p align="center">
  <img width="75%" src="/media/1.png" alt="How it works 1"></img>
  <img width="75%" src="/media/2.png" alt="How it works 2"></img>
  <img width="75%" src="/media/3.png" alt="How it works 3"></img>
  <img width="75%" src="/media/4.png" alt="How it works 4"></img>
  <img width="75%" src="/media/5.png" alt="How it works 5"></img>
  <img width="75%" src="/media/6.png" alt="How it works 6"></img>
</p>

## 📜 License

NattyNote is released under [GPL-3.0 License](https://github.com/ahmedelq/NattyNote/blob/main/LICENSE). Check the LICENSE file for details.
