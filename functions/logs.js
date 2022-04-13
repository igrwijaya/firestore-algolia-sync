"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.fieldNotExist = exports.deleteIndex = exports.updateIndex =
    exports.createIndex = exports.debug = exports.info =
        exports.error = exports.warn = exports.start =
            exports.init = exports.obfuscatedConfig = void 0;
/*
 * Copyright 2021 Algolia
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const firebaseFunctions = require("firebase-functions");
const config = require("./config");
exports.obfuscatedConfig = {
  ...config.default,
  algoliaAPIKey: "********",
};
exports.init = () => {
  firebaseFunctions.logger.info("Initializing extension with configuration", exports.obfuscatedConfig);
};
exports.start = () => {
  firebaseFunctions.logger.info("Started extension execution with configuration", exports.obfuscatedConfig);
};
exports.warn = (...args) => {
  firebaseFunctions.logger.warn(args);
};
exports.error = (err) => {
  firebaseFunctions.logger.error("Error when performing Algolia index", err);
};
exports.info = (...args) => {
  firebaseFunctions.logger.info(args);
};
exports.debug = (...args) => {
  firebaseFunctions.logger.debug(args);
};
exports.createIndex = (id, data) => {
  firebaseFunctions.logger.info(`Creating new Algolia index for document ${id}`, data);
};
exports.updateIndex = (id, data) => {
  firebaseFunctions.logger.info(`Updating existing Algolia index for document ${id}`, data);
};
exports.deleteIndex = (id) => {
  firebaseFunctions.logger.info(`Deleting existing Algolia index for document ${id}`);
};
exports.fieldNotExist = (field) => {
  firebaseFunctions.logger.warn(`The field "${field}" was specified in the extension config but was not found on collection data.`);
};
