module.exports = {
  client: {
    includes: ["./src/api/*.js"],
    service: {
      name: "yownes-graphql-backend",
      url: "http://app.yownes.com:8000/graphql",
    },
  },
};
