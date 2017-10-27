'use strict';

const jsSHA = require('jssha');

const createNonceStr = () => {
    return Math.random().toString(36).substr(2, 15);
};

const createTimestamp = () => {
    return parseInt(new Date().getTime() / 1000) + '';
};

const raw = (args) => {
    let keys = Object.keys(args);
    keys = keys.sort()
    let newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    let string = '';
    for (let k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};

const sign = (jsapi_ticket, url) => {
    let ret = {
        jsapi_ticket: jsapi_ticket,
        nonceStr: createNonceStr(),
        timestamp: createTimestamp(),
        url: url
    };
    let string = raw(ret);
    let shaObj = new jsSHA('SHA-1', 'TEXT');
    shaObj.update(string);
    ret.signature = shaObj.getHash('HEX');
    return ret;
};

module.exports = sign;