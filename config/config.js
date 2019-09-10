const config = {
  port: 3000,
  sqlConnectionLimit: 10,
  sqlHost: 'host.docker.internal', // dont forget set environment sqlHost with your real ip/domain
  sqlUser: 'admin',
  sqlPassword: 'admin',
  sqlDatabase: 'library',
  elasticNode: 'http://host.docker.internal:9200', // set your real ip/domain in environment
  elasticIndex: 'books',
  elasticType: '_doc',
  redisHost: 'host.docker.internal', // set your real ip/domain in environment
  // redisURL: 'redis://127.0.0.1:6379',
};

// if there are variable in env, use env variable instead predefined
Object.keys(config).forEach((key) => {
  if (process.env[key]) config[key] = process.env[key];
});

module.exports = {
  config,
};
