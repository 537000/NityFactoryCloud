/*
*Generated at 2018-05-06 18:48:39 中国标准时间
*/
if(typeof parent.DataList == "undefined"){
	this.DataList = new HashMap();
/**
*version name 		 :BaseVersion
*version description :基础设置
*version createDate  :2018-05-06 18:47:17 中国标准时间
*/
	this.DataList.put("ErrorType",[{"label":"前端错误","value":"FrontError"},{"label":"后端错误","value":"BackendError"}]);		
	this.DataList.put("BeanType",[{"label":"Controller","value":"Controller"},{"label":"Component","value":"Component"},{"label":"Resource","value":"Resource"},{"label":"Service","value":"Service"},{"label":"Dao","value":"Dao"},{"label":"Entity","value":"Entity"}]);		
	this.DataList.put("AccountStatus",[{"label":"正常","value":"0"},{"label":"冻结","value":"1"}]);	
	this.DataList.put("EnableDisable",[{"label":"开启","value":"Enabled"},{"label":"关闭","value":"Disabled"}]);		

}
else{
	this.DataList=parent.DataList;

}