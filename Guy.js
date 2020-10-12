class Guy {
    constructor(a, n, parent) {

        if (typeof (a) == "object") {
            this.unclone(a, n, parent);
        } else {
            let b = getbottype(a);
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
        }
    }






    remblock(a) {
        if (!this.hasblock(a)) return false;
        if (this.blocks[this.blocks.length - 1].toString() == a) {
            this.blocks.pop();
        } else {
            let i = this.blocks.toString().indexOf(a.toString()) / 2;
            this.blocks[i] = this.blocks.pop()
        }
        return this.last = a;
    }
    color() {
        return "stera".charAt(this.n);
    }


    // validate2(b, mark) {
    //     //let loop = b ? 1 : this.blocks.length;
    //     let loop = (b || this.hasblock(this.game.rule.unomino)) ? 1 : this.blocks.length;
    //     for (let i = 0; i < loop; i++) {
    //         //let bloc = b ? b : this.blocks[i];
    //         let bloc = b ? b : (this.hasblock(this.game.rule.unomino) ? this.game.rule.unomino : this.blocks[i]);
    //         for (let ix = 0; ix < 2; ix++) {
    //             for (let ii = 0; ii < this.game.rule.boardsize; ii++) {
    //                 for (let iii = 0; iii < this.game.rule.boardsize; iii++) {
    //                     for (let xi = 0; xi < 2; xi++) {
    //                         for (let xii = 0; xii < 2; xii++) {
    //                             if (this.setblock(bloc, ii, iii, ix, xi, xii, false, mark) && !mark) return true;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     if (mark) this.game.paint(true);
    //     return false;
    // }

    validate(b, mark) {
        for (let x = 0; x < this.game.rule.boardsize; x++) {
            for (let y = 0; y < this.game.rule.boardsize; y++) {
                if (this.empty(x, y) &&
                    this.border(x, y) &&
                    this.corner(x, y)
                ) {
                    let loop = b ? 1 : this.blocks.length;
                    for (let j = 0; j < loop; j++) {
                        let act = b ? b : this.blocks[j];
                        for (let rx = 0; rx < 2; rx++) {
                            for (let ry = 0; ry < 2; ry++) {
                                for (let swap = 0; swap < 2; swap++) {
                                    for (let i = 0; i < act.ps; i++) {
                                        if (swap) {
                                            let nx = ry ? (x - act.pd.y + act.pc[i].y + 1) : (x - act.pc[i].y);
                                            let ny = rx ? (y - act.pd.x + act.pc[i].x + 1) : (y - act.pc[i].x);
                                        } else {
                                            let nx = rx ? (x - act.pd.x + act.pc[i].x + 1) : (x - act.pc[i].x);
                                            let ny = ry ? (y - act.pd.y + act.pc[i].y + 1) : (y - act.pc[i].y);
                                        }
                                        if (this.setblock(act, nx, ny, swap, rx, ry, false, mark) && !mark) return true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (mark) this.game.paint(true);
        return false;
    }

    hasblock(blk) {
        if (!blk) return false;
        return this.blocks.toString().includes(blk.toString());
    }

    border(x, y) {
        let p = this.n;
        return !(
            this.game.get(x - 1, y) == p ||
            this.game.get(x + 1, y) == p ||
            this.game.get(x, y - 1) == p ||
            this.game.get(x, y + 1) == p);
    }

    corner(x, y) {
        let p = this.n;
        return (
            this.game.get(x - 1, y - 1) == p ||
            this.game.get(x - 1, y + 1) == p ||
            this.game.get(x + 1, y - 1) == p ||
            this.game.get(x + 1, y + 1) == p ||
            (
                this.game.rule.starts[p - 1][0]==x &&
                this.game.rule.starts[p - 1][1]==y 

            )
        )
            //rc(x, y) == this.game.rule.starts[p - 1]);
    }

    empty(x, y) {
        return (this.game.get(x, y) == 0);
    }


    setblock(act, x, y, swap, rx, ry, draw, mark) {
        //if (!this.hasblock(act)) return false;
        let p = this.n;
        let corner = false;

        for (let i = 0; i < act.ps; i++) {
            if (swap) {
                let nx = ry ? (x + act.pd.y - act.pc[i].y - 1) : (x + act.pc[i].y);
                let ny = rx ? (y + act.pd.x - act.pc[i].x - 1) : (y + act.pc[i].x);
            } else {
                let nx = rx ? (x + act.pd.x - act.pc[i].x - 1) : (x + act.pc[i].x);
                let ny = ry ? (y + act.pd.y - act.pc[i].y - 1) : (y + act.pc[i].y);
            }

            if (this.corner(nx, ny)) corner = true;
            if (!this.border(nx, ny)) return false;
            if (!this.empty(nx, ny)) return false;

        }
        if (corner && mark) {
            for (let i = 0; i < act.ps; i++) {
                if (swap) {
                    let nx = ry ? (x + act.pd.y - act.pc[i].y - 1) : (x + act.pc[i].y);
                    let ny = rx ? (y + act.pd.x - act.pc[i].x - 1) : (y + act.pc[i].x);
                } else {
                    let nx = rx ? (x + act.pd.x - act.pc[i].x - 1) : (x + act.pc[i].x);
                    let ny = ry ? (y + act.pd.y - act.pc[i].y - 1) : (y + act.pc[i].y);
                }

                if (this.empty(nx, ny) &&
                    this.border(nx, ny) &&
                    this.corner(nx, ny)) this.game.tempset(nx, ny, mark);

            }
        }
        if (corner && draw && p == this.game.player && this.hasblock(act)) {
            for (let i = 0; i < act.ps; i++) {
                if (swap) {
                    let nx = ry ? (x + act.pd.y - act.pc[i].y - 1) : (x + act.pc[i].y);
                    let ny = rx ? (y + act.pd.x - act.pc[i].x - 1) : (y + act.pc[i].x);
                } else {
                    let nx = rx ? (x + act.pd.x - act.pc[i].x - 1) : (x + act.pc[i].x);
                    let ny = ry ? (y + act.pd.y - act.pc[i].y - 1) : (y + act.pc[i].y);
                }
                this.game.set(nx, ny, p);

            }
            this.remblock(act);
            this.game.nextplayer();
        }
        return corner;
    }

    cputurn(bottype) {
        if (this.n != this.game.player) return;
        let loop = this.blocks.length;
        let bestscor = 0;
        let bestmovex = [];
        let bestmovey = [];
        let bestx;
        let besty;
        let bestswap;
        let bestrx;
        let bestry;
        let besttype = "";

        for (let mbact = 0; mbact < loop; mbact++) {
            let act = this.blocks[mbact];
            for (let swap = 0; swap < 2; swap++) {
                for (let x = 0; x < this.game.rule.boardsize; x++) {
                    for (let y = 0; y < this.game.rule.boardsize; y++) {
                        for (let rx = 0; rx < 2; rx++) {
                            for (let ry = 0; ry < 2; ry++) {
                                let thisscor = 0;
                                let anyscor = false;
                                let valid = this.setblock(act, x, y, swap, rx, ry, false);
                                if (valid) {
                                    for (let i = 0; i < act.ps; i++) {
                                        if (swap) {
                                            let nx = ry ? (x + act.pd.y - act.pc[i].y - 1) : (x + act.pc[i].y);
                                            let ny = rx ? (y + act.pd.x - act.pc[i].x - 1) : (y + act.pc[i].x);
                                        } else {
                                            let nx = rx ? (x + act.pd.x - act.pc[i].x - 1) : (x + act.pc[i].x);
                                            let ny = ry ? (y + act.pd.y - act.pc[i].y - 1) : (y + act.pc[i].y);
                                        }
                                        for (let xl = 1; xl < 5; xl++) {
                                            if (xl == this.n) continue;

                                            let decided = this.game.decision(nx, ny, xl, bottype) + this.game.closestdecision(nx, ny, xl);
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


    pickblock(x, y) {
        for (let j = 0; j < this.blocks.length; j++) {
            let b = this.blocks[j];
            for (let i = 0; i < b.ps; i++) {
                let bx = b.pc[i].x + b.pb.x;
                let by = b.pc[i].y + b.pb.y;
                if (bx - 0.5 < x && x < bx + 1.5 && by - 0.5 < y && y < by + 1.5 && b.p == this.game.layout.page) return b;
            }
        }
    }
    count() {
        let pts0 = [];
        for (let i = 0; i < this.game.rule.counts.length; i++) { //most beautiful line of tetrahecta code ^^
            pts0[i] = i * this.game.rule.counts[i];
        }
        for (i in this.blocks) {
            pts0[this.blocks[i].ps] -= this.blocks[i].ps;
        }
        return pts0;
    }
    countall() {
        let isclearbonus = this.blocks.length == 0;
        let isubonus = isclearbonus ? (this.last.ps == 1) : (this.count()[1] == 0 && this.game.gone);
        return this.count().reduce(function (a, b) {
            return a + b
        }) +
            (isclearbonus ? this.game.rule.clearbonus : 0) +
            (isubonus ? this.game.rule.ubonus : 0)
    }







    clone() {
        let tmpblock = '';
        for (let i = 0; i < this.blocks.length; i++) {
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
    unclone(obj, n, parent) {
        let tmpblk = [];
        for (let i = 0; i < obj.blocks.length; i++) {
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
    toString() {
        let result = this.clone();
        return JSON.stringify(result);
    }

}