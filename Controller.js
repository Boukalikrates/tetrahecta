class Controller {
    constructor(server = false) {
        // editor's soundtrack => https://www.youtube.com/watch?v=a-CwwPXQl7Q
        this.gamerules = {};
        this.base = 2000;
        this.server = server;
        this.elem = $('.top');
        this.root = $(window);

        this.current = null;
        this.layout = new SVGLayout(this.elem);
        this.overlay = new Overlay(this.elem, this.current);

        this.current = new Game(this.layout, this.overlay);

        this.getroomstimeout = 0;
        this.enterroomtimeout = 0;

        this.memberindex=0;
        // this.element.find(".ten").each(function () {
        //     $(this).mouseover(function () {
        //         this.element.find(".elemcontainer").addClass("so" + $(this).attr(D + "n"))
        //     }).mouseout(function () {
        //         this.element.find(".elemcontainer").removeClass("so" + $(this).attr(D + "n"))
        //     })
        // });


        $(".identity").val(Math.random().toString(16).substr(2, 14));

        $(".gamesaver").click(this.save.bind(this));
        $(".ssform").submit(this.save.bind(this));
        $(".pixelscaling").change(this.zoom.bind(this));
        $(".grchooser").change(this.updatePlayerList.bind(this));
        $(".refreshrooms").click(this.getrooms.bind(this));
        $(".newroom").click(this.createroom.bind(this));
        $(".serverlist").click(this.clickroom.bind(this));
        $(".leaveroom").click(this.leaveroom.bind(this));
        $(".roomsettings").change(this.changeprops.bind(this));
        $('<i class="fas fa-sm fa-arrow-left backoverlay"></i>').click(this.overlay.back.bind(this.overlay)).appendTo('.overlaytab h2');
        $('<i class="fas fa-sm fa-times closeoverlay" aria-hidden="true"></i>').click(this.overlay.back.bind(this.overlay)).appendTo('.overlaytab h2');
        $("::before");
        $(".overlaytab h2::after").click(this.overlay.close.bind(this.overlay));

        $('.nicelink').each(function (_index, elem) {
            let opens = $(elem).attr('data-opens');
            $(elem).click(function () {
                setTimeout(function () {
                    this.overlay.open(opens);
                }.bind(this), 10)
                // this.overlay.open()
            }.bind(this));
        }.bind(this));


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

        if (this.server) {
            this.elem.addClass('server');
            this.getrooms();
            let hash = window.location.hash.toString();
            if (hash.includes('#room')) {
                let roomid = +hash.replace('#room', '');
                this.enterroom(roomid);
            }
        } else {
            this.layout.lockblocks(false);
            this.elem.addClass('single');
        }
        this.overlay.open('settings');
    }

    getgamerulesjson(data, status) {
        if (status == 'success') {
            for (let i in data) {
                let rule = new Gamerule(data[i])
                this.gamerules[i] = rule;
                $(".grchooser").append("<option value=\"" + i + "\">" + i + "</value>");
            }
            this.updatePlayerList();
        }
    }
    updatePlayerList() {
        if (!this.server) {
            let gamerule = this.gamerules[$(".grchooser").val()];
            let plist = $('.playerlist');
            let glen = gamerule.starts.length;
            let plen = plist.children().length;
            if (glen > plen) {
                for (let i = plen; i < glen; i++) {
                    plist.append('<label>Player <span class="te">' + (i + 1) + '</span> name<input class="tin te" pattern="[\u0410-\u042F\u0430-\u044FA-Za-z0-9 _.,!+]{3,30}"></label>')
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

    }
    save(e) {
        if (e) e.preventDefault();
        if (this.server) {
            if (this.current.gone || confirm("Really start a new game?")) {
                this.startgame();
            }
        } else {
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
    }

    put() {
        //var b = $("#dv-" + acti);
        var gtx = this.layout.translationX;
        var gty = this.layout.translationY;
        //var gty = ((e.pageX - base / 2) * (Math.sin(Math.PI * board / -180)) + (e.pageY - base / 2) * (Math.cos(Math.PI * board / -180))) + base / 2;
        if (gtx > 2000 || gty > 2000 || gtx < 0 || gty < 0) {
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
            let  moved= this.current.guy().setblock(acti, xd, yd, swap, rx, ry, true);
            if(moved){
                this.overlay.tick(0);
                if(this.server){
                    this.layout.lockblocks(this.memberindex!=this.current.player)
                    this.apisetblock({
                        block: acti.id,
                        x: xd,
                        y: yd,
                        swap: swap,
                        rx: rx,
                        ry: ry
                    });
                }
            }
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
        this.elem.css("transform", "scale(" + this.base / 2000 + ")");
        return this.base;
    }

    clickroom(e) {
        this.enterroom(+$(e.target).parentsUntil('.serverlist').addBack().eq(0).attr('data-roomid'));
    }
    getmultiplayername() {
        let name = $('.multiplayername').last().val()
        $('.multiplayername').val(name)
        return name ? name : 'Guest';
    }
    ///// API /////

    getrooms() {
        clearTimeout(this.getroomstimeout);
        let button = $('.refreshrooms');
        let rotation = +button.attr('data-rotation') + 1
        button.attr('data-rotation', rotation).find('i').css('transform', 'rotate(' + rotation * 76.77494932763278 + 'deg)');
        $.ajax({
            type: "POST",
            url: '/getrooms',
            data: {
                identity: $('.identity').val(),
                name: this.getmultiplayername()
            },
            success: this.getroomscallback.bind(this)
        });
    }
    getroomscallback(data) {
        if (data.message) console.log(message);
        this.overlay.refreshrooms(data);
        clearTimeout(this.getroomstimeout);
        this.getroomstimeout = setTimeout(this.getrooms.bind(this), 1000);
    }
    createroom() {
        $.ajax({
            type: "POST",
            url: '/createroom',
            data: {
                identity: $('.identity').val(),
                name: this.getmultiplayername()
            },
            success: this.enterroomcallback.bind(this)
        });
    }
    enterroom(roomid) {
        $.ajax({
            type: "POST",
            url: '/enterroom',
            data: {
                identity: $('.identity').val(),
                name: this.getmultiplayername(),
                roomid: (typeof roomid == "number") ? roomid : 0
            },
            success: this.enterroomcallback.bind(this)
        });
    }
    leaveroom() {
        $.ajax({
            type: "POST",
            url: '/leaveroom',
            data: {
                identity: $('.identity').val(),
                name: this.getmultiplayername()
            },
            success: this.enterroomcallback.bind(this)
        });
    }

    changeprops() {
        $.ajax({
            type: "POST",
            url: '/changeprops',
            data: {
                identity: $('.identity').val(),
                name: this.getmultiplayername(),
                props: JSON.stringify({ 
                    name: $('.roomname').val(), 
                    rule: $('.grchooser').val(), 
                    public: $('.publicroom').prop('checked') })
            },
            success: this.enterroomcallback.bind(this)
        });
    }

    startgame() {
        $.ajax({
            type: "POST",
            url: '/startgame',
            data: {
                identity: $('.identity').val(),
                name: this.getmultiplayername()
            },
            success: this.enterroomcallback.bind(this)
        });
    }

    apisetblock(props) {
        $.ajax({
            type: "POST",
            url: '/setblock',
            data: {
                identity: $('.identity').val(),
                name: this.getmultiplayername(),
                props: JSON.stringify(props)
            },
            success: this.enterroomcallback.bind(this)
        });
    }

    enterroomcallback(data) {
        if (data.data) {
            window.location.hash = '#room' + data.data.id;
            this.memberindex=data.data.memberindex; 
            if (this.current.gone && !data.data.game.gone) {
                this.overlay.close();
            }
            if (this.current.id != data.data.game.id) {
                this.current.unclone(data.data.game);
                this.layout.lockblocks(this.memberindex!=data.data.game.player);
                this.overlay.tick(this.memberindex==data.data.game.player)
            }
        } else {
            window.location.hash = '';
        }
        this.overlay.enterroom(data);
        clearTimeout(this.enterroomtimeout);
        this.enterroomtimeout = setTimeout(this.enterroom.bind(this), 1000);
    }

    ///// EVENTS /////

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




    ///// MOUSE EVENTS /////
    middleclick(e) {
        if (this.layout.active && e.button == 1) {
            this.layout.swapBlock();
        }
    }
    click(e) {
        if (this.overlay.opened) {
            if (!$(e.target).parents().filter('.brandnewoverlays').length) setTimeout(this.overlay.close.bind(this.overlay), 50);
        } else {
            if (this.layout.active) {
                if (e.button == 0) {
                    this.put();
                } else if (e.button == 1) {
                    this.layout.swapBlock();

                }
            } else {
                if (this.current.guy() !== null ) {
                    let s = this.current.rule.boardsize;
                    let px = e.pageX / this.base * s - s;
                    let py = e.pageY / this.base * s;
                    if (px >= 0 && px < 1) {
                        let pa = this.layout.pages;
                        let dest = Math.floor(py - s / 2 + pa / 2);
                        if (dest >= 0 && dest < pa)
                            this.layout.changePage(dest);
                    } else
                        if (px >= 1 && s * 0.6 > px && py >= 0 && s > py && (!this.server||this.memberindex==this.current.player)) {
                            let demand = this.current.guy().pickblock(px, py);
                            if (!this.current.gone && this.current.guy().hasblock(demand)) {
                                let px = e.pageX / this.base * 2000;
                                let py = e.pageY / this.base * 2000;
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
            let px = e.pageX / this.base * 2000;
            let py = e.pageY / this.base * 2000;
            this.layout.glideBlock(px, py, true);
        }
    }
    wheel(e) {
        if (this.overlay.opened) {
        } else {
            if (!this.layout.active) {
                if (e.pageX < this.base) {
                    // if ($("#rotateboard").is(":checked")) {
                    //     board -= e.deltaY > 0 ? 90 : e.deltaY < 0 ? -90 : 0;
                    //     $("#elemcontainer").css("transform", "rotate(" + (board) + "deg)");
                    // }
                } else if (e.pageX < this.base * 1.6) {
                    let nextpage = (e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0) + this.layout.page;
                    this.layout.changePage(nextpage);
                }

            } else {
                this.layout.rotateBlock(e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0);
            }
        }
    }
}