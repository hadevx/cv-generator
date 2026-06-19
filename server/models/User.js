import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name:     { type: String, default: '', trim: true },
  },
  { timestamps: true },
)

export default mongoose.model('User', userSchema)
