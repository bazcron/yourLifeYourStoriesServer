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

router.findAll = (req, res) => {
  // Return a JSON representation of our list
  res.json(members);
}

function getByValue(array, id) {
  let result  = array.filter(function(obj){return obj.id == id;} );
  return result ? result[0] : null; // or undefined
}


router.findOne = (req, res) => {

  res.setHeader('Content-Type', 'application/json');

  let member = getByValue(members,req.params.id);

  if (member != null)
    res.send(JSON.stringify(member,null,5));
  else
    res.send('That member is not here');
}
/*
router.addMember = (req, res) => {
  //Add a new member to our list
  let id = Math.floor((Math.random() * 1000000) + 1); //Randomly generate an id
  let currentSize = members.length;

members.push({"id": id, "MemberName": req.body.MemberName, "password": req.body.password});
  if((currentSize + 1) == members.length)
    res.json({ message: 'Member Added Successfully!'});
  else
    res.json({ message: 'Member NOT Added!'});
}
*/
router.addMember = (req, res) => {

  res.setHeader('Content-Type', 'application/json');
console.log('inside router.addMember')

  let member = new members();

  member.MemberName = req.body.memberName;
  member.Email =req.body.email;
  member.Password = req.body.password;
  member.videos = []
  console.log(member)

  //......................

  member.save(function(err) {
    if (err)
      res.json({ message: 'Member NOT Added!', errmsg : err } );
    else
      res.json({ message: 'Member Successfully Added!', data: member });
  });
}
router.deleteMember = (req, res) => {
  //Delete the selected member based on its id
  let member = getByValue(members,req.params.id);
  let index = members.indexOf(member);

  let currentSize = members.length;
  members.splice(index, 1);

  if((currentSize - 1) == members.length)
    res.json({ message: 'Member Deleted!'});
  else
    res.json({ message: 'Member NOT Deleted!'});
}


/*router.findOne = (req, res) => {

  res.setHeader('Content-Type', 'application/json');

  members.find({ "id" : req.params.id },function(err, member) {
    if (err)
      res.json({ message: 'member NOT Found!', errmsg : err } );
    else
      res.send(JSON.stringify(member,null,5));
  });
}*/

module.exports = router;
/*
router.findAll = (req, res) => {
  // Return a JSON representation of our list
  res.setHeader('Content-Type', 'application/json')

  Members.findAll(function (err, members) {
    if (err) { res.send(err) }

    res.send(JSON.stringify(members, null, 5))
  })
}

module.exports = router;
*/
