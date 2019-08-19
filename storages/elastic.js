const { Client } = require('@elastic/elasticsearch');
const { elasticNode } = require('../config/config.js').config;

const elasticClient = new Client({ node: elasticNode });

module.exports = {
  elasticClient,
};
