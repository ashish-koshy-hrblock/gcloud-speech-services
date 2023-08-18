const config = require('dotenv').config().parsed;

const fs = require('fs-extra');

/** Imports the Dialogflow client library */
const dialogflow = require('@google-cloud/dialogflow').v2beta1;

/** Instantiate a DialogFlow Documents client. */
const client = new dialogflow.DocumentsClient({ 
    projectId: config['QUOTA_PROJECT_ID'] 
});

/**
 * Displayed name of your document in knowledge base, e.g. myDoc
 * @param {*} displayName
 * Path of the document you'd like to add, e.g. https://dialogflow.com/docs/knowledge-connectors
 * @param {*} contentUri 
 */
const createKnowledgeDocument = async (displayName = '', contentUri = '') => {
    const request = {
        parent: config['DIALOG_FLOW_KNOWLEDGE_BASE_FULL_NAME'],
        document: {
            source: 'contentUri',
            /** 
             * The Knowledge type of the Document. e.g. FAQ 
             * --------------------------------------------
             * KNOWLEDGE_TYPE_UNSPECIFIED = 0
             * FAQ = 1
             * EXTRACTIVE_QA = 2
             * ARTICLE_SUGGESTION = 3
             * AGENT_FACING_SMART_REPLY = 4
             * SMART_REPLY = 4
             * --------------------------------------------
             **/
            knowledgeTypes: [2],
            displayName,
            contentUri,
            /** The mime_type of the Document. e.g. text/csv, text/html, text/plain, text/pdf etc. */
            mimeType: 'text/html'
        },
    };
    
    const [operation] = await client.createDocument(request);
    const [response] = await operation.promise();
    
    console.log('Document created :');
    console.log(`Display Name - ${response.displayName}`);
    console.log(`Content URI - ${response.contentUri}`);
    console.log(`Mime Type - ${response.mimeType}`);
    console.log(`Source - ${response.source}`);
    console.log(`Name - ${response.name}`);
};

(async () => {
    const knowledgeDocs = fs.readJSONSync('./knowledge-docs.json', 'utf-8');
    for (const folder in knowledgeDocs.folders) {
        for (const fileName of knowledgeDocs.folders[folder]) {
            const displayName = fileName;
            const contentUrl = `${knowledgeDocs.baseUrl}/${folder}/${fileName}.${knowledgeDocs.extension}`;
            await createKnowledgeDocument(displayName, contentUrl);
        }
    }
})();