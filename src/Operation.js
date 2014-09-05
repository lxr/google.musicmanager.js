//require protocol/index.js

//require fl.async.js

function Operation(/* task, args... */) {
  this.args = Array.prototype.slice.call(arguments),
  this.task = this.args.shift();
  this.events = {};
}

Operation.prototype._end = function (err, res0) {
  if (err) {
    this.emit('error', err, res0);
  } else {
    this.emit('end');
  }
}

Operation.prototype._emit = function (/* event, args... */) {
  var args = Array.prototype.slice.call(arguments),
      event = args.shift();
  var listeners = this.events[event] || [];
  for (var i = 0, listener; listener = listeners[i]; ++i) {
    listener.apply(this, args);
  }
  return listeners.length > 0;
}

Operation.prototype.on = function (event, listener) {
  (this.events[event] || (this.events[event] = [])).push(listener);
  return this;
}

Operation.prototype.off = function (event, listener) {
  var i = (this.events[event] || []).indexOf(listener);
  if (i !== -1) {
    this.events[event].splice(i, 1);
  }
  return this;
}

Operation.prototype.start = function () {
  return this.task.apply(
    { emit: this._emit, events: this.events },
    this.args.concat(this._end)
  );
}

Operation.NJOBS = 4;

Operation.Register = fl.async.compose(
  function (token, id, name, callback) {
    this.token = token;
    this.id = id;
    callback(null, name);
  },
  
  function (name, callback) {
    protocol.upAuth(this.token, this.id, name, callback);
  }
);

Operation.Upload = fl.async.compose(
  function (token, id, files, callback) {
    this.token = token;
    this.id = id;
    this.files = {};
    this.uploaded = 0;
    this.toUpload = [];
    callback(null, files);
  },
  
  fl.async.applyToAll(1, Operation.NJOBS, fl.async.compose(
    function (file, callback) {
      this.emit('metadata-start', file);
      protocol.readMetadata(file, callback);
    },
    
    function (metadata, image, file, callback) {
      this.files[metadata.client_id] = {
        clientId: metadata.client_id,
        bitrate:  metadata.original_bit_rate,
        metadata: metadata,
        source:   file,
      };
      this.emit('metadata-end', file, metadata, image);
      callback(null, metadata);
    }
  )),
  
  function (metadatas, callback) {
    this.emit('metadata-upload');
    protocol.uploadMetadatas(this.token, this.id, metadatas, callback);
  },
  
  fl.async.condition(
    fl.async(function (res) { return res.signed_challenge_info.length > 0 }),
    
    function (metadataResponse, callback) {
      protocol.uploadSamples(
        this.token,
        this.id,
        metadataResponse
          .signed_challenge_info
          .map(Operation.Upload.bogusSample.bind(this)),
        fl.async.carry(callback, metadataResponse)
      );
    },
    
    function (metadataResponse, callback) {
      callback(null, { track_sample_response: [] }, metadataResponse);
    }
  ),
  
  function (sampleResponse, metadataResponse, callback) {
    var uploadRequests = [].concat(
      metadataResponse.track_sample_response,
      sampleResponse.track_sample_response
    );
    for (var i = 0, req; req = uploadRequests[i]; ++i) {
      var file = this.files[req.client_track_id];
      var status = {
        1:  "MATCHED",
        2:  "UPLOAD_REQUESTED",
        3:  "INVALID_SIGNATURE",
        4:  "ALREADY_EXISTS",
        5:  "TRANSIENT_ERROR",
        6:  "PERMANENT_ERROR",
        7:  "TRACK_COUNT_LIMIT_REACHED",
        8:  "REJECT_STORE_TRACK",
        9:  "REJECT_STORE_TRACK_BY_LABEL",
        10: "REJECT_DRM_TRACK",
      }[req.response_code];
      this.emit('status', file.source, status);
      if (status === 'UPLOAD_REQUESTED') {
        file.serverId = req.server_track_id;
        this.toUpload.push(file.clientId);
      }
    }
    callback(null, this.toUpload);
  },
  
  fl.async.applyToAll(0, Operation.NJOBS, fl.async.compose(
    function (clientId, callback) {
      var file = this.files[clientId];
      this.emit('upload-start', file.source);
      protocol.getUploadSession(
        this.token,
        this.id,
        file.clientId,
        file.serverId,
        file.bitrate,
      //file.metadata.title,  // These parameters trigger the progress ticker
      //this.uploaded,        // in the web interface, but unfortunately it
      //this.toUpload.length, // doesn't go away.  Better not to summon it.
        callback
      );
    },
    
    function (session, callback) {
      var file = this.files[session.clientId];
      var xhr = new XMLHttpRequest();
      xhr.open('PUT', session.sessionUrl, true);
      xhr.onerror = callback;
      xhr.upload.onprogress = this.emit.bind(this, 'progress', file.source);
      xhr.onload = callback.bind(null, null, file.source);
      xhr.send(file.source);
    },
    
    function (file, event, callback) {
      this.emit('upload-end', file);
      this.uploaded += 1;
      callback(null);
    }
  ))
);

Operation.Upload.bogusSample = function (sci) {
  var file = this.files[sci.challenge_info.client_track_id];
  return {
    track: file.metadata,
    signed_challenge_info: sci,
    sample: '',
  };
}
