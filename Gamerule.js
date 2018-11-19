function Gamerule(blkp) {
    var x, counts, i = 0,
        m = 0,
        n = 0,
        s = "",
        u = false,
        p = 0;
    if (!blkp) blkp = {
        clearbonus: 0,
        ubonus: 0,
        boardsize: 20,
        starts: [399, 380, 0, 19],
        data: {}
    }
    for (x in blkp.data) {
        this[x] = new Block(x, blkp.data[x].pb, blkp.data[x].pc, blkp.data[x].p);
        i++;
        p = Math.max(p, blkp.data[x].p);
        n = Math.max(n, blkp.data[x].pc.length);
        m += blkp.data[x].pc.length;
        s += x;
        if (blkp.data[x].pc.length == 1) u = this[x];
    }
    counts = new Array(n + 1);
    counts.fill(0)
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



    this.get = function (i) {
        return this[this.list.charAt(i)];
    }
    this.each = function (a) {

        var result = [];
        for (var i = 0; i < this.length; i++) {
            result.push(a(i, this.get(i), arguments));
        }
        return result;
    }
    this.clone = function () {
        var tmpblk = this.toArray();
        var blkblk = {};
        for (var i = 0; i < tmpblk.length; i++) {
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
    this.toArray = function () {
        var result = [];
        this.each(function (a, b) {
            result.push(b);
        });
        return result;
    }
    this.toString = function () {
        return this.list;
    }
}
