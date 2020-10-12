"use strict";
var c = {
    fresh: false,
    gestures: true,
    touchmode: "none",
    initialX: 0,
    initialY: 0,

    /* KEY EVENTS */
    key: function (e) {

        if (current.layout.overlay.opened) {
            switch (e.key) {
                case 'Escape':
                    current.layout.overlay.back();
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
                    case 'ArrowLeft':
                    case 'a':
                        current.layout.alignBlock(-1, 0);
                        break;
                    case 'ArrowRight':
                    case 'd':
                        current.layout.alignBlock(1, 0);
                        break;
                    case 'ArrowUp':
                    case 'w':
                        current.layout.alignBlock(0, -1);
                        break;
                    case 'ArrowDown':
                    case 's':
                        current.layout.alignBlock(0, 1);
                        break;
                    case 'q':
                        current.layout.rotateBlock(1);
                        current.layout.alignBlock();
                        break;
                    case 'e':
                        current.layout.rotateBlock(-1);
                        current.layout.alignBlock();
                        break;
                    case 'Enter':
                        c.put();
                        break;
                    case 'F2':
                        this.save();
                        break;
                }
            } else {
                switch (e.key) {
                    case 'Escape':
                    current.layout.overlay.open();
                        break;
                    case 'ArrowLeft':
                    case 'a':
                        current.layout.hoverBlock(current.rule.nearest(current.layout.hover,'left'));
                        break;
                    case 'ArrowRight':
                    case 'd':
                        current.layout.hoverBlock(current.rule.nearest(current.layout.hover,'right'));
                        break;
                    case 'ArrowUp':
                    case 'w':
                        current.layout.hoverBlock(current.rule.nearest(current.layout.hover,'up'));
                        break;
                    case 'ArrowDown':
                    case 's':
                        current.layout.hoverBlock(current.rule.nearest(current.layout.hover,'down'));
                        break;
                    case 'Enter':
                        current.layout.raiseBlock();
                        current.layout.alignBlock();

                        break;
                    case 188:
                        //restoregame(prompt('Paste your saved game here'));
                        break;
                    case 190:
                        prompt('Copy this string to txt or send it via email. Don\'t try to modify this unless you want to lose your game! (and friends!!!1)', savegame());
                        break;
                    case 't':
                        current.guy().cputurn();
                        break;
                    case 'c':
                        newscheme();
                        break;
                    case '[':
                        board += 15;
                        $("#elemcontainer").css("transform", "rotate(" + (board) + "deg)");
                        break;
                    case ']':
                        board -= 15;
                        $("#elemcontainer").css("transform", "rotate(" + (board) + "deg)");
                        break;
                    case 'F2':
                        this.save();
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




    /* MOUSE EVENTS */
    click: function (e) {
        if (current.layout.active) {
            if (e.button == 0) {
                c.put();
            } else if (e.button == 1) {
                current.layout.swapBlock();

            }
        } else {
            var s = current.rule.boardsize;
            var px = e.pageX / base * s - s;
            var py = e.pageY / base * s;
            if (px >= 0 && s * 0.6 > px && py >= 0 && s > py) {
                var demand = current.guy().pickblock(px, py);
                if (!current.gone && current.guy().hasblock(demand)) {
                    var px = e.pageX / base * 400;
                    var py = e.pageY / base * 400;
                    current.layout.raiseBlock(demand.id);
                    current.layout.glideBlock(px, py, true);
                    current.guy().validate(demand, current.guy().n + 10);


                }
            }
        }
    },



    move: function (e) {
        if (current.layout.active) {
            var px = e.pageX / base * 400;
            var py = e.pageY / base * 400;
            current.layout.glideBlock(px, py, true);
        }
    },



    wheel: function (e) {
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


    /* TOUCH EVENTS */
    touchstart: function (e) {
        var pageX = e.touches[0].pageX;
        var pageY = e.touches[0].pageY;
        if (current.layout.active) {
            if (true)
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
                    current.layout.glideBlock(px, py, true);
                    current.guy().validate(demand, current.guy().n + 10);


                }
            }
        }

    },

    touchmove: function (e) {
        if (current.layout.active) {
            var px = e.touches[0].pageX / base * 400;
            var py = e.touches[0].pageY / base * 400;
            current.layout.glideBlock(px, py, true);
        }
    },

    touchend: function (e) {

    },






    /* GENERAL FUNCTIONS */


    save:function() {
        if (current.gone || confirm("Really start a new game?")) {
            var names = [];
            $(".ten").each(function (i) {
                names.push($("#tmname" + i).val());
            });
            current.newgame($("#timegame").is(":checked"), names, $("#grchooser").val());
            current.layout.overlay.close();
        }
    },

    put: function () {
        //var b = $("#dv-" + acti);
        var gtx = current.layout.translationX;
        var gty = current.layout.translationY;
        //var gty = ((e.pageX - base / 2) * (Math.sin(Math.PI * board / -180)) + (e.pageY - base / 2) * (Math.cos(Math.PI * board / -180))) + base / 2;
        if (gtx > 400 || gty > 400 || gtx < 0 || gty < 0) {
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
            var xd = Math.round(gtx / current.layout.tilesize - wd / 2);
            var yd = Math.round(gty / current.layout.tilesize - hd / 2);
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
    }

}
