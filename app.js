
const playButton = document.querySelector('#play-btn');
const tracklistMusic = document.querySelector('.tracklist-music');
const currSongContainer = document.querySelector('.cur-song-container');
const currAudioSrc = document.querySelector('#cur-song-src');
const currSongImg = document.querySelector('#cur-track-img');
const currSongTitle = document.querySelector('#cur-song-title');
const currTrackSlider = document.querySelector('#track-time-slider');
const currTrackTime = document.querySelector('#track-cur-time');
const currTrackFullTime = document.querySelector('#full-track-time');
const prevTrackButton = document.querySelector('#left-btn');
const nextTrackButton = document.querySelector('#right-btn');
const shufflebtn = document.querySelector('#shuffle-btn');
const loopButton = document.querySelector('#loop-btn');
const currtrackVolume = document.querySelector('#curr-track-volume');
const currtrackText = document.querySelector('#curr-track-volume-nums');
const volumeButton = document.querySelector('#volume-btn');
const volumeIcon = document.querySelector('#vol-icon');
const playBtnImg = document.querySelector('#play-btn-img');

// playButton.addEventListener('click', songList);


// Get data from JSON file

const getDataFromJsonFile = async () => {
    const response = await fetch('songs.json');
    const data = await response.json();
    let id = 1;
    data.forEach(el => {
        el.audio = new Audio(`${el.title}`);
        el.audio.dataset.trackid = id++;
    });
    return data
}



// cur audio volume 
currtrackVolume.addEventListener('input', () => {

    if(currAudioSrc.muted === true){
        volumeIcon.classList.remove('fa-volume-xmark');
        volumeIcon.classList.add('fa-volume-high');
        currAudioSrc.muted = false;
    };
    
    
     if(Math.floor(currAudioSrc.volume * 100) < 50){
        volumeIcon.classList.remove('fa-volume-high')
        volumeIcon.classList.add('fa-volume-low')
    } else if(Math.floor(currAudioSrc.volume * 100) >= 50){
        volumeIcon.classList.remove('fa-volume-low')
        volumeIcon.classList.add('fa-volume-high')
    }


    currAudioSrc.volume = currtrackVolume.value
    currtrackText.innerText = `${Math.floor(currAudioSrc.volume * 100)}%`
   
})


// vol -btn
volumeButton.addEventListener('click', () => {
    if(volumeIcon.classList.contains('fa-volume-high')){
        volumeIcon.classList.remove('fa-volume-high')
        volumeIcon.classList.add('fa-volume-xmark')
        currAudioSrc.muted = true

    } else if(volumeIcon.classList.contains('fa-volume-low')){
        volumeIcon.classList.remove('fa-volume-low')
        volumeIcon.classList.add('fa-volume-xmark')
        currAudioSrc.muted = true

    }else if(volumeIcon.classList.contains('fa-volume-xmark')
             && +currtrackText.innerText.replace('%', '') < 50){
        volumeIcon.classList.remove('fa-volume-xmark')
        volumeIcon.classList.add('fa-volume-low')
        currAudioSrc.muted = false
    } else if(volumeIcon.classList.contains('fa-volume-xmark')
             && +currtrackText.innerText.replace('%', '') >= 50){
        volumeIcon.classList.remove('fa-volume-xmark')
        volumeIcon.classList.add('fa-volume-high')
        currAudioSrc.muted = false
    };
    


    
})

async function nextBtnLogic(){
    let i = 0;
    const songs = await getDataFromJsonFile();

    

    // shuffle btn
    shufflebtn.addEventListener('click', () => {
        for (let i = songs.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        
            // swap elements array[i] and array[j]
            // we use "destructuring assignment" syntax to achieve that
            [songs[i], songs[j]] = [songs[j], songs[i]];
          }

    })

    // prev track btn
    prevTrackButton.addEventListener('click', () => {
        if(i <= songs.indexOf(songs[0])){
            i = songs.length-1;
            songList(i, songs)
        } else {
            i--
            console.log('preview')
            songList(i, songs)
        }
        
    })

    // play btn
    playButton.addEventListener('click', () => {
        songList(i, songs)
    });

    // next track btn
    nextTrackButton.addEventListener('click', () => {
        let currTrackState = 'right'
        if(i >= songs.length-1){
            i = 0;
            songList(i, songs)
        } else {
            i++
            songList(i, songs, currTrackState)
        }
        
    })

// Loop btn
    loopButton.addEventListener('click', () => {
        if(currAudioSrc.loop === false){
            currAudioSrc.loop = true;
            loopButton.style.color = '#d81111'
        } else {
            currAudioSrc.loop = false;
            loopButton.style.color = '#1c1c1c'
        }
        
    })
}

nextBtnLogic();

// show curr track timer
function trackStartTime (arr) {
    // console.log('hello')
    let seconds = (arr.currentTime);

    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds - (hrs * 3600)) / 60);
    let secs = Math.floor(seconds % 60);
    
    if (secs < 10) secs = `0${secs}`;
    if (mins < 10) mins = `0${mins}`;
    currTrackTime.innerText = `${mins}:${secs}`;
    currTrackSlider.value = Math.floor(arr.currentTime);

    if(Math.floor(currAudioSrc.duration/60) < 10){
        currTrackFullTime.innerText = `0${Math.floor(currAudioSrc.duration/60)}:${Math.floor(currAudioSrc.duration % 60)}`
    } else {
        currTrackFullTime.innerTex = `${Math.floor(currAudioSrc.duration/60)}:${Math.floor(currAudioSrc.duration % 60)}`
    }

    currTrackSlider.max = Math.floor(currAudioSrc.duration)
    
}



async function songList (indx, songs, currTrackState){
    songs = await songs ?? await getDataFromJsonFile();
    indx = 0 | indx;
    currTrackState = await currTrackState ?? ""

    if(indx >= songs.length){
        clearTimeout(songTimer);
        indx = 0;
        console.log(indx)
        nextSong()
        // return
    } else {
        function nextSong(){
            if(indx >= songs.length){
                playBtnImg.classList.remove('fa-pause')
                playBtnImg.classList.add('fa-play')
                clearTimeout(songTimer);
                currAudioSrc.load();
                currAudioSrc.currentTime = 0;
                currSongImg.src = '';
                currSongTitle.innerText = ''
                
                console.log('1')
                return
            } else {
                if(playBtnImg.classList.contains('fa-play') && currAudioSrc.currentTime > 0){
                    if(currTrackState === 'right'){
                        clearTimeout(songTimer)
                    // playBtnImg.classList.remove('fa-play')
                    // playBtnImg.classList.add('fa-pause');
                    currSongImg.src = songs[indx].image;
                    currAudioSrc.src = songs[indx].title;
                    currSongTitle.innerText = songs[indx].title
                                .replace('things/music/', '')
                                .replace('.mp3', '');
                    currAudioSrc.currentTime = 0;
                    currAudioSrc.play();
                    
                 songTimer = setInterval(() => {
                        trackStartTime(currAudioSrc);
                        console.log('timer')
                    }, 100);
            
                    currTrackSlider.addEventListener('input', () => {
                        currAudioSrc.currentTime = Math.floor(currTrackSlider.value);
                        trackStartTime(currAudioSrc)
                    })
            
                    indx++
                    console.log(currTrackState)
                    } 
                    clearTimeout(songTimer)
                    playBtnImg.classList.remove('fa-play')
                    playBtnImg.classList.add('fa-pause');
                    // currSongImg.src = songs[indx].image;
                    // currAudioSrc.src = songs[indx].title;
                    // currSongTitle.innerText = songs[indx].title
                                // .replace('things/music/', '')
                                // .replace('.mp3', '');
                    // currAudioSrc.currentTime = 0;
                    currAudioSrc.play();
                    
                 songTimer = setInterval(() => {
                        trackStartTime(currAudioSrc);
                        console.log('timer')
                    }, 100);
            
                    currTrackSlider.addEventListener('input', () => {
                        currAudioSrc.currentTime = Math.floor(currTrackSlider.value);
                        trackStartTime(currAudioSrc)
                    })
            
                    indx++
                    console.log('first')
                } else if(playBtnImg.classList.contains('fa-pause') && currAudioSrc.currentTime > 0){
                    if(currAudioSrc.ended === true){
                        clearTimeout(songTimer)
                        playBtnImg.classList.remove('fa-play')
                    playBtnImg.classList.add('fa-pause');
                    currSongImg.src = songs[indx].image;
                    currAudioSrc.src = songs[indx].title;
                    currSongTitle.innerText = songs[indx].title
                                .replace('things/music/', '')
                                .replace('.mp3', '');
                                currAudioSrc.load()
                    currAudioSrc.currentTime = 0;
                    currAudioSrc.play();
                    
                 songTimer = setInterval(() => {
                        trackStartTime(currAudioSrc);
                        console.log('timer')
                    }, 100);
            
                    currTrackSlider.addEventListener('input', () => {
                        currAudioSrc.currentTime = Math.floor(currTrackSlider.value);
                        trackStartTime(currAudioSrc)
                    })
            
                    indx++
                    console.log('ended')
                    } else if(currTrackState === 'right'){
                        clearTimeout(songTimer);
                        currSongImg.src = songs[indx].image;
                        currAudioSrc.src = songs[indx].title;
                        currSongTitle.innerText = songs[indx].title
                                    .replace('things/music/', '')
                                    .replace('.mp3', '');
                        currAudioSrc.currentTime = 0;
                        currAudioSrc.play();
                        
                     songTimer = setInterval(() => {
                            trackStartTime(currAudioSrc);
                            console.log('timer')
                        }, 100);
                
                        currTrackSlider.addEventListener('input', () => {
                            currAudioSrc.currentTime = Math.floor(currTrackSlider.value);
                            trackStartTime(currAudioSrc)
                        })
                
                        indx++
                        console.log(currTrackState)
                    } else {
                        playBtnImg.classList.remove('fa-pause')
                        playBtnImg.classList.add('fa-play')
                        currAudioSrc.pause();
                        clearTimeout(songTimer);
                        console.log('second')
                    }
                    
                } else if(playBtnImg.classList.contains('fa-play') && currAudioSrc.currentTime <= 1){
                    
                    playBtnImg.classList.remove('fa-play')
                    playBtnImg.classList.add('fa-pause');
                    currSongImg.src = songs[indx].image;
                    currAudioSrc.src = songs[indx].title;
                    currSongTitle.innerText = songs[indx].title
                                .replace('things/music/', '')
                                .replace('.mp3', '');
                    currAudioSrc.currentTime = 0;
                    currAudioSrc.play();
                    
                 songTimer = setInterval(() => {
                        trackStartTime(currAudioSrc);
                        console.log('timer')
                    }, 100);
            
                    currTrackSlider.addEventListener('input', () => {
                        currAudioSrc.currentTime = Math.floor(currTrackSlider.value);
                        trackStartTime(currAudioSrc)
                    })
            
                    indx++
                    console.log('third')
                }

                
            }
            
        }
    }  

    

        nextSong()

        currAudioSrc.addEventListener('ended', () => {
        nextSong();
        })
       
    // console.log(indx)

    // if()
}


const dispaySongs = async () => {
    const songs = await getDataFromJsonFile();
    const songTable = document.createElement('table');
    songTable.classList = 'song-table';
    tracklistMusic.appendChild(songTable);
    songTable.innerHTML = `
    <tr>
    <th>id</th>
    <th>Cover</th>
    <th>Title</th>
  </tr>
  `
    songs.forEach(el => {
        el.audio = new Audio(`${el.title}`);
        
        el.audio.addEventListener('ended', () => {
            if(el.audio.ended){
                el.audio[el.indexOf(el+1)].play()
            }
            
        })
        songTable.innerHTML += `
        <tr>
        <td class="song-list-id">${el.id}</td>
        <td class="song-list-img"><img  src="${el.image}" width="40" height="40"></img></td>
        <td>${el.title.replace('things/music/', '').replace('.mp3', '')}</td>
        <td id="show-audio"><audio src="${el.title}"></audio></td>
        </tr>
        `
        // console.log(el.audio)
    })
    
    // if()
    // console.log(songs)
}

// dispaySongs()