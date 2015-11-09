const
    express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
	getPackageDetails = require('../utils/getPackageInfo');

router
    .use(bodyParser.urlencoded({ extended: true }))
    .use(methodOverride(function(req, res){
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
}));

router.route('/')
    // List all packages
    .get((req, res, next) => {
        mongoose.model('Packages').find({}, (err, pckgs) => {
            if (err) {
                return console.error(err);
            } else {
                res.send(pckgs);
            }
        })
    })
    // Create new package
    .post((req, res, next) => {
		getPackageDetails(req.body.url).then((resolve) => {
			mongoose.model('Packages').create({
				name: req.body.name,
				url: req.body.url,
				description: resolve.description,
				owner: resolve.owner,
				ownerUrl: resolve.ownerUrl,
				framework: resolve.framework,
				authors: resolve.authors,
				categories: resolve.keywords
			}, (err, pckg) => {
				if (err) {
                    res.status(412);
                    res.send(err.message);
                } else {
					res.status(201);
					res.send(pckg);
				}
			});
		});
    });

// Middleware to ensure any params passed match a DB record
router.param('name', (req, res, next, name) => {
    mongoose.model('Packages').findOne({name: name}, err => {
        if(err) {
            res.status(404);
            res.send({
                message: `${res.status}: Not Found!!!`
            });
        } else {
            req.body.name = name;
            next();
        }
    });
});

router.route('/:name')
    // Get an individual package
    .get((req, res) => {
        mongoose.model('Packages')
            .findOne({name: req.body.name})
            .select('name url')
            .exec((err, pckg) => {
            if (err) {
                return console.error(err);
            } else {
                if(req.headers['user-agent'].startsWith('node')) {
                    // increments download count based on the user agent being Node, i.e. Bower (in theory).
                    // does not take into account cached resolved package URLs
                    pckg.update({
                        downloaded: pckg.downloaded + 1
                    }, () => {
                        res.send(pckg);
                    });
                } else {
                    res.send(pckg);
                }
            }
        });
    })
    // Update an individual package
    .put((req, res) => {
        mongoose.model('Packages').findOne({name: req.body.name}, (err, pckg) => {
            if (err) {
                return console.error(err);
            } else {
	            getPackageDetails(req.body.url).then((resolve) => {
		            pckg.update({
			            url: req.body.url,
			            description: resolve.description,
                        owner: resolve.owner,
                        ownerUrl: resolve.ownerUrl,
                        framework: resolve.framework,
			            authors: resolve.authors,
			            categories: resolve.keywords
		            }, (err) => {
			            if (err) {
                            res.status(412);
                            res.send("There was a problem updating the information to the database: " + err.message);
			            }
		            });
	            });
            }
        });
    })
    // Unregister an individual package
    .delete((req, res) => {
        res.status(405);
        res.send('Unregister operations are not supported at this time.');
    });

router.get('/search/:name', (req, res) => {
    mongoose.model('Packages')
        .find({name: new RegExp(req.body.name, "i")})
        .select('name url')
        .exec((err, pckgs) => {
        if (err) {
            return console.error(err);
        } else {
            res.send(pckgs);
        }
    });
});

module.exports = router;