var sys = require('sys'),
    redis = require('redis'),
    fs = require('fs');

redis.debug_mode = false;

var Worker = exports.Worker = function (host, port, master) {
    var self = this;
    self.host = host;
    self.port = port;
    self.id = self.port + ":" + self.host;
    self.master = master;
    self.paused = false;
    self.client = redis.createClient(port, host);

    self.client.on('error', function (err) {
        console.log("WORKER ERROR: " + self.host + " - " + err);
        self.pause();
    });

    self.client.on('connect', function () {
        console.log("WORKER ONLINE: " + self.host + ":" + self.port);
        // Load script
        self.script = fs.readFileSync(__dirname + '/crackhash.lua');

        self.client.send_command("SCRIPT", ['LOAD', self.script.toString()], function (err, reply) {
            self.scriptsha = reply;
            self.doWork();
        });    
    });

    self.pause = function () {
        console.log("Worker offline: " + self.host + ":" + self.port);
        self.paused = true;
    }

    self.resume = function () {
        self.paused = false;
        self.doWork();
    }

    self.doWork = function () {
        master.getWork(function (words, hashes) {
            // If we don't get work or something strange, put us on pause.
            if (words.length <= 0 || Object.keys(hashes).length <= 0) {
                self.pause();
            };

            if (!self.paused) {
                // Send job
                self.client.send_command('EVALSHA', [self.scriptsha, 0, JSON.stringify(words), JSON.stringify(hashes)], function (err, reply) {
                    if (reply) {
                        self.master.hashFound(reply, function () {
                            process.nextTick(self.doWork);
                        });
                    } else {
                        process.nextTick(self.doWork);
                    }
                });
            }
        });
    }
    return self;
};

