/*!

Copyright (c) 2014-6 Lari Rasku <lari.o.rasku@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
this.google = this.google || {};
this.google.musicmanager = new (function () {
  "use strict";
  
  var protocol = new (function () {
    
    var android = dcodeIO.ProtoBuf.newBuilder().import({
      "package": null,
      "messages": [
        {
          "name": "ResponseStatus",
          "fields": [
            {
              "rule": "required",
              "type": "ResponseCode",
              "name": "response_code",
              "id": 1,
              "options": {}
            }
          ],
          "enums": [
            {
              "name": "ResponseCode",
              "values": [
                {
                  "name": "OK",
                  "id": 1
                },
                {
                  "name": "ALREADY_EXISTS",
                  "id": 2
                },
                {
                  "name": "SOFT_ERROR",
                  "id": 3
                },
                {
                  "name": "METADATA_TOO_LARGE",
                  "id": 4
                }
              ],
              "options": {}
            }
          ],
          "messages": [],
          "options": {}
        },
        {
          "name": "UploadOperation",
          "fields": [
            {
              "rule": "required",
              "type": "Operation",
              "name": "operation",
              "id": 1,
              "options": {}
            }
          ],
          "enums": [
            {
              "name": "Operation",
              "values": [
                {
                  "name": "OPERATION_CREATE",
                  "id": 1
                },
                {
                  "name": "OPERATION_MODIFY",
                  "id": 2
                },
                {
                  "name": "OPERATION_DELETE",
                  "id": 3
                }
              ],
              "options": {}
            }
          ],
          "messages": [],
          "options": {}
        },
        {
          "name": "ChallengeInfo",
          "fields": [
            {
              "rule": "required",
              "type": "string",
              "name": "client_track_id",
              "id": 1,
              "options": {}
            },
            {
              "rule": "required",
              "type": "int32",
              "name": "start_millis",
              "id": 2,
              "options": {}
            },
            {
              "rule": "required",
              "type": "int32",
              "name": "duration_millis",
              "id": 3,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "challenge_user_id",
              "id": 4,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "int64",
              "name": "challenge_timestamp",
              "id": 5,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "bool",
              "name": "expect_match",
              "id": 6,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "SignedChallengeInfo",
          "fields": [
            {
              "rule": "required",
              "type": "ChallengeInfo",
              "name": "challenge_info",
              "id": 1,
              "options": {}
            },
            {
              "rule": "required",
              "type": "bytes",
              "name": "signature",
              "id": 2,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "TrackSample",
          "fields": [
            {
              "rule": "required",
              "type": "Track",
              "name": "track",
              "id": 1,
              "options": {}
            },
            {
              "rule": "required",
              "type": "SignedChallengeInfo",
              "name": "signed_challenge_info",
              "id": 2,
              "options": {}
            },
            {
              "rule": "required",
              "type": "bytes",
              "name": "sample",
              "id": 3,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "Track.ContentType",
              "name": "sample_format",
              "id": 4,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "ImageUnion",
              "name": "user_album_art",
              "id": 5,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "UploadPlaylistRequest",
          "fields": [
            {
              "rule": "required",
              "type": "UploadOperation",
              "name": "upload_operation",
              "id": 1,
              "options": {}
            },
            {
              "rule": "repeated",
              "type": "Playlist",
              "name": "playlist",
              "id": 2,
              "options": {}
            },
            {
              "rule": "required",
              "type": "string",
              "name": "uploader_id",
              "id": 3,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "PlaylistResponse",
          "fields": [
            {
              "rule": "required",
              "type": "ResponseStatus",
              "name": "response_status",
              "id": 1,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "client_id",
              "id": 2,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "server_id",
              "id": 3,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "UploadPlaylistResponse",
          "fields": [
            {
              "rule": "repeated",
              "type": "PlaylistResponse",
              "name": "playlist_response",
              "id": 1,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "UploadPlaylistEntryRequest",
          "fields": [
            {
              "rule": "required",
              "type": "UploadOperation",
              "name": "upload_operation",
              "id": 1,
              "options": {}
            },
            {
              "rule": "repeated",
              "type": "PlaylistEntry",
              "name": "playlist_entry",
              "id": 2,
              "options": {}
            },
            {
              "rule": "required",
              "type": "string",
              "name": "uploader_id",
              "id": 3,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "PlaylistEntryResponse",
          "fields": [
            {
              "rule": "required",
              "type": "ResponseStatus",
              "name": "response_status",
              "id": 1,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "client_id",
              "id": 2,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "server_id",
              "id": 3,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "UploadPlaylistEntryResponse",
          "fields": [
            {
              "rule": "repeated",
              "type": "PlaylistEntryResponse",
              "name": "playlist_entry_response",
              "id": 1,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "UploadMetadataRequest",
          "fields": [
            {
              "rule": "repeated",
              "type": "Track",
              "name": "track",
              "id": 1,
              "options": {}
            },
            {
              "rule": "required",
              "type": "string",
              "name": "uploader_id",
              "id": 2,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "UpdateUploadStateRequest",
          "fields": [
            {
              "rule": "required",
              "type": "UploadState",
              "name": "state",
              "id": 1,
              "options": {}
            },
            {
              "rule": "required",
              "type": "string",
              "name": "uploader_id",
              "id": 2,
              "options": {}
            }
          ],
          "enums": [
            {
              "name": "UploadState",
              "values": [
                {
                  "name": "START",
                  "id": 1
                },
                {
                  "name": "PAUSED",
                  "id": 2
                },
                {
                  "name": "STOPPED",
                  "id": 3
                }
              ],
              "options": {}
            }
          ],
          "messages": [],
          "options": {}
        },
        {
          "name": "ClientStateRequest",
          "fields": [
            {
              "rule": "required",
              "type": "string",
              "name": "uploader_id",
              "id": 1,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "int64",
              "name": "get_purchased_tracks_since",
              "id": 2,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "ClientStateResponse",
          "fields": [
            {
              "rule": "optional",
              "type": "int64",
              "name": "locker_track_limit",
              "id": 1,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "int64",
              "name": "user_songs_in_locker",
              "id": 2,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "int32",
              "name": "track_size_limit_in_mb",
              "id": 3,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "int64",
              "name": "user_purchased_tracks_since",
              "id": 4,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "int64",
              "name": "total_track_count",
              "id": 5,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "UploadMetadataResponse",
          "fields": [
            {
              "rule": "repeated",
              "type": "SignedChallengeInfo",
              "name": "signed_challenge_info",
              "id": 1,
              "options": {}
            },
            {
              "rule": "repeated",
              "type": "string",
              "name": "upload_id",
              "id": 2,
              "options": {}
            },
            {
              "rule": "repeated",
              "type": "TrackSampleResponse",
              "name": "track_sample_response",
              "id": 3,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "TrackSampleResponse",
          "fields": [
            {
              "rule": "required",
              "type": "string",
              "name": "client_track_id",
              "id": 1,
              "options": {}
            },
            {
              "rule": "required",
              "type": "ResponseCode",
              "name": "response_code",
              "id": 2,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "server_track_id",
              "id": 3,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "album_art_url",
              "id": 4,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "bool",
              "name": "expect_match",
              "id": 5,
              "options": {}
            }
          ],
          "enums": [
            {
              "name": "ResponseCode",
              "values": [
                {
                  "name": "MATCHED",
                  "id": 1
                },
                {
                  "name": "UPLOAD_REQUESTED",
                  "id": 2
                },
                {
                  "name": "INVALID_SIGNATURE",
                  "id": 3
                },
                {
                  "name": "ALREADY_EXISTS",
                  "id": 4
                },
                {
                  "name": "TRANSIENT_ERROR",
                  "id": 5
                },
                {
                  "name": "PERMANENT_ERROR",
                  "id": 6
                },
                {
                  "name": "TRACK_COUNT_LIMIT_REACHED",
                  "id": 7
                },
                {
                  "name": "REJECT_STORE_TRACK",
                  "id": 8
                },
                {
                  "name": "REJECT_STORE_TRACK_BY_LABEL",
                  "id": 9
                },
                {
                  "name": "REJECT_DRM_TRACK",
                  "id": 10
                }
              ],
              "options": {}
            }
          ],
          "messages": [],
          "options": {}
        },
        {
          "name": "UploadSampleRequest",
          "fields": [
            {
              "rule": "repeated",
              "type": "TrackSample",
              "name": "track_sample",
              "id": 1,
              "options": {}
            },
            {
              "rule": "required",
              "type": "string",
              "name": "uploader_id",
              "id": 2,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "UploadSampleResponse",
          "fields": [
            {
              "rule": "repeated",
              "type": "TrackSampleResponse",
              "name": "track_sample_response",
              "id": 1,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "ImageUnion",
          "fields": [
            {
              "rule": "optional",
              "type": "bytes",
              "name": "user_album_art",
              "id": 1,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "album_art_url",
              "id": 2,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "UploadResponse",
          "fields": [
            {
              "rule": "optional",
              "type": "ResponseType",
              "name": "response_type",
              "id": 1,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "UploadMetadataResponse",
              "name": "metadata_response",
              "id": 2,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "UploadPlaylistResponse",
              "name": "playlist_response",
              "id": 3,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "UploadPlaylistEntryResponse",
              "name": "playlist_entry_response",
              "id": 4,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "UploadSampleResponse",
              "name": "sample_response",
              "id": 5,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "GetJobsResponse",
              "name": "getjobs_response",
              "id": 7,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "ClientStateResponse",
              "name": "clientstate_response",
              "id": 8,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "ClientPolicy",
              "name": "policy",
              "id": 6,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "AuthStatus",
              "name": "auth_status",
              "id": 11,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "bool",
              "name": "auth_error",
              "id": 12,
              "options": {}
            }
          ],
          "enums": [
            {
              "name": "ResponseType",
              "values": [
                {
                  "name": "METADATA_RESPONSE",
                  "id": 1
                },
                {
                  "name": "PLAYLIST_RESPONSE",
                  "id": 2
                },
                {
                  "name": "PLAYLIST_ENTRY_RESPONSE",
                  "id": 3
                },
                {
                  "name": "SAMPLE_RESPONSE",
                  "id": 4
                },
                {
                  "name": "GETJOBS_RESPONSE",
                  "id": 5
                },
                {
                  "name": "AUTH_RESPONSE",
                  "id": 6
                },
                {
                  "name": "CLIENT_STATE_RESPONSE",
                  "id": 7
                },
                {
                  "name": "UPDATE_UPLOAD_STATE_RESPONSE",
                  "id": 8
                },
                {
                  "name": "DELETE_UPLOAD_REQUESTED_RESPONSE",
                  "id": 9
                }
              ],
              "options": {}
            },
            {
              "name": "AuthStatus",
              "values": [
                {
                  "name": "OK",
                  "id": 8
                },
                {
                  "name": "MAX_LIMIT_REACHED",
                  "id": 9
                },
                {
                  "name": "CLIENT_BOUND_TO_OTHER_ACCOUNT",
                  "id": 10
                },
                {
                  "name": "CLIENT_NOT_AUTHORIZED",
                  "id": 11
                },
                {
                  "name": "MAX_PER_MACHINE_USERS_EXCEEDED",
                  "id": 12
                },
                {
                  "name": "CLIENT_PLEASE_RETRY",
                  "id": 13
                },
                {
                  "name": "NOT_SUBSCRIBED",
                  "id": 14
                },
                {
                  "name": "INVALID_REQUEST",
                  "id": 15
                },
                {
                  "name": "UPGRADE_MUSIC_MANAGER",
                  "id": 16
                }
              ],
              "options": {}
            }
          ],
          "messages": [],
          "options": {}
        },
        {
          "name": "TracksToUpload",
          "fields": [
            {
              "rule": "required",
              "type": "string",
              "name": "client_id",
              "id": 1,
              "options": {}
            },
            {
              "rule": "required",
              "type": "string",
              "name": "server_id",
              "id": 2,
              "options": {}
            },
            {
              "rule": "required",
              "type": "TrackStatus",
              "name": "status",
              "id": 5,
              "options": {}
            }
          ],
          "enums": [
            {
              "name": "TrackStatus",
              "values": [
                {
                  "name": "FORCE_REUPLOAD",
                  "id": 3
                },
                {
                  "name": "UPLOAD_REQUESTED",
                  "id": 4
                }
              ],
              "options": {}
            }
          ],
          "messages": [],
          "options": {}
        },
        {
          "name": "GetJobsRequest",
          "fields": [
            {
              "rule": "required",
              "type": "string",
              "name": "uploader_id",
              "id": 1,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "GetJobsResponse",
          "fields": [
            {
              "rule": "repeated",
              "type": "TracksToUpload",
              "name": "tracks_to_upload",
              "id": 1,
              "options": {}
            },
            {
              "rule": "required",
              "type": "bool",
              "name": "get_tracks_success",
              "id": 2,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "UpAuthRequest",
          "fields": [
            {
              "rule": "required",
              "type": "string",
              "name": "uploader_id",
              "id": 1,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "friendly_name",
              "id": 2,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "DeleteUploadRequestedRequest",
          "fields": [
            {
              "rule": "required",
              "type": "string",
              "name": "uploader_id",
              "id": 1,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "ClientPolicy",
          "fields": [
            {
              "rule": "optional",
              "type": "bool",
              "name": "pause_uploads",
              "id": 1,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "bool",
              "name": "abort",
              "id": 2,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "int32",
              "name": "retry_in_minutes",
              "id": 3,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "int32",
              "name": "bandwidth_cap_kbps",
              "id": 4,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "bool",
              "name": "pause_downloads",
              "id": 5,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "int32",
              "name": "download_bandwidth_cap_kbps",
              "id": 6,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "bool",
              "name": "send_analytics",
              "id": 7,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "analytics_url",
              "id": 8,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "bool",
              "name": "enable_gapless",
              "id": 9,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "bool",
              "name": "enable_m4p",
              "id": 10,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "UploadMetadataInternalRequest",
          "fields": [
            {
              "rule": "required",
              "type": "uint64",
              "name": "gaiaid",
              "id": 1,
              "options": {}
            },
            {
              "rule": "required",
              "type": "UploadMetadataRequest",
              "name": "request",
              "id": 2,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "OverrideConfigValue",
          "fields": [
            {
              "rule": "optional",
              "type": "string",
              "name": "key",
              "id": 1,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "value",
              "id": 2,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "OverridePriority",
              "name": "priority",
              "id": 3,
              "options": {}
            }
          ],
          "enums": [
            {
              "name": "OverridePriority",
              "values": [
                {
                  "name": "DEFAULT_PRIORITY",
                  "id": -1
                },
                {
                  "name": "LOWEST_PRIORITY",
                  "id": 100
                },
                {
                  "name": "LOW_PRIORITY",
                  "id": 200
                },
                {
                  "name": "MEDIUM_PRIORITY",
                  "id": 300
                },
                {
                  "name": "HIGH_PRIORITY",
                  "id": 400
                },
                {
                  "name": "HIGHEST_PRIORITY",
                  "id": 500
                },
                {
                  "name": "DEFAULT_SERVER_PRIORITY",
                  "id": 300
                },
                {
                  "name": "DEFAULT_CLIENT_PRIORITY",
                  "id": 400
                }
              ],
              "options": {}
            }
          ],
          "messages": [],
          "options": {}
        },
        {
          "name": "OverrideConfigValueCollection",
          "fields": [
            {
              "rule": "repeated",
              "type": "OverrideConfigValue",
              "name": "value",
              "id": 1,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        }
      ],
      "enums": [],
      "imports": [
        {
          "package": null,
          "messages": [
            {
              "name": "AudioRef",
              "fields": [
                {
                  "rule": "required",
                  "type": "Store",
                  "name": "store",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "required",
                  "type": "bytes",
                  "name": "ref",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "url",
                  "id": 4,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "bit_rate",
                  "id": 5,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "sample_rate",
                  "id": 6,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "downloadable",
                  "id": 7,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "duration_millis",
                  "id": 8,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "rematch_timestamp",
                  "id": 9,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "invalid_due_to_wipeout",
                  "id": 10,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "Store",
                  "values": [
                    {
                      "name": "BLOBSTORE",
                      "id": 1
                    },
                    {
                      "name": "SM_V2",
                      "id": 2
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "ImageRef",
              "fields": [
                {
                  "rule": "optional",
                  "type": "Store",
                  "name": "store",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "uint32",
                  "name": "width",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "uint32",
                  "name": "height",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "url",
                  "id": 6,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "invalid_due_to_wipeout",
                  "id": 7,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "Origin",
                  "name": "origin",
                  "id": 8,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "Store",
                  "values": [
                    {
                      "name": "SHOEBOX",
                      "id": 3
                    }
                  ],
                  "options": {}
                },
                {
                  "name": "Origin",
                  "values": [
                    {
                      "name": "PERSONAL",
                      "id": 1
                    },
                    {
                      "name": "STORE",
                      "id": 2
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "UploadedUitsId3Tag",
              "fields": [
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "owner",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bytes",
                  "name": "data",
                  "id": 2,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "Track",
              "fields": [
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "client_id",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "creation_timestamp",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "last_modified_timestamp",
                  "id": 4,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "deleted",
                  "id": 5,
                  "options": {
                    "default": false
                  }
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "title",
                  "id": 6,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "artist",
                  "id": 7,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "artist_hash",
                  "id": 46,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "composer",
                  "id": 8,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "album",
                  "id": 9,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "album_artist",
                  "id": 10,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "canonical_album",
                  "id": 56,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "canonical_artist",
                  "id": 57,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "canonical_genre_album",
                  "id": 58,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "year",
                  "id": 11,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "comment",
                  "id": 12,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "track_number",
                  "id": 13,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "genre",
                  "id": 14,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "duration_millis",
                  "id": 15,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "beats_per_minute",
                  "id": 16,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "original_bit_rate",
                  "id": 44,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "AudioRef",
                  "name": "audio_ref",
                  "id": 17,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "ImageRef",
                  "name": "album_art_ref",
                  "id": 18,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "AvailabilityStatus",
                  "name": "availability_status",
                  "id": 19,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "play_count",
                  "id": 20,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "ContentType",
                  "name": "content_type",
                  "id": 25,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "total_track_count",
                  "id": 26,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "disc_number",
                  "id": 27,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "total_disc_count",
                  "id": 28,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "Channels",
                  "name": "channels",
                  "id": 29,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "TrackType",
                  "name": "track_type",
                  "id": 30,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "use_single_server_copy",
                  "id": 59,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "Rating",
                  "name": "rating",
                  "id": 31,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "estimated_size",
                  "id": 32,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "store_id",
                  "id": 33,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "metajam_id",
                  "id": 34,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "double",
                  "name": "metajam_id_confidence",
                  "id": 43,
                  "options": {
                    "default": 0
                  }
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "uits",
                  "id": 35,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "UitsMetadata",
                  "name": "uits_metadata",
                  "id": 40,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "compilation",
                  "id": 36,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "client_date_added",
                  "id": 37,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "recent_timestamp",
                  "id": 38,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "do_not_rematch",
                  "id": 39,
                  "options": {
                    "default": false
                  }
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "from_album_purchase",
                  "id": 41,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "album_metajam_id",
                  "id": 42,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "transaction_id",
                  "id": 45,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "debug_track",
                  "id": 47,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "normalized_title",
                  "id": 48,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "normalized_artist",
                  "id": 49,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "normalized_album",
                  "id": 50,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "normalized_album_artist",
                  "id": 51,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "normalized_canonical_album",
                  "id": 54,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "normalized_canonical_artist",
                  "id": 55,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "uploader_id",
                  "id": 52,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "client_album_id",
                  "id": 53,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "label_owner_code",
                  "id": 60,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "ContentType",
                  "name": "original_content_type",
                  "id": 61,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "UploadedUitsId3Tag",
                  "name": "uploaded_uits",
                  "id": 71,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "AvailabilityStatus",
                  "values": [
                    {
                      "name": "PENDING",
                      "id": 1
                    },
                    {
                      "name": "MATCHED",
                      "id": 2
                    },
                    {
                      "name": "UPLOAD_REQUESTED",
                      "id": 3
                    },
                    {
                      "name": "AVAILABLE",
                      "id": 4
                    },
                    {
                      "name": "FORCE_REUPLOAD",
                      "id": 5
                    },
                    {
                      "name": "UPLOAD_PERMANENTLY_FAILED",
                      "id": 6
                    }
                  ],
                  "options": {}
                },
                {
                  "name": "ContentType",
                  "values": [
                    {
                      "name": "MP3",
                      "id": 1
                    },
                    {
                      "name": "M4A",
                      "id": 2
                    },
                    {
                      "name": "AAC",
                      "id": 3
                    },
                    {
                      "name": "FLAC",
                      "id": 4
                    },
                    {
                      "name": "OGG",
                      "id": 5
                    },
                    {
                      "name": "WMA",
                      "id": 6
                    },
                    {
                      "name": "M4P",
                      "id": 7
                    },
                    {
                      "name": "ALAC",
                      "id": 8
                    }
                  ],
                  "options": {}
                },
                {
                  "name": "Channels",
                  "values": [
                    {
                      "name": "MONO",
                      "id": 1
                    },
                    {
                      "name": "STEREO",
                      "id": 2
                    }
                  ],
                  "options": {}
                },
                {
                  "name": "TrackType",
                  "values": [
                    {
                      "name": "MATCHED_TRACK",
                      "id": 1
                    },
                    {
                      "name": "UNMATCHED_TRACK",
                      "id": 2
                    },
                    {
                      "name": "LOCAL_TRACK",
                      "id": 3
                    },
                    {
                      "name": "PURCHASED_TRACK",
                      "id": 4
                    },
                    {
                      "name": "METADATA_ONLY_MATCHED_TRACK",
                      "id": 5
                    },
                    {
                      "name": "PROMO_TRACK",
                      "id": 6
                    }
                  ],
                  "options": {}
                },
                {
                  "name": "Rating",
                  "values": [
                    {
                      "name": "NOT_RATED",
                      "id": 1
                    },
                    {
                      "name": "ONE_STAR",
                      "id": 2
                    },
                    {
                      "name": "TWO_STARS",
                      "id": 3
                    },
                    {
                      "name": "THREE_STARS",
                      "id": 4
                    },
                    {
                      "name": "FOUR_STARS",
                      "id": 5
                    },
                    {
                      "name": "FIVE_STARS",
                      "id": 6
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "Tracks",
              "fields": [
                {
                  "rule": "repeated",
                  "type": "Track",
                  "name": "track",
                  "id": 1,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "Playlist",
              "fields": [
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "client_id",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "creation_timestamp",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "last_modified_timestamp",
                  "id": 4,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "deleted",
                  "id": 5,
                  "options": {
                    "default": false
                  }
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "name",
                  "id": 6,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "PlaylistType",
                  "name": "playlist_type",
                  "id": 7,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "ImageRef",
                  "name": "playlist_art_ref",
                  "id": 8,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "recent_timestamp",
                  "id": 9,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "PlaylistType",
                  "values": [
                    {
                      "name": "USER_GENERATED",
                      "id": 1
                    },
                    {
                      "name": "MAGIC",
                      "id": 2
                    },
                    {
                      "name": "PROMO",
                      "id": 3
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "PlaylistEntry",
              "fields": [
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "playlist_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "absolute_position",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "place_after_entry_id",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "track_id",
                  "id": 4,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "id",
                  "id": 5,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "client_id",
                  "id": 6,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "creation_timestamp",
                  "id": 7,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "last_modified_timestamp",
                  "id": 8,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "deleted",
                  "id": 9,
                  "options": {
                    "default": false
                  }
                },
                {
                  "rule": "optional",
                  "type": "RelativePositionIdType",
                  "name": "relative_position_id_type",
                  "id": 10,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "Track",
                  "name": "track",
                  "id": 15,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "place_before_entry_id",
                  "id": 16,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "string_position",
                  "id": 17,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "RelativePositionIdType",
                  "values": [
                    {
                      "name": "SERVER",
                      "id": 1
                    },
                    {
                      "name": "CLIENT",
                      "id": 2
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "TrackSearchRestriction",
              "fields": [
                {
                  "rule": "required",
                  "type": "TrackAttribute",
                  "name": "attribute",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "required",
                  "type": "string",
                  "name": "value",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "required",
                  "type": "ComparisonType",
                  "name": "comparison_type",
                  "id": 3,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "TrackAttribute",
                  "values": [
                    {
                      "name": "TITLE",
                      "id": 1
                    },
                    {
                      "name": "ARTIST",
                      "id": 2
                    },
                    {
                      "name": "ALBUM",
                      "id": 3
                    },
                    {
                      "name": "ALBUM_ARTIST",
                      "id": 4
                    },
                    {
                      "name": "GENRE",
                      "id": 5
                    },
                    {
                      "name": "AVAILABILITY_STATUS",
                      "id": 6
                    },
                    {
                      "name": "TRACK_TYPE",
                      "id": 7
                    },
                    {
                      "name": "YEAR",
                      "id": 8
                    },
                    {
                      "name": "STORE_ID",
                      "id": 9
                    },
                    {
                      "name": "ALBUM_METAJAM_ID",
                      "id": 10
                    }
                  ],
                  "options": {}
                },
                {
                  "name": "ComparisonType",
                  "values": [
                    {
                      "name": "EQUAL",
                      "id": 0
                    },
                    {
                      "name": "NOT_EQUAL",
                      "id": 1
                    },
                    {
                      "name": "GREATER_THAN",
                      "id": 2
                    },
                    {
                      "name": "GREATER_EQUAL",
                      "id": 3
                    },
                    {
                      "name": "LESS_THAN",
                      "id": 4
                    },
                    {
                      "name": "LESS_EQUAL",
                      "id": 5
                    },
                    {
                      "name": "PARTIAL_MATCH",
                      "id": 6
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "TrackSearchRestrictionSet",
              "fields": [
                {
                  "rule": "optional",
                  "type": "RestrictionSetType",
                  "name": "type",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "TrackSearchRestriction",
                  "name": "restriction",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "TrackSearchRestrictionSet",
                  "name": "sub_set",
                  "id": 3,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "RestrictionSetType",
                  "values": [
                    {
                      "name": "AND",
                      "id": 0
                    },
                    {
                      "name": "OR",
                      "id": 1
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "TrackSortOrder",
              "fields": [
                {
                  "rule": "optional",
                  "type": "TrackAttribute",
                  "name": "attribute",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "descending",
                  "id": 2,
                  "options": {
                    "default": true
                  }
                }
              ],
              "enums": [
                {
                  "name": "TrackAttribute",
                  "values": [
                    {
                      "name": "LAST_MODIFIED_TIME",
                      "id": 1
                    },
                    {
                      "name": "ARTIST",
                      "id": 2
                    },
                    {
                      "name": "ALBUM",
                      "id": 3
                    },
                    {
                      "name": "TITLE",
                      "id": 4
                    },
                    {
                      "name": "TRACK_NUMBER",
                      "id": 6
                    },
                    {
                      "name": "PLAY_COUNT",
                      "id": 9
                    },
                    {
                      "name": "DURATION_MILLIS",
                      "id": 10
                    },
                    {
                      "name": "RATING",
                      "id": 11
                    },
                    {
                      "name": "CREATION_TIME",
                      "id": 12
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetTracksRequest",
              "fields": [
                {
                  "rule": "required",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "updated_min",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "include_deleted",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "max_results",
                  "id": 4,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "continuation_token",
                  "id": 5,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "TrackSearchRestriction",
                  "name": "search_restriction",
                  "id": 6,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "TrackSortOrder",
                  "name": "sort_order",
                  "id": 7,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "TrackSearchRestrictionSet",
                  "name": "restriction_set",
                  "id": 8,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "TrackProjection",
                  "name": "track_projection",
                  "id": 9,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "TrackProjection",
                  "values": [
                    {
                      "name": "FULL",
                      "id": 1
                    },
                    {
                      "name": "FRONTEND_VIEW",
                      "id": 2
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetTracksResponse",
              "fields": [
                {
                  "rule": "required",
                  "type": "ResponseCode",
                  "name": "response_code",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "Track",
                  "name": "track",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "estimated_total_results",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "continuation_token",
                  "id": 4,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "ResponseCode",
                  "values": [
                    {
                      "name": "OK",
                      "id": 1
                    },
                    {
                      "name": "NOT_MODIFIED",
                      "id": 2
                    },
                    {
                      "name": "GONE",
                      "id": 3
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetPlaylistEntriesRequest",
              "fields": [
                {
                  "rule": "required",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "updated_min",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "include_deleted",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "max_results",
                  "id": 4,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "continuation_token",
                  "id": 5,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "playlist_id_filter",
                  "id": 6,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "include_all_track_metadata",
                  "id": 7,
                  "options": {
                    "default": false
                  }
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "only_show_available_tracks",
                  "id": 8,
                  "options": {
                    "default": true
                  }
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetPlaylistEntriesResponse",
              "fields": [
                {
                  "rule": "required",
                  "type": "ResponseCode",
                  "name": "response_code",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "PlaylistEntry",
                  "name": "playlist_entry",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "estimated_total_results",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "continuation_token",
                  "id": 4,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "ResponseCode",
                  "values": [
                    {
                      "name": "OK",
                      "id": 1
                    },
                    {
                      "name": "NOT_MODIFIED",
                      "id": 2
                    },
                    {
                      "name": "GONE",
                      "id": 3
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "PlaylistSortOrder",
              "fields": [
                {
                  "rule": "optional",
                  "type": "PlaylistAttribute",
                  "name": "attribute",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "descending",
                  "id": 2,
                  "options": {
                    "default": false
                  }
                }
              ],
              "enums": [
                {
                  "name": "PlaylistAttribute",
                  "values": [
                    {
                      "name": "LAST_MODIFIED_TIME",
                      "id": 1
                    },
                    {
                      "name": "TITLE",
                      "id": 2
                    },
                    {
                      "name": "CREATION_TIME",
                      "id": 3
                    },
                    {
                      "name": "RECENT_TIMESTAMP",
                      "id": 4
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetPlaylistsRequest",
              "fields": [
                {
                  "rule": "required",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "updated_min",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "include_deleted",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "max_results",
                  "id": 4,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "continuation_token",
                  "id": 5,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "PlaylistSortOrder",
                  "name": "sort_order",
                  "id": 6,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetPlaylistsResponse",
              "fields": [
                {
                  "rule": "required",
                  "type": "ResponseCode",
                  "name": "response_code",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "Playlist",
                  "name": "playlist",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "estimated_total_results",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "continuation_token",
                  "id": 4,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "ResponseCode",
                  "values": [
                    {
                      "name": "OK",
                      "id": 1
                    },
                    {
                      "name": "NOT_MODIFIED",
                      "id": 2
                    },
                    {
                      "name": "GONE",
                      "id": 3
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "LookupTrackRequest",
              "fields": [
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "client_id",
                  "id": 2,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "LookupPlaylistEntryRequest",
              "fields": [
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "client_id",
                  "id": 2,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "LookupPlaylistRequest",
              "fields": [
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "client_id",
                  "id": 2,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "BatchLookupRequest",
              "fields": [
                {
                  "rule": "required",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "LookupTrackRequest",
                  "name": "track",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "LookupPlaylistRequest",
                  "name": "playlist",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "MetadataType",
                  "name": "metadata_type",
                  "id": 4,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "LookupPlaylistEntryRequest",
                  "name": "playlist_entry",
                  "id": 5,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "include_deleted",
                  "id": 6,
                  "options": {
                    "default": false
                  }
                }
              ],
              "enums": [
                {
                  "name": "MetadataType",
                  "values": [
                    {
                      "name": "TRACK",
                      "id": 1
                    },
                    {
                      "name": "PLAYLIST",
                      "id": 2
                    },
                    {
                      "name": "PLAYLIST_ENTRY",
                      "id": 3
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "BatchLookupResponse",
              "fields": [
                {
                  "rule": "repeated",
                  "type": "Track",
                  "name": "track",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "Playlist",
                  "name": "playlist",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "PlaylistEntry",
                  "name": "playlist_entry",
                  "id": 3,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "MutateTrackRequest",
              "fields": [
                {
                  "rule": "optional",
                  "type": "Track",
                  "name": "create_track",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "Track",
                  "name": "update_track",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "delete_track",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "partial_update",
                  "id": 4,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "update_last_modified",
                  "id": 5,
                  "options": {
                    "default": true
                  }
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "undelete_track",
                  "id": 6,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "MutateResponse",
              "fields": [
                {
                  "rule": "optional",
                  "type": "MutateResponseCode",
                  "name": "response_code",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "id",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "string",
                  "name": "child_id",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "client_id",
                  "id": 4,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "AvailabilityStatus",
                  "name": "availability_status",
                  "id": 5,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "error_message",
                  "id": 6,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "MutateResponseCode",
                  "values": [
                    {
                      "name": "OK",
                      "id": 1
                    },
                    {
                      "name": "CONFLICT",
                      "id": 2
                    },
                    {
                      "name": "INVALID_REQUEST",
                      "id": 3
                    },
                    {
                      "name": "METADATA_TOO_LARGE",
                      "id": 4
                    }
                  ],
                  "options": {}
                },
                {
                  "name": "AvailabilityStatus",
                  "values": [
                    {
                      "name": "PENDING",
                      "id": 1
                    },
                    {
                      "name": "MATCHED",
                      "id": 2
                    },
                    {
                      "name": "UPLOAD_REQUESTED",
                      "id": 3
                    },
                    {
                      "name": "AVAILABLE",
                      "id": 4
                    },
                    {
                      "name": "FORCE_REUPLOAD",
                      "id": 5
                    },
                    {
                      "name": "UPLOAD_PERMANENTLY_FAILED",
                      "id": 6
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "BatchMutateTracksRequest",
              "fields": [
                {
                  "rule": "required",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "MutateTrackRequest",
                  "name": "track_mutation",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "send_notification",
                  "id": 3,
                  "options": {
                    "default": true
                  }
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "detect_timestamp_conflict",
                  "id": 4,
                  "options": {
                    "default": true
                  }
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "notify_fine_grained_updates",
                  "id": 5,
                  "options": {
                    "default": true
                  }
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "BatchMutateTracksResponse",
              "fields": [
                {
                  "rule": "repeated",
                  "type": "BatchMutateTracksResponseCode",
                  "name": "response_code",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "MutateResponse",
                  "name": "mutate_response",
                  "id": 2,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "BatchMutateTracksResponseCode",
                  "values": [
                    {
                      "name": "OK",
                      "id": 1
                    },
                    {
                      "name": "CONFLICT",
                      "id": 2
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "MutatePlaylistRequest",
              "fields": [
                {
                  "rule": "optional",
                  "type": "Playlist",
                  "name": "create_playlist",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "Playlist",
                  "name": "update_playlist",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "delete_playlist",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "partial_update",
                  "id": 4,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "PlaylistEntry",
                  "name": "playlist_entry",
                  "id": 5,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "update_last_modified",
                  "id": 6,
                  "options": {
                    "default": true
                  }
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "undelete_playlist",
                  "id": 7,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "BatchMutatePlaylistsRequest",
              "fields": [
                {
                  "rule": "required",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "MutatePlaylistRequest",
                  "name": "playlist_mutation",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "send_notification",
                  "id": 3,
                  "options": {
                    "default": true
                  }
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "detect_timestamp_conflict",
                  "id": 4,
                  "options": {
                    "default": true
                  }
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "notify_fine_grained_updates",
                  "id": 5,
                  "options": {
                    "default": false
                  }
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "BatchMutatePlaylistsResponse",
              "fields": [
                {
                  "rule": "repeated",
                  "type": "BatchMutatePlaylistsResponseCode",
                  "name": "response_code",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "MutateResponse",
                  "name": "mutate_response",
                  "id": 2,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "BatchMutatePlaylistsResponseCode",
                  "values": [
                    {
                      "name": "OK",
                      "id": 1
                    },
                    {
                      "name": "CONFLICT",
                      "id": 2
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "MutatePlaylistEntryRequest",
              "fields": [
                {
                  "rule": "optional",
                  "type": "PlaylistEntry",
                  "name": "create_playlist_entry",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "PlaylistEntry",
                  "name": "update_playlist_entry",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "PlaylistEntry",
                  "name": "delete_playlist_entry",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "update_last_modified",
                  "id": 4,
                  "options": {
                    "default": true
                  }
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "undelete_playlist_entry",
                  "id": 5,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "BatchMutatePlaylistEntriesRequest",
              "fields": [
                {
                  "rule": "required",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "MutatePlaylistEntryRequest",
                  "name": "playlist_entry_mutation",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "send_notification",
                  "id": 3,
                  "options": {
                    "default": true
                  }
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "detect_timestamp_conflict",
                  "id": 4,
                  "options": {
                    "default": true
                  }
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "notify_fine_grained_updates",
                  "id": 5,
                  "options": {
                    "default": false
                  }
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "BatchMutatePlaylistEntriesResponse",
              "fields": [
                {
                  "rule": "repeated",
                  "type": "BatchMutatePlaylistEntriesResponseCode",
                  "name": "response_code",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "MutateResponse",
                  "name": "mutate_response",
                  "id": 2,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "BatchMutatePlaylistEntriesResponseCode",
                  "values": [
                    {
                      "name": "OK",
                      "id": 1
                    },
                    {
                      "name": "CONFLICT",
                      "id": 2
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "MagicPlaylistSeed",
              "fields": [
                {
                  "rule": "required",
                  "type": "SeedType",
                  "name": "seed_type",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "required",
                  "type": "string",
                  "name": "seed",
                  "id": 2,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "SeedType",
                  "values": [
                    {
                      "name": "TRACK",
                      "id": 0
                    },
                    {
                      "name": "ARTIST",
                      "id": 1
                    },
                    {
                      "name": "ALBUM",
                      "id": 2
                    },
                    {
                      "name": "OPAQUE_SEED",
                      "id": 3
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "MagicPlaylistRequest",
              "fields": [
                {
                  "rule": "required",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "playlist_name",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "playlist_id",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "MagicPlaylistSeed",
                  "name": "seed",
                  "id": 4,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "num_recommendations",
                  "id": 5,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "include_all_track_metadata",
                  "id": 6,
                  "options": {
                    "default": false
                  }
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "model_name",
                  "id": 7,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "MagicPlaylistResponse",
              "fields": [
                {
                  "rule": "optional",
                  "type": "Playlist",
                  "name": "playlist",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "PlaylistEntry",
                  "name": "playlist_entry",
                  "id": 2,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "FlushLockerRequest",
              "fields": [
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "gaia_cookie",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "remove_audio_binaries",
                  "id": 3,
                  "options": {
                    "default": true
                  }
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "remove_image_binaries",
                  "id": 4,
                  "options": {
                    "default": true
                  }
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "send_notification",
                  "id": 5,
                  "options": {
                    "default": true
                  }
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "reset_subscription_type",
                  "id": 6,
                  "options": {
                    "default": false
                  }
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "notify_fine_grained_updates",
                  "id": 8,
                  "options": {
                    "default": true
                  }
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "FlushLockerResponse",
              "fields": [
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "tracks_removed",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "entries_removed",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "playlists_removed",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "success_reset_subscription_type",
                  "id": 4,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "LockerNotification",
              "fields": [
                {
                  "rule": "required",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bytes",
                  "name": "payload",
                  "id": 2,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "Album",
              "fields": [
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "name",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "album_artist",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "ImageRef",
                  "name": "album_art",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "track_count",
                  "id": 4,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "last_time_played",
                  "id": 5,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "is_compilation",
                  "id": 6,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "album_metajam_id",
                  "id": 7,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "creation_timestamp",
                  "id": 8,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "artist",
                  "id": 9,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "AlbumSortOrder",
              "fields": [
                {
                  "rule": "optional",
                  "type": "AlbumAttribute",
                  "name": "attribute",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "descending",
                  "id": 2,
                  "options": {
                    "default": false
                  }
                }
              ],
              "enums": [
                {
                  "name": "AlbumAttribute",
                  "values": [
                    {
                      "name": "LAST_PLAYED_TIME",
                      "id": 1
                    },
                    {
                      "name": "NAME",
                      "id": 2
                    },
                    {
                      "name": "CREATION_TIME",
                      "id": 3
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetAlbumsRequest",
              "fields": [
                {
                  "rule": "required",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "AlbumSortOrder",
                  "name": "sort_order",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "max_results",
                  "id": 3,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetAlbumsResponse",
              "fields": [
                {
                  "rule": "repeated",
                  "type": "Album",
                  "name": "album",
                  "id": 1,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "Artist",
              "fields": [
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "name",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "total_track_count",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "Album",
                  "name": "album",
                  "id": 3,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "ArtistSortOrder",
              "fields": [
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "descending",
                  "id": 2,
                  "options": {
                    "default": false
                  }
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetArtistsRequest",
              "fields": [
                {
                  "rule": "required",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "ArtistSortOrder",
                  "name": "sort_order",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "max_results",
                  "id": 3,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetArtistsResponse",
              "fields": [
                {
                  "rule": "repeated",
                  "type": "Artist",
                  "name": "artist",
                  "id": 1,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "MusicGenre",
              "fields": [
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "name",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "total_track_count",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "Album",
                  "name": "album",
                  "id": 3,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "GenreSortOrder",
              "fields": [
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "descending",
                  "id": 2,
                  "options": {
                    "default": false
                  }
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetGenresRequest",
              "fields": [
                {
                  "rule": "required",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "GenreSortOrder",
                  "name": "sort_order",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "max_results",
                  "id": 3,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetGenresResponse",
              "fields": [
                {
                  "rule": "repeated",
                  "type": "MusicGenre",
                  "name": "genre",
                  "id": 1,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetDynamicPlaylistEntriesRequest",
              "fields": [
                {
                  "rule": "required",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "required",
                  "type": "DynamicPlaylistEntriesType",
                  "name": "playlist_entries_type",
                  "id": 4,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "max_results",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "continuation_token",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "bool",
                  "name": "include_all_track_metadata",
                  "id": 5,
                  "options": {
                    "default": false
                  }
                }
              ],
              "enums": [
                {
                  "name": "DynamicPlaylistEntriesType",
                  "values": [
                    {
                      "name": "PURCHASED",
                      "id": 1
                    },
                    {
                      "name": "THUMBS_UP",
                      "id": 2
                    },
                    {
                      "name": "RECENTLY_ADDED",
                      "id": 3
                    },
                    {
                      "name": "PROMOTED",
                      "id": 4
                    },
                    {
                      "name": "PROMOTED_AND_PURCHASED",
                      "id": 5
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetDynamicPlaylistEntriesResponse",
              "fields": [
                {
                  "rule": "required",
                  "type": "ResponseCode",
                  "name": "response_code",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "PlaylistEntry",
                  "name": "playlist_entry",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "estimated_total_results",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "continuation_token",
                  "id": 4,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "DynamicPlaylistEntriesType",
                  "name": "playlist_entries_type",
                  "id": 5,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "DynamicPlaylistEntriesType",
                  "values": [
                    {
                      "name": "PURCHASED",
                      "id": 1
                    },
                    {
                      "name": "THUMBS_UP",
                      "id": 2
                    },
                    {
                      "name": "RECENTLY_ADDED",
                      "id": 3
                    },
                    {
                      "name": "PROMOTED",
                      "id": 4
                    },
                    {
                      "name": "UNKNOWN",
                      "id": 5
                    },
                    {
                      "name": "PROMOTED_AND_PURCHASED",
                      "id": 6
                    }
                  ],
                  "options": {}
                },
                {
                  "name": "ResponseCode",
                  "values": [
                    {
                      "name": "OK",
                      "id": 1
                    },
                    {
                      "name": "NOT_OK",
                      "id": 2
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetAggregationsByTrackTypeRequest",
              "fields": [
                {
                  "rule": "required",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "TrackTypeAggregate",
              "fields": [
                {
                  "rule": "optional",
                  "type": "TrackType",
                  "name": "track_type_value",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "count",
                  "id": 2,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "TrackType",
                  "values": [
                    {
                      "name": "MATCHED_TRACK",
                      "id": 1
                    },
                    {
                      "name": "UNMATCHED_TRACK",
                      "id": 2
                    },
                    {
                      "name": "LOCAL_TRACK",
                      "id": 3
                    },
                    {
                      "name": "PURCHASED_TRACK",
                      "id": 4
                    },
                    {
                      "name": "METADATA_ONLY_MATCHED_TRACK",
                      "id": 5
                    },
                    {
                      "name": "PROMO_TRACK",
                      "id": 6
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetAggregationsByTrackTypeResponse",
              "fields": [
                {
                  "rule": "repeated",
                  "type": "TrackTypeAggregate",
                  "name": "track_type_aggregate",
                  "id": 1,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetAggregationsByAvailabilityStatusRequest",
              "fields": [
                {
                  "rule": "required",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "AvailabilityStatusAggregate",
              "fields": [
                {
                  "rule": "optional",
                  "type": "AvailabilityStatus",
                  "name": "availability_status",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "count",
                  "id": 2,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "AvailabilityStatus",
                  "values": [
                    {
                      "name": "PENDING",
                      "id": 1
                    },
                    {
                      "name": "MATCHED",
                      "id": 2
                    },
                    {
                      "name": "UPLOAD_REQUESTED",
                      "id": 3
                    },
                    {
                      "name": "AVAILABLE",
                      "id": 4
                    },
                    {
                      "name": "FORCE_REUPLOAD",
                      "id": 5
                    },
                    {
                      "name": "UPLOAD_PERMANENTLY_FAILED",
                      "id": 6
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetAggregationsByAvailabilityStatusResponse",
              "fields": [
                {
                  "rule": "repeated",
                  "type": "AvailabilityStatusAggregate",
                  "name": "availability_status_aggregate",
                  "id": 1,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "AddPromoTracksRequest",
              "fields": [
                {
                  "rule": "required",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "repeated",
                  "type": "string",
                  "name": "genre",
                  "id": 2,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "AddPromoTracksResponse",
              "fields": [
                {
                  "rule": "repeated",
                  "type": "Track",
                  "name": "track",
                  "id": 1,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetPlaylistAggregationsRequest",
              "fields": [
                {
                  "rule": "required",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int32",
                  "name": "max_results",
                  "id": 2,
                  "options": {
                    "default": 14
                  }
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "PlaylistAggregate",
              "fields": [
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "playlist_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "name",
                  "id": 2,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "ImageRef",
                  "name": "album_art",
                  "id": 3,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "track_count",
                  "id": 4,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "last_time_played",
                  "id": 5,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "GetPlaylistAggregationsResponse",
              "fields": [
                {
                  "rule": "repeated",
                  "type": "PlaylistAggregate",
                  "name": "playlist_aggregate",
                  "id": 1,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "RemoteControlCommandRequest",
              "fields": [
                {
                  "rule": "optional",
                  "type": "int64",
                  "name": "gaia_id",
                  "id": 1,
                  "options": {}
                },
                {
                  "rule": "optional",
                  "type": "string",
                  "name": "command",
                  "id": 2,
                  "options": {}
                }
              ],
              "enums": [],
              "messages": [],
              "options": {}
            },
            {
              "name": "RemoteControlCommandResponse",
              "fields": [
                {
                  "rule": "optional",
                  "type": "ResponseCode",
                  "name": "response_code",
                  "id": 1,
                  "options": {}
                }
              ],
              "enums": [
                {
                  "name": "ResponseCode",
                  "values": [
                    {
                      "name": "OK",
                      "id": 1
                    },
                    {
                      "name": "NO_PUBLISHER",
                      "id": 2
                    },
                    {
                      "name": "INVALID_REQUEST",
                      "id": 3
                    },
                    {
                      "name": "PUBLISH_ERROR",
                      "id": 4
                    }
                  ],
                  "options": {}
                }
              ],
              "messages": [],
              "options": {}
            }
          ],
          "enums": [],
          "imports": [
            {
              "package": null,
              "messages": [
                {
                  "name": "ProductId",
                  "fields": [
                    {
                      "rule": "required",
                      "type": "Type",
                      "name": "type",
                      "id": 1,
                      "options": {}
                    },
                    {
                      "rule": "optional",
                      "type": "bool",
                      "name": "completed",
                      "id": 2,
                      "options": {
                        "default": false
                      }
                    },
                    {
                      "rule": "required",
                      "type": "string",
                      "name": "id",
                      "id": 3,
                      "options": {}
                    }
                  ],
                  "enums": [
                    {
                      "name": "Type",
                      "values": [
                        {
                          "name": "UPC",
                          "id": 1
                        },
                        {
                          "name": "GRID",
                          "id": 2
                        }
                      ],
                      "options": {}
                    }
                  ],
                  "messages": [],
                  "options": {}
                },
                {
                  "name": "AssetId",
                  "fields": [
                    {
                      "rule": "required",
                      "type": "Type",
                      "name": "type",
                      "id": 1,
                      "options": {}
                    },
                    {
                      "rule": "required",
                      "type": "string",
                      "name": "id",
                      "id": 2,
                      "options": {}
                    }
                  ],
                  "enums": [
                    {
                      "name": "Type",
                      "values": [
                        {
                          "name": "ISRC",
                          "id": 1
                        }
                      ],
                      "options": {}
                    }
                  ],
                  "messages": [],
                  "options": {}
                },
                {
                  "name": "TransactionId",
                  "fields": [
                    {
                      "rule": "required",
                      "type": "string",
                      "name": "version",
                      "id": 1,
                      "options": {
                        "default": "1"
                      }
                    },
                    {
                      "rule": "required",
                      "type": "string",
                      "name": "id",
                      "id": 2,
                      "options": {}
                    }
                  ],
                  "enums": [],
                  "messages": [],
                  "options": {}
                },
                {
                  "name": "MediaId",
                  "fields": [
                    {
                      "rule": "required",
                      "type": "AlgorithmType",
                      "name": "algorithm_type",
                      "id": 1,
                      "options": {}
                    },
                    {
                      "rule": "required",
                      "type": "string",
                      "name": "hash",
                      "id": 2,
                      "options": {}
                    }
                  ],
                  "enums": [
                    {
                      "name": "AlgorithmType",
                      "values": [
                        {
                          "name": "SHA256",
                          "id": 1
                        }
                      ],
                      "options": {}
                    }
                  ],
                  "messages": [],
                  "options": {}
                },
                {
                  "name": "UrlInfo",
                  "fields": [
                    {
                      "rule": "required",
                      "type": "Type",
                      "name": "type",
                      "id": 1,
                      "options": {}
                    },
                    {
                      "rule": "required",
                      "type": "string",
                      "name": "url",
                      "id": 2,
                      "options": {}
                    }
                  ],
                  "enums": [
                    {
                      "name": "Type",
                      "values": [
                        {
                          "name": "WCOM",
                          "id": 1
                        },
                        {
                          "name": "WCOP",
                          "id": 2
                        },
                        {
                          "name": "WOAF",
                          "id": 3
                        },
                        {
                          "name": "WOAR",
                          "id": 4
                        },
                        {
                          "name": "WOAS",
                          "id": 5
                        },
                        {
                          "name": "WORS",
                          "id": 6
                        },
                        {
                          "name": "WPAY",
                          "id": 7
                        },
                        {
                          "name": "WPUB",
                          "id": 8
                        }
                      ],
                      "options": {}
                    }
                  ],
                  "messages": [],
                  "options": {}
                },
                {
                  "name": "CopyrightStatus",
                  "fields": [
                    {
                      "rule": "required",
                      "type": "Type",
                      "name": "type",
                      "id": 1,
                      "options": {}
                    },
                    {
                      "rule": "optional",
                      "type": "string",
                      "name": "copyright",
                      "id": 2,
                      "options": {}
                    }
                  ],
                  "enums": [
                    {
                      "name": "Type",
                      "values": [
                        {
                          "name": "UNSPECIFIED",
                          "id": 1
                        },
                        {
                          "name": "ALLRIGHTSRESERVED",
                          "id": 2
                        },
                        {
                          "name": "PRERELEASE",
                          "id": 3
                        },
                        {
                          "name": "OTHER",
                          "id": 4
                        }
                      ],
                      "options": {}
                    }
                  ],
                  "messages": [],
                  "options": {}
                },
                {
                  "name": "Extra",
                  "fields": [
                    {
                      "rule": "required",
                      "type": "string",
                      "name": "type",
                      "id": 1,
                      "options": {}
                    },
                    {
                      "rule": "required",
                      "type": "string",
                      "name": "value",
                      "id": 2,
                      "options": {}
                    }
                  ],
                  "enums": [],
                  "messages": [],
                  "options": {}
                },
                {
                  "name": "UitsMetadata",
                  "fields": [
                    {
                      "rule": "required",
                      "type": "string",
                      "name": "nonce",
                      "id": 1,
                      "options": {}
                    },
                    {
                      "rule": "required",
                      "type": "string",
                      "name": "distributor_id",
                      "id": 2,
                      "options": {}
                    },
                    {
                      "rule": "required",
                      "type": "string",
                      "name": "transaction_date",
                      "id": 3,
                      "options": {}
                    },
                    {
                      "rule": "required",
                      "type": "ProductId",
                      "name": "product_id",
                      "id": 4,
                      "options": {}
                    },
                    {
                      "rule": "required",
                      "type": "AssetId",
                      "name": "asset_id",
                      "id": 5,
                      "options": {}
                    },
                    {
                      "rule": "required",
                      "type": "TransactionId",
                      "name": "transaction_id",
                      "id": 6,
                      "options": {}
                    },
                    {
                      "rule": "required",
                      "type": "MediaId",
                      "name": "media_id",
                      "id": 7,
                      "options": {}
                    },
                    {
                      "rule": "optional",
                      "type": "UrlInfo",
                      "name": "url_info",
                      "id": 8,
                      "options": {}
                    },
                    {
                      "rule": "optional",
                      "type": "ParentalAdvisoryType",
                      "name": "parental_advisory_type",
                      "id": 9,
                      "options": {}
                    },
                    {
                      "rule": "optional",
                      "type": "CopyrightStatus",
                      "name": "copyright_status",
                      "id": 10,
                      "options": {}
                    },
                    {
                      "rule": "repeated",
                      "type": "Extra",
                      "name": "extra",
                      "id": 11,
                      "options": {}
                    }
                  ],
                  "enums": [
                    {
                      "name": "ParentalAdvisoryType",
                      "values": [
                        {
                          "name": "UNSPECIFIED",
                          "id": 1
                        },
                        {
                          "name": "EXPLICIT",
                          "id": 2
                        },
                        {
                          "name": "EDITED",
                          "id": 3
                        }
                      ],
                      "options": {}
                    }
                  ],
                  "messages": [],
                  "options": {}
                },
                {
                  "name": "UitsSignature",
                  "fields": [
                    {
                      "rule": "required",
                      "type": "AlgorithmType",
                      "name": "algorithm_type",
                      "id": 1,
                      "options": {}
                    },
                    {
                      "rule": "required",
                      "type": "CanonicalizationType",
                      "name": "canonicalization_type",
                      "id": 2,
                      "options": {}
                    },
                    {
                      "rule": "required",
                      "type": "string",
                      "name": "key_id",
                      "id": 3,
                      "options": {}
                    },
                    {
                      "rule": "required",
                      "type": "string",
                      "name": "value",
                      "id": 4,
                      "options": {}
                    }
                  ],
                  "enums": [
                    {
                      "name": "AlgorithmType",
                      "values": [
                        {
                          "name": "RSA2048",
                          "id": 1
                        },
                        {
                          "name": "DSA2048",
                          "id": 2
                        }
                      ],
                      "options": {}
                    },
                    {
                      "name": "CanonicalizationType",
                      "values": [
                        {
                          "name": "NONE",
                          "id": 1
                        }
                      ],
                      "options": {}
                    }
                  ],
                  "messages": [],
                  "options": {}
                },
                {
                  "name": "Uits",
                  "fields": [
                    {
                      "rule": "required",
                      "type": "UitsMetadata",
                      "name": "metadata",
                      "id": 1,
                      "options": {}
                    },
                    {
                      "rule": "required",
                      "type": "UitsSignature",
                      "name": "signature",
                      "id": 2,
                      "options": {}
                    }
                  ],
                  "enums": [],
                  "messages": [],
                  "options": {}
                }
              ],
              "enums": [],
              "imports": [],
              "options": {},
              "services": []
            }
          ],
          "options": {},
          "services": []
        }
      ],
      "options": {},
      "services": []
    }).build();
    
    var music = dcodeIO.ProtoBuf.newBuilder().import({
      "package": null,
      "messages": [
        {
          "name": "GetTracksToExportRequest",
          "fields": [
            {
              "rule": "required",
              "type": "string",
              "name": "client_id",
              "id": 2,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "continuation_token",
              "id": 3,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "TracksToExportType",
              "name": "export_type",
              "id": 4,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "int64",
              "name": "updated_min",
              "id": 5,
              "options": {}
            }
          ],
          "enums": [
            {
              "name": "TracksToExportType",
              "values": [
                {
                  "name": "ALL",
                  "id": 1
                },
                {
                  "name": "PURCHASED_AND_PROMOTIONAL",
                  "id": 2
                }
              ],
              "options": {}
            }
          ],
          "messages": [],
          "options": {}
        },
        {
          "name": "DownloadTrackInfo",
          "fields": [
            {
              "rule": "optional",
              "type": "string",
              "name": "id",
              "id": 1,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "title",
              "id": 2,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "album",
              "id": 3,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "album_artist",
              "id": 4,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "artist",
              "id": 5,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "int32",
              "name": "track_number",
              "id": 6,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "int64",
              "name": "track_size",
              "id": 7,
              "options": {}
            }
          ],
          "enums": [],
          "messages": [],
          "options": {}
        },
        {
          "name": "GetTracksToExportResponse",
          "fields": [
            {
              "rule": "required",
              "type": "TracksToExportStatus",
              "name": "status",
              "id": 1,
              "options": {}
            },
            {
              "rule": "repeated",
              "type": "DownloadTrackInfo",
              "name": "download_track_info",
              "id": 2,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "string",
              "name": "continuation_token",
              "id": 3,
              "options": {}
            },
            {
              "rule": "optional",
              "type": "int64",
              "name": "updated_min",
              "id": 4,
              "options": {}
            }
          ],
          "enums": [
            {
              "name": "TracksToExportStatus",
              "values": [
                {
                  "name": "OK",
                  "id": 1
                },
                {
                  "name": "TRANSIENT_ERROR",
                  "id": 2
                },
                {
                  "name": "MAX_NUM_CLIENTS_REACHED",
                  "id": 3
                },
                {
                  "name": "UNABLE_TO_AUTHENTICATE_CLIENT",
                  "id": 4
                },
                {
                  "name": "UNABLE_TO_REGISTER_CLIENT",
                  "id": 5
                }
              ],
              "options": {}
            }
          ],
          "messages": [],
          "options": {}
        }
      ],
      "enums": [],
      "imports": [],
      "options": {},
      "services": []
    }).build();
    
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
    
    var tagmap = (function () {
      
      function id(x) { return x }
      function attrgetter(name, f) { return function (x) { return f(x[name]) } }
      function parseYear(s) { return parseInt(s.slice(0,4)) }
      function stripNull(x) { return x.replace(/\0$/, '') }
      
      function cut(i) {
        return function (x) {
          var y = parseInt(x.split('/')[i]);
          return isNaN(y) ? undefined : y;
        }
      }
      
      return {
        /* TIT2 */ "title": { "title": stripNull },
        /* TALB */ "album": { "album": stripNull },
        /* TPE1 */ "artist": { "artist": stripNull },
        /* TPE2 */ "albumArtist": { "album_artist": stripNull },
        /* TCOM */ "composer": { "composer": stripNull },
        /* TCON */ "genre": { "genre": stripNull },
        /* PCNT */ "playCount": { "play_count": parseInt },
        /* TCMP */ "compilation": { "compilation": Boolean },
        /* TBPM */ "tempo": { "beats_per_minute": parseInt },
        /* TYER */ "year": { "year": parseInt },
        /* TDRL */ "releaseTime": { "year": parseYear },
        /* TDRC */ "recordingTime": { "year": parseYear },
        /* COMM */ "comments": {
          "comment": function (x) {
            if (Array.isArray(x)) { x = x[0] || {}; }
            return stripNull(x.value || "");
          },
        },
        /* TRCK */ "trackNumber": {
          "track_number": cut(0),
          "total_track_count": cut(1),
        },
        /* TPOS */ "diskNumber": {
          "disc_number": cut(0),
          "total_disc_count": cut(1),
        },
        /* APIC */ "coverArt": { "album_art_ref": attrgetter('data', id) },
        /* POPM */ "rating": {
          "play_count": attrgetter('counter', parseInt),
          "rating": function (x) {
            if (x.rating === 0) { return 1; }
            return Math.round(x.rating / 64) + 2;
          },
        },
      };
    })();
    
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
        last_modified_timestamp: Math.round(file.lastModified / 1000),
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
  
  
  var fl = {};
  
  fl.partial = function (/* f, args... */) {
    var f = Array.prototype.shift.call(arguments),
        args = arguments;
    return function (/* arguments... */) {
      Array.prototype.unshift.apply(arguments, args);
      return f.apply(this, arguments);
    }
  }
  
  fl.async = function (f) {
    return function (/* arguments..., callback */) {
      var callback = Array.prototype.pop.call(arguments);
      try {
        callback(null, f.apply(this, arguments));
      } catch (e) {
        callback(e);
      }
    }
  }
  
  fl.async.nextTick = function (func, context, args) {
    setTimeout(Function.prototype.bind.apply(func, [context].concat(args)), 0);
  }
  
  fl.async.id = function (/* arguments..., callback */) {
    var callback = Array.prototype.pop.call(arguments);
    Array.prototype.unshift.call(arguments, null);
    callback.apply(this, arguments);
  }
  
  fl.async.carry = function (/* f, args... */) {
    var f = Array.prototype.shift.call(arguments),
        args = arguments;
    return function (/* err, res... */) {
      Array.prototype.push.apply(arguments, arguments[0] ? [] : args);
      f.apply(this, arguments);
    }
  }
  
  fl.async._compose = function (/* funcs, args..., callback */) {
    var args = Array.prototype.slice.call(arguments),
        funcs = args.shift(),
        callback = args.pop(),
        context = this,
        i = 0;
    function _resume() {
      if (funcs[i]) {
        fl.async.nextTick(funcs[i], context, args.concat(_next));
      } else if (callback) {
        callback.apply(context, [null].concat(args));
      }
    }
    function _next(/* err, res... */) {
      var res = Array.prototype.slice.call(arguments),
          err = res.shift();
      if (err) {
        callback.call(context, err, res.length > 0 ? res[0] : _resume);
      } else {
        ++i;
        args = res;
        _resume();
      }
    }
    _resume();
  }
  
  fl.async._applyToAll = function (/* nargout, limit, f, args..., callback */) {
    var args = Array.prototype.slice.call(arguments),
        nargout = args.shift(),
        limit = args.shift(),
        f = args.shift(),
        callback = args.pop(),
        context = this,
        started = 0,
        finished = 0,
        nargin = args[0].length,
        results = [];
    
    function _resume(k) {
      if (k < nargin) {
        fl.async.nextTick(
          f,
          context,
          args.map(function (col) { return col[k] }).concat(_next.bind(null, k))
        );
      } else if (callback && finished === nargin) {
        callback.apply(context, [null].concat(results));
      }
    }
    function _next(/* k, err, res... */) {
      var res = Array.prototype.slice.call(arguments),
          k = res.shift(),
          err = res.shift();
      if (err) {
        callback.call(context, err, res.length > 0 ? res[0] : _resume.bind(0,k));
      } else {
        res.forEach(function (el,j) { results[j][k] = el; });
        finished++;
        _resume(started++);
      }
    }
    
    for (var j = 0; j < nargout; ++j) {
      results.push([]);
    }
    while (started < nargin && (limit <= 0 || started < limit)) {
      _resume(started++);
    }
    if (nargin === 0) {
      _resume(0);
    }
  }
  
  fl.async._condition = function (/* f, g, h, args..., callback */) {
    var args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        funcs = {},
        context = this,
        state = undefined,
        result = undefined;
    funcs[undefined] = args.shift();
    funcs[true] = args.shift();
    funcs[false] = args.shift();
    function _resume() {
      if (!result) {
        fl.async.nextTick(funcs[state], context, args.concat(_next));
      } else if (callback) {
        callback.apply(context, [null].concat(result));
      }
    }
    function _next(/* err, res... */) {
      var res = Array.prototype.slice.call(arguments),
          err = res.shift();
      if (err) {
        callback.call(context, err, res.length > 0 ? res[0] : _resume);
      } else {
        if (state === undefined) {
          state = Boolean(res[0]);
        } else {
          result = res;
        }
        _resume();
      }
    }
    _resume();
  }
  
  fl.async._whilst = function (/* condition, loop, args..., callback */) {
    var args = Array.prototype.slice.call(arguments),
        condition = args.shift(),
        loop = args.shift(),
        callback = args.pop(),
        context = this,
        state = undefined;
    function _resume() {
      if (state === true) {
        fl.async.nextTick(loop, context, args.concat(_next));
      } else if (state === undefined) {
        fl.async.nextTick(condition, context, args.concat(_next));
      } else if (state === false && callback) {
        callback.apply(context, [null].concat(args));
      }
    }
    function _next(/* err, res... */) {
      var res = Array.prototype.slice.call(arguments),
          err = res.shift();
      if (err) {
        callback.call(context, err, res.length > 0 ? res[0] : _resume);
      } else {
        if (state === undefined) {
          state = Boolean(res[0]);
        } else {
          args = res;
          state = undefined;
        }
        _resume();
      }
    }
    _resume();
  }
  
  fl.async.compose = function (/* funcs */) {
    return fl.partial(fl.async._compose, arguments);
  }
  
  fl.async.applyToAll = function (nargout, limit, f) {
    return fl.partial(fl.async._applyToAll, nargout, limit, f);
  }
  
  fl.async.condition = function (f, g, h) {
    return fl.partial(fl.async._condition, f, g, h);
  }
  
  fl.async.whilst = function (condition, loop) {
    return fl.partial(fl.async._whilst, condition, loop);
  }
  
  fl.async.doWhilst = function (condition, loop) {
    return fl.async.compose(loop, fl.async.whilst(condition, loop));
  }
  
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
  
  function Client(id, token) {
    this.id = id;
    this.token = token;
  }
  
  Client._wrapper = function (task) {
    return function (/* arguments... */) {
      Array.prototype.unshift.call(arguments, task, this.token, this.id);
      var operation = Object.create(Operation.prototype);
      Operation.apply(operation, arguments);
      return operation;
    }
  }
  
  Client.prototype.register = Client._wrapper(Operation.Register);
  Client.prototype.upload = Client._wrapper(Operation.Upload);
  
  this.protocol = protocol;
  this.Client = Client;
})();
