# sfax-provider

![Logo](./media/logo.png?token=92960ef4344ea04e1cb6ec236a7251b5d5f2f225)

> sfax-provider is a integration of node.js and [sfax](http://www.scrypt.com/sfax) service


## Notes

Library provide following interface
```
interface SfaxProvider {
  sendFax
  sendFaxFromURL
  receiveOutboundFax
  receiveInboundFax
  downloadOutboundFaxAsTif
  downloadInboundFaxAsTif
  downloadOutboundFaxAsPdf
  downloadInboundFaxAsPdf
}
```

You can found method description and some encrypt details using links:

+ [Service Methods](http://sfax.scrypt.com/article/330-service-methods)
+ [AES Encryption](http://sfax.scrypt.com/article/334-aes-encryption)

## Getting Started

```
npm install sfax-provider --save
```

You can send and receive faxes using following examples:

```javascript
const path = require('path');
const fs = require('fs');
const SfaxProvider = require('sfax-provider');
const provider = new SfaxProvider({
    "username": "yourSfaxUsername",
    "password": "yourSfaxPassword",
    "apiKey": "yourSfaxAPIKey",
    "encryptionKey": "yourSfaxEncryptKey",
    "initVector": "yourIV"
});


const printFiles = [
    path.join(__dirname, 'print/text2.txt'),
    path.join(__dirname, 'print/text1.txt')
];
const sendOptions = {
    recipientName: 'Artur',
    recipientFax: '15545683111'
};
provider.sendFax(printFiles, sendOptions, (err, body) => {
    if (err) {
        console.error(err);
        throw err;
    }
    console.log('\nSent: ', body);
});

const receiveOptions = {
    startDate: new Date('2017-01-01'),
    endDate: new Date()
};
provider.receiveInboundFax(receiveOptions, (err, body) => {
    if (err) {
        console.error(err);
        throw err;
    }
    console.log('\nInboundFax: ', JSON.parse(body).InboundFaxItems.length);
});

```

Check folder with examples (test example and [callback-server](http://sfax.scrypt.com/article/616-fax-callbacks) example)

## License
Copyright (c) 2016 archik
Licensed under the MIT license.
