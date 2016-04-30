// Entry component with image and sound
enyo.kind({
	name: "VideoViewer.Item",
	kind: enyo.Control,
	published: {
		code: "",
		title: "",
		category: "",
		isFavorite: false,
		imgSuffix: ""
	},
	events: {
		onVideoPlayed: ""
	},
	classes: "item",
	components: [
		{ name: "spinner", kind: "Image", src: "images/spinner-dark.gif", classes: "spinner" },
		{ name: "background", classes: "itemImage", kind: "Image", src: "images/notloaded.png" },
		{ name: "itemImage", classes: "itemImage", kind: "Image", showing: false, onload: "imageLoaded", onerror: "defaultImage", ontap: "showVideo" },
		{ name: "itemPlay", classes: "itemPlay", kind: "Image", showing: false, src: "icons/play.svg", ontap: "showVideo" },
		{ name: "itemFavorite", classes: "itemFavorite", kind: "Image", src: "icons/notfavorite.svg", showing: false, ontap: "showVideo" },
		{ name: "itemOverlay", classes: "itemOverlay" },
		{ name: "itemTitle", classes: "itemTitle", content: "" }
	],

	// Constructor
	create: function() {
		this.inherited(arguments);
		this.nameChanged();
		this.titleChanged();
		this.isFavoriteChanged();
	},

	// Item setup
	nameChanged: function() {
		var imgsuffix = this.imgSuffix ? this.imgSuffix : "";
		var imgurl = Util.getImages().replace(new RegExp("%id%", "g"),this.code).replace("%imgsuffix%", this.imgSuffix);
		if (typeof chrome != 'undefined' && chrome.app && chrome.app.runtime) {
			// HACK: When in Chrome App image should be load using a XmlHttpRequest
			var xhr = new XMLHttpRequest();
			var that = this;
			xhr.open('GET', imgurl, true);
			xhr.responseType = 'blob';
			xhr.onload = function(e) {
				that.$.itemImage.setAttribute("src", window.URL.createObjectURL(this.response));
			};
			xhr.send();
		} else {
			this.$.itemImage.setAttribute("src", imgurl);
		}
	},

	titleChanged: function() {
		this.$.itemTitle.setContent(this.title);
	},

	isFavoriteChanged: function() {
		this.$.itemFavorite.setShowing(this.isFavorite);
	},

	imageLoaded: function() {
		this.$.itemImage.setShowing(true);
		this.$.itemPlay.setShowing(true);
		this.$.spinner.setShowing(false);
		this.$.background.setShowing(false);
	},

	defaultImage: function() {
		this.$.itemImage.setAttribute("src", "images/notloaded.png");
		this.$.itemImage.setShowing(true);
		this.$.itemPlay.setShowing(true);
		this.$.spinner.setShowing(false);
		this.$.background.setShowing(false);
	},

	videoURL: function() {
		return Util.getVideos().replace(new RegExp("%id%", "g"),this.code)+"."+constant.videoType;

	},

	// Handle event
	showVideo: function() {
		this.doVideoPlayed();
	}
});