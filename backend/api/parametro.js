module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req,res) => {
        const parametro = { 
            codigo: req.body.codigo,
            descricao: req.body.descricao,
            valor: req.body.valor,
            idnativo: req.body.idnativo,
            codigoexterno: req.body.codigoexterno
        }

        if (req.params.id) parametro.id = req.params.id

        try {
            if(parametro.id) {
                if (parametro.codigo) {
                    const codigoExistente = await app.db('parametro')
                        .where({ codigo: parametro.codigo }).first()
        
                    if (codigoExistente && parametro.id != codigoExistente.id)
                        notExistsOrError(codigoExistente, `Código ${parametro.descricao} já cadastrado!`)
                }
    
                if (parametro.codigoexterno) {
                    const codigoExternoExistente = await app.db('parametro')
                        .where({ codigoexterno: parametro.codigoexterno }).first()
    
                    if (codigoExternoExistente && parametro.id != codigoExternoExistente.id)
                        notExistsOrError(codigoExternoExistente, 'Código externo já cadastrado')
                }
                app.db('parametro')
                    .update(parametro)
                    .where({ id: parametro.id })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            } else {
                existsOrError(parametro.descricao, 'Nome não informado!')
                existsOrError(parametro.codigo, 'Código não informado!')
                existsOrError(parametro.valor, 'Valor não informado!')
    
                const codigoExistente = await app.db('parametro')
                .where({ codigo: parametro.codigo }).first()
    
                notExistsOrError(codigoExistente, `Código ${parametro.descricao} já cadastrado!`)
    
                if (parametro.codigoexterno) {
                    const codigoExternoExistente = await app.db('parametro')
                        .where({ codigoexterno: parametro.codigoexterno }).first()
    
                    notExistsOrError(codigoExternoExistente, 'Código externo já cadastrado')
                }
                await app.db('parametro')
                    .insert(parametro)
                    .catch(err => res.status(500).send(err))
    
                getByCodigo({codigo: parametro.codigo})
                .then(result => res.status(200).send(result))
            }
        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('parametro')
            .select('*')
            .where({idnativo: true})
            .then(parametros => res.json(parametros))
            .catch(err => res.status(500).send(err))
    }

    const getAll = (req, res) => {
        app.db('parametro')
            .select('*')
            .then(parametros => res.json(parametros))
            .catch(err => res.status(500).send(err))
    }

    const getByCodigo = (req, res) => {
        return app.db('parametro')
            .select('*')
            .where({ codigo: req.codigo}).first()
            .then(parametro => parametro)
            .catch(err => err)
    }

    const getById = (req, res) => {
        app.db('parametro')
            .select('*')
            .where({ id: req.params.id}).first()
            .then(parametro => res.json(parametro))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Identificador não informado.')

            const rowDeleted = await app.db('parametro')
                .where({ id: req.params.id }).del()
            existsOrError(rowDeleted, 'Parâmetro não encontrado')

            res.status(204).send()
        } catch(msg) {
            try {
                const rowInactivated = await app.db('parametro')
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