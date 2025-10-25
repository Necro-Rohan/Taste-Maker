import express from 'express';
import User from '../dbmodels/users.model.js';
// import validateToken from '../middlewares/validate.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });             // getting profile data
    }
    res.json(user);
  } catch (err) {
    console.error('Profile retrieval error:', err);
    return res.status(500).json({ message: 'Server error during profile retrieval' });
  }
});
router.put('/', async (req, res) => {
  try {
    const { image } = req.body; 
    const userId = req.user.id;

    if (!image) {
      return res.status(400).json({ message: 'No image provided' });          // updating image 
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: image },
      { new: true } 
    ).select('-passwordHash');

    res.json({ message: 'Profile picture updated', user: updatedUser });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ message: 'Server error during profile update' });
  }
});

export default router;