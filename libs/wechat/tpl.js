'use strict';

module.exports = (data) => {
    let tpl = `<xml>
    <ToUserName><![CDATA[${data.toUserName}]]></ToUserName>
    <FromUserName><![CDATA[${data.fromUserName}]]></FromUserName>
    <CreateTime>${data.createTime}></CreateTime>
    <MsgType><![CDATA[${data.msgType}]]></MsgType>
    `;
    switch (data.msgType) {
        case 'image':
            tpl += `<Image>
                <MediaId><![CDATA[${data.content.mediaId}]]></MediaId>
            </Image>
            </xml>`;
            break;
        case 'voice':
            tpl += `<Voice>
                <MediaId><![CDATA[${data.content.mediaId}]]></MediaId>
            </Voice>
            </xml>`;
            break;
        case 'video':
            tpl += `<Video>
                <MediaId><![CDATA[${data.content.mediaId}]]></MediaId>
                <Title><![CDATA[${data.content.title}]]></Title>
                <Description><![CDATA[${data.content.description}]]></Description>
            </Video>
            </xml>`;
            break;
        case 'music':
            tpl += `<Music>
                <Title><![CDATA[${data.content.title}]]></Title>
                <Description><![CDATA[${data.content.description}]]></Description>
                <MusicUrl><![CDATA[${data.content.music_url}]]></MusicUrl>
                <HQMusicUrl><![CDATA[${data.content.hq_music_url}]]></HQMusicUrl>
                <ThumbMediaId><![CDATA[${data.content.media_id}]]></ThumbMediaId>
            </Music>
            </xml>`;
            break;
        case 'news':
            let articles = '';
            data.content.forEach(function (item) {
                articles += `<item>
                    <Title><![CDATA[${item.title}]]></Title>
                    <Description><![CDATA[${item.description}]]></Description>
                    <PicUrl><![CDATA[${item.picurl}]]></PicUrl>
                    <Url><![CDATA[${item.url}]]></Url>
                </item>`;
            });
            tpl += `<ArticleCount>${data.content.length}</ArticleCount>
            <Articles>
                ${articles}
            </Articles>
            </xml>
`;
            break;
        default:
            tpl += `<Content><![CDATA[${data.content}]]></Content>
            </xml>`;
            break;
    }
    return tpl;
}

