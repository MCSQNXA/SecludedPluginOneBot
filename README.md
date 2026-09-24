# 使用指南

本 **Secluded** 插件基于 **OneBot 11** 标准协议。

## 1. 快速开始

### 安装依赖

确保已安装 `ws` 库：

```bash
npm install ws
```

### 1.1 初始化配置

```javascript
const PositiveWebSocket = require('./lib/positive-websocket');

const bot = new PositiveWebSocket({
    'url': 'ws://localhost:8090',                 // Secluded 运行设置 里面的 正向 WebSocket 地址:端口
    'access_token': 'LRjPX2tJ4Jv9NqBw',           // Secluded 运行设置 里面的 正向 WebSocket 令牌
});

bot.connect();
```

### 1.2 运行 demo

```bash
node demo-positive.js
```

## 2. 功能发包协议说明

以下是不同功能对应的 原始 JSON 结构：

### 2.1 文本回复

**功能：** 发送纯文本消息。

```json
{
  "action": "send_group_msg",
  "params": {
    "self": {
      "user_id": "登录账号"
    },
    "group_id": "群号",
    "message": [
      {
        "type": "text",
        "data": {
          "text": "你好，世界"
        }
      }
    ]
  },
  "echo": "1"
}
```

### 2.2 发送图片

**功能：** 发送网络图片链接。

```json
{
  "action": "send_private_msg",
  "params": {
    "self": {
      "user_id": "登录账号"
    },
    "user_id": "好友账号",
    "message": [
      {
        "type": "image",
        "data": {
          "file": "https://example.com/image.jpg"
        }
      }
    ]
  },
  "echo": "1"
}
```

### 2.3 图文混合

**功能：** 同一条消息包含文本和图片。

```json
{
  "action": "send_group_msg",
  "params": {
    "self": {
      "user_id": "登录账号"
    },
    "group_id": "群号",
    "message": [
      {
        "type": "text",
        "data": {
          "text": "这是一张图片："
        }
      },
      {
        "type": "image",
        "data": {
          "file": "https://example.com/image.jpg"
        }
      }
    ]
  },
  "echo": "1"
}
```

### 2.4 发送语音

**功能：** 发送语音文件。

```json
{
  "action": "send_group_msg",
  "params": {
    "self": {
      "user_id": "登录账号"
    },
    "group_id": "群号",
    "message": [
      {
        "type": "voice",
        "data": {
          "file": "https://example.com/audio.m4a"
        }
      }
    ]
  },
  "echo": "1"
}
```

### 2.5 艾特用户 (Mention)

**功能：** 在群聊中艾特指定成员。

```json
{
  "action": "send_group_msg",
  "params": {
    "self": {
      "user_id": "登录账号"
    },
    "group_id": "群号",
    "message": [
      {
        "type": "at",
        "data": {
          "qq": "被艾特账号",
          "name": "被艾特昵称"
        }
      },
      {
        "type": "text",
        "data": {
          "text": " 收到请回答"
        }
      }
    ]
  },
  "echo": "1"
}
```

### 2.6 艾特全体成员

**功能：** 群聊中发起全体提醒。

```json
{
  "action": "send_group_msg",
  "params": {
    "self": {
      "user_id": "登录账号"
    },
    "group_id": "群号",
    "message": [
      {
        "type": "at",
        "data": {
          "qq": "all"
        }
      }
    ]
  },
  "echo": "1"
}
```

### 2.7 回复消息

**功能：** 引用特定消息进行回复。

```json
{
  "action": "send_group_msg",
  "params": {
    "self": {
      "user_id": "登录账号"
    },
    "group_id": "群号",
    "message": [
      {
        "type": "text",
        "data": {
          "text": "收到！"
        }
      },
      {
        "type": "reply",
        "data": {
          "id": "需要回复的消息id"
        }
      },
      {
        "type": "emo_reply",
        "data": {
          "id": "表情id"
        }
      }
    ]
  },
  "echo": "1"
}
```

### 2.8 撤回消息

**功能：** 撤回消息（撤回自己或他人）。

```json
{
  "action": "delete_msg",
  "params": {
    "self": {
      "user_id": "登录账号"
    },
    "group_id": "群号",
    "message_id": "需要撤回的消息id"
  },
  "echo": "1"
}
```

### 2.9 机器人信息

**功能：** 获取 机器人 账号 昵称 skey pskey

```json
{
  "action": "get_login_info",
  "params": {
    "self": {
      "user_id": "登录账号"
    }
  },
  "echo": "1"
}
```

**应答：**

```json
{
  "status": "ok",
  "retcode": 0,
  "data": {
    "user_id": "3534403467",
    "user_uid": "u_P8AizxZmAtjYlRSReIeiaw",
    "user_name": "MCSQNXX",
    "allow_secure_key": true,
    "self_touch": true,
    "record_msg": true,
    "sandbox": true,
    "debug": true,
    "skey": "a7uaQA6Uq",
    "pskey": {
      "docs.qq.com": "IWY0ZOvz69fmIZpOth31XEpX7EXIOZCu-3Faikn9*1M_",
      "gamecenter.qq.com": "Yd6b0VQPNBk84Y5c1Z-MjWhseYNZFNtYgY5wwf9Md6M_",
      "mail.qq.com": "bZ9gxNw1fghh7yfkkNAezaY0ljtfvR3kjlWtCEIB2NI_",
      "mp.qq.com": "lHF9mOhW8gI6oS3Kimfacostz5Hzzd4JxDZluHT8gH4_",
      "pskey-expire": "1780424267",
      "q.qq.com": "U96rkC1kg8AeYLlDzVTMjloez0xyaoJRdiGpl4hNjCc_",
      "qun.qq.com": "N30ziTF2su6zL3cBqg9jpwUhq7SvcLofKGdCntJKFUo_",
      "qzone.qq.com": "5lPXhhrtGLGoJayyc5aKH5uuVs1TdZ1QXMm2N2vp2J4_",
      "tenpay.com": "mmO9GyqAMCgbcOucaiLyBknXf-rRy4Nn-ex0v1E5hfg_",
      "vip.qq.com": "-FnTBupLcHvhTQO1-hFUNhk2jaF7xiG3GX*F4kSKt4Q_"
    },
    "rkey": {
      "10-rkey": "&rkey=CAISMPCrLAa7UFClJI3qj9X0WmTWgJC9N7Gimi_kaWDgkTaAW-2mMqQrHDdfsKcZaGNt4A",
      "10-rkey-expire": "1780341228",
      "20-rkey": "&rkey=CAISMPCrLAa7UFClJI3qj9X0WmTWgJC9N7GimumKb1unfp69ZYdmN93Msu2Zy5ArWcM-Tw",
      "20-rkey-expire": "1780341228"
    },
    "client_key": "df3a35250f0d058d8cf8db96b4ec6af43650f8b443383a8a78d5b07ba2f3d71907eb76d719f62ce64974ed07fe786bc0"
  },
  "message": "",
  "echo": "1"
}
```

### 2.10 名片赞

**功能：** 给用户点赞

```json
{
  "action": "send_like",
  "params": {
    "self": {
      "user_id": "登录账号"
    },
    "user_id": "点赞对象",
    "times": "点赞次数"
  },
  "echo": "1"
}
```

### 2.11 新的好友

**功能：** 同意/拒绝 新的好友 申请

```json
{
  "action": "new_friend_notify",
  "params": {
    "self": {
      "user_id": "登录账号"
    },
    "user_id": "目标账号",
    "agree": true
  },
  "echo": "1"
}
```

### 2.12 群聊列表

**功能：** 获取 群聊列表

```json
{
  "action": "get_group_list",
  "params": {
    "self": {
      "user_id": "登录账号"
    }
  },
  "echo": "1"
}
```

### 2.13 好友列表

**功能：** 获取 好友列表

```json
{
  "action": "get_friend_list",
  "params": {
    "self": {
      "user_id": "登录账号"
    }
  },
  "echo": "1"
}
```

### 2.14 好友备注

**功能：** 修改好友备注

```json
{
  "action": "set_friend_remask",
  "params": {
    "self": {
      "user_id": "登录账号"
    },
    "user_id": "修改对象",
    "user_remask": "新的备注"
  },
  "echo": "1"
}
```

### 2.15 群聊全体禁言

**功能：** 开启（time>0） 关闭（time=0） 群聊全体禁言

```json
{
  "action": "set_group_ban",
  "params": {
    "self": {
      "user_id": "登录账号"
    },
    "group_id": "目标群号",
    "time": 1
  },
  "echo": "1"
}
```

### 2.16 群聊成员禁言

**功能：** 禁言成员 time=时长（秒）

```json
{
  "action": "set_group_ban",
  "params": {
    "self": {
      "user_id": "登录账号"
    },
    "user_id": "目标对象",
    "time": 60
  },
  "echo": "1"
}
```

### 2.17 群聊打卡

**功能：** 执行 群聊打卡

```json
{
  "action": "group_clockin",
  "params": {
    "self": {
      "user_id": "登录账号"
    },
    "group_id": "目标群号"
  },
  "echo": "1"
}
```

### 2.18 踢出

**功能：** 踢出群聊成员

```json
{
  "action": "group_kick",
  "params": {
    "self": {
      "user_id": "登录账号"
    },
    "group_id": "目标群号",
    "user_id": "目标对象",
    "black_list": false,
    "text": "加入黑名单的理由"
  },
  "echo": "1"
}
```

### 2.19 退群

**功能：** 主动退群

```json
{
  "action": "group_exit",
  "params": {
    "self": {
      "user_id": "登录账号"
    },
    "group_id": "目标群号"
  },
  "echo": "1"
}
```

### 2.20 删除好友

**功能：** 主动删除好友

```json
{
  "action": "friend_del",
  "params": {
    "self": {
      "user_id": "登录账号"
    },
    "user_id": "目标对象"
  },
  "echo": "1"
}
```
