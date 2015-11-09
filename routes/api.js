/**
 * Created by colinjlacy on 11/9/15.
 */
const
	express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose');

router.get('/', (req, res) => {
	mongoose.model('Packages')
		.find({})
		.limit(10)
		.sort('-downloaded')
		.exec((err, pckgs) => {
			if (err) {
				res.send(err);
			} else {
				res.send(pckgs);
			}
		});
});

module.exports = router;