const mongoose = require( 'mongoose' );
const dbUrl = "mongodb://localhost/NemoFinder"; // link to local server, change to production later.
//const dbUrl = "mongodb://nemo:soundsfishy@ds151024.mlab.com:51024/nemofinder"

// doing this to plug in the global promise library to stop mongoose form console logging a depreciation warning.
//Not entirely sure what this does
mongoose.Promise = global.Promise

let gracefulShutdown;

mongoose.connect(dbUrl,{useMongoClient: true});

// CONNECTION EVENTS
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbUrl);
});
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

// users schema
require('./schemas/user');



// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};
// For nodemon restarts
process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});
// For Heroku app termination
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app termination', function() {
        process.exit(0);
    });
});
