
let ytPlayer = document.querySelector(`#movie_player video`);
let natnFrame = null;
let natnTimeline = null;
let bar = null;
let shouldTogglePlayer = true;
let timestamp = ytPlayer.currentTime;


// function isPlaying() {
//   return !(ytPlayer.paused | ytPlayer.ended);
// }

function toggleBar(shouldClearBar, shouldShowBar) {

  let [removedClass, addedClass] = [`natn-block`, `natn-none`]
    .sort((a, _) => shouldShowBar)

  natnFrame.classList.remove(removedClass);
  natnFrame.classList.add(addedClass);


  if (shouldClearBar)
    bar.innerHTML = ``

  removedClass === `natn-block` ? bar.blur() : setTimeout(() => bar.focus(), 100);

  if (shouldTogglePlayer) {
    if (shouldShowBar)
      ytPlayer.pause();
    else
      ytPlayer.play();
  }



}

function insertNewNote(text) {
  const href = document.createElement(`a`);
  hrefTxt = document.createTextNode(`${formatTime(timestamp)}`);
  href.appendChild(hrefTxt);
  const v = (new URL(document.URL)).searchParams.get(`v`);
  href.href = `https://www.youtube.com/watch?v=${v}&t=${Math.floor(timestamp)}s`;
  href.setAttribute(`class`, `natn-link`);

  const span = document.createElement(`p`);
  const stampedNote = document.createTextNode(` ${text}`);
  span.appendChild(href);
  span.appendChild(stampedNote);
  span.setAttribute(`class`, `unicode`);
  natnTimeline.appendChild(span);
}
function formatTime(seconds) {
  let times = new Array(3);
  for (let i = 0; i < times.length; i++) {
    base = 60 ** (2 - i);
    times[i] = Math.floor(seconds / base);
    seconds %= base;
  }
  let hrs = times.shift();
  times = times.map(x => (`00` + x).slice(-2));
  if (hrs)
    times.unshift(hrs);
  return times.join(`:`);
}



function prepare() {

  return new Promise((resolve, reject) => {

    if (natnFrame)
      resolve(true);
    else {



      const iFrameElement = document.createElement(`iframe`);
      iFrameElement.setAttribute(`id`, `natn_frame`);
      iFrameElement.src = browser.runtime.getURL(`iframe.html`);
      document.documentElement.appendChild(iFrameElement);

      iFrameElement.addEventListener(`load`, e => {

        resolve(true);

        natnFrame = document.getElementById(`natn_frame`);
        bar = natnFrame.contentDocument.getElementById(`stdin`);

        bar.addEventListener(`keydown`, function (event) {

          if (event.code === `Enter`) {
            insertNewNote(bar.innerText);
            toggleBar(true, false);
          }
          if (event.code === `Escape`) {
            // TODO: event isn't triggered when YT is in full-screen. 
            event.stopPropagation();
            toggleBar(false, false);
          }
        });




      })
    }
  })
}



function insertTimeline() {
  const player = document.querySelector(`#page-manager div#info`);
  natnTimeline = document.createElement(`div`);
  natnTimeline.setAttribute(`id`, `natn_tl`);
  natnTimeline.setAttribute(`contenteditable`, `true`);

  natnTimeline.addEventListener(`keydown`, e => {
    e.stopPropagation();
    if (e.key === `Escape`) {
      natnTimeline.blur();
    }
  });

  player.insertAdjacentElement(`beforebegin`, natnTimeline);
}

function insertToolKit() {
  return prepare().then(insertTimeline);
}

async function logTime(e) {
  if (document.activeElement.tagName == `INPUT`)
    return;


  if (e.code === `KeyW` || e.code === `KeyQ`) {
    timestamp = ytPlayer.currentTime;
    shouldTogglePlayer = e.code === `KeyW`;

    if (!natnTimeline) {
      await insertToolKit();
    }

    toggleBar(false, true);

  }

}

function clearToolKit() {
  // we don't want to pollute the DOM when the tool isn't used. 
  natnTimeline.remove();
  natnFrame.remove()
  natnTimeline = null;
  natnFrame = null;
}
document.addEventListener(`yt-navigate-finish`, clearToolKit);
document.addEventListener(`keydown`, logTime);


