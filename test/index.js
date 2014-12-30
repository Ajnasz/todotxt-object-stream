var assert = require('assert');
var TodotxtObjectStream = require('../index');

var s = new TodotxtObjectStream();

function testDue(d) {
	'use strict';
	assert.equal(typeof d.due, 'object');
	assert(d.created instanceof Date);
}
function testTreshold(d) {
	'use strict';
	assert.equal(typeof d.treshold, 'object');
	assert(d.created instanceof Date);
}

s.on('data', function (d) {
	'use strict';
	assert.equal(typeof d, 'object');
	assert.equal(typeof d.text, 'string');

	if (/Test1/.test(d.text)) {
		assert.equal(typeof d.created, 'object');
		assert(d.created instanceof Date);
	}


	if (/Test2/.test(d.text)) {
		testDue(d);
	}

	if (/Test3/.test(d.text)) {
		testTreshold(d);
	}

	if (/Test4/.test(d.text)) {
		testTreshold(d);
		testDue(d);
	}

	if (/Test5/.test(d.text)) {
		assert.equal(typeof d.lists, 'object');
		assert.equal(d.lists.length, 1);
		assert.equal(d.lists[0], '@list');
	}
	if (/Test6/.test(d.text)) {
		assert.equal(typeof d.lists, 'object');
		assert.equal(d.lists.length, 2);
		assert(d.lists.indexOf('@list') > -1);
		assert(d.lists.indexOf('@anotherlist') > -1);
	}
	if (/Test7/.test(d.text)) {
		assert.equal(typeof d.lists, 'object');
		assert.equal(d.lists.length, 2);
		assert(d.lists.indexOf('@list') > -1);
		assert(d.lists.indexOf('@anotherlist') > -1);
		testDue(d, '2014-05-22');
	}
	if (/Test8/.test(d.text)) {
		assert.equal(typeof d.lists, 'object');
		assert.equal(d.lists.length, 2);
		assert(d.lists.indexOf('@list') > -1);
		assert(d.lists.indexOf('@anotherlist') > -1);
		testDue(d, '2014-05-22');
		testTreshold(d, '2014-05-23');
	}
	if (/Test9/.test(d.text)) {
		assert.equal(typeof d.tags, 'object');
		assert.equal(d.tags.length, 2);
		assert(d.tags.indexOf('+tag') > -1);
		assert(d.tags.indexOf('+tag') > -1);
		testDue(d, '2014-05-22');
		testTreshold(d, '2014-05-23');
	}
});

s.on('error', function (err) {
	'use strict';
	console.error(err);
	process.exit();
});

s.write('2014-04-20 Test1');
s.write('2014-04-20 Test2 due:2014-05-10');
s.write('2014-04-20 Test3 t:2014-05-15');
s.write('2014-04-20 Test4 t:2014-05-19 due:2014-05-21');
s.write('2014-04-20 Test5 @list');
s.write('2014-04-20 @anotherlist Test6 @list');
s.write('2014-04-20 @anotherlist Test7 @list due:2014-05-22');
s.write('2014-04-20 @anotherlist Test8 @list due:2014-05-22 t:2014-05-23');
s.write('2014-04-20 Test9 +tag +anothertag due:2014-05-22 t:2014-05-23');
