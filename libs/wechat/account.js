'use strict';
/**
 * 账户管理接口
 */
const request = require('request');
const rp = require('request-promise-native');
const Wechat = require('./index');
const config = require('../../config/wx.config');
const api = require('../../config/wx.api');

class Account extends Wechat {
    // 创建二维码
    createQrcode(qr) {
        return new Promise((resolve, reject) => {
            this
                .fetchAccessToken()
                .then(data => {
                    const uri = api.qrcode.create + `access_token=${data.access_token}`;

                    rp({ method: 'POST', uri: uri, body: qr, json: true })
                        .then(res => {
                            const _data = res;
                            if (_data) {
                                resolve(_data);
                            } else {
                                throw new Error('Create Qrcode fails')
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                })
        });
    }

    showQrcode(ticket) {
        return api.qrcode.show + `ticket=${encodeURI(ticket)}`;
    }

    createShorturl(action, url) {

        action = action || 'long2short';

        return new Promise((resolve, reject) => {
            this
                .fetchAccessToken()
                .then(data => {
                    const uri = api.qrcode.shorturl + `access_token=${data.access_token}`;
                    const form = {
                        action: action,
                        long_url: url
                    }
                    rp({ method: 'POST', uri: uri, body: form, json: true })
                        .then(res => {
                            const _data = res;
                            if (_data) {
                                resolve(_data);
                            } else {
                                throw new Error('Create Shorturl fails')
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
    return new Account(config.wechat);
};