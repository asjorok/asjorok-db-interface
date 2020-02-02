const { Writer, Reader } = require('nsqjs');

const channel = 'planet.list';
const r = new Reader(channel, 'handle', {
    lookupdHTTPAddresses: '127.0.0.1:4161'
});
const w = new Writer('127.0.0.1', 4150);


// Register handler for data
r.on('message', (message) => {

    try {
        const data = JSON.parse(message.body.toString());
        console.log("MESSAGE REQUEST");
        console.log(data.request);
        console.log("MESSAGE RESPONSE TOPIC");
        console.log(data.responseChannel);

        respond(data.responseChannel);

    }
    catch (error) {
        console.log("Message handling failed!");
        consolelog(error);
    }
    finally {
        message.finish();
    }
    // Request data
    //w.publish("planet.list.TESTRETURN", "fin", console.log);
    message.finish();
});

function respond(topic) {
    w.publish(topic, JSON.stringify({ planets: [1, 5, 17] }), (error) => {
        if (!error) return;
        console.log("MQ ERROR");
        console.error(error);
    });
}

r.connect();
w.connect();