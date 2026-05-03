import { Types } from 'mongoose'

export type Task = {
  name: string,
  due: Date,
  complete: boolean,
  description: string,
  ownerId: Types.ObjectId,
}
