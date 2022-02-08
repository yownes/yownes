require("dotenv/config");
module.exports = {
  client: {
    includes: ["./src/api/*.ts"],
    service: {
      name: "my-graphql-app",
      url: `${process.env.SERVER_URL}/module/yownes/graphql`,
    },
  },
};
