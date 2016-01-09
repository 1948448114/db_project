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
	//增加购买数量
function addNum() {
	var number_temp = $('#id4').html();
	var number = parseInt(number_temp);
	$('#id4').html(++number);
}
//减少购买数量
function cutNum() {
	var number_temp = $('#id4').html();
	var number = parseInt(number_temp);
	if (number <= 0) {
		$('#id4').html(number);
	} else
		$('#id4').html(--number);
}
//删除购物车中书籍
function deleteChart() {
	$(event.target).closest('.list-group-item').remove();
}

function getshoppingChart() {

}
//————————————页面一加载就执行————————————
$(function() {
	//————————————展示购物车中商品————————————
})