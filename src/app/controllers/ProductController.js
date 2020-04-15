const { formatPrice } = require('../../lib/utils')

const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

module.exports = {
    create(req, res) {
        //Pegar categorias
        //Promisse
        Category.all()
            .then(function (results) {
                const categories = results.rows

                return res.render('products/create.njk', {
                    categories
                })

            }).catch(function (e) {
                throw new Error(e)
            })
    },
    async post(req, res) {
        //Lógica de salvar
        const keys = Object.keys(req.body)

        //valida se os campos estão vazios
        for (let key of keys) {
            if (req.body[key] == "")
                return res.send(`Todos os campos devem ser preenchidos. Campo ${key} está vazio`)
        }

        if (req.files.length == 0)
            return res.send('Por favor, envie pelo menos uma imagem.')

        let results = await Product.create(req.body)
        const productId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create({ ...file, product_id: productId }))
        await Promise.all(filesPromise)

        return res.redirect(`/products/${productId}/edit`)
    },
    async edit(req, res) {
        //let result é utilizado duas vezes, por isso é let, ela é sobrescrita
        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if (!product) return res.send("Product not found!")

        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        //get categories
        results = await Category.all()
        const categories = results.rows

        //get images
        results = await Product.files(product.id) //error
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', "")}`
        }))

        return res.render(`products/edit.njk`, { product, categories, files })
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        //valida se os campos estão vazios
        for (let key of keys) {
            if (req.body[key] == "" && key != "removed_files")
                return res.send(`Todos os campos devem ser preenchidos. Campo ${key} está vazio`)
        }

        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(file =>
                File.create({ ...file, product_id: req.body.id }))

            await Promise.all(newFilesPromise)
        }

        if (req.body.removed_files) {
            //1, 2, 3, 
            const removedFiles = req.body.removed_files.split(",") //[1, 2, 3, ]
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1) // [1, 2, 3]

            const removedFilesPromise = removedFiles.map(id => File.delete(id))

            await Promise.all(removedFilesPromise)
        }


        req.body.price = req.body.price.replace(/\D/g, "")

        if (req.body.old_price != req.body.price) {
            const oldProduct = await Product.find(req.body.id)

            req.body.old_price = oldProduct.rows[0].price

            await Product.update(req.body)

            return res.redirect(`/products/${req.body.id}/edit`)
        }
    },
    async delete(req, res) {
        await Product.delete(req.body.id)

        return res.redirect(`/products/create`)
    }
}