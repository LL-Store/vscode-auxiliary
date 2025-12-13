function bridgeFactory(window, vscode) {
    let callbacks = {};

    window.addEventListener('message', function (event) {
        if (callbacks[event.data.callbackName]) {
            callbacks[event.data.callbackName](event.data.value);
            delete callbacks[event.data.callbackName];
        }
    });

    return function (type, params = {}, callback) {
        let token = new Date().valueOf();

        vscode.postMessage({
            type,
            token,
            value: params
        });
        if (callback) callbacks[type + "-" + token] = callback;
    };
}

