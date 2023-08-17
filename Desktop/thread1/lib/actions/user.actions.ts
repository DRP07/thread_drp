"use server";

import { FilterQuery, SortOrder } from "mongoose";
import Thread from "../models/thread.model";
import { User}  from "../models/user.model";
import { connectToDB } from "../mongoose"
import { revalidatePath } from "next/cache";
import { string } from "zod";

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
  }
  
  export async function updateUser({
    userId,
    bio,
    name,
    path,
    username,
    image,
  }: Params): Promise<void> {
    try {
      connectToDB();

    
        await User.findOneAndUpdate(
            {id: userId},
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded:true,
            },
            {upsert: true} // upsert= update+insert
        );
        if(path === "/profile/edit"){
            revalidatePath(path);
        }
    }catch(error:any){
        throw new Error(`Failed to create/update user: ${error.message}`);
    }

    }
    
 export async function fetchUser(userId: string){
  try{
    connectToDB();
    // const userThreads = await Thread.find({ author: userId });

    return await User
    .findOne({id:userId})
  //   .populate({
  //     path: 'communities',
  //     model: Community
  //   })
  }catch(error:any){
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
 }
  
 export async function fetchUserPosts(userId: string){
  try{
    //todo populate community
    connectToDB();
    const threads = await User.findOne({id: userId})
    .populate({
      path: 'threads',
      model: Thread,
      populate:{
        path:'children',
        model: Thread,
        populate:{
          path:'author',
          model: User,
          select: 'name image id'

        }
      }
    })
    return threads;
  }
  catch(error:any){
      throw new Error(`Failed to fetch user posts: ${error.message}`)
  }
 }
 
 export async function fetchUsers({
  userId,
  searchString =" ",
  pageNumber=1,
  pageSize=20,
  sortBy="desc"
 }:{
  userId: string;
  searchString?:string;
  pageNumber?:number;
  pageSize?:number;
  sortBy?:SortOrder;
  
 }){
  try{
    connectToDB();
    //skiping
    const skipAmount = (pageNumber-1)*pageSize;

    const regex = new RegExp(searchString,"i");
    // fetching
    const query:FilterQuery<typeof User> = {
      id: {$ne: userId}
    }
      //searching
    if(searchString.trim() !== ''){
      query.$or =[
        {username : {$regex: regex}},
        {name: {$regex: regex}}
      ]
    }

    //sorting
    const sortOptions ={
      createdAt: sortBy
    };

    const usersQuery = User.find(query)
    .sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users= await  usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return{users, isNext};

  }catch(error:any){
      throw new Error(`failed to fetch users: ${error.message}`)
  }
 }

 export async function getActivity(userId: string){
    try{
        connectToDB();

        //find all threads created by user
        const userThreads= await Thread.find({author: userId});

        //collect all the child ids(replies) from the 'children'
        const childThreadsIds = userThreads.reduce((acc, userThread)=>{
          return acc.concat(userThread.children)
        },[]) // dfd💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥efgf

        // fetching 
          const replies = await Thread.find({
            _id:{$in:childThreadsIds},
            author:{$ne:userId} //ne: not equal 
          }).populate({
            path: 'author',
            model: User,
            select: 'name  image _id'
          })
          return replies;

    }catch(error:any){
          throw new Error(`failed to fetch users: ${error.message}`)
        }
 }