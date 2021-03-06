;(function(undefined) {

	function KitPage(param) {
		// 默认参数
		this.DEFAULT = {
			itemNumber: param.itemNumber || 8,// 显示几个页码项
			page: param.page || 1,
			fullPage: param.fullPage || 10,// 总共的页数
			callback: param.callback || new Function()
		};

		this.total = document.getElementById(param.totalId);
		this.join();
		// 触发事件
		this.event();
	}
	
	// KitPage.DEFAULT = {
	// 	itemNumber: 8,// 显示几个页码项
	// 	page: 1,
	// 	total: 200,// 总共的页数
	// 	callback: function(page) {
	// 		console.log(page);
	// 		// new KitPage({
	// 		// 	totalId: "aaa",
	// 		// 	page:page
	// 		// })
	// 	}
	// }

	KitPage.prototype = {
		constroctor: KitPage,
		pageTemp: function(type, index) {
			var temp = {
				prev: '<span class="kit_page_item kit_page_prev">上一页</span>\r\n',
				next: '<span class="kit_page_item kit_page_next">下一页</span>\r\n\
						<input type="text" class="kit_page_input">\r\n\
						<span>共' + this.DEFAULT.fullPage + '页</span>\r\n\
						<span class="page_sure">确定</span>',
				content: '<span class="kit_page_item kit_page_click">' + index + '</span>\r\n',
				onContent: '<span class="kit_page_item kit_page_on">' + index + '</span>\r\n'
				// symbol: '<span class="kit_page_symbol">...</span>'
			}

			return temp[type];
		},
		event: function() {
			var _this = this,
				callback = _this.DEFAULT.callback,
				page = this.total.getElementsByClassName("kit_page_click"),
				prev = this.total.getElementsByClassName("kit_page_prev")[0],
				next = this.total.getElementsByClassName("kit_page_next")[0],
				sure = this.total.getElementsByClassName("page_sure")[0],
				input = this.total.getElementsByClassName("kit_page_input")[0];

			// 单体页码的事件
			for (var i = 0; i < page.length; i++) {
				page[i].onclick = function() {
					callback(this.innerText);
				}
			}
			// 前一页事件
			prev.onclick = function() {
				callback(_this.DEFAULT.page - 1);
			};
			//后一页事件
			next.onclick = function() {
				callback(_this.DEFAULT.page + 1);
			};
			// 确定按钮事件
			sure.onclick = function() {
				var val = input.value;
				if (typeof Number(val) === "number" && val < _this.DEFAULT.fullPage) {
					callback(val);
				} else {
					console.warn("输入的页码不符合要求");
				}
			};
			// 输入框回车事件
			input.onkeydown = function(e) {
				if (e.keyCode === 13) {
					var val = input.value;
					if (typeof Number(val) === "number" && val < _this.DEFAULT.fullPage) {
						callback(val);
					} else {
						console.warn("输入的页码不符合要求");
					}
				}
			};
		},
		join: function() {
			var template = "";

			// 添加前一页
			template = this.pageTemp("prev");

			// 添加主体页码
			template += this.processPage(this.DEFAULT.page, this.DEFAULT.fullPage, this.DEFAULT.itemNumber);

			// 添加后一页及跨度跳转代码
			template += this.pageTemp("next", this.DEFAULT.fullPage);

			this.total.innerHTML = template;
		},
		// 页码处理函数
		processPage: function(now, number, itemNumber) {

			// 防止输入的是字符串形式的数字
			var saveNow = now = Number(now);
			number = new Number(number);
			itemNumber = new Number(itemNumber);

			var final = "";
			var arr = [];
			// 如果是奇数，则是一半多1，偶数则为真正的一半，已经减去now项
			var half = Math.floor(itemNumber/2) + (itemNumber%2) - 1;
			// 开始项的下标
			var start = now - half;

			// 如果前面的页码不会小于0
			if (start > 0) {
				// 把now包含进去了
				for (var i = start; i <= now; i++) {
					arr.push(i);
				}
			} else {
				for (var i = 1; i <= now; i++) {
					arr.push(i);
				}
			}
			// 补全长度
			while (arr.length < itemNumber && ((now + 1) < number)) {
				arr.push(++now);
			}

			for (var i = 0; i < arr.length; i++) {
				if (arr[i] === saveNow) {
					final += this.pageTemp("onContent", arr[i]);
				} else {
					final += this.pageTemp("content", arr[i]);
				}
				
			}

			return final;
		}
	}
	
	// 兼容 AMD 规范
	if (typeof define === 'function' && define.amd) {

		// 要求是define包裹，然后返回整个key对象即可
	    define('kitPage', [], function() {
	        return kitPage;
	    });
	}

	// 兼容CMD规范
	if(typeof define === "function" && define.cmd) {
	  define(function() {
	    return kitPage;
	  })
	}

	window.KitPage = KitPage;
})();
