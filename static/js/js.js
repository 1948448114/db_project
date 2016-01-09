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
	$("#one1,#one2,#one3").click(function() {
		$("#con_one_4").css("display", "none")
	})
	$("#one0").click(function() {
		$("#con_one_4").css("display", "block")
	})
	$("#submit").click(function() {
		checkuser();
	})
	// 	$("#addbook").click(function() {
	// 	addbook();
	// })
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
			console.log(data);
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
				isbn:book_isbn,
				name:book_name,
				author:book_author,
				price:book_price,
				remainnum:book_remainnum,
				shelftime:book_shelftime,
				releasetime:book_time,
				active:book_active ,
				picture:book_pic,
				note:book_note ,
			},
		})
		.done(function(data) {
			console.log(data);
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
}