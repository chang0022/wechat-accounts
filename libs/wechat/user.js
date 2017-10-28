'use strict';
/**
 * 用户管理接口，必须通过微信认证
 */
const request = require('request');
const rp = require('request-promise-native');
const Wechat = require('./index');
const config = require('../../config/wx.config');
const api = require('../../config/wx.api');

class User extends Wechat {
    // 备注用户
    remarkUser(openId, remark) {
        const form = {
            openid: openId,
            remark: remark
        };
        return new Promise((resolve, reject) => {
            this
                .fetchAccessToken()
                .then(data => {
                    let uri = api.user.remark + `access_token=${data.access_token}`;

                    rp({ method: 'POST', uri: uri, body: form, json: true })
                        .then(res => {
                            const _data = res;
                            if (_data) {
                                resolve(_data);
                            } else {
                                throw new Error('Remark user fails')
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                })

        });
    }
    // 获取用户信息
    fetchUsers(openIds, lang) {
        lang = lang || 'zh_CN';
        return new Promise((resolve, reject) => {
            this
                .fetchAccessToken()
                .then(data => {
                    const options = {
                        json: true
                    };
                    if (Array.isArray(openIds)) {
                        options.uri = api.user.batchFetch + `access_token=${data.access_token}`;

                        options.body = {
                            user_list: openIds
                        };
                        options.method = 'POST';
                    } else {
                        options.uri = api.user.fetch + `access_token=${data.access_token}&openid=${openIds}&lang=${lang}`;
                    }

                    rp(options)
                        .then(res => {
                            const _data = res;
                            if (_data) {
                                resolve(_data);
                            } else {
                                throw new Error('BatchFetch fails')
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                })
        });
    }
    // 获取用户列表
    fetchUserList(next_openid) {
        return new Promise((resolve, reject) => {
            this
                .fetchAccessToken()
                .then(data => {
                    let uri = null;
                    if (next_openid) {
                        uri = api.user.list + `access_token=${data.access_token}&next_openid=${next_openid}`;
                    } else {
                        uri = api.user.list + `access_token=${data.access_token}`;
                    }

                    rp({ uri: uri, json: true })
                        .then(res => {
                            const _data = res;
                            if (_data) {
                                resolve(_data);
                            } else {
                                throw new Error('Fetch userList fails')
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
    return new User(config.wechat);
};