module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req,res) => {
        const pessoa = { 
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone,
            idnativo: req.body.idnativo,
            codigoexterno: req.body.codigoexterno
        }

        if (req.params.id) pessoa.id = req.params.id

        try {
            if(pessoa.id) {
                if (pessoa.codigoexterno) {
                    const codigoExternoExistente = await app.db('pessoa')
                        .where({ codigoexterno: pessoa.codigoexterno }).first()
    
                    if (codigoExternoExistente && pessoa.id != codigoExternoExistente.id)
                        notExistsOrError(codigoExternoExistente, 'Código externo já cadastrado')
                }
                app.db('pessoa')
                    .update(pessoa)
                    .where({ id: pessoa.id })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            } else {
                existsOrError(pessoa.nome, 'Nome não informado!')
                existsOrError(pessoa.email, 'E-mail não informado!')
                existsOrError(pessoa.telefone, 'Telefone não informado!')
    
                if (pessoa.codigoexterno) {
                    const codigoExternoExistente = await app.db('pessoa')
                        .where({ codigoexterno: pessoa.codigoexterno }).first()
    
                    notExistsOrError(codigoExternoExistente, 'Código externo já cadastrado')
                }
                await app.db('pessoa')
                    .insert(pessoa)
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))

            }
        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('pessoa')
            .select('*')
            .where({idnativo: true})
            .then(pessoas => res.json(pessoas))
            .catch(err => res.status(500).send(err))
    }

    const getAll = (req, res) => {
        app.db('pessoa')
            .select('*')
            .then(pessoas => res.json(pessoas))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('pessoa')
            .select('*')
            .where({ id: req.params.id}).first()
            .then(pessoa => res.json(pessoa))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Identificador não informado.')

            const rowDeleted = await app.db('pessoa')
                .where({ id: req.params.id }).del()
            existsOrError(rowDeleted, 'Parâmetro não encontrado')

            res.status(204).send()
        } catch(msg) {
            try {
                const rowInactivated = await app.db('pessoa')
                    .update({idnativo: false})
                    .where({ id: req.params.id })
                existsOrError(rowInactivated, 'Registros não encontrados')
   
                res.status(204).send()
            } catch(msg) {
                res.status(400).send(msg)
            }
        }
    }

    return { save, get, getAll, getById, remove }
}