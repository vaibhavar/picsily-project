(function(){
	function onRegister(){
		return false;
	}
	window.onRegister = onRegister;
})();

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
    }
};