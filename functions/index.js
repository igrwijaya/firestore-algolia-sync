const functions = require("firebase-functions");
const algoliaSearch = require("algoliasearch");
const extract = require("./extract");
const config = require("./config");

const client = algoliaSearch(
    config.default.algoliaAppId,
    config.default.algoliaAPIKey,
);

client.addAlgoliaAgent("firestore_integration", "0.5.9");

exports.onFsDataChanged = functions.firestore
    .document("clients-data/{clientId}/{masterDataCollectionId}/{masterDataId}")
    .onWrite(async (change, context) => {
      // If we set `/users/marie/incoming_messages/134` to {body: "Hello"} then
      // context.params.userId == "marie";
      // context.params.messageCollectionId == "incoming_messages";
      // context.params.messageId == "134";
      // ... and ...
      // change.after.data() == {body: "Hello"}

      // If the document does not exist, it has been deleted.
      const document = change.after.exists ? change.after.data() : null;

      // Get an object with the previous document value (for update or delete)
      const oldDocument = change.before.data();

      functions.logger.info("Data Changed!", {
        masterData: context.params.masterDataCollectionId,
        state: document === null ?
                "deleted" :
                !oldDocument ?
                    "created" :
                    "updated",
      });

      const index = client.initIndex(context.params.masterDataCollectionId);
      const records = [];
      const timestamp = Date.now();
      if (document === null) {
        functions.logger.info("Removing from Algolia", oldDocument);
        index.deleteObject(change.before.id)
            .then(() => {
              functions.logger.info(
                  "Document Removed from Algolia",
                  oldDocument);
            }).catch((error) => {
              functions.logger.error(error);
            });
      } else {
        try {
          const payload = await extract.default(change.after, timestamp);
          records.push(payload);
        } catch (e) {
          functions.logger.warn("Payload size too big, skipping ...", e);
        }

        functions.logger.info("Start Importing into Algolia", document);
        index
            .partialUpdateObjects(records, {createIfNotExists: true})
            .then(() => {
              functions.logger.info(
                  "Document(s) imported into Algolia",
                  document);
            })
            .catch((error) => {
              functions.logger.error(error);
            });
      }
    });
