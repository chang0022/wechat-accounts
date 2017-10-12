'use strict'

const _ = require('lodash')
const util = require('util');
const fs = require('fs');
const request = util.promisify(require('request'));
const wechat_util = require('./wechat_util');

const prefix = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
    accessToken: prefix + 'token?grant_type=client_credential',
    temporary: {
        upload: prefix + 'media/upload?'
    },
    permanent: {
        upload: prefix + 'material/add_material?',
        uploadNews: prefix + 'material/add_news?',
        uploadNewsPic: prefix + 'material/uploadimg?'
    }
};

function Wechat(opts) {
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;

    this.fetchAccessToken();
}

Wechat.prototype.fetchAccessToken = function (data) {
    var self = this;

    if (this.access_token && this.expires_in) {
        if (this.isValidAccessToken(this)) {
            return Promise.resolve(this);
        }
    }

    this.getAccessToken()
        .then(data => {
            try {
                data = JSON.parse();
            } catch (e) {
                return self.updateAccessToken();
            }

            if (self.isValidAccessToken(data)) {
                return Promise.resolve(data);
            } else {
                return self.updateAccessToken();
            }
        })
        .then(data => {
            self.access_token = data.access_token;
            self.expires_in = data.expires_in;

            self.saveAccessToken(data);

            return Promise.resolve(data);
        })
}
Wechat.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }

    const access_token = data.access_token;
    const expires_in = data.expires_in;
    const now = new Date().getTime();

    if (now < expires_in) {
        return true;
    } else {
        return false;
    }
}

Wechat.prototype.updateAccessToken = function () {
    const appID = this.appID;
    const appSecret = this.appSecret;
    const url = api.accessToken + `&appid=${appID}&secret=${appSecret}`;

    return new Promise((resolve, reject) => {
        request({ url: url, json: true }).then(res => {
            const data = res.body;
            const now = new Date().getTime();
            const expires_in = now + (data.expires_in - 20) * 1000;

            data.expires_in = expires_in;
            resolve(data);
        });
    });
}

Wechat.prototype.uploadMaterial = function (type, material, permanent) {
    var self = this;
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
        self
            .fetchAccessToken()
            .then(data => {
                let url = uploadUrl + `access_token=${data.access_token}`;

                if (!permanent) {
                    url += `&type=${type}`;
                } else {
                    form.access_token = data.access_token;
                }

                const options = {
                    method: 'POST',
                    url: url,
                    json: true
                }

                if (type === 'news') {
                    options.body = form;
                } else {
                    options.formData = form;
                }
                request(options)
                    .then(res => {
                        const _data = res.body;
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

Wechat.prototype.reply = function (ctx) {
    var content = ctx.body;
    var message = ctx.weixin;

    var xml = wechat_util.tpl(content, message);

    ctx.status = 200;
    ctx.type = 'application/xml';
    ctx.body = xml;
}
module.exports = Wechat;