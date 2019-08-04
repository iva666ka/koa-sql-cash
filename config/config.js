const config = {
  port: 3000,
  sqlConnectionLimit: 10,
  sqlHost: '127.0.0.1',
  sqlUser: 'admin',
  sqlPassword: 'admin',
  sqlDatabase: 'library',
};

// if there are variable in env, use env variable instead predefined
Object.keys(config).forEach((key) => {
  if (process.env[key]) config[key] = process.env[key];
});

module.exports = {
  config,
};
