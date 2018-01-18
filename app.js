const trackText = document.querySelector('.track-text');

let wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'transparent',
    progressColor: `rgba(255,255,255,0.7)`,
	height:40,
	hideScrollbar:true,
	normalize:true,
	cursorWidth:0
});

const logo = document.querySelector('.logo');
const sidebar = document.querySelector('.side-bar');

const array = logo.textContent.split('');
const newText = array.map(letter=>{
	if(letter!=" "){
		return `<span class='letter'>${letter}</span>`;
	} else{
		return `<span class='letter'>&nbsp;&nbsp;</span>`;
	}
});

sidebar.innerHTML = newText.reverse().join('');
sidebar.addEventListener('mouseover', rotateLetters);

function rotateLetters(e){
	let ms = 0;
	[...e.target.children].reverse().forEach(child=>{
		setTimeout(function(){
			child.style.transform = `rotate(-180deg) rotate3d(2,2,2,1deg)`;
			child.addEventListener('transitionend', ()=>{
				setTimeout(function(){child.style.transform = `rotate(-180deg) `},500);
			});
		}, ms+=30);
	});
}

// PLAYER CONTROLS

const playBtn = document.querySelector('.fa-play');
playBtn.addEventListener('click', playTrack);

const nextBtn = document.querySelector('.fa-step-forward');
nextBtn.addEventListener('click', nextTrack);

const prevBtn = document.querySelector('.fa-step-backward');
prevBtn.addEventListener('click', prevTrack);

let isLoaded = false;

// INIT TRACK COUNTERS
let currentAlbum = 0;
let currentTrack = 0;
let track;

function nextTrack(){

	// CHECK TO SEE IF ALBUM HAS TRACKS IF NOT MOVE TO NEXT ALBUM
	if(!albumArray[currentAlbum][currentTrack+1]){
		// THEN CHECK TO SEE IF NEXT ALBUM IS NULL
		// IF SO RESET TO FIRST ALBUM FIRST TRACK
		if(!albumArray[currentAlbum+1]){
			currentAlbum = 0;
			currentTrack = 0;
		// ELSE INCREMENT ALBUM AND RESET TRACKS
		} else{
			currentAlbum +=1;
			currentTrack = 0;
		}
	// IF THERE ARE MORE TRACKS INCREMENT TO NEXT TRACK
	} else {
		currentTrack+=1;
	}

	lightUp(currentAlbum);
	track = albumArray[currentAlbum][currentTrack];
	trackText.textContent = track.trackStr;
	wavesurfer.load(track.src);
	updatePlaylist();
	wavesurfer.on('ready', function () {
		setPlayIcon();
		wavesurfer.play();
		isLoaded = true;
	});
}

function prevTrack(){

	// CHECK TO SEE IF ALBUM HAS TRACKS IF NOT MOVE TO PREV ALBUM
	if(!albumArray[currentAlbum][currentTrack-1]){
		// THEN CHECK TO SEE IF PREV ALBUM IS NULL
		// IF SO RESET TO LAST ALBUM LAST TRACK
		if(!albumArray[currentAlbum-1]){
			currentAlbum = albumArray.length-1;
			currentTrack = albumArray[currentAlbum].length-1;
		// ELSE DECREMENT ALBUM AND SET TO LAST ALBUM TRACK
		} else{
			currentAlbum -=1;
			currentTrack =albumArray[currentAlbum].length-1;
		}
	// IF THERE ARE MORE TRACKS DECREMENT TO NEXT TRACK
	} else {
		currentTrack-=1;
	}

	lightUp(currentAlbum);
	track = albumArray[currentAlbum][currentTrack];
	trackText.textContent = track.trackStr;
	wavesurfer.load(track.src);
	updatePlaylist();
	wavesurfer.on('ready', function () {
		setPlayIcon();
		wavesurfer.play();
		isLoaded = true;
	});
}

function setPlayIcon(){
	playBtn.classList.remove('fa-play');
	playBtn.classList.add('fa-pause');
}

function playTrack(){
	if (this.classList.contains('fa-play')){
		setPlayIcon();
		if(isLoaded){
			wavesurfer.play();
		} else{
			lightUp(currentAlbum);
			track = albumArray[currentAlbum][currentTrack];
			trackText.textContent = track.trackStr;
			wavesurfer.load(track.src);
			updatePlaylist();
			wavesurfer.on('ready', function () {
		    	wavesurfer.play();
				isLoaded = true;
			});
		}
	} else {
		this.classList.remove('fa-pause');
		this.classList.add('fa-play');
		wavesurfer.pause();
	}
}

wavesurfer.on('finish', function () {
	nextTrack();
});

// TRIGGER TRACK PLAY FROM IMAGE

const albumCovers = document.querySelectorAll('.record img');

albumCovers.forEach(cover=>{
	cover.addEventListener('click', selectAlbum);
});

function selectAlbum(e){

	const id = e.target.getAttribute('id');

	if (playBtn.classList.contains('fa-play')){
		playBtn.classList.remove('fa-play');
		playBtn.classList.add('fa-pause');
	}
	currentAlbum = id.split('');
	currentAlbum.shift();
	currentAlbum = parseInt(currentAlbum.join(''));
	currentTrack = 0;
	track = albumArray[currentAlbum][currentTrack];
	lightUp(currentAlbum);
	trackText.textContent = track.trackStr;
	wavesurfer.load(track.src);
	updatePlaylist(e.target);
	wavesurfer.on('ready', function () {
    	wavesurfer.play();
		isLoaded = true;
	});
}

function lightUp(idNum){
	// DESTROY ALL COVER LIGHT FX AND LIGHT NEW TARGET
	albumCovers.forEach(cover=>{
		cover.classList.remove('isPlaying');
	});
	document.getElementById(`_${idNum}`).classList.add('isPlaying');
}

// BURGER MENU
const burger = document.querySelector('.burger');
let burgToggle = false;
burger.addEventListener('click', burgerToggle)
function burgerToggle(){
	if(!burgToggle){
		document.querySelector('.bar1').style.display='none';
		document.querySelector('.bar2').style.transform = ('rotate(45deg)');
		document.querySelector('.bar3').style.top = ('30%');
		document.querySelector('.bar3').style.transform = ('rotate(-45deg)');
		document.querySelector('.bar2').style.top = ('30%');
		document.querySelector('.bar3').addEventListener('transitionend', function(){
			document.querySelector('.playlist-card-container').style.transform = 'translateX(0)';
			document.querySelector('.playlist-card-container').addEventListener('transitionend',()=>burgToggle=true);
		});
	}else{
		document.querySelector('.bar1').style.display='';
		document.querySelector('.bar2').style.transform = ('');
		document.querySelector('.bar3').style.top = ('');
		document.querySelector('.bar3').style.transform = ('');
		document.querySelector('.bar2').style.top = ('');
		document.querySelector('.bar3').addEventListener('transitionend', function(){
			document.querySelector('.playlist-card-container').style.transform = '';
			document.querySelector('.playlist-card-container').addEventListener('transitionend',()=>burgToggle=false);
		});
	}
}
const trackBox = document.querySelector('.track-box');

function updatePlaylist(){
	if(!burgToggle){
		burgerToggle();
	}
	track = albumArray[currentAlbum][currentTrack];
	document.querySelector('.album').textContent = track.album;
	document.querySelector('.cover-art').setAttribute('src', track.img);
	const trackBoxStr = albumArray[currentAlbum].map(track=>{
		let s = track.trackStr;
		s = s.substring(s.indexOf('-')+2);
		let trackNum = albumArray[currentAlbum].indexOf(track) +1;
		return `<li data-track="${albumArray[currentAlbum].indexOf(track)}">${trackNum<10?'0'+trackNum:trackNum} ${s}</li>`;
	});
	trackBox.innerHTML = trackBoxStr.join('');
	[...trackBox.children].forEach(child=>{
		child.addEventListener('click', playlistTrackPlay);
	});
}

function playlistTrackPlay(){
	if (playBtn.classList.contains('fa-play')){
		setPlayIcon();
	}
	lightUp(currentAlbum);
	currentTrack = this.dataset.track;
	track = albumArray[currentAlbum][currentTrack];

	trackText.textContent = track.trackStr;
	wavesurfer.load(track.src);
	updatePlaylist();
	wavesurfer.on('ready', function () {
		wavesurfer.play();
		isLoaded = true;
	});
}
