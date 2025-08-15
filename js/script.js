let songs;
let currentsong = new Audio();
let currfolder;

// convert seconds to mm:ss
function convertToMinSec(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remaining = String(Math.floor(seconds % 60)).padStart(2, '0');
  return `${minutes}:${remaining}`;
}

// for getting all the songs from a folder
async function getsongs(folder) {
  currfolder = folder;
  const infoFilePath = `Song/${folder}/info.json`;
  const jsonresponse = await fetch(infoFilePath);
  if (!jsonresponse.ok) throw new Error(`Missing info.json for ${folder}`);
  const Songinfo = await jsonresponse.json();
  console.log(Songinfo.title);

  // Build song list from JSON manifest to work on hosts without directory listing
  const declaredTracks = Array.isArray(Songinfo.tracks) ? Songinfo.tracks : [];
  songs = declaredTracks.filter((name) => typeof name === "string" && name.toLowerCase().endsWith(".mp3"));

    // Show all the songs in the playlist
  let songUl = document.querySelector(".songlist ul");
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML += `
      <li>
        <img src="" class="invert" alt="">
        <div class="info">
          <div>${decodeURI(song)}</div>
          <div style="margin-top: 5px;">${Songinfo.title}</div>
        </div>
        <div class="playnow">
          <span>Play Now </span>
          <img src="img/play.svg" class="songplay invert" alt="">
        </div>
      </li>`;
  }
// Attach an event listener to each song
 Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    
    e.addEventListener("click", (element) => {
   
      console.log(e.querySelector(".info").firstElementChild.innerHTML) // print all  song
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
      document.querySelector(".left").style.left = "-120%";

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



// display all albums
async function DisplayAlbums() {
  const manifestResponse = await fetch("Song/albums.json");
  if (!manifestResponse.ok) {
    console.error("Missing Song/albums.json manifest");
    return;
  }
  const manifest = await manifestResponse.json();
  const albumFolders = Array.isArray(manifest.albums) ? manifest.albums : [];

  let cardContainer = document.querySelector(".cardContainer");
  for (const folder of albumFolders) {
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

  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getsongs(item.currentTarget.dataset.folder);
      document.querySelector(".left").style.left = "0";

    });
  });
}

async function main() {
  await getsongs(`1Honey-singh`);
  playMusic(songs[0], true);

      // Display all the albums on the page
  DisplayAlbums();

  // Add an event listener to play
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


    // Add an event listener to previous
  pre.addEventListener("click", () => {
    currentsong.pause();
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    } else {
      playMusic(songs[songs.length - 1]);
    }
  });

   // Add an event listener to next
  next.addEventListener("click", () => {
    currentsong.pause();
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    } else {
      playMusic(songs[0]);
    }
  });

  // Add an event to volume
  document.querySelector(".range input").addEventListener("change", (e) => {
    currentsong.volume = parseInt(e.target.value) / 100;
  });


  // Add event listener to mute the track
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

  // Listen for timeupdate event
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

      // Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

   // Add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

      // Add an event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
}

main();