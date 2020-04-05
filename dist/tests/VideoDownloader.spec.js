'use strict';
exports.__esModule = true;
//import { test, expect } from 'jest';
var VideoDownloader_1 = require("../lib/classes/VideoDownloader");
describe('VideoDownloader', function () {
    var downloader = new VideoDownloader_1["default"]({});
    test('should convert Vimeo url to embedded url', function () {
        var convertedUrl = downloader.convertVideoUrlToEmbeddedUrl('https://vimeo.com/123456789');
        expect(convertedUrl).toBe('https://player.vimeo.com/video/123456789');
    });
    test('should return same url if it is already an embedded url', function () {
        var convertedUrl = downloader.convertVideoUrlToEmbeddedUrl('https://player.vimeo.com/video/123456789');
        expect(convertedUrl).toBe('https://player.vimeo.com/video/123456789');
    });
    test('should throw if url is malformed', function () {
        expect(function () {
            downloader.convertVideoUrlToEmbeddedUrl('https://youtube.com/bad/url');
        }).toThrowError('Cannot convert url');
    });
});
