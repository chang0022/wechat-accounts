'use strict';
/**
 * 素材管理接口，必须通过微信认证
 */
const fs = require('fs');
const request = require('request');
const rp = require('request-promise-native');
const Wechat = require('./index');
const config = require('../../config/wx.config');
const api = require('../../config/wx.api');

class Material extends Wechat {
    //上传素材
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
    //获取素材
    fetchMaterial(mediaId, type, permanent) {
        let fetchUrl = api.temporary.fetch;
        let form = {};
        if (permanent) {
            fetchUrl = api.permanent.fetch;
        }

        return new Promise((resolve, reject) => {
            this
                .fetchAccessToken()
                .then(data => {
                    let uri = fetchUrl + `access_token=${data.access_token}`;

                    const options = {
                        method: 'POST',
                        uri: uri,
                        json: true
                    };
                    if (permanent) {
                        form.media_id = mediaId;
                        form.access_token = data.access_token;
                        options.body = from;
                    } else {
                        if (type === 'video') {
                            uri = uri.replace('https://', 'http://');
                        }
                        uri += `&media_id=${mediaId}`;
                    }

                    if (type === 'news' || type === 'video') {
                        rp(options)
                            .then(res => {
                                const _data = res;
                                if (_data) {
                                    resolve(_data);
                                } else {
                                    throw new Error('Fetch material fails')
                                }
                            })
                            .catch(err => {
                                reject(err);
                            });
                    } else {
                        resolve(uri);
                    }

                })
        });
    }
    //删除素材
    deleteMaterial(mediaId) {
        const form = {
            media_id: mediaId
        };

        return new Promise((resolve, reject) => {
            this
                .fetchAccessToken()
                .then(data => {
                    let uri = api.permanent.del + `access_token=${data.access_token}`;

                    rp({ method: 'POST', uri: uri, body: form, json: true })
                        .then(res => {
                            const _data = res;
                            if (_data) {
                                resolve(_data);
                            } else {
                                throw new Error('Delete material fails')
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                })
        });
    }

    //更新素材
    updateMaterial(mediaId, news) {
        const form = {
            media_id: mediaId
        };
        Object.assign(form, news);
        return new Promise((resolve, reject) => {
            this
                .fetchAccessToken()
                .then(data => {
                    let uri = api.permanent.update + `access_token=${data.access_token}`;

                    rp({ method: 'POST', uri: uri, body: form, json: true })
                        .then(res => {
                            const _data = res;
                            if (_data) {
                                resolve(_data);
                            } else {
                                throw new Error('Update material fails')
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                })

        });
    }
    // 获取素材总量
    countMaterial() {
        return new Promise((resolve, reject) => {
            this
                .fetchAccessToken()
                .then(data => {
                    let uri = api.permanent.count + `access_token=${data.access_token}`;

                    rp({ uri: uri, json: true })
                        .then(res => {
                            const _data = res;
                            if (_data) {
                                resolve(_data);
                            } else {
                                throw new Error('Count material fails')
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                })
        });
    }

    // 获取素材列表
    batchMaterial(options) {
        let setting = {
            type: 'image',
            offset: 0,
            count: 1
        };

        Object.assign(setting, options);

        return new Promise((resolve, reject) => {
            this
                .fetchAccessToken()
                .then(data => {
                    let uri = api.permanent.batch + `access_token=${data.access_token}`;

                    rp({ method: 'POST', uri: uri, body: options, json: true })
                        .then(res => {
                            const _data = res;
                            if (_data) {
                                resolve(_data);
                            } else {
                                throw new Error('Batch material fails')
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
    return new Material(config.wechat);
};