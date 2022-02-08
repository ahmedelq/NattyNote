"use strict";

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
var loadAll = function loadAll() {
  return regeneratorRuntime.async(function loadAll$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", new Promise(function (res) {
            return chrome.storage.local.get(null, function (vals) {
              return res(vals);
            });
          }));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

window.onload = function _callee() {
  var notesList, storedNotes, sortedIDs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          notesList = document.getElementById("cachedNoteList");
          _context2.next = 3;
          return regeneratorRuntime.awrap(loadAll());

        case 3:
          storedNotes = _context2.sent;
          sortedIDs = Object.keys(storedNotes).sort(function (k1, k2) {
            return storedNotes[k2].timestamp - storedNotes[k1].timestamp;
          });
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 8;

          _loop = function _loop() {
            var videoID = _step.value;
            var _storedNotes$videoID = storedNotes[videoID],
                title = _storedNotes$videoID.title,
                timestamp = _storedNotes$videoID.timestamp,
                content = _storedNotes$videoID.content;
            var div = document.createElement("div");
            var link = document.createElement("a");
            var img = document.createElement("img");
            var lastUpdated = document.createElement("time");
            var size = document.createElement("span");
            var button = document.createElement("button");
            div.classList.add("storedNoteItem");
            var lastUpdatedObj = new Date(timestamp);
            img.src = "https://img.youtube.com/vi/".concat(videoID, "/mqdefault.jpg");
            lastUpdated.innerText = lastUpdatedObj.toLocaleDateString();
            lastUpdated.dateTime = lastUpdatedObj.toISOString();
            lastUpdated.title = lastUpdatedObj.toLocaleString();
            link.href = "https://www.youtube.com/watch?v=".concat(videoID);
            link.target = "__blank";
            link.innerText = title;
            link.title = title;
            size.innerHTML = formatByte(new TextEncoder().encode(content).length);
            size.id = "size";
            button.classList.add("delete");
            button.type = "button";
            button.addEventListener("click", function (e) {
              e.preventDefault();
              div.classList.add("removing");
              chrome.storage.local.remove(videoID, function () {
                return div.remove();
              });
            });
            div.appendChild(img);
            div.appendChild(link);
            div.appendChild(lastUpdated);
            div.appendChild(size);
            div.append(button);
            notesList.appendChild(div);
          };

          for (_iterator = sortedIDs[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
          }

          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](8);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 17:
          _context2.prev = 17;
          _context2.prev = 18;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 20:
          _context2.prev = 20;

          if (!_didIteratorError) {
            _context2.next = 23;
            break;
          }

          throw _iteratorError;

        case 23:
          return _context2.finish(20);

        case 24:
          return _context2.finish(17);

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[8, 13, 17, 25], [18,, 20, 24]]);
};

function formatByte(bytes) {
  var base = Math.floor(Math.log(bytes) / Math.log(1024));
  var suffix = ["B", "KB", "MB", "GB", "TB"][base];
  var n = Math.round(bytes / Math.pow(1024, base), 3);
  return "".concat(n, " ").concat(suffix);
}