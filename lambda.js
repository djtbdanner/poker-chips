const {
  ApiGatewayManagementApi
} = require("@aws-sdk/client-apigatewaymanagementapi"),
  {
    DynamoDBDocument
  } = require("@aws-sdk/lib-dynamodb"),
  {
    DynamoDB,
    TagResourceCommand
  } = require("@aws-sdk/client-dynamodb");
const { lambdaSocketHandler, lambdaSocketDisconnectHandler } = require("./sockets/socketEvents");
const ddb = DynamoDBDocument.from(new DynamoDB({ apiVersion: '2012-08-10', region: 'us-east-1' }));

const TABLE_NAME = 'web-socket-connections';

exports.handler = async event => {
  try {


    let routeKey = event.requestContext.routeKey || 'NA';
    let connectionId = event.requestContext.connectionId || 'NA';

    if (routeKey === 'NA' || connectionId === 'NA') {
      throw new Error(`You are not looking at the right routeKey or connectionId- event ${JSON.stringify(event)}`)
    }

    /// connection
    if (routeKey.includes("$connect")) {
      console.log(`connect - first socket connection ${connectionId}`);
      return;
    }

    const endpoint = getEndpoint(event);
    const apigwManagementApi = new ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      region: 'us-east-1',
      endpoint
    });

    /// disconnection
    if (routeKey.includes("$disconnect")) {
      console.log(`socket disconnecting - ${connectionId}`);
      lambdaSocketDisconnectHandler(apigwManagementApi, connectionId);
      return;
    }

    await lambdaSocketHandler(event.body, apigwManagementApi, connectionId);
    return { statusCode: 200, body: 'Data sent.' };
  } catch(e){
    console.error(`Error in lambda handler ${e}`);
    if (isMaybeStaleConnection) {
      console.log(`Looks like a stale connection ${connectionId}`);
//      await ddb.delete({ TableName: TABLE_NAME, Key: { connectionId } });
    }
  }
};

function getEndpoint(event) {
  let endpoint = event.requestContext.domainName + '/' + event.requestContext.stage;
  if (!endpoint.toLowerCase().startsWith('http')) {
    console.log(`Adding protocol to endpoint ${endpoint}`);
    endpoint = `https:\\${endpoint}`;
  }
  return endpoint;
}

function isMaybeStaleConnection(e) {
  if (e) {
    return e.statusCode === 410 || e.name === "GoneException" || e.name === "NotFoundException" || e.name === "BadRequestException" || e.name === "410";
  }

  return false
}
