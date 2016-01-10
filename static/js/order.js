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
var orderid, ordertime, isbn, ordernum, orderstate, bookprice;
var constant_orderTemplate = '';
var constant_cancelOrderTemplate = '';
var result;
var result0;
//有效订单
function getOrders() {
	$.ajax({
			url: '/order/get',
			type: 'POST',
			dataType: 'json',
			data: {},
		})
		.done(function(data) {
			console.log("获取订单成功");
			console.log(data);
			var contentArray = data.content;
			var flag = true;
			for (var i = 0; i < contentArray.length; i++) {
				if (contentArray[i].orderstate == 1) {
					flag = false;
					break;
				}
			}
			if (!flag)
				$('#myorderUl').empty();
			for (var i = 0; i < contentArray.length; i++) {
				orderid = contentArray[i].orderid;
				ordertime = contentArray[i].ordertime;
				ordernum = contentArray[i].ordernum;
				if (contentArray[i].orderstate == 1) {
					orderstate = "有效订单"
					bookprice = contentArray[i].bookprice;
					result = constant_orderTemplate.format({
						orderid: orderid,
						ordertime: ordertime,
						ordernum: ordernum,
						orderstate: orderstate,
						bookprice: bookprice
					})
					$('#myorderUl').append(result);
				}

			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}
//已取消订单
function getCancelOrder() {
	$.ajax({
			url: '/order/get',
			type: 'POST',
			dataType: 'json',
			data: {},
		})
.done(function(data) {
		console.log("success");
		console.log("获取取消的订单成功");
		console.log(data);
		var contentArray = data.content;
		var flag = true;
		for (var i = 0; i < contentArray.length; i++) {
			if (contentArray[i].orderstate == 0) {
				flag = false;
				break;
			}
		}
		if (!flag)
			$('#cancelUl').empty();
		for (var i = 0; i < contentArray.length; i++) {
			orderid = contentArray[i].orderid;
			ordertime = contentArray[i].ordertime;
			ordernum = contentArray[i].ordernum;
			if (contentArray[i].orderstate == 0) {
				orderstate = "已取消订单"
				bookprice = contentArray[i].bookprice;
				result0 = constant_orderTemplate.format({
					orderid: orderid,
					ordertime: ordertime,
					ordernum: ordernum,
					orderstate: orderstate,
					bookprice: bookprice
				})
				$('#cancelUl').append(result0);
			}
			console.log(result0);
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});

}
//点击取消订单按钮
function cancelOrder() {
	var currentOrder = $(event.target).closest('.list-group-item').attr('oid');
	console.log(currentOrder);
	$.ajax({
			url: '/order/update',
			type: 'POST',
			dataType: 'json',
			data: {
				orderid: currentOrder,
				state: 0
			},
		})
		.done(function() {
			console.log("success");
			getOrders();
			getCancelOrder();
			location.reload();
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});

}
$(function() {
	constant_orderTemplate = $('#orderTemplate').html();
	constant_cancelOrderTemplate = $('#cancelOrderTemplate').html();
	getOrders();
	getCancelOrder();
})