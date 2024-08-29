import mongoose from 'mongoose';

const userRepoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true,
  },
  repoName: {
    type: String,
    required: true,
  },
  hookUrl: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const UserRepo = mongoose.model('UserRepo', userRepoSchema);

export default UserRepo;
