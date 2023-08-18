const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();

module.exports = ((input = {
  text: 'Sound check',
  /** Select the type of audio encoding */
  audioEncoding: 'MP3',
  languageCode: 'en-US',
  /** Select the language and SSML voice gender (optional) */
  ssmlGender: 'NEUTRAL',
  responseCallback: response => response
}) => {
  const request = {
    input: {
      text: input.text
    },
    audioConfig: {
      audioEncoding: input.audioEncoding
    },
    voice: {
      ssmlGender: input.ssmlGender,
      languageCode: input.languageCode
    }
  };

  /** Performs the text-to-speech request */
  client
    .synthesizeSpeech(request)
    .then(response => response[0] && input?.responseCallback(response[0].audioContent))
    .catch(error => {
      console.log('Error while converting text to speech', error);
      input.responseCallback(null);
    });
});