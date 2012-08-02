-- Takes in a wordlist, hashlist
-- Returns any cracked hashes or false

local wordlist, hashes = unpack(ARGV);
wordlist = cjson.decode(wordlist);
hashes = cjson.decode(hashes);

local reply = {};

-- Loop through wordlist
for k,v in pairs(wordlist) do
    local hash = redis.sha1hex(v);
    if hashes[hash] ~= nil then
        -- hash match, add it to reply
        reply[hash] = v;
    end    
end

return cjson.encode(reply);
