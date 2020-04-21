let mongoose = require('mongoose')

let membersSchema = new mongoose.Schema({
        MemberName: {
                unique: true,
                type: String
        },
        Email: {
                unique:true,
                type: String
        },
        Password: String,
        Bio: String,
        VideoStorageTime: Number,
        storyId: [String]
    },
    { collection: 'members' })

module.exports = mongoose.model('members', membersSchema)

//module.exports = members;

