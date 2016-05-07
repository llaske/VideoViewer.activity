

// Constants
var constant = {};

constant.pageCount = 4;
constant.libraries = [
	{
		name: "canope",
		title: "Canopé",
		database: "http://laske.fr/tmp/torido/canope.php",
		videos: "https://videos.reseau-canope.fr/download.php?file=lesfondamentaux/%id%_sd",
		images: "https://www.reseau-canope.fr/lesfondamentaux/uploads/tx_cndpfondamentaux/%id%%imgsuffix%.png"
	},
	{
		name: "khanacademy",
		title: "Khan Academy",
		database: "http://laske.fr/tmp/torido/khan.php",
		videos: "http://s3.amazonaws.com/KA-youtube-converted/%id%.mp4/%id%",
		images: "http://s3.amazonaws.com/KA-youtube-converted/%id%.mp4/%id%.png"
	},
];
constant.videoType = "mp4";


