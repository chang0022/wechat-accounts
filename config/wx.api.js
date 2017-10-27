'use strict';

const prefix = 'https://api.weixin.qq.com/cgi-bin/';
const mp_prefix = 'https://mp.weixin.qq.com/cgi-bin/';
const api = {
    accessToken: prefix + 'token?grant_type=client_credential',
    temporary: {
        upload: prefix + 'media/upload?',
        fetch: prefix + '/media/get?'
    },
    permanent: {
        upload: prefix + 'material/add_material?',
        uploadNews: prefix + 'material/add_news?',
        uploadNewsPic: prefix + 'media/uploadimg?',
        fetch: prefix + 'material/get_material?',
        del: prefix + 'material/del_material?',
        update: prefix + 'material/update_news?',
        count: prefix + 'material/get_materialcount?',
        batch: prefix + 'material/batchget_material?'
    },
    user: {
        list: prefix + 'user/get?',
        remark: prefix + 'user/info/updateremark?',
        fetch: prefix + 'user/info?',
        batchFetch: prefix + 'user/info/batchget?'
    },
    menu: {
        create: prefix + 'menu/create?',
        get: prefix + 'menu/get?',
        del: prefix + 'menu/delete?',
        current: prefix + 'get_current_selfmenu_info?'
    },
    qrcode: {
        create: prefix + 'qrcode/create?',
        show: mp_prefix + 'showqrcode?',
        shorturl: prefix + 'shorturl?'
    },
    semantic: 'https://api.weixin.qq.com/semantic/semproxy/search?',
    ticket: {
        get: prefix + 'ticket/getticket?'
    },
    turing: 'http://www.tuling123.com/openapi/api'
};

module.exports = api;