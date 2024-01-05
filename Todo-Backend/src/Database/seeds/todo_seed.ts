import { Knex } from "knex";
import { todo } from "node:test";

const TABLE_NAME = "todos";

/**
 * Delete existing entries and seed values for table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export function seed(knex: Knex): Promise<void> {
  const todos = [
    {
      title: "fames ac",
      completed: true,
    },
    {
      title: "risus. Donec",
      completed: false,
    },
    {
      title: "non massa",
      completed: true,
    },
    {
      title: "fringilla est.",
      completed: false,
    },
    {
      title: "posuere vulputate,",
      completed: true,
    },
    {
      title: "aliquet vel,",
      completed: false,
    },
    {
      title: "eu metus.",
      completed: true,
    },
    {
      title: "tellus faucibus",
      completed: false,
    },
    {
      title: "sit amet",
      completed: false,
    },
    {
      title: "mus. Proin",
      completed: true,
    },
    {
      title: "volutpat nunc",
      completed: true,
    },
    {
      title: "fringilla euismod",
      completed: true,
    },
    {
      title: "nisi dictum",
      completed: false,
    },
    {
      title: "augue, eu",
      completed: true,
    },
    {
      title: "Nunc mauris.",
      completed: true,
    },
    {
      title: "tellus eu",
      completed: false,
    },
    {
      title: "ligula. Donec",
      completed: false,
    },
    {
      title: "penatibus et",
      completed: false,
    },
    {
      title: "convallis ligula.",
      completed: true,
    },
    {
      title: "lobortis tellus",
      completed: true,
    },
    {
      title: "mauris blandit",
      completed: false,
    },
    {
      title: "molestie arcu.",
      completed: true,
    },
    {
      title: "nulla. In",
      completed: false,
    },
    {
      title: "pede nec",
      completed: false,
    },
    {
      title: "magna. Sed",
      completed: true,
    },
    {
      title: "arcu. Sed",
      completed: true,
    },
    {
      title: "Duis a",
      completed: false,
    },
    {
      title: "lacus. Aliquam",
      completed: false,
    },
    {
      title: "sociosqu ad",
      completed: false,
    },
    {
      title: "tortor. Nunc",
      completed: false,
    },
    {
      title: "scelerisque neque",
      completed: false,
    },
    {
      title: "ipsum primis",
      completed: false,
    },
    {
      title: "at sem",
      completed: true,
    },
    {
      title: "Suspendisse ac",
      completed: false,
    },
    {
      title: "sollicitudin a,",
      completed: false,
    },
    {
      title: "eu, odio.",
      completed: true,
    },
    {
      title: "eleifend nec,",
      completed: true,
    },
    {
      title: "egestas lacinia.",
      completed: true,
    },
    {
      title: "Morbi non",
      completed: true,
    },
    {
      title: "est tempor",
      completed: false,
    },
    {
      title: "Integer eu",
      completed: true,
    },
    {
      title: "Suspendisse dui.",
      completed: false,
    },
    {
      title: "ipsum primis",
      completed: false,
    },
    {
      title: "Quisque varius.",
      completed: true,
    },
    {
      title: "orci luctus",
      completed: true,
    },
    {
      title: "amet nulla.",
      completed: false,
    },
    {
      title: "nisi nibh",
      completed: true,
    },
    {
      title: "tellus justo",
      completed: false,
    },
    {
      title: "faucibus ut,",
      completed: false,
    },
    {
      title: "porttitor interdum.",
      completed: false,
    },
    {
      title: "neque pellentesque",
      completed: true,
    },
    {
      title: "dapibus quam",
      completed: true,
    },
    {
      title: "Integer vulputate,",
      completed: true,
    },
    {
      title: "eu, accumsan",
      completed: false,
    },
    {
      title: "sodales. Mauris",
      completed: true,
    },
    {
      title: "nibh vulputate",
      completed: false,
    },
    {
      title: "eu, accumsan",
      completed: false,
    },
    {
      title: "aliquet. Phasellus",
      completed: true,
    },
    {
      title: "In lorem.",
      completed: false,
    },
    {
      title: "velit egestas",
      completed: true,
    },
    {
      title: "porta elit,",
      completed: false,
    },
    {
      title: "dolor quam,",
      completed: true,
    },
    {
      title: "est mauris,",
      completed: true,
    },
    {
      title: "Aliquam vulputate",
      completed: true,
    },
    {
      title: "egestas nunc",
      completed: false,
    },
    {
      title: "odio. Etiam",
      completed: true,
    },
    {
      title: "et libero.",
      completed: true,
    },
    {
      title: "aliquet nec,",
      completed: false,
    },
    {
      title: "Proin non",
      completed: false,
    },
    {
      title: "quis turpis",
      completed: false,
    },
    {
      title: "Mauris magna.",
      completed: true,
    },
    {
      title: "Duis at",
      completed: true,
    },
    {
      title: "dui, semper",
      completed: false,
    },
    {
      title: "vel pede",
      completed: false,
    },
    {
      title: "eleifend. Cras",
      completed: false,
    },
    {
      title: "consectetuer ipsum",
      completed: true,
    },
    {
      title: "sed orci",
      completed: true,
    },
    {
      title: "ipsum dolor",
      completed: true,
    },
    {
      title: "nec metus",
      completed: false,
    },
    {
      title: "euismod in,",
      completed: true,
    },
    {
      title: "Nunc sed",
      completed: true,
    },
    {
      title: "scelerisque mollis.",
      completed: true,
    },
    {
      title: "sit amet,",
      completed: false,
    },
    {
      title: "sit amet",
      completed: true,
    },
    {
      title: "ante. Vivamus",
      completed: true,
    },
    {
      title: "metus. Vivamus",
      completed: true,
    },
    {
      title: "dolor. Nulla",
      completed: true,
    },
    {
      title: "ac arcu.",
      completed: true,
    },
    {
      title: "justo. Praesent",
      completed: true,
    },
    {
      title: "nisi magna",
      completed: false,
    },
    {
      title: "Sed congue,",
      completed: false,
    },
    {
      title: "semper. Nam",
      completed: true,
    },
    {
      title: "Etiam bibendum",
      completed: true,
    },
    {
      title: "faucibus id,",
      completed: false,
    },
    {
      title: "Pellentesque habitant",
      completed: false,
    },
    {
      title: "nulla. Cras",
      completed: false,
    },
    {
      title: "mi. Duis",
      completed: true,
    },
    {
      title: "egestas nunc",
      completed: true,
    },
    {
      title: "mollis vitae,",
      completed: true,
    },
    {
      title: "velit. Cras",
      completed: true,
    },
  ];

  const todosWId = todos.map((todo) => {
    return {
      ...todo,
      userid: 1,
    };
  });
  return knex(TABLE_NAME)
    .del()
    .then(() => {
      return knex(TABLE_NAME).insert([
        {
          title: "Learn authorization",
          completed: false,
          userid: 1,
        },
        ...todosWId,
      ]);
    });
}
