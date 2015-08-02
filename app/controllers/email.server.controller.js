'use strict';

/**
 * Module dependencies.
 */
var sendgrid = require('sendgrid')('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');

/**
* Create Email
*/
exports.create = function (req, res) {

	console.log(req.body);

	var email = new sendgrid.Email({
		to: 'rybka.webb@gmail.com',
		from: req.body.email,
		subject: 'Rating Schedule Update',
		text: req.body.message
	});

	sendgrid.send(email, function (err, json) {
		if(err) {
			return res.status(400).send('Error');
		}
		return res.status(200).send('Success');
	});

};