/*const members = [
    {id:1, MemberName: 'barry', password: "pass"},
    {id:2, MemberName: 'jim', password:"pass"}
];
*/
//module.exports = members;

let mongoose = require('mongoose')

let videoStoriesSchema = new mongoose.Schema({
        storyId: String,
        storyTitle: String,
        storyCountry: String,
        storyLanguage: String,
        storyDecade: String,
        storyDescription: String,
        storyMinutesUsed: Number,
        storySecondsUsed: Number
    },
    { collection: 'videoStories' })

module.exports = mongoose.model('videoStories', videoStoriesSchema)

//module.exports = members;




