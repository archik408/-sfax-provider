'use strict';

const path = require('path');
const fs = require('fs');
const SfaxProvider = require('./../index');
const provider = new SfaxProvider({
    "username": "yourSfaxUsername",
    "password": "yourSfaxPassword",
    "apiKey": "yourSfaxAPIKey",
    "encryptionKey": "yourSfaxEncryptKey",
    "initVector": "yourIV"
});

const sendOptions = {
    recipientName: 'Artur',
    recipientFax: '15545683111'
};
const receiveOptions = {
    startDate: new Date('2017-01-01'),
    endDate: new Date()
};
const barcodeOptions = {
    recipientName: 'Artur',
    recipientFax: '15545683111',
    barcodes: [
        {
            data : 'test123456789',
            x: 1500,
            y: 2000,
            page: 1,
            scale: 9
        },
        {
            data : 'test123456789',
            x: 1000,
            y: 2000,
            page: 2,
            scale: 9
        }
    ]
};
const printFileUrls = {
    url: [`http://www.orimi.com/pdf-test.pdf`],
    type: 'pdf'
};
const printFiles = [
    path.join(__dirname, 'print/text2.txt'),
    path.join(__dirname, 'print/text1.txt')
];

//SENDING
provider.sendFax(printFiles, sendOptions, (err, body) => {
    if (err) {
        console.error(err);
        throw err;
    }
    console.log('\nSent: ', body);
});

//SENDING
provider.sendFax(printFiles, barcodeOptions, (err, body) => {
    if (err) {
        console.error(err);
        throw err;
    }
    console.log('\nSent: ', body);
});

// SENDING
provider.sendFaxFromURL(printFileUrls, barcodeOptions, (err, body) => {
    if (err) {
        console.error(err);
        throw err;
    }
    console.log('\nSent: ', body);
});

// RECEIVING
provider.receiveInboundFax(receiveOptions, (err, body) => {
    if (err) {
        console.error(err);
        throw err;
    }
    console.log('\nInboundFax: ', JSON.parse(body).InboundFaxItems.length);
});

//RECEIVING
provider.receiveOutboundFax(receiveOptions, (err, body) => {
    if (err) {
        console.error(err);
        throw err;
    }
    var items = JSON.parse(body).OutboundFaxItems;
    console.log('\nOutboundFax: ', items.length);
    if (items.length > 0) {
        var id = items[items.length - 1].OutboundFaxId;
        var output = path.join(__dirname, 'test1.pdf');
        //DOWNLOADING
        provider.downloadOutboundFaxAsPdf(output, {faxId: id}, (err, body) => {
            if(err){
                console.error(err);
            }
            console.log(path.join(__dirname, 'test1.pdf'), ' was downloaded');
        });
        output = `${__dirname}/test1.tiff`;
        provider.downloadOutboundFaxAsTif(output, {faxId: id}, (err, body) => {
            if(err){
                console.error(err);
            }
            console.log(path.join(__dirname, 'test1.tiff'), ' was downloaded');
        })
    }
});