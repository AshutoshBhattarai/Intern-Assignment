import { Knex } from 'knex';

const TABLE_NAME = 'todos';


/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements();
    table.string("title", 255).notNullable();
    table.boolean("completed").defaultTo(false);
    
    table
      .bigInteger('userid')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable("users");

  });
}

/**
 * Drop table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}