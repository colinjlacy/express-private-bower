const
    express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

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
        console.log(req.body);
        mongoose.model('Packages').create({
            name: req.body.name,
            url: req.body.url,
            description: '',
            author: '',
            categories: ''
        }, (err, pckg) => {
            if (err) {
                return console.error(err);
            } else {
                res.send(pckg);
            }
        });
    });

// Middleware to ensure any params passed match a DB record
router.param('id', (req, res, next, id) => {
    mongoose.model('Packages').findById(id, (err, pckg) => {
        if(err) {
            res.status(404);
            res.send({
                message: `${res.status}: Not Found`
            });
        } else {
            req.id = id;
            next();
        }
    });
});

router.route('/:id')
    // Get an individual package
    .get((req, res) => {
        mongoose.model('Packages').findById(req.id, (err, pckg) => {
            if (err) {
                return console.error(err);
            } else {
                res.send(pckg);
            }
        });
    })
    // Update an individual package
    .put((req, res) => {
        mongoose.model('Packages').findById(req.id, (err, pckg) => {
            if (err) {
                return console.error(err);
            } else {
                pckg.update({
                    name: req.body.name,
                    url: req.body.url,
                    description: '',
                    author: '',
                    categories: ''
                }, (err, data) => {
                    if (err) {
                        res.send("There was a problem updating the information to the database: " + err);
                    }
                });
            }
        });
    });

module.exports = router;