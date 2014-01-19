var mongoose;
var User;
var UserSchema;
var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;

exports.configure = function(params) {
    mongoose = params.mongoose;

    UserSchema = new mongoose.Schema({
        id: {type:String, unique: true},
        password : String,
        email: String
    });

    //Password hash check before save
    UserSchema.pre('save', function(next) {
        var user = this;

        // only hash the password if it has been modified (or is new)
        if (!user.isModified('password')) { return next(); }

        // generate a salt
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) { return next(err); }

            // hash the password along with our new salt
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) { return next(err); }

                // override the cleartext password with the hashed one
                user.password = hash;
                next();
            });
        });
    });

    //add a schema method to check if a password matches what is saved for the username
    UserSchema.methods.checkPassword = function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) { return cb(err); }
            cb(null, isMatch);
        });
    };

    mongoose.model('User', UserSchema);
    User = mongoose.model('User');
};

exports.read = function(id, callback) {
    User.findOne({ id: id }, function(err, doc) {
        if (err) { callback(err); }
        else if (!doc) { callback({msg: "Not Found" },null); }
        else { callback(null, doc); }
    });
};

exports.create = function(id, password, email, callback) {
    var newUser = new User();
    newUser.id = id;
    newUser.password  = password;
    newUser.email   = email;
    newUser.save(function(err) {
        if (err) {
            if ((err.code === 11000) && (err.indexOf('id') !== -1)) {
                callback({msg: "User already exists!"});
            }
            else {
                callback(err);
            }
        }
        else { callback(); }
    });
};

exports.remove = function(id, callback) {
    exports.read(id, function(err, doc) {
        if (err) { callback(err); }
        else {
            doc.remove();
            callback();
        }
    });
};

/* security functions */

exports.authenticate = function(id,password,done) {
    User.findOne({ id: id }, function (err, user) { 
    if (err) { return done(err); }
    if (!user) { return done(null, false); } 
    else {
        user.checkPassword(password,function(err,result){
            if (err) {return done(err);}
            else if (result === true) {return done(null,user);}
            else {return done(null,result);}
        }); 
    } 
  }); 
};