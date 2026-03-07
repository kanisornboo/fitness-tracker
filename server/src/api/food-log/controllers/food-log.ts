/**
 * food-log controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::food-log.food-log",
  ({ strapi }) => ({
    async create(ctx) {
      // get the user from the context
      const user = ctx.state.user;

      // if the user is not found, return an unauthorized error
      if (!user) {
        return ctx.unauthorized("Unauthorized");
      }

      // get the body from the request
      const body = ctx.request.body;

      // set the user id to the body
      // users_permissions_user is the field in the activity-log schema that is related to the user. This can be found in the schema.json file.
      // future read: https://docs.strapi.io/developer-docs/latest/development/backend-customization/
      body.users_permissions_user = user.id;

      // create the food log
      const foodLog = await strapi.entityService.create(
        "api::food-log.food-log",
        {
          data: body,
          populate: ["users_permissions_user"], // populate the users_permissions_user field to get the user details. we need to populate the user details to get the user id to insert into the food log. other wise, we will not be able to insert the food log.
        },
      );
      return foodLog;
    },
    async find(ctx) {
      // get the user from the context
      const user = ctx.state.user;

      // if the user is not found, return an unauthorized error
      if (!user) {
        return ctx.unauthorized("Unauthorized");
      }
      // find the food logs for the user
      const foodLogs = await strapi.entityService.findMany(
        "api::food-log.food-log",
        {
          filters: {
            users_permissions_user: user.id, // filter the food logs by the user id
          },
          populate: ["users_permissions_user"],
        },
      );
      return foodLogs;
    },
    async findOne(ctx) {
      // get the user from the context
      const user = ctx.state.user;

      // if the user is not found, return an unauthorized error
      if (!user) {
        return ctx.unauthorized("Unauthorized");
      }
      // find the food log by the id
      const foodLog = await strapi.entityService.findMany(
        "api::food-log.food-log",
        {
          filters: {
            id: ctx.params.id,
            users_permissions_user: user.id,
          },
          populate: ["users_permissions_user"],
        },
      );

      // if the food log is not found, return a not found error
      if (!foodLog.length) {
        return ctx.notFound("Food log not found");
      }

      // return the food log
      return foodLog[0];
    },
  }),
);
