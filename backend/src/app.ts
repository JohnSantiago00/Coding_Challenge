import express from 'express'
import bodyParser from 'body-parser'
import { Task } from './task-types.js'
import cors from 'cors'
import mongoose from 'mongoose'
import TaskModel from './task-model.js'

const app = express()
const tasks: Array<Task> = [{
  name: 'Default task',
  due: new Date(Date.now() + 3600),
  description: 'A default task from the backend',
  complete: false
}]
const mongoURI = process.env.MONGODB_URI || 'mongodb://database:27017/tasks'
mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected.'))
  .catch((err) => console.log(err))


app.use(bodyParser.json())
app.use(
  cors({
    origin: ['http://localhost:4200'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Set-Cookie'],
    credentials: true,
  }),
)

app.get('/healthcheck', function(req, res) {
  res.status(200).json({ success: true })
  return
})

app.use(function(req, res, next) {
  console.log(req.method + ' request at route ' + req.url)
  next()
})

app.get('/api/tasks', async (req, res) => {
  const tasks = await TaskModel.find()
  res.json(tasks)
  return
})

app.post('/api/tasks', async (req, res) => {
  const { task } = req.body
  console.log(task)
  await TaskModel.create(task)
  res.status(201).send()
  return
})

app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params
  const { task } = req.body

  try {
    const updatedTask = await TaskModel.findByIdAndUpdate(id, task, { new: true })

    if (!updatedTask) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    res.status(200).json(updatedTask)
    return
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'Failed to update task' })
    return
  }
})

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params
  try {
    await TaskModel.findByIdAndDelete(id)
    res.status(204).send()
    return
  } catch (e) {
    console.log(e)
    res.status(404).send()
    return
  }
})

app.listen(5200, () => console.log('Listening on port 5200'))
