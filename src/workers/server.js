'use strict'

const restify = require('restify');

// Worker creating the server.
module.exports = class WorkerServer {

	constructor(app) {
		this._app = app;
		this.ready = false;

		this.server = restify.createServer();
	}

	onReady() {
		this.ready = true;
	}

	//Launch server with retries
	listen() {
		return new Promise((resolve, reject) => {
			const LISTEN_MAX_RETRIES = 5;
			const RETRY_DELAY = 3000;

			let tries = 0;

			//try to make server listen
			//retry until success or after LISTEN_MAX_RETRIES tries
			let listenInterval = setInterval(() => {
				this.server.listen(this._app.config.workers.server.port);
			}, RETRY_DELAY);
			this.server.listen(this._app.config.workers.server.port);

			//On error: retry or cleanup and reject
			let listenError = (err) => {
				if (err.code == 'EADDRINUSE' && tries < LISTEN_MAX_RETRIES) {
					tries++;
					this._app.logs.log('WorkerServer: Address in use, retrying (%d tries)', tries);
				} else {
					this.server.removeListener('error', listenError);
					clearInterval(listenInterval);
					reject('FATAL: WorkerServer Server.listen: ' + err);
				}
			};

			//On success: cleanup and resolve
			let listenSuccess = () => {
				this._app.logs.log('Server listening on port %d', this._app.config.workers.server.port);
				clearInterval(listenInterval);
				this.server.removeListener('error', listenError);
				resolve();
			};

			this.server.on('error', listenError);
			this.server.once('listening', listenSuccess);
		});
	}
}
