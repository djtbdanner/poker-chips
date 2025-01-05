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
const { lambdaSocketHandler } = require("./sockets/socketEvents");
const ddb = DynamoDBDocument.from(new DynamoDB({ apiVersion: '2012-08-10', region: 'us-east-1' }));

const TABLE_NAME = 'web-socket-connections';

exports.handler = async event => {
  let connectionData;

  let routeKey = event.requestContext.routeKey||'NA';
  let connectionId = event.requestContext.connectionId||'NA';

  if (routeKey === 'NA' || connectionId === 'NA'){
    throw new Error (`You are not looking at the right routeKey or connectionId- event ${JSON.stringify(event)}`)
  }

  /// connection
  if (routeKey.includes("$connect")){
    console.log('connect');
    return;
  }

  /// disconnection
  if (routeKey.includes("$disconnect")){
    console.log('disconnect');
    return;
  }
  
  // try {
  //   connectionData = await ddb.scan({ TableName: TABLE_NAME, ProjectionExpression: 'connectionId' });
  // } catch (e) {
  //   return { statusCode: 500, body: e.stack };
  // }

  const endpoint = getEndpoint(event);
  const apigwManagementApi = new ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    region: 'us-east-1',
    endpoint
  });

  await lambdaSocketHandler(event.body, apigwManagementApi, connectionId);
  return { statusCode: 200, body: 'Data sent.' };
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
