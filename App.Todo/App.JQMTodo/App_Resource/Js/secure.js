
var nextRequestId = 0;
var jsonUserHandler = "/Handler/JsonUser.ashx";
var jsonUserSecureHandler = "/Handler/JsonUserSecure.ashx";

/*****************************************************************************************************************************
                                                       Utility Methods 
******************************************************************************************************************************/

function loadLoginInfo(msgElmId, callback) {
    var paramValues = '{';
    paramValues += '}';

    var request = {
        id: ++nextRequestId,
        method: "GetLoginUser",
        params: paramValues
    };

    asyncJsonRequest(jsonUserSecureHandler, request, msgElmId,
       function (response) {
           var haveResult = false;
           if (response.hasOwnProperty('Result') === true) {
               var retResult = response.Result;
               if (retResult.hasOwnProperty('data') === true) {
                   var purchaserCode = retResult.data;

                   if (typeof (callback) === "function") {
                       callback(purchaserCode);
                   }
               }
               if (retResult.hasOwnProperty('error') === true) {

                   var retError = retResult.error;
                   showError(retError, msgElmId);
               }
           }
       });
}

/*****************************************************************************************************************************
                                                       WebService Generic Methods 
******************************************************************************************************************************/

//Generic Functions - Load Select Option
function loadSelectOption(jsonHandler, jsonMethod, selectElmId, msgElmId, selectIndex, successCallback) {

    var valid = true;

    //Validate Arguments

    if (valid == true) {
        var paramValues = '{';
        paramValues += '"pageNo" : 1';
        paramValues += ', "itemsPerPage" : 100';
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: jsonMethod, //"GetCategory"
            params: paramValues
        };

        asyncJsonRequest(jsonHandler, request, msgElmId,
           function (response) {
               var haveResult = false;
               if (response.hasOwnProperty('Result') === true) {
                   var retResult = response.Result;
                   if (retResult.hasOwnProperty('error') === true) {
                       var retError = retResult.error;
                       showError(retError, msgElmId);
                   }
                   else {
                       if (retResult.hasOwnProperty('html') === true) {
                           var selectElm = document.getElementById(selectElmId);
                           if (selectElm) {
                               var elmSelector = '#' + selectElmId;
                               $(elmSelector).html(retResult.html);

                               selectElm.selectedIndex = selectIndex;

                               $(elmSelector).selectmenu('refresh');

                               if (typeof (successCallback) === "function") {
                                   successCallback();
                               }
                           }
                       }
                       else if (retResult.hasOwnProperty('data') === true) {
                           var selectElm = document.getElementById(selectElmId);
                           if (selectElm) {
                               var retData = retResult.data;

                               selectElm.options.length = 0;
                               for (var i = 0; i < retData.length; i++) {
                                   var key = retData[i].Key;
                                   var jsonData = retData[i].Value;
                                   if (jsonData.hasOwnProperty("OptionName")) {
                                       var optionText = jsonData.OptionName;
                                       selectElm.options[selectElm.options.length] = new Option(optionText, key);
                                   }
                               }

                               if (selectIndex == 999)//Select the Last Element
                               {
                                   selectElm.selectedIndex = selectElm.options.length - 1;
                               }
                               else {
                                   selectElm.selectedIndex = selectIndex;
                               }

                               var elmSelector = '#' + selectElmId;
                               $(elmSelector).selectmenu('refresh');

                               if (typeof (successCallback) === "function") {
                                   successCallback();
                               }
                           }
                       }
                   }
               }
           });
    }
}

function loadULHtml(jsonHandler, jsonMethod, placeHolderElmId, msgElmId, pageNo, itemsPerPage) {

    var valid = true;

    //Validate Arguments

    if (valid == true) {
        var paramValues = '{';
        paramValues += '"pageNo" : ' + pageNo;
        paramValues += ', "itemsPerPage" : ' + itemsPerPage;
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: jsonMethod,
            params: paramValues
        };

        asyncJsonRequest(jsonHandler, request, msgElmId,
           function (response) {
               var haveResult = false;
               if (response.hasOwnProperty('Result') === true) {
                   var retResult = response.Result;
                   if (retResult.hasOwnProperty('error') === true) {
                       var retError = retResult.error;
                       showError(retError, msgElmId);
                   }
                   else {
                       if (retResult.hasOwnProperty('html') === true) {
                           var placeHolderElm = document.getElementById(placeHolderElmId);
                           if (placeHolderElm) {
                               var elmPlaceHolder = '#' + placeHolderElmId;
                               $(elmPlaceHolder).show();
                               $(elmPlaceHolder).html(retResult.html);
                               $(elmPlaceHolder).listview("refresh");
                           }
                       }
                   }
               }
           });
    }
}

/*****************************************************************************************************************************
                                                       Action Methods
******************************************************************************************************************************/

function fillRolesSelectTag(roleSelectElmId, msgElmId, selectIndex) {
    loadSelectOption(jsonUserSecureHandler, "GetRoleOptionList", roleSelectElmId, msgElmId, selectIndex);
}

function fillRoleUsersUvTag(placeHolderElmId, msgElmId, pageNo, itemsPerPage) {
    loadULHtml(jsonUserSecureHandler, "GetRoleUserListHtml", placeHolderElmId, msgElmId, pageNo, itemsPerPage);
}

/*****************************************************************************************************************************
                                                       WebService Methods (Secure Handler)
******************************************************************************************************************************/

//Is Authenticated
function isAuthenticated(redirectUrl, msgElmId, successCallback, failureCallback) {
    var valid = true;

    //Validate Arguments

    if (valid == true) {
        var paramValues = '{';
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "IsAuthenticated",
            params: paramValues
        };

        asyncJsonRequest(jsonUserHandler, request, msgElmId,
           function (response) {
               var haveResult = false;
               if (response.hasOwnProperty('Result') === true) {
                   var retResult = response.Result;

                   if (retResult.hasOwnProperty('message') === true) {
                       if (typeof (successCallback) === "function") {
                           successCallback();
                       } else {
                           window.location.replace(redirectUrl);
                           if (msgElmId.length > 0) {
                               var retMessage = retResult.message;
                               showSuccess(retMessage, msgElmId);
                           }
                       }
                   }
                   else if (retResult.hasOwnProperty('error') === true) {
                       var retError = retResult.error;
                       showError(retError, msgElmId);
                       if (typeof (failureCallback) === "function") failureCallback(retError);
                   }
               }
           });
    }
}

//Fill User Id
function fillUserId(fillElmId, msgElmId) {
    var valid = true;

    //Validate Arguments

    if (valid == true) {
        var paramValues = '{';
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "GetLoginUser",
            params: paramValues
        };

        asyncJsonRequest(jsonUserSecureHandler, request, msgElmId,
           function (response) {
               var haveResult = false;
               if (response.hasOwnProperty('Result') === true) {
                   var retResult = response.Result;
                   if (retResult.hasOwnProperty('data') === true) {
                       var fillElm = document.getElementById(fillElmId);
                       if (fillElm) {
                           var loginId = retResult.data;
                           fillElm.value = loginId;
                       }
                   }
                   if (retResult.hasOwnProperty('message') === true) {
                       if (msgElmId.length > 0) {
                           var retMessage = retResult.message;
                           showSuccess(retMessage, msgElmId);
                       }
                   }
                   else if (retResult.hasOwnProperty('error') === true) {

                       var retError = retResult.error;
                       showError(retError, msgElmId);
                   }
               }
           });
    }
}

function delete_cookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
};

//LogOff User
function logOffUser(msgElmId, successCallback, failureCallback) {
    var valid = true;

    //Validate Arguments

    if (valid == true) {
        var paramValues = '{';
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "LogOffUser",
            params: paramValues
        };

        asyncJsonRequest(jsonUserHandler, request, msgElmId,
           function (response) {
               var haveResult = false;
               if (response.hasOwnProperty('Result') === true) {
                   var retResult = response.Result;
                   if (retResult.hasOwnProperty('message') === true) {

                       if (retResult.hasOwnProperty('cookie') === true) {
                           var cookieName = retResult.cookie;
                           delete_cookie(cookieName);
                       }

                       if (typeof (successCallback) === "function") {
                           successCallback();
                       } else {
                           var retMessage = retResult.message;
                           showSuccess(retMessage, msgElmId);
                           window.location.replace('/Index.ashx');
                           //setTimeout(function () { window.location.replace('/Index.ashx'); }, 3000);
                       }
                   }
                   else if (retResult.hasOwnProperty('error') === true) {
                       var retError = retResult.error;
                       if (typeof (failureCallback) === "function") {
                           failureCallback(retError);
                       } else {
                           showError(retError, msgElmId);
                           setTimeout(function () { window.location.replace('/Index.ashx'); }, 3000);
                       }
                   }
               }
           });
    }
}

//Login User
function loginUser(userName, userPassword, rememberMe, msgElmId, warnElmId, successCallback, failureCallback) {
    var valid = true;

    //Validate Arguments

    if (valid == true) {
        var paramValues = '{';
        paramValues += '"userName" : "' + encodeURIComponent(userName) + '"';
        paramValues += ', "userPassword" : "' + encodeURIComponent(userPassword) + '"';
        paramValues += ', "rememberMe" : ' + rememberMe;
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "LoginUser",
            params: paramValues
        };

        asyncJsonRequest(jsonUserHandler, request, msgElmId,
           function (response) {
               var haveResult = false;
               if (response.hasOwnProperty('Result') === true) {
                   var retResult = response.Result;
                   if (retResult.hasOwnProperty('message') === true) {
                       if (typeof (successCallback) === "function") {
                           successCallback();
                       } else {
                           var retMessage = retResult.message;
                           showSuccess(retMessage, msgElmId);
                           setTimeout(function () { window.location.replace('/Index.ashx'); }, 2000);
                       }
                   }
                   else if (retResult.hasOwnProperty('error') === true) {

                       var retError = retResult.error;
                       if (typeof (failureCallback) === "function") {
                           failureCallback(retError);
                       } else {
                           showError(retError, msgElmId);
                       }
                   }

                   if (retResult.hasOwnProperty('warn') === true) {

                       if (typeof (successCallback) === "function") {
                           successCallback();
                       } else {
                           var retWarn = retResult.warn;
                           showWarning(retWarn, warnElmId);
                       }
                   }
               }
           });
    }
}

//Validate User
function validateUser(userName, userPassword, msgElmId, warnElmId, successCallback, failureCallback) {
    var valid = true;

    //Validate Arguments

    if (valid == true) {
        var paramValues = '{';
        paramValues += '"userName" : "' + encodeURIComponent(userName) + '"';
        paramValues += ', "userPassword" : "' + encodeURIComponent(userPassword) + '"';
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "ValidateUser",
            params: paramValues
        };

        asyncJsonRequest(jsonUserHandler, request, msgElmId,
           function (response) {
               var haveResult = false;
               if (response.hasOwnProperty('Result') === true) {
                   var retResult = response.Result;
                   if (retResult.hasOwnProperty('message') === true) {
                       if (typeof (successCallback) === "function") {
                           successCallback();
                       } else {
                           var retMessage = retResult.message;
                           showSuccess(retMessage, msgElmId);
                       }
                   }
                   else if (retResult.hasOwnProperty('error') === true) {

                       var retError = retResult.error;
                       if (typeof (failureCallback) === "function") {
                           failureCallback(retError);
                       } else {
                           showError(retError, msgElmId);
                       }
                   }

                   if (retResult.hasOwnProperty('warn') === true) {

                       var retWarn = retResult.warn;
                       if (typeof (successCallback) === "function") {
                           successCallback(retWarn);
                       } else {
                           showWarning(retWarn, warnElmId);
                       }
                   }
               }
           });
    }
}

//Change Password
function changePassword(userId, oldPassword, newPassword, msgElmId) {
    var valid = true;

    //Validate Arguments

    if (valid == true) {
        var paramValues = '{';
        paramValues += ', "userId" : "' + encodeURIComponent(userId) + '"';
        paramValues += ', "oldPassword" : "' + encodeURIComponent(oldPassword) + '"';
        paramValues += ', "newPassword" : "' + encodeURIComponent(newPassword) + '"';
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "ChangePassword",
            params: paramValues
        };

        asyncJsonRequest(jsonUserSecureHandler, request, msgElmId,
           function (response) {
               var haveResult = false;
               if (response.hasOwnProperty('Result') === true) {
                   var retResult = response.Result;
                   if (retResult.hasOwnProperty('message') === true) {
                       var retMessage = retResult.message;
                       showSuccess(retMessage, msgElmId);
                   }
                   else if (retResult.hasOwnProperty('error') === true) {

                       var retError = retResult.error;
                       showError(retError, msgElmId);
                   }
               }
           });
    }
}

//Register User
function registerUser(userId, userEmail, userPassword, msgElmId, successCallback, failureCallback) {
    var valid = true;

    //Validate Arguments

    if (valid == true) {
        var paramValues = '{';
        paramValues += ', "userId" : "' + encodeURIComponent(userId) + '"';
        paramValues += ', "userEmail" : "' + encodeURIComponent(userEmail) + '"';
        paramValues += ', "userPassword" : "' + encodeURIComponent(userPassword) + '"';
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "RegisterUser",
            params: paramValues
        };

        asyncJsonRequest(jsonUserHandler, request, msgElmId,
           function (response) {
               var haveResult = false;
               if (response.hasOwnProperty('Result') === true) {
                   var retResult = response.Result;
                   if (retResult.hasOwnProperty('message') === true) {
                       if (typeof (successCallback) === "function") {
                           successCallback();
                       } else {
                           var retMessage = retResult.message;
                           showSuccess(retMessage, msgElmId);
                       }
                   }
                   else if (retResult.hasOwnProperty('error') === true) {
                       var retError = retResult.error;
                       if (typeof (failureCallback) === "function") {
                           failureCallback(retError);
                       } else {
                           showError(retError, msgElmId);
                       }
                   }
               }
           });
    }
}

//Add User to Role
function addUserToRole(userId, userRole, isDefault, msgElmId) {
    var valid = true;

    //Validate Arguments

    if (valid == true) {
        var paramValues = '{';
        paramValues += ', "userId" : "' + encodeURIComponent(userId) + '"';
        paramValues += ', "roleName" : "' + encodeURIComponent(userRole) + '"';
        paramValues += ', "isDefault" : ' + isDefault;
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "AddUserToRole",
            params: paramValues
        };

        asyncJsonRequest(jsonUserSecureHandler, request, msgElmId,
           function (response) {
               var haveResult = false;
               if (response.hasOwnProperty('Result') === true) {
                   var retResult = response.Result;
                   if (retResult.hasOwnProperty('message') === true) {
                       var retMessage = retResult.message;
                       showSuccess(retMessage, msgElmId);
                       if (typeof (refreshRoleUsersUvTag) === "function") {
                           refreshRoleUsersUvTag();
                       }
                   }
                   else if (retResult.hasOwnProperty('error') === true) {

                       var retError = retResult.error;
                       showError(retError, msgElmId);
                   }
               }
           });
    }
}

//Remove User to Role
function removeUserFromRole(userId, userRole, msgElmId) {
    var valid = true;

    //Validate Arguments

    if (valid == true) {
        var paramValues = '{';
        paramValues += ', "userId" : "' + encodeURIComponent(userId) + '"';
        paramValues += ', "roleName" : "' + encodeURIComponent(userRole) + '"';
        paramValues += '}';

        var request = {
            id: ++nextRequestId,
            method: "RemoveUserFromRole",
            params: paramValues
        };

        asyncJsonRequest(jsonUserSecureHandler, request, msgElmId,
           function (response) {
               var haveResult = false;
               if (response.hasOwnProperty('Result') === true) {
                   var retResult = response.Result;
                   if (retResult.hasOwnProperty('message') === true) {
                       var retMessage = retResult.message;
                       showSuccess(retMessage, msgElmId);
                       if (typeof (refreshRoleUsersUvTag) === "function") {
                           refreshRoleUsersUvTag();
                       }
                   }
                   else if (retResult.hasOwnProperty('error') === true) {

                       var retError = retResult.error;
                       showError(retError, msgElmId);
                   }
               }
           });
    }
}


/*****************************************************************************************************************************
                                                       Action Methods (LogOff, Login, Register)
******************************************************************************************************************************/

function btnLogOffUser(msgElmId) {

    var msgElm = document.getElementById(msgElmId);

    if (msgElm) {

        msgElm.innerHTML = "";
        msgElm.className = "";

        logOffUser(msgElmId);
    }
}

function btnLoginUser(userNameElmId, userPasswordElmId, rememberElmId, msgElmId) {

    var msgElm = document.getElementById(msgElmId);

    var userNameElm = document.getElementById(userNameElmId);
    var userPasswordElm = document.getElementById(userPasswordElmId);
    var rememberElm = document.getElementById(rememberElmId);

    if ((userNameElm) && (userPasswordElm) && (rememberElm)
        && (msgElm)) {

        msgElm.innerHTML = "";
        msgElm.className = "";

        if (userNameElm.value.length == 0) {
            msgElm.className = "error";
            msgElm.innerHTML = "Please enter User Name";
            $(msgElm).show();
        }
        else if (userPasswordElm.value.length == 0) {
            msgElm.className = "error";
            msgElm.innerHTML = "Please enter User Password";
            $(msgElm).show();
        }
        else {
            if (rememberElm.checked == true) {
                loginUser(userNameElm.value, userPasswordElm.value, true, msgElmId);
            }
            else {
                loginUser(userNameElm.value, userPasswordElm.value, false, msgElmId);
            }
        }
    }
}

function btnChangePassword(userIdElmId, oldPasswordElmId, newPasswordElmId, newPasswordConfirmElmId, msgElmId) {

    var msgElm = document.getElementById(msgElmId);
    msgElm.innerHTML = "";
    msgElm.className = "";

    var userIdElm = document.getElementById(userIdElmId);
    var oldPasswordElm = document.getElementById(oldPasswordElmId);
    var newPasswordElm = document.getElementById(newPasswordElmId);
    var newPasswordConfirmElm = document.getElementById(newPasswordConfirmElmId);

    if ((userIdElm) && (oldPasswordElm)
        && (newPasswordElm) && (newPasswordConfirmElm)
        && (msgElm)) {

        if (userIdElm.value.length == 0) {
            msgElm.className = "error";
            msgElm.innerHTML = "Please enter User Id";
            $(msgElm).show();
        }
        else if (oldPasswordElm.value.length == 0) {
            msgElm.className = "error";
            msgElm.innerHTML = "Please enter Old Password";
            $(msgElm).show();
        }
        else if (newPasswordElm.value.length == 0) {
            msgElm.className = "error";
            msgElm.innerHTML = "Please enter New Password";
            $(msgElm).show();
        }
        else if (newPasswordConfirmElm.value.length == 0) {
            msgElm.className = "error";
            msgElm.innerHTML = "Please enter New Confirm Password";
            $(msgElm).show();
        }
        else if (newPasswordElm.value != newPasswordConfirmElm.value) {
            msgElm.className = "error";
            msgElm.innerHTML = "Please Enter the Password and Confirm Password as the Same";
            $(msgElm).show();
        }
        else {
            changePassword(userIdElm.value, oldPasswordElm.value, newPasswordElm.value, msgElmId);
        }
    }
}

function btnRegisterUser(userIdElmId, userEmailElmId, userPasswordElmId, userPasswordConfirmElmId, msgElmId) {

    var msgElm = document.getElementById(msgElmId);
    msgElm.innerHTML = "";
    msgElm.className = "";

    var userIdElm = document.getElementById(userIdElmId);
    var userEmailElm = document.getElementById(userEmailElmId);
    var userPasswordElm = document.getElementById(userPasswordElmId);
    var userPasswordConfirmElm = document.getElementById(userPasswordConfirmElmId);

    if ((userIdElm) && (userEmailElm)
        && (userPasswordElm) && (userPasswordConfirmElm)
        && (msgElm)) {

        if (userIdElm.value.length == 0) {
            msgElm.className = "error";
            msgElm.innerHTML = "Please enter User Id";
            $(msgElm).show();
        }
        else if (userEmailElm.value.length == 0) {
            msgElm.className = "error";
            msgElm.innerHTML = "Please enter User Email";
            $(msgElm).show();
        }
        else if (userPasswordElm.value.length == 0) {
            msgElm.className = "error";
            msgElm.innerHTML = "Please enter User Password";
            $(msgElm).show();
        }
        else if (userPasswordConfirmElm.value.length == 0) {
            msgElm.className = "error";
            msgElm.innerHTML = "Please enter User Confirm Password";
            $(msgElm).show();
        }
        else if (userPasswordElm.value != userPasswordConfirmElm.value) {
            msgElm.className = "error";
            msgElm.innerHTML = "Please Enter the Password and Confirm Password as the Same";
            $(msgElm).show();
        }
        else {
            //Register User
            registerUser(userIdElm.value, userEmailElm.value, userPasswordElm.value, msgElmId);
        }
    }
}

function btnAddRemoveUserRole(addUser, userIdElmId, roleElmId, msgElmId) {

    var msgElm = document.getElementById(msgElmId);
    msgElm.innerHTML = "";
    msgElm.className = "";

    var userIdElm = document.getElementById(userIdElmId);
    var roleElm = document.getElementById(roleElmId);

    if ((userIdElm) && (roleElm)
        && (msgElm)) {

        if (userIdElm.value.length == 0) {
            msgElm.className = "error";
            msgElm.innerHTML = "Please enter User Id";
            $(msgElm).show();
        }
        else if (roleElm.value.length == 0) {
            msgElm.className = "error";
            msgElm.innerHTML = "Please select User Role";
            $(msgElm).show();
        }
        else {
            if (addUser === true) {
                //Add Role
                addUserToRole(userIdElm.value, roleElm.value, false, msgElmId);
            } else {
                //Remove Role
                removeUserFromRole(userIdElm.value, roleElm.value, msgElmId);
            }
        }
    }
}

