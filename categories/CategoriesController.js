const { Router } = require('express');
const router = Router();
const CategoryModel = require('./CategoryModel');
// SLUGIFY TRANSFORMA --> Desenvolvimento Web "para" desenvolvimento-web.
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');

// ==> ROTA PARA LISTAR TODAS AS CATEGORIAS
router.get('/admin/categories', adminAuth, (req, res) => {
  CategoryModel.findAll().then((categories) => {
    res.render('admin/categories/index', { categories });
  });
});

// ==> PÁGINA PARA CADASTRAR NOVA CATEGORIA
router.get('/admin/categories/new', adminAuth, (req, res) => {
  res.render('admin/categories/new.ejs');
});

// ==> ROTA DE CADASTRO DE NOVA CATEGORIA
router.post('/categories/save', adminAuth, (req, res) => {
  const { title } = req.body;
  if (title != undefined) {
    CategoryModel.create({
      title,
      slug: slugify(title, {
        lower: true
      })
    }).then(() => {
      res.redirect('/admin/categories');
    });
  } else {
    res.redirect('/admin/categories/new');
  }
});

// ==> ROTA PARA DELETAR CATEGORIA
router.post('/categories/delete', adminAuth, (req, res) => {
  const { id } = req.body;
  if (id != undefined || !isNaN(id)) {
    CategoryModel.destroy({ where: { id: id } }).then(() => {
      res.redirect('/admin/categories');
    });
  } else {
    res.redirect('/admin/categories');
  }
});

// ==> ROTA PARA ACHAR A CATEGORIA A SER EDITADA
router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.redirect('/admin/categories');
  }

  CategoryModel.findByPk(id)
    .then((category) => {
      if (category != undefined) {
        res.render('admin/categories/edit', { category });
      } else {
        res.redirect('/admin/categories');
      }
    })
    .catch((erro) => {
      res.redirect('/admin/categories');
    });
});

// ==> ROTA PARA EDITAR A CATEGORIA
router.post('/categories/update', adminAuth, (req, res) => {
  const { id, title } = req.body;
  CategoryModel.update(
    { title, slug: slugify(title, { lower: true }) },
    { where: { id: id } }
  ).then(() => {
    res.redirect('/admin/categories');
  });
});

module.exports = router;
