class Gamerule {
    constructor(blkp) {
        let x, counts, i = 0, m = 0, n = 0, s = "", u = false, p = 0;
        if (!blkp)
            blkp = {
                clearbonus: 0,
                ubonus: 0,
                boardsize: 20,
                starts: [[19,19],[0,19],[0,0],[19,0]],
                data: {}
            };
        for (x in blkp.data) {
            this[x] = new Block(x, blkp.data[x].pb, blkp.data[x].pc, blkp.data[x].p);
            i++;
            p = Math.max(p, blkp.data[x].p);
            n = Math.max(n, blkp.data[x].pc.length);
            m += blkp.data[x].pc.length;
            s += x;
            if (blkp.data[x].pc.length == 1)
                u = this[x];
        }
        counts = new Array(n + 1);
        counts.fill(0);
        for (x in blkp.data) {
            counts[blkp.data[x].pc.length]++;
        }
        this.counts = JSON.parse(JSON.stringify(counts));
        this.length = i;
        this.max = m;
        this.list = s;
        this.pages = p + 1;
        this.ubonus = blkp.ubonus;
        this.starts = blkp.starts;
        this.clearbonus = blkp.clearbonus;
        this.boardsize = blkp.boardsize;
        this.unomino = u;
    }
    get(i) {
        return this[this.list.charAt(i)];
    }


    nearest(j, direction) {
        let ox, oy;
        if (j && this[j]) {
            let blk = this[j];
            ox = blk.rbc.x;
            oy = blk.rbc.y + blk.p * (this.boardsize + 1);
        } else {
            ox = 0;
            oy = 0;
        }
        let rank = this.each(function (a, b, c) {
            let xx = b.rbc.x ;
            let yy = b.rbc.y+ b.p * (c[4].boardsize + 1);
            let x, y;
            switch (c[3]) {
                case 'left':
                    x = c[1] - xx;
                    y = c[2] - yy;
                    break;
                case 'right':
                    x = xx - c[1];
                    y = yy - c[2];
                    break;
                case 'up':
                    y = c[1] - xx;
                    x = c[2] - yy;
                    break;
                case 'down':
                default:
                    y = xx - c[1];
                    x = yy - c[2];
                    break;

            }

            return {
                id: b.id,
                f: 5 * x / (x * x + y * y + 0.1)
                //Screenshot_3D Grapher_20180417-131453.png
            }
        }, ox, oy, direction,this);
        rank.sort(function (a, b) {
            return b.f - a.f;
        })
        return rank;

    }
    each(a) {
        let result = [];
        for (let i = 0; i < this.length; i++) {
            result.push(a(i, this.get(i), arguments));
        }
        return result;
    }
    clone() {
        let tmpblk = this.toArray();
        let blkblk = {};
        for (let i = 0; i < tmpblk.length; i++) {
            blkblk[tmpblk[i].id] = tmpblk[i].clone();
        }
        return {
            data: blkblk,
            clearbonus: this.clearbonus,
            ubonus: this.ubonus,
            boardsize: this.boardsize,
            starts: this.starts
        };
    }
    toArray() {
        let result = [];
        this.each(function (a, b) {
            result.push(b);
        });
        return result;
    }
    toString() {
        return this.list;
    }
}

