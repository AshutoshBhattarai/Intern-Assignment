import { Knex } from "knex";

import config from "./utils/config";

const { database: db } = config;

export const baseKnexConfig = {
  client: "pg",
  connection: {
    database: "todo_backend",
    host: "localhost",
    password: "12345",
    port: 5432,
    user: "postgres",
  },
};


const knexConfig: Knex.Config = {
  ...baseKnexConfig,
  migrations: {
    directory: "./database/migrations",
    stub: "./stubs/migration.stub",
    tableName: "migrations",
  },
  seeds: {
    directory: "./database/seeds",
    stub: "./stubs/seed.stub",
  },
};


export default knexConfig;