$(function() {

    $(document).ready(function() {
        var show_f = $('.factory').val();
        option_hide();
        $(".model >." + show_f).show();
        var show_m = $('.model').val();
        $(".release >." + show_m).show();
    });

    function option_hide() {
        $('.model > option').hide();
        $(".model ").val(" ");
        $(".release ").val(" ");
    }

    function mode_option_show(classname) {
        $(".model>." + classname).show();
    }

    function release_option_show(classname) {
        $(".release>." + classname).show();
    }

    $('.factory').bind('change', function(e) {
        option_hide()
        mode_option_show(e.target.value)
    })
    $('.model').bind('change', function(e) {
        $('.release > option').hide();
        $(".release ").val(" ");
        release_option_show(e.target.value)
    })
    $('.release').bind('change', function(e) {
        /*        window.location ='/show_detail'*/
        /*        alert(e.target.options[e.target.selectedIndex].id)*/
        var detail_title = "<div style='background-color: #dff0d8;padding:8px'>Please select below applications into build image </div>"
            +"<input class='hide' name='image_path' type='text'  value = '" + e.target.options[e.target.selectedIndex].id + "'/>" + "<div id='apklist' style='height:400px;overflow-y:scroll'><table class='col-md-12 table table-bordered' >"
        var apkhtml = "";
        $.get('/show_detail', {
                path: e.target.options[e.target.selectedIndex].id
            },
            function(data) {
                var num = 1
                for (var x = 0; x < data.apks.length; x++) {
                    var apk = data.apks[x]['name']
                    if (apk) {
                        apkhtml += "<tr><td><input id='" + apk + "' checked='checked' type='checkbox' />" + apk + "</td></tr>"
                    }
                    num += 1;
                }
                var detail_bottom = "</table></div><table class='col-md-12 table' style='border: 1px solid #ccc;'>"
                    +"<tr><th class='success' colspan='3'>You can upload applications in to build</th></tr>"
                    +"<tr><td colspan='3' class='uploadfile'><input class='upload' name='apk' multiple=\"multiple\" id='file' type='file' accept='.apk'/></td></tr>" + "</table>"
                var detail = detail_title + apkhtml + detail_bottom;
                var submit = "<table class='col-md-12 table table-bordered'><tr><td><button class='pull-right' id='build_new'  >submit</button></tr></td></table>"
                $('#detail').html(detail)
                $('#submit').html(submit)
            })

    })
    var apk_n = 1;
    $(document).on('change', 'input.upload', function() {
        if (this.value.length > 0) {
            $(this).addClass('hide');
            var close_btn = "<td><button type='button' class='close'  >&times;</button></td>";
            var line = "<p style='display: inline-block;'>" + this.files.item(0).name + "</p>";
            $(this).parent().attr('colspan','1');
            $(line).insertAfter($(this));
            insert_sign_select(this)
            $(close_btn).insertAfter($(this).parent().parent().find('.signkey').parent());
            insert_file_line(this);            
        }
    });

    function insert_file_line(obj) {
        html = "<tr ><td  colspan='3' class='uploadfile'><input class='upload' name='apk" + apk_n + "' multiple=\"multiple\" id='file' type='file' accept='.apk' /></td></tr>"
        $(html).insertAfter($(obj).parent().parent());
        apk_n += 1;
    }

    function insert_sign_select(obj) {
        var sign_html = "<td><select id='"+obj.files.item(0).name+"' class = 'signkey pull-right' style = 'min-width:120px;margin-right:20%;' >"
        +"<option id = 'Testkey'> Testkey </option>"
        +"<option id ='Media'> Media </option >"
        +"<option id = 'Shared' >Shared</option>"
        +"<option id ='Platform'>Platform</option ></select><div id='signkey'><input class='hide' name='"+obj.files.item(0).name+"' type='text'  value = 'Testkey'/></div></td>";
/*        return sign_html;*/
        $(sign_html).insertAfter($(obj).parent());        
    }


    $(document).on('click', 'button.close', function() {
        $(this).parent().parent().remove();
    });

    $(document).on('change', '.signkey', function() {
/*        alert(this.value+this.id);*/
        var signkey_html = "<input class='hide' name='"+this.id+"' type='text'  value = '" + this.value+ "'/>";
        $(this).parent().find('div#signkey').html(signkey_html);
    });

    $(document).on('click', 'button#logout', function() {
        window.location = '/logout';
    });

    $(document).on('click', 'button#build_new', function() {
        $('#waitdialog').css('top', '0');
        var domarray = new Array();
        var domarrays = new Array();
        $("#apklist input").each(function() {
            if (!$(this).is(':checked')) {
                domarrays.push(this.id)
            }
        })
        var del_list = "<input class='hide' name='del_apk' type='text'  value='" + domarrays + "'/>"
        $(del_list).insertAfter($('#detail'));
        $('#file_form').submit(function() {
            $(this).ajaxSubmit({
                url: '/',
                type: 'post',
                success: function() {
                    window.location = '/build_result';
                }
            });
            return false;
        });
    });

})