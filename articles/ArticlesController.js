const { Router } = require('express');
const router = Router();
const CategoryModel = require('../categories/CategoryModel');
const ArticleModel = require('./ArticleModel');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');

// ==> LISTAR ARTIGOS
router.get('/admin/articles', adminAuth, (req, res) => {
  // este include puxa os dados da categoria que estão no artigo.
  ArticleModel.findAll({ include: { model: CategoryModel } }).then(
    (articles) => {
      return res.render('admin/articles/index', { articles });
    }
  );
});

// ==> ROTA PARA A PAGINA DE CRIAÇÃO DE NOVO ARTIGO
router.get('/admin/articles/new', adminAuth, (req, res) => {
  CategoryModel.findAll().then((categories) => {
    return res.render('admin/articles/new', { categories });
  });
});

// ==> ROTA PARA CRIAR NOVO ARTIGO
router.post('/admin/articles/save', adminAuth, (req, res) => {
  const { title, body, category } = req.body;
  ArticleModel.create({
    title,
    slug: slugify(title, { lower: true }),
    body,
    categoryId: category
  }).then(() => {
    return res.redirect('/admin/articles');
  });
});

// ==> ROTA PARA DELETAR ARTIGO
router.post('/articles/delete', adminAuth, (req, res) => {
  const { id } = req.body;
  if (id != undefined || !isNaN(id)) {
    ArticleModel.destroy({ where: { id: id } }).then(() => {
      return res.redirect('/admin/articles');
    });
  } else {
    return res.redirect('/admin/articles');
  }
});

// ==> ROTA PARA BUSCAR ARTIGO PELO ID
router.get('/admin/articles/edit/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const categories = await CategoryModel.findAll().then(
    (categories) => categories
  );
  if (isNaN(id)) {
    return res.redirect('/admin/articles');
  }
  await ArticleModel.findByPk(id)
    .then((article) => {
      if (article != undefined) {
        return res.render('admin/articles/edit', { article, categories });
      } else {
        return res.redirect('/admin/articles');
      }
    })
    .catch((err) => {
      return res.redirect('/admin/articles');
    });
});

// ==> ROTA PARA EDITAR ARTIGO
router.post('/articles/update', adminAuth, (req, res) => {
  const { id, title, body, category } = req.body;
  if (!title || !body) {
    return res.redirect('/admin/articles');
  }
  ArticleModel.update(
    {
      title,
      slug: slugify(title, { lower: true }),
      body,
      categoryId: category
    },
    { where: { id: id } }
  )
    .then(() => {
      return res.redirect('/admin/articles');
    })
    .catch((err) => {
      return res.redirect('/admin/articles');
    });
});

// ==>  ROTA PARA PAGINAÇÃO DE ARTIGOS
router.get('/articles/page/:num', (req, res) => {
  const { num } = req.params;
  let offset = 0;
  if (isNaN(num) || num == 1) {
    offset = 0;
  } else {
    offset = (parseInt(num) - 1) * 4;
  }
  ArticleModel.findAndCountAll({
    limit: 4,
    offset: offset,
    order: [['id', 'DESC']]
  }).then((articles) => {
    let next;
    if (offset + 4 >= articles.count) {
      next = false;
    } else {
      next = true;
    }
    let result = {
      num: parseInt(num),
      next,
      articles
    };
    return res.render('admin/articles/page', { result });
  });
});

module.exports = router;
