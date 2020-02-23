const { Worker } = require('redis-request-broker');
const queue = 'planet.list';


async function handle(data) {
    console.log(`Responding to request '${data}'`);
    return {
        planets: [
            { id: 1, name: 'Planet 1' }, { id: 5, name: 'Planet 5' }, { id: 18, name: 'Planet 18' }
        ]
    };
}

const w = new Worker(queue, handle);
w.listen();

process.on('beforeExit', async () => w.stop());