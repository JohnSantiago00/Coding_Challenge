import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import session from 'express-session'
import TaskModel from './task-model.js'
import UserModel from './user-model.js'
import { requireAuth } from './auth-middleware.js'

const app = express()
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
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'local-dev-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    },
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

const toSafeUser = (user: { _id: { toString(): string }, email: string }) => ({
  id: user._id.toString(),
  email: user.email,
})

const normalizeEmail = (email: string): string => email.trim().toLowerCase()

app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body

  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Email and password are required.' })
    return
  }

  const normalizedEmail = normalizeEmail(email)

  if (!normalizedEmail || password.length < 6) {
    res.status(400).json({ error: 'Please provide a valid email and a password with at least 6 characters.' })
    return
  }

  try {
    const existingUser = await UserModel.findOne({ email: normalizedEmail })

    if (existingUser) {
      res.status(409).json({ error: 'An account with that email already exists.' })
      return
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await UserModel.create({
      email: normalizedEmail,
      passwordHash,
    })
    req.session.userId = user._id.toString()

    res.status(201).json({ user: toSafeUser(user) })
    return
  } catch (e: any) {
    console.log(e)

    if (e?.code === 11000) {
      res.status(409).json({ error: 'An account with that email already exists.' })
      return
    }

    res.status(500).json({ error: 'Failed to create account.' })
    return
  }
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body

  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Email and password are required.' })
    return
  }

  const normalizedEmail = normalizeEmail(email)

  if (!normalizedEmail || !password) {
    res.status(400).json({ error: 'Email and password are required.' })
    return
  }

  try {
    const user = await UserModel.findOne({ email: normalizedEmail })

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' })
      return
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash)

    if (!passwordsMatch) {
      res.status(401).json({ error: 'Invalid email or password.' })
      return
    }
    req.session.userId = user._id.toString()

    res.status(200).json({ user: toSafeUser(user) })
    return
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'Failed to log in.' })
    return
  }
})

app.post('/api/auth/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err)
      res.status(500).json({ error: 'Failed to log out.' })
      return
    }

    res.clearCookie('connect.sid')
    res.status(204).send()
  })
})

app.get('/api/auth/me', async (req, res) => {
  const userId = req.session.userId

  if (!userId) {
    res.status(401).json({ error: 'Not authenticated.' })
    return
  }

  try {
    const user = await UserModel.findById(userId)

    if (!user) {
      req.session.destroy((err) => {
        if (err) {
          console.log(err)
        }
      })
      res.clearCookie('connect.sid')
      res.status(401).json({ error: 'Not authenticated.' })
      return
    }

    res.status(200).json({ user: toSafeUser(user) })
    return
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'Failed to load current user.' })
    return
  }
})

app.get('/api/tasks', requireAuth, async (req, res) => {
  try {
    const tasks = await TaskModel.find({ ownerId: req.session.userId })
    res.json(tasks)
    return
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'Failed to load tasks' })
    return
  }
})

app.post('/api/tasks', requireAuth, async (req, res) => {
  const { task } = req.body
  const taskToCreate = {
    name: task?.name,
    due: task?.due,
    description: task?.description,
    complete: task?.complete,
    ownerId: req.session.userId,
  }

  try {
    await TaskModel.create(taskToCreate)
    res.status(201).send()
    return
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'Failed to create task' })
    return
  }
})

app.put('/api/tasks/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  const { task } = req.body
  const taskToUpdate = {
    name: task?.name,
    due: task?.due,
    description: task?.description,
    complete: task?.complete,
  }

  try {
    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: id, ownerId: req.session.userId },
      taskToUpdate,
      { new: true }
    )

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

app.delete('/api/tasks/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  try {
    const deletedTask = await TaskModel.findOneAndDelete({
      _id: id,
      ownerId: req.session.userId,
    })

    if (!deletedTask) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    res.status(204).send()
    return
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: 'Failed to delete task' })
    return
  }
})

app.listen(5200, () => console.log('Listening on port 5200'))
