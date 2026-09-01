// noinspection JSIgnoredPromiseFromCall

async function main() {
    const res = await fetch('http://127.0.0.1:9090/?token=123', {// token 必须设置
        method: 'POST',
        body: JSON.stringify(// POST 的内容; 和 正向 WebSocket 请求内容一致
            {
                "action": "get_login_info",
                "params": {"self": {"user_id": 3450589608}},
                "echo": "1"
            }
        ),
    });

    console.log(`code = ${res.status}`);
    console.log(`text = ${await res.text()}`);
}

main();
