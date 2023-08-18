//const bodyparser=require("body-parser");
const express = require("express");
const request=require("request");

const blockChain = require('./blockchain');
const req = require("express/lib/request");
const res = require("express/lib/response");
const bodyParser = require("body-parser");
const pubSub = require("./publishsubs");
//const pubSub = require("./publishsubs");

const app = express();

const blockchain = new blockChain();
const pubsub = new pubSub({ blockchain });   
const DEFAULT_PORT=3000;
const ROOT_NODE_ADDRESS=`http://localhost:${DEFAULT_PORT}`

setTimeout(() => pubsub.broadCastchain() 

    , 1000);

app.use(bodyParser.json());


app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain)

});

app.post("/api/mine", (req, res) => {
    const { data } = req.body;

    blockchain.addBlock({ data });
    pubsub.broadCastchain();
    res.redirect('/api/blocks')
})
const synChain=()=>{
    request({url:`${ROOT_NODE_ADDRESS}/api/blocks`},(error,response,body)=> {
        if(!error && response.statusCode===200){
            const rootChain=JSON.parse(body);
            console.log('Replace cahin on sync with',rootChain)
            blockchain.replaceChain(rootChain)
        } 
    })
}

let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening to PORT :${PORT}`);
    synChain();
});

