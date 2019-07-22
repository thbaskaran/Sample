function getServiceCall(url) {
    return $.ajax
     ({
         url: url,
         type: "GET",
         headers:
         {
             "Accept": "application/json;odata=verbose",
             "Content-Type": "application/json;odata=verbose",
            }
     });
};
function getServiceCallForConfiguration(url) {
    return $.ajax
        ({
            url: url,
            type: "GET",
            headers:
            {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
            },async: false
        });
};

function getQueryStringParameter(paramToRetrieve) {
    var params = document.URL.split("?")[1].split("&");
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve) return singleParam[1];
    }
};

 function getFormDigest(siteUrl){
    return $.ajax({
        url: siteUrl + "/_api/contextinfo",
        method: "POST",
        headers: {
            "Accept": "application/json; odata=verbose"
        }
    });
};
function PostServiceCall(appweburl, url, metadata) {
    var formDigest = ""; 
    return getFormDigest(appweburl).then(function (data) {
        formDigest = data.d.GetContextWebInformation.FormDigestValue;
        return $.ajax
            ({
                url:url,
                type: "POST",
                data: JSON.stringify(metadata),
                headers:
                {
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose",
                    "X-HTTP-Method": "POST",
                    "X-RequestDigest": formDigest,
                    
                }, async: true
            });
    });
};
function UpdateServiceCall(appweburl, url, metadata) {
    var formDigest = "";
    return getFormDigest(appweburl).then(function (data) {
        formDigest = data.d.GetContextWebInformation.FormDigestValue;
    return $.ajax
        ({
            url: url,
            type: "POST",
            data: JSON.stringify(metadata),
            headers: {
                "Accept": "application/json; odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "X-HTTP-Method": "MERGE",
                "IF-MATCH": "*",
                "X-RequestDigest": formDigest
            }
            });
    });
};
function DeleteServiceCall(appweburl, url, metadata) {
    var formDigest = "";
    return getFormDigest(appweburl).then(function (data) {
        formDigest = data.d.GetContextWebInformation.FormDigestValue;
        return $.ajax
            ({
                url: url,
                type: "Delete",
                data: JSON.stringify(metadata),
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose",
                    "X-Http-Method": "DELETE",
                    "X-RequestDigest": formDigest,
                    "If-Match": "*"
                }
            });
    });
}       
function Logerror(pageName, module, methodName, errorMessage) {
    var appurl = decodeURIComponent(getQueryStringParameter('SPAppWebUrl'));
    appurl = appurl.substring(0, appurl.lastIndexOf('/'));
    var username = GetCurrentUserDetails(appurl);
    var itemType = GetItemTypeForListName(constants.errorloglistname);
    var items = {
        "__metadata": { "type": itemType },
        "LoggedUser": username,
        "PageName": pageName,
        "Module": module,
        "MethodName": methodName,
        "ErrorMessage": errorMessage
    }
    var logPostUrl = appurl + "/_api/web/lists/getbytitle('" + constants.errorloglistname + "')/items"
    PostServiceCall(appurl, logPostUrl, items)
}
function DepartmentLogerror(pageName, module, methodName, errorMessage) {
    var appurl = decodeURIComponent(getQueryStringParameter('SPAppWebUrl'));
    appurl = appurl.substring(0, appurl.lastIndexOf('/'));
    var username = GetCurrentUserDetails(appurl);
    var itemType = GetItemTypeForListName(constants.errorloglistname);
    var items = {
        "__metadata": { "type": itemType },
        "LoggedUser": username,
        "PageName": pageName,
        "Module": module,
        "MethodName": methodName,
        "ErrorMessage": errorMessage
    }
    getParentWebUrl(appurl).then(data => {
        var rootUrl = data.d.Url;
        var logPostUrl = rootUrl + "/_api/web/lists/getbytitle('" + constants.configListName + "')/items"
        PostServiceCall(appurl, logPostUrl, items) 
        }, error => {
            errorMessage = error.responseJSON.error.message;
            DepartmentLogerror('service-call', 'ParentUrl', 'DepartmentLogerror', errorMessage)
        });
   
   
}
function GetItemTypeForListName(name) {
    return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
}

function GetCurrentUserDetails(appurl) {
    var Email;

    $.ajax({
        url: appurl + "/_api/web/currentuser",
        headers: {
            Accept: "application/json;odata=verbose"
        },
        async: false,
        success: function (data) {
            Email = data.d.Email;
        },
        eror: function (data) {
            alert("An error occurred. Please try again.");
        }
    });
    return Email;
}

//function HtmlToText(html) {
//    var temporalDivElement = document.createElement("div");
//    temporalDivElement.innerHTML = html;
//    return temporalDivElement.textContent || temporalDivElement.innerText || "";
//}
function getParentWebUrl(url) {
    return $.ajax(
        {
            url: url + "/_api/Site/RootWeb",
            method: "GET",
            headers:
            {
                "Accept": "application/json; odata=verbose"
            }, async: false
        })
};
function outlookPostServiceCall(UserToken,eventObject) {
   return $.ajax({
        type: 'POST',
        url: 'https://graph.microsoft.com/v1.0/me/events',
        data: JSON.stringify(eventObject),
        contentType: "application/json",
        async: false,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + UserToken,
       }, async: true
    })
}
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};
