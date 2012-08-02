var Master = require('./master').Master,
    repl = require('repl'),
    argv = require('optimist').argv;

if (argv.w && argv.s) {
    master = new Master(argv.w, argv.s);
    //master.addServer('10.0.1.89', '6379');
    master.addServer('127.0.0.1', '6379');

    repl.start({
      prompt: "> ",
      useGlobal: true,
      input: process.stdin,
      output: process.stdout,
    });
} else {
    console.log('node redis-sha-crack.js -w wordlist.txt -s shas.txt');
    process.exit();
}
