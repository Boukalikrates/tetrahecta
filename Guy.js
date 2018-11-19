function Guy(a, n, parent) {








    this.remblock = function (a) {
        if (!this.hasblock(a)) return false;
        if (this.blocks[this.blocks.length - 1].toString() == a) {
            this.blocks.pop();
        } else {
            var i = this.blocks.toString().indexOf(a.toString()) / 2;
            this.blocks[i] = this.blocks.pop()
        }
        return this.last = a;
    }
    this.color = function () {
        return "stera".charAt(n);
    }
    this.validate = function (b, mark) {
        //var loop = b ? 1 : this.blocks.length;
        var loop = (b || this.hasblock(this.game.rule.unomino)) ? 1 : this.blocks.length;
        for (var i = 0; i < loop; i++) {
            //var bloc = b ? b : this.blocks[i];
            var bloc = b ? b : (this.hasblock(this.game.rule.unomino) ? this.game.rule.unomino : this.blocks[i]);
            for (var ix = 0; ix < 2; ix++) {
                for (var ii = 0; ii < this.game.rule.boardsize; ii++) {
                    for (var iii = 0; iii < this.game.rule.boardsize; iii++) {
                        for (var xi = 0; xi < 2; xi++) {
                            for (var xii = 0; xii < 2; xii++) {
                                if (this.setblock(bloc, ii, iii, ix, xi, xii, false, mark) && !mark) return true;
                            }
                        }
                    }
                }
            }
        }
        if (mark) this.game.paint(true);
        return false;
    }
    this.hasblock = function (blk) {
        if (!blk) return false;
        return this.blocks.toString().includes(blk.toString());
    }



    this.setblock = function (act, x, y, swap, rx, ry, draw, mark) {

        var p = this.n;
        // if(mark)console.log('[setblock]init sequence: '+p+','+act+','+x+','+y+','+swap+','+rx+','+ry+','+draw)
        var empty = true;
        var border = true;
        var corner = false;
        for (var i = 0; i < act.ps; i++) {
            if (swap) {
                var nx = ry ? (x + act.pd.y - act.pc[i].y - 1) : (x + act.pc[i].y);
                var ny = rx ? (y + act.pd.x - act.pc[i].x - 1) : (y + act.pc[i].x);
            } else {
                var nx = rx ? (x + act.pd.x - act.pc[i].x - 1) : (x + act.pc[i].x);
                var ny = ry ? (y + act.pd.y - act.pc[i].y - 1) : (y + act.pc[i].y);
            }

            if (this.game.get(nx, ny) != 0) empty = false;

            if (this.game.get(nx - 1, ny) == p ||
                this.game.get(nx + 1, ny) == p ||
                this.game.get(nx, ny - 1) == p ||
                this.game.get(nx, ny + 1) == p) border = false;

            if (this.game.get(nx - 1, ny - 1) == p ||
                this.game.get(nx - 1, ny + 1) == p ||
                this.game.get(nx + 1, ny - 1) == p ||
                this.game.get(nx + 1, ny + 1) == p ||
                rc(nx, ny) == this.game.rule.starts[p - 1]) corner = true;

        }
        if (border && corner && empty && mark) {
            for (var i = 0; i < act.ps; i++) {
                if (swap) {
                    var nx = ry ? (x + act.pd.y - act.pc[i].y - 1) : (x + act.pc[i].y);
                    var ny = rx ? (y + act.pd.x - act.pc[i].x - 1) : (y + act.pc[i].x);
                } else {
                    var nx = rx ? (x + act.pd.x - act.pc[i].x - 1) : (x + act.pc[i].x);
                    var ny = ry ? (y + act.pd.y - act.pc[i].y - 1) : (y + act.pc[i].y);
                }

                if (!(this.game.get(nx, ny) != 0) &&
                    !(this.game.get(nx - 1, ny) == p ||
                        this.game.get(nx + 1, ny) == p ||
                        this.game.get(nx, ny - 1) == p ||
                        this.game.get(nx, ny + 1) == p) &&
                    (this.game.get(nx - 1, ny - 1) == p ||
                        this.game.get(nx - 1, ny + 1) == p ||
                        this.game.get(nx + 1, ny - 1) == p ||
                        this.game.get(nx + 1, ny + 1) == p ||
                        rc(nx, ny) == this.game.rule.starts[p - 1])) this.game.tempset(nx, ny, mark);

            }
        }
        if (border && corner && empty && draw && p == this.game.player) {
            for (var i = 0; i < act.ps; i++) {
                if (swap) {
                    var nx = ry ? (x + act.pd.y - act.pc[i].y - 1) : (x + act.pc[i].y);
                    var ny = rx ? (y + act.pd.x - act.pc[i].x - 1) : (y + act.pc[i].x);
                } else {
                    var nx = rx ? (x + act.pd.x - act.pc[i].x - 1) : (x + act.pc[i].x);
                    var ny = ry ? (y + act.pd.y - act.pc[i].y - 1) : (y + act.pc[i].y);
                }
                this.game.set(nx, ny, p);

            }
            this.remblock(act);
            this.game.nextplayer();
        }
        return border && corner && empty;
    }
    this.cputurn = function (bottype) {
        if (this.n != this.game.player) return;
        var loop = this.blocks.length;
        var bestscor = 0;
        var bestmovex = [];
        var bestmovey = [];
        var bestx;
        var besty;
        var bestswap;
        var bestrx;
        var bestry;
        var besttype = "";

        for (var mbact = 0; mbact < loop; mbact++) {
            var act = this.blocks[mbact];
            for (var swap = 0; swap < 2; swap++) {
                for (var x = 0; x < this.game.rule.boardsize; x++) {
                    for (var y = 0; y < this.game.rule.boardsize; y++) {
                        for (var rx = 0; rx < 2; rx++) {
                            for (var ry = 0; ry < 2; ry++) {
                                var thisscor = 0;
                                var anyscor = false;
                                var valid = this.setblock(act, x, y, swap, rx, ry, false);
                                if (valid) {
                                    for (var i = 0; i < act.ps; i++) {
                                        if (swap) {
                                            var nx = ry ? (x + act.pd.y - act.pc[i].y - 1) : (x + act.pc[i].y);
                                            var ny = rx ? (y + act.pd.x - act.pc[i].x - 1) : (y + act.pc[i].x);
                                        } else {
                                            var nx = rx ? (x + act.pd.x - act.pc[i].x - 1) : (x + act.pc[i].x);
                                            var ny = ry ? (y + act.pd.y - act.pc[i].y - 1) : (y + act.pc[i].y);
                                        }
                                        for (var xl = 1; xl < 5; xl++) {
                                            if (xl == this.n) continue;

                                            var decided = this.game.decision(nx, ny, xl, bottype) + this.game.closestdecision(nx, ny, xl);
                                            thisscor += (Math.random() * 0.2 + 0.9) * decided;
                                            if (decided) anyscor = true;

                                        }

                                    }
                                    if (!anyscor) {
                                        //thisscor+=(Math.random()*0.2+0.9)*closestdecision(nx,ny);
                                        //anyscor=true;
                                    }
                                }
                                thisscor *= act.ps;
                                if (valid && anyscor && thisscor > bestscor) {
                                    //alert(act+" is better! ("+x+","+y+")");
                                    bestscor = thisscor;
                                    bestmovex = [];
                                    bestmovey = [];
                                    besttype = act;
                                    bestx = x;
                                    besty = y;
                                    bestswap = swap;
                                    bestrx = rx;
                                    bestry = ry;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (besttype == "") {
            //bottype==-1914?stupidob():cputurnob(-1914);
            // stupidob();
        } else {
            //console.log("[cputurnob] move for " + this.n + " bot type " + this.name + " block " + besttype + " with " + bestscor + " points")
            this.setblock(besttype, bestx, besty, bestswap, bestrx, bestry, true);
        }

    }

    this.pickblock = function (x, y) {
        for (var j = 0; j < this.blocks.length; j++) {
            var b = this.blocks[j];
            for (var i = 0; i < b.ps; i++) {
                if (b.pc[i].x + b.pb.x == x && b.pc[i].y + b.pb.y == y && b.p == this.game.layout.page) return b;
            }
        }
    }
    this.count = function () {
        var pts0 = [];
        for (var i = 0; i < this.game.rule.counts.length; i++) { //most beautiful line of tetrahecta code ^^
            pts0[i] = i * this.game.rule.counts[i];
        }
        for (i in this.blocks) {
            pts0[this.blocks[i].ps] -= this.blocks[i].ps;
        }
        return pts0;
    }
    this.countall = function () {
        var isclearbonus = this.blocks.length == 0;
        var isubonus = isclearbonus ? (this.last.ps == 1) : (this.count()[1] == 0 && this.game.gone);
        return this.count().reduce(function (a, b) {
                return a + b
            }) +
            (isclearbonus ? this.game.rule.clearbonus : 0) +
            (isubonus ? this.game.rule.ubonus : 0)
    }







    this.clone = function () {
        var tmpblock = '';
        for (var i = 0; i < this.blocks.length; i++) {
            tmpblock += this.blocks[i];
        }
        return {
            name: this.name,
            plays: this.plays,
            still: this.still,
            bot: this.bot,
            last: this.last ? this.last.toString() : "",
            blocks: this.blocks.length == 0 ? [] : tmpblock.split("")
        }
    }
    this.unclone = function (obj, n, parent) {
        var tmpblk = [];
        for (var i = 0; i < obj.blocks.length; i++) {
            tmpblk.push(parent.rule[obj.blocks[i]])
        }
        this.game = parent;
        this.n = n;
        this.name = obj.name;
        this.plays = obj.plays;
        this.still = obj.still;
        this.bot = obj.bot;
        this.last = obj.last ? parent.rule[obj.last] : "";
        this.blocks = tmpblk;
        return this;
    }
    this.toString = function () {
        var result = this.clone();
        return JSON.stringify(result);
    }


    if (typeof (a) == "object") return this.unclone(a, n, parent);
    var b = getbottype(a);
    this.game = parent;
    this.n = n;
    this.name = a ? a : "";
    this.plays = !!a;
    this.still = !!a;
    this.bot = +b;
    this.last = new Block("", {
        x: 0,
        y: 0
    }, []);
    this.blocks = [];
    if (a) this.blocks = this.game.rule.toArray();

    return this;
}
