import mongoose, { mongo } from "mongoose";
import { string } from "zod";

const communitySchema = new mongoose.Schema({
    id:{ type: String, required: true},
    username:{ type: String, required: true, unique:true},
    name:{ type: String, required: true},
    image:String,
    bio:String,

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
            ref: 'User'
    },
    threads:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ],
    members:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User' // multiple users can be part of community
        }
    ]
});

const Community = mongoose.models.Community || mongoose.model
('Community', communitySchema);

// export const User = mongoose.models.User || mongoose.model('User',userSchema);

export default Community;
