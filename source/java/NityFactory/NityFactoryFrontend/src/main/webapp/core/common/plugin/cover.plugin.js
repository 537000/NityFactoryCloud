var CoverPlugin = {
		coverPageShow:false,
		loadingStart:function(){
			var tmpLcd = CoverPlugin.getLoadingCoverDiv();
			var containerInfo = {
				x: 0,
				y: 0,
			};
			
			var temp = {
				p_margin: 0.4,
			};
			
			if (window.innerWidth) {
				containerInfo.x = window.innerWidth;
			} else if ((document.body) && (document.body.clientWidth)) {
				containerInfo.x = document.body.clientWidth;
			}
			
			if (window.innerHeight) {
				containerInfo.y = window.innerHeight;
			} else if ((document.body) && (document.body.clientHeight)) {
				containerInfo.y = document.body.clientHeight;
			}
			
			$(tmpLcd.children("div").get(0)).css("margin-top", containerInfo.y * temp.p_margin);
			$(tmpLcd.children("div").get(0)).removeClass("hidden");
			tmpLcd.removeClass("hidden");
			CoverPlugin.blockInput();
			CoverPlugin.coverPageShow = true;
		},
		loadingComplete:function(){
			var tmpLcd = CoverPlugin.getLoadingCoverDiv();
			$(tmpLcd.children("div").get(0)).addClass("hidden");
			tmpLcd.addClass("hidden"); 
			CoverPlugin.unBlockInput();
			CoverPlugin.coverPageShow = false;
		},
		getLoadingCoverDiv:function(){
			if(window._LCD==null){
				var spinDiv=document.createElement("i");
				spinDiv.className="fa fa-spinner fa-pulse fa-3x fa-fw";
				
				var loadingContentDiv=document.createElement("div");
				loadingContentDiv.className="dialog_progress hidden";
				loadingContentDiv.appendChild(spinDiv);
				
				var tmpLcd=document.createElement("div");
				tmpLcd.className="cover_div hidden";
				tmpLcd.id = "loadingCoverDiv";
				tmpLcd.appendChild(loadingContentDiv);
				document.body.appendChild(tmpLcd); 
				window._LCD = $("#loadingCoverDiv");
			}
			return window._LCD;
		},
		blockInput:function(){
			document.onkeydown = function(e) {
				var isie = (document.all) ? true : false;
				var key;
				var ev;
				if (isie) {//IE
					key = window.event.keyCode;
					ev = window.event;
				} else {//
					key = e.which;
					ev = e;
				}
				if (key == 9 || key == 13) {//IE
					if (isie) {
						ev.keyCode = 0;
						ev.returnValue = false;
					} else {//
						ev.which = 0;
						ev.preventDefault();
					}
				}
			};
		},
		unBlockInput:function(){
			document.onkeydown = null;
		}
}		



//loading cover end