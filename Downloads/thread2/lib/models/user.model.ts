import mongoose, { mongo } from "mongoose";
import { string } from "zod";

const userSchema = new mongoose.Schema({
    id:{ type: String, required: true},
    username:{ type: String, required: true, unique:true},
    name:{ type: String, required: true},
    image:String,
    bio:String,
    threads:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ],
    onboarded:{
        type: Boolean,
        default: false,
    },
    communities: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Community'
        }
    ]
});

export const User = mongoose.models.User || mongoose.model('User',userSchema);

export default User;

// import mongoose from "mongoose";
// import { string } from "zod";

// const userSchema = new mongoose.Schema({
//   id: {
//     type: string,
//     required: true,
//   },
//   username: {
//     type: string,
//     unique: true,
//     required: true,
//   },
//   name: {
//     type: string,
//     required: true,
//   },
//   image: string,
//   bio: string,
//   threads: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Thread",
//     },
//   ],
//   onboarded: {
//     type: Boolean,
//     default: false,
//   },
//   communities: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Community",
//     },
//   ],
// });

// const User = mongoose.models.User || mongoose.model("User", userSchema);

// export default User;