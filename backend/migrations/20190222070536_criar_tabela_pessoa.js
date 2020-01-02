
exports.up = function(knex, Promise) {
    return knex.schema.createTable('pessoa', table => {
        table.increments('id').primary()
        table.string('nome').notNull()
        table.string('email').notNull()
        table.bigInteger('telefone').notNull()
        table.boolean('idnativo').defaultTo(true)
        table.string('codigoexterno').unique()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('pessoa')
};
