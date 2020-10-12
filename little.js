String.prototype.format = String.prototype.format ||
function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};


function qr(a) {
    return Math.floor(Math.random() * a);
}

function rc(x, y) {
    //deprecated
    return (x < 0 || x >= current.rule.boardsize || y < 0 || y >= current.rule.boardsize) ? -1 : x + y * current.rule.boardsize;
}

function rx(c) {
    //deprecated
    return c % current.rule.boardsize;
}

function ry(c) {
    //deprecated
    return (c - rx(c)) / current.rule.boardsize;
}

function grab(str, a, b) {
    return str.split(a)[1].split(b)[0];
}


function remfrom(array, elem) {
    for (var i = elem; i < array.length - 1; i++) array[i] = array[i + 1];
    array.pop();

}

function vert() {
    return $("#top").hasClass("vert") || $("#top").hasClass("sqr");
}

function getbottype(a) {
    if (!a) return 0;
    switch (a.toLowerCase()) {
        case "_bot":
            return qr(3) + 1;
        case "_gregor":
            return 1;
        case "_martin":
            return 2;
        case "_joseph":
            return 3;
    }
    return 0;
}

function zoom() {
    if ($("#pixelscaling").is(":checked")) {
        var size = current.layout.boardsize*20;
        var wcan = Math.floor($(window).width() / size / 2) * size;
        var hcan = Math.floor($(window).height() / size) * size;
    } else {
        if (true || $(window).width() / $(window).height() > 1) {
            var wcan = Math.floor($(window).width() / 2);
            var hcan = Math.floor($(window).height());
        } else {
            var wcan = Math.floor($(window).width());
            var hcan = Math.floor($(window).height() / 2);
        }
    }
    base = Math.min(wcan, hcan);
    $("#top").css("transform", "scale(" + base / 400 + ")");
}


function shakeblocks() {}

function styleblocks() {}

function allbots(n) {
    $(".tin").each(function (i) {
        var attr = $(this).attr(D + "n");
        if (attr != 0 && attr != n) $(this).val($("#kobot").val());
    })

}
