import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// БҮРТГҮҮЛЭХ
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Нэр оруулна уу'),
  body('email').isEmail().withMessage('Зөв и-мэйл хаяг оруулна уу'),
  body('password').isLength({ min: 6 }).withMessage('Нууц үг 6-аас дээш тэмдэгт байх ёстой'),
  body('phone').optional().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'И-мэйл аль хэдийн бүртгэгдсэн байна' });
    }

    const user = new User({ name, email, password, phone });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production'
    });

    res.status(201).json({
      message: 'Амжилттай бүртгэгдлээ',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      token  // ✅ Token нэмэх
    });

  } catch (error) {
    console.error('Бүртгэлийн алдаа:', error);
    res.status(500).json({ error: 'Серверийн алдаа гарлаа' });
  }
});

// НЭВТРЭХ
router.post('/login', [
  body('email').isEmail().withMessage('Зөв и-мэйл хаяг оруулна уу'),
  body('password').notEmpty().withMessage('Нууц үг оруулна уу')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'И-мэйл эсвэл нууц үг буруу байна' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'И-мэйл эсвэл нууц үг буруу байна' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production'
    });

    res.json({
      message: 'Амжилттай нэвтэрлээ',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      token  // ✅ Token нэмэх
    });

  } catch (error) {
    console.error('Нэвтрэх алдаа:', error);
    res.status(500).json({ error: 'Серверийн алдаа гарлаа' });
  }
});

// ГАРАХ
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Амжилттай гарлаа' });
});

// Хэрэглэгчийн мэдээлэл авах
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Серверийн алдаа гарлаа' });
  }
});

// Хэрэглэгчийн мэдээлэл шинэчлэх
router.put('/update', authenticateToken, async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phone },
      { new: true }
    ).select('-password');
    
    res.json({ message: 'Мэдээлэл шинэчлэгдлээ', user });
  } catch (error) {
    res.status(500).json({ error: 'Серверийн алдаа гарлаа' });
  }
});

export default router;