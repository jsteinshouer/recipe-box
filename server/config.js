var config = {};

/* server settings */
config.host = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
config.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

/* mongodb settings*/
config.mongo = {};
config.mongo.host = process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost';
config.mongo.port = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;
config.mongo.username = process.env.OPENSHIFT_MONGODB_DB_USERNAME;
config.mongo.password = process.env.OPENSHIFT_MONGODB_DB_PASSWORD;
if (config.mongo.username) {
	config.mongo.url = "mongodb://" + config.mongo.username + ":" + config.mongo.password + "@" + config.mongo.host + ":" + config.mongo.port + "/recipebox";
}
else {
	config.mongo.url = "mongodb://" + config.mongo.host + ":" + config.mongo.port + "/recipebox";
}

/* Security config */
config.tokenSecret = process.env.OPENSHIFT_APP_UUID || "hR$07Er(&^kP5@Dw!Bdse3";
config.tokenTtl = 60;

module.exports = config;