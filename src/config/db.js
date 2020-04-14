const { Pool } = require("pg") /* Não precisa ficar enviando toda vez login e senha */

module.exports = new Pool ({
    user: 'postgres',
    password: '',
    host: 'localhost',
    port: 5432,
    database: 'launchstoredb'
})

