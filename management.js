function gameover() {
    current.gone = true;

    var gonetable = $("#gonetable");
    var temp = "<thead><th>Name</th>";
    var pts0 = [];
    for (var i = current.rule.counts.length - 1; i > -1; i--) {
        if (current.rule.counts[i] != 0)
            temp += "<th>" + i + "</th>";
    }
    if (current.rule.clearbonus > 0)
        temp += "<th>Clr</th>";
    if (current.rule.ubonus > 0)
        temp += "<th>UB</th>";

    temp += "<th>Total</th></thead>";
    for (var j = 0; j < current.guys.length; j++) {
        if (current.guys[j].plays) {
            var guy = current.guys[j];

            temp += "<tbody><th class=\"" + guy.color() + "\">" + guy.name + "</th>";

            for (var i = current.rule.counts.length - 1; i > -1; i--) {
                if (current.rule.counts[i] != 0)
                    temp += "<td" + (
                        current.rule.counts[i] * i == guy.count()[i] ? (" class=\"" + guy.color() + "\"") : ""
                    ) + ">" + guy.count()[i] + "</td>";
            }

            var isclearbonus = guy.blocks.length == 0;
            var isubonus = isclearbonus ? (guy.last.ps == 1) : (guy.count()[1] == 0);

            if (current.rule.clearbonus > 0)
                temp += "<td" + (
                    isclearbonus ? (" class=\"" + guy.color() + "\"") : ""
                ) + ">" + (isclearbonus ? current.rule.clearbonus : 0) + "</td>";

            if (current.rule.ubonus > 0)
                temp += "<td" + (
                    isubonus ? (" class=\"" + guy.color() + "\"") : ""
                ) + ">" + (isubonus ? current.rule.ubonus : 0) + "</td>";

            temp += "<th class=\"" + guy.color() + "\">" + (
                pts0[guy.n] =
                guy.countall()
            ) + "</th></tbody>";
        }
    }

    gonetable.html(temp);


    var ptsmax = pts0.reduce(function (a, b) {
        return Math.max(a, b)
    });
    $("#finalpts").html(ptsmax);
    $("#winner").html(
        (pts0[1] == ptsmax ? "<span class=\"t\">" + current.guys[1].name + "</span> " : "") +
        (pts0[2] == ptsmax ? "<span class=\"e\">" + current.guys[2].name + "</span> " : "") +
        (pts0[3] == ptsmax ? "<span class=\"r\">" + current.guys[3].name + "</span> " : "") +
        (pts0[4] == ptsmax ? "<span class=\"a\">" + current.guys[4].name + "</span> " : "")
    );
    current.paint(false);
    current.layout.paintshapes(current.guy());
    $("meta").eq(2).attr("content", '#' + schememod(scheme)[0]);
    maketime(current.id);
    $(".ngres").show();
    current.layout.overlay.open("results");
    //if(whosbot[1]&&whosbot[2]&&whosbot[3]&&whosbot[4])setTimeout(function(){newgame()},5000);

}

function ungone() {
    $("#top").removeClass("pregame");
    $("#shapecontainer").show();


    current.gone = false;
    current.resettemp();
    current.guy().validate(false, 15);
    current.guy().newblocks();
    current.paint(true);

    maketime(current.id);
}



function newscheme(ps) {

    $("#top").removeClass("scheme" + (scheme < 10 ? "0" : "") + scheme);
    scheme = ps ? ps - 1 : (scheme == 23 ? 0 : scheme + 1);
    $("#top").addClass("scheme" + (scheme < 10 ? "0" : "") + scheme);
    $("#cscheme").val(scheme + 1);
    $("meta").eq(2).attr("content", '#' + schememod(scheme)[current.player]);
}

function schememod(s) {
    var schemes = [
    ["444", "0040ff", "ff00c0", "ffc000", "00ff40"], //year
    ["444", "0000ff", "ff0080", "ffff00", "00ff80"], //fresh
    ["444", "4000ff", "ff0040", "c0ff00", "00ffc0"], //fruits
    ["444", "8000ff", "ff0000", "80ff00", "00ffff"], //royal
    ["444", "c000ff", "ff4000", "40ff00", "00c0ff"], //toys
    ["444", "0080ff", "ff00ff", "ff8000", "00ff00"]] //original
    var sc = s % 6;
    var sch = s - sc;
    switch (sch) {
        case 18:
            return [schemes[sc][0], schemes[sc][4], schemes[sc][1], schemes[sc][2], schemes[sc][3]];
        case 12:
            return [schemes[sc][0], schemes[sc][3], schemes[sc][4], schemes[sc][1], schemes[sc][2]];
        case 6:
            return [schemes[sc][0], schemes[sc][2], schemes[sc][3], schemes[sc][4], schemes[sc][1]];
        default:
            return [schemes[sc][0], schemes[sc][1], schemes[sc][2], schemes[sc][3], schemes[sc][4]];

    }
}
