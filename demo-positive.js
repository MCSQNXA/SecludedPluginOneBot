// https://github.com/MCSQNXA/Secluded-plugin-demo-nodejs
// noinspection JSUnresolvedReference

const PositiveWebSocket = require('./lib/positive-websocket');

const bot = new PositiveWebSocket({
    'url': 'ws://localhost:8090',                 // Secluded 运行设置 里面的 正向 WebSocket 地址:端口
    'access_token': 'LRjPX2tJ4Jv9NqBw',           // Secluded 运行设置 里面的 正向 WebSocket 令牌
});

bot.on('group_message', async (json) => {
    if (json['raw_message'] === '文本') {
        bot.sendGroupMsg(json, [
            {'type': 'text', 'data': {'text': `你说的是：${json['raw_message']}`}}
        ]);
    }

    if (json['raw_message'] === '图片') {
        bot.sendGroupMsg(
            json, [
                {'type': 'image', 'data': {'file': `https://q1.qlogo.cn/g?b=qq&nk=3337140142&s=640`}}
            ]);
    }

    if (json['raw_message'] === '图文') {
        bot.sendGroupMsg(json, [
            {'type': 'text', 'data': {'text': `图文 666`}},
            {'type': 'image', 'data': {'file': `https://q1.qlogo.cn/g?b=qq&nk=3337140142&s=640`}}
        ]);
    }

    if (json['raw_message'] === '语音') {
        bot.sendGroupMsg(json, [
            {
                'type': 'record',
                'data': {'file': `https://m.kugou.com/api/v1/wechat/index?uuid=574d1101a331614d56f05f232dbb330d&album_audio_id=106863208&ext=m4a&apiver=2&cmd=101&album_id=8448864&hash=9d28faa0941c2e12c00dc4f8d20a7730&plat=0&version=11309&share_chl=qq_client&mid=304000542424130980213570746762493114069&key=8be2f563b18b4a8483ddc4ef4c4cd432&_t=1663479934&user_id=746798753&sign=c141a9e2a33a3215ea69346e7b633c70`}
            }
        ]);
    }

    if (json['raw_message'] === '艾特我') {
        bot.sendGroupMsg(json, [
            {
                'type': 'at',
                'data': {'qq': json['user_id'], 'name': json['user_name']}
            },
            {'type': 'text', 'data': {'text': ` 666`}},
        ]);
    }

    if (json['raw_message'] === '艾特全体成员') {
        bot.sendGroupMsg(json, [
            {
                'type': 'at',
                'data': {'qq': 'all'}
            },
            {'type': 'text', 'data': {'text': ` 666`}},
        ]);
    }

    if (json['raw_message'] === '回复') {
        bot.sendGroupMsg(json, [
            {'type': 'reply', 'data': {'id': json['message_id']}},
            {'type': 'text', 'data': {'text': `666`}},
        ]);
    }

    if (json['raw_message'] === '撤回我的消息') {// 当 机器人 是 群主/管理员 的 时候 撤回 普通成员 的 我
        bot.deleteMsg(json);
        bot.sendGroupMsg(json, [
            {'type': 'text', 'data': {'text': `好的`}},
        ]);
    }

    if (json['raw_message'] === '获取登录信息') {
        bot.sendGroupMsg(json, [
            {'type': 'text', 'data': {'text': `好的`}},
        ]);
        bot.sendAction('get_login_info', {
            'self': {'user_id': json['self']['user_id']},// 指定 机器人账号
        });// 看日志
    }

    if (json['raw_message'] === '点赞我') {
        bot.sendGroupMsg(json, [
            {'type': 'text', 'data': {'text': `好的`}},
        ]);
        bot.sendAction('send_like', {
            'self': {'user_id': json['self']['user_id']},// 指定 机器人账号
            'user_id': json['user_id'],// 点赞对象
            'times': 10// 点赞数量
        });// 看日志
    }


});

bot.on('private_message', async (json) => {
    bot.sendPrivateMsg(json, [
        {'type': 'text', 'data': {'text': `你发的消息是：${json['raw_message']}`}}
    ]);
});

bot.on('connect', async () => {
    console.log('[OneBot] 机器人已上线！');
});

bot.connect();
