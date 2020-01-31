const { Writer, Reader } = require('nsqjs');

const channel = 'planet.list';
const r = new Reader(channel, 'handle', {
    lookupdHTTPAddresses: 'localhost:4161'
});
const w = new Writer('127.0.0.1', 4150);


// Register handler for data
r.on('message', (message) => {
    console.log('GOT MQ MESSAGE');
    console.log(message);

    // Request data
    //w.publish("planet.list.TESTRETURN", "fin", console.log);
    message.finish();
});

r.connect();
w.connect();