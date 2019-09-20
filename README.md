It's a simple project, written in node.js with koa2, SQL, redis and Elasticsearch.

There are 2 useful scripts in scripts folder. scripts/populateSql.js is populate database with predefined data from data.json and when all objects are proceeded, script continue fill DB with randomly generated words. 

scripts/syncElasticAndMysql.js get all rows from DB and save their in elasticsearch index. First script already store date in elastic and redis. So second script useful for reindex data in elasticsearch.

Redis and elasticSearch will work pretty well with default settings, however i recommend configure redis as LRU cache https://redis.io/topics/lru-cache and configure elastic author property with ngram tokenizer https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-ngram-tokenizer.html.
