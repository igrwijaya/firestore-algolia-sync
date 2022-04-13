"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const config = require("./config");
const logs = require("./logs");
const processors = require("./processors");
const transform = require("./transform");
const util = require("./util");
const PAYLOAD_MAX_SIZE = 102400;
const PAYLOAD_TOO_LARGE_ERR_MSG = "Record is too large.";
const trim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
const getPayload = async (snapshot) => {
  let payload = {
    objectID: snapshot.id,
    path: snapshot.ref.path,
  };
  const fields = util.getFields(config.default);
  if (fields.length === 0) {
    payload = {
      ...processors.dataProcessor(snapshot.data()),
      ...payload,
    };
  } else {
    // Fields have been defined by user.  Start pulling data from the document to create payload
    // to send to Algolia.
    fields.forEach((item) => {
      const firebaseField = item.replace(trim, "");
      const [field, value] = processors.valueProcessor(firebaseField, snapshot.get(firebaseField));
      if (util.isValidValue(value)) {
        payload[field] = value;
      } else {
        logs.fieldNotExist(firebaseField);
      }
    });
  }
  // adding the objectId in the return to make sure to restore to original if changed in the post processing.
  return transform.default(payload);
};

async function extract(snapshot, timestamp) {
  // Check payload size and make sure its within limits before sending for indexing
  const payload = await getPayload(snapshot);
  if (util.getObjectSizeInBytes(payload) < PAYLOAD_MAX_SIZE) {
    if (timestamp === 0) {
      return {
        ...payload,
      };
    } else {
      return {
        ...payload,
        lastmodified: {
          _operation: "IncrementSet",
          value: timestamp,
        },
      };
    }
  } else {
    throw new Error(PAYLOAD_TOO_LARGE_ERR_MSG);
  }
}
exports.default = extract;
