import mongoose from 'mongoose'

const cvSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    data:   { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
)

export default mongoose.model('CV', cvSchema)
