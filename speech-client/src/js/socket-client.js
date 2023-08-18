window.initializeSocketClient = (
    endpoint = ''
) => {

    const socket = io(`${endpoint ?? 'ws://:3000' }`);

    const onServerHandShake = clientId => {
        
        /** On Speech to Text conversion complete */
        socket?.on(clientId, (...args) => {
            const response = args[0];
            const timeStamp = window?.getChatTimeStamp(response);
            const data = response[timeStamp];
            window?.createChatEntry({
                timeStamp,
                speaker: 'You',
                confidence: data?.confidence ?? 0,
                transcript: data?.transcript ?? ''
            });
        });

        /** On Intent Detection complete */
        socket?.on(`${clientId}-intent`, (...args) => {
            const response = args[0];
            const timeStamp = window?.getChatTimeStamp(response);
            const data = response[timeStamp];
            const intent = document.createElement('div');
            intent.setAttribute('role', 'alert');
            intent.setAttribute('class', 'alert alert-secondary');
            intent.innerText = data.agentResponse;
            window?.updateChatEntry(timeStamp, intent);
        });

        /** On Text to Speech conversion complete */
        socket?.on(`${clientId}-speech`, (...args) => {
            const response = args[0];
            const timeStamp = window?.getChatTimeStamp(response);
            const data = response[timeStamp];
            const blob = new Blob([data], { type: 'audio/mpeg' });
            const speech = document.createElement('audio');
            speech.controls = true;
            speech.autoplay = true;
            speech.setAttribute('src', window.URL.createObjectURL(blob));
            speech.setAttribute('type', 'audio/mpeg');
            window?.updateChatEntry(timeStamp, speech);
        });

        /** When server asks to clear cache */
        socket?.on(`${clientId}-clear`, () => {
            localStorage.clear();
            window.location.reload();
        });

        /** Stream microphone input to server for transcription */
        const audioInputCallback = audioBuffer => audioBuffer && socket.emit(clientId, audioBuffer);
        window?.detectAudio(audioInputCallback);
    };

    /** On Client Server handshake complete */
    socket?.on('gcloud-speech-server', (...args) => {
        
        /** To be provided by the server */
        let clientId = localStorage.getItem('gcloud-speech-client-id') || '';
        
        if (!clientId) {
            clientId = args[0] || '';
            localStorage.setItem('gcloud-speech-client-id', clientId);
        }

        console.log(`server says 'hello' to client :`, clientId);

        onServerHandShake(clientId);
        
        socket.emit('gcloud-speech-client', clientId);
    });
};