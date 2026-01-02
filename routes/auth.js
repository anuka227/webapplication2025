import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.status(201).json({
      message: 'Амжилттай бүртгэгдлээ',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      token
    });

  } catch (error) {
    console.error('Бүртгэлийн алдаа:', error);
    res.status(500).json({ error: 'Серверийн алдаа гарлаа' });
  }
});

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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.json({
      message: 'Амжилттай нэвтэрлээ',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      token  
    });

  } catch (error) {
    console.error('Нэвтрэх алдаа:', error);
    res.status(500).json({ error: 'Серверийн алдаа гарлаа' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Амжилттай гарлаа' });
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone
    });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ error: 'Серверийн алдаа гарлаа' });
  }
});

router.put('/update', authenticateToken, [
  body('name').optional().trim().notEmpty().withMessage('Нэр хоосон байж болохгүй'),
  body('phone').optional().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.userId;
    const { name, phone } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' });
    }

    res.json({ 
      message: 'Амжилттай шинэчлэгдлээ',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Шинэчлэлт амжилтгүй боллоо' });
  }
});

export default router;