'use strict'
const app = require('../src/app.js');
const lodash = require('lodash');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiAsPromised);
chai.should();

const WorkerJwt = require('../src/workers/jwt.js');

function generateRandomToken() {
	let t = '';

	for (let i = 0; i < 121; i++) {
		t += String.fromCharCode( 48 + ~~(Math.random() * 42));
	}
	return t;
}

describe('JWT', function() {
	let jwt = app.workers.jwt;

	it('Should be instanciable', () => {
		expect(jwt).to.be.an.instanceof(WorkerJwt);
	});

	let payload = {
		'foo': 'bar'
	};

	it('Should sign a token', () => {
		return jwt.sign(payload);
	});

	it('Should verify a token', () => {
		return jwt.sign(payload)
			.then(token => jwt.verify(token))
			.should.be.fulfilled;
	});

	it('Should invalid a random token', () => {
		return jwt.verify(generateRandomToken())
				.should.be.rejected;
	});

	it('Should invalid a modified token', () => {
		return jwt.sign(payload)
			.then(token => jwt.verify(token.slice(0, -1) + 'a'))
			.should.be.rejected;
	});
		

});
