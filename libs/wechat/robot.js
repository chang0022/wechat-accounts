'use strict';

const request = require('request');
const rp = require('request-promise-native');
const api = require('../../config/wx.api');

 const robot = (word) => {
    return new Promise((resolve, reject) => {
        const uri = api.turing;
        const semanticData = {
            'key': '3415020794474371826e99f9e60e4c5a',
            'info': word,
            'userid': 'neochang'
        };
        rp({ method: 'POST', uri: uri, body: semanticData, json: true })
            .then(res => {
                const _data = res.text;
                if (_data) {
                    resolve(_data);
                } else {
                    throw new Error('Search fails')
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

module.exports = robot