
var _cache = {};
_cache.init = function () {
    if (typeof (this.memory) == 'undefined')
        this.memory = {};
};
_cache.set = function (key, value) {
    this.memory[key] = value;
};
_cache.get = function (key) {
    //if(console)
    //{
    //    console.log("memory: ");
    //    console.log(_cache.memory);

    //    console.log("key: "+key);
    //    console.log(_cache.memory[key]);
    //}

    if (typeof (_cache.memory[key]) != 'undefined') {
        if (_cache.memory[key] != null) {
            return _cache.memory[key];
        }
    }

    return false;
};
_cache.clear = function ()
{
    this.memory = {};
}
_cache.init();

function clearCache() {
    _cache.clear();
}

var nextRequestId = 0;

var jsonDbRequestPath = "/Handler/JsonDb.ashx";
function haveSQLiteDatabase(dbName, msgId, successCallback, cacheResult)
{
    if (typeof (cacheResult) == "undefined") cacheResult = false;
    var key = dbName;
    var result = _cache.get(key);
    if (result == false) {
        var paramValues = '{';
        paramValues += '"dbName" : "' + dbName + '"';
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "HaveSQLiteDatabase",
            params: paramValues
        };

        asyncJsonRequest(jsonDbRequestPath, request, msgId,
            function (response) {
                var haveResult = false;
                if (response.hasOwnProperty('Result') === true) {
                    var retResult = response.Result;
                    if (retResult.hasOwnProperty('message') === true) {
                        if (cacheResult) {
                            _cache.set(key, dbName);
                        }
                        else {
                            _cache.set(key, null);
                        }
                        if (typeof (successCallback) === "function") successCallback();
                        haveResult = true;
                    }
                    else if (retResult.hasOwnProperty('error') === true) {
                        var retError = retResult.error;
                        showError(retError, msgId);
                    }
                }

                if (haveResult === false) {
                    showError("No Databases Found", msgId);
                }
            });
    }
    else {
        if (typeof (successCallback) === "function") successCallback();
    }
}

function doSQLExecute(dbName, sqlMethod, sqlStatement, msgId, successCallback, cacheResult)
{
    if (typeof (cacheResult) == "undefined") cacheResult = false;
    //if (sqlMethod == "DoUpdate") cacheResult = false;
    //if (sqlMethod == "DoInsert") cacheResult = false;
    //if (sqlMethod == "DoDelete") cacheResult = false;
    var key = dbName + sqlMethod + sqlStatement;
    var result = _cache.get(key);
    if (result == false) {
        var paramValues = '{';
        paramValues += '"dbName" : "' + dbName + '"';
        paramValues += ', "sqlStatement" : "' + sqlStatement + '"';
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: sqlMethod,
            params: paramValues
        };

        asyncJsonRequest(jsonDbRequestPath, request, msgId,
            function (response) {
                var haveResult = false;
                var haveError = false;
                if (response.hasOwnProperty('Result') === true) {
                    var retResult = response.Result;
                    if (retResult.hasOwnProperty('data') === true) {
                        var retData = retResult.data;
                        if (cacheResult) {
                            _cache.set(key, retData);
                        }
                        else {
                            _cache.set(key, null);
                        }
                        if (typeof (successCallback) === "function") successCallback(retData);
                        haveResult = true;
                    }
                    else if (retResult.hasOwnProperty('error') === true) {
                        var retError = retResult.error;
                        showError(retError, msgId);
                        haveError = true;
                    }
                }

                if ((haveResult === false) && (haveError == false)) {
                    showError("No data Found", msgId);
                }

            });
    } else {
        if (typeof (successCallback) === "function") successCallback(result);
    }
}

function doSQLSelectPaged(dbName, sqlStatement, pageNo, itemsPerPage, msgId, successCallback, cacheResult) {
    if (typeof (cacheResult) == "undefined") cacheResult = false;
    //if (sqlMethod == "DoUpdate") cacheResult = false;
    //if (sqlMethod == "DoInsert") cacheResult = false;
    //if (sqlMethod == "DoDelete") cacheResult = false;
    var key = dbName + "DoSelectPaged" + sqlStatement + pageNo + itemsPerPage;
    var result = _cache.get(key);
    if (result == false) {
        var paramValues = '{';
        paramValues += '"dbName" : "' + dbName + '"';
        paramValues += ', "sqlStatement" : "' + sqlStatement + '"';
        paramValues += ', "pageNo" : ' + pageNo ;
        paramValues += ', "itemsPerPage" : ' + itemsPerPage;
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "DoSelectPaged",
            params: paramValues
        };

        asyncJsonRequest(jsonDbRequestPath, request, msgId,
            function (response) {
                var haveResult = false;
                var haveError = false;
                if (response.hasOwnProperty('Result') === true) {
                    var retResult = response.Result;
                    if (retResult.hasOwnProperty('data') === true) {
                        var retData = retResult.data;
                        if (cacheResult) {
                            _cache.set(key, retData);
                        }
                        else {
                            _cache.set(key, null);
                        }
                        if (typeof (successCallback) === "function") successCallback(retData);
                        haveResult = true;
                    }
                    else if (retResult.hasOwnProperty('error') === true) {
                        var retError = retResult.error;
                        showError(retError, msgId);
                        haveError = true;
                    }
                }

                if ((haveResult === false) && (haveError == false)) {
                    showError("No data Found", msgId);
                }

            });
    } else {
        if (typeof (successCallback) === "function") successCallback(result);
    }
}

function doSQLExtractCsv(dbName, sqlStatement, dataFilePath, writeHeaderName, msgElmId, successCallback) {
    var valid = true;

    //Validate Arguments

    if (valid == true) {
        var paramValues = '{';
        paramValues += '"dbName" : "' + dbName + '"';
        paramValues += ', "sqlStatement" : "' + sqlStatement + '"';
        paramValues += ', "dataFilePath" : "' + dataFilePath + '"';
        paramValues += ', "writeHeaderName" : ' + writeHeaderName;
        paramValues += ', "csvFieldDelimiter" : ","';
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "DoExtractCsv",
            params: paramValues
        };

        asyncJsonRequest(jsonDbRequestPath, request, msgElmId,
           function (response) {
               var haveResult = false;
               if (response.hasOwnProperty('Result') === true) {
                   var retResult = response.Result;
                   if (retResult.hasOwnProperty('message') === true) {
                       if (typeof (successCallback) === "function") successCallback();
                   }
                   else if (retResult.hasOwnProperty('error') === true) {
                       var retError = retResult.error;
                       showError(retError, msgElmId);
                   }
               }
           });
    }
}

var jsonHtmlRequestPath = "/Handler/JsonHtml.ashx";
function fillPagedList(dbName, selectStatement, dataTemplateName, pageNo, itemsPerPage, placeHolderElmId, titleHtml, emptyHtml, msgElmId, successCallback) {

    var pageId = placeHolderElmId;

    var paramValues = '{';
    paramValues += '"dbName" : "' + dbName + '"';
    paramValues += ', "selectStatement" : "' + selectStatement + '"';
    paramValues += ', "dataTemplateName" : "' + dataTemplateName + '"';
    paramValues += ', "pageId" : "' + pageId + '"';
    paramValues += ', "pageNo" : ' + pageNo;
    paramValues += ', "itemsPerPage" : ' + itemsPerPage;
    paramValues += ', "headerTemplateName" : "liItemHeader"';
    paramValues += ', "footerTemplateName" : "liItemFooter"';
    paramValues += '}';

    var request = {
        id: ++nextRequestId,
        method: "GetHtmlPaged",
        params: paramValues
    };

    asyncJsonRequest(jsonHtmlRequestPath, request, msgElmId,
        function (response) {
            if (response.hasOwnProperty('Result') === true) {
                var retResult = response.Result;
                var elmULPlaceHolder = '#' + placeHolderElmId;
                if (retResult.hasOwnProperty('html') === true) {

                    var totalPages = 0;
                    if (retResult.hasOwnProperty('totalPages') === true) {
                        totalPages = retResult.totalPages;
                    }

                    var pageNo = 0;
                    if (retResult.hasOwnProperty('pageNo') === true) {
                        pageNo = retResult.pageNo;
                    }

                    var dataList = retResult.html;
                    var headerList = "";
                    var footerList = "";

                    if (totalPages >= 1) {
                        if (retResult.hasOwnProperty('htmlHeader') === true) {
                            headerList = retResult.htmlHeader;
                        }
                        if (retResult.hasOwnProperty('htmlFooter') === true) {
                            footerList = retResult.htmlFooter;
                        }
                    }

                    $(elmULPlaceHolder).show();
                    $(elmULPlaceHolder).html(titleHtml + headerList + dataList + footerList);
                    $(elmULPlaceHolder).listview("refresh");
               
                    bindPageLink(dbName, selectStatement, dataTemplateName, pageNo, itemsPerPage, placeHolderElmId, titleHtml, emptyHtml, msgElmId, successCallback, totalPages);

                    if (typeof (successCallback) === "function") successCallback();
                }
                else if (retResult.hasOwnProperty('error') === true) {
                    var retError = retResult.error;
                    showError(retError, msgId);
                } else {
                    if (emptyHtml) {
                        $(elmULPlaceHolder).show();
                        $(elmULPlaceHolder).html(titleHtml + emptyHtml);
                        $(elmULPlaceHolder).listview("refresh");
                    }
                }
            }
        });

}


function bindPageLink(dbName, selectStatement, dataTemplateName, pageNo, itemsPerPage, placeHolderElmId, titleHtml, emptyHtml, msgElmId, successCallback, totalPages)
{
    var pageId = placeHolderElmId;

    if (pageNo == 1) {
        $('#footerPrevItem' + pageId).attr('disabled', 'disabled');
        $('#headerPrevItem' + pageId).attr('disabled', 'disabled');
    }
    if (pageNo == totalPages) {
        $('#footerNextItem' + pageId).attr('disabled', 'disabled');
        $('#headerNextItem' + pageId).attr('disabled', 'disabled');
    }

    $('#footerNextItem' + pageId).click(function () {
        currentPageNo = pageNo + 1;
        fillPagedList(dbName, selectStatement, dataTemplateName, currentPageNo, itemsPerPage, placeHolderElmId, "", emptyHtml, msgElmId)
    });
    $('#headerNextItem' + pageId).click(function () {
        currentPageNo = pageNo + 1;
        fillPagedList(dbName, selectStatement, dataTemplateName, currentPageNo, itemsPerPage, placeHolderElmId, "", emptyHtml, msgElmId)
    });

    $('#footerPrevItem' + pageId).click(function () {
        currentPageNo = pageNo - 1;
        fillPagedList(dbName, selectStatement, dataTemplateName, currentPageNo, itemsPerPage, placeHolderElmId, "", emptyHtml, msgElmId)
    });
    $('#headerPrevItem' + pageId).click(function () {
        currentPageNo = pageNo - 1;
        fillPagedList(dbName, selectStatement, dataTemplateName, currentPageNo, itemsPerPage, placeHolderElmId, "", emptyHtml, msgElmId)
    });

}
var jsonFileRequestPath = "/Handler/JsonFile.ashx";
function haveConfigFile(configFilePath, msgId, successCallback, errorCallback, cacheResult)
{

    if (typeof (cacheResult) == "undefined") cacheResult = false;
    var key = configFilePath;
    var result = _cache.get(key);
    if (result == false) {

        var paramValues = '{';
        paramValues += '"relativePath" : "' + configFilePath + '"';
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "HaveFileData",
            params: paramValues
        };

        asyncJsonRequest(jsonFileRequestPath, request, msgId,
            function (response) {
                var haveResult = false;
                if (response.hasOwnProperty('Result') === true) {
                    var retResult = response.Result;
                    if (retResult.hasOwnProperty('message') === true) {
                        if (cacheResult) {
                            _cache.set(key, configFilePath);
                        }
                        else {
                            _cache.set(key, null);
                        }
                        if (typeof (successCallback) === "function") successCallback();
                    }
                    else if (retResult.hasOwnProperty('error') === true) {
                        var retError = retResult.error;
                        if (typeof (errorCallback) === "function") errorCallback(retError);
                    }
                }
            });
    } else {
        if (typeof (successCallback) === "function") successCallback();
    }
}

function checkConfigData(configFilePath, configName, configExpectedValue, msgId, matchCallback, unmatchCallback, notfoundCallback, cacheResult)
{
    if (typeof (cacheResult) == "undefined") cacheResult = false;
    var key = configFilePath + configName;
    var result = _cache.get(key);
    if (result == false) {

        var paramValues = '{';
        paramValues += '"relativePath" : "' + configFilePath + '"';
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "GetFileData",
            params: paramValues
        };

        asyncJsonRequest(jsonFileRequestPath, request, msgId,
            function (response) {
                var haveResult = false;
                if (response.hasOwnProperty('Result') === true) {
                    var retResult = response.Result;
                    if (retResult.hasOwnProperty('data') === true) {
                        var retData = retResult.data;
                        if (retData.hasOwnProperty(configName) === true) {
                            if (cacheResult) {
                                _cache.set(key, retData);
                            }
                            else {
                                _cache.set(key, null);
                            }
                            if (retData[configName] === configExpectedValue) {
                                if (typeof (matchCallback) === "function") matchCallback();
                            }
                            else {
                                if (typeof (unmatchCallback) === "function") unmatchCallback();
                            }
                        }
                        else {
                            if (typeof (notfoundCallback) === "function") {
                                notfoundCallback();
                            } else {
                                showError('The Config Data [' + configName + '] does not exist', msgId);
                            }
                        }
                    }
                    else if (retResult.hasOwnProperty('error') === true) {
                        var retError = retResult.error;
                        showError(retError, msgId);
                    }
                }
            });
    }
    else {
        if (result[configName] === configExpectedValue) {
            if (typeof (matchCallback) === "function") matchCallback();
        }
        else {
            if (typeof (unmatchCallback) === "function") unmatchCallback();
        }
    }
}

function getConfigData(configFilePath, msgId, successCallback, cacheResult)
{
    if (typeof (cacheResult) == "undefined") cacheResult = false;
    var key = configFilePath;
    var result = _cache.get(key);
    if (result == false) {

        var paramValues = '{';
        paramValues += '"relativePath" : "' + configFilePath + '"';
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "GetFileData",
            params: paramValues
        };

        afJsonRequest(jsonFileRequestPath, request, msgId,
            function (response) {
                var haveResult = false;
                if (response.hasOwnProperty('Result') === true) {
                    var retResult = response.Result;
                    if (retResult.hasOwnProperty('data') === true) {
                        var retData = retResult.data;
                        if (cacheResult) {
                            _cache.set(key, retData);
                        }
                        else {
                            _cache.set(key, null);
                        }
                        if (typeof (successCallback) === "function") successCallback(retData);
                    }
                    else if (retResult.hasOwnProperty('error') === true) {
                        var retError = retResult.error;
                        showError(retError, msgId);
                    }
                }
            });
    } else {
        if (typeof (successCallback) === "function") successCallback(result);
    }
}

function createConfigData(configFilePath, configNameArr, configValueArr, msgId, successCallback) {
    var isValid = true;
    var jsonFileData = '{';
    if ($.isArray(configNameArr)) {
        if (configNameArr.length === configValueArr.length) {
            for (var i = 0; i < configName.length; i++) {
                if (jsonFileData.length > 1) jsonFileData += ",";
                if (($.type(configValueArr) === "number") || ($.type(configValueArr) === "boolean")) {
                    jsonFileData += '"' + configNameArr[i] + '" : ' + configValueArr[i];
                }
                else {
                    jsonFileData += '"' + configNameArr[i] + '" : "' + configValueArr[i] + '"';
                }
            }
        }
        else {
            showError('Config Name and Value Array Length does not match', msgId);
            isValid = false;
        }
    } else {
        if (($.type(configValueArr) === "number") || ($.type(configValueArr) === "boolean")) {
            jsonFileData += '"' + configNameArr + '" : ' + configValueArr;
        } else {
            jsonFileData += '"' + configNameArr + '" : "' + configValueArr + '"';
        }
    }
    jsonFileData += '}';

    if (isValid === true) {
        var paramValues = '{';
        paramValues += '"relativePath" : "' + configFilePath + '"';
        paramValues += ', "jsonFileData" : ' + jsonFileData ;
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "UpdateFileData",
            params: paramValues
        };

        asyncJsonRequest(jsonFileRequestPath, request, msgId,
            function (response) {
                var haveResult = false;
                if (response.hasOwnProperty('Result') === true) {
                    var retResult = response.Result;
                    if (retResult.hasOwnProperty('message') === true) {
                        if (typeof (successCallback) === "function") successCallback();
                    }
                    else if (retResult.hasOwnProperty('error') === true) {
                        var retError = retResult.error;
                        showError(retError, msgId);
                    }
                }
            });
    }
}

function saveConfigData(configFilePath, configNameArr, configValueArr, msgId, successCallback) {
    var isValid = true;
    var jsonFileData = '{';
    if ($.isArray(configNameArr)) {
        if (configNameArr.length === configValueArr.length) {
            for (var i = 0; i < configName.length; i++) {
                if (jsonFileData.length > 1) jsonFileData += ",";
                if (($.type(configValueArr) === "number") || ($.type(configValueArr) === "boolean")) {
                    jsonFileData += '"' + configNameArr[i] + '" : ' + configValueArr[i];
                }
                else {
                    jsonFileData += '"' + configNameArr[i] + '" : "' + configValueArr[i] + '"';
                }
            }
        }
        else {
            showError('Config Name and Value Array Length does not match', msgId);
            isValid = false;
        }
    } else {
        if (($.type(configValueArr) === "number") || ($.type(configValueArr) === "boolean")) {
            jsonFileData += '"' + configNameArr + '" : ' + configValueArr;
        } else {
            jsonFileData += '"' + configNameArr + '" : "' + configValueArr + '"';
        }
    }
    jsonFileData += '}';

    if (isValid === true) {
        var paramValues = '{';
        paramValues += '"relativePath" : "' + configFilePath + '"';
        paramValues += ', "jsonFileData" : ' + jsonFileData ;
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "UpdateFileData",
            params: paramValues
        };

        asyncJsonRequest(jsonFileRequestPath, request, msgId,
            function (response) {
                var haveResult = false;
                if (response.hasOwnProperty('Result') === true) {
                    var retResult = response.Result;
                    if (retResult.hasOwnProperty('message') === true) {
                        if (typeof (successCallback) === "function") successCallback();
                    }
                    else if (retResult.hasOwnProperty('error') === true) {
                        var retError = retResult.error;
                        showError(retError, msgId);
                    }
                }
            });
    }
}

function setConfigData(configFilePath, jsonFileData, msgId, successCallback) {
    var isValid = true;

    if (isValid === true) {
        var paramValues = '{';
        paramValues += '"relativePath" : "' + configFilePath + '"';
        paramValues += ', "jsonFileData" : ' + jsonFileData ;
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "UpdateFileData",
            params: paramValues
        };

        asyncJsonRequest(jsonFileRequestPath, request, msgId,
            function (response) {
                var haveResult = false;
                if (response.hasOwnProperty('Result') === true) {
                    var retResult = response.Result;
                    if (retResult.hasOwnProperty('message') === true) {
                        if (typeof (successCallback) === "function") successCallback();
                    }
                    else if (retResult.hasOwnProperty('error') === true) {
                        var retError = retResult.error;
                        showError(retError, msgId);
                    }
                }
            });
    }
}

function loadConfig(configElmId, configPath, configName, callback) {

    var configElm = document.getElementById(configElmId);
    if (configElm) {

        haveConfigFile(configPath, msgElmId, function () {
            //Check the Config Value
            getConfigData(configPath, msgElmId, function (configData) {
                if (configData.hasOwnProperty(configName) === true) {
                    var configValue = configData[configName];
                    configElm.value = configValue;
                    if (typeof (callback) === "function") {
                        callback();
                    }
                }
                else {
                    if (configElm.value.length > 0) {
                        var configValue = parseInt(configElm.value);

                        saveConfigData(configPath, configName, configValue, msgElmId, function () {
                            if (typeof (callback) === "function") {
                                callback();
                            }
                        });
                    }
                }
            }, false);
        }, function () {
            //Create the Config Data
            if (configElm.value.length > 0) {
                var configValue = parseInt(configElm.value);
                createConfigData(configPath, configName, configValue, msgElmId, function () {
                    if (typeof (callback) === "function") {
                        callback();
                    }
                });
            }
        });
    }
}

function saveConfigNumber(configElmId, configError, configPath, configName, callback) {
    var configElm = document.getElementById(configElmId);
    if (configElm) {
        if (configElm.value.length == 0) {
            showError(configError, msgElmId)
        }
        if (configElm.value.length > 0) {
            var configElmVal = configElm.value;

            if (isNumber(configElmVal) == true) {
                var configValue = parseInt(configElmVal);
                saveConfigData(configPath, configName, configValue, msgElmId, function () {
                    if (typeof (callback) === "function") {
                        callback();
                    }
                });
            } else {
                showError(configError, msgElmId)
            }
        }
    }
}

var jsonMailRequestPath = "/Handler/JsonMail.ashx";
function sendMail(mailFrom, mailTo, mailSubject, mailTemplate, replaceList, attachList, configFileName, msgElmId, successCallback) {

    var paramValues = '{';
    paramValues += '"mailFrom" : "' + mailFrom + '"';
    paramValues += ', "mailTo" : "' + mailTo + '"';
    paramValues += ', "mailSubject" : "' + mailSubject + '"';
    paramValues += ', "mailTemplate" : "' + mailTemplate + '"';
    paramValues += ', "replaceList" : ' + replaceList;
    paramValues += ', "attachList" : ' + attachList;
    paramValues += ', "mailConfigName" : "' + configFileName + '"';
    paramValues += '}';

    var request = {
        id: ++nextRequestId,
        method: "SendMail",
        params: paramValues
    };

    asyncJsonRequest(jsonMailRequestPath, request, msgElmId,
        function (response) {
            var haveResult = false;
            if (response.hasOwnProperty('Result') === true) {
                var retResult = response.Result;
                if (retResult.hasOwnProperty('message') === true) {
                    if (typeof (successCallback) === "function") successCallback();
                }
                else if (retResult.hasOwnProperty('error') === true) {
                    var retError = retResult.error;
                    showError(retError, msgElmId);
                }
            }
        });
}

var jsonHashHandler = "/Handler/JsonHash.ashx";
function hashRegister(hash, purchaseEmail, vendorEmail, mailConfig, mailSubject, mailTemplate, replaceList, msgElmId, successCallback) {
    var valid = true;

    //Validate Arguments
    var hashInfo = '{}';

    if (valid == true) {
        var paramValues = '{';
        paramValues += '"hashType" : "PurchaserRegister"';
        paramValues += ', "hash" : "' + encodeURIComponent(hash) + '"';
        paramValues += ', "hashFrom" : "' + encodeURIComponent(purchaseEmail) + '"';
        paramValues += ', "hashTo" : "' + encodeURIComponent(vendorEmail) + '"';
        paramValues += ', "hashInfo" :' + hashInfo;
        paramValues += ', "mailConfigName" : "' + encodeURIComponent(mailConfig) + '"';
        paramValues += ', "mailSubject" : "' + encodeURIComponent(mailSubject) + '"';
        paramValues += ', "mailTemplate" : "' + encodeURIComponent(mailTemplate) + '"';
        paramValues += ', "replaceList" : ' + replaceList;
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "AddHash",
            params: paramValues
        };

        asyncJsonRequest(jsonHashHandler, request, msgElmId,
           function (response) {
               var haveResult = false;
               if (response.hasOwnProperty('Result') === true) {
                   var retResult = response.Result;
                   if (retResult.hasOwnProperty('message') === true) {
                       if (typeof (successCallback) === "function") successCallback();
                   }
                   else if (retResult.hasOwnProperty('error') === true) {
                       var retError = "Unable to Register [" + retResult.error + "]";
                       showError(retError, msgElmId);
                   }
               }
           });
    }
}

function hashConfirm(hash, purchaserCode, accessPassword, mailConfig, mailSubject, mailTemplate, replaceList, msgElmId, successCallback) {
    var valid = true;

    //Validate Arguments
    var hashInfo = '{';
    hashInfo += '"purchaserCode" : "' + purchaserCode + '"';
    hashInfo += ', "accessPassword" : "' + accessPassword + '"';
    hashInfo += '}';

    if (valid == true) {
        var paramValues = '{';
        paramValues += '"hashType" : "PurchaserConfirm"';
        paramValues += ', "hash" : "' + encodeURIComponent(hash) + '"';
        paramValues += ', "hashInfo" :' + hashInfo;
        paramValues += ', "mailConfigName" : "' + encodeURIComponent(mailConfig) + '"';
        paramValues += ', "mailSubject" : "' + encodeURIComponent(mailSubject) + '"';
        paramValues += ', "mailTemplate" : "' + encodeURIComponent(mailTemplate) + '"';
        paramValues += ', "replaceList" : ' + replaceList;
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "ConfirmHash",
            params: paramValues
        };

        asyncJsonRequest(jsonHashHandler, request, msgElmId,
           function (response) {
               var haveResult = false;
               if (response.hasOwnProperty('Result') === true) {
                   var retResult = response.Result;
                   if (retResult.hasOwnProperty('message') === true) {
                       if (typeof (successCallback) === "function") successCallback();
                   }
                   else if (retResult.hasOwnProperty('error') === true) {
                       var retError = "Unable to Confirm Registration. Enter Correct Purchaser Code and Access Password or Please Re Register";
                       showError(retError, msgElmId);
                   }
               }
           });
    }
}
