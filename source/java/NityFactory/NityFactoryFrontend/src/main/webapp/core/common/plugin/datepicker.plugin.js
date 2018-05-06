var DatepickerPlugin = {
		renderDatepicker:function(region,tmpObj,paraData){
			var regionAttr = tmpObj.attr("region-attr");
			var timepickerSelector = "timePicker"+regionAttr+region.regionId;
			var replaceTxt = " <div region-id=\""+region.regionId+"\" class=\""+timepickerSelector+" input-group date\">";
			replaceTxt+=tmpObj.prop("outerHTML");
			replaceTxt+="<span class=\"input-group-addon hover-pointer\">";
			replaceTxt+="<i class=\"fa fa-calendar\"></i>";
			replaceTxt+="</span>";
			replaceTxt+="</div>";
		
			tmpObj.replaceWith(replaceTxt);
			tmpObj = region.find("[region-attr=" + regionAttr + "]");
			
			var defaultDatepickerOptions = {
				language:  'zh-CN',
				format: "dd-M-yyyy",
				startDate: "01-01-1900",
				//endDate: "0d",
				maxViewMode: "century",
				todayBtn: "linked",
				autoclose: true,
				todayHighlight: true,
				zIndexOffset: 10000
			};
			
			var tmpDatepickerOptions = {};
			tmpDatepickerOptions.format = tmpObj.attr("dateformat");
			tmpDatepickerOptions.startDate = tmpObj.attr("startDate");
			tmpDatepickerOptions.endDate = tmpObj.attr("endDate");
			
			$.extend(defaultDatepickerOptions, tmpDatepickerOptions);
			
			region.find("."+timepickerSelector).datepicker(defaultDatepickerOptions);
			region.find("."+timepickerSelector).datepicker("setDate", paraData);
			return tmpObj;
		}
}
