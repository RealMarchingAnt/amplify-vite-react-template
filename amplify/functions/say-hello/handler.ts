import type { Handler } from "aws-lambda";
import type { Schema } from "../../data/resource";

export const handler: Schema["sayHello"]["functionHandler"] = async (event, context) => {
  const { name } = event.arguments;


  // can I access the data resource here?
  // const data = await context.api.gqlOp({
  //   query: `query {
  //     listPosts {
  //       items {
  //         id
  //         title
  //       }
  //     }
  //   }`
  // });

  // call reqres.in
  const response = await fetch('https://reqres.in/api/users').then(res => res.json());
  // const data = await response.json();
  return response.data;
  


  return `Hello, ${name}!`;
};