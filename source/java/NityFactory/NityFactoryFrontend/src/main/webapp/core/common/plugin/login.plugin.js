var LoginPlugin  = {
		preLoginFlag :"preLogin",
		/**
		 * invalid access will trigger prelogin
		 */
		preLogin:function(){
			if(RegionUtil.getCookie(LoginPlugin.preLoginFlag)!="y"){
    			RegionUtil.setCookieWithExpire(LoginPlugin.preLoginFlag,"y","s5");
	    		RegionUtil.alert("请登录");
	    		RegionUtil.getTopWindow(window).location.replace(Config.frontendPath+"/index.html");
    		}
		},
		login:function(account,password,verifycode){
			
			var aesKey = RegionUtil.getCookie("aesKey");
			if(aesKey!=null&&aesKey!=""){
				account = RegionUtil.encrypt(account,aesKey);
				password = RegionUtil.encrypt(password,aesKey);
			}
			
			var task = RegionUtil.ajaxJsonTask(Config.backendPath+"/login", "POST", {"account":account,"password":password,"verifycode":verifycode},function(loginResultJson,dataPara){
				if(!loginResultJson.isValidAccount){
					if(loginResultJson.loginResponseType=="EXPIRED_VERIFYIMG"){
						RegionUtil.alert("验证码已过期，请刷新");
					}
					else if(loginResultJson.loginResponseType=="INVALID_VERIFYIMG"){
						RegionUtil.alert("验证码错误");
					}
					else{
						RegionUtil.alert("账号不存在或密码错误");
					} 
				 }
				 else{
					 RegionUtil.delCookie("aesKey");
					 window.location.replace(Config.frontendPath+"/pages/welcome.html");
				 }
			}, true);
			return task;
		},
		logout:function(){
			return RegionUtil.ajaxJsonTask(Config.backendPath+"/logout", "POST", null,function(response,dataPara){
				 RegionUtil.delCookie("_region_login");
				 window.location.replace(Config.frontendPath+"/index.html");
			}, true,function(){
				RegionUtil.delCookie("_region_login");
				 window.location.replace(Config.frontendPath+"/index.html");
			});
		},
		register:function(account,password,verifycode){
			var aesKey = RegionUtil.getCookie("aesKey");
			if(aesKey!=null&&aesKey!=""){
				account = RegionUtil.encrypt(account,aesKey);
				password = RegionUtil.encrypt(password,aesKey);
			}
			var task = RegionUtil.ajaxJsonTask(Config.backendPath+"/register", "POST", {"account":account,"password":password,"verifycode":verifycode},function(loginResultJson,dataPara){
				console.log(RegionUtil.getCookie("aesKey"));
				if(loginResultJson.success){
					RegionUtil.alert("注册成功，请登录");
				}
				else{
					if(loginResultJson.respCode=="_701"){
						RegionUtil.alert("验证码错误");
					}
					else if(loginResultJson.respCode=="_702"){
						RegionUtil.alert("验证码已过期，请刷新");
					}
					else{
						//RegionUtil.alert(loginResultJson.msg);
					}
				}
			}, true);
			return task;
		}
}
