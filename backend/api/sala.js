module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req,res) => {
        const sala = { 
            descricao: req.body.descricao,
            capacidade: req.body.capacidade,
            idnativo: req.body.idnativo,
            codigoexterno: req.body.codigoexterno
        }

        if (req.params.id) sala.id = req.params.id

        try {

            if(sala.id) {
                if (sala.codigoexterno) {
                    const codigoExternoExistente = await app.db('sala')
                        .where({ codigoexterno: sala.codigoexterno }).first()
    
                    if (codigoExternoExistente && sala.id != codigoExternoExistente.id)
                        notExistsOrError(codigoExternoExistente, 'Código externo já cadastrado')
                }
                app.db('sala')
                    .update(sala)
                    .where({ id: sala.id })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            } else {
                existsOrError(sala.descricao, 'Descrição não informada!')
                existsOrError(sala.capacidade, 'Capacidade não informada!')

                if (sala.codigoexterno) {
                    const codigoExternoExistente = await app.db('sala')
                        .where({ codigoexterno: sala.codigoexterno }).first()
    
                    notExistsOrError(codigoExternoExistente, 'Código externo já cadastrado')
                }
                await app.db('sala')
                    .insert(sala)
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            }


        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('sala')
            .select('*')
            .where({idnativo: true})
            .then(sala => res.json(sala))
            .catch(err => res.status(500).send(err))
    }

    const getAll = (req, res) => {
        app.db('sala')
            .select('*')
            .then(sala => res.json(sala))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        try {
            existsOrError(req.params.id, 'Identificador não informado.')

            app.db('sala')
                .select('*')
                .where({ id: req.params.id}).first()
                .then(sala => res.json(sala))
                .catch(err => res.status(500).send(err))
        } catch(msg) {
            res.status(400).send(msg)
        }     
    }
    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Identificador não informado.')

            const rowDeleted = await app.db('sala')
                .where({ id: req.params.id }).del()
            existsOrError(rowDeleted, 'Registro não encontrado')

            res.status(204).send()
        } catch(msg) {
            try {
                const rowInactivated = await app.db('sala')
                    .update({idnativo: false})
                    .where({ id: req.params.id })
                existsOrError(rowInactivated, 'Registro não encontrado')
   
                res.status(204).send()
            } catch(msg) {
                res.status(400).send(msg)
            }
        }
    }

    return { save, get, getAll, getById, remove}
}