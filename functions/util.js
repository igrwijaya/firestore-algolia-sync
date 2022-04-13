"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.isValidValue = exports.areFieldsUpdated =
    exports.getFields = exports.getObjectSizeInBytes =
    exports.getChangeType = exports.ChangeType = void 0;
const logs = require("./logs");
const processors = require("./processors");
let ChangeType;
(function(ChangeType) {
  ChangeType[ChangeType["CREATE"] = 0] = "CREATE";
  ChangeType[ChangeType["DELETE"] = 1] = "DELETE";
  ChangeType[ChangeType["UPDATE"] = 2] = "UPDATE";
})(ChangeType = exports.ChangeType || (exports.ChangeType = {}));
exports.getChangeType = (change) => {
  if (!change.after.exists) {
    return ChangeType.DELETE;
  }
  if (!change.before.exists) {
    return ChangeType.CREATE;
  }
  return ChangeType.UPDATE;
};
exports.getObjectSizeInBytes = (object) => {
  const recordBuffer = Buffer.from(JSON.stringify(object));
  return recordBuffer.byteLength;
};
exports.getFields = (config) => config.fields ? config.fields.split(/[ ,]+/) : [];
exports.areFieldsUpdated = (config, before, after) => {
  const fields = exports.getFields(config);
  logs.debug(`fields: ${fields}`);
  // If fields are not configured, then execute update record.
  if (fields.length == 0) {
    return true;
  }
  // If fields are configured, then check the before and after data for the specified fields.
  //  If any changes detected, then execute update record.
  for (const field of fields) {
    const [, beforeFieldValue] = processors.valueProcessor(field, before.get(field));
    const [, afterFieldValue] = processors.valueProcessor(field, after.get(field));
    if (JSON.stringify(beforeFieldValue) !== JSON.stringify(afterFieldValue)) {
      return true;
    }
  }
  return false;
};
exports.isValidValue = (value) => {
  return typeof value !== "undefined" && value !== null;
};
