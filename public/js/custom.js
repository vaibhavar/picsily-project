// Globals
var picsilyAppUtil = {};
picsilyAppUtil.serviceUtil = {
    token: "",
    setToken: function(sToken){
        if(localStorage){
            // Store in localStorage
            localStorage.setItem("token", sToken);
        }
        else{
            // Store in global object
            picsilyAppUtil.serviceUtil.token = sToken;
        }
    },
    getToken: function(){
        return localStorage.getItem("token") || picsilyAppUtil.serviceUtil.token;
    },
    /**
     * gets Data from service 
     * @param  {String} sUrl URL of service
     * @return {Promise}      Response promise
     */
    getDataFromService: function(sUrl){
        return fetch(sUrl, {
            headers: {"x-access-token": picsilyAppUtil.serviceUtil.getToken()}
        });
    },

    postFormDataToService: function(sUrl, oData){
        var oFormData = new FormData();
        
        for(key in oData){
            oFormData.append(key, oData[key]);
        }

        return fetch(sUrl, {
            method: 'POST',
            headers: {'x-access-token': picsilyAppUtil.serviceUtil.getToken()},
            body: oFormData
        });
    },

    /**
     * Posts data to service
     * @param  {String} sUrl  URL of service
     * @param  {Object} oData Data to be sent
     * @return {Promise}       Response promise
     */
    postDataToService: function(sUrl, oData){
    	var oFormData = new URLSearchParams();
    	
    	for(key in oData){
    		oFormData.append(key, oData[key]);
    	}

        return fetch(sUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'x-access-token': picsilyAppUtil.serviceUtil.getToken()},
            body: oFormData
        });
    },
    loginUser: function(username, password){
        return picsilyAppUtil.serviceUtil.postDataToService("/users/login", {username: username, password: password})
        	.then((oData) => oData.json())
            .then(function(oUserData){
                picsilyAppUtil.serviceUtil.setToken(oUserData.token);
                return oUserData
            });
    },
    logoutUser: function(){
        picsilyAppUtil.serviceUtil.setToken("");
    },
    registerUser: function(firstname, lastname, username, password){
        return picsilyAppUtil.serviceUtil.postDataToService("/users/register", {firstname: firstname, lastname: lastname, username: username, password: password});
    },

    uploadPhoto: function(file){
        return picsilyAppUtil.serviceUtil.postFormDataToService("/photos/upload", {
            file: file
        });
    }
};