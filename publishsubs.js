const redis= require('redis');
const blockChain = require('./blockchain');
const { json } = require('body-parser');
const CHANNELS={
    
    TEST:'TEST',
    blockChain:"BLOCKCHAIN"
};

class pubSub {
    constructor({blockchain}){
        this.blockchain=blockchain;
        this.publisher= redis.createClient();
        this.subscriber= redis.createClient();
        this.subscriber.subscribe(CHANNELS.TEST);
        this.subscriber.subscribe(CHANNELS.blockChain);

        this.subscriber.on('message',(channel,message)=>
        this.handleMessage(channel,message));
            
        
    }
    handleMessage(channel,message){
        console.log(`Message recieved.channel:${channel} Message:${message}`);
        const parseMessage=JSON.parse(message);
        if (channel===CHANNELS.blockChain){
            this.blockchain.replaceChain(parseMessage);

        }


    }
    publish({channel,message}){
        this.publisher.publish(channel,message);
    }
     
    broadCastchain(){
        this.publish({
            channel: CHANNELS.blockChain,
            message: JSON.stringify(this.blockchain.chain),
        });
    }


}
//const chechPubSUb=new pubSub();

//setTimeout(()=>chechPubSUb.publisher.publish(CHANNELS.TEST,"Hemlooo"),1000);


    
module.exports=pubSub;