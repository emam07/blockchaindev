const crypto = require('crypto');



const { resourceUsage } = require('process');
const cryptohash = (...inputs) => {
    const hash = crypto.createHash('sha256');
    hash.update(inputs.sort().join(""));
    return hash.digest("hex");

    


};
result = cryptohash("world", "hello");
module.exports = cryptohash;
//console.log(result);