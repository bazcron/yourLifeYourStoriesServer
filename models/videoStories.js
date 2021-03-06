let mongoose = require('mongoose')

let videoStoriesSchema = new mongoose.Schema({
        storyId: {
            unique:true,
            type: String
        },
        storyFirebaseRef: String,
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





