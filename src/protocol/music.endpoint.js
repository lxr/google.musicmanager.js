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
