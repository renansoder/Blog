const { Router } = require('express');
const router = Router();
const UserModel = require('./UserModel');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middlewares/adminAuth');

// ==> ROTA PARA LISTAR USUÁRIOS
router.get('/admin/users', adminAuth, (req, res) => {
  UserModel.findAll()
    .then((users) => {
      return res.render('admin/users/index', { users });
    })
    .catch((err) => {
      return res.redirect('/admin/users/create');
    });
});

// ==> ROTA PARA RENDERIZAR PÁGINA DE CRIAÇÃO DE USUÁRIO
router.get('/admin/users/create', adminAuth, (req, res) => {
  return res.render('admin/users/create');
});

// ==> ROTA DE CRIAÇÃO DE USUÁRIOS
router.post('/users/create', adminAuth, (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ where: { email: email } }).then((user) => {
    if (email == undefined || password == undefined) {
      return res.redirect('/admin/users/create');
    }
    if (user == undefined) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      UserModel.create({
        email,
        password: hash
      })
        .then(() => {
          return res.redirect('/admin/users');
        })
        .catch((err) => {
          return res.redirect('/admin/users/create');
        });
    } else {
      return res.redirect('/admin/users/create');
    }
  });
});

// ==> ROTA PARA RENDERIZAR PÁGINA DE LOGIN
router.get('/login', (req, res) => {
  return res.render('admin/users/login');
});

// ==> ROTA PARA AUTENTICAR O LOGIN
router.post('/authenticate', (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ where: { email: email } }).then((user) => {
    if (user != undefined) {
      // validar a senha
      let correct = bcrypt.compareSync(password, user.password);
      if (correct) {
        req.session.user = {
          id: user.id,
          email: user.email
        };
        return res.redirect('/admin/articles');
      } else {
        return res.redirect('/login');
      }
    } else {
      return res.redirect('/login');
    }
  });
});

router.get('/logout', (req, res) => {
  req.session.user = undefined;
  return res.redirect('/');
});

module.exports = router;
