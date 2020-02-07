const { Writer, Reader } = require('nsqjs');

const channel = 'planet.list';

module.exports = class {

    constructor() {
        this.reader = new Reader(channel, 'handle', {
            lookupdHTTPAddresses: ['127.0.0.1:4161']
        });
        this.writer = new Writer('127.0.0.1', 4150);
    }

    handle(message) {
        try {
            const data = JSON.parse(message.body.toString());
            console.log(`Responding to request '${data.request}' to topic '${data.responseChannel}'`);
            this.writer.publish(data.responseChannel, JSON.stringify({
                planets: [
                    { id: 1, name: 'Planet 1' }, { id: 5, name: 'Planet 5' }, { id: 18, name: 'Planet 18' }
                ]
            }), (error) => {
                if (!error) return;
                console.log("MQ ERROR");
                console.error(error);
            });
        }
        catch (error) {
            console.log("Message handling failed!");
            console.log(error);
        }
        finally {
            message.finish();
        }
    }

    respond(topic) {

    }

    async connect() {
        try {
            this.reader.connect();
            this.writer.connect();
            const self = this;
            this.reader.on('message', (m) => self.handle(m));
            console.log('Wating for request...');
        }
        catch (error) {
            if (!error) return;

            console.log(`Cannot connect to NSQ: ${error}`);
        }
    }
}