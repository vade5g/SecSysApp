require('dotenv').load();
const mongoose = require('mongoose');
const crypto = require('crypto');
const jsonWebToken = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
	email: { type: String, unique: true, required: true },
	name: { type: String, required: true },
	hash: String,
	salt: String,
});


//encrypts given password and sets users salt and hash
userSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password,this.salt,1000,64,'sha1').toString('hex');
}

//checks if given password maches the hash of the user
userSchema.methods.validPassword = function(password){
	const hash = crypto.pbkdf2Sync(password,this.salt, 1000,64,'sha1').toString('hex');
	return this.hash === hash;
}

userSchema.methods.generateJwt = function(){
	let expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);

	return jsonWebToken.sign({
		_id: this._id,
		email: this.email,
		name: this.name,
		exp: parseInt(expiry.getTime() / 1000),  
	}, process.env.JWT_SECRET); 
	//Secret for signing JWT:s this is a enviromental variable for securit purposes.
};


mongoose.model('UserModel',userSchema);

const hashes = crypto.getHashes();
console.log(hashes);