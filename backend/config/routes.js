module.exports = app => {
    app.route('/parametros')
        .post(app.api.parametro.save)
        .get(app.api.parametro.get)

    app.route('/parametros/:id')
        .put(app.api.parametro.save)
        .get(app.api.parametro.getById)
        .delete(app.api.parametro.remove)
        
    app.route('/pessoas')
        .post(app.api.pessoa.save)
        .get(app.api.pessoa.get)

    app.route('/pessoas/:id')
        .put(app.api.pessoa.save)
        .get(app.api.pessoa.getById)
        .delete(app.api.pessoa.remove)

    app.route('/pessoas/:id/agendamentos')
        .get(app.api.agendamento.getByPessoa)
        .delete(app.api.agendamento.removeByPessoa)
        
    app.route('/salas')
        .post(app.api.sala.save)
        .get(app.api.sala.get)

    app.route('/salas/:id')
        .put(app.api.sala.save)
        .get(app.api.sala.getById)
        .delete(app.api.sala.remove)

    app.route('/salas/:id/agendamentos')
        .get(app.api.agendamento.getBySala)
        .delete(app.api.agendamento.removeBySala)

    app.route('/agendamentos')
        .post(app.api.agendamento.save)
        .get(app.api.agendamento.get)

    app.route('/agendamentos/:id')
        .put(app.api.agendamento.save)
        .get(app.api.agendamento.getById)
        .delete(app.api.agendamento.remove)

    app.route('/dashboard/:id')
        .get(app.api.dashboard.dashboard)

}