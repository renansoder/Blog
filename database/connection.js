const app = require('../index');
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`O servidor esta rodando em http://localhost:${port}`);
});
