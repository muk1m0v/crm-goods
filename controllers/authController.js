const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.showLogin = (req, res) => {
  res.render('auth/login', { error: req.flash('error') });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findByUsername(username);
  if (!user) {
    req.flash('error', 'Неверный логин или пароль');
    return res.redirect('/login');
  }
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    req.flash('error', 'Неверный логин или пароль');
    return res.redirect('/login');
  }
  req.session.user = {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    role: user.role
  };
  res.redirect('/dashboard');
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

exports.showRegister = (req, res) => {
  res.render('auth/register', { error: req.flash('error') });
};

exports.register = async (req, res) => {
  const { username, password, confirm, full_name, phone } = req.body;
  if (password !== confirm) {
    req.flash('error', 'Пароли не совпадают');
    return res.redirect('/register');
  }
  // Проверка существования пользователя
  const existing = await User.findByUsername(username);
  if (existing) {
    req.flash('error', 'Пользователь уже существует');
    return res.redirect('/register');
  }
  try {
    // Первый зарегистрированный пользователь становится админом? По условию только суперадмин задан отдельно.
    // Но мы можем создать только суперадмина через скрипт, а остальные - обычные.
    // Для упрощения: регистрируем всех как 'user'.
    const user = await User.create({ username, password, full_name, phone, role: 'user' });
    req.session.user = {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role
    };
    res.redirect('/dashboard');
  } catch (err) {
    req.flash('error', 'Ошибка регистрации');
    res.redirect('/register');
  }
};