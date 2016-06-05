'use strict'

module.exports = class Task {
	constructor(app, name) {
		this._app = app;

		this.name = name;
		this.running = false;
	}
}
