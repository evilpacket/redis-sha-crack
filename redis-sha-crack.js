var Master = require('./master').Master,
    repl = require('repl'),
    argv = require('optimist').argv;

if (argv.w && argv.s) {
    master = new Master(argv.w, argv.s);
    argv._.forEach(function (server) {
        server = server.split(':');
        var port = server[1] || '6379'; 
        var host = server[0];
        master.addServer(host, port);
    });


    if (argv.r) {
        repl.start({
          prompt: "> ",
          useGlobal: true,
          input: process.stdin,
          output: process.stdout,
        });
    }
} else {
    console.log('node redis-sha-crack.js -w wordlist.txt -s shas.txt host1 host2:port');
    process.exit();
}
