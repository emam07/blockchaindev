const Block = require('./block');
const cryptohash = require('./crypto_hash');

class blockChain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            prevBlock: this.chain[this.chain.length - 1],
            data

        })
        this.chain.push(newBlock);
    }
    replaceChain(chain) {
        if (chain.length <= this.chain.length) {
            console.error("The incoming chain is not longer")
            return;
            
        }
        if (!blockChain.isValid(chain)) {
            console.error('The incoming chain is not valid')
            return;
        }
        this.chain = chain;
    }
    static isValid(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }
        for (let i = 1; i < chain.length; i++) {
            const { timestamp, prevHash, hash, nonce, difficulty, data } = chain[i];
            const lastdifficulty=chain[i-1].lastdifficulty;
            const realLasthash = chain[i - 1].hash;
            if (prevHash !== realLasthash) return false;
            const validatedHash = cryptohash(timestamp, prevHash, nonce, difficulty, data)
            if (hash !== validatedHash) return false;
            if(Math.abs(lastdifficulty-difficulty)>1) return false;


        }
        return true;
    }
}
const blockchain = new blockChain();
blockchain.addBlock({ data: "Block1" });
const result = blockChain.isValid(blockchain.chain);
console.log(blockChain.chain);
console.log(result);
console.log(blockchain);
module.exports = blockChain;
