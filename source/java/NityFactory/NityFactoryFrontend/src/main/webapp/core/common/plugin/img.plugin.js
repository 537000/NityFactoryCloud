var ImgPlugin = {
		renderImg:function(region,tmpObj,nodeVal){
			var tmpArray = nodeVal.split("/");
			var realFileName = "";
			for(var i = 0 ; i<tmpArray.length-1;i++){
				realFileName+=tmpArray[i]+"/";
			}
			realFileName+=encodeURIComponent(tmpArray[tmpArray.length-1]);
			var imgPath = Config.backendPath+"/common/file/view?fileName="+realFileName;
			tmpObj.attr("src",Config.frontendPath+"/images/reload.gif");
			tmpObj.addClass("lazyImg");
			tmpObj.attr("data-original",imgPath);
			tmpObj.attr("imgData",nodeVal);
		}
}