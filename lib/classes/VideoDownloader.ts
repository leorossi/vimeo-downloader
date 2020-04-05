'use strict'
import axios from 'axios'
import * as fs from 'fs'
import * as get from 'lodash.get'
import * as ProgressBar from 'progress'
import { promisify } from 'util'

const DEFAULT_QUALITY = 720

const stat = promisify(fs.stat).bind(fs)

interface HeadersProps {
  referer: string
}

interface VideoDownloaderProps {
  referer?: string
  quality?: number
}
export default class VideoDownloader {
  private referer: string
  private quality: number

  constructor(opts: VideoDownloaderProps) {
    this.referer = opts.referer
    this.quality = opts.quality || DEFAULT_QUALITY
  }


  buildHeaders(): HeadersProps  {
    return {
      referer: this.referer
    }
  }

  async download(videoUrl: string, targetFile: string, targetDirectory: string, force: boolean = false) {
    const realVideoUrl = await this.getVideoData(videoUrl)
    return new Promise(async (resolve, reject) => {
      axios({
        method: "get",
        url: realVideoUrl,
        headers: this.buildHeaders(),
        responseType: "stream"
      })
        .then(async(response) => {
          const extension = response.headers['content-type'].split('/')[1]
          const fullTargetFile = `${targetFile}.${extension}`
          const fullTargetPath = `${targetDirectory}/${fullTargetFile}`;
          const expectedLength = response.headers['content-length'];
          // check if file is already downloaded
          if (force || await this.shouldDownload(fullTargetPath, expectedLength)) {
            const progressBar = new ProgressBar(` -> ${fullTargetFile} [:bar] :percent :etas :rate`, {
              width: 40,
              complete: '=',
              incomplete: ' ',
              renderThrottle: 1,
              total: parseInt(expectedLength)
            });
            const ws = fs.createWriteStream(fullTargetPath);
            response.data.on('data', (data) => {
              progressBar.tick(data.length)
            })
            response.data.pipe(ws);
            ws.on('finish', () => {
              return resolve();
            })
          } else {
            // should not download
            console.log('Skipping ' + fullTargetFile);
            return resolve()
          }
        })
        .catch((err) => {
          console.log(`ERROR: ${err.message}`);
          return reject(err);
        })
    })
  }
  private async shouldDownload(filePath: string, expectedLength: number): Promise<Boolean> {
    try {
      const fileData = await stat(filePath);
      if (fileData.size == expectedLength) {
        return false
      }
      return true
    } catch (error) {
      return true
    }
  }

  private async getPage(url: string): Promise<string> {
    const response = await axios({
      method: "get",
      url: url,
      headers: this.buildHeaders(),
    })
    return response.data
  }
  private async getVideoData(videoUrl: string): Promise<string> {
    try {
      const response = await this.getPage(videoUrl);
      console.log(response);
      const match = response.match(/var config = (\{(.*)\})\; if/);
      if (match) {
        const parsed = JSON.parse(match[1]);
        let urls = get(parsed, 'request.files.progressive')
        if (urls) {
          let maxQuality = 0;
          let candidate = null;
          urls.forEach((url) => {
            if (url.height > maxQuality) {
              if (url.height <= this.quality) {
                maxQuality = url.height;
                candidate = url.url;
              }
            }
          });
          if (candidate !== null) {
            return candidate
          }
        } else {
          throw new Error('cannot find urls');
        }
      }
    } catch (error) {
      throw error;
    }
  }
  public convertVideoUrlToEmbeddedUrl(videoUrl: string): string {
    if (videoUrl.match(/https:\/\/player\.vimeo\.com\/video\/\d+/)) {
      return videoUrl
    }
    const match = videoUrl.match(/https:\/\/vimeo\.com\/(\d+)/)
    if (match) {
      return `https://player.vimeo.com/video/${match[1]}`
    } else {
      throw new Error('Cannot convert url ' + videoUrl)
    }
  }
}

