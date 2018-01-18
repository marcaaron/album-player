class Audio {
	constructor(trackStr, src, album, img){
		this.trackStr = trackStr;
		this.src = src;
		this.album = album;
		this.img = img;
	}
}

const jacaranda = [
	new Audio(
		'BAD GYAL - JACARANDA (PROD. DUBBEL DUTCH)', 'mp3/jacaranda.mp3', 'BAD GYAL - JACARANDA', 'badgyaljac.jpeg'
	)
];


let albumArray = [];
albumArray.push(jacaranda);
