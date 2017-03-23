'use strict';

const request = require('request');
const fs = require('fs');
const crypto = require('./sfax-crypto');

/**
 * Sfax Provider
 * @param config
 * @constructor
 */
class SfaxProvider {
    constructor(config = { }) {
        const {
            serviceURL = 'https://api.sfaxme.com/api/',
            username,
            apiKey,
            encryptionKey,
            initVector
        } = config;

        if (!apiKey || !encryptionKey || !initVector) {
            throw new Error('Properties apiKey, encryptionKey and initVector is required!');
        }

        this.serviceURL = serviceURL;
        this.apiKey = apiKey;
        this.token = crypto.generateToken(username, apiKey, encryptionKey, initVector);
    }

    /**
     * SendFax
     * http://sfax.scrypt.com/article/330-service-methods
     *
     * @param files {Array} array of file path or stream's
     * @param options {Object}
     * @param callback {Function}
     * @returns {Request}
     */
    sendFax(files = [], options = {}, callback = () => {}) {
        var url = this._buildEndPointURL('SendFax');
        if (options.recipientName) {
            url = `${url}&RecipientName=${encodeURIComponent(options.recipientName)}`;
        }
        if (options.recipientFax) {
            url = `${url}&RecipientFax=${encodeURIComponent(options.recipientFax)}`;
        }
        if (options.barcodes) {
            url = `${url}${this._buildBarcodeParam(options.barcodes)}`;
        }
        url = `${url}&`;

        const req = request.post(url, (err, res, body) => callback(err, body));
        var form = req.form();

        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (typeof file === 'string') {
                file = fs.createReadStream(file);
            }
            form.append('file', file);
        }
        return req;
    }

    /**
     * ReceiveInboundFax
     * http://sfax.scrypt.com/article/330-service-methods
     *
     * @param options {Object}
     * @param callback {Function}
     * @returns {Request}
     */
    receiveInboundFax(options = {}, callback = () => {}) {
        var url = this._buildEndPointURL('ReceiveInboundFax');
        if (options.startDate) {
            url = `${url}&StartDateUTC=${encodeURIComponent(options.startDate.toJSON())}`;
        }
        if (options.endDate) {
            url = `${url}&EndDateUTC=${encodeURIComponent(options.endDate.toJSON())}`;
        }
        if (options.watermarkId) {
            url = `${url}&WatermarkId=${encodeURIComponent(options.watermarkId)}`;
        }
        if (options.maxItems) {
            url = `${url}&MaxItems=${encodeURIComponent(options.maxItems)}`;
        }
        url = `${url}&`;

        return request.get(url, (err, res, body) => callback(err, body));
    }

    /**
     * ReceiveOutboundFax
     * http://sfax.scrypt.com/article/330-service-methods
     *
     * @param options {Object}
     * @param callback {Function}
     * @returns {Request}
     */
    receiveOutboundFax(options = {}, callback = () => {}) {
        var url = this._buildEndPointURL('ReceiveOutboundFax');
        if (options.startDate) {
            url = `${url}&StartDateUTC=${encodeURIComponent(options.startDate.toJSON())}`;
        }
        if (options.endDate) {
            url = `${url}&EndDateUTC=${encodeURIComponent(options.endDate.toJSON())}`;
        }
        if (options.watermarkId) {
            url = `${url}&WatermarkId=${encodeURIComponent(options.watermarkId)}`;
        }
        if (options.maxItems) {
            url = `${url}&MaxItems=${encodeURIComponent(options.maxItems)}`;
        }
        url = `${url}&`;
        
        return request.get(url, (err, res, body) => callback(err, body));
    }

    /**
     * DownloadInboundFaxAsPdf
     * http://sfax.scrypt.com/article/330-service-methods
     * 
     * @param output {String | Stream}
     * @param options {Object}
     * @param callback {Function}
     * @returns {Request}
     */
    downloadInboundFaxAsPdf(output = './output.pdf', options = {}, callback = () => {}) {
        var url = this._buildEndPointURL('DownloadInboundFaxAsPdf');
        if (options.faxId) {
            url = `${url}&FaxId=${encodeURIComponent(options.faxId)}`;
        }
        url = `${url}&`;

        if (typeof output === 'string') {
            output = fs.createWriteStream(output);
        }
        var req = request.get(url, (err, res, body) => callback(err, body));
        req.pipe(output);

        return req;
    }

    /**
     * DownloadOutboundFaxAsPdf
     * http://sfax.scrypt.com/article/330-service-methods
     *
     * @param output {String | Stream}
     * @param options {Object}
     * @param callback {Function}
     * @returns {Request}
     */
    downloadOutboundFaxAsPdf(output = './output.pdf', options = {}, callback = () => {}) {
        var url = this._buildEndPointURL('DownloadOutboundFaxAsPdf');
        if (options.faxId) {
            url = `${url}&FaxId=${encodeURIComponent(options.faxId)}`;
        }
        url = `${url}&`;
        
        if (typeof output === 'string') {
            output = fs.createWriteStream(output);
        }
        const req = request.get(url, (err, res, body) => callback(err, body));
        req.pipe(output);

        return req;
    }

    /**
     * DownloadInboundFaxAsTif
     * http://sfax.scrypt.com/article/330-service-methods
     *
     * @param output {String | Stream}
     * @param options {Object}
     * @param callback {Function}
     * @returns {Request}
     */
    downloadInboundFaxAsTif(output = './output.tiff', options = {}, callback = () => {}) {
        var url = this._buildEndPointURL('DownloadInboundFaxAsTif');
        if (options.faxId) {
            url = `${url}&FaxId=${encodeURIComponent(options.faxId)}`;
        }
        url = `${url}&`;

        if (typeof output === 'string') {
            output = fs.createWriteStream(output);
        }
        const req = request.get(url, (err, res, body) => callback(err, body));
        req.pipe(output);

        return req;
    }

    /**
     * DownloadOutboundFaxAsTiff
     * http://sfax.scrypt.com/article/330-service-methods
     *
     * @param output {String | Stream}
     * @param options {Object}
     * @param callback {Function}
     * @returns {Request}
     */
    downloadOutboundFaxAsTif(output = './output.tiff', options = {}, callback = () => {}) {
        var url = this._buildEndPointURL('DownloadOutboundFaxAsTif');
        if (options.faxId) {
            url = `${url}&FaxId=${encodeURIComponent(options.faxId)}`;
        }
        url = `${url}&`;

        if (typeof output === 'string') {
            output = fs.createWriteStream(output);
        }
        const req = request.get(url, (err, res, body) => callback(err, body));
        req.pipe(output);

        return req;
    }

    /**
     * SendFaxFromURL
     * http://sfax.scrypt.com/article/330-service-methods
     *
     * @param fileData {url: String, type: String}
     * @param options
     * @param callback
     * @returns {Request}
     */
    sendFaxFromURL(fileData = {}, options = {}, callback = () => {}) {
        var url = this._buildEndPointURL('SendFaxFromURL');
        if (options.recipientName) {
            url = `${url}&RecipientName=${encodeURIComponent(options.recipientName)}`;
        }
        if (options.recipientFax) {
            url = `${url}&RecipientFax=${encodeURIComponent(options.recipientFax)}`;
        }
        if (options.barcodes) {
            url = `${url}${this._buildBarcodeParam(options.barcodes)}`;
        }
        if (fileData.url) {
            url = `${url}&FileDataURL=${encodeURIComponent(fileData.url)}`;
        }
        if (fileData.type) {
            url = `${url}&FileType=${encodeURIComponent(fileData.type)}`;
        }
        url = `${url}&`;

        return request.post(url, (err, res, body) => callback(err, body));
    }

    /**
     * Build Barcode URL Param
     *
     * @param barcodes {Array}
     * @returns {String}
     * @private
     */
    _buildBarcodeParam(barcodes) {
        var param = '';
        if (barcodes && Array.isArray(barcodes)) {
            for (let i = 0; i < barcodes.length; i++) {
                var barcode = barcodes[i];
                param = `${param}&BarcodeOption=BarcodeData=${encodeURIComponent(barcode.data)}`;
                param = `${param};BarcodeX=${encodeURIComponent(barcode.x)}`;
                param = `${param};BarcodeY=${encodeURIComponent(barcode.y)}`;
                param = `${param};BarcodePage=${encodeURIComponent(barcode.page)}`;
                param = `${param};BarcodeScale=${encodeURIComponent(barcode.scale)}`;
            }
        }
        return param;
    }

    /**
     * Build specific end point by name
     *
     * @param name
     * @returns {String}
     * @private
     */
    _buildEndPointURL(name) {
        return `${this.serviceURL}${name}?token=${encodeURIComponent(this.token)}&apikey=${this.apiKey}`;
    }
}

module.exports = SfaxProvider;