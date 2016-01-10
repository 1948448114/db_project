$(document).ready(function() {
	var li = $(".vertical_nav .vertical_nav_body>ul").children("li");
	var float_box_c = $(".float_box").children();
	$(".vertical_nav").mouseover(
		function() {
			$(li).mouseover(function() {
				index = $(this).index();
			})
			$(".float_box").css("display", "block");
			$(float_box_c[index]).css("display", "block").siblings().hide()
		}
	)
	$(".vertical_nav").mouseout(
		function() {
			$(".float_box").hide()
		}
	)
	var user_value = $("#user_value").val();
	if (user_value) {
		$("#non_login").css("display", "none")
		$("#logined").css("display", "block")
	} else {
		$("#one1,#one2,#one3").hide();
	}
	$("#one1").click(function() {
		$("#con_one_1").css("display", "block");
		$("#con_one_4").css("display", "none");
		$("#con_one_2").css("display", "none");
		$("#con_one_3").css("display", "none");
	})
	$("#one2").click(function() {
		$("#con_one_2").css("display", "block");
		$("#con_one_1").css("display", "none");
		$("#con_one_4").css("display", "none");
		$("#con_one_3").css("display", "none");
	})
	$("#one3").click(function() {
		$("#con_one_3").css("display", "block");
		$("#con_one_1").css("display", "none");
		$("#con_one_2").css("display", "none");
		$("#con_one_4").css("display", "none");
	})
	$("#one0").click(function() {
		$("#con_one_4").css("display", "block");
		$("#con_one_1").css("display", "none");
		$("#con_one_2").css("display", "none");
		$("#con_one_3").css("display", "none");
	})
	$("#submit").click(function() {
		checkuser();
	})
	$("#addbook").click(function() {
		addbook();
	})
	$("#deletebook").click(function() {
		deletebook();
	})
	$("#findorder").click(function() {
		findorder();
	})
	$("#sebook").click(function() {
		findbook();
	})
	$("#upbook").click(function() {
		$("#update_book_block").css("display", "none");
		updatebook1();
	})
	$("#updatebook").click(function() {
		updatebook2();
	})
	$("#deleteuser").click(function() {
		deleteuser();
	})

});

function tab(a, b, c, d) {
	$("." + a).children("" + b).mouseover(function() {
		var i = $(this).index();
		$(this).addClass("" + c).siblings().removeClass("" + c);
		$("." + d + [i]).css("display", "block").siblings("." + d).hide()
	})
}


function checkuser() {
	var id = $("#admin_id").val();
	var ps = $("#admin_psw").val();
	$.ajax({
			url: '/admin/login',
			type: 'POST',
			dataType: 'json',
			data: {
				name: id,
				pwd: ps
			},
		})
		.done(function(data) {
			console.log(data);
			if (data['code'] == 200) {
				$("#non_login").css("display", "none")
				$("#logined").css("display", "block")
				$("#one1,#one2,#one3").show();
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}

function allbook() {
	$.ajax({
			url: '/book/all',
			type: 'POST',
			dataType: 'json',
		})
		.done(function(data) {
				result = {1:"已上架",0:"未上架"}
			if (data['code'] == 200) {
				var htmlInsert = " <tr class='addline row'><td class='col-sm-1'>ISBN</td><td class='col-sm-1'>书籍名称</td><td class = 'col-sm-1'>书籍图片</td><td class = 'col-sm-1'>书籍作者</td><td class = 'col-sm-1'>书籍价格</td><td class = 'col-sm-1'>已售数量</td><td class = 'col-sm-1' >库存数量</td><td class = 'col-sm-1' >上架时间</td> <td class = 'col-sm-1'>出版时间</td><td class = 'col-sm-1'>书籍状态</td> <td class = 'col-sm-1'>书籍简介</td><td class = 'col-sm-1'>操作</td></tr>";
				for (var i = 0; i < data['content'].length; i++) {
					htmlInsert += "<tr class='addline row'><td class='col-sm-1'>" + data['content'][i]['isbn'] + " </td> <td class='col-sm-1'>" + data['content'][i]['name'] + "</td> <td class='col-sm-1'>" + data['content'][i]['picture'] + "</td> <td class='col-sm-1'>" + data['content'][i]['author'] + " </td> <td class='col-sm-1'>" + data['content'][i]['price'] + " </td> <td class='col-sm-1'>" + data['content'][i]['soldnum'] + " </td> <td class='col-sm-1'>" + data['content'][i]['remainnum'] + " </td> <td class='col-sm-1'>" + data['content'][i]['shelftime'] + " </td> <td class='col-sm-1'>" + data['content'][i]['releasetime'] + " </td> <td class='col-sm-1'>" + result[data['content'][i]['active']] + " </td> <td class='col-sm-1'>" + data['content'][i]['note'] + "<td class='col-sm-1 row rowtd'><input class='bj_btn col-sm-6 btn-info' type='button' value='编辑' onclick='update_b(" + data['content'][i]['isbn'] + ")'/><input class='del_btn col-sm-6 btn-danger'type='button' value='删除' onclick='delete_b(" + data['content'][i]['isbn'] + ",1)'/></td></tr>";
				}
				$("#allbook").html(htmlInsert);
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}


function delete_user(phone_d) {
	$.ajax({
			url: '/user/remove',
			type: 'POST',
			dataType: 'json',
			data: {
				phone: phone_d,
			},
		})
		.done(function(data) {
			console.log(data);
			alert(data["content"]);
			alluser();
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}

function allorder() {
	$.ajax({
			url: '/order/all',
			type: 'POST',
			dataType: 'json',
		})
		.done(function(data) {
			result = {1:"下单成功",0:"订单取消"}
			console.log(data);
			if (data['code'] == 200) {
				var htmlInsert = "<tr class='addline tb_title row'><td class='col-sm-3'>订单号</td><td class='col-sm-1'>ISBN</td><td class='col-sm-2'>用户号</td><td class = 'col-sm-1'>订单数目</td><td class = 'col-sm-2'>订单时间</td><td class = 'col-sm-1'>订单状态</td><td class = 'col-sm-2'>书籍价格</td></tr>";
				for (var i = 0; i < data['content'].length; i++) {
					htmlInsert += "<tr class='addline tb_title row'> <td class='col-sm-3'>" + data['content'][i]['orderid'] + " </td> <td class='col-sm-1'>" + data['content'][i]['isbn'] + "</td> <td class='col-sm-2'>" + data['content'][i]['phone'] + "</td> <td class='col-sm-1'>" + data['content'][i]['ordernum'] + " </td> <td class='col-sm-2'>" + data['content'][i]['ordertime'] + " </td> <td class='col-sm-1'>" + result[data['content'][i]['orderstate']] + " </td> <td class='col-sm-2'>" + data['content'][i]['bookprice'] + "</td > </tr>";
				}

				$("#allorder").html(htmlInsert);
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}

function alluser() {
	$.ajax({
			url: '/user/all',
			type: 'POST',
			dataType: 'json',
		})
		.done(function(data) {
			if (data['code'] == 200) {
				var htmlInsert = "<tr class='addline row'><td class='col-sm-2'>用户号码</td><td class='col-sm-3'>用户名</td><td class='col-sm-3'>用户邮箱</td><td class='col-sm-3'>用户地址</td><td class='col-sm-1'>操作</td></tr>";

				for (var i = 0; i < data['content'].length; i++) {
					htmlInsert += "<tr class='addline row'><td class='col-sm-2'>" + data['content'][i]['phone'] + " </td> <td class='col-sm-3'>" + data['content'][i]['name'] + " </td> <td class='col-sm-3'>" + data['content'][i]['email'] + "</td> <td class='col-sm-3'>" + data['content'][i]['address'] + "<td class='col-sm-1 row rowtd'><input class='deluser_btn col-sm-12 btn-danger' type='button' value='删除' onclick='delete_user(" + data['content'][i]['phone'] + ")'/></td></tr>";
				}
				$("#alluser").html(htmlInsert);
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}

function addbook() {
	var book_isbn = $("#book_isbn").val();
	var book_name = $("#book_name").val();
	var book_author = $("#book_author ").val();
	var book_price = $("#book_price ").val();
	var book_remainnum = $("#book_remainnum ").val();
	var book_time = $("#book_time ").val();
	var book_shelftime = $("#book_shelftime ").val();
	var book_note = $("#book_note ").val();
	var book_active = $("#book_active ").val();
	var book_pic = $("#book_pic  ").val();


	$.ajax({
			url: '/book/new',
			type: 'POST',
			dataType: 'json',
			data: {
				isbn: book_isbn,
				name: book_name,
				author: book_author,
				price: book_price,
				remainnum: book_remainnum,
				shelftime: book_shelftime,
				releasetime: book_time,
				active: book_active,
				picture: book_pic,
				note: book_note,
			},
		})
		.done(function(data) {
			console.log(data);
			alert(data["content"]);
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}

function delete_b(book_isbn,i) {
	$.ajax({
			url: '/book/remove',
			type: 'POST',
			dataType: 'json',
			data: {
				isbn: book_isbn,
			},
		})
		.done(function(data) {
			console.log(data);
			alert(data["content"]);
				if(i==1)
				allbook();
			else
				findbook() ;
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}

function deletebook() {
	var book_isbn = $("#book_isbn_delete").val();


	$.ajax({
			url: '/book/remove',
			type: 'POST',
			dataType: 'json',
			data: {
				isbn: book_isbn,
			},
		})
		.done(function(data) {
			console.log(data);
			alert(data["content"]);
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}

function deleteuser() {
	var phone_d = $("#user_delete").val();


	$.ajax({
			url: '/user/remove',
			type: 'POST',
			dataType: 'json',
			data: {
				phone: phone_d,
			},
		})
		.done(function(data) {
			console.log(data);
			alert(data["content"]);
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}

function findorder() {
	var order_user = $("#order_user").val();


	$.ajax({
			url: '/order/find',
			type: 'POST',
			dataType: 'json',
			data: {
				phone: order_user,
			},
		})
		.done(function(data) {
			console.log(data);
			result = {1:"下单成功",0:"订单取消"}
			if (data['code'] == 200) {
				var htmlInsert = "<tr class='addline tb_title row'><td class='col-sm-3'>订单号</td><td class='col-sm-1'>ISBN</td></td><td class = 'col-sm-2'>订单数目</td><td class = 'col-sm-2'>订单时间</td><td class = 'col-sm-2'>订单状态</td><td class = 'col-sm-2'>书籍价格</td></tr>";
				for (var i = 0; i < data['content'].length; i++) {
					htmlInsert += "<tr class='addline tb_title row'> <td class='col-sm-3'>" + data['content'][i]['orderid'] + " </td> <td class='col-sm-1'>" + data['content'][i]['isbn'] + "</td> <td class='col-sm-2'>" + data['content'][i]['ordernum'] + " </td> <td class='col-sm-2'>" + data['content'][i]['ordertime'] + " </td> <td class='col-sm-2'>" + result[data['content'][i]['orderstate']] + " </td> <td class='col-sm-2'>" + data['content'][i]['bookprice'] + "</td > </tr>";
				}

				$("#user_order").html(htmlInsert);
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}

function findbook() {
	var book_isbn = $("#sbook_isbn").val();
	var book_name = $("#sbook_name").val();
	var book_author = $("#sbook_author ").val();


	$.ajax({
			url: '/book/find',
			type: 'POST',
			dataType: 'json',
			data: {
				isbn: book_isbn,
				name: book_name,
				author: book_author,
			},
		})
		.done(function(data) {
				result = {1:"已上架",0:"未上架"}
			console.log(data);
			if (data['code'] == 200) {
				var htmlInsert = " <tr class='addline row'><td class='col-sm-1'>ISBN</td><td class='col-sm-1'>书籍名称</td><td class = 'col-sm-1'>书籍图片</td><td class = 'col-sm-1'>书籍作者</td><td class = 'col-sm-1'>书籍价格</td><td class = 'col-sm-1'>已售数量</td><td class = 'col-sm-1' >库存数量</td><td class = 'col-sm-1' >上架时间</td> <td class = 'col-sm-1'>出版时间</td><td class = 'col-sm-1'>书籍状态</td> <td class = 'col-sm-1'>书籍简介</td><td class = 'col-sm-1'>操作</td></tr>";
				for (var i = 0; i < data['content'].length; i++) {
					htmlInsert += "<tr class='addline row'><td class='col-sm-1'>" + data['content'][i]['isbn'] + " </td> <td class='col-sm-1'>" + data['content'][i]['name'] + "</td> <td class='col-sm-1'>" + data['content'][i]['picture'] + "</td> <td class='col-sm-1'>" + data['content'][i]['author'] + " </td> <td class='col-sm-1'>" + data['content'][i]['price'] + " </td> <td class='col-sm-1'>" + data['content'][i]['soldnum'] + " </td> <td class='col-sm-1'>" + data['content'][i]['remainnum'] + " </td> <td class='col-sm-1'>" + data['content'][i]['shelftime'] + " </td> <td class='col-sm-1'>" + data['content'][i]['releasetime'] + " </td> <td class='col-sm-1'>" + result[data['content'][i]['active']] + " </td> <td class='col-sm-1'>" + data['content'][i]['note'] + "<td class='col-sm-1 row rowtd'><input class='bj_btn col-sm-6 btn-info' type='button' value='编辑' onclick='update_b(" + data['content'][i]['isbn'] + ")'/><input class='del_btn col-sm-6 btn-danger'type='button' value='删除' onclick='delete_b(" + data['content'][i]['isbn'] + ",2)'/></td></tr>";
				}
				$("#booklist").html(htmlInsert);
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}

function update_b(book_isbn) {
	$("#con_colum_3").css("display", "block");
	$("#con_colum_1").css("display", "none");
	$("#con_colum_2").css("display", "none");
	document.getElementById('ubook_isbn').value = book_isbn;
	$.ajax({
			url: '/book/find',
			type: 'POST',
			dataType: 'json',
			data: {
				isbn: book_isbn,
			},
		})
		.done(function(data) {
			console.log(data);
			$("#update_book_block").css("display", "block");

			document.getElementById('ubook_name').value = data['content'][0]['name'];
			document.getElementById('ubook_author').value = data['content'][0]['author'];
			document.getElementById('ubook_price').value = data['content'][0]['price'];
			document.getElementById('ubook_remainnum').value = data['content'][0]['remainnum'];
			document.getElementById('ubook_shelftime').value = data['content'][0]['shelftime'];
			document.getElementById('ubook_time').value = data['content'][0]['releasetime'];
			document.getElementById('ubook_active').value = data['content'][0]['active'];
			document.getElementById('ubook_pic').value = data['content'][0]['picture'];
			document.getElementById('ubook_note').value = data['content'][0]['note'];

			// for (var i = data['content'].length - 1; i >= 0; i--) {
			// 	console.log(data['content'][i]['name']);
			// };
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}

function updatebook1() {
	var book_isbn = $("#ubook_isbn").val();


	$.ajax({
			url: '/book/find',
			type: 'POST',
			dataType: 'json',
			data: {
				isbn: book_isbn,
			},
		})
		.done(function(data) {
			console.log(data);
			$("#update_book_block").css("display", "block");
			document.getElementById('ubook_name').value = data['content'][0]['name'];
			document.getElementById('ubook_author').value = data['content'][0]['author'];
			document.getElementById('ubook_price').value = data['content'][0]['price'];
			document.getElementById('ubook_remainnum').value = data['content'][0]['remainnum'];
			document.getElementById('ubook_shelftime').value = data['content'][0]['shelftime'];
			document.getElementById('ubook_time').value = data['content'][0]['releasetime'];
			document.getElementById('ubook_active').value = data['content'][0]['active'];
			document.getElementById('ubook_pic').value = data['content'][0]['picture'];
			document.getElementById('ubook_note').value = data['content'][0]['note'];

			// for (var i = data['content'].length - 1; i >= 0; i--) {
			// 	console.log(data['content'][i]['name']);
			// };
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}

function updatebook2() {
	var book_isbn = $("#ubook_isbn").val();
	var book_name = $("#ubook_name").val();
	var book_author = $("#ubook_author ").val();
	var book_price = $("#ubook_price ").val();
	var book_remainnum = $("#ubook_remainnum ").val();
	var book_time = $("#ubook_time ").val();
	var book_shelftime = $("#ubook_shelftime ").val();
	var book_note = $("#ubook_note ").val();
	var book_active = $("#ubook_active ").val();
	var book_pic = $("#ubook_pic  ").val();


	$.ajax({
			url: '/book/update',
			type: 'POST',
			dataType: 'json',
			data: {
				isbn: book_isbn,
				name: book_name,
				author: book_author,
				price: book_price,
				remainnum: book_remainnum,
				shelftime: book_shelftime,
				releasetime: book_time,
				active: book_active,
				picture: book_pic,
				note: book_note,
			},
		})
		.done(function(data) {
			console.log(data);
			alert(data["content"]);
			$("#update_book_block").css("display", "none");
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}