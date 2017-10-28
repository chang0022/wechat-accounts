'use strict';

module.exports = {
    'button': [
        {
            'name': '测试',
            'type': 'click',
            'key': 'menu_click'
        },
        {
            'name': '搜索',
            "sub_button": [
                {
                    "type": "view",
                    "name": "搜索电影",
                    "url": "http://f6khf9.natappfree.cc/movie"
                }
            ]
        }
    ]
};
