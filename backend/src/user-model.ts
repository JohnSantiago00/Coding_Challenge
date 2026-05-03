import { Schema, model } from 'mongoose'
import { User } from './user-types'

const UserSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const UserModel = model('user', UserSchema)

export default UserModel
