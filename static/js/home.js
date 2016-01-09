String.prototype.replaceAll = function(exp, newStr) {
	return this.replace(new RegExp(exp, "gm"), newStr);
};
/**
 * 原型：字符串格式化
 * @param args 格式化参数值
 */
String.prototype.format = function(args) {
	var result = this;
	if (arguments.length < 1) {
		return result;
	}

	var data = arguments; // 如果模板参数是数组
	if (arguments.length == 1 && typeof(args) == "object") {
		// 如果模板参数是对象
		data = args;
	}
	for (var key in data) {
		var value = data[key];
		if (undefined != value) {
			result = result.replaceAll("\\{" + key + "\\}", value);
		}
	}
	return result;
}
var currentpage = 1;
var constant_homeTemplate = '';
var global_pagesize = 1;
//————————————home页，发送查看最新上架书籍请求，一页五个————————————
function getbookInfo() {
	$.ajax({
			url: '/book/all',
			type: 'POST',
			dataType: 'json',
			data: {
				pagenumber: currentpage,
				pagesize: 5
			},
		})
		.done(function(data) {
			console.log(data);
			global_pagesize = data.number;
			var result = "";
			var homeTemplate = constant_homeTemplate;
			for (var i = 0; i < data.content.length; i++) {
				if (data.content[i].active == 0) {
					data.content[i].active = "下架";
				} else {
					data.content[i].active = "上架";
				}
				result += homeTemplate.format({
					picture: data.content[i].picture,
					name: data.content[i].name,
					isbn: data.content[i].isbn,
					shelftime: data.content[i].shelftime,
					author: data.content[i].author,
					releasetime: data.content[i].releasetime,
					soldnum: data.content[i].soldnum,
					remainnum: data.content[i].remainnum,
					price: data.content[i].price,
					active: data.content[i].active,
					note: data.content[i].note
				});
			}
			$('#homeBookUl').html(result);
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}
//————————————下一页————————————
function nextp() {
	currentpage++;
	if ((currentpage - 1) * 5 > global_pagesize) {
		currentpage--;
		$('#home_alert').show();
		$('#home_alert>p').html("已经到最后一页了...别戳了");
		setTimeout(function() {
			$('#home_alert').fadeOut();
		}, 3000);
	} else {
		$('#home_alert').fadeOut();
		getbookInfo();
	}
	console.log(currentpage);
}
//————————————上一页————————————
function lastp() {
	console.log("shangyiye");
	if (currentpage <= 1) {
		$('#home_alert').show();
		$('#home_alert>p').html("已经到第一页了...别戳了");
		setTimeout(function() {
			$('#home_alert').fadeOut();
		}, 3000);
	} else {
		currentpage--;
		$('#home_alert').fadeOut();
		getbookInfo();
	}
	console.log(currentpage);
}
//显示书籍详情
function showInfo() {
	$(event.target).closest('.list-group-item').find('.bookInfo').toggle();
}
//————————————页面一加载就执行————————————
$(function(){
		constant_homeTemplate = $('#book-item-temp').html();
		//————————————首页书籍展示————————————
		getbookInfo();
			//————————————显示书籍简介————————————
		$('.showInfo').click(function() {
			$('.bookInfo').toggle();
		});
})
//在home页点击加入购物车按钮，加入购物车,设置cookie
function addToChart(){
	var temp_isbn=$.cookie("shoppingChart");
	if(temp_isbn){
		temp_isbn+=','+$(event.target).closest('.list-group-item').find('.home_isbn').html();
	}else{
		temp_isbn=$(event.target).closest('.list-group-item').find('.home_isbn').html();
	}
	$.cookie("shoppingChart",temp_isbn);
}