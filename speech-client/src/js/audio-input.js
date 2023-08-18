window.detectAudio = (
    responseCallback = response => response
) => {
    
    let mediaRecorder = new MediaRecorder(new MediaStream());
    if (navigator.mediaDevices.getUserMedia) {

        const container = document.createElement('div');

        const recordSwitch = document.getElementById('record-switch');
        recordSwitch.addEventListener('click', () => {
            recordSwitch.value = recordSwitch.value === 'true' ? 'false' : 'true';
            const isRecording = recordSwitch.value === 'true';
            const recordSwitchText = document.getElementById('record-switch-text');
            recordSwitchText.innerText = isRecording ? '  Listening... ' : '';
            isRecording ? mediaRecorder.start() : mediaRecorder.stop();
        });

        const onError = err => console.log('Error: ' + err);
        
        const onSuccess = stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = e => {
                e.data
                 .arrayBuffer()
                 .then(audioBuffer => responseCallback(audioBuffer));
            };
            document.body.appendChild(container);
            window.visualizeAudio(stream);
        };

        navigator
            .mediaDevices
            .getUserMedia({ audio: true })
            .then(onSuccess, onError);
    } else 
        console.log('Audio capture is not supported.');
};