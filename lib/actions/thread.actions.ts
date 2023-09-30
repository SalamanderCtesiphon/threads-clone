import { connectToDB } from "../mongoose"
import { ThreadValidation } from "../validations/thread"
import Thread from "../models/thread.model"
import { revalidatePath } from "next/cache"
import User from "../models/user.model";


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
  connectToDB()

  const createdThread = await Thread.create({
    text,
    author,
    community: null,
  })

  //Update user model
  await User.findByIdAndUpate(author, {
    $push: { threads: createdThread._id }
  })
  
  revalidatePath(path)
}