"use server"

import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model"
import { revalidatePath } from "next/cache"
import User from "../models/user.model";
import Community from "../models/community.model";

interface Params {
  text: string, 
  author: string, 
  communityId: string | null,
  path: string,
}

export async function createThread({
  text,
  author,
  communityId,
  path
}: Params) {
  try {
    connectToDB()

  const createdThread = await Thread.create({
    text,
    author,
    community: null,
  })

  //Update user model
  await User.findByIdAndUpdate(author, {
    $push: { threads: createdThread._id }
  })
  
  revalidatePath(path)
  } catch (error) {
    throw new Error(`Error creating thread: ${error}`)
  }
  
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB()

  // Calculate the number of posts to skip
  const skipAmount = (pageNumber - 1) * pageSize;

   // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
   const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
   .sort({ createdAt: "desc" })
   .skip(skipAmount)
   .limit(pageSize)
   .populate({
     path: "author",
     model: User,
   })
   .populate({
     path: "community",
     model: Community,
   })
   .populate({
     path: "children", // Populate the children field
     populate: {
       path: "author", // Populate the author field within children
       model: User,
       select: "_id name parentId image", // Select only _id and username fields of the author
     },
   });

    const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined]}})

    const posts = await postsQuery.exec();
    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext}
}