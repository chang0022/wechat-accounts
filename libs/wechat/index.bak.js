'use strict';

const _ = require('lodash');
const util = require('util');
const fs = require('fs');
const request = util.promisify(require('request'));
const wechat_util = require('./wechat_util');



function Wechat(opts) {
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.getTicket = opts.getTicket;
    this.saveTicket = opts.saveTicket;

    this.fetchAccessToken();
}
// 获取访问令牌
Wechat.prototype.fetchAccessToken = function (data) {
    const self = this;

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
                return self.updateAccessToken();
            }

            if (self.isValidAccessToken(data)) {
                return Promise.resolve(data);
            } else {
                return self.updateAccessToken();
            }
        })
        .then(data => {
            self.saveAccessToken(data);

            return Promise.resolve(data);
        })
};
// 验证访问令牌
Wechat.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }

    const access_token = data.access_token;
    const expires_in = data.expires_in;
    const now = new Date().getTime();

    return (now < expires_in);
};
// 更新访问令牌
Wechat.prototype.updateAccessToken = function () {
    const appID = this.appID;
    const appSecret = this.appSecret;
    const url = api.accessToken + `&appid=${appID}&secret=${appSecret}`;

    return new Promise((resolve, reject) => {
        request({ url: url, json: true }).then(res => {
            const data = res.body;
            const now = new Date().getTime();

            data.expires_in = now + (data.expires_in - 20) * 1000;;
            resolve(data);
        });
    });
};
// 获取票据
Wechat.prototype.fetchTicket = function (access_token) {
    const self = this;

    return this.getTicket()
        .then(data => {
            try {
                data = JSON.parse(data);
            } catch (e) {
                return self.updateTicket(access_token);
            }

            if (self.isValidTicket(data)) {
                return Promise.resolve(data);
            } else {
                return self.updateTicket(access_token);
            }
        })
        .then(data => {
            self.saveTicket(data);

            return Promise.resolve(data);
        })
};
// 验证票据
Wechat.prototype.isValidTicket = function (data) {
    if (!data || !data.ticket || !data.expires_in) {
        return false;
    }

    const ticket = data.ticket;
    const expires_in = data.expires_in;
    const now = new Date().getTime();

    return (ticket && now < expires_in);
};
// 更新票据
Wechat.prototype.updateTicket = function (access_token) {
    const url = api.ticket.get + `&access_token=${access_token}&type=jsapi`;

    return new Promise((resolve, reject) => {
        request({ url: url, json: true }).then(res => {
            const data = res.body;
            const now = new Date().getTime();

            data.expires_in = now + (data.expires_in - 20) * 1000;;
            resolve(data);
        });
    });
};
// 上传素材
Wechat.prototype.uploadMaterial = function (type, material, permanent) {
    const self = this;
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
                };

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
};
// 获取素材
Wechat.prototype.fetchMaterial = function (mediaId, type, permanent) {
    const self = this;
    let fetchUrl = api.temporary.fetch;

    let form = {};

    if (permanent) {
        fetchUrl = api.permanent.fetch;
    }

    return new Promise((resolve, reject) => {
        self
            .fetchAccessToken()
            .then(data => {
                let url = fetchUrl + `access_token=${data.access_token}`;

                const options = {
                    method: 'POST',
                    url: url,
                    json: true
                };
                if (permanent) {
                    form.media_id = mediaId;
                    form.access_token = data.access_token;
                    options.body = from;
                } else {
                    if (type === 'video') {
                        url = url.replace('https://', 'http://');
                    }
                    url += `&media_id=${mediaId}`;
                }

                if (type === 'news' || type === 'video') {
                    request(options)
                        .then(res => {
                            const _data = res.body;
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
                    resolve(url);
                }

            })

    });
};
//删除素材
Wechat.prototype.deleteMaterial = function (mediaId) {
    const self = this;
    const form = {
        media_id: mediaId
    };

    return new Promise((resolve, reject) => {
        self
            .fetchAccessToken()
            .then(data => {
                let url = api.permanent.del + `access_token=${data.access_token}`;

                request({ method: 'POST', url: url, body: form, json: true })
                    .then(res => {
                        const _data = res.body;
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
};
// 更新素材
Wechat.prototype.updateMaterial = function (mediaId, news) {
    const self = this;
    const form = {
        media_id: mediaId
    };
    _.extend(form, news);
    return new Promise((resolve, reject) => {
        self
            .fetchAccessToken()
            .then(data => {
                let url = api.permanent.update + `access_token=${data.access_token}`;

                request({ method: 'POST', url: url, body: form, json: true })
                    .then(res => {
                        const _data = res.body;
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
};
// 获取素材总量
Wechat.prototype.countMaterial = function () {
    const self = this;

    return new Promise((resolve, reject) => {
        self
            .fetchAccessToken()
            .then(data => {
                let url = api.permanent.count + `access_token=${data.access_token}`;

                request({ url: url, json: true })
                    .then(res => {
                        const _data = res.body;
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
};
// 获取素材列表
Wechat.prototype.batchMaterial = function (options) {
    const self = this;

    let setting = {
        type: 'image',
        offset: 0,
        count: 1
    };

    _.extend(setting, options);

    return new Promise((resolve, reject) => {
        self
            .fetchAccessToken()
            .then(data => {
                let url = api.permanent.batch + `access_token=${data.access_token}`;

                request({ method: 'POST', url: url, body: options, json: true })
                    .then(res => {
                        const _data = res.body;
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
};
// 备注用户
Wechat.prototype.remarkUser = function (openId, remark) {
    const self = this;
    const form = {
        openid: openId,
        remark: remark
    };
    return new Promise((resolve, reject) => {
        self
            .fetchAccessToken()
            .then(data => {
                let url = api.user.remark + `access_token=${data.access_token}`;

                request({ method: 'POST', url: url, body: form, json: true })
                    .then(res => {
                        const _data = res.body;
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
};
// 获取用户信息
Wechat.prototype.fetchUsers = function (openIds, lang) {
    const self = this;
    lang = lang || 'zh_CN';
    console.log(self.fetchAccessToken());
    return new Promise((resolve, reject) => {
        self
            .fetchAccessToken()
            .then(data => {
                const options = {
                    json: true
                };
                if (_.isArray(openIds)) {
                    options.url = api.user.batchFetch + `access_token=${data.access_token}`;

                    options.body = {
                        user_list: openIds
                    };
                    options.method = 'POST';
                } else {
                    options.url = api.user.fetch + `access_token=${data.access_token}&openid=${openIds}&lang=${lang}`;
                }

                request(options)
                    .then(res => {
                        const _data = res.body;
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
};
// 获取用户列表
Wechat.prototype.fetchUserList = function (next_openid) {
    const self = this;
    return new Promise((resolve, reject) => {
        self
            .fetchAccessToken()
            .then(data => {
                let url = null;
                if (next_openid) {
                    url = api.user.list + `access_token=${data.access_token}&next_openid=${next_openid}`;
                } else {
                    url = api.user.list + `access_token=${data.access_token}`;
                }

                request({ url: url, json: true })
                    .then(res => {
                        const _data = res.body;
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
};
// 创建菜单
Wechat.prototype.createMenu = function (menu) {
    const self = this;
    return new Promise((resolve, reject) => {
        self
            .fetchAccessToken()
            .then(data => {
                const url = api.menu.create + `access_token=${data.access_token}`;

                request({ method: 'POST', url: url, body: menu, json: true })
                    .then(res => {
                        const _data = res.body;
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
};
// 获取菜单
Wechat.prototype.getMenu = function () {
    const self = this;
    return new Promise((resolve, reject) => {
        self
            .fetchAccessToken()
            .then(data => {
                const url = api.menu.get + `access_token=${data.access_token}`;

                request({ url: url, json: true })
                    .then(res => {
                        const _data = res.body;
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
};
//删除菜单
Wechat.prototype.deleteMenu = function () {
    const self = this;
    return new Promise((resolve, reject) => {
        self
            .fetchAccessToken()
            .then(data => {
                const url = api.menu.del + `access_token=${data.access_token}`;

                request({ url: url, json: true })
                    .then(res => {
                        const _data = res.body;
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
};
// 获取自定义菜单配置接口
Wechat.prototype.getCurrentMenu = function () {
    const self = this;
    return new Promise((resolve, reject) => {
        self
            .fetchAccessToken()
            .then(data => {
                const url = api.menu.current + `access_token=${data.access_token}`;

                request({ url: url, json: true })
                    .then(res => {
                        const _data = res.body;
                        if (_data) {
                            resolve(_data);
                        } else {
                            throw new Error('Get current self menu fails')
                        }
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
    });
};
// 创建二维码
Wechat.prototype.createQrcode = function (qr) {
    const self = this;
    return new Promise((resolve, reject) => {
        self
            .fetchAccessToken()
            .then(data => {
                const url = api.qrcode.create + `access_token=${data.access_token}`;

                request({ method: 'POST', url: url, body: qr, json: true })
                    .then(res => {
                        const _data = res.body;
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
};
// 展示二维码
Wechat.prototype.showQrcode = function (ticket) {
    return api.qrcode.show + `ticket=${encodeURI(ticket)}`;
};
//创建短链接
Wechat.prototype.createShorturl = function (action, url) {
    const self = this;

    action = action || 'long2short';

    return new Promise((resolve, reject) => {
        self
            .fetchAccessToken()
            .then(data => {
                const url = api.qrcode.shorturl + `access_token=${data.access_token}`;
                const form = {
                    action: action,
                    long_url: url
                }
                request({ method: 'POST', url: url, body: form, json: true })
                    .then(res => {
                        const _data = res.body;
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
};
//语义理解
Wechat.prototype.semantic = function (semanticData) {
    const self = this;

    return new Promise((resolve, reject) => {
        self
            .fetchAccessToken()
            .then(data => {
                const url = api.semantic + `access_token=${data.access_token}`;
                semanticData.appid = data.appID;
                request({ method: 'POST', url: url, body: semanticData, json: true })
                    .then(res => {
                        const _data = res.body;
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
};

Wechat.prototype.reply = function (ctx) {
    const content = ctx.body;
    const message = ctx.weixin;

    const xml = wechat_util.tpl(content, message);

    ctx.status = 200;
    ctx.type = 'application/xml';
    ctx.body = xml;
};
module.exports = Wechat;