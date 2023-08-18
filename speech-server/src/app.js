const config = require('dotenv').config().parsed;

const fs = require('fs-extra');
const crypto = require('crypto');
const socketIO = require('socket.io');

const googleSpeechToText = require('./google/speech-to-text');
const googleTextToSpeech = require('./google/text-to-speech');
const googleIntentDetection = require('./google/dialog-flow/detect-intent');

const tempDirectory = `./temp`;

const io = new socketIO.Server(
  config['WEB_SOCKET_PORT'], 
  {
    cors: {
      origin: config['ALLOWED_ORIGIN'],
    },
  }
);

io.on('connection', (socket) => {

  /** Attempt handshking with the client */
  socket.emit('gcloud-speech-server', crypto.randomUUID());

  /** The client would return the UUID emitted above */
  socket.on('gcloud-speech-client', (...clientId) => {

    const clientIdValidator = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    if (!clientIdValidator.test(clientId)) {
      socket.emit(`${clientId}-clear`);
      return;
    }

    fs.ensureDirSync(tempDirectory);

    /** Use the client ID to identify clients for all subsequent calls */
    const clientDirectory = `${tempDirectory}/${clientId}`;

    fs.ensureDirSync(clientDirectory);
    
    console.log(`client ${clientId} says 'hello' to server`);

    socket.on(clientId, (...audioBuffer) => {
      const timeStamp = `${Date.now()}`;
      const audioFilePath = `${clientDirectory}/${timeStamp}.webm`;       

      const onIntentDetectionComplete = response => {
        if (response?.agentResponse) {
          socket.emit(`${clientId}-intent`, { [`${timeStamp}`]: response });
          googleTextToSpeech({
            audioEncoding: 'MP3',
            languageCode: 'en-US',
            ssmlGender: 'NEUTRAL',
            text: response.agentResponse,
            responseCallback: audio => audio && socket.emit(`${clientId}-speech`, { [`${timeStamp}`]: audio })
          });
        }
      };

      const onTranscriptionComplete = response => {
        socket.emit(clientId, { [`${timeStamp}`]: response });
        if (response.transcript)
          googleIntentDetection({
            sessionId: clientId,
            languageCode: 'en-US',
            text: response.transcript,
            responseCallback: onIntentDetectionComplete
          });
          fs.remove(audioFilePath);
      };

      fs.writeFile(audioFilePath, Buffer.from(audioBuffer[0]))
        .then(() => 
          googleSpeechToText({
            audioFilePath,
            encoding: 'WEBM_OPUS',
            languageCode: 'en-US',
            interimResults: false,
            sampleRateHertz: 16000,
            responseCallback: onTranscriptionComplete
          })
        );
    });
  });
});