import { Schema, model } from "mongoose"
import { Task } from "./task-types"

const TaskSchema = new Schema<Task>({
  name: String,
  due: Date,
  description: String,
  complete: Boolean,
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true,
  }
})

const TaskModel = model('task', TaskSchema)

if (!TaskModel.find()) TaskModel.create({
  name: 'Default task',
  due: new Date(Date.now() + 3600),
  description: 'A default task from the backend',
  complete: false
})

export default TaskModel
