let songs;
let currentsong = new Audio();
let currfolder;

// for get all the songs from the folder
async function getsongs(folder) {
  currfolder = folder;
  const infoFilePath = `${folder}/info.json`;
  const jsonresponse = await fetch(infoFilePath);
  const Songinfo = await jsonresponse.json();
  console.log(Songinfo.title);
  let a = await fetch(
    `/${currfolder}`
  );
  let response = await a.text();

  const div = document.createElement("div");
  div.innerHTML = response;

  let as =
    div.getElementsByTagName(
      "a"
    ); 


  //  now from all the  as selecting the song based on Mp3
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${currfolder}/`)[1]);
    }
  }
  // show all teh song on the playlist
  let songUl = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li>
       <img src="" class="invert" alt="">
       <div class="info">
           <div>${song.replaceAll("%20", "")}</div>
           <div style="margin-top: 5px;">${Songinfo.title}</div>

       </div>
       <div class="playnow">
           <span>Play Now </span>
           <img src="img/play.svg" class="songplay" class="invert alt="">
       </div></li>`;
  }

  // Attach an event listener to each  song on the library
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

// play music function
const playMusic = (track, pause = false) => {
  currentsong.src = `/${currfolder}/` + track;
  // let audio=new Audio("/Song/"+track)
  if (!pause) {
    currentsong.play();
     document.getElementsByClassName("songplay").src="img/pause.svg"
    play.src = "img/pause.svg";
  }
  document.querySelector(".Songinfo").innerHTML = decodeURI(track);
  document.querySelector(".Songtime").innerHTML = `${convertToMinSec(
    currentsong.currentTime
  )}:${convertToMinSec(currentsong.duration)}`;
};

// function for converting second to min
function convertToMinSec(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

//  display all the album on the page

async function DisplayAlbums() {
  let a = await fetch(`/Song/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");

  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    let folder = e.href
      .split("/")
      .filter((part) => part !== "")
      .splice(-1)[0];

    // Skip if it's the "Song" folder itself
    if (folder.toLowerCase() === "song") continue;

    try {
      let res = await fetch(`/Song/${folder}/info.json`);
      if (!res.ok) {
        console.error(`Could not fetch info.json for folder: ${folder}`);
        continue;
      }

      let data = await res.json();
      // console.log(data);

      cardContainer.innerHTML += `
        <div data-folder="${folder}" class="card">
          <div class="play_button">
            <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" fill="#1Ed760" />
              <polygon points="40,30 70,50 40,70" fill="black" />
            </svg>
          </div>
          <img src="/Song/${folder}/cover.jpg" alt="">
          <h2>${data.title}</h2>
          <p>${data.description}</p>
        </div>`;
    } catch (err) {
      console.error(`Error loading data for folder ${folder}:`, err);
    }
  }

  // Add click events after all cards are loaded
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getsongs(`Song/${item.currentTarget.dataset.folder}`);
    });
  });
}

async function main() {
  // get the list of all the songs
  await getsongs(`Song/1Honey-singh`); // yha pe 

  playMusic(songs[0], true);

  //   display  all the albums
  DisplayAlbums();

  // Attach an event listemner to  play pre and next
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

  // add event listener to the previous buuton
  pre.addEventListener("click", () => {
    currentsong.pause();
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 > 0) {
      playMusic(songs[index - 1]);
    } else {
      playMusic(songs[songs.length - 1]);
    }
  });

  // add an event listner to next
  next.addEventListener("click", () => {
    currentsong.pause();

    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    } else {
      playMusic(songs[0]);
    }
  });

  // Add an event listener to chaage  volume  by use of range
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      //   console.log(e.target.value + "/100");
      currentsong.volume = parseInt(e.target.value) / 100;
    });

  // add an event listener to the volume to mute
  document.querySelector(".volume > img").addEventListener("click", (e) => {
    const img = e.target;

    if (img.src.includes("volume.svg")) {
      img.src = img.src.replace("img/volume.svg", "close.svg");
      currentsong.volume = 0;
    } else {
      img.src = img.src.replace("imgclose.svg", "volume.svg");
      currentsong.volume = 0.1;
    }
  });

  //  load the playlist(library) when card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      // console.log(item.target,item.currentTarget.dataset)
      songs = await getsongs(`Song/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });

  //  Adding event listener to the song
  // timeupdate is listen when the song is play  and by help of that we move our seekbar (circle )
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".Songtime").innerHTML = `${convertToMinSec(
      currentsong.currentTime
    )}/${convertToMinSec(currentsong.duration)}`;
    const circle = document.querySelector(".circle");
    if (currentsong.duration && !isNaN(currentsong.duration)) {
      circle.style.left =
        (currentsong.currentTime / currentsong.duration) * 100 + "%"; // jitna % song play hua hai utna left move krega  according to full lenght
      // if 30 % song play hua to 30% of whole length  left move krega  aur ye process hote rehaga because we use timeupdate eventlistener
    } else {
      circle.style.left = "0%";
    }
  });

  // Add event listener to the seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    // console.log(e.target.getBoundingClientRect().width, e.offsetX);
    const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%"; //left ko that percentage pe kr do
    currentsong.currentTime = (currentsong.duration * percent) / 100; //
    // aur ya total widht ka kitna % pe click hua hai if 50% width pe click hua hai to song  ka current time ko total duration ka 50 % pe jana hoga
  });

  // attach Event listener to the hamburger

  document.querySelector(".hamburger").addEventListener("click", () => {
    console.log("clicked")
    document.querySelector(".left").style.left = "0";
  });

  // attach Event listener to the close button

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
}

main();
