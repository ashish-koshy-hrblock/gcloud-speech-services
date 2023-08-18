const fs = require('fs-extra');

const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();

module.exports = ((input = {
  encoding: '',
  languageCode: '',
  audioFilePath: '',
  sampleRateHertz: 0,
  interimResults: false,
  responseCallback: response => response,
}) => {

  const request = {
    config: {
      encoding: input.encoding,
      languageCode: input.languageCode,
      sampleRateHertz: input.sampleRateHertz
    },
    interimResults: input.interimResults,
  };

  /** Transcription output stream */
  const recognizeStream = client
    .streamingRecognize(request)
    .on('end', () => console.log(`Transcription complete`))
    .on('error', error =>  console.log(`Transcription error :`, error))
    .on(
      'data', 
      data => {
        const response = data?.results[0]?.alternatives[0];
        response && input?.responseCallback(response);
      }
    );
  
  /** Audio input stream */
  fs.createReadStream(input.audioFilePath).pipe(recognizeStream);
});
