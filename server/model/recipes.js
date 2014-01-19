var mongoose;
var Recipe;
var RecipeSchema;
var util = require('util');

exports.configure = function(params) {
    mongoose = params.mongoose;

    RecipeSchema = new mongoose.Schema({
        key: {type:String, unique: true},
        title  : String,
        description: String,
        ingredients  : String,
        directions: String,
        tags: [String],
        user: String
    });
    mongoose.model('Recipe', RecipeSchema);
    Recipe = mongoose.model('Recipe');
};

var generateKey = function(value, callback) {
	// 1) convert to lowercase
	// 2) remove dashes and pluses
	// 3) replace spaces with dashes
	// 4) remove everything but alphanumeric characters and dashes

	return value.toLowerCase().replace(/-+/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

exports.create = function(title, description, ingredients, directions, tags, userid, callback) {
    var newRecipe = new Recipe();
    newRecipe.key = generateKey(title);
    newRecipe.title   = title;
    newRecipe.description   = description;
    newRecipe.ingredients = ingredients;
    newRecipe.directions   = directions;
    newRecipe.tags   = tags;
    newRecipe.user = userid;
    newRecipe.save(function(err) {
        if (err) {
            if ((err.code === 11000) && (err.err.indexOf('key') !== -1)) {
                newRecipe.key += '-' + (Math.floor(Math.random() * 10)).toString();
                newRecipe.isNew = true;
                newRecipe.save(function(e) {
                    if (e) {
                        callback(e);
                    }
                    else {
                        callback({key: newRecipe.key});
                    }
                });
            }
            else {
                callback(err);
            }
        }
        else { callback({key: newRecipe.key}); }
    });
};

exports.update = function(key, title, description, ingredients, directions, tags, callback) {
    exports.read(key, function(err, doc) {
        if (err) { callback(err); }
        else if (!doc) { callback({msg: "Not Found" },null); }
        else {
            //update title and key if the title has changed
            if (doc.title !== title) {
                doc.key = generateKey(title);
                doc.title = title;
            }
            doc.description = description;
            doc.ingredients = ingredients;
            doc.directions = directions;
            doc.tags = tags;
            doc.save(function(err) {
            if (err) {
                if ((err.code === 11000) && (err.err.indexOf('key') !== -1)) {
                    doc.key += '-' + (Math.floor(Math.random() * 10)).toString();
                    doc.isNew = true;
                    doc.save(function(e) {
                        if (e) {
                            callback(e);
                        }
                        else {
                             callback({key: doc.key});
                        }
                    });
                    }
                    else {
                        callback(err);
                    }
                }
                else {  callback({key: doc.key}); }
            });
        }
    });    
};

exports.read = function(key, callback) {
    Recipe.findOne({ key: key }, function(err, doc) {
        if (err) { callback(err); }
        else if (!doc) { callback({msg: "Not Found" },null); }
        else { callback(null, doc); }
    });
};

exports.remove = function(key, callback) {
    exports.read(key, function(err, doc) {
        if (err) { callback(err); }

        else {
            doc.remove();
            callback();
        }
    });
};

exports.titles = function(callback) {
    Recipe.find().exec(function(err, docs) {
        if (err) { callback(err); }
        else {
            if (docs) {
                var recipes = [];
                docs.forEach(function(r) {
                    recipes.push({ key: r.key, title: r.title });
                });
                callback(null, recipes);
            } else {
                callback();
            }
        }
    });
};

exports.collection = function(filter, limit, offset, fields, callback) {

    /* fields is optional so fields may be the callback */
    if (typeof fields === "function") {
        callback = fields;
        fields = null;
    }

    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);

    Recipe.find(filter).sort({key: "1"}).exec(function(err, docs) {
        if (err) { callback(err); }
        else {
            if (docs) {
                var recipes = [];
                var result = {};
                result.total = docs.length;
                result.limit = limit;
                result.offset = offset;

                var start = offset * limit;
                var end = (start) + (limit);

                if (end > docs.length) {
                    end = docs.length;
                }

                var map = function(item) {
                    recipe[item] = docs[i][item];
                };

                for (var i=start;i<end;i++)
                { 
                    var recipe = {};
                    fields.forEach(map);
                    recipes.push(recipe);
                }

                result.items = recipes;

                callback(null, result);
            } else {
                callback();
            }
        }
    });
};

exports.tags = function(callback) {
    Recipe.mapReduce({
        map: function() {
            for (var index in this.tags) {
                emit(this.tags[index], 1);
            }
        },
        reduce: function(previous, current) {
            var count = 0;

            for (var index in current) {
                count += current[index];
            }

            return count;
        }
    },function(err,results) {
        if (err) { callback(err, null); }
        else {
            var tags = [];
            results.forEach(function(item) {
                tags.push({
                    id: item._id,
                    count: item.value
                });
            });
            callback(null,tags);
        }
    });
};