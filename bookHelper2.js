module.exports = {
	Page: class Page {
		constructor() {
			this.embeds = [];
		}
	},
	Book: class Book {
		constructor() {
			this.pages = [];
		}
		setPages(pages) {
			this.pages = pages;
		}
	},
};