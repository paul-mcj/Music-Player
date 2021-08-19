// ||| Global variables for DOM manipulation
const buttonPlay = document.querySelector(".button--play");
const buttonPause = document.querySelector(".button--pause");
const buttonNext = document.querySelector(".button--next");
const buttonPrev = document.querySelector(".button--prev");
const buttonShuffle = document.querySelector(".button--shuffle");
const buttonRepeat = document.querySelector(".button--repeat");
const track = document.querySelector(".track-number");
const trackName = document.querySelector(".track-name");
const trackInfo = document.querySelector(".track-info");
const trackTimeStart = document.querySelector(".track-time__start");
const trackTimeEnd = document.querySelector(".track-time__end");
const progress = document.querySelector(".progress");
const withinTrackName = document.querySelectorAll(".track-name > h3");

// ||| Initialize local variables
const playlistLength = 21;
let playlist = [];
let currentTrack = 0;

// ||| Initialize HTML elements
track.textContent = 1;
buttonPause.style.display = "none";

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
    buttonPlay.addEventListener("click", playAndPause);
    buttonPause.addEventListener("click", playAndPause);
    buttonNext.addEventListener("click", playlistLogic);
    buttonPrev.addEventListener("click", playlistLogic);
    buttonShuffle.addEventListener("click", playlistLogic);
    buttonRepeat.addEventListener("click", playlistLogic);
}

// ||| Determines if the event plays or pauses the current song and sets the button accordingly
function playAndPause(event) {
    if (
        event.target.classList.contains("button--play") ||
        event.target.parentElement.classList.contains("button--play")
    ) {
        playlist[currentTrack].play();
        showPauseButtonAndTrackNumber();
        // trackTime(); fixme: don't reinstate until progress bar works for all songs
    } else {
        playlist[currentTrack].pause();
        buttonPause.replaceWith(buttonPlay);
        buttonPlay.style.display = "block";
    }
    showHidden();
}

// ||| Makes it so that every song other than the current one is not playing and will restart from the beginning if it is played again. It then checks the next song to be played (depending on if it was "next" or "previous" in the playlist), sets the counter and makes that the new current song to play.
function playlistLogic(event) {
    playlist[currentTrack].pause();
    playlist[currentTrack].currentTime = 0;
    if (
        event.target.classList.contains("button--prev") ||
        event.target.parentElement.classList.contains("button--prev")
    ) {
        checkBeginning();
    } else if (
        event.target.classList.contains("button--next") ||
        event.target.parentElement.classList.contains("button--next")
    ) {
        checkEnd();
    } else if (
        event.target.classList.contains("button--shuffle") ||
        event.target.parentElement.classList.contains("button--shuffle")
    ) {
        shufflePlaylist();
    } else if (
        event.target.classList.contains("button--repeat") ||
        event.target.parentElement.classList.contains("button--repeat")
    ) {
        repeatSong();
    }
    track.textContent = currentTrack + 1;
    playlist[currentTrack].play();
    showPauseButtonAndTrackNumber();
    showHidden();
    // trackTime(); fixme: don't reinstate until progress bar works for all songs
}

// ||| The first time a user clicks on a valid button to start the music player app, any elements of the original html with a display "hidden" are shown.
function showHidden() {
    trackName.style.display = "flex";
    trackInfo.style.display = "flex";
    buttonRepeat.style.display = "block";
    buttonShuffle.style.display = "block";
    buttonPrev.style.display = "block";
    buttonNext.style.display = "block";
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

// ||| Repeats the current song in the playlist
function repeatSong() {
    playlist[currentTrack].pause();
    playlist[currentTrack].currentTime = 0;
    playlist[currentTrack].play();
}

// ||| Make sure that every time a new song is played, the default function of the middle button (ie. the play and pause button) is always to pause the current track by hiding the play button -- the only time the pause icon is displayed is if the user clicks the play button or when the page reloads.
function showPauseButtonAndTrackNumber() {
    buttonPlay.replaceWith(buttonPause);
    buttonPause.style.display = "block";
    withinTrackName.forEach(function (track) {
        track.style.display = "inline";
    });
}

// ||| Checks if the current song is at the end of the playlist, if it is then the next song cycles back to the beginning of the playlist.
function checkEnd() {
    if (currentTrack < playlistLength) {
        currentTrack++;
    } else {
        currentTrack = 0;
    }
    return currentTrack;
}

// ||| Checks if the current song is at the beginning of the playlist, if it is then the next song played (ie. the "previous" one in the playlist) cycles back to the end of the playlist.
function checkBeginning() {
    if (currentTrack > 0) {
        currentTrack--;
    } else if (currentTrack <= 0) {
        currentTrack = playlistLength;
    }
    return currentTrack;
}

function trackTime() {
    let seconds = 0;
    let minutes = 0;
    let mins = Math.floor(playlist[currentTrack].duration / 60);
    let secs = Math.floor(playlist[currentTrack].duration % 60);
    let progressValue = playlist[currentTrack].duration / 100;
    let progressMax = playlist[currentTrack].duration;
    trackTimeStart.textContent = "0:00";
    if (secs >= 10) {
        trackTimeEnd.textContent = `${mins}:${secs}`;
    } else {
        trackTimeEnd.textContent = `${mins}:0${secs}`;
    }

    progress.setAttribute("max", progressMax);

    setInterval(countingSeconds, 1000);
    //todo: add automatic next song when the duration of a song is reached -- the trackTimeStart and progress bar cannot go past the duration of a song!!!
    //fixme: restart this function to 0 once a new current song is playing (and pause the numbers when pause is evoked)
    function countingSeconds() {
        seconds++;
        //todo: switch//case statements
        if (seconds < 10) {
            trackTimeStart.textContent = `${minutes}:0${seconds}`;
        }
        if (seconds > 9 && seconds < 60) {
            trackTimeStart.textContent = `${minutes}:${seconds}`;
        } else if (seconds > 59) {
            seconds = 0;
            minutes++;
            trackTimeStart.textContent = `${minutes}:0${seconds}`;
        }
        progressValue++;
        progress.setAttribute("value", progressValue);
        console.log(`track = ${currentTrack}    value = ${progressValue}   max = ${progressMax}`);
    }
}

//todo: add repeat function: make it repeat after the current song is done playing (need to check if current song is still playing?). change from current logic of simply restarting the song from the beginning
//todo: make progress bar transition smoother?
//todo: add slider functionality to have users skip through songs
//todo: add volume control
//todo: check audio files have loaded in before starting (NaN is begin returned prematurely for the tractTime() function) -- add an alert that music cannot be played when files are loading
//todo: persist storage?
//todo: drag and drop for playlists eventually
// todo: slideshow of pics for each song
