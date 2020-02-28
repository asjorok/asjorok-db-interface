const { Worker } = require('redis-request-broker');
const { Client } = require('pg');

const queue = 'planet.list';
const client = new Client();
const worker = new Worker(queue, handle);

async function handle(data) {
    console.log(`Got request:`, data);
    const planets = await client.query("select * from planets");
    return {
        planets: planets.rows
    };
}

async function start() {
    try {
        await client.connect();
        await worker.listen();
        console.log("Listening...");
    }
    catch (error) {
        console.error("Failed to connect", error);
    }
}


process.on('beforeExit', async () => {
    try {
        await worker.stop();
        await client.end();
        console.log("Disconnected.");
    }
    catch (error) {
        console.error("Failed to disconnect", error);
    }
});

start();