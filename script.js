
async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/song/");  /* As we store song in the Songs folder and we fetch data  from that folder  */
    let response = await a.text();
    // console.log(response);
    const div = document.createElement("div");
    div.innerHTML = response;   /*all the fetch data are come and in fetch data i all the  got song inside the <a> ancher tag 
     */
    let as = div.getElementsByTagName("a"); /*   selectig all the  ancher a of fatch data which  are inside the fetch daat  */
    // console.log(as); 

    //  now from all the  as selecting the song 
    let Songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            Songs.push(element.href.split("/song/")[1]);
        }
    }
    return Songs;
}
async function main() {
    // get the list of all the songs
    let songs = await getsongs();
    // console.log(songs);
    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];

    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
                            <img src="music.svg" class="invert" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", "")}</div>
                                <div>Ashutosh</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now </span>
                                <img src="play.svg" class="invert alt="">
                            </div>
          </li>`;
    }

    //  play the song
    const audio = new Audio("song/" + songs[2]);
    audio.play();


    





    


    // audio.addEventListener('loadeddata', () => {
    //     let duration = audio.duration;
    //     console.log(duration);
    //     //  The duration varibale 

    // })

}
main();







