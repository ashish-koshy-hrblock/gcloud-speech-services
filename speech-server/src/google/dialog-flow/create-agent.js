const config = require('dotenv').config().parsed;

const { AgentsClient } = require('@google-cloud/dialogflow-cx');

const client = new AgentsClient({ apiEndpoint: 'global-dialogflow.googleapis.com' });

(async () => {
    const request = {
        parent: `projects/${config['QUOTA_PROJECT_ID']}/locations/global`,
        agent: {
            displayName: 'gcloud-speech-service-agent',
            timeZone: 'America/Los_Angeles',
            defaultLanguageCode: 'en'
        },
    };
    
    const [response] = await client.createAgent(request);
    console.log(`response: ${JSON.stringify(response, null, 2)}`);
})();