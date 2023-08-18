const config = require('dotenv').config().parsed;
const dialogFlowCX = require('@google-cloud/dialogflow-cx');

const crypto = require('crypto');

const client = new dialogFlowCX.SessionsClient({ 
  apiEndpoint: 'dialogflow.googleapis.com' 
});

module.exports = ((input = {
  text: '',
  sessionId: '',
  languageCode: '',
  responseCallback: response => response
}) => {

  const location = 'global';
  const projectId = config['QUOTA_PROJECT_ID'];
  const agentId = config['DIALOG_FLOW_AGENT_ID'];

  const sessionId = input?.sessionId ?? crypto.randomUUID();

  const session = client.projectLocationAgentSessionPath(
    projectId,
    location,
    agentId,
    sessionId
  );

  const request = {
    session,
    queryInput: {
      languageCode: input.languageCode,
      text: {
        text: input.text
      }
    }
  };

  client
    .detectIntent(request)
    .then(
      responses => {

        const response = responses[0]?.queryResult;

        let agentResponse = '';
        for (const message of (response?.responseMessages || []))
          message?.text?.text && (agentResponse = message.text.text[0]);
        
        input.responseCallback({
          agentResponse,
          userQuery: `${response?.transcript || 'n/a'}`,
          currentPage: `${response?.currentPage?.displayName || 'n/a'}`,
          matchedIntent: `${response?.match?.intent?.displayName || 'n/a'}`
        });
      }
    ).catch(
      error => {
        console.log('Error while detecting intent', error);
        input.responseCallback(null);
      }
    );
});