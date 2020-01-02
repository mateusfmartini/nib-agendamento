const queries = require('./queries')

module.exports = app => {

    const dashboard = (req, res) => {
        app.db.raw(queries.dashboard, req.params.id)
            .then(resposta => res.json(resposta.rows))
            .catch(err => res.status(500).send(err))
    }

    return {dashboard}
}