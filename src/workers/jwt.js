'use strict'

const jwt = require('jsonwebtoken');

module.exports = class WorkerJwt {
	constructor(app) {
		this._app = app;
	}

	/**
	 * Encode a payload in a jwt token
	 * @param {Object} payload: the payload to encode
	 */
	sign(payload) {
		return new Promise((resolve, reject) => {
			jwt.sign(payload, this._app.config.credentials.jwt.secret, {}, (err, token) => {
				if (err) return reject(err);
				resolve(token);
			});
		});
	}

	/**
	 * Returns the payload decoded if a token is valid
	 * reject if the signature is invalid
	 * @param {String} token: the token to decode
	 */
	verify(token) {
		return new Promise((resolve, reject) => {
			jwt.verify(token, this._app.config.credentials.jwt.secret, (err, payload) => {
				if (err) return reject(err);
				resolve(payload);
			});
		});
	}
}
