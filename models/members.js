/*const members = [
    {id:1, MemberName: 'barry', password: "pass"},
    {id:2, MemberName: 'jim', password:"pass"}
];
*/
//module.exports = members;

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
        VideoStorageTime: Number,
        videos: [Number]
    },
    { collection: 'members' })

module.exports = mongoose.model('members', membersSchema)

//module.exports = members;

