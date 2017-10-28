'use strict';

const path = require('path');
const config = require('../../config/wx.config');
const materialApi = require('./material')();
const userApi = require('./user')();
const robot = require('./robot');

module.exports = async (ctx, next) => {
    const message = ctx.wxMsg;

    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log('扫描二维码' + message.EventKey + ' ' + message.ticket);
            }
            ctx.body = '哈哈，欢迎订阅\r\n' + '-----消息来自老常';
        } else if (message.Event === 'unsubscribe') {
            console.log('无情取关！');
            ctx.body = '';
        } else if (message.Event === 'LOCATION') {
            ctx.body = '你的地理位置是：' + message.Latitude + '/' + message.Longitude + '-' + message.Precision;
        } else if (message.Event === 'CLICK') {
            ctx.body = '你点击了菜单：' + message.EventKey;
        } else if (message.Event === 'SCAN') {
            console.log('关注后扫二维码' + message.EventKey + ' ' + message.Ticket);
            ctx.body = '看到你扫了一下哦';
        } else if (message.Event === 'VIEW') {
            ctx.body = '很好~VIEW';
        } else if (message.Event === 'scancode_push') {
            console.log(message.ScanCodeInfo.ScanType);
            console.log(message.ScanResult);
            ctx.body = '很好~scancode_push';
        } else if (message.Event === 'scancode_waitmsg') {
            console.log(message.ScanCodeInfo.ScanType);
            console.log(message.ScanResult);
            ctx.body = '很好~scancode_waitmsg';
        }
        else if (message.Event === 'pic_sysphoto') {
            console.log(message.SendPicsInfo.PicList)
            ctx.body = '很好~pic_sysphoto';
        }
        else if (message.Event === 'pic_photo_or_album') {
            console.log(message.SendPicsInfo.PicList)
            ctx.body = '很好~pic_photo_or_album';
        } else if (message.Event === 'pic_weixin') {
            console.log(message.SendPicsInfo.PicList)
            ctx.body = '很好~pic_weixin';
        } else if (message.Event === 'location_select') {
            console.log(message.SendLocationInfo.Location_X)
            console.log(message.SendLocationInfo.Location_Y)
            console.log(message.SendLocationInfo.Scale)
            console.log(message.SendLocationInfo.Label)
            ctx.body = '很好~location_select';
        }
    } else if (message.MsgType === 'text') {
        const content = message.Content;
        let reply = null;
        let data = null;

        switch (content) {
            case '慕课':
                reply = [
                    {
                        title: '7天搞定Node.js微信公众号',
                        description: 'Koa框架、ES2015新特性、MongoDB，开发微信公众号',
                        picurl: 'http://img1.sycdn.imooc.com/szimg/576376520001da3d05400300-360-202.jpg',
                        url: 'http://coding.imooc.com/class/38.html'
                    },
                    {
                        title: 'Node.js入门到企业Web开发中的应用',
                        description: 'Node.js是Web应用开发的一个福音，特别适合中小型系统的快速开发！',
                        picurl: 'http://img1.sycdn.imooc.com/szimg/59c860220001247d05400300-360-202.jpg',
                        url: 'http://coding.imooc.com/class/146.html'
                    },
                    {
                        title: '全网稀缺Vue 2.0高级实战 独立开发专属音乐WebAPP',
                        description: '独一无二的Vue 2.0高级实战课程，达到百度T4水平',
                        picurl: 'http://img1.sycdn.imooc.com/szimg/592e2eab0001302505660314-360-202.jpg',
                        url: 'http://coding.imooc.com/class/107.html'
                    }
                ];
                break;
            case '图片':
                data = await materialApi.uploadMaterial('image', path.join(__dirname, '../../static/image/avatar.jpg'));
                console.log(data)
                reply = {
                    type: 'image',
                    mediaId: data.media_id
                };
                break;
            case '永久':
                data = await materialApi.uploadMaterial('image', path.join(__dirname, '../../static/image/permanent.jpg'), { type: 'image' });
                reply = {
                    type: 'image',
                    mediaId: data.media_id
                };
                break;
            case '计算':
                const count = await materialApi.countMaterial();

                const list = await materialApi.batchMaterial({
                    type: 'image',
                    offset: 0,
                    count: 10
                });

                console.log(count);
                console.log(list);
                reply = '计算完毕';
                break;
            case '获取':
                const userList = await userApi.fetchUserList();
                console.log(userList);
                reply = '获取完毕';
                break;
            case '信息':
                const user = await userApi.fetchUsers(message.FromUserName);
                console.log(user);
                reply = '获取个人信息';
                break;
            default:
                reply = await robot(message.Content);
        }

        ctx.body = reply;
    } else if (message.MsgType === 'image') {
        ctx.body = message.PicUrl;
    } else if (message.MsgType === 'voice') {
        ctx.body = message.Recognition;
    } else if (message.MsgType === 'video') {
        ctx.body = message.MediaId;
    } else if (message.MsgType === 'shortvideo') {
        ctx.body = message.MediaId;
    } else if (message.MsgType === 'location') {
        ctx.body = message.Label;
    }

    await next();
};