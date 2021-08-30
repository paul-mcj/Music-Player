// ||| Global variables for DOM manipulation
const buttonPlay = document.querySelector(".button--play");
const buttonPause = document.querySelector(".button--pause");
const buttonNext = document.querySelector(".button--next");
const buttonPrev = document.querySelector(".button--prev");
const buttonShuffle = document.querySelector(".button--shuffle");
const buttonRepeat = document.querySelector(".button--repeat");
const volumeControl = document.querySelector(".volume-control");
const track = document.querySelector(".track-number");
const trackName = document.querySelector(".track-name");
const headersWithinTrackName = document.querySelectorAll(".track-name > h3");
const trackInfo = document.querySelector(".track-info");
const trackTimeStart = document.querySelector(".track-time__start");
const trackTimeEnd = document.querySelector(".track-time__end");
const progress = document.querySelector(".progress");

// ||| Initialize local variables -- some of these can be changed depending on the number of tracks to be added to the playlist over time
const playlistLength = 21;
let playlist = [];
let currentTrack = 0;
track.textContent = 1;

// ||| Build the array of audio tracks
for (i = 1; i <= playlistLength + 1; i++) {
    let index = `./tracks/track${i}.mp3`;
    let track = new Audio(index);
    playlist.push(track);
}

// ||| Function will call all event listeners
loadEventListeners();

// ||| Loads all event listeners
function loadEventListeners() {
    buttonPlay.addEventListener("click", playTrack);
    buttonPause.addEventListener("click", pauseTrack);
    buttonNext.addEventListener("click", nextTrack);
    buttonPrev.addEventListener("click", prevTrack);
    buttonShuffle.addEventListener("click", shuffleTrack);
    buttonRepeat.addEventListener("click", repeatTrack);
    volumeControl.addEventListener("input", setVolume);
    window.addEventListener("resize", showVolumeControl);
}

// ||| Plays the currentTrack and replaces the play button with the pause button. Sets the volume for the currentTrack, and will also display all other buttons and the volume control.
function playTrack() {
    playlist[currentTrack].play();
    setVolume();
    buttonPlay.replaceWith(buttonPause);
    buttonPause.style.display = "block";
    showHidden();
    showVolumeControl();
    //todo: include songProgress(); once input range is working properly
}

// ||| Pauses the currentTrack and replaces the pause button with the play button
function pauseTrack() {
    playlist[currentTrack].pause();
    buttonPause.replaceWith(buttonPlay);
    buttonPlay.style.display = "block";
}

// ||| Checks if the current song is at the end of the playlist. If it is then the next song cycles back to the beginning, otherwise its simply the next song in the array.
function nextTrack() {
    playlistLogic();
    if (currentTrack < playlistLength) {
        currentTrack++;
    } else {
        currentTrack = 0;
    }
    updateTrack();
}

// ||| Checks if the current song is at the beginning of the playlist, if it is then the next song played (ie. the "previous" one in the playlist) cycles back to the end of the playlist.
function prevTrack() {
    playlistLogic();
    if (currentTrack > 0) {
        currentTrack--;
    } else if (currentTrack <= 0) {
        currentTrack = playlistLength;
    }
    updateTrack();
}

// ||| Calls the recursive function shufflePlaylist to find a new unique track to set as the newest currentTrack and play it.
function shuffleTrack() {
    playlistLogic();
    shufflePlaylist();
    updateTrack();
}

// ||| Repeats the current song in the playlist
function repeatTrack() {
    playlistLogic();
    playlist[currentTrack].play();
    updateTrack();
}

// ||| Updates the currentTrack number for the user and also calls the playTrack() function to have the song start playing (used in conjunction with other functions)
function updateTrack() {
    track.textContent = currentTrack + 1;
    playTrack();
}

// ||| Pauses the currentTrack and resets it currentTime back to the beginning (used in conjunction with other functions)
function playlistLogic() {
    playlist[currentTrack].pause();
    playlist[currentTrack].currentTime = 0;
}

// ||| The first time a user clicks on the play button to start the music player app, all other buttons of the original html with "display:none" are then changed to be shown.
function showHidden() {
    // fixme: add transitions??
    trackName.style.display = "flex";
    trackInfo.style.display = "flex";
    buttonRepeat.style.display = "block";
    buttonShuffle.style.display = "block";
    buttonPrev.style.display = "block";
    buttonNext.style.display = "block";
}

// ||| Makes sure that the volume control only shows on non-mobile displays.
function showVolumeControl() {
    // The number 640 is used as the limiter because it is 40em divided by 16 in pixels. 40em is the breakpoint in the CSS file from mobile to larger displays, so its used here for consistency, and 16 is the default calculated value used in the CSS, too as determined by the global font-size.
    // Check a random button's current display before showing the volume control element -- if it is still not showing, neither should volume control. But if the button is showing, then the innerWidth of the page must not be mobile device for the control to show, too.
    if (window.innerWidth > 639 && buttonShuffle.style.display === "block") {
        volumeControl.style.display = "block";
    } else {
        volumeControl.style.display = "none";
    }
}

// ||| Gathers the value of the volumeControl element and sets the current track's volume to that number
function setVolume() {
    playlist[currentTrack].volume = volumeControl.value / 100;
}

// ||| Finds a random number between 0 and the playlistLength (inclusive) to return as the next currentTrack. If the number returned is the same as the currentTrack, the function is recalled recursively until a unique random track is returned.
function shufflePlaylist() {
    function randomize() {
        return Math.floor(Math.random() * (playlistLength - 0 + 1));
    }
    let randomTrack = randomize();
    if (randomTrack !== currentTrack) {
        currentTrack = randomTrack;
        return currentTrack;
    } else {
        shufflePlaylist();
    }
}

// function songProgress() {
//     let seconds = 0;
//     let minutes = 0;
//     let mins = Math.floor(playlist[currentTrack].duration / 60);
//     let secs = Math.floor(playlist[currentTrack].duration % 60);
//     let progressValue = playlist[currentTrack].duration / 100;
//     let progressMax = playlist[currentTrack].duration;
//     trackTimeStart.textContent = "0:00";
//     if (secs >= 10) {
//         trackTimeEnd.textContent = `${mins}:${secs}`;
//     } else {
//         trackTimeEnd.textContent = `${mins}:0${secs}`;
//     }

//     progress.setAttribute("max", progressMax);

//     setInterval(countingSeconds, 1000);
//     //todo: add automatic next song when the duration of a song is reached -- the trackTimeStart and progress bar cannot go past the duration of a song!!!
//     //fixme: restart this function to 0 once a new current song is playing (and pause the numbers when pause is evoked)
//     function countingSeconds() {
//         seconds++;
//         //todo: switch//case statements
//         if (seconds < 10) {
//             trackTimeStart.textContent = `${minutes}:0${seconds}`;
//         }
//         if (seconds > 9 && seconds < 60) {
//             trackTimeStart.textContent = `${minutes}:${seconds}`;
//         } else if (seconds > 59) {
//             seconds = 0;
//             minutes++;
//             trackTimeStart.textContent = `${minutes}:0${seconds}`;
//         }
//         progressValue++;
//         progress.setAttribute("value", progressValue);
//         console.log(`track = ${currentTrack}    value = ${progressValue}   max = ${progressMax}`);
//         if (progressValue === progressMax || progressValue >= progressMax) {
//             console.log("next song");
//             nextTrack();
//         }
//     }
// }

//fixme: fix event delegation for volume slider (it should be scrollable while hovering, not just after clicking it)
//todo: add repeat function: make it repeat after the current song is done playing (need to check if current song is still playing?). change from current logic of simply restarting the song from the beginning
//todo: make progress bar transition smoother?
//todo: add slider functionality to have users skip through songs
//todo: check audio files have loaded in before starting (NaN is begin returned prematurely for the tractTime() function) -- add an alert that music cannot be played when files are loading
//todo: persist storage?
//todo: drag and drop for playlists eventually
// todo: slideshow of pics for each song
