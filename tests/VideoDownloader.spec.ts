'use strict';

//import { test, expect } from 'jest';

import VideoDownloader from '../lib/classes/VideoDownloader'

describe('VideoDownloader', () => {
  const downloader = new VideoDownloader({})
  test('should convert Vimeo url to embedded url', () => {
    const convertedUrl = downloader.convertVideoUrlToEmbeddedUrl('https://vimeo.com/123456789')
    expect(convertedUrl).toBe('https://player.vimeo.com/video/123456789')
  })

  test('should return same url if it is already an embedded url', () => {
    const convertedUrl = downloader.convertVideoUrlToEmbeddedUrl('https://player.vimeo.com/video/123456789')
    expect(convertedUrl).toBe('https://player.vimeo.com/video/123456789')
  })

  test('should throw if url is malformed', () => {
    expect(() => {
      downloader.convertVideoUrlToEmbeddedUrl('https://youtube.com/bad/url')
    }).toThrowError('Cannot convert url')
  })
})
