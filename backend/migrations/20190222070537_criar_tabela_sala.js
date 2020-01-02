
exports.up = function(knex, Promise) {
    return knex.schema.createTable('sala', table => {
        table.increments('id').primary()
        table.string('descricao').notNull()
        table.bigInteger('capacidade').notNull()
        table.boolean('idnativo').defaultTo(true)
        table.string('codigoexterno').unique()
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('sala')
};
