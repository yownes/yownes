require("dotenv/config");
module.exports = {
  client: {
    includes: ["./src/definitions/*.ts"],
    service: {
      name: "my-graphql-app",
      url: `${process.env.SERVER_URL}`,
    },
  },
};
