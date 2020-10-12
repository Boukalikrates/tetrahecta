

$(document).ready(function () {

    current = new Game(new SVGLayout($('#elemcontainer'),$('#brandnewoverlays')));

    $("#cscheme").val(0);
    $(".backoverlay").click(function () {
        current.layout.overlay.back();
    });
    $(".closeoverlay").click(function () {
        current.layout.overlay.close();
    });
    $(".ngbtn").click(function () {
        c.save();
    });
    $(".ngsts").click(function () {
        current.layout.overlay.open("settings");
    });
    $(".ngres").click(function () {
        current.layout.overlay.open("results");
    });
    $("#learnbots").click(function () {
        if (shift) {
            $(".dev").toggle();
        } else {
            current.layout.overlay.open("botinfo");
        }
    });
    $(".allbots").click(function () {
        allbots($(this).children().html())
    });

    $("#ssform").submit(function (e) {
        e.preventDefault();
        c.save();
        return false
    });

    $("#cscheme").change(function () {
        newscheme($("#cscheme").val())
    })

    $(".ten").each(function () {
        $(this).mouseover(function () {
            $("#elemcontainer").addClass("so" + $(this).attr(D + "n"))
        }).mouseout(function () {
            $("#elemcontainer").removeClass("so" + $(this).attr(D + "n"))
        })
    });
    $.get('gamerules.json', function (data, status) {
        if (status == 'success') {
            gamerules = data;
            for (var i in gamerules) {
                $("#grchooser").append("<option value=\"" + i + "\">" + i + "</value>");
            }
            current.layout.overlay.open();
        }
    });
    //ondragstart=oncontextmenu=function(){return false};



    $(window).resize(zoom);
    $(document).click(c.click);
    $(document).mousemove(c.move);
    $(document).keydown(c.key);
    $(document).mousewheel(c.wheel);
    $(document).on('touchstart', c.touchstart);
    $(document).on('touchmove', c.touchmove);
    $(document).on('touchend', c.touchend);
    zoom();
    newscheme();

});
