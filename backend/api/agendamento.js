const queries = require('./queries')

module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req,res) => {
        const agendamento = { 
            descricao: req.body.descricao,
            idpessoa: req.body.idpessoa,
            idsala: req.body.idsala,
            datahoraini: req.body.datahoraini,
            datahorafim: req.body.datahorafim,
            quantidadepessoas: req.body.quantidadepessoas,
            observacao: req.body.observacao,
            sglcor: req.body.sglcor,
            idnativo: req.body.idnativo,
            codigoexterno: req.body.codigoexterno
        }

        if (req.params.id) agendamento.id = req.params.id

        try {

            if(agendamento.id) {
                if (agendamento.codigoexterno) {
                    const codigoExternoExistente = await app.db('agendamento')
                        .where({ codigoexterno: agendamento.codigoexterno }).first()
    
                    if (codigoExternoExistente && agendamento.id != codigoExternoExistente.id)
                        notExistsOrError(codigoExternoExistente, 'Código externo já cadastrado')
                }
                app.db('agendamento')
                    .update(agendamento)
                    .where({ id: agendamento.id })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            } else {
                existsOrError(agendamento.idpessoa, 'Criança não informada!')
                existsOrError(agendamento.idsala, 'Cliente não informado!')
                existsOrError(agendamento.datahoraini, 'Data/hora de início não informado!')
                existsOrError(agendamento.datahorafim, 'Data/hora de fim não informado!')

                if (agendamento.codigoexterno) {
                    const codigoExternoExistente = await app.db('agendamento')
                        .where({ codigoexterno: agendamento.codigoexterno }).first()
    
                    notExistsOrError(codigoExternoExistente, 'Código externo já cadastrado')
                }
                await app.db('agendamento')
                    .insert(agendamento)
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(500).send(err))
            }
        } catch(msg) {
            return res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('agendamento')
            .select('*')
            .where({idnativo: true})
            .then(agendamentos => res.json(agendamentos))
            .catch(err => res.status(500).send(err))
    }

    const getAll = (req, res) => {
        app.db('agendamento')
            .select('*')
            .then(agendamentos => res.json(agendamentos))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        try {
            existsOrError(req.params.id, 'Identificador não informado.')

            app.db('agendamento')
                .select('*')
                .where({ id: req.params.id}).first()
                .then(agendamento => res.json(agendamento))
                .catch(err => res.status(500).send(err))
        } catch(msg) {
            res.status(400).send(msg)
        }     
    }

    const getByPessoa = (req, res) => {
        try {
            existsOrError(req.params.id, 'Identificador não informado.')
                
            app.db('agendamento')
                .select('*')
                .where({ idpessoa: req.params.id, idnativo: true})
                .then(agendamento => res.json(agendamento))
                .catch(err => res.status(500).send(err))
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    const getBySala = (req, res) => {
        try {
            existsOrError(req.params.id, 'Identificador não informado.')
            app.db('agendamento')
                .select('*')
                .where({ idsala: req.params.id, idnativo: true})
                .then(agendamento => res.json(agendamento))
                .catch(err => res.status(500).send(err))
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Identificador não informado.')

            const rowDeleted = await app.db('agendamento')
                .where({ id: req.params.id }).del()
            existsOrError(rowDeleted, 'Registro não encontrado')

            res.status(204).send()
        } catch(msg) {
            try {
                const rowInactivated = await app.db('agendamento')
                    .update({idnativo: false})
                    .where({ id: req.params.id })
                existsOrError(rowInactivated, 'Registro não encontrado')
   
                res.status(204).send()
            } catch(msg) {
                res.status(400).send(msg)
            }
        }
    }

    const removeByPessoa = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Identificador não informado.')

            const rowsDeleted = await app.db('agendamento')
                .where({ idpessoa: req.params.id }).del()

            existsOrError(rowsDeleted, 'Registros não encontrados')

            res.status(204).send()
        } catch(msg) {
            try {
                const rowInactivated = await app.db('agendamento')
                    .update({idnativo: false})
                    .where({ idpessoa: req.params.id })
                existsOrError(rowInactivated, 'Registros não encontrados')
   
                res.status(204).send()
            } catch(msg) {
                res.status(400).send(msg)
            }
        }
    }

    const removeBySala = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Identificador não informado.')

            const rowsDeleted = await app.db('agendamento')
                .where({ idsala: req.params.id }).del()

            existsOrError(rowsDeleted, 'Registros não encontrados')

            res.status(204).send()
        } catch(msg) {
            try {
                const rowInactivated = await app.db('agendamento')
                    .update({idnativo: false})
                    .where({ idsala: req.params.id })
                existsOrError(rowInactivated, 'Registros não encontrados')
   
                res.status(204).send()
            } catch(msg) {
                res.status(400).send(msg)
            }
        }
    }

    return { save, get, getAll, getById, getByPessoa, getBySala, remove, removeByPessoa, removeBySala}
}