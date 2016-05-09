/**
 * Created by m on 16-5-6.
 */

function has_read(){
    fetch('/read_message',{
        method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            all: "all",
            name: "123"
        })
    }).catch(e => console.log('read_message error',e));
}

//activity_detail

function getJoinData() {
    var send_data = {};
    send_data.activity_founder = $("#activity_founder").text();
    send_data.activity_title= $("#activity_title").text();
    send_data.activity_id = $('#key1').val();
    return send_data;
}

function getCommentData(){
    var send_data = {};
    send_data.content = $("#activity_content").val();
    send_data.activity_id = $("#key1").val();
    send_data.activity_founder = $("#activity_founder").text();
    send_data.activity_title= $("#activity_title").text();
    return send_data;
}

function activity_submit() {

    var date = new Date().toString().sub(3,21);
    $.ajax({
        url: '/activity_comment_submit',
        type: 'post',
        data: getCommentData(),
        success: function (data) {
            $(".show_activity_comment").append("<div class='activity_show_comment'>" +
                "<div class='show_user_img'>" +
                "<img src='http://www.gravatar.com/avatar/" + data.user.tx_url + "?s=50&d=retro' class='img-circle' alt='tx'>"
                + "</div>" + "<p class='comment-info'>" + data.user.name + "   发布于   " + "<span>" + date + "</span>"
                +"</p>" + "<div class='one_comment'>" + data.content + "</div> </div>"
            );
            $("#good_content").val(" ");
        },
        error: function () {
            alert('未知错误');
        }
    });
    $("#activity_content").val("");
}

function activity_join(){
    var JoinVal = $("#join_btn").text();
    console.log('IsJoin' + JoinVal);
    if (JoinVal == '参加') {
        $.ajax({
            data: getJoinData(),
            url: '/join',
            type: 'post',
            success: function (data){
                console.log(data.join);
                $("#activity_join").text(data.join);
                $("#join_btn").text(data.status);
            }

        })
    } else {
        $.ajax({
            data: getJoinData(),
            url: '/deljoin',
            type: 'post',
            success: function (data){
                console.log(data.join);
                $("#activity_join").text(data.join);
                $("#join_btn").text(data.status);
            }
        })
    }
}

//good_detail
function getGoodCommentData(){
    var send_data = {};
    send_data.content = $("#good_content").val();
    send_data.good_id = $("#key1").val();
    send_data.seller = $("#seller_name").text();
    send_data.good_name = $(".good_name").text();
    return send_data;
}

function getStarData() {
    var send_data = {};
    send_data.good_id = $("#key1").val();
    return send_data;

}

$("#good_comment_submit").click(function(){

    /* $.post('/good_comment_submit',getCommentData(), function (data) {
     console.log(data);
     });*/
    var date = new Date().toString().sub(3,21);
    $.ajax({
        url: '/good_comment_submit',
        type: 'post',
        data: getGoodCommentData(),
        success: function (data) {
            $(".show_good_comment").append("<div class='activity_show_comment'>" +
                "<div class='show_user_img'>" +
                "<img src='http://www.gravatar.com/avatar/" + data.user.tx_url + "?s=50&d=retro' class='img-circle' alt='tx'>"
                + "</div>" + "<p class='comment-info'>" + data.user.name + "   发布于   " + "<span>" + date + "</span>"
                +"</p>" + "<div class='one_comment'>" + data.content + "</div> </div>"
            );
            $("#good_content").val(" ");
        },
        error: function () {
            alert('未知错误');
        }
    });
    $("#good_content").val("");
});

function good_star() {
    var StarVal = $("#star_btn").text();
    console.log('StarVal' + StarVal);
    if (StarVal == '收藏') {
        $.ajax({
            data: getStarData(),
            url: '/star',
            type: 'post',
            success: function (data) {
                console.log(data.star);
                $("#good_star").text(data.star);
                $("#star_btn").text(data.status);
            }

        })
    } else {
        $.ajax({
            data: getStarData(),
            url: '/delstar',
            type: 'post',
            success: function (data) {
                console.log(data.star);
                $("#good_star").text(data.star);
                $("#star_btn").text(data.status);
            }
        })
    }
}

//question pages

function getQuestionCommentData(){
    var send_data = {};
    send_data.content = $("#question_content").val();
    send_data.question_id = $("#key1").val();
    send_data.question_founder = $("#question_founder").text();
    send_data.question_title= $("#question_title").text();
    return send_data;
}

function question_submit() {

    var date = new Date().toString().sub(3,21);
    $.ajax({
        url: '/question_comment_submit',
        type: 'post',
        data: getQuestionCommentData(),
        success: function (data) {
            $(".show_question_comment").append("<div class='question_show_comment'>" +
                "<div class='show_user_img'>" +
                "<img src='http://www.gravatar.com/avatar/" + data.user.tx_url + "?s=50&d=retro' class='img-circle' alt='tx'>"
                + "</div>" + "<p class='comment-info'>" + data.user.name + "   发布于   " + "<span>" + date + "</span>"
                +"</p>" + "<div class='one_comment'>" + data.content + "</div> </div>"
            );
            $("#good_content").val(" ");
        },
        error: function () {
            alert('未知错误');
        }
    });
    $("#question_content").val("");
}


//good_create pages

$(function() {
    $("#upload").click(function () {
        var data =  new FormData();
        $.each($('#fulAvatar')[0].files, function(i, file) {
            data.append('upload_file'+i, file);
        });
        /*data.append('upload', $("#fulAvatar").file);*/
        $.ajax({
            url: '/img',
            data: data,
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                $("#img_url").val("http://7xrkb1.com1.z0.glb.clouddn.com/" + data);
                $(".show_img").text("上传成功");
                $("#upload").hide();
            },
            error: function () {
                alert('出现错误');
            }
        })
    })

});
