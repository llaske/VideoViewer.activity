// Library dialog
enyo.kind({
	name: "VideoViewer.LibraryDialog",
	kind: enyo.Popup,
	classes: "library-dialog",
	centered: false,
	modal: false,
	floating: true,
	components: [
		{name: "scroller", kind: "Scroller", components: [
			{name: "items", classes: "library-content", kind: "Repeater", onSetupItem: "setupItem", components: [
				{ classes: "library", components: [
					{ name: "itemImage", classes: "libraryImage", kind: "Image", onerror: "defaultImage", ontap: "selectLibrary" },
					{ name: "itemOverlay", classes: "libraryOverlay", ontap: "selectLibrary" },
					{ name: "itemTitle", classes: "libraryTitle", content: "", ontap: "selectLibrary" },
					{ name: "itemIcon", classes: "libraryIcon", kind: "Image", src: "icons/library.svg", ontap: "selectLibrary" }
				]}
			]},
		]}
	],

	// Constructor
	create: function() {
		this.inherited(arguments);
	},
	
	render: function() {
		this.inherited(arguments);
		this.draw();
	},

	draw: function() {
		this.$.items.applyStyle("height", document.getElementById(app.$.content.id).style.height);
		this.$.items.setCount(constant.libraries.length);	
	},

	// Init setup for a line
	setupItem: function(inSender, inEvent) {
		inEvent.item.$.itemImage.setAttribute("src", "images/"+constant.libraries[inEvent.index].name+".png");
		inEvent.item.$.itemTitle.setContent(constant.libraries[inEvent.index].title);
	},
	
	// Process events
	closeDialog: function() {
		this.hide();
	},

	defaultImage: function(inSender, inEvent) {
		inEvent.dispatchTarget.setAttribute("src", "images/nolibrary.png");
	},
	
	selectLibrary: function(inSender, inEvent) {
		Util.setLibrary(constant.libraries[inEvent.index]);
		Util.saveContext();
		app.loadDatabase();
		this.closeDialog();
	}
});


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
