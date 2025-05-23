"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
// Sample data for testing
const sampleTranscripts = [
    {
        id: "1",
        call_id: "CALL001",
        transcript: "This is a sample transcript for the first call.",
        datetime: new Date().toISOString()
    },
    {
        id: "2",
        call_id: "CALL002",
        transcript: "This is a sample transcript for the second call.",
        datetime: new Date().toISOString()
    }
];
functions_1.app.http('transcripts', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: (request, context) => __awaiter(void 0, void 0, void 0, function* () {
        context.log('HTTP trigger function processed a request for transcripts.');
        return {
            status: 200,
            jsonBody: sampleTranscripts,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
    })
});
//# sourceMappingURL=transcripts.js.map