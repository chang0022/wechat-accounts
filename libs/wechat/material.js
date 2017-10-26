'use strict';

const fs = require('fs');
const request = require('request');
const rp = require('request-promise-native');
const Wechat = require('./index');
const api = require('../../config/wx.api');

class Material extends Wechat {
    constructor(opts) {
        super(opts);
    }
    //上传素材：必须通过微信认证
    uploadMaterial(type, material, permanent) {
        let form = {};
        let uploadUrl = api.temporary.upload;

        if (permanent) {
            uploadUrl = api.permanent.upload;
            Object.assign(form, permanent);
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
}

module.exports = Material;