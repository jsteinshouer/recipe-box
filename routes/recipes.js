
var recipes;
var DEFAULT_COLLECTION_LIMIT = 10;

exports.configure = function(params) {
    recipes = params.model;
};
exports.index = function(req, res) {

	var limit = parseInt(req.query.limit,10) || DEFAULT_COLLECTION_LIMIT;
	var offset = parseInt(req.query.offset,10) || 0;
	var expand = req.query.expand || 0;
	var filter = {};
	
	if (expand) {
		req.query.fields = "key,title,description,ingredients,directions,tags";
	}
	else if (!req.query.fields) {
		req.query.fields = "key,title";
	}

	var fields = req.query.fields.split(",");

	/* get a recipe collection */
	recipes.collection(filter,limit,offset,fields, function(err,data) {
		res.json(data);
	});
};

exports.myrecipes = function(req, res) {

	var limit = parseInt(req.query.limit,10) || DEFAULT_COLLECTION_LIMIT;
	var offset = parseInt(req.query.offset,10) || 0;
	var expand = req.query.expand || 0;
	var filter = {user: req.userid};
	
	if (expand) {
		req.query.fields = "key,title,description,ingredients,directions,tags";
	}
	else if (!req.query.fields) {
		req.query.fields = "key,title";
	}

	var fields = req.query.fields.split(",");

	/* get a recipe collection */
	recipes.collection(filter,limit,offset,fields, function(err,data) {
		res.json(data);
	});
};

exports.get = function(req, res){
	recipes.read(req.params.key, function(err,r) {
		if (err || !r) {
			res.statusCode = 404;
			return res.json({msg:"Not found"});
		}
		else {
			res.json(r);
		}
	});
};

exports.create = function(req,res){
	if(!req.body.hasOwnProperty('title') || 
		req.body.title === '' ||
		!req.body.hasOwnProperty('ingredients') ||
		req.body.ingredients === '' ||
		!req.body.hasOwnProperty('directions') ||
		req.body.directions === '')
	{
		res.statusCode = 400;
		return res.json({msg: "Bad Request"});
	}

	recipes.create(
		req.body.title,
		req.body.description,
		req.body.ingredients,
		req.body.directions,
		req.body.tags,
		req.userid,
		function(data) {
			if (data.msg){
				res.statusCode = 500;
				return res.json({msg: data.msg});
			}
			else {
				res.statusCode = 201;
				return res.json({msg: "Created", key: data.key});
			}
		}
	);
};

exports.update = function(req,res){
	if(!req.body.hasOwnProperty('title') || 
		req.body.title === '' ||
		!req.body.hasOwnProperty('ingredients') ||
		req.body.ingredients === '' ||
		!req.body.hasOwnProperty('directions') ||
		req.body.directions === '')
	{
		res.statusCode = 400;
		return res.json({msg: "Bad Request"});
	}

	recipes.update(
		req.params.key,
		req.body.title,
		req.body.description,
		req.body.ingredients,
		req.body.directions,
		req.body.tags,
		function(data) {
			if (data.msg){
				if (data.msg === "Not Found") {
					res.statusCode = 404;
					return res.json({msg:"Not found"});
				}
				else {
					res.statusCode = 500;
					return res.json({msg: "Server Error"});
				}	
			}
			else {
				res.statusCode = 200;
				return res.json({msg: "OK", key: data.key});
			}
		}
	);
};

exports.remove = function(req, res){
	recipes.remove(req.params.key, function(err,r) {
		if (err) {
			res.statusCode = 404;
			return res.json({msg:"Not found"});
		}
		else {
			res.statusCode = 200;
			return res.json({msg:"OK"});
		}
	});
};

exports.tag = function(req, res) {
	var filter = {tags: req.params.tag};
	var limit = parseInt(req.query.limit,16) || DEFAULT_COLLECTION_LIMIT;
	var offset = parseInt(req.query.offset,16) || 0;
	var expand = req.query.expand || 0;
	
	if (expand) {
		req.query.fields = "key,title,description,ingredients,directions,tags";
	}
	else if (!req.query.fields) {
		req.query.fields = "key,title";
	}

	var fields = req.query.fields.split(",");

	/* get a recipe collection */
	recipes.collection(filter,limit,offset,fields, function(err,data) {
		res.json(data);
	});
};

exports.tags = function(req, res) {
	recipes.tags(function(err,results) {
		res.json(results);
	});
};