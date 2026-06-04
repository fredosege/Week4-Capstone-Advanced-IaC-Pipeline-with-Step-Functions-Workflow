const AWS = require('aws-sdk');
const ssm = new AWS.SSM();

exports.handler = async (event) => {
    try {
        console.log('Lambda invoked at:', new Date().toISOString());
        console.log('Event received:', JSON.stringify(event, null, 2));
        
        const params = {
            Name: '/app/config/greeting',
            WithDecryption: false
        };
        
        console.log('Fetching parameter from SSM Parameter Store...');
        const result = await ssm.getParameter(params).promise();
        const greeting = result.Parameter.Value;
        
        console.log('SUCCESS: Retrieved from SSM:', greeting);
        
        const inputMessage = event.message || 'No additional message provided';
        
        return {
            statusCode: 200,
            status: "Success",
            greeting: greeting,
            inputMessage: inputMessage,
            timestamp: new Date().toISOString(),
            ssmParameter: '/app/config/greeting'
        };
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('Full error:', JSON.stringify(error, null, 2));
        throw new Error(`Failed to retrieve SSM parameter: ${error.message}`);
    }
};
