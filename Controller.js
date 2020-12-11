class Controller {
    constructor() {
        this.gamerules = {};
        this.base = 400;
        this.elem = $('.top');
        this.root = $(window);

        this.current = null;
        this.layout = new SVGLayout(this.elem);
        this.overlay = new Overlay(this.elem, this.current);

        this.current = new Game(this.layout, this.overlay);



        // this.element.find(".ten").each(function () {
        //     $(this).mouseover(function () {
        //         this.element.find(".elemcontainer").addClass("so" + $(this).attr(D + "n"))
        //     }).mouseout(function () {
        //         this.element.find(".elemcontainer").removeClass("so" + $(this).attr(D + "n"))
        //     })
        // });


        $(".ngbtn").click(this.save.bind(this));
        $(".ssform").submit(this.save.bind(this));
        $(".ngsts").click(this.delayedSettings.bind(this));
        $(".ngres").click(this.delayedResults.bind(this));
        $(".pixelscaling").change(this.zoom.bind(this));
        $(".grchooser").change(this.updatePlayerList.bind(this));
        $(".backoverlay").click(this.overlay.back.bind(this.overlay));
        $(".closeoverlay").click(this.overlay.close.bind(this.overlay));
        $(".cscheme").val(0).change(this, function () {
            // this.newscheme($(".cscheme").val())
        }.bind(this))


        $(".learnbots").click(this, (function (e) {
            if (false) {
                e.data.elem.find(".dev").toggle();
            } else {
                this.overlay.open("botinfo");
            }
        }).bind(this));

        $(".learnosl").click(this, (function (e) {
                this.overlay.open("osl");
        }).bind(this));


        this.root.resize(this.zoom.bind(this));
        this.root.click(this.click.bind(this));
        this.root.mouseup(this.middleclick.bind(this));
        this.root.keydown(this.key.bind(this));
        this.elem.mousemove(this.move.bind(this));
        this.elem.mousewheel(this.wheel.bind(this));
        // $(document).on('touchstart', c.touchstart);
        // $(document).on('touchmove', c.touchmove);
        // $(document).on('touchend', c.touchend);
        this.zoom();


    }

    getgamerulesjson(data, status) {
        if (status == 'success') {
            for (let i in data) {
                let rule = new Gamerule(data[i])
                this.gamerules[i] = rule;
                $(".grchooser").append("<option value=\"" + i + "\">" + i + "</value>");
            }
            this.updatePlayerList();
            this.overlay.open();
        }
    }
    updatePlayerList() {
        let gamerule = this.gamerules[$(".grchooser").val()];
        let plist = $('.playerlist');
        let glen = gamerule.starts.length;
        let plen = plist.children().length;
        if (glen > plen) {
            for (let i = plen; i < glen; i++) {
                plist.append('<label>Player <span class="te">' + (i + 1) + '</span> name<input class="tin te"pattern="[\u0410-\u042F\u0430-\u044FA-Za-z0-9_.\\-,!+]{3,30}"></label>')
            }
        } else {
            for (let i = 0; i < plen - glen; i++) {
                plist.children().last().remove();
            }

        }
        for (let i = 0; i < glen; i++) {
            plist.children().eq(i).find('.te').css('color', 'hsl( ' + (360 * i / glen + 225) + ' ,100%,50%)');
        }

    }
    delayedSettings(){
        setTimeout(function(){
            this.overlay.open('settings');
        }.bind(this),10)
    }
    delayedResults(){
        setTimeout(function(){
            this.overlay.open('results');
        }.bind(this),10)
    }

    key(e) {

        if (this.overlay.opened) {
            switch (e.key) {
                case 'Escape':
                    this.overlay.back();
                    break;
            }
        } else {
            if (this.layout.active) {
                switch (e.key) {
                    case 'Escape':
                        this.layout.dismissBlock();

                        this.current.guy().checkavailable(false, -2);
                        break;
                    case ' ':
                        this.layout.swapBlock();
                        break;
                    case 'ArrowLeft':
                    case 'a':
                        this.layout.alignBlock(-1, 0);
                        break;
                    case 'ArrowRight':
                    case 'd':
                        this.layout.alignBlock(1, 0);
                        break;
                    case 'ArrowUp':
                    case 'w':
                        this.layout.alignBlock(0, -1);
                        break;
                    case 'ArrowDown':
                    case 's':
                        this.layout.alignBlock(0, 1);
                        break;
                    case 'q':
                        this.layout.rotateBlock(1);
                        this.layout.alignBlock();
                        break;
                    case 'e':
                        this.layout.rotateBlock(-1);
                        this.layout.alignBlock();
                        break;
                    case 'Enter':
                        this.put();
                        break;
                    case 'F2':
                        this.save();
                        break;
                }
            } else {
                switch (e.key) {
                    case 'Escape':
                        this.overlay.open();
                        break;
                    case 'ArrowLeft':
                    case 'a':
                        // this.layout.hoverBlock(this.current.rule.nearest(this.layout.hover, 'left'));
                        break;
                    case 'ArrowRight':
                    case 'd':
                        // this.layout.hoverBlock(this.current.rule.nearest(this.layout.hover, 'right'));
                        break;
                    case 'ArrowUp':
                    case 'w':
                        // this.layout.hoverBlock(this.current.rule.nearest(this.layout.hover, 'up'));
                        break;
                    case 'ArrowDown':
                    case 's':
                        // current.layout.hoverBlock(this.current.rule.nearest(this.layout.hover, 'down'));
                        break;
                    case 'Enter':
                        // this.layout.raiseBlock();
                        // this.layout.alignBlock();

                        break;
                    case 188:
                        //restoregame(prompt('Paste your saved game here'));
                        break;
                    case 190:
                        // prompt('Copy this string to txt or send it via email. Don\'t try to modify this unless you want to lose your game! (and friends!!!1)', savegame());
                        break;
                    case 't':
                        this.current.guy().cputurn();
                        break;
                    case 'c':
                        // this.newscheme();
                        break;
                    case '[':
                        // this.board += 15;
                        // this.layout.elem.css("transform", "rotate(" + (board) + "deg)");
                        break;
                    case ']':
                        // this.board -= 15;
                        // this.layout.elem.css("transform", "rotate(" + (board) + "deg)");
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
                        let pn = e.key - 1;
                        if (pn == -1) pn = 9;
                        if (this.current.rule.pages > pn) {
                            this.layout.changePage(pn);
                        }
                        break;
                }
            }
        }
    }




    /* MOUSE EVENTS */
    middleclick(e) {
        if (this.layout.active && e.button == 1) {
            this.layout.swapBlock();
        }
    }
    click(e) {
        if (this.overlay.opened) {
            if (!$(e.target).parents().filter('.brandnewoverlays').length) setTimeout (this.overlay.close.bind(this.overlay),50);
        } else {
            console.log(e.button)
            if (this.layout.active) {
                if (e.button == 0) {
                    this.put();
                } else if (e.button == 1) {
                    this.layout.swapBlock();

                }
            } else {
                if (this.current.guy() !== null) {
                    let s = this.current.rule.boardsize;
                    let px = e.pageX / this.base * s - s;
                    let py = e.pageY / this.base * s;
                    if (px >= 0 && s * 0.6 > px && py >= 0 && s > py) {
                        let demand = this.current.guy().pickblock(px, py);
                        if (!this.current.gone && this.current.guy().hasblock(demand)) {
                            let px = e.pageX / this.base * 400;
                            let py = e.pageY / this.base * 400;
                            this.layout.raiseBlock(demand.id);
                            this.layout.glideBlock(px, py, true);
                            this.current.guy().checkavailable(demand, this.current.guy().plate + 2);


                        }
                    }
                }
            }
        }
    }



    move(e) {
        if (this.layout.active) {
            let px = e.pageX / this.base * 400;
            let py = e.pageY / this.base * 400;
            this.layout.glideBlock(px, py, true);
        }
    }


    wheel(e) {
        if (!this.layout.active) {
            // if (e.pageX < this.base) {
            //     if ($("#rotateboard").is(":checked")) {
            //         board -= e.deltaY > 0 ? 90 : e.deltaY < 0 ? -90 : 0;
            //         $("#elemcontainer").css("transform", "rotate(" + (board) + "deg)");
            //     }
            // } else if (e.pageX < this.base * 1.6) {
            //     let nextpage = (e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0) + this.layout.page;
            //     this.layout.changePage(nextpage);
            // }

        } else {
            this.layout.rotateBlock(e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0);
        }
    }


    save(e) {
        if(e)e.preventDefault();
        if (this.current.gone || confirm("Really start a new game?")) {
            let names = [];
            $('.tin').each(function (i) {
                names.push(this.value);
            });

            this.current.newgame(this.elem.is(":checked"), names, this.gamerules[$(".grchooser").val()]);
            this.overlay.close();
        }
        this.zoom();
    }

    put() {
        //var b = $("#dv-" + acti);
        var gtx = this.layout.translationX;
        var gty = this.layout.translationY;
        //var gty = ((e.pageX - base / 2) * (Math.sin(Math.PI * board / -180)) + (e.pageY - base / 2) * (Math.cos(Math.PI * board / -180))) + base / 2;
        if (gtx > 400 || gty > 400 || gtx < 0 || gty < 0) {
            this.layout.dismissBlock();
            this.current.guy().checkavailable(null, -2);
        } else {
            var acti = this.current.rule[this.layout.active];
            if ((this.layout.rotation / 90) % 2 == 0) {
                var hd = acti.pd.y;
                var wd = acti.pd.x;
            } else {
                var hd = acti.pd.x;
                var wd = acti.pd.y;
            }
            var xd = Math.round(gtx / this.layout.tilesize - wd / 2);
            var yd = Math.round(gty / this.layout.tilesize - hd / 2);
            //                    if (xd < 21 - wd && yd < 21 - hd && xd > -1 && yd > -1) {


            var rotac = (this.layout.rotation / 90) % 4;
            rotac = rotac < 0 ? rotac + 4 : rotac;
            var sw = this.layout.scale < 0;
            var swap = rotac % 2;
            var rx = sw ? rotac == 1 || rotac == 2 : rotac == 2 || rotac == 3;
            var ry = sw ? rotac == 0 || rotac == 1 : rotac == 1 || rotac == 2;
            this.current.guy().setblock(acti, xd, yd, swap, rx, ry, true);
            //            }
        }
    }

    zoom() {
        let wbase, hbase;
        if ($(".pixelscaling").is(":checked") && this.layout.boardsize) {
            let size = this.layout.boardsize * 20;
            wbase = Math.floor(this.root.width() / size / 2) * size;
            hbase = Math.floor(this.root.height() / size) * size;
        } else {
            if (true || this.root.width() / this.root.height() > 1) {
                wbase = Math.floor(this.root.width() / 2);
                hbase = Math.floor(this.root.height());
            } else {
                wbase = Math.floor(this.root.width());
                hbase = Math.floor(this.root.height() / 2);
            }
        }
        this.base = Math.min(wbase, hbase);
        this.elem.css("transform", "scale(" + this.base / 400 + ")");
        return this.base;
    }



}