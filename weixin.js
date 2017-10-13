'use strict'

const config = require('./config')
const Wechat = require('./wechat/wechat');
const wechatApi = new Wechat(config.wechat);

exports.reply = async (ctx, next) => {
    const message = ctx.weixin;

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
            ctx.body = '你点击了菜单中的链接：' + message.EventKey;
        }
    } else if (message.MsgType === 'text') {
        const content = message.Content;
        let reply = null;
        let data = null;

        switch (content) {
            case '1':
                reply = '一心敬';
                break;
            case '2':
                reply = '哥俩好';
                break;
            case '3':
                reply = '三桃园';
                break;
            case '4':
                reply = '四季财';
                break;
            case '5':
                reply = '五魁首';
                break;
            case '6':
                reply = '六六顺';
                break;
            case '7':
                reply = '七仙女';
                break;
            case '8':
                reply = '八匹马';
                break;
            case '9':
                reply = '九盅酒';
                break;
            case '10':
                reply = '十全美';
                break;
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
                data = await wechatApi.uploadMaterial('image', __dirname + '/image/avatar.jpg');
                reply = {
                    type: 'image',
                    mediaId: data.media_id
                }
                break;
            case '永久':
                data = await wechatApi.uploadMaterial('image', __dirname + '/image/permanent.jpg', { type: 'image' });
                reply = {
                    type: 'image',
                    mediaId: data.media_id
                }
                break;
            // case '视频':
            //     data = await wechatApi.uploadMaterial('video', __dirname + '/video/video.mp4', { type: 'video', description: '{"title":"一个小视频", "introduction":"日常拍摄"}' });
            //     reply = {
            //         type: 'video',
            //         title: '日常一角',
            //         description: '未知视频',
            //         mediaId: data.media_id
            //     }
            //     break;
            case '计算':
                const count = await wechatApi.countMaterial();

                const list = await wechatApi.batchMaterial({
                    type: 'image',
                    offset: 0,
                    count: 10
                });

                console.log(count);
                console.log(list);
                reply = '计算完毕';
                break;
            case '获取':
                const userList = await wechatApi.fetchUserList();
                console.log(userList);
                reply = '获取完毕';
                break;
            case '信息':
                const user = await wechatApi.fetchUsers(message.FromUserName);
                console.log(user);
                reply = '获取个人信息';
                break;
            default:
                reply = '你的说：' + message.Content + ' 不明白';
        }

        ctx.body = reply;
    }

    await next();
}