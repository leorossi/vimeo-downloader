# Vimeo Downloader

This module will help users to download Vimeo video on your host machine. 

It works also with _private_ videos. Vimeo just check fot `Referer` header in the http request to show the video.

Please consider that this software is in BETA, not ready for production.

**Please note that this library should not be used for illegal purposes. Download only videos you have the permission to watch**

## Installation

```
$ npm install && npm run build
```

## Run tests

```
$ npm test
```

## Usage

```
import VideoDownloader from 'vimeo-downloader'

async function run() {
  const vd = new VideoDownloader({
    quality: DESIDERED_MAX_QUALITY //default 720p
    referer: 'https://your.ref/for/private/videos'
  })

  await vd.download(YOUR_VIDEO_URL, 'TargetFileName', __dirname)
}

run()
```