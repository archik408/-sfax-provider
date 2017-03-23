'use strict';

const path = require('path');
const Hapi = require('hapi');
const SfaxProvider = require('./../index');
const sfax = new SfaxProvider({
    "username": "yourSfaxUsername",
    "password": "yourSfaxPassword",
    "apiKey": "yourSfaxAPIKey",
    "encryptionKey": "yourSfaxEncryptKey",
    "initVector": "yourIV"
});
const config = require('./server-config.json');
const server = new Hapi.Server({debug: {request: ['error', 'info']}});

server.connection({
    port: config.port
});

server.route({
    method: 'GET',
    path: config.route,
    handler: (request, reply) => {
        var faxId = request.query.faxid;
        var success = request.query.faxsuccess;
        if (success && success.trim() === '1') {
            console.log(`
                Fax
                FaxId: ${faxId}
                SendFaxQueueId: ${request.query.outsendfaxqueueid}           
                From: ${request.query.outfromfaxnumber}
                To: ${request.query.outtofaxnumber}
            `);
            //Can download fax
            sfax.downloadOutboundFaxAsPdf(path.join(__dirname, config.faxFolder, '/fax.pdf'), {faxId: faxId}, (err, body) => {
                if (err) {
                    request.log('error', err, Date.now());
                }
                request.log('info', 'downloaded', Date.now());
            });
        }
        else {
            request.log('error', `Error ${request.query.outerrorcode}`, Date.now());
        }
        return reply('done').code(200);
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});