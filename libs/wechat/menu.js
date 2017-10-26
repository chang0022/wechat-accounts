'use strict';

module.exports = {
    'button': [
        {
            'name': '测试案例',
            'type': 'click',
            'key': 'menu_click'
        },
        {
            'name': '新建菜单',
            "sub_button": [
                {
                    "type": "view",
                    "name": "百度",
                    "url": "https://baidu.com"
                },
                {
                    "type": "scancode_push",
                    "name": "扫码推事件",
                    'key': 'qr_scan'
                },
                {
                    "type": "scancode_waitmsg",
                    "name": "扫码带提示",
                    'key': 'qr_scan_wait'
                },
                {
                    "type": "pic_sysphoto",
                    "name": "系统拍照发图",
                    "key": "pic_photo"
                },
                {
                    "type": "pic_photo_or_album",
                    "name": "拍照或者相册发图",
                    "key": "pic_photo_album"
                }
            ]
        },
        {
            'name': '发送',
            'sub_button': [
                {
                    "type": "pic_weixin",
                    "name": "微信相册发图",
                    "key": "rselfmenu_1_2"
                },
                {
                    "name": "发送位置",
                    "type": "location_select",
                    "key": "rselfmenu_2_0"
                }
            ]
        }
    ]
};

// {
//     "type": "media_id",
//     "name": "图片",
//     "media_id": "MEDIA_ID1"
// },
// {
//     "type": "view_limited",
//     "name": "图文消息",
//     "media_id": "MEDIA_ID2"
// }