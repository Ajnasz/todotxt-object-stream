var Transform = require('stream').Transform;
var util = require('util');
var debug = require('debug')('todotxt-object-stream');

function createTodoObject(str) {
	'use strict';
	debug('create todo object');

	var output = {},
		due, treshold, created,
		lists, tags, prio;

	created = str.match(/^(?:\([A-Z]\) )?(\d+)-(\d+)-(\d+)/);
	prio = str.match(/^\(([A-Z])\)/);
	due = str.match(/\bdue:(\d+)-(\d+)-(\d+)/);
	treshold = str.match(/\bt:(\d+)-(\d+)-(\d+)/);
	lists = str.match(/(@[\w]+)/g);
	tags = str.match(/(\+[\w]+)/g);

	output.text = str;

	if (due) {
		output.due = new Date(due[0]);
	}

	if (prio) {
		output.prio = prio[1];
	}

	if (treshold) {
		output.treshold = new Date(treshold[0]);
	}

	if (created) {
		output.created = new Date(created[0]);
	}

	if (lists && lists.length) {
		output.lists = lists;
	}

	if (tags && tags.length) {
		output.tags = tags;
	}

	return output;
}

function DropboxTodoObjectStream() {
	Transform.call(this, {objectMode: true});
}

util.inherits(DropboxTodoObjectStream, Transform);

DropboxTodoObjectStream.prototype._transform = function (data, enc, cb) {
	debug('transform', data);
	this.push(createTodoObject(data.toString('utf8')));
	cb();
};

module.exports = DropboxTodoObjectStream;
