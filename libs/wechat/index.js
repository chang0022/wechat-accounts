'use strict';

const fs = require('fs');
const request = require('request');
const rp = require('request-promise-native');
const util = require('./util');
const api = require('../../config/wx.api');

class Wechat {
    constructor(opts) {
        this.appID = opts.appID;
        this.appSecret = opts.appSecret;
        this.getAccessToken = opts.getAccessToken;
        this.saveAccessToken = opts.saveAccessToken;
        this.getTicket = opts.getTicket;
        this.saveTicket = opts.saveTicket;

        this.fetchAccessToken();
    }

    fetchAccessToken(data) {
        if (this.access_token && this.expires_in) {
            if (this.isValidAccessToken(this)) {
                return Promise.resolve(this);
            }
        }
        return this.getAccessToken()
            .then(data => {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    return this.updateAccessToken();
                }

                if (this.isValidAccessToken(data)) {
                    return Promise.resolve(data);
                } else {
                    return this.updateAccessToken();
                }
            })
            .then(data => {
                this.saveAccessToken(data);
                return Promise.resolve(data);
            })
    }

    isValidAccessToken(data) {
        if (!data || !data.access_token || !data.expires_in) {
            return false;
        }

        const access_token = data.access_token;
        const expires_in = data.expires_in;
        const now = new Date().getTime();

        return (now < expires_in);
    }

    updateAccessToken() {
        const appID = this.appID;
        const appSecret = this.appSecret;
        const uri = api.accessToken + `&appid=${appID}&secret=${appSecret}`;

        return new Promise((resolve, reject) => {
            rp({ uri: uri, json: true })
                .then(res => {
                    const data = res;
                    const now = new Date().getTime();
                    data.expires_in = now + (data.expires_in - 20) * 1000;;
                    resolve(data);
                });
        });
    }

    //上传素材：必须通过微信认证
    uploadMaterial(type, material, permanent) {
        let form = {};
        let uploadUrl = api.temporary.upload;

        if (permanent) {
            uploadUrl = api.permanent.upload;
            _.extend(form, permanent);
        }
        if (type === 'news') {
            uploadUrl = api.permanent.uploadNews;
            form = material;
        } else {
            form.media = fs.createReadStream(material);
        }
        if (type === 'pic') {
            uploadUrl = api.permanent.uploadNewsPic;
        }

        return new Promise((resolve, reject) => {
            this
                .fetchAccessToken()
                .then(data => {
                    let uri = uploadUrl + `access_token=${data.access_token}`;

                    if (!permanent) {
                        uri += `&type=${type}`;
                    } else {
                        form.access_token = data.access_token;
                    }

                    const options = {
                        method: 'POST',
                        uri: uri,
                        json: true
                    };

                    if (type === 'news') {
                        options.body = form;
                    } else {
                        options.formData = form;
                    }
                    rp(options)
                        .then(res => {
                            const _data = res;
                            if (_data) {
                                resolve(_data);
                            } else {
                                throw new Error('Upload material fails')
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                })

        });
    }
    // 创建菜单
    createMenu(menu) {
        return new Promise((resolve, reject) => {
            this
                .fetchAccessToken()
                .then(data => {
                    const uri = api.menu.create + `access_token=${data.access_token}`;

                    rp({ method: 'POST', uri: uri, body: menu, json: true })
                        .then(res => {
                            const _data = res;
                            if (_data) {
                                resolve(_data);
                            } else {
                                throw new Error('Create Menu fails')
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                })
        });
    }
    //获取菜单
    getMenu() {
        return new Promise((resolve, reject) => {
            this
                .fetchAccessToken()
                .then(data => {
                    const uri = api.menu.get + `access_token=${data.access_token}`;

                    rp({ uri: uri, json: true })
                        .then(res => {
                            const _data = res;
                            if (_data) {
                                resolve(_data);
                            } else {
                                throw new Error('Get Menu fails')
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                })
        });
    }

    deleteMenu() {
        return new Promise((resolve, reject) => {
            this
                .fetchAccessToken()
                .then(data => {
                    const uri = api.menu.del + `access_token=${data.access_token}`;

                    rp({ uri: uri, json: true })
                        .then(res => {
                            const _data = res;
                            if (_data) {
                                resolve(_data);
                            } else {
                                throw new Error('Delete Menu fails')
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                })
        });
    }

    reply(ctx) {
        const content = ctx.body;
        const message = ctx.wxMsg;

        const xml = util.tpl(content, message);

        ctx.status = 200;
        ctx.type = 'application/xml';
        ctx.body = xml;
    }
}

module.exports = Wechat;