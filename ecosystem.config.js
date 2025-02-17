module.exports = {
  apps: [
    {
      name: "go-scroll-back",
      script: "yarn",
      args: "run start",
      watch: true,
      mode: "fork",
      interpreter: "node",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};