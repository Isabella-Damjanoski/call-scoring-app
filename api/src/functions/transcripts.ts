import { app } from "@azure/functions";

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

app.http('transcripts', {
    methods: ['GET', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('HTTP trigger function processed a request for transcripts.');
        
        // Handle preflight request
        if (request.method === 'OPTIONS') {
            return {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:5173',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Accept',
                    'Access-Control-Max-Age': '86400'
                }
            };
        }
        
        return {
            status: 200,
            jsonBody: sampleTranscripts,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:5173',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Accept'
            }
        };
    }
}); 