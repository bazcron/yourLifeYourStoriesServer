let mongoose = require('mongoose')
let members = require('../models/members')
let express = require('express')
const bcrypt = require('bcryptjs')
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

router.addMember = (req, res) => {

  res.setHeader('Content-Type', 'application/json');
console.log('inside router.addMember')

  let member = new members();

  member.MemberName = req.body.memberName;
  member.Email =req.body.email;
  member.Password = req.body.password;
  member.VideoStorageTime = 2000000;
  member.videos = [];
  console.log(member);

  //...................... Encrypt the password -- then Add the new Member...................................
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(member.Password, salt, (err, hash) =>{
            if (err) throw err;
            member.Password = hash;
            console.log(member.Password);
            member.save(function(err) {
                if (err){
                    return res.status(400).json({
                        error: 'Member Name or Email is already in use'
                    })

                }
                else {
                    return res.status(400).json({
                        error: 'You Have Successfully Signed Up. /n Please Sign In to Start Your Stories'
                    })
                }
            });

        })
    })

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

router.signIn = (req, res) => {
console.log('inside login in server' )
    console.log("member name"+req.body.memberName)
    console.log("password name"+req.body.password)

    res.setHeader('Content-Type', 'application/json');

    members.findOne({ MemberName : req.body.memberName},function(err, members) {
        if (err) return res.status(500).json({
            error: err
    })
        if(!members){
            return res.status(401).json({
                error: 'That Member or Password is Wrong'
            })
        }
        //incorrect password entered
        console.log('body password-'+req.body.password + ' member.password' + members.Password)
        if(!bcrypt.compareSync(req.body.password, members.Password)){
            return  res.status(401).json({
                error: 'That Member or Password is Invalid'
            })
        }
        //If Member & Password are Valid
        return  res.status(200).json({
            error: 'You are Logged In'
        })
    });
}

router.findOne = (req, res) => {

  res.setHeader('Content-Type', 'application/json');

  members.find({ "_id" : req.params.id },function(err, member) {
    if (err)
      res.json({ message: 'member NOT Found!', errmsg : err } );
    else
      res.send(JSON.stringify(member,null,5));
  });
}

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
