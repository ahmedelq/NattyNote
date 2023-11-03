/* player.js -- YouTube player wrapper.
   Copyright (C) 2021-2023 Ahmad Alq.
   This file is part of NattyNote.
*/

import { asyncLoad } from "./utils";
import userSettings from "./settings";

class Player {
  constructor() {
    this.video = document.querySelector(`#movie_player video`);
    this.title = document.querySelector(`#container h1`)?.innerText;
    this.channelName = document.querySelector(
      `#upload-info #channel-name`
    )?.innerText;

    this.initialize();
  }

  async initialize() {
    this.video =
      (await asyncLoad(`#movie_player video`)) || (await asyncLoad(`video`));

    let titleEl = await asyncLoad(`#container h1`);

    this.title =
      titleEl?.innerText || document.title.replace(` - YouTube`, ``) || ``;

    let channelNameEl =
      (await asyncLoad(`#upload-info #channel-name`)) ||
      (await asyncLoad(`.iv-branding-context-name`));
    this.channelName = channelNameEl?.innerText || ``;
  }
  play() {
    this.video.play();
  }

  async screenshot() {
    //Ref https://stackoverflow.com/a/13765373
    let canvas = document.createElement(`canvas`);
    let h = userSettings?.ss?.height;
    let w = userSettings?.ss?.width;
    if (userSettings?.ss?.automaticDims) {
      h = this.video.videoHeight || this.video.offsetHeight || 720;
      w = this.video.videoWidth || this.video.offsetWidth || 1280;
    }
    canvas.width = w;
    canvas.height = h;

    canvas.getContext(`2d`).drawImage(this.video, 0, 0, w, h);

    return canvas.toDataURL(
      `image/${userSettings?.ss?.format || `jpeg`}`,
      parseFloat(userSettings?.ss?.quality) || 0.75
    );
  }

  getCurrentCaption() {
    const captionEl =
      document.querySelector(`[id^="caption-window"]`) ||
      document.querySelector(`span.captions-text`) ||
      document.querySelector(`div.caption-window`);

    return captionEl?.innerText || ``;
  }

  pause() {
    this.video.pause();
  }

  duration() {
    //TODO: add option to format
    return this.video.duration;
  }

  currentTime() {
    //TODO: options to format
    return this.video.currentTime;
  }

  goTo(seconds) {
    if (seconds) this.video.currentTime = seconds;
  }

  toggle() {
    if (this.video.paused) this.play();
    else this.pause();
  }
}

const player = new Player();
export default player;
