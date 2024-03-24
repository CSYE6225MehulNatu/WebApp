const { PubSub } = require('@google-cloud/pubsub');
const { logger } = require("../util/Logging");

const pubSubClient = new PubSub();

async function publishMessage(topicNameOrId, email) {
  // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
  const dataBuffer = Buffer.from("{\"email\" : \"" +  email + "\"}");

  try {
    const messageId = await pubSubClient
      .topic(topicNameOrId)
      .publishMessage({data: dataBuffer});
    logger.info(`Message ${messageId} published.`);
  } catch (error) {
    logger.error(`Received error while publishing: ${error.message}`);
  }
}

module.export = {
    publishMessage
}