"use strict";
var c= {
    fresh: false,
    gestures:true,
    touchmode:"none",
    initialX:0,
    initialY:0,


    key : function (e) {

        if (overlay.opened) {
            switch (e.key) {
                case 'Escape':
                    overlay.back();
                    break;
            }
        } else {
            if (current.layout.active) {
                switch (e.key) {
                    case 'Escape':
                        current.layout.dismissBlock();

                        current.guy().validate(false, 15);
                        break;
                    case ' ':
                        current.layout.swapBlock();
                        break;
                    case 'F2':
                        overlay.save();
                        break;
                }
            } else {
                switch (e.key) {
                    case 'Escape':
                        overlay.open();
                        break;
                    case 188:
                        restoregame(prompt('Paste your saved game here'));
                        break;
                    case 190:
                        prompt('Copy this string to txt or send it via email. Don\'t try to modify this unless you want to lose your game! (and friends!!!1)', savegame());
                        break;
                    case 't':
                        current.guy().cputurn();
                        break;
                    case 's':
                        newscheme();
                        break;
                    case 88:
                        board += 15;
                        $("#elemcontainer").css("transform", "rotate(" + (board) + "deg)");
                        break;
                    case 90:
                        board -= 15;
                        $("#elemcontainer").css("transform", "rotate(" + (board) + "deg)");
                        break;
                    case 'F2':
                        overlay.save();
                        break;
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                    case '0':
                        var pn = e.key - 1;
                        if (pn == -1) pn = 9;
                        if (current.rule.pages > pn) {
                            current.layout.changePage(pn);
                        }
                        break;
                }
            }
        }
    },





    click : function (e) {
        if (current.layout.active) {
            if (e.button == 0) {
                //var b = $("#dv-" + acti);
                var gtx = ((e.pageX - base / 2) * (Math.cos(Math.PI * board / -180)) - (e.pageY - base / 2) * (Math.sin(Math.PI * board / -180))) + base / 2;
                var gty = ((e.pageX - base / 2) * (Math.sin(Math.PI * board / -180)) + (e.pageY - base / 2) * (Math.cos(Math.PI * board / -180))) + base / 2;
                if (gtx > base || gty > base || gtx < 0 || gty < 0) {
                    current.layout.dismissBlock();
                    current.guy().validate(false, 15);
                } else {
                    var acti = current.rule[current.layout.active];
                    if ((current.layout.rotation / 90) % 2 == 0) {
                        var hd = acti.pd.y;
                        var wd = acti.pd.x;
                    } else {
                        var hd = acti.pd.x;
                        var wd = acti.pd.y;
                    }
                    var xd = Math.round(current.layout.boardsize * gtx / base - wd / 2);
                    var yd = Math.round(current.layout.boardsize * gty / base - hd / 2);
                    //                    if (xd < 21 - wd && yd < 21 - hd && xd > -1 && yd > -1) {


                    var rotac = (current.layout.rotation / 90) % 4;
                    rotac = rotac < 0 ? rotac + 4 : rotac;
                    var sw = current.layout.scale < 0;
                    var swap = rotac % 2;
                    var rx = sw ? rotac == 1 || rotac == 2 : rotac == 2 || rotac == 3;
                    var ry = sw ? rotac == 0 || rotac == 1 : rotac == 1 || rotac == 2;
                    current.guy().setblock(acti, xd, yd, swap, rx, ry, true);
                    //            }
                }
            } else if (e.button == 1) {
                current.layout.swapBlock();

            }
        } else {
            var s = current.rule.boardsize;
            var px = Math.floor(e.pageX / base * s) - s;
            var py = Math.floor(e.pageY / base * s);
            if (px >= 0 && s * 0.6 > px && py >= 0 && s > py) {
                var demand = current.guy().pickblock(px, py);
                if (!current.gone && current.guy().hasblock(demand)) {
                    var px = e.pageX / base * 400;
                    var py = e.pageY / base * 400;
                    current.layout.raiseBlock(demand.id);
                    current.layout.glideBlock(px, py,true);
                    current.guy().validate(demand, current.guy().n + 10);


                }
            }
        }
    },



    move : function (e) {
        if (current.layout.active) {
        var px = e.pageX / base * 400;
        var py = e.pageY / base * 400;
            current.layout.glideBlock(px, py, true);
        }
    },



    wheel : function (e) {
        if (!current.layout.active) {
            if (e.pageX < base) {
                if ($("#rotateboard").is(":checked")) {
                    board -= e.deltaY > 0 ? 90 : e.deltaY < 0 ? -90 : 0;
                    $("#elemcontainer").css("transform", "rotate(" + (board) + "deg)");
                }
            } else if (e.pageX < base * 1.6) {
                var nextpage = (e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0) + current.layout.page;
                current.layout.changePage(nextpage);
            }

        } else {
            current.layout.rotateBlock(e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0);
        }
    },

    

    touchstart:function(e){
        var pageX=e.touches[0].pageX;
        var pageY=e.touches[0].pageY;
        if (current.layout.active) {
            if(true)
            var gtx = ((pageX - base / 2) * (Math.cos(Math.PI * board / -180)) - (pageY - base / 2) * (Math.sin(Math.PI * board / -180))) + base / 2;
            var gty = ((pageX - base / 2) * (Math.sin(Math.PI * board / -180)) + (pageY - base / 2) * (Math.cos(Math.PI * board / -180))) + base / 2;
            if (gtx > base || gty > base || gtx < 0 || gty < 0) {
                current.layout.dismissBlock();
                current.guy().validate(false, 15);
            } else {
                var acti = current.rule[current.layout.active];
                if ((current.layout.rotation / 90) % 2 == 0) {
                    var hd = acti.pd.y;
                    var wd = acti.pd.x;
                } else {
                    var hd = acti.pd.x;
                    var wd = acti.pd.y;
                }
                var xd = Math.round(current.layout.boardsize * gtx / base - wd / 2);
                var yd = Math.round(current.layout.boardsize * gty / base - hd / 2);
                //                    if (xd < 21 - wd && yd < 21 - hd && xd > -1 && yd > -1) {


                var rotac = (current.layout.rotation / 90) % 4;
                rotac = rotac < 0 ? rotac + 4 : rotac;
                var sw = current.layout.scale < 0;
                var swap = rotac % 2;
                var rx = sw ? rotac == 1 || rotac == 2 : rotac == 2 || rotac == 3;
                var ry = sw ? rotac == 0 || rotac == 1 : rotac == 1 || rotac == 2;
                current.guy().setblock(acti, xd, yd, swap, rx, ry, true);
                //            }
            }
        } else {
            var s = current.rule.boardsize;
            var px = Math.floor(pageX / base * s) - s;
            var py = Math.floor(pageY / base * s);
            if (px >= 0 && s * 0.6 > px && py >= 0 && s > py) {
                var demand = current.guy().pickblock(px, py);
                if (!current.gone && current.guy().hasblock(demand)) {
                    var px = c.initialX = pageX / base * 400;
                    var py = c.initialY = pageY / base * 400;
                    current.layout.raiseBlock(demand.id);
                    current.layout.glideBlock(px, py,true);
                    current.guy().validate(demand, current.guy().n + 10);


                }
            }
        }

    },

    touchmove : function (e) {
        if (current.layout.active) {
        var px = e.touches[0].pageX / base * 400;
        var py = e.touches[0].pageY / base * 400;
            current.layout.glideBlock(px, py, true);
        }
    },

    touchend: function(e){

    }
}
