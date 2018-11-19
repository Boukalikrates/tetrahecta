

$(document).ready(function () {

    current = new Game(new SVG($('#elemcontainer')));

    overlay = new Overlay();
    $("#cscheme").val(0);
    $(".backoverlay").click(function () {
        overlay.back();
    });
    $(".closeoverlay").click(function () {
        overlay.close();
    });
    $(".ngbtn").click(function () {
        overlay.save();
    });
    $(".ngsts").click(function () {
        overlay.open("settings");
    });
    $(".ngres").click(function () {
        overlay.open("results");
    });
    $("#learnbots").click(function () {
        if (shift) {
            $(".dev").toggle();
        } else {
            overlay.open("botinfo");
        }
    });
    $(".allbots").click(function () {
        allbots($(this).children().html())
    });

    $("#ssform").submit(function (e) {
        e.preventDefault();
        overlay.save();
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

    for (var i in gamerules) {
        $("#grchooser").append("<option value=\"" + i + "\">" + i + "</value>");
    }
    //ondragstart=oncontextmenu=function(){return false};



    $(window).resize(zoom);
    $(document).click(c.click);
    $(document).mousemove(c.move);
    $(document).keydown(c.key);
    $(document).mousewheel(c.wheel);
    $(document).on('touchstart',c.touchstart);
    $(document).on('touchmove',c.touchmove);
    $(document).on('touchend',c.touchend);
    zoom();
    newscheme();
    overlay.open();
});
