/**
 * activity-log controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::activity-log.activity-log",
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
      body.users_permissions_user = user.id; // insert user.id for a particular activity log

      // create the activity log
      const entry = await strapi.entityService.create(
        "api::activity-log.activity-log",
        {
          data: body,
          populate: ["users_permissions_user"],
        },
      );
      return entry;
    },
    async find(ctx) {
      // get the user from the context
      const user = ctx.state.user;

      // if the user is not found, return an unauthorized error
      if (!user) {
        return ctx.unauthorized("Unauthorized");
      }
      // find the activity logs for the user
      const entries = await strapi.entityService.findMany(
        "api::activity-log.activity-log",
        {
          filters: {
            users_permissions_user: user.id, // filter the activity logs by the user id
          },
          populate: ["users_permissions_user"],
        },
      );
      return entries;
    },
    async findOne(ctx) {
      // get the user from the context
      const user = ctx.state.user;

      // if the user is not found, return an unauthorized error
      if (!user) {
        return ctx.unauthorized("Unauthorized");
      }
      // find the activity log by the id
      const activityLog = await strapi.entityService.findMany(
        "api::activity-log.activity-log",
        {
          filters: {
            id: ctx.params.id,
            users_permissions_user: user.id,
          },
          populate: ["users_permissions_user"],
        },
      );

      // if the activity log is not found, return a not found error
      if (!activityLog.length) {
        return ctx.notFound("Activity log not found");
      }

      // return the activity log
      return activityLog[0];
    },
  }),
);
