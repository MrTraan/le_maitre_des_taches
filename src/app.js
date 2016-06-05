'use strict'

const ENV = 'dev';

const _WorkerServer = require('./workers/server.js'); 
const _WorkerJwt = require('./workers/jwt.js');
const _models = require('./models/index.js');

class App {
	constructor() {
		this.workers = {};

		this.logs = {
			log : (...args) => console.log(...args)
		};

		this.config = {
			workers: require('../config/workers.config.json')[ENV],
			credentials: require('../config/credentials.config.json')[ENV]
		};
		this.models = _models;

		//init jwt
		this.workers.jwt = new _WorkerJwt(this);
		this.workers.server = new _WorkerServer(this);
		this.workers.server.listen()
		.then(_ => {
			console.log('Server ready');
		})
		.catch(err => {
			console.log('Setup Error: ', err);
			process.exit(1);
		})
	}
}

const _app = new App();
module.exports = _app;
