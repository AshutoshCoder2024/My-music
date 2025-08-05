let songs;
let currentsong = new Audio();
let currfolder;

// for getting all the songs from a folder
async function getsongs(folder) {
  currfolder = folder;
  const infoFilePath = `Song/${folder}/info.json`;
  const jsonresponse = await fetch(infoFilePath);
  const Songinfo = await jsonresponse.json();
  console.log(Songinfo.title);

  let a = await fetch(`Song/${currfolder}`);
  let response = await a.text();

  const div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${currfolder}/`)[1]);
    }
  }

  let songUl = document.querySelector(".songlist ul");
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML += `
      <li>
        <img src="" class="invert" alt="">
        <div class="info">
          <div>${song.replaceAll("%20", "")}</div>
          <div style="margin-top: 5px;">${Songinfo.title}</div>
        </div>
        <div class="playnow">
          <span>Play Now </span>
          <img src="img/play.svg" class="songplay invert" alt="">
        </div>
      </li>`;
  }

 Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    
    e.addEventListener("click", (element) => {
   
      console.log(e.querySelector(".info").firstElementChild.innerHTML) // print all  song
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
}

// play music
const playMusic = (track, pause = false) => {
  currentsong.src = `Song/${currfolder}/` + track;

  if (!pause) {
    currentsong.play();
    play.src = "img/pause.svg";
  }

  document.querySelector(".Songinfo").innerHTML = decodeURI(track);
  document.querySelector(".Songtime").innerHTML = `${convertToMinSec(
    currentsong.currentTime
  )}/${convertToMinSec(currentsong.duration)}`;
};

// convert seconds to mm:ss
function convertToMinSec(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remaining = String(Math.floor(seconds % 60)).padStart(2, '0');
  return `${minutes}:${remaining}`;
}

// display all albums
async function DisplayAlbums() {
  let a = await fetch(`Song/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");

  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    let folder = e.href.split("/").filter(Boolean).pop();
    if (folder.toLowerCase() === "song") continue;

    try {
      let res = await fetch(`Song/${folder}/info.json`);
      if (!res.ok) continue;
      let data = await res.json();

      cardContainer.innerHTML += `
        <div data-folder="${folder}" class="card">
          <div class="play_button">
            <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" fill="#1Ed760" />
              <polygon points="40,30 70,50 40,70" fill="black" />
            </svg>
          </div>
          <img src="Song/${folder}/cover.jpg" alt="">
          <h2>${data.title}</h2>
          <p>${data.description}</p>
        </div>`;
    } catch (err) {
      console.error(`Error loading data for folder ${folder}:`, err);
    }
  }

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getsongs(item.currentTarget.dataset.folder);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  await getsongs(`1Honey-singh`);
  playMusic(songs[0], true);
  DisplayAlbums();

  const play = document.getElementById("play");
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "img/pause.svg";
    } else {
      currentsong.pause();
      play.src = "img/play.svg";
    }
  });

  pre.addEventListener("click", () => {
    currentsong.pause();
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    } else {
      playMusic(songs[songs.length - 1]);
    }
  });

  next.addEventListener("click", () => {
    currentsong.pause();
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    } else {
      playMusic(songs[0]);
    }
  });

  document.querySelector(".range input").addEventListener("change", (e) => {
    currentsong.volume = parseInt(e.target.value) / 100;
  });

  document.querySelector(".volume > img").addEventListener("click", (e) => {
    const img = e.target;
    if (img.src.includes("volume.svg")) {
      img.src = "img/close.svg";
      currentsong.volume = 0;
    } else {
      img.src = "img/volume.svg";
      currentsong.volume = 0.1;
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".Songtime").innerHTML = `${convertToMinSec(
      currentsong.currentTime
    )}/${convertToMinSec(currentsong.duration)}`;
    const circle = document.querySelector(".circle");
    if (currentsong.duration && !isNaN(currentsong.duration)) {
      circle.style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    } else {
      circle.style.left = "0%";
    }
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
}

main();
