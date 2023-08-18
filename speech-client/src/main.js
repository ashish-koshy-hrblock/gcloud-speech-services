(async() => {
    const configResponse = await fetch('config.json');
    const config = await configResponse?.json();
    window.initializeSocketClient(config?.webSocketEndpoint);
})();