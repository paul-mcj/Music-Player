# Music Player (v1.1.2)

This is a small [music player](https://paul-mcj.github.io/Music-Player/) application that plays, pauses, skips, repeats and shuffles songs! It also has slider controls for song seeking and volume input, as well as a mute button feature. All songs are originally composed and cannot be reproduced without the express written permission of their creator [mcjbeats](https://open.spotify.com/artist/1GePsi5X3577OuyoH1hN5H?si=JIUTE-1RTZetQXSl5wpk6g).

## About

By creating an array of HTML audio objects with JavaScript, this application is able to initialize those tracks and play them for users. Users perform essential music player functions, like skip songs and control the volume.

I wanted to make this project not only because I love music, but I also wanted to challenge myself into making something completely from scratch (minus the few lines of HTML code produced by Emmet). I've followed along with many coding tutorials but, wanted to deviate from boring projects (ie. to-do lists) in order to display my skills!

The app is responsive using CSS media queries, meaning it works on different devices and with different screen sizes. Below are some examples.

### ![Mobile Portrait Orientation](./mobile_portrait_gif)

### ![Mobile Landscape Orientation](./mobile_landscape_gif)

### ![Desktop](./desktop_gif)

## Challenges and Solutions

This project can be summed in two parts. The first started in Aug 2021 where I initially had the idea to make the music player. I worked really hard on it for about 2 weeks straight, and didn't have too many difficulties, as I was comfortable with various CSS methodologies and JavaScript features (like event listeners and component states).

However, that came to a halt when I wanted to implement a song seeker via an input slider. After some time working on implementing this feature to no avail, I felt it best to take a break. But, I told myself to come back to complete this project after I did more studying, so that I could get more comfortable with the JavaScript language.

Fast-forward 4 months later, and I decided to really put the finishing touches on the project. After doing a lot of Googling and looking into MDN docs, I was finally able to fix the input slider. I even thought it would be a good idea to add the volume slider in, too!

One challenge in particular was the volume itself wasn't being applied to all songs, only on the current one (meaning one song could be mute, the next super loud -- no consistency according to the slider itself like it should). The issue was I was trying to pass the function setVolume() an argument, and change the volume according to that.

I found that it worked when I got the attribute "value" from the slider itself, and passed that as a return value to set for the html audio objects. Putting it in the buttonPlay function means every song that has to play will check the current volume of the slider and set its volume to that. In other words, every time the **playTrack()** function is called, the **setVolume()** function checks for consistent volume before the next song is played (see below for details).

```javascript
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
```

Another challenge I had also had to do with the input slider. Since the "max" attribute of the progress bar wasn't set, a user was able to slide it all the way to the end, and the logic for the player would end up quickly cycling songs, often causing the audio to skip and create errors in the console.

After a while, it suddenly came to me to just make the value of the "max" attribute 99, meaning the slider can be set super close to the end, but never reach it 100% and thus, preventing terrible looping errors. It also presents a much better UX overall.

```javascript
function inputCurrentTime() {
    progress.max = 99; //stop the user from seeking to the limit of 100, otherwise songs go into a crazy looping state
    let sliderInput = (playlist[currentTrack].duration * progress.value) / 100;
    playlist[currentTrack].currentTime = sliderInput;
}
```

Once more challenge had to do with the logic of the player, and how it knew what song to automatically play after the current one finished. A lot of this depended on if the shuffle and/or repeat functions were enabled. Since both of these functions can be easily checked through DOM manipulation, it was easy enough to check for a component state and just alter the playlist order depending on what is active.

In other words:

-   If a song is supposed to repeat, let it no matter what, else;
-   If the player is in shuffle mode, a random song (that is anything other that the current one) plays next, else:
-   Play the next song in chronological order

The interesting part of this **checkEndOfSong()** functionality had to do with how often this state needed to be checked. Ultimately, I decided it was best to wrap the if/else statements in a setInterval function that checks every 3 seconds (see below for details).

```javascript
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
```

## Conclusions

Overall, I'm delighted by the outcome of my project! It looks nice and clean, works on all devices and major browsers (including Chrome, Firefox, Brave, and even DuckDuckGo), and has some neat functionalities without overdoing it in complexity.

I think there are some things that could be added to make it more immersive (maybe a slideshow of images can play when music is playing, and stop when the music stops), but the lightweight nature of the app works well, and I think shows my skills well!

## Author

-   LinkedIn: [Paul McJannet](https://www.linkedin.com/in/paul-mcjannet)
-   Github: [paul-mcj](https://github.com/paul-mcj)
