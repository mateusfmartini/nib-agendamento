const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const pessoa = {
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone,
            idnadmin: req.body.idnadmin,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            idnativo: req.body.idnativo,
            codigoexterno: req.body.codigoexterno
        }
        
        if (req.params.id) pessoa.id = req.params.id
        
        try {
            if (pessoa.id) {
                if (pessoa.password) {
                    existsOrError(pessoa.password, 'Senha não informada!')
                    existsOrError(pessoa.passwordConfirm, 'Confirmação de senha não informada!')
                    equalsOrError(pessoa.password, pessoa.passwordConfirm, 'Senhas não conferem!')
                    
                    pessoa.password = encryptPassword(pessoa.password)
                    delete pessoa.passwordConfirm
                } else {
                    delete pessoa.password
                    delete pessoa.passwordConfirm
                }
                
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
                existsOrError(pessoa.password, 'Senha não informada!')
                existsOrError(pessoa.passwordConfirm, 'Confirmação de senha não informada!')
                equalsOrError(pessoa.password, pessoa.passwordConfirm, 'Senhas não conferem!')
                
                if (pessoa.codigoexterno) {
                    const codigoExternoExistente = await app.db('pessoa')
                        .where({ codigoexterno: pessoa.codigoexterno }).first()

                        notExistsOrError(codigoExternoExistente, 'Código externo já cadastrado')
                }
                pessoa.password = encryptPassword(pessoa.password)
                delete pessoa.passwordConfirm

                await app.db('pessoa')
                    .insert(pessoa)
                    .catch(err => res.status(500).send(err))

                getByEmail({email: pessoa.email})
                    .then(result => res.status(200).send(result))

            }
        } catch (msg) {
            return res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('pessoa')
            .select('*')
            .where({ idnativo: true })
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
            .where({ id: req.params.id }).first()
            .then(pessoa => res.json(pessoa))
            .catch(err => res.status(500).send(err))
    }

    const getByEmail = (req, res) => {
        return app.db('pessoa')
            .select('*')
            .where({ email: req.email}).first()
            .then(pessoa => pessoa)
            .catch(err => err)
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Identificador não informado.')

            const rowDeleted = await app.db('pessoa')
                .where({ id: req.params.id }).del()
            existsOrError(rowDeleted, 'Parâmetro não encontrado')

            res.status(204).send()
        } catch (msg) {
            try {
                const rowInactivated = await app.db('pessoa')
                    .update({ idnativo: false })
                    .where({ id: req.params.id })
                existsOrError(rowInactivated, 'Registros não encontrados')

                res.status(204).send()
            } catch (msg) {
                res.status(400).send(msg)
            }
        }
    }

    return { save, get, getAll, getById, remove }
}