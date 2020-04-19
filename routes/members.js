let mongoose = require('mongoose')
let members = require('../models/members')
let videoStories = require('../models/videoStories')
let express = require('express')
const bcrypt = require('bcryptjs')
const webToken = require(('jsonwebtoken'))
let router = express.Router()

var mongodbUri = 'mongodb+srv://barry:hobbit00@cluster0-58mmj.mongodb.net/YourLifeYourStories?retryWrites=true&w=majority'

mongoose.connect(mongodbUri)
let db = mongoose.connection
let token = webToken
let decodedMemberId = ''
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
router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    members.find({ "_id" : req.params.id },function(err, member) {
        if (err)
            return res.json({ message: 'Member NOT Found!', errmsg : err } );
        else
            return res.send(JSON.stringify(member,null,5));
    });
}
router.getVideoStories = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    let arrayIThink = req.path.valueOf().split(',')
    // let arrayIThink = req.path

    /*let stringJoin = arrayIThink.join(',')
    let arrayAgain = stringJoin.split(',')
    console.log('arrayIThink' )
    console.log(arrayIThink)
    console.log('stringJoin ')
    console.log(stringJoin)
    console.log('arrayAgain')
    console.log( arrayAgain)*/

    videoStories.find({'storyId': {$in: arrayIThink}}, function(err, videos){
        if (err) {
            console.log('err' + err);
            return res.json({message: 'Story NOT Found!'});
        }
        else {
            console.log('arrayIThink' + arrayIThink);
            // console.log('req ' + req)
            return res.send(JSON.stringify(videos, null, 5));
        }
    });
}

function getByValue(array, id) {
  let result  = array.filter(function(obj){return obj.id == id;} );
  return result ? result[0] : null; // or undefined
}

router.addNewVideoStory = (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    console.log('inside router.addVideoStory')
    // creating a unique random id for each video story....................................
    //
    //let storyTitle = req.body.storyTitle;
    /*storyId = storyTitle.slice(0,3);
    storyId = storyId.replace(/\s+/g, '');  // remove all spaces so the server can handle it better
    console.log(storyId + "...")
    storyId = storyId + (Math.floor(Math.random() * Math.floor(9999999)));
    console.log(storyId)*/
    console.log('checking storyFirebaseRef ' + req.body.storyFirebaseRef)
    let newVideoStory = new videoStories();
    newVideoStory.storyFirebaseRef = req.body.storyFirebaseRef;
    newVideoStory.storyTitle = req.body.storyTitle;
    newVideoStory.storyId = req.body.storyId;
    newVideoStory.storyCountry = req.body.storyCountry;
    newVideoStory.storyLanguage = req.body.storyLanguage;
    newVideoStory.storyDecade = req.body.storyDecade;
    newVideoStory.storyDescription = req.body.storyDescription;
    newVideoStory.storyMinutesUsed = req.body.storyMinutesUsed;
    newVideoStory.storySecondsUsed = req.body.storySecondsUsed;
    console.log(newVideoStory);
    newVideoStory.save(function(err) {
        if (err){
            return res.status(400).json({
                error: 'Unable to Save Video Story'
            })

        }
        else {
            console.log('token='+ token)
            let memberIdDecoded = decodedMemberId.memberId
            console.log('decoded of Id' + decodedMemberId)
            console.log('inside add videoStory, new video story added to array of storyId ' + members)
            members.findById(decodedMemberId, function(err,member) {
                if (err)
                    return res.json({ message: 'Error that ID is not valid. Please try again!' } );
                else {
                    member.storyId.push(newVideoStory.storyId);
                    member.save(function (err) {
                        if (err)
                            return res.status(400).json({
                                error: 'Could not add video Id to member!'
                            })
                                // return res.json({ message: 'Could not add video Id to member!', errmsg : member } );
                       //  else
                            // return res.json({ message: 'Video Id added to member!', data: member });
                       //  return res.json({ error: 'Video Id added to member!' });
                    });
                }
            });
            return res.status(200).json({
                error: 'Video Story Saved'
            })
        }

        });
}

router.addMember = (req, res) => {

  res.setHeader('Content-Type', 'application/json');
console.log('inside router.addMember')

  let member = new members();

  member.MemberName = req.body.memberName;
  member.Email =req.body.email;
  member.Password = req.body.password;
  member.Bio = '';
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
                    return res.status(200).json({
                        error: 'You Have Successfully Signed Up. Please Sign In to Start Your Stories'
                    })
                }
            });

        })
    })

}
router.deleteMember = (req, res) => {
  //Delete the selected member based on its id
  let member = getByValue(members,req.params.MemberName);
  let index = members.indexOf(member);

  let currentSize = members.length;
  members.splice(index, 1);

  if((currentSize - 1) == members.length)
    return res.json({ message: 'Member Deleted!'});
  else
    return res.json({ message: 'Member NOT Deleted!'});
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
        //If Member & Password are Valid   create a web token and sent to the front end
        console.log('before creating the token check the array ' + members.storyId)
        token = webToken.sign({memberId: members._id, MemberName: members.MemberName, MemberVideoStories: members.storyId}, 'secretkey')
        return  res.status(200).json({
            error: 'You are Logged In',
            token: token
        })
        console.log('token '+ token)
    });
}
router.returnTokenData = (req, res, next) => {
    console.log('inside return token data' )
    token = req.headers.token;
    webToken.verify(token, 'secretkey', (err, decoded) =>{
        console.log('error? ' + err)
        if (err) return res.status(401).json({
        })
        decodedMemberId = decoded.memberId;
        console.log('decoded ' + decoded.memberId);
        // if token is valid...........................
        members.findOne({_id: decoded.memberId}, (err, members) => {
            if (err) return console.log(err)
            console.log(members);
            // no error..return token data
            return res.status(200).json({
                members: {
                    MemberId: members._id,
                    MemberName: members.MemberName,
                    storyId: members.storyId
                }
            })
        })
    })
}

router.findOne = (req, res) => {

  res.setHeader('Content-Type', 'application/json');

  members.find({ "_id" : req.params.id },function(err, member) {
    if (err)
      return res.json({ message: 'member NOT Found!', errmsg : err } );
    else
      return res.send(JSON.stringify(member,null,5));
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
