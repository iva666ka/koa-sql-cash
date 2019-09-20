const config = {
  port: 3000,
  sqlURL: 'mysql://admin:admin@localhost:3306/library?connectionLimit=10',
  elasticNode: 'http://localhost:9200', // example with password https://username:password@localhost:9200
  elasticIndex: 'books',
  elasticType: '_doc',
  // scheme [redis:]//[[user][:password@]][host][:port][/db-number][?db=db-number[&password=bar[&option=value]]]
  redisURL: 'redis://127.0.0.1:6379/1',
};

// if there are variable in env, use env variable instead predefined
Object.keys(config).forEach((key) => {
  if (process.env[key]) config[key] = process.env[key];
});

module.exports = {
  config,
};
