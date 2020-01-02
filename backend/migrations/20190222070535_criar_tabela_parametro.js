
exports.up = function(knex, Promise) {
    return knex.schema.createTable('parametro', table => {
        table.increments('id').primary()
        table.string('codigo').notNull().unique()
        table.string('descricao').notNull()
        table.string('valor').notNull()
        table.boolean('idnativo').defaultTo(true)
        table.string('codigoexterno').unique()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('parametro')
};
