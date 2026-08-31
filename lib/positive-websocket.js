// noinspection DuplicatedCode,JSUnresolvedReference

const WebSocket = require('ws');

class PositiveWebSocket {
    /**
     * 初始化 OneBot 12 正向 WebSocket
     * @param {Object} options 配置项
     * @param {string} options.url WebSocket 地址
     * @param {string} [options.access_token] 鉴权 token
     * @param {number} [options.reconnectInterval] 重连间隔（毫秒）
     */
    constructor(options) {
        this.url = options.url;
        this.access_token = options.access_token || '';
        this.reconnectInterval = options.reconnectInterval || 3000;

        this.ws = null;
        this.isConnected = false;
        this.eventListeners = {};
        this.echo = 0;
    }

    /**
     * 启动连接
     */
    connect() {
        try {
            const headers = {};
            headers.Authorization = `Bearer ${this.access_token}`;

            this.ws = new WebSocket(this.url, {headers});
            this.ws.on('open', () => {
                console.log('[OneBot] WebSocket 连接成功 ✅');
                this.isConnected = true;
                this._emit('connect');
            });
            this.ws.on('message', (data) => {
                this._handleMessage(JSON.parse(data.toString()));
            });
            this.ws.on('close', (code, reason) => {
                console.log(`[OneBot] 连接关闭：${code} ${reason}`);
                this.isConnected = false;
                this._emit('close', code, reason);
                setTimeout(() => this.connect(), this.reconnectInterval);
            });
            this.ws.on('error', (err) => {
                if (err.message.length > 0) {
                    console.error('[OneBot] WebSocket 错误:', err.message);
                }
            });
            this.ws.on('unexpected-response', (request, response) => {
                console.error(`[OneBot] 握手失败，状态码: ${response.statusCode}`);

                response.on('data', (chunk) => {
                    console.error('[OneBot] 服务端响应内容:', chunk.toString());
                });
            });
        } catch (err) {
            console.error('[OneBot] 连接失败，准备重连:', err.message);
            setTimeout(() => this.connect(), this.reconnectInterval);
        }
    }

    /**
     * 关闭连接
     */
    close() {
        if (this.ws) {
            this.ws.close();
        }
    }

    /**
     * 处理 OneBot 标准消息
     * @param {Object} msg 解析后的消息
     */
    _handleMessage(msg) {
        console.log(`[OneBot] Recv ${JSON.stringify(msg)}`);

        if (msg['message_type'] === 'group') {
            this._emit('group_message', msg);
        } else if (msg['message_type'] === 'private') {
            this._emit('private_message', msg);
        }
    }

    /**
     * 发送 OneBot 标准动作
     * @param {string} action 动作名
     * @param {Object} params 参数
     */
    sendAction(action, params = {}) {
        if (!this.isConnected) {
            return;
        }

        const msg = JSON.stringify({
            action: action,
            params: params,
            echo: String(this.echo++),// 序号
        });

        console.log(`[OneBot] Send ${msg}`);

        this.ws.send(msg);
    }

    /**
     * 发送消息
     * @param {object} json 收到的消息
     * @param {object} message 发送的消息
     */
    sendGroupMsg(json, message) {
        return this.sendAction('send_group_msg', {
            'self': {'user_id': json['self']['user_id']},// 指定 机器人账号
            'group_id': json['group_id'],// 发送 群聊消息 携带
            'message_id': json['message_id'],// 官方人机 上线模式 需要指定 消息 id 被动模式
            'message': message,// 消息段
        });
    }

    /**
     * 发送消息
     * @param {object} json 收到的消息
     * @param {object} message 发送的消息
     */
    sendPrivateMsg(json, message) {
        return this.sendAction('send_private_msg', {
            'self': {'user_id': json['self']['user_id']},// 指定 机器人账号
            'user_id': json['user_id'],// 发送 好友消息 携带
            'message_id': json['message_id'],// 官方人机 上线模式 需要指定 消息 id 被动模式
            'message': message,// 消息段
        });
    }

    /**
     * 撤回消息
     * @param {object} json 收到的消息
     */
    deleteMsg(json) {
        return this.sendAction('delete_msg', {
            'self': {'user_id': json['self']['user_id']},
            'group_id': json['group_id'],// 撤回 群聊消息 携带
            'message_id': json['message_id'],// 需要 撤回 的 消息 id
        });
    }

    /**
     * 监听事件
     * @param {string} event 事件名
     * @param {Function} callback 回调
     */
    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }

        this.eventListeners[event].push(callback);
    }

    /**
     * 触发事件
     * @param {string} event
     * @param  {...any} args
     */
    _emit(event, ...args) {
        const callbacks = this.eventListeners[event] || [];
        callbacks.forEach((cb) => cb(...args));
    }

}

module.exports = PositiveWebSocket;
