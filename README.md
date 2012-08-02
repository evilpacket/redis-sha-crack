redis-sha-crack
==========

Simple, distributed sha1 password cracking using redis 2.6 instances.

Redis is amazingly badass. I love just about everything about it. Redis 2.6 has lua support...and Redis listens on all interfaces by default. (Okay I don't love that....Please don't leave your redis server sitting around on the Internet, please)

# Install Dependencies

``` npm install . ```

Note: Requires redis workers to be 2.6 or greater as lua scripting support is what makes this go.

# Usage

``` node ./redis-sha-crack.js -w wordlist.txt -s shalist.txt 127.0.0.1 host2.example.com:5555 ... ```


# Benchmarks
ahhhh somebody fill this in please

# License
MIT
