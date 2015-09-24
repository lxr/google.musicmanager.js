var protocol = new (function () {
  
  //require android.endpoint.js
  
  //require music.endpoint.js
  
  //require uploadsj.endpoint.js
  
  //require tagmap.js
  
  this.upAuth = newRpc({
    method: 'POST',
    url: 'https://android.clients.google.com/upsj/upauth',
    body: [ 'uploader_id', 'friendly_name' ],
    encode: protobufEncoder(android.UpAuthRequest),
    responseType: android.UploadResponse.decode,
    returns: 'auth_status',
    assert: { auth_status: android.UploadResponse.AuthStatus.OK },
  });
  
  this.uploadMetadatas = newRpc({
    method: 'POST',
    url: 'https://android.clients.google.com/upsj/metadata?version=1',
    body: [ 'uploader_id', 'track' ],
    encode: protobufEncoder(android.UploadMetadataRequest),
    responseType: android.UploadResponse.decode,
    returns: 'metadata_response',
  });
  
  this.uploadSamples = newRpc({
    method: 'POST',
    url: 'https://android.clients.google.com/upsj/sample?version=1',
    body: [ 'uploader_id', 'track_sample' ],
    encode: protobufEncoder(android.UploadSampleRequest),
    responseType: android.UploadResponse.decode,
    returns: 'sample_response',
  });
  
  this.getUploadSession = newRpc({
    method: 'POST',
    url: 'https://uploadsj.clients.google.com/uploadsj/scottyagent',
    body: [
      'UploaderId',
      'ClientId',
      'ServerId',
      'TrackBitRate',
      'CurrentUploadingTrack',
      'CurrentTotalUploadedCount',
      'ClientTotalSongCount'
    ],
    encode: uploadsj.GetUploadSessionRequest,
    responseType: uploadsj.GetUploadSessionResponse,
    assert: { errorCode: undefined },
  });
  
  this.getTracksToExport = newRpc({
    method: 'POST',
    url: 'https://music.google.com/music/exportids',
    body: [
      'client_id',
      'export_type',
      'continuation_token',
      'updated_min'
    ],
    encode: protobufEncoder(music.GetTracksToExportRequest),
    responseType: music.GetTracksToExportResponse.decode,
    assert: { status: music.GetTracksToExportResponse.TracksToExportStatus.OK },
  });
  
  this.getDownloadLink = newRpc({
    method: 'GET',
    url: 'https://music.google.com/music/export?version=2',
    headers: [ 'X-Device-ID' ],
    params: [ 'songid' ],
    responseType: 'json',
    returns: 'url',
  });
  
  this.readMetadata = function (file, callback) {
    var asset = AV.Asset.fromFile(file);
    var hash = dcodeIO.Long.fromString('14695981039346656037', true);
    var hashKey = dcodeIO.Long.fromString('1099511628211', true);
    var image = null;
    var track = {
      estimated_size: file.size,
      last_modified_timestamp:
        Math.round(file.lastModifiedDate.getTime() / 1000),
      title: file.name,
      original_bit_rate: 0,
      content_type: android.Track.ContentType.MP3,
    };
    
    asset.start();
    
    asset.source.on('data', function (buffer) {
      buffer = buffer.data;
      for (var i = 0; i < buffer.length; ++i) {
        hash = hash.xor(buffer[i]).multiply(hashKey);
      }
    });
    
    asset.on('duration', function (duration) {
      track.duration_millis = duration;
    });
    
    asset.on('metadata', function (metadata) {
      for (var key in metadata) {
        for (var field in tagmap[key] || {}) {
          var value = tagmap[key][field](metadata[key]);
          if (value !== undefined) {
            track[field] = value;
          }
        }
      }
    });
    
    // The following is commented out because channel information is not
    // visible to the user in the Google Music web interface, aurora.js does
    // not detect the average bitrate of VBR files properly, and until pure JS
    // audio transcoding is possible, we can't support formats beyond MP3.
    // The code is still good to have around in case one or several of the
    // above change.
    
    // asset.on('format', function (format) {
    //   track.channels = format.channelsPerFrame;
    //   track.original_bit_rate = format.bitrate / 1000;
    //   track.content_type =
    //     android.Track.ContentType[format.formatID.toUpperCase()];
    // });
    
    asset.source.on('end', function () {
      image = track.album_art_ref;
      delete track.album_art_ref;
      track.client_id = hash.toString(16);
      callback(null, track, image, file);
    });
  }
  
  function protobufEncoder(msg) {
    return function (obj) {
      return new Uint8Array((new msg(obj)).encodeAB());
    }
  }
  
  function newRpc(opts) {
    return function () {
      var args = Array.prototype.slice.call(arguments),
          token = args.shift(),
          callback = args.pop();
      
      var arg = undefined,
          headers = {},
          url = opts.url,
          body = {};
      
      (opts.headers || []).forEach(function (header) {
        if ((arg = args.shift()) !== undefined) {
          headers[header] = arg;
        }
      });
      
      (opts.params || []).forEach(function (param) {
        if ((arg = args.shift()) !== undefined) {
          url += '&' + encodeURIComponent(param) +
                 '=' + encodeURIComponent(arg);
        }
      });
      
      if (opts.body) {
        opts.body.forEach(function (key) {
          if ((arg = args.shift()) !== undefined) {
            body[key] = arg;
          }
        });
        try {
          body = opts.encode(body);
        } catch (e) {
          return callback(e);
        }
      } else {
        body = null;
      }
      
      var xhr = new XMLHttpRequest();
      xhr.open(opts.method, url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      
      for (var header in headers) {
        xhr.setRequestHeader(header, headers[header]);
      }
      
      xhr.responseType =
        opts.responseType instanceof Function ?
        (opts.responseType.type || 'arraybuffer') :
        opts.responseType;
      
      xhr.onerror = callback;
      xhr.onload = function () {
        if (this.status !== 200) {
          return callback(this);
        }
        try {
          var res =
            opts.responseType instanceof Function ?
            opts.responseType(this.response) :
            this.response;
          for (var key in opts.assert || {}) {
            if (res[key] !== opts.assert[key]) {
              return callback(res);
            }
          }
          callback(null, opts.returns ? res[opts.returns] : res);
        } catch (e) {
          callback(e);
        }
      };
      
      xhr.send(body);
    };
  }
  
})();
