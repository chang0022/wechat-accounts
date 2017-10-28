'use strict';
/**
 * 语义理解
 */
const request = require('request');
const rp = require('request-promise-native');
const Wechat = require('./index');
const config = require('../../config/wx.config');
const api = require('../../config/wx.api');

class Semantic extends Wechat {
    semantic(semanticData) {
        return new Promise((resolve, reject) => {
            this
                .fetchAccessToken()
                .then(data => {
                    const uri = api.semantic + `access_token=${data.access_token}`;
                    semanticData.appid = data.appID;
                    rp({ method: 'POST', uri: uri, body: semanticData, json: true })
                        .then(res => {
                            const _data = res;
                            if (_data) {
                                resolve(_data);
                            } else {
                                throw new Error('Search fails')
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                })
        });
    }
}

module.exports = () => {
    return new Semantic(config.wechat);
};