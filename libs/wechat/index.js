'use strict';

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

    fetchAccessToken() {
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

    // 获取票据
    fetchTicket(access_token) {
        return this.getTicket()
            .then(data => {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    return this.updateTicket(access_token);
                }

                if (this.isValidTicket(data)) {
                    return Promise.resolve(data);
                } else {
                    return this.updateTicket(access_token);
                }
            })
            .then(data => {
                this.saveTicket(data);
                return Promise.resolve(data);
            })
    }

    // 验证票据
    isValidTicket(data) {
        if (!data || !data.ticket || !data.expires_in) {
            return false;
        }

        const ticket = data.ticket;
        const expires_in = data.expires_in;
        const now = new Date().getTime();

        return (ticket && now < expires_in);
    }
    // 更新票据
    updateTicket(access_token) {
        const uri = api.ticket.get + `&access_token=${access_token}&type=jsapi`;

        return new Promise((resolve, reject) => {
            rp({ uri: uri, json: true }).then(res => {
                const data = res;
                const now = new Date().getTime();

                data.expires_in = now + (data.expires_in - 20) * 1000;;
                resolve(data);
            });
        });
    }

    static reply(ctx) {
        const content = ctx.body;
        const message = ctx.wxMsg;

        const xml = util.tpl(content, message);

        ctx.status = 200;
        ctx.type = 'application/xml';
        ctx.body = xml;
    }
}

module.exports = Wechat;