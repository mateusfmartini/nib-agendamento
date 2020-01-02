
exports.up = function(knex, Promise) {
    return knex.schema.createTable('agendamento', table => {
        table.increments('id').primary()
        table.string('descricao').notNull()
        table.integer('idpessoa').notNull().references('id').inTable('pessoa')
        table.integer('idsala').notNull().references('id').inTable('sala')
        table.string('datahoraini').notNull()
        table.string('datahorafim').notNull()
        table.bigInteger('quantidadepessoas')
        table.string('observacao')
        table.string('sglcor')
        table.boolean('idnativo').defaultTo(true)
        table.string('codigoexterno').unique()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('agendamento')
};
