"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
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
const nodeFetch = require("node-fetch");
const config = require("./config");
const logs = require("./logs");
exports.default = async (payload) => {
  if (config.default.transformFunction) {
    try {
      const url = `https://${config.default.location}-${config.default.projectId}.cloudfunctions.net/${config.default.transformFunction}`;
      const response = await nodeFetch
          .default(url, {
            method: "post",
            body: JSON.stringify({data: payload}),
            headers: {"Content-Type": "application/json"},
          });
      const data = await (response === null || response === void 0 ? void 0 : response.json());
      return data.result;
    } catch (e) {
      logs.error(e);
    }
  }
  return payload;
};
