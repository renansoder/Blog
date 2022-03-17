function adminAuth(req, res, next) {
  // sessão user existe, usuário logado.
  if (req.session.user != undefined) {
    next();
  } else {
    return res.redirect('/login');
  }
}

module.exports = adminAuth;
