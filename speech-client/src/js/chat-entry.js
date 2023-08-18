window.getChatTimeStamp = (
    data 
) => {
    return Object.keys(data)[0] ?? '';
};

window.updateChatEntry = (
    timeStamp, childNode
) => {
    const transcription = document.getElementById(timeStamp);
    transcription?.appendChild(childNode);
    transcription?.scrollIntoView({ behavior: 'smooth', block: 'end' });
};

window.createChatEntry = (
    input = {
        speaker: '', 
        timeStamp: '',
        confidence: '',
        transcript: ''
    }
) => {

    let transcription = document.getElementById(input.timeStamp);
    const transcriptionTextId = `${input.timeStamp}-transcription`;
    
    if (!transcription) {
        /** Add a horizontal rule at the beginning of every new transcription entry */
        const divider = document.createElement('hr');
        document.body.appendChild(divider);

        /** Add the root node for a new transcription entry */
        transcription = document.createElement('div');
        transcription.setAttribute('role', 'alert');
        transcription.setAttribute('class', 'alert alert-primary');
        transcription.id = input.timeStamp;
        document.body.appendChild(transcription);

        /** Show speaker title */
        const title = document.createElement('p');
        title.style.fontWeight = 'bold';
        title.innerText = `${input.speaker ?? 'Speaker'} :`;
        transcription.appendChild(title);
        
        /** Node for showing transcribed text */
        const transcriptionText = document.createElement('p');
        transcriptionText.id = transcriptionTextId;
        transcription.appendChild(transcriptionText);

        /** Show time stamp, transcription confidence etc. */
        const time = document.createElement('pre');
        time.innerText = `${new Date().toLocaleString()} | Confidence : ${Math.floor((input.confidence ?? 0) * 100)}%`;
        transcription.appendChild(time);

        time.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    
    const transcriptionText = document.getElementById(transcriptionTextId);
    transcriptionText.innerText += input.transcript;
    transcription.scrollIntoView({ behavior: 'smooth', block: 'end' });
};