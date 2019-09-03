const config = {
  port: 3000,
  sqlConnectionLimit: 10,
  sqlHost: 'localhost',
  sqlUser: 'admin',
  sqlPassword: 'admin',
  sqlDatabase: 'library',
  elasticNode: 'http://localhost:9200',
  elasticIndex: 'books',
  elasticType: '_doc',
  redisHost: '127.0.0.1',
  redisURL: 'redis://127.0.0.1:6379',
};

// if there are variable in env, use env variable instead predefined
Object.keys(config).forEach((key) => {
  if (process.env[key]) config[key] = process.env[key];
});

module.exports = {
  config,
};
