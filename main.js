/*JS file for Music Player "index.html"*/

/******************************************************************************
	Table of Contents
	-----------------
	1. Global Variables and App Initialization Measures
	2. Event Listeners
	3. UI-specific Functions
        3.1 -- playTrack()
        3.2 -- pauseTrack()
        3.3 -- nextTrack()
        3.4 -- prevTrack()
        3.5 -- repeatTrack()
        3.6 -- shuffleTrack()
        3.7 -- inputCurrentTime()
        3.8 -- showCurrentTime()
        3.9 -- showHidden()
        3.10 -- showVolumeControl()
        3.11 -- changeVolumeIcon()
    4. Global Functions
        4.1 -- getCurrentTime()
        4.2 -- setVolume()
        4.3 -- playlistLogic()
        4.4 -- updateTrack()
        4.5 -- checkEndOfSong()
        4.6 -- shufflePlaylist()
        4.7 -- formatTime(time)
        
*******************************************************************************/

/******************************************************************************
1. Global Variables and App Initialization Measures
******************************************************************************/

// Global variables for DOM manipulation
const buttonPlay = document.querySelector(".button--play");
const buttonPause = document.querySelector(".button--pause");
const buttonNext = document.querySelector(".button--next");
const buttonPrev = document.querySelector(".button--prev");
const buttonShuffle = document.querySelector(".button--shuffle");
const buttonRepeat = document.querySelector(".button--repeat");
const track = document.querySelector(".track-number");
const trackName = document.querySelector(".track-name");
const headersWithinTrackName = document.querySelectorAll(".track-name > h3");
const trackInfo = document.querySelector(".track-info");
const trackTimeStart = document.querySelector(".track-time__start");
const trackTimeEnd = document.querySelector(".track-time__end");
const progress = document.querySelector(".progress");
const volumeChange = document.querySelector(".volume-change");
const volumeControl = document.querySelector(".volume-control");
const volumeSection = document.querySelector(".volume-section");

// Initialized variables -- some of these can be changed depending on the number of tracks to be added to the playlist over time
let playlist = [];
const playlistLength = 6;
let currentTrack = 0;
track.textContent = 1;

// Build the array of audio tracks
for (i = 1; i <= playlistLength + 1; i++) {
    let index = `./tracks/track${i}.mp3`;
    let track = new Audio(index);
    playlist.push(track);
}

// Call this function when starting up the app
loadEventListeners();

/******************************************************************************
2. Event Listeners
******************************************************************************/

// Loads all event listeners
function loadEventListeners() {
    buttonPlay.addEventListener("click", playTrack);
    buttonPause.addEventListener("click", pauseTrack);
    buttonNext.addEventListener("click", nextTrack);
    buttonPrev.addEventListener("click", prevTrack);
    buttonShuffle.addEventListener("click", shuffleTrack);
    buttonRepeat.addEventListener("click", repeatTrack);
    progress.addEventListener("input", inputCurrentTime);
    volumeChange.addEventListener("click", changeVolumeIcon);
    volumeControl.addEventListener("input", setVolume);
    window.addEventListener("resize", showVolumeSection);
}

/******************************************************************************
3. UI-specific Functions
******************************************************************************/

// 3.1 Handles a lot of logic when staring the app as well as when any song needs to play: sets the volume for the currentTrack; replaces the play button with the pause button; displays all other buttons and the volume control; defines the trackEndTime to display; defines the current time of the song to display, and checks what the next song played will be.
function playTrack() {
    playlist[currentTrack].play();
    buttonPlay.replaceWith(buttonPause);
    buttonPause.style.display = "block";
    showHidden();
    showVolumeSection();
    trackTimeEnd.textContent = formatTime(playlist[currentTrack].duration);
    trackTimeStart.textContent = "0:00";
    showCurrentTime();
    checkEndOfSong();
    setVolume();
}

// 3.2 Pauses the currentTrack and replaces the pause button with the play button
function pauseTrack() {
    playlist[currentTrack].pause();
    buttonPause.replaceWith(buttonPlay);
    buttonPlay.style.display = "block";
}

// 3.3 Checks if the current song is at the end of the playlist. If it is then the next song cycles back to the beginning, otherwise its simply the next song in the array. If the shuffle function is active, a random track is chosen as the next track. If the user explicitly clicks the next button while a repeat function is in affect, it is removed.
function nextTrack() {
    playlistLogic();
    if (buttonShuffle.children[1].classList.contains("shuffle-active")) {
        shufflePlaylist();
    } else if (currentTrack < playlistLength) {
        currentTrack++;
    } else {
        currentTrack = 0;
    }
    buttonRepeat.children[1].classList.remove("fas", "one", "fa-circle", "infinity", "fa-infinity");
    buttonRepeat.children[1].classList.add("repeat");
    updateTrack();
}

// 3.4 Checks if the current song is at the beginning of the playlist, if it is then the next song played (ie. the "previous" one in the playlist) cycles back to the end of the playlist. If the previous button is clicked while the repeat function is enabled, it is removed instead.
function prevTrack() {
    playlistLogic();
    if (currentTrack > 0) {
        currentTrack--;
    } else if (currentTrack <= 0) {
        currentTrack = playlistLength;
    }
    buttonRepeat.children[1].classList.remove("fas", "one", "fa-circle", "infinity", "fa-infinity");
    buttonRepeat.children[1].classList.add("repeat");
    updateTrack();
}

// 3.5 Repeats the current song in the playlist only once if the button is clicked once. It replays the song infinitely if clicked once more. Clicked a third time re-sets it back to the default (ie. repeat is removed).
function repeatTrack() {
    if (buttonRepeat.children[1].classList.contains("repeat")) {
        buttonRepeat.children[1].classList.remove("repeat");
        buttonRepeat.children[1].classList.add("one", "fas", "fa-circle");
    } else if (buttonRepeat.children[1].classList.contains("one")) {
        buttonRepeat.children[1].classList.remove("one", "fa-circle");
        buttonRepeat.children[1].classList.add("infinity", "fas", "fa-infinity");
    } else if (buttonRepeat.children[1].classList.contains("infinity")) {
        buttonRepeat.children[1].classList.remove("infinity", "fas", "fa-infinity");
        buttonRepeat.children[1].classList.add("repeat");
    }
}

// 3.6 Enables the shuffling feature by adding an "active" class to the button.
function shuffleTrack() {
    if (buttonShuffle.children[1].classList.contains("shuffle")) {
        buttonShuffle.children[1].classList.add("fas", "fa-circle", "shuffle-active");
        buttonShuffle.children[1].classList.remove("shuffle");
    } else {
        buttonShuffle.children[1].classList.remove("fas", "fa-circle", "shuffle-active");
        buttonShuffle.children[1].classList.add("shuffle");
    }
}

// 3.7 Allows the user to seek through the song by using the slider bar
function inputCurrentTime() {
    progress.max = 99; //stop the user from seeking to the limit of 100, otherwise songs go into a crazy looping state
    let sliderInput = (playlist[currentTrack].duration * progress.value) / 100;
    playlist[currentTrack].currentTime = sliderInput;
}

// 3.8 Displays the current time of the current track. Updates every 100ms.
function showCurrentTime() {
    setInterval(() => {
        progress.value = (getCurrentTime() / playlist[currentTrack].duration) * 100;
        trackTimeStart.textContent = formatTime(getCurrentTime());
    }, 100);
}

// 3.9 The first time a user clicks on the play button to start the music player app, all other buttons of the original html with "display:none" are then changed to be shown.
function showHidden() {
    trackName.style.display = "flex";
    trackInfo.style.display = "flex";
    buttonRepeat.style.display = "block";
    buttonShuffle.style.display = "block";
    buttonPrev.style.display = "block";
    buttonNext.style.display = "block";
}

// 3.10 Makes sure that the volume section element only shows on non-mobile displays.
function showVolumeSection() {
    // The number 640 is used as the limiter because it is 40em divided by 16 in pixels. 40em is the breakpoint in the CSS file from mobile to larger displays, so its used here for consistency, and 16 is the default calculated value used in the CSS too, as determined by the global font-size.
    // Check a button's current display before showing the volume control element -- if it is still not showing, neither should volume control (buttonShuffle is picked here, but any of the major buttons would do).
    // But if the button is showing, then the innerWidth of the page must not be mobile device for the control to show, too.
    if (window.innerWidth > 639 && buttonShuffle.style.display === "block") {
        volumeSection.style.display = "flex";
    } else {
        volumeSection.style.display = "none";
    }
}

// 3.11 If the button is clicked, then mute it, otherwise turn it back to the last volume level. Change the icon to me mute if its silent, little volume if its quiet-ish, and loud icon when its over 70%.
function changeVolumeIcon() {
    if (!volumeChange.children[0].classList.contains("fa-volume-mute")) {
        volumeChange.children[0].classList.remove("fa-volume-up", "fa-volume-down");
        volumeChange.children[0].classList.add("fas", "fa-volume-mute");
        //set the volume to zero
        playlist[currentTrack].volume = 0;
    } else if (volumeChange.children[0].classList.contains("fa-volume-mute")) {
        volumeChange.children[0].classList.remove("fa-volume-mute");
        setVolume();
    }
}

/******************************************************************************
4. Global Functions
******************************************************************************/

// 4.1 get the current time of the current track playing
function getCurrentTime() {
    return playlist[currentTrack].currentTime;
}

// 4.2 Gathers the value of the volumeControl element and sets the current track's volume to that number. If the volume is at zero, display the volumeChange button as muted; if its between 1 and 70%, show the volume-down icon; if its higher than 70%, show the volume-up icon.
function setVolume() {
    let volume = (playlist[currentTrack].volume = volumeControl.value / 100);
    if (volume === 0) {
        volumeChange.children[0].classList.add("fas", "fa-volume-mute");
        volumeChange.children[0].classList.remove("fa-volume-down", "fa-volume-up");
    } else if (volume > 0 && volume < 0.7) {
        volumeChange.children[0].classList.add("fas", "fa-volume-down");
        volumeChange.children[0].classList.remove("fa-volume-mute", "fa-volume-up");
    } else if (volume >= 0.7) {
        volumeChange.children[0].classList.add("fas", "fa-volume-up");
        volumeChange.children[0].classList.remove("fa-volume-mute", "fa-volume-down");
    }
    return volume;
}

// 4.3 Pauses the currentTrack and resets its currentTime back to the beginning (used in conjunction with other functions). This function is paramount in making sure audio tracks don't produce overlapping audio.
function playlistLogic() {
    playlist[currentTrack].pause();
    playlist[currentTrack].currentTime = 0;
}

// 4.4 Updates the currentTrack number for the display, and also calls the playTrack() function to have the song start playing (used in conjunction with other functions).
function updateTrack() {
    track.textContent = currentTrack + 1;
    playTrack();
}

// 4.5 This function decides what happens to the next played song in the playlist, depending on the current states of the shuffle and repeat buttons.
function checkEndOfSong() {
    setInterval(() => {
        //check if the current song duration has reached its end (this is checked every three seconds)
        if (playlist[currentTrack].currentTime === playlist[currentTrack].duration) {
            //check status of repeat button
            if (buttonRepeat.children[1].classList.contains("one")) {
                playlistLogic();
                playTrack();
                buttonRepeat.children[1].classList.remove("one", "fas", "fa-circle");
                buttonRepeat.children[1].classList.add("repeat");
            } else if (buttonRepeat.children[1].classList.contains("infinity")) {
                playlistLogic();
                playTrack();
            }
            //check status of shuffle button
            else if (buttonShuffle.children[1].classList.contains("shuffle-active")) {
                playlistLogic();
                shufflePlaylist();
                updateTrack();
            }
            //default is to play the next song
            else if (buttonRepeat.children[1].classList.contains("repeat")) {
                nextTrack();
            }
        }
    }, 3000);
}

// 4.6 Finds a random number between 0 and the playlistLength (inclusive) to return as the next currentTrack. If the number returned is the same as the currentTrack, the function is recalled recursively until a unique random track is returned.
function shufflePlaylist() {
    console.log(`currentTrack: ${currentTrack}`);
    function randomize() {
        return Math.floor(Math.random() * (playlistLength - 0 + 1));
    }
    let randomTrack = randomize();
    console.log(`randomTrack: ${randomTrack}`);
    if (randomTrack !== currentTrack) {
        currentTrack = randomTrack;
        return currentTrack;
    } else {
        shufflePlaylist();
    }
}

// 4.7 This formats the currentTime of each audio object into a more readable format to display to the user.
function formatTime(time) {
    let min = Math.floor(time / 60);
    if (min < 10) {
        min = `${min}`;
    }
    let sec = Math.floor(time % 60);
    if (sec < 10) {
        sec = `0${sec}`;
    }
    return `${min}:${sec}`;
}
