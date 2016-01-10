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
var orderid,ordertime,isbn,ordernum,orderstate,bookprice;
function getOrders(){
	$.ajax({
		url: '/order/get',
		type: 'POST',
		dataType: 'json',
		data: {},
	})
	.done(function(data) {
		console.log("获取订单成功");
		var contentArray=data.content;
		for(var i=0;i<contentArray.length;i++){
			orderid=contentArray[i].orderid;
			ordertime=contentArray[i].ordertime;
			ordernum=contentArray[i].ordernum;
			orderstate=contentArray[i].orderstate;
			bookprice=contentArray[i].bookprice;
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	
}
$(function(){
	
})