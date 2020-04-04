let mongoose = require('mongoose')
let members = require('../models/members')
let express = require('express')
let router = express.Router()

var mongodbUri = 'mongodb+srv://barry:hobbit00@cluster0-58mmj.mongodb.net/YourLifeYourStories?retryWrites=true&w=majority'

mongoose.connect(mongodbUri)
let db = mongoose.connection

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err)
})

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]')
})

router.addMember = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    let member = new members({
        MemberName: req.body.MemberName,
        Email: req.body.Email,
        Password: req.body.Password,
        videos: [Number]
    });

    member.save(function(err) {
        if (err)
            res.json({ message: 'Member NOT Added!', errmsg : err } );
        else
            res.json({ message: 'Member added!', data: member });
    });
}

module.exports = router;

