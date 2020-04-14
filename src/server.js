const express = require('express')
const nunjucks = require('nunjucks')
const routes = require("./routes")
const methodOverride = require('method-override')

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.static('public')) /* cria uma pasta para arquivos públicos */
app.use(methodOverride('_method')) /* sobrescrever o método, para utilizar o PUT (precisa instalar npm install method-override) */
app.use(routes)

app.set("view engine", "njk") /* motor de busca dos arquivos */

/* configurações do nunjucks */
nunjucks.configure("src/app/views", {
    express: app,
    autoescape: false,
    noCache: true
})


/* ================================== */
/* Inicia o servidor na porta 5000 */
app.listen(5000, ()=> {
    console.log('server is running')
})
