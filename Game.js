(function () {

    const Gamerule = typeof require === 'undefined' ? window.Gamerule : require("./Gamerule.js");
    const Guy = typeof require === 'undefined' ? window.Guy : require("./Guy.js");
    class Game {

        constructor(layout, overlay) {
            this.layout = layout;
            this.overlay = overlay;
            this.id = Math.floor(Math.random() * 17041395);

            //        if (g) {
            //            var gamob = (typeof (g) == "string") ? JSON.parse(g) : g;
            //            this.unclone(gamob);
            //        } else {
            //            this.newgame(false, ["", "", "", "", ""], false, true)
            //        }
            this.newgame(false, [], new Gamerule());
            return this;
        }

        newgame(timeless, names, gamerule) {

            this.id+=10;
            this.board = [];
            this.tempboard = [];
            this.timeless = timeless;
            this.player = -1;
            this.time = 69;
            this.rule = gamerule;
            this.players = this.rule.starts.length;
            this.gone = this.players == 0;

            for (let i = 0; i < this.rule.boardsize; i++) {
                this.board.push(new Array(this.rule.boardsize).fill(-5));
            }



            this.guys = [];
            for (let i = 0; i < this.players; i++) {
                this.guys.push(new Guy(names[i % this.players], i, this));
            }
            this.player = this.players - 1;
            this.layout.setup(this);
            this.overlay.setnames(this.guys, this.rule.max);
            this.overlay.hideresults();

            if (this.players > 0) {

                this.nextplayer();
            }

            return this;
        }

        resettemp() {
            this.tempboard = JSON.parse(JSON.stringify(this.board));
        }
        yallwhoplay() {
            let result = [];
            for (let i = 0; i < this.guys.length; i++) {
                if (this.guys[i].still) result.push(this.guys[i]);
            }
            return result;
        }
        guy() {
            if (this.player == -1) return null;
            return this.guys[this.player];
        }
        get(x, y) {
            // x=(x%this.rule.boardsize+this.rule.boardsize)%this.rule.boardsize;
            // y=(y%this.rule.boardsize+this.rule.boardsize)%this.rule.boardsize;

            if (x < 0 || y < 0 || x >= this.rule.boardsize || y >= this.rule.boardsize)
                return -1;
            return this.board[x][y];
        }

        set(x, y, k) {
            // x=(x%this.rule.boardsize+this.rule.boardsize)%this.rule.boardsize;
            // y=(y%this.rule.boardsize+this.rule.boardsize)%this.rule.boardsize;
            if (x < 0 || y < 0 || x >= this.rule.boardsize || y >= this.rule.boardsize)
                return -1;
            return this.board[x][y] = k;
        }
        tempset(x, y, k) {
            // x=(x%this.rule.boardsize+this.rule.boardsize)%this.rule.boardsize;
            // y=(y%this.rule.boardsize+this.rule.boardsize)%this.rule.boardsize;
            if (x < 0 || y < 0 || x >= this.rule.boardsize || y >= this.rule.boardsize)
                return -1;
            return this.tempboard[x][y] = k;
        }
        anybody(still) {
            return this.guys.reduce(function (total, a) {
                return total || (still ? a.still : a.plays);
            }, false);
        }


        paint(temp) {
            let colours = this.guys.map(p => p.colour);
            this.layout.paint(temp ? this.tempboard : this.board, colours);
        }



        nextplayer(direct) {
            let nextguy = this.guy();
            let i = false;
            this.layout.dismissBlock();
            this.resettemp();
            if (this.guy() !== null) {
                this.overlay.setscore(this.player, this.guy().countall(), Math.max(this.rule.max - this.guy().countall(), 0));
            }

            if (!direct) {
                if (!this.anybody()) {
                    this.overlay.alert('Nobody to play!');
                    return this.overlay.open();
                }
                this.id++;




                while (!i) {
                    let yallwhoplay = this.yallwhoplay();
                    nextguy = (!yallwhoplay.includes(this.guy()) || yallwhoplay.indexOf(this.guy()) + 1 == yallwhoplay.length) ? yallwhoplay[0] : yallwhoplay[yallwhoplay.indexOf(this.guy()) + 1];
                    // nextguy=yallwhoplay[0];
                    i = nextguy.checkavailable();
                    if (!i) {
                        nextguy.still = false
                        // if (!nextguy.bot) this.overlay.alert(nextguy.name + '! You have no more possible moves. Game over');
                        if (!this.anybody(true)) {
                            this.gameover();
                            return;
                        }
                    }
                }


            }
            this.time = 70;
            if (nextguy) {
                this.player = nextguy.n;
                this.layout.paintshapes(nextguy);
                nextguy.checkavailable(false, -2);
                if (this.guy().bot) {
                    //    this.paint();
                    //this.guy().cputurn(this.guy().bot);
                    setTimeout(function () {
                        this.guy().cputurn(this.guy().bot);
                    }.bind(this), 100);
                } else {
                    // maketime(this.id);
                }
            }
        }

        gameover() {

            this.gone = true;
            this.overlay.gameover(this);
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
            // this.gone ? gameover() : ungone();

            this.layout.setup(this);
            this.overlay.setnames(this.guys, this.rule.max);
            this.overlay.hideresults();
            this.nextplayer(true);
            for (let i = 0; i < this.guys.length; i++) {
                let guy=this.guys[i];
                this.overlay.setscore(i, guy.countall(), Math.max(this.rule.max - guy.countall(), 0));
            }
            if(this.guys.length>0){
                if(this.gone) this.gameover();
                else this.overlay.hideresults();
            }
                
            return this;
        }


        toString() {
            return JSON.stringify(this.clone());
        }


    }


    // Your code goes here

    if (typeof window !== 'undefined') window['Game'] = Game;
    if (typeof module !== 'undefined') module.exports = Game;

})();
