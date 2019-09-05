It's a simple project, written in node.js with koa2, SQL, redis and Elasticsearch.

There are 2 useful script in scripts folder. scripts/populateSql.js is populate database with predefined data from data.json and when all strings are proceeded, script continue fill DBS with randomly generated words. 

scripts/syncElasticAndMysql.js get all rows from DB and save their in elasticsearch index. First script already store date in elastic. So second script will be useful for reindex data in elasticsearch.
