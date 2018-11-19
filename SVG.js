function SVG(elem) {

    this.init = function (elem) {

        this.elem = elem.filter('svg').first().attr('viewBox', '0 0 800 400'); //.attr('width', 800).attr('height', 400);
        this.elem.html('<g class="mainboard"></g><g class="shapecontainer"></g>');

        this.mb = this.elem.find('.mainboard');
        this.sc = this.elem.find('.shapecontainer');

        this.page = 1;
        this.duration = 200;

        this.sphere=45;
        return this;
    }

    this.setup = function (game) {
        this.positions = {};
        this.boardsize = game.rule.boardsize;
        this.tilesize = 400 / this.boardsize;
        this.px = this.tilesize / 20;
        this.page = 0;
        this.pages = game.rule.pages;
        this.active = '';
        this.translationX = 0;
        this.translationY = 0;
        this.rotation = 0;
        this.scale = 1;
        this.elem.attr('stroke-width',this.px*2);
    }






    //BASIC PAINTING


    this.makeelem = function (n, x, y) {

        var s = schememod(scheme);
        var c = n % 5;
        var i = (15 - n) % 5;
        var a = this.tilesize;
        var b = this.px;
        var z = 2 * b;
        switch (n + i) {
            case 0:
                var d = x * a + 0 * b;
                var l = x * a + 20 * b;
                var p = y * a + 0 * b;
                var v = y * a + 20 * b;
                var result = '<path class="ps' + n + ' pk0" stroke-dasharray="' + 2 * z + ',' + 6 * z + ',' + 4 * z + ',' + 6 * z + ',' + 4 * z + ',' + 6 * z + ',' + 4 * z + ', ' + 6 * z + ', ' + 4 * z + ', ' + 6 * z + '"  d="M ' + d + ' ' + p + ' L ' + l + ' ' + p + ' L ' + l + ' ' + v + ' L ' + d + ' ' + v + ' z"></path>';
                break;
            case 5:
                var d = x * a + 2 * b;
                var l = x * a + 18 * b;
                var p = y * a + 2 * b;
                var v = y * a + 18 * b;
                var result = '<path class="ps' + n + ' pk5"  d="M ' + d + ' ' + p + ' L ' + l + ' ' + p + ' L ' + l + ' ' + v + ' L ' + d + ' ' + v + ' z"></path>';

                break;
            case 10:
                var d = x * a + 2 * b;
                var l = x * a + 18 * b;
                var p = y * a + 2 * b;
                var v = y * a + 18 * b;
                var result = '<path class="ps' + c + ' pk10" stroke-dasharray="' + 2 * z + ',' + 4 * z + ',' + 4 * z + ',' + 4 * z + ',' + 4 * z + ',' + 4 * z + ',' + 4 * z + ', ' + 4 * z + ', ' + 4 * z + ', ' + 4 * z + '" d="M ' + d + ' ' + p + ' L ' + l + ' ' + p + ' L ' + l + ' ' + v + ' L ' + d + ' ' + v + ' z"></path>';
                break;
            case 15:
                var d = x * a + 4 * b;
                var l = x * a + 16 * b;
                var p = y * a + 4 * b;
                var v = y * a + 16 * b;
                var result = '<path class="ps' + n + ' pk15" style="fill:#' + s[c] + ';stroke:#000;stroke-width:' + 3 * z + '" d="M ' + d + ' ' + p + ' L ' + l + ' ' + p + ' L ' + l + ' ' + v + ' L ' + d + ' ' + v + ' z"></path>';
                break;
        }
        return result;
    }
    this.makeblock = function (f, c) {
        this.positions[f.id] = {
            x: f.pb.x * this.tilesize + 400,
            y: f.pb.y * this.tilesize,
            cx: f.pd.x * this.tilesize / 2,
            cy: f.pd.y * this.tilesize / 2,
            p: f.p
        };

        result = '<g class="block" data-blockid="' + f.id + '"><g class="subblock" transform="scale(1,1) translate(0,0) rotate(0,' + this.positions[f.id].cx + ',' + this.positions[f.id].cy + ')">';
        for (var i = 0; i < f.ps; i++) {
            result += this.makeelem(c, f.pc[i].x, f.pc[i].y);
        }
        result += '</g><circle class="blocksphere" cx="'+this.positions[f.id].cx +'" cy="'+this.positions[f.id].cy +'" r="'+this.sphere+'"></g>';
        return result;
    }

    this.makeshapes = function (guy) {
        return guy.game.rule.each(function (a, b, c) {
            var guy = c[1];
            var that = c[2];
            var e = guy.blocks.toString().includes(b);
            var f = guy.validate(b);
            var g = guy.last == b;
            var n = guy.n;
            return that.makeblock(b, e ? (f ? n : 5) : (g ? n + 5 : 10));
        }, guy, this).join('');
    }

    this.paintshapes = function (guy) {
        this.sc.html(this.makeshapes(guy));
        this.changePage(this.page, true);
    }

    this.paint = function (board) {
        buffer = '';
        for (var i = 0; i < (this.boardsize * this.boardsize); i++) {
            buffer += this.makeelem(board[rx(i)][ry(i)], rx(i), ry(i));
        }
        this.mb.html(buffer);

        //this.sc.html(this.makeshapes(current.guy()))
    }

    //MODYFYING

    this.findBlock = function (id) {
        return this.sc.find('g[data-blockid="' + id + '"]')
    }

    this.raiseBlock = function (id) {
        this.active = id;
        this.findBlock(id).addClass('active');
    }

    this.dismissBlock = function () {
        if (this.active) {
            this.rotation = 0;
            this.scale = 1;
            this.updateSubBlock();
            this.clearBlock(this.active);
            this.findBlock(this.active).removeClass('active');
            this.active = '';
        }
    }
    this.changePage = function (p, force) {
        if (p < 0) p = 0
        else if (p >= this.pages) p = this.pages - 1;

        if (force || p != this.page) {
            this.page = p;
            for (i in this.positions) {
                if (this.active != i) {
                    this.clearBlock(i, force);
                }
            }
        }
    }
    this.clearBlock = function (id, instant) {
        var block = this.findBlock(id);
        var xx = this.positions[id].x;
        var yy = (this.positions[id].y + (this.positions[id].p - this.page) * this.tilesize * (this.boardsize + 1));
        block.animate({
            svgTransform: 'translate(' + xx + ' ' + yy + ')'
        }, {
            duration: instant ? 0 : this.duration,
            queue: false
        });
    }
    this.updateBlock = function (instant) {
        this.findBlock(this.active).animate({
            svgTransform: 'translate(' + this.translationX + ' ' + this.translationY + ')'
        }, {
            duration: instant ? 0 : this.duration,
            queue: false
        });
    }
    this.updateSubBlock = function () {
        console.log('rotation:' + this.rotation + '; scale:' + this.scale);
        this.findBlock(this.active).find('.subblock').animate({
            svgTransform: 'scale(1,' + this.scale + ') translate(0,' + this.positions[this.active].cy * (-1 + this.scale) + ') rotate(' + this.rotation + ',' + this.positions[this.active].cx + ',' + this.positions[this.active].cy + ')'
        }, {
            duration: this.duration,
            queue: false
        });
    }
    this.glideBlock = function (x, y, instant) {
        var id = this.active;
        this.translationX = x === undefined ? this.translationX : x - this.positions[id].cx;
        this.translationY = y === undefined ? this.translationY : y - this.positions[id].cy;
        this.updateBlock(instant);
    }

    this.rotateBlock = function (c) {
        this.rotation += c * 90 * this.scale * -1;
        this.updateSubBlock();
    }
    this.swapBlock = function () {
        this.scale *= -1;
        this.updateSubBlock();
    }

    return this.init(elem);
}
