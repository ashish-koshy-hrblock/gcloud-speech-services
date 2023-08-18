window.visualizeAudio = (
    stream = new MediaRecorder()
) => {

    const canvasElement = document.getElementById('audio-visualizer');
    const canvasCtx = canvasElement.getContext('2d');

    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    
    const draw = () => {
        const WIDTH = canvasElement.width
        const HEIGHT = canvasElement.height;
    
        requestAnimationFrame(draw);
    
        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
        canvasCtx.lineWidth = 1;
    
        canvasCtx.beginPath();
    
        let x = 0;
        const sliceWidth = WIDTH * 1.0 / bufferLength;
    
        for (let i = 0; i < bufferLength; i++) {
            let v = dataArray[i] / 128.0;
            let y = v * HEIGHT/2;
    
            if (i === 0) 
                canvasCtx.moveTo(x, y);
            else 
                canvasCtx.lineTo(x, y);

            x += sliceWidth;
        };

        canvasCtx.lineTo(canvasElement.width, canvasElement.height/2);
        canvasCtx.stroke();
    };
    draw();
};