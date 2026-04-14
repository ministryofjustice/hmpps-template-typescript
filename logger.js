"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan_1 = __importDefault(require("bunyan"));
const bunyan_format_1 = __importDefault(require("bunyan-format"));
const config_1 = __importDefault(require("./server/config"));
const formatOut = (0, bunyan_format_1.default)({ outputMode: 'short', color: !config_1.default.production });
const logger = bunyan_1.default.createLogger({ name: 'HMPPS Typescript Template', stream: formatOut, level: 'debug' });
exports.default = logger;
//# sourceMappingURL=logger.js.map