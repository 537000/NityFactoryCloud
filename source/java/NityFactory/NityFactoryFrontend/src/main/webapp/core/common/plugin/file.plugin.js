/*
<input type="file" label="Attach File" region-attr="icon"  
		renderCallBack="REGION.iconRenderCallBack"
		uploadedCallBack="REGION.iconUploadedCallBack" />
</div>
 */

var FilePlugin = {
		fileId : 0,
		getNextUploadFileId:function(){
			FilePlugin.fileId++;
			return FilePlugin.fileId;
		},
		fileList:new HashMap(),
		processingFileId:null,
		processingFileReq:null,
		renderFile:function(region,tmpObj,nodeVal){
			 var parentNode = tmpObj.parent();
			 var regionAttr = tmpObj.attr("region-attr");
			 var outerHtml = tmpObj.prop("outerHTML");
			 var regionId = tmpObj.attr("region-id");
			 
			 var replaceTxt="<div class=\"input-group\">\r\n";
			 if(tmpObj.hasClass("region-editable")){
				 replaceTxt += "<input type=\"text\" class=\"form-control region-editable fileInfo\" disabled>";
			 }
			 else{
				 replaceTxt += "<input type=\"text\" class=\"form-control fileInfo\" disabled>";
			 }
			 replaceTxt += outerHtml;
			 replaceTxt += "<span class=\"input-group-addon data-label-normal fileProgress hidden\"></span>";
			 replaceTxt += "<span class=\"input-group-addon data-label-normal abortBtn mouse-pointer hidden\" title=\"Cancel\" onclick=\"FilePlugin.abortUploading(this);\"><i class=\"fa fa-fw fa-remove fa-lg\"></i></span>";
			 replaceTxt += "<span class=\"input-group-addon data-label-normal attachBtn mouse-pointer\" title=\"Cancel\" onclick=\"FilePlugin.attachFile(this);\"><i class=\"fa fa-fw fa-paperclip fa-lg\"></i></span>";
			 replaceTxt += "<span class=\"input-group-addon data-label-normal deleteBtn mouse-pointer hidden\" title=\"Delete\" onclick=\"FilePlugin.deleteFile(this);\"><i class=\"fa fa-fw fa-trash fa-lg\"></i></span>";
			 
			 replaceTxt += "</div>";
			 tmpObj.replaceWith(replaceTxt); 
			 RegionUtil.addRegionUniqueId(parentNode[0],regionId);
			 tmpObj = parentNode.find("[region-attr="+regionAttr+"]");
			 
			 tmpObj.removeClass("region-editable");
			 tmpObj.removeAttr("region-attr");
			 tmpObj.addClass("hidden");
			 tmpObj.change(function(event){
				FilePlugin.uploadFile(event);
			 });
			 
			 var label = tmpObj.attr("label");
			 parentNode.find(".fileInfo").attr("region-attr", regionAttr);
			 parentNode.find(".attachBtn").val(label);
			 parentNode.find(".attachBtn").prop("title", label);

			 if (nodeVal != "") {
				tmpObj.attr("orignalFile", nodeVal);
				parentNode.find(".fileInfo").val(nodeVal);
				parentNode.find(".deleteBtn").removeClass("hidden");
				parentNode.find(".attachBtn").val("Update")
				parentNode.find(".attachBtn").prop("title", "Update");
			 }
			 return tmpObj;
		},

		uploadFile : function(evt){
			var evt=RegionUtil.fixEvent(evt);
			var tmpObj = $(evt.target);
			if(tmpObj.get(0).files[0]==undefined)return;
			
			var parasMap = FilePlugin.getParasMap(tmpObj);
			var maxsize = parasMap.get("maxsize");
			var accept = parasMap.get("accept");
			var relativepath = parasMap.get("relativepath");
			
			if(maxsize>0){
				if(tmpObj.get(0).files[0].size > maxsize * 1000) {
					RegionUtil.alert('上传文件不能大于'+maxsize+"KB");
					return;
				}
			}
			
			if(accept==null||accept=="")accept="*";
			if(accept!="*"){
				var fileExts = accept.split(",");
				var x = 0, fileExtFound = false;
				for(x = 0; x< fileExts.length; x++){ 
					if(tmpObj.get(0).files[0].name.toLowerCase().endWith(fileExts[x].toLowerCase())){
						fileExtFound = true;
						break;
					}
				}
				
				if(fileExtFound == false) {
					RegionUtil.alert('文件类型不合法');
					return;
				}
			}			
			var region = RegionUtil.getRegionByEvent(evt);
			var fileUploadId = region.regionId+"_"+FilePlugin.getNextUploadFileId();
			tmpObj.attr("file-upload-id",fileUploadId); 
			FilePlugin.fileList.put(fileUploadId,tmpObj);
			
			tmpObj.parent().find(".deleteBtn").addClass("hidden");
        	tmpObj.parent().find(".attachBtn").addClass("hidden");
			FilePlugin.processingFile(fileUploadId);
		},
		attachFile:function(attachBtn){
			$(attachBtn).parent().find("input[type=file]").click();
		},
		onprogress:function(evt){
	        var loaded = evt.loaded;           
	        var tot = evt.total;
	        var per = Math.floor(100*loaded/tot);
	        var parentNode = FilePlugin.fileList.get(FilePlugin.processingFileId).parent();
	        parentNode.find(".abortBtn").removeClass("hidden");
	        parentNode.find(".fileProgress").removeClass("hidden");
	        parentNode.find(".fileProgress").html( per +"%" );

	        if(per==100){
	        	var tmpObj = FilePlugin.fileList.get(FilePlugin.processingFileId);
	        	var attachFileElem = tmpObj.get(0).files[0];
	        	var fileName = attachFileElem.name;
	        	var parasMap = FilePlugin.getParasMap(tmpObj);
	        	var relativepath = parasMap.get("relativepath");
	        	var pathArray = relativepath.split(".");
	        	for(var i = 0; i <pathArray.length ; i++){
	        		fileName = pathArray[pathArray.length-1-i]+"/"+fileName;
	        	}
	        	
	        	tmpObj.parent().find(".abortBtn").addClass("hidden");
	        	tmpObj.parent().find(".deleteBtn").removeClass("hidden");
	        	tmpObj.parent().find(".attachBtn").prop("title", "Update");
	        	tmpObj.parent().find(".attachBtn").removeClass("hidden");
	        	tmpObj.parent().find(".fileInfo").val(fileName);
	        	tmpObj.attr("orignalFile", fileName);
	        	parentNode.find(".fileProgress").addClass("hidden");
	        	var uploadedCallBack = eval(tmpObj.attr("uploadedCallBack"));
				if (uploadedCallBack != undefined && typeof(uploadedCallBack) === "function") {
					uploadedCallBack(tmpObj.parent());
				}
	        	
	        	FilePlugin.fileList.remove(FilePlugin.processingFileId);
	        	FilePlugin.processingFileId = null;
	        	FilePlugin.processingFileReq = null;
	        	if(FilePlugin.fileList.size()>0){
	        		var fileUploadId = FilePlugin.fileList.keySet()[0];
	        		FilePlugin.processingFile(fileUploadId);
	        	}
	        }
	    },
	    processingFile:function(fileUploadId){
	    	if(FilePlugin.processingFileId==null){
	    		FilePlugin.processingFileId = fileUploadId;
		    	var tmpObj = FilePlugin.fileList.get(FilePlugin.processingFileId);
				var attachFileElem = tmpObj.get(0).files[0];
				
			    var formData = new FormData();
			    formData.append("upfile" , attachFileElem);
			    var tmpAppData = SystemData.getAppData();
			    tmpAppData.requestId = getUUID2();
			    formData.append("requestId" , JSON.stringify(tmpAppData));
			    formData.append("paras" , tmpObj.attr("paras"));
			    console.log(Config.backendPath+'/common/file/upload')
			    FilePlugin.processingFileReq = $.ajax({
			           type: "POST",
			           url:Config.backendPath+'/common/file/upload',
			           data: formData ,
			           processData : false,     
			           contentType : false , 
			           xhr: function(){
			                var xhr = $.ajaxSettings.xhr();
			                if(FilePlugin.onprogress && xhr.upload) {
			                    xhr.upload.addEventListener("progress" , FilePlugin.onprogress, false);
			                    return xhr;
			                }
			            },
			            success: function (data) {
			            	if(data=="login"){
					    		LoginPlugin.preLogin();
					    		return;
					    	}
					    	else if(data=="403"){
					    		RegionUtil.alert("没有上传文件权限");
					    		return;
					    	}
			            },
			            error : function(XMLHttpRequest, textStatus, errorThrown) {
							if(XMLHttpRequest.readyState==0){
								RegionUtil.alert("服务器连接错误")
							}
							else if(XMLHttpRequest.readyState==1){
								RegionUtil.alert("发送消息错误")
							}
							else{
								var obj = new Object();
								obj.errorMessage = "state:"+XMLHttpRequest.readyState + ",status:"+ XMLHttpRequest.status;
								obj.scriptURI = Config.backendPath+'/common/file/upload';
								obj.lineNumber = null;
								obj.columnNumber = null;
								obj.errorObj = "upload file error";
								RegionUtil.reportFrontEndError(obj,null,reqWrapper.requestId);
							}
			            }
			        });
	    	}
	    	else{
	    		var parentNode = FilePlugin.fileList.get(fileUploadId).parent();
	    		parentNode.find(".fileProgress").text("Pending");
	    		parentNode.find(".fileProgress").removeClass("hidden");
	    		parentNode.find(".abortBtn").removeClass("hidden");
	    	}
	    	
	    },
	    deleteFile:function(elem){
	    	var tmpObj = $(elem);
	    	tmpObj.parent().find(".fileInfo").val("");
        	tmpObj.parent().find(".deleteBtn").addClass("hidden");
        	tmpObj.parent().find(".attachBtn").prop("title", tmpObj.parent().find("input[type=file]").attr("label"));
        	tmpObj.parent().find("input[type=file]").val(""); 
        	tmpObj.parent().find("input[type=file]").attr("orignalFile","");
	    },
	    abortUploading:function(elem){
	    	var cancelBtn = $(elem);
	    	var parentNode = cancelBtn.parent();
	    	var tmpObj = parentNode.find("input[type=file]");
	    	
	    	if(tmpObj.attr("file-upload-id")!=FilePlugin.processingFileId){
	    		FilePlugin.fileList.remove(tmpObj.attr("file-upload-id"));
	    		
	    		//RESET STATUS
	    		var orignalFile = tmpObj.attr("orignalFile");
		    	if(orignalFile==null||orignalFile==undefined){
		    		orignalFile = "";
		    	}
		    	parentNode.find(".fileInfo").val(orignalFile);
		    	parentNode.find("input[type=file]").val(""); 
		    	
		    	if(orignalFile==""){
		    		parentNode.find(".attachBtn").val(tmpObj.attr("label"));
		    		parentNode.find(".attachBtn").removeClass("hidden");
		    	}
		    	else{
		    		parentNode.find(".deleteBtn").removeClass("hidden");
		    		parentNode.find(".attachBtn").val("Update");
		        	parentNode.find(".attachBtn").removeClass("hidden");
		        	parentNode.find(".attachBtn").prop("title", parentNode.find("input[type=file]").attr("label"));
		    	}
		    	
		    	parentNode.find(".fileProgress").addClass("hidden");
		    	parentNode.find(".abortBtn").addClass("hidden");
		    	//RESET STATUS
	    		return;
	    	}
	    	
	    	if(FilePlugin.processingFileReq!=null){
		    	FilePlugin.processingFileReq.abort();	
		    	//RESET STATUS
		    	var orignalFile = tmpObj.attr("orignalFile");
		    	if(orignalFile==null||orignalFile==undefined){
		    		orignalFile = "";
		    	}
		    	parentNode.find(".fileInfo").val(orignalFile);
		    	parentNode.find("input[type=file]").val(""); 
		    	
		    	if(orignalFile==""){
		    		parentNode.find(".attachBtn").val(tmpObj.attr("label"));
		    		parentNode.find(".attachBtn").removeClass("hidden");
		    	}
		    	else{
		    		parentNode.find(".deleteBtn").removeClass("hidden");
		    		parentNode.find(".attachBtn").val("Update");
		        	parentNode.find(".attachBtn").removeClass("hidden");
		        	parentNode.find(".attachBtn").prop("title", parentNode.find("input[type=file]").attr("label"));
		    	}
		    	
		    	parentNode.find(".fileProgress").addClass("hidden");
		    	parentNode.find(".abortBtn").addClass("hidden");
		    	//RESET STATUS
		    	FilePlugin.fileList.remove(FilePlugin.processingFileId);
	        	FilePlugin.processingFileId = null;
	        	FilePlugin.processingFileReq = null;
	        	if(FilePlugin.fileList.size()>0){
	        		var fileUploadId = FilePlugin.fileList.keySet()[0];
	        		FilePlugin.processingFile(fileUploadId);
	        	}
		    	
	    	}
	    },
    	getParasMap:function(tmpObj){
    		var paras = tmpObj.attr("paras");
			var parasArray = paras.split(";");
			var parasMap = new HashMap();
			for(var i = 0 ;i <parasArray.length ; i++){
				var tmpArray = parasArray[i].split("=");
				parasMap.put(tmpArray[0].trim(),tmpArray[1].trim());
			}
			return parasMap;
    	}


}