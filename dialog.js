// Video dialog
enyo.kind({
	name: "VideoViewer.VideoDialog",
	kind: enyo.Popup,
	classes: "video-dialog",
	centered: false,
	modal: true,
	floating: true,
	published: {
		item: null
	},
	components: [
		{name: "header", classes: "video-header toolbar", components: [
			{name: "favoritebutton", kind: "Button", classes: "toolbutton video-favorite-button pull-left", title: "Favorite", ontap: "setFavorite"},
			{name: "title", classes: "video-title", content: ""},
			{name: "closebutton", kind: "Button", classes: "toolbutton video-close-button pull-right", title: "Close", ontap: "closeDialog"}
		]},
		{name: "video", classes: "video-item", kind: "enyo.Video", fitToWindow: false, autoplay: true, showControls: true, poster: "images/notloaded.png"},
	],

	// Constructor
	create: function() {
		this.inherited(arguments);
		this.itemChanged();
	},

	rendered: function() {
		if (this.item != null) {
			this.$.favoritebutton.applyStyle("background-image", "url(icons/"+(!this.item.isFavorite?"not":"")+"favorite.svg)");
			if (!this.init) {
				this.init = true;
				var time = Util.getReadTime(this.item.code);
				if (time)
					this.$.video.setCurrentTime(time);
			}
		}
	},

	itemChanged: function() {
		this.init = false;
		if (this.item != null) {
			this.$.title.setContent(this.item.title);
			this.$.video.setSrc(this.item.videoURL());
			this.render();
		}
	},

	// Process events
	closeDialog: function() {
		this.$.video.pause();
		Util.setReadTime(this.item.code, this.$.video.getCurrentTime());
		this.$.video.unload();
		this.item = null;
		Util.saveContext();
		this.hide();
		if (Util.onSugar()) {
			// HACK: Force refresh screen on Sugar to avoid video issue
			Util.sugar.sendMessage("refresh-screen", Util.context);
		}
	},

	setFavorite: function() {
		this.item.setIsFavorite(!this.item.isFavorite);
		Util.setFavorite(this.item.code, this.item.isFavorite);
		this.rendered();
	}
});
