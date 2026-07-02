const User = require('../models/User');

exports.index = async (req, res) => {
  const users = await User.getAll();
  res.render('users/index', { users });
};

exports.showEdit = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('Не найдено');
  res.render('users/edit', { user, error: req.flash('error') });
};

exports.update = async (req, res) => {
  const { full_name, phone, role } = req.body;
  await User.update(req.params.id, { full_name, phone, role });
  res.redirect('/users');
};

exports.delete = async (req, res) => {
  await User.delete(req.params.id);
  res.redirect('/users');
};