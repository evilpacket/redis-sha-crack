var redis = require('redis'),
    _ = require('underscore'),
    async = require('async'),
    fs = require('fs'),
    Worker = require('./worker').Worker;

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


var Master = exports.Master = function (wordlist, hashes) {
    var self = this;

    self.wordlist = fs.readFileSync(wordlist).toString().split("\n");
    self.hashes = fs.readFileSync(hashes).toString().split("\n");
    self.found = {};
    self.servers = {};
    self.line = 0;
    self.count = 20000;
    self.addServer = function (host, port) {
        var worker = new Worker(host, port, self);
        self.servers[worker.id] = worker;
    }

    self.getWork = function (callback) {
        if (self.line < self.wordlist.length) {
            var words = self.wordlist.slice(self.line, self.line + self.count);
            self.line = self.line + self.count;
            callback(words, self.hashes);
        } else {
            callback([], []);
        }
    }
    
    self.hashFound = function (reply, callback) {
        reply = JSON.parse(reply);
        _.extend(self.found, reply);  // record our successes        
        var hashes = Object.keys(reply); 
        async.forEach(Object.keys(reply), function (item, cb) {
            console.log("FOUND: " + item + ", " + reply[item]);
            delete self.hashes[item]; // remove found hash
            cb();
        }, callback);
    }
};

