class Game {

    constructor(layout) {
        this.layout = layout;
        //        if (g) {
        //            var gamob = (typeof (g) == "string") ? JSON.parse(g) : g;
        //            this.unclone(gamob);
        //        } else {
        //            this.newgame(false, ["", "", "", "", ""], false, true)
        //        }
        this.newgame(false, ["", "", "", "", ""], false, true);
        return this;
    }

    newgame(timeless, names, gamerule, notrigger) {

        this.board = [];
        this.tempboard = [];
        this.gone = !!notrigger;
        this.timeless = timeless;
        this.player = 0;
        this.time = 69;
        this.id = qr(17041395);
        $(".olderp tr").each(function (i) {
            names[i] ? $(this).show().children().eq(0).text(names[i]) : $(this).hide();
        })



        this.rule = new Gamerule(gamerules[gamerule]);
        this.layout.setup(this);
        for (let i = 0; i < this.rule.boardsize; i++) {
            this.board.push(new Array(this.rule.boardsize).fill(0));
        }




        $(".point").text(0);
        $(".rem").text(this.rule.max);
        $(".ngres").hide();

        this.guys = [];
        for (let i = 0; i < 5; i++) {
            this.guys.push(new Guy(names[i], i, this));
        }
        if (!notrigger) {

            $("#top").removeClass("pregame");
            $("#shapecontainer").show();
            this.nextplayer();
        }

        return this;
    }

    resettemp() {
        this.tempboard = JSON.parse(JSON.stringify(this.board));
    }
    yallwhoplay() {
        var result = [];
        for (var i = 0; i < this.guys.length; i++) {
            if (this.guys[i].still) result.push(i);
        }
        return result;
    }
    guy() {
        return this.guys[this.player];
    }
    get(x, y) {
        if (x < 0 || y < 0 || x >= this.rule.boardsize || y >= this.rule.boardsize)
            return null;
        return this.board[x][y];
    }

    set(x, y, k) {
        if (x < 0 || y < 0 || x >= this.rule.boardsize || y >= this.rule.boardsize)
            return null;
        return this.board[x][y] = k;
    }
    tempset(x, y, k) {
        return this.tempboard[x][y] = k;
    }
    anybody(still) {
        return this.guys.reduce(function (total, a) {
            return total || (still ? a.still : a.plays);
        }, false);
    }


    paint(temp) {
        this.layout.paint(temp ? this.tempboard : this.board);
    }



    nextplayer(direct) {
        let nextcandidate, nextguy, i = false;
        this.layout.dismissBlock();
        this.resettemp();
        $("#point" + this.player).text(this.guy().countall());
        $("#rem" + this.player).text(Math.max(this.rule.max - this.guy().countall(), 0));
        if (!direct) {
            if (!this.anybody()) {
                alert('Nobody to play!');
                return this.layout.overlay.open();
            }




            while (!i) {
                let yallwhoplay = this.yallwhoplay();
                nextcandidate = (!yallwhoplay.includes(this.player) || yallwhoplay.indexOf(this.player) + 1 == yallwhoplay.length) ? yallwhoplay[0] : yallwhoplay[yallwhoplay.indexOf(this.player) + 1];
                nextguy = this.guys[nextcandidate];
                //alert(nextcandidate);
                i = nextguy.validate();
                if (!i) {
                    nextguy.still = false
                    if (!nextguy.bot) alert(nextguy.name + '! You have no more possible moves. Game over');
                    if (!this.anybody(true)) {
                        gameover();
                        return;
                    }
                }
            }


            this.id++;
        }
        this.time = 70;
        if (false) {


        } else {
            this.player = nextcandidate;
            this.layout.paintshapes(nextguy);
            nextguy.validate(false, 15);
            document.getElementsByTagName('META')[2].content = '#' + schememod(scheme)[this.player];
            if (this.guy().bot) {
                //    current.paint();
                //this.guy().cputurn(this.guy().bot);
                setTimeout(function () {
                    current.guy().cputurn(current.guy().bot);
                }, 100);
            } else {
                maketime(this.id);
            }
        }
    }




    gregordecision(nx, ny, xl) {
        let result = 0;
        if (this.get(nx - 1, ny - 1) == xl && this.get(nx - 1, ny) != xl && this.get(nx, ny - 1) != xl) result++;
        if (this.get(nx + 1, ny - 1) == xl && this.get(nx + 1, ny) != xl && this.get(nx, ny - 1) != xl) result++;
        if (this.get(nx - 1, ny + 1) == xl && this.get(nx - 1, ny) != xl && this.get(nx, ny + 1) != xl) result++;
        if (this.get(nx + 1, ny + 1) == xl && this.get(nx + 1, ny) != xl && this.get(nx, ny + 1) != xl) result++;
        return result * 4444;
    }
    martindecision(nx, ny, xl) {
        let result = 0;
        if (this.get(nx - 1, ny - 1) != xl && (this.get(nx - 1, ny) == xl || this.get(nx, ny - 1) == xl)) result++;
        if (this.get(nx + 1, ny - 1) != xl && (this.get(nx + 1, ny) == xl || this.get(nx, ny - 1) == xl)) result++;
        if (this.get(nx - 1, ny + 1) != xl && (this.get(nx - 1, ny) == xl || this.get(nx, ny + 1) == xl)) result++;
        if (this.get(nx + 1, ny + 1) != xl && (this.get(nx + 1, ny) == xl || this.get(nx, ny + 1) == xl)) result++;
        return result * 4444;
    }
    closestdecision(nx, ny) {
        let kx = (nx * 2 < this.rule.boardsize ? nx : this.rule.boardsize - 1 - nx) + 1;
        let ky = (ny * 2 < this.rule.boardsize ? ny : this.rule.boardsize - 1 - ny) + 1;
        return kx * ky;
    }
    decision(a, b, c, t) {
        switch (t) {
            case 1:
                return this.gregordecision(a, b, c);
            case 2:
                return this.martindecision(a, b, c);
            case 3:
                return this.martindecision(a, b, c) / 2 + this.gregordecision(a, b, c) / 2; //joseph
            case -1914:
                return this.closestdecision(a, b);
            default:
                return 0;
        }
    }





    clone() {
        let tempguys = [];
        for (let i = 0; i < this.guys.length; i++) {
            tempguys.push(this.guys[i].clone())
        }
        return {
            rule: this.rule.clone(),
            board: this.board,
            gone: this.gone,
            timeless: this.timeless,
            player: this.player,
            time: this.time,
            id: this.id,
            guys: tempguys
        }
    }
    unclone(obj) {
        this.layout.dismissBlock();
        this.rule = new Gamerule(obj.rule);
        let tempguys = [];
        for (let i = 0; i < obj.guys.length; i++) {
            tempguys.push(new Guy(obj.guys[i], i, this));
        }
        this.id = obj.id;
        this.board = obj.board;
        this.gone = obj.gone;
        this.timeless = obj.timeless;
        this.player = obj.player;
        this.time = obj.time;
        this.guys = tempguys;
        this.gone ? gameover() : ungone();
        return this;
    }


    toString() {
        return JSON.stringify(this.clone());
    }


}
