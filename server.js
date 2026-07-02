require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const parcelRoutes = require('./routes/parcelRoutes');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Статика
app.use(express.static('public'));

// Парсеры
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Сессии
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 день
}));
app.use(flash());

// Глобальные переменные для шаблонов
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.error = req.flash('error') || null;
    next();
});

// Маршруты
app.use('/', authRoutes);
app.use('/parcels', parcelRoutes);
app.use('/users', userRoutes);

// Главная (редирект)
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/parcels');
    } else {
        res.redirect('/login');
    }
});

// Дашборд – просто редирект на список посылок
app.get('/dashboard', authMiddleware, (req, res) => {
    res.redirect('/parcels');
});

// Запуск
app.listen(PORT, () => {
    console.log(`CRM GOODS запущен на http://localhost:${PORT}`);
});