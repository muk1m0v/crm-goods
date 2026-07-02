const Parcel = require('../models/Parcel');

exports.index = async (req, res) => {
  const parcels = await Parcel.getAll();
  const isAdmin = req.session.user.role === 'admin';
  res.render('parcels/index', { parcels, isAdmin });
};

exports.showNew = (req, res) => {
  res.render('parcels/new', { error: req.flash('error') });
};

exports.create = async (req, res) => {
  const { weight, cube, username, full_name, phone, cargo_name, tracking_number, paid, status } = req.body;
  try {
    await Parcel.create({
      user_id: req.session.user.id,
      weight,
      cube,
      username,
      full_name,
      phone,
      cargo_name,
      tracking_number,
      paid: paid === 'on' ? true : false, // чекбокс возвращает 'on' если отмечен
      status
    });
    res.redirect('/parcels');
  } catch (err) {
    req.flash('error', 'Ошибка создания посылки: ' + err.message);
    res.redirect('/parcels/new');
  }
};

exports.showEdit = async (req, res) => {
  const parcel = await Parcel.findById(req.params.id);
  if (!parcel) return res.status(404).send('Не найдено');
  res.render('parcels/edit', { parcel, error: req.flash('error') });
};

exports.update = async (req, res) => {
  const { weight, cube, cargo_name, tracking_number, paid, status } = req.body;
  try {
    await Parcel.update(req.params.id, {
      weight,
      cube,
      cargo_name,
      tracking_number,
      paid: paid === 'on' ? true : false,
      status
    });
    res.redirect('/parcels');
  } catch (err) {
    req.flash('error', 'Ошибка обновления: ' + err.message);
    res.redirect(`/parcels/${req.params.id}/edit`);
  }
};

exports.delete = async (req, res) => {
  await Parcel.delete(req.params.id);
  res.redirect('/parcels');
};