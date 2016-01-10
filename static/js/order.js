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
var constant_orderTemplate='';
var result;
function getOrders(){
	$.ajax({
		url: '/order/get',
		type: 'POST',
		dataType: 'json',
		data: {},
	})
	.done(function(data) {
		console.log("获取订单成功");
		console.log(data);
		var contentArray=data.content;
		for(var i=0;i<contentArray.length;i++){
			orderid=contentArray[i].orderid;
			ordertime=contentArray[i].ordertime;
			ordernum=contentArray[i].ordernum;
			if(contentArray[i].orderstate==0){
				orderstate="已取消"
			}
			else{
				orderstate="有效订单"
			}
			bookprice=contentArray[i].bookprice;
			result=constant_orderTemplate.format({
				orderid:orderid,
				ordertime:ordertime,
				ordernum:ordernum,
				orderstate:orderstate,
				bookprice:bookprice
			})
			$('#myorderUl').append(result);
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
	constant_orderTemplate=$('#orderTemplate').html();
	getOrders();
})





