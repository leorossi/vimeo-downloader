'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios_1 = require("axios");
var fs = require("fs");
var get = require("lodash.get");
var ProgressBar = require("progress");
var util_1 = require("util");
var DEFAULT_QUALITY = 720;
var stat = util_1.promisify(fs.stat).bind(fs);
var VideoDownloader = /** @class */ (function () {
    function VideoDownloader(opts) {
        this.referer = opts.referer;
        this.quality = opts.quality || DEFAULT_QUALITY;
    }
    VideoDownloader.prototype.buildHeaders = function () {
        return {
            referer: this.referer
        };
    };
    VideoDownloader.prototype.download = function (videoUrl, targetFile, targetDirectory, force) {
        if (force === void 0) { force = false; }
        return __awaiter(this, void 0, void 0, function () {
            var realVideoUrl;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getVideoData(videoUrl)];
                    case 1:
                        realVideoUrl = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    axios_1["default"]({
                                        method: "get",
                                        url: realVideoUrl,
                                        headers: this.buildHeaders(),
                                        responseType: "stream"
                                    })
                                        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                                        var extension, fullTargetFile, fullTargetPath, expectedLength, _a, progressBar_1, ws;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    extension = response.headers['content-type'].split('/')[1];
                                                    fullTargetFile = targetFile + "." + extension;
                                                    fullTargetPath = targetDirectory + "/" + fullTargetFile;
                                                    expectedLength = response.headers['content-length'];
                                                    _a = force;
                                                    if (_a) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, this.shouldDownload(fullTargetPath, expectedLength)];
                                                case 1:
                                                    _a = (_b.sent());
                                                    _b.label = 2;
                                                case 2:
                                                    // check if file is already downloaded
                                                    if (_a) {
                                                        progressBar_1 = new ProgressBar(" -> " + fullTargetFile + " [:bar] :percent :etas :rate", {
                                                            width: 40,
                                                            complete: '=',
                                                            incomplete: ' ',
                                                            renderThrottle: 1,
                                                            total: parseInt(expectedLength)
                                                        });
                                                        ws = fs.createWriteStream(fullTargetPath);
                                                        response.data.on('data', function (data) {
                                                            progressBar_1.tick(data.length);
                                                        });
                                                        response.data.pipe(ws);
                                                        ws.on('finish', function () {
                                                            return resolve();
                                                        });
                                                    }
                                                    else {
                                                        // should not download
                                                        console.log('Skipping ' + fullTargetFile);
                                                        return [2 /*return*/, resolve()];
                                                    }
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); })["catch"](function (err) {
                                        console.log("ERROR: " + err.message);
                                        return reject(err);
                                    });
                                    return [2 /*return*/];
                                });
                            }); })];
                }
            });
        });
    };
    VideoDownloader.prototype.shouldDownload = function (filePath, expectedLength) {
        return __awaiter(this, void 0, void 0, function () {
            var fileData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, stat(filePath)];
                    case 1:
                        fileData = _a.sent();
                        if (fileData.size == expectedLength) {
                            //console.log('Skipping ' + filePath);
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, true];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VideoDownloader.prototype.getPage = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"]({
                            method: "get",
                            url: url,
                            headers: this.buildHeaders()
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    VideoDownloader.prototype.getVideoData = function (videoUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var response, match, parsed, urls, maxQuality_1, candidate_1, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getPage(videoUrl)];
                    case 1:
                        response = _a.sent();
                        console.log(response);
                        match = response.match(/var config = (\{(.*)\})\; if/);
                        if (match) {
                            parsed = JSON.parse(match[1]);
                            urls = get(parsed, 'request.files.progressive');
                            if (urls) {
                                maxQuality_1 = 0;
                                candidate_1 = null;
                                urls.forEach(function (url) {
                                    if (url.height > maxQuality_1) {
                                        if (url.height <= _this.quality) {
                                            maxQuality_1 = url.height;
                                            candidate_1 = url.url;
                                        }
                                    }
                                });
                                if (candidate_1 !== null) {
                                    return [2 /*return*/, candidate_1];
                                }
                            }
                            else {
                                throw new Error('cannot find urls');
                            }
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VideoDownloader.prototype.convertVideoUrlToEmbeddedUrl = function (videoUrl) {
        return '';
    };
    return VideoDownloader;
}());
exports["default"] = VideoDownloader;
