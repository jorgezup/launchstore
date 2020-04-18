const User = require('../models/User')

async function post(req, res, next) {
    //verificar se todos os campos estão preenchidos
    const keys = Object.keys(req.body)

    //valida se os campos estão vazios
    for (let key of keys) {
        if (req.body[key] == "" && key != "removed_files")
            return res.render('user/register', {
                user: req.body,
                error: "Todos os campos devem ser preenchidos"
            })
    }

    //verificar se usuário já existe (e-mail e cpf são únicos)
    let { email, cpf_cnpj, password, passwordRepeat } = req.body

    cpf_cnpj = cpf_cnpj.replace(/\D/g, "")

    const user = await User.findOne({
        where: { email },
        or: { cpf_cnpj }
    })

    if (user) {
        return res.render('user/register', {
            user: req.body,
            error: "Usuário já existe"
        })
    }

    //verficar senha e repetição de senha iguais
    if (password !== passwordRepeat){
        return res.render('user/register', {
            user: req.body,
            error: "As senhas são diferentes"
        })
    }


    next()
}

module.exports = {
    post
}