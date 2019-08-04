const config = {
  port: 3000,
};

// if there are variable in env, use env variable instead predefined
Object.keys(config).forEach((key) => {
  if (process.env[key]) config[key] = process.env[key];
});

module.exports = {
  config,
};
