import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  preferences: {
    language: { type: String, default: 'en' },
    theme:    { type: String, default: 'light' }
  }
}, {
  timestamps: true   // adds createdAt + updatedAt automatically
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
