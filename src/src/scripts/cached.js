/* cached.js -- . 
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
const loadAll = async () =>
  new Promise((res) => chrome.storage.local.get(null, (vals) => res(vals)));

window.onload = async function () {
  const notesList = document.getElementById(`cachedNoteList`);
  const storedNotes = await loadAll();
  const sortedIDs = Object.keys(storedNotes).sort(
    (k1, k2) => storedNotes[k2].timestamp - storedNotes[k1].timestamp
  );
  for (const videoID of sortedIDs) {
    const {title, timestamp, content} = storedNotes[videoID];

    const div = document.createElement(`div`);
    const link = document.createElement(`a`);
    const img = document.createElement(`img`);
    const lastUpdated = document.createElement(`time`);
    const size = document.createElement(`span`);
    const button = document.createElement(`button`);

    div.classList.add(`storedNoteItem`);
    const lastUpdatedObj = new Date(timestamp);
    img.src = `https://img.youtube.com/vi/${videoID}/mqdefault.jpg`;
    lastUpdated.innerText = lastUpdatedObj.toLocaleDateString();
    lastUpdated.dateTime = lastUpdatedObj.toISOString();
    lastUpdated.title = lastUpdatedObj.toLocaleString();
    link.href = `https://www.youtube.com/watch?v=${videoID}`;
    link.target = `__blank`;
    link.innerText = title;
    link.title = title;
    size.innerHTML = formatByte(new TextEncoder().encode(content).length);
    size.id = `size`;
    button.classList.add(`delete`);
    button.type = `button`;
    button.addEventListener(`click`, (e) => {
      e.preventDefault();
      div.classList.add(`removing`);
      chrome.storage.local.remove(videoID, () => div.remove());
    });

    div.appendChild(img);
    div.appendChild(link);
    div.appendChild(lastUpdated);
    div.appendChild(size);
    div.append(button);
    notesList.appendChild(div);
  }
};

function formatByte(bytes) {
  const base = Math.floor(Math.log(bytes) / Math.log(1024));
  const suffix = [`B`, `KB`, `MB`, `GB`, `TB`][base];
  const n = Math.round(bytes / 1024 ** base, 3);
  return `${n} ${suffix}`;
}
