function Block(id, pb, pc, p) {
    var minx = Infinity,
        miny = Infinity,
        maxx = 0,
        maxy = 0;
    for (var i = 0; i < pc.length; i++) {
        minx = Math.min(minx, pc[i].x);
        maxx = Math.max(maxx, pc[i].x);
        miny = Math.min(miny, pc[i].y);
        maxy = Math.max(maxy, pc[i].y);
    }

    this.id = id;
    this.pd = {
        x: maxx - minx + 1,
        y: maxy - miny + 1
    }
    this.ps = pc.length;
    this.pb = pb;
    this.pc = pc;
    this.p = p;

    this.clone = function () {
        return {
            pb: this.pb,
            pc: this.pc,
            p: this.p
        }
    }

    this.toString = function () {
        return this.id;
    };
}
