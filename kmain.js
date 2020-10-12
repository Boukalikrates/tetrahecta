//var blk = new Gamerule(JSON.parse(blkjson));
var D = "data-";



var shift = false;
var gone = true;
var board = 0;
var page = 0;
var scheme = 23;
var base = 400;
var lastnick = '';
var starts = [-1, 399, 380, 0, 19];
var overlay;
var current;
var gamerules={};

var pcolors = ["Ghost", "Astraea", "Nasdragul", "Jinzetsu", "Ontrin"];






function maketime(p) {
    if (current.id != p) return;
    if (current.timeless) return $("#meter-outer").hide().children().width(0).css("background-color", "#" + schememod(scheme)[0]).children().html("¯\\_(ツ)_/¯");
    if (current.gone) return $("#meter-outer").show().children().width(0).css("background-color", "#" + schememod(scheme)[0]).children().html("Game over!");
    current.time -= 1;
    if (current.time < 0) return makerandomob();
    $("#meter-outer").show().children().width((current.time / 0.69) + '%').css("background-color", "#" + schememod(scheme)[current.player]).children().html(current.time + " seconds left");
    setTimeout(function () {
        maketime(p)
    }, 1000);

}

function blockgenob(f, c) {
    var result = "";
    for (var i = 0; i < f.ps; i++) {
        result += makesvg(c, f.pc[i].x, f.pc[i].y)
    }
    return result;
}



function makesvg(n, x, y) {

    var s = schememod(scheme);
    var c = n % 5;
    var i = (15 - n) % 5;
    var a = 20;
    var b = a / 20;
    var z = 2 * b;
    switch (n + i) {
        case 0:
            //            var d=x*a+1*b;
            //            var l=x*a+19*b;
            //            var p=y*a+1*b;
            //            var v=y*a+19*b;

            var d = x * a + 2 * b;
            var l = x * a + 18 * b;
            var p = y * a + 2 * b;
            var v = y * a + 18 * b;
            //var result='<path class="pk0" d="M '+d+' '+p+' L '+l+' '+p+' L '+l+' '+v+' L '+d+' '+v+' z"></path>';
            var result = '<path class="ps' + n + ' pk0" d="M ' + d + ' ' + p + ' L ' + l + ' ' + p + ' L ' + l + ' ' + v + ' L ' + d + ' ' + v + ' z"></path>';
            break;
        case 5:
            var d = x * a + 2 * b;
            var l = x * a + 18 * b;
            var p = y * a + 2 * b;
            var v = y * a + 18 * b;
            //var result='<path class="ps'+n+' pk5" style="stroke-width:'+z+'" d="M '+d+' '+p+' L '+l+' '+p+' L '+l+' '+v+' L '+d+' '+v+' z"></path>';
            var result = '<path class="ps' + n + ' pk5" d="M ' + d + ' ' + p + ' L ' + l + ' ' + p + ' L ' + l + ' ' + v + ' L ' + d + ' ' + v + ' z"></path>';

            //var result='<path class="p'+n+' pk5" style="fill:#'+s[c]+';fill-opacity:0.3;stroke:#'+s[c]+';stroke-width:'+z+'" d="M '+d+' '+p+' L '+l+' '+p+' L '+l+' '+v+' L '+d+' '+v+' z"></path>';
            break;
        case 10:
            var d = x * a + 2 * b;
            var l = x * a + 18 * b;
            var p = y * a + 2 * b;
            var v = y * a + 18 * b;
            var result = '<path class="ps' + c + ' pk10" stroke-dasharray="' + 2 * z + ',' + 4 * z + ',' + 2 * z + ',0" style="stroke-width:' + z + '" d="M ' + d + ' ' + p + ' L ' + l + ' ' + p + ' L ' + l + ' ' + v + ' L ' + d + ' ' + v + ' z"></path>';
            break;
        case 15:
            var d = x * a + 4 * b;
            var l = x * a + 16 * b;
            var p = y * a + 4 * b;
            var v = y * a + 16 * b;
            var result = '<path class="p' + n + ' pk15" style="fill:#' + s[c] + ';stroke:#000;stroke-width:' + 3 * z + '" d="M ' + d + ' ' + p + ' L ' + l + ' ' + p + ' L ' + l + ' ' + v + ' L ' + d + ' ' + v + ' z"></path>';
            break;
    }
    return result;

}
