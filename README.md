# Introduction

Google.musicmanager.js is a clientside JavaScript port of the
[Musicmanager interface] [1] of Simon Weber's [gmusicapi] [2].
It allows uploading songs to Google Play Music libraries in browser
JavaScript.

Note that use of this library likely constitutes a violation of
[Google's Terms of Service] [3], section 2, paragraph 2: "For example,
don't interfere with our Services or try to access them using a method
other than the interface and the instructions that we provide."
Use at your own risk.

For an example project utilizing this library, see the [Google Play
Music Uploader] [4] WebExtension.

# Requirements

Google.musicmanager.js depends on quite a few other JavaScript
libraries:

 - [aurora.js v0.4.2](https://github.com/audiocogs/aurora.js/releases/v0.4.2)
 - [mp3.js v0.1.0](https://github.com/audiocogs/mp3.js/releases/v0.1.0)
 - [Long.js v2.0.0+](https://github.com/dcodeIO/Long.js/releases/2.0.0)
 - [ByteBuffer.js v3.2.0+](https://github.com/dcodeIO/ByteBuffer.js/releases/3.2.0)
 - [ProtoBuf.js v3.3.0+](https://github.com/dcodeIO/ProtoBuf.js/releases/3.3.0)

It also needs to be able to make cross-domain requests to the following
address spaces:

 - https://android.clients.google.com/upsj/*
 - https://uploadsj.clients.google.com/uploadsj/rupio
 - https://music.google.com/music/*

You also need a valid Google OAuth 2.0 token with a scope of
`https://www.googleapis.com/auth/musicmanager`.  This API need not be
activated in the Google Developers Console (in fact, it's not even
listed there).

# Usage

```html
<script src="Long.js"></script>
<script src="ByteBufferAB.js"></script>
<script src="ProtoBuf.js"></script>
<script src="aurora.js"></script>
<script src="mp3.js"></script>
<script src="google.musicmanager.js"></script>

<script>

var mm = google.musicmanager;
var client = new mm.Client("client id", "OAuth2.0 token");
var register = client.register("client name");
register.on("error", failure_callback);
register.on("end", success_callback);
register.start();

// with a successfully registered client
var upload = client.upload(filelist);
upload.on("error", failure_callback);
upload.on("progress", progress_callback);
upload.on("end", success_callback);
upload.start();

</script>
```

A complete API reference is still available on [Google Code] [5].

# Bugs

Google Play Music requires all songs to be uploaded in MP3 format.
Until someone writes a pure-Javascript MP3 transcoding library,
google.musicmanager.js can only upload MP3 files.  For much the
same reason, google.musicmanager.js can't match songs, as it has no
way of extracting 128kbps samples from its input files.

Google.musicmanager.js relies on mp3.js to do its MP3 parsing,
and it's not perfect.  Notably, if the file contains encoding errors
or too much metadata at its start, mp3.js throws an asynchronous
(and thus uncatchable) `AV.UnderflowError`. mp3.js also reports the
bitrate of VBR files as simply the bitrate of the first frame it
encounters, so google.musicmanager.js opts not to report the
bitrate at all in order not to lie to the user.

Google.musicmanager.js can parse album art, but can't upload it.

Google.musicmanager.js does not offer a high-level interface for
listing or downloading songs.  Though both are possible through the
low-level interfaces, the latter is particularly bothersome: a
request for a download link is rejected if it is sent with the
`sjsaid` cookie, and `XMLHttpRequest` defaults to sending all cookies
with every request.  Browser-specific hacks are needed to suppress
this behavior.

[1]: https://unofficial-google-music-api.readthedocs.org/en/latest/reference/musicmanager.html
[2]: https://github.com/simon-weber/gmusicapi
[3]: https://www.google.com/intl/en/policies/terms/
[4]: https://github.com/lxr/Google-Play-Music-Uploader
[5]: https://code.google.com/p/google-musicmanager-js/wiki/INTRO
