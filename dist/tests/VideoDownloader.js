'use strict';
exports.__esModule = true;
//import { test, expect } from 'jest';
var VideoDownloader_1 = require("../lib/classes/VideoDownloader");
test('should convert Vimeo url to embedded url', function () {
    var downloader = new VideoDownloader_1["default"]({});
    var convertedUrl = downloader.convertVideoUrlToEmbeddedUrl('https://vimeo.com/123456789');
    expect('a').toBe('b');
});
