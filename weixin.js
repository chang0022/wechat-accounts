'use strict'

exports.reply = async (ctx, next) => {
    const message = ctx.weixin;

    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            if (message.EventKey) {
                console.log('扫描二维码' + message.EventKey + ' ' + message.ticket);
                ctx.body = '哈哈，欢迎订阅\r\n' + ' 消息ID：' + message.MsgID;
            }
        } else if (message.Event === 'unsubscribe') {
            console.log('无情取关！');
            ctx.body = '';
        }
    } else {

    }

    await next();
}