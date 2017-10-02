var config = {};

/* server settings */
config.host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
config.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

/* mongodb settings*/
config.mongo = {};
config.mongo.host = 'mongodb';
config.mongo.port = 27017;
config.mongo.username = process.env.MONGODB_USER;
config.mongo.password = process.env.MONGODB_PASSWORD;
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