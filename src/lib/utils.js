module.exports = {
    date (timestamp) {
        const date = new Date(timestamp)

        // yyyy
        const year = date.getUTCFullYear()

        // mm - mes é de 0 a 11 , por isso o +1
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)

        // dd slice(-2) pega os dois ultimos numeros
        const day = `0${date.getUTCDate()}`.slice(-2) 

        const hour = date.getHours()
        const minutes = date.getMinutes()

        // return yyyy-mm-dd
        return {
            day,
            month,
            year,
            hour,
            minutes,
            iso : `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        }
    },
    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price/100)
    }
}