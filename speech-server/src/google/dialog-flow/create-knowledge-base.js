const config = require('dotenv').config().parsed;

/** Imports the Dialogflow client library */
const dialogflow = require('@google-cloud/dialogflow').v2beta1;

/** Instantiate a DialogFlow client. */
const client = new dialogflow.KnowledgeBasesClient();

(async () => {
    const request = {
        parent: `projects/${config['QUOTA_PROJECT_ID']}`,
        knowledgeBase: {
            displayName: 'gcloud-speech-knowledge-base'
        },
    };

    const [result] = await client.createKnowledgeBase(request);
    console.log(`Knowledge Base : ${result.name}`);
    console.log(`Display Name : ${result.displayName}`);
})();