var ErrorPromptPlugin = {
		showErrorMsg:function(targetObj,fieldError,region){
			if($(targetObj).attr("type")=="radio" || $(targetObj).attr("type")=="checkbox"){
				targetObj = targetObj.parentNode.parentNode;
			}
			else if($(targetObj).attr("type")=="file"){
				targetObj = targetObj.parentNode;
			}
			else if($(targetObj).hasClass("date")){
				targetObj = targetObj.parentNode;
			}
			if(getPos_X(targetObj)==0)return;
			
			var divobj = document.getElementById(fieldError.errorDivId);
			
			if(divobj==null){
				divobj = document.createElement("div");
				divobj.id=fieldError.errorDivId;
				divobj.className = "formErrorDiv_"+region.regionId+" formErrorDiv";
				divobj.style.cssText="position:absolute;left:"+(7+getPos_X(targetObj))+"px;top:"+(2+getPos_Y(targetObj))+"px";
				document.body.appendChild(divobj);  
			} 
			divobj.innerHTML = "<font class='text-warning'>"+fieldError.errorMsg +"</font>";
		},
		cleanErrorMsg:function(targetObj,fieldError,region){
			var divobj = document.getElementById(fieldError.errorDivId);
			if(divobj!=null){
				divobj.innerHTML = "";
				$(divobj).remove();
			}
		},
		cleanErrorsInfo:function(region){
			var targetSelector = null;
			if(region==null){
				targetSelector = ".formErrorDiv";
			}
			else{
				targetSelector = ".formErrorDiv_"+region.regionId;
			}
			$(targetSelector).remove();
		}
}