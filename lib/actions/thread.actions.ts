import { connectToDB } from "../mongoose"
import { ThreadValidation } from "../validations/thread"

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

  const createdThread = await Thread.create()
  return
}