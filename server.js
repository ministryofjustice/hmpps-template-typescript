"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Require app insights before anything else to allow for instrumentation of bunyan and express
require("applicationinsights");
const index_1 = __importDefault(require("./server/index"));
const logger_1 = __importDefault(require("./logger"));
index_1.default.listen(index_1.default.get('port'), () => {
    logger_1.default.info(`Server listening on port ${index_1.default.get('port')}`);
});
//# sourceMappingURL=server.js.map