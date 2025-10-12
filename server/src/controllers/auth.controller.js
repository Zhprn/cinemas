const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/password.util');
const { findUserByEmail, createUser } = require('../services/user.service');
const { addTokenToBlocklist } = require('../services/blocklist.service');
const { randomUUID } = require('crypto');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullName, email, password } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await createUser({
      fullName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'Registrasi berhasil!',
      data: {
        userId: newUser.id,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    const tokenId = randomUUID();
    const payload = {
      userId: user.id,
      email: user.email,
      jti: tokenId,
    };

    const secretKey = process.env.JWT_SECRET;
    const expiresIn = '24h';
    const token = jwt.sign(payload, secretKey, { expiresIn });

    res.status(200).json({
      message: 'Login berhasil!',
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

const logout = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Token tidak ditemukan.' });
    }
    const token = authHeader.split(' ')[1];

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.jti) {
      return res.status(400).json({ message: 'Token tidak valid.' });
    }
    
    addTokenToBlocklist(decoded.jti);

    res.status(200).json({ message: 'Logout berhasil dan token telah diblokir.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

module.exports = {
  register,
  login,
  logout,
};