'use strict';
/**
 * 菜单接口，必须通过微信认证
 */
const request = require('request');
const rp = require('request-promise-native');
const Wechat = require('./index');
const config = require('../../config/wx.config');
const api = require('../../config/wx.api');

class Menu extends Wechat {
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
    // 删除菜单
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
    // 获取自定义菜单配置接口
    getCurrentMenu() {
        return new Promise((resolve, reject) => {
            this
                .fetchAccessToken()
                .then(data => {
                    const uri = api.menu.current + `access_token=${data.access_token}`;

                    rp({ uri: uri, json: true })
                        .then(res => {
                            const _data = res;
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
    }
}

module.exports = () => {
    return new Menu(config.wechat);
};