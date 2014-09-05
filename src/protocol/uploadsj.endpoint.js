var uploadsj = {};

uploadsj.GetUploadSessionRequest = function (inlined) {
  inlined.title = 'jumper-uploader-title-42';
  inlined.SyncNow = true;
  inlined.TrackDoNotRematch = true;
  
  var msg = {
    clientId: 'Jumper Uploader',
    protocolVersion: '0.8',
    createSessionRequest: {
      fields: [ { external: { name: inlined.ClientId } } ]
    },
  };
  
  for (var key in inlined) {
    msg.createSessionRequest.fields.push({
      inlined: { content: inlined[key].toString(), name: key }
    });
  }
  
  return JSON.stringify(msg);
}

uploadsj.GetUploadSessionResponse = function (obj) {
  var body = {};
  if (obj.errorMessage) {
    body.errorCode = obj['errorMessage']['additionalInfo']
      ['uploader_service.GoogleRupioAdditionalInfo']['completionInfo']
      ['customerSpecificInfo']['ResponseCode'];
  }
  if (obj.sessionStatus) {
    var external = obj.sessionStatus.externalFieldTransfers[0];
    body.clientId = external.name;
    body.state = obj.sessionStatus.state;
    body.sessionUrl = external.putInfo.url;
    body.contentType = external.content_type;
  }
  return body;
}

uploadsj.GetUploadSessionResponse.type = 'json';
