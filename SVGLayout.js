class SVGLayout {
    constructor(elem) {
        this.elem = elem.find('svg').first().attr('viewBox', '0 0 800 400'); //.attr('width', 800).attr('height', 400);
        this.elem.html('\
            <defs>\
                <filter id="dilate">\
                    <feMorphology operator="dilate" radius="2"/>\
                </filter>\
            </defs>\
            <g class="mainboard"></g>\
            <g class="shapecontainer"></g>\
            <g class="shapepageindicator"></g>');

        this.mb = this.elem.find('.mainboard');
        this.sc = this.elem.find('.shapecontainer');
        this.spi = this.elem.find('.shapepageindicator');

        this.page = 1;
        this.duration = 200;

        this.sphere = 45;



        //presetup
        this.availables = [];
        this.positions = {};
        this.boardsize = 20;
        this.tilesize = 20;
        this.px = 1;
        this.page = 0;
        this.pages = 1;
        this.active = '';
        this.hover = '';
        this.translationX = 0;
        this.translationY = 0;
        this.rotation = 0;
        this.scale = 1;

    }
    setup(game) {
        this.availables = [];
        this.positions = {};
        this.boardsize = game.rule.boardsize;
        this.tilesize = 400 / this.boardsize;
        this.px = this.tilesize / 20;
        this.page = 0;
        this.pages = game.rule.pages;
        this.active = '';
        this.hover = '';
        this.translationX = this.boardsize / 2;
        this.translationY = this.boardsize / 2;
        this.rotation = 0;
        this.scale = 1;
        this.elem.attr('stroke-width', this.px * 2);
    }


    get pa() {
        return this.positions[this.active];
    }

    format(str, args) {
        str = str.toString();
        for (let key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
        return str;
    }




    //PAINTING



    makeelem(n, x, y, colour = '#444') {

        let c = n > 0 ? colour : '#444'
        let a = this.tilesize;
        let b = this.px;
        switch ((n % 5 + 5) % 5) {
            case 0: //empty
                return this.format('<rect style="" class="pk0" x="{x}" y={y} width="{w}" height="{w}" stroke-dasharray="{d4},{d12},{d8},{d12},{d8},{d12},{d8},{d12},{d8}"></rect>', {
                    x: x * a,
                    y: y * a,
                    w: 20 * b,
                    d4: 4 * b,
                    d8: 8 * b,
                    d12: 12 * b
                });
            case 1: //tile
                return this.format('<rect style="fill:{c};stroke:{c}" class="pk5" x="{x}" y={y} width="{w}" height="{w}"></rect>', {
                    c: c,
                    x: x * a + 2 * b,
                    y: y * a + 2 * b,
                    w: 16 * b
                });
            case 2: //dashed
                return this.format('<rect style="stroke:{c}" class="pk10" x="{x}" y={y} width="{w}" height="{w}" stroke-dasharray="{d4},{d8},{d8},{d8},{d8},{d8},{d8},{d8},{d8}"></rect>', {
                    c: c,
                    x: x * a + 2 * b,
                    y: y * a + 2 * b,
                    w: 16 * b,
                    d4: 4 * b,
                    d8: 8 * b
                });
            case 3: //dot
                // let d = x * a + 4 * b;
                // let l = x * a + 16 * b;
                // let p = y * a + 4 * b;
                // let v = y * a + 16 * b;
                return this.format('<rect style="fill:{c}" class="pk15" x="{x}" y={y} width="{w}" height="{w}"></rect>', {
                    c: c,
                    x: x * a + 7 * b,
                    y: y * a + 7 * b,
                    w: 6 * b
                })
            // return '<path class="ps' + n + ' pk15" style="fill:#' + s[c] + ';stroke:#000;stroke-width:' + 3 * z + '" d="M ' + d + ' ' + p + ' L ' + l + ' ' + p + ' L ' + l + ' ' + v + ' L ' + d + ' ' + v + ' z"></path>';
            default:
                return '<g></g>';
        }
    }
    makeblock(f, n, colour) {
        this.positions[f.id] = {
            x: f.pb.x * this.tilesize + 400,
            y: f.pb.y * this.tilesize,
            cx: f.pd.x * this.tilesize / 2,
            cy: f.pd.y * this.tilesize / 2,
            p: f.p
        };

        //result = '<g class="block" data-blockid="' + f.id + '"><g class="subblock" transform="scale(1,1) translate(0,0) rotate(0,' + this.positions[f.id].cx + ',' + this.positions[f.id].cy + ')">';
        let result = this.format('<g class="block" data-blockid="{0}" data-available="{3}"><g class="subblock" transform="scale(1,1) rotate(0) translate({1},{2})">',
            [f.id, -this.positions[f.id].cx, -this.positions[f.id].cy]);

        for (let i = 0; i < f.ps; i++) {
            result += this.makeelem(n, f.pc[i].x, f.pc[i].y, colour);
        }
        result += this.format('</g><circle class="blocksphere" r="{0}"></g>', [this.sphere]);
        return result;
    }

    makeshapes(guy) {
        this.availables = [];
        return guy.game.rule.each(function (a, b, c) {
            let guy = c[1];
            let that = c[2];
            let e = guy.blocks.toString().includes(b);
            let f = guy.checkavailable(b);
            let g = guy.last == b;
            let n = guy.plate;
            let colour = guy.colour;

            if (e) that.availables.push(b.id);
            return that.makeblock(b, e ? (f ? n : -4) : (g ? n + 1 : -3), colour);
        }, guy, this).join('');
    }

    makepageindicator(guy) {
        let pages = guy.game.rule.pages;
        let colour = guy.colour;
        if (pages < 2) return '';
        let result = '';
        for (let i = 0; i < pages; i++) {
            result += this.format('<circle r="{r}" class="ps0 pk10" cx="{cx}" cy="{cy}" />', {
                r: this.tilesize / 4,
                cx: 400 + this.tilesize / 2,
                cy: 200 + this.tilesize * (-i + pages / 2 - 0.5)
            });
        }
        result += this.format('<circle r="{r}" style="fill:{c};stroke:{c}" class="pk5 spicircle" cx="{cx}" cy="{cy}" transform="translate(0,0)"/>', {
            r: this.tilesize / 4,
            cx: 400 + this.tilesize / 2,
            cy: 200 + this.tilesize * (-pages / 2 + 0.5),
            c: colour
        });
        return result;
    }

    paintshapes(guy) {
        this.sc.html(this.makeshapes(guy));
        this.spi.html(this.makepageindicator(guy));
        this.changePage(this.page, true);
    }



    paint(board, colours) {
        let buffer = '';
        for (let x = 0; x < (this.boardsize); x++) {
            for (let y = 0; y < (this.boardsize); y++) {
                let n = board[x][y];
                let colour = colours[Math.floor(n / 5)]
                buffer += this.makeelem(n, x, y, colour);
            }
        }
        this.mb.html(buffer);

    }


    //MODYFYING

    findBlock(id) {
        return this.sc.find('g[data-blockid="' + id + '"]')
    }

    raiseBlock(id = this.hover) {
        if (1) { }
        this.active = id;
        this.updateSubBlock();
        this.findBlock(id).addClass('active');
    }

    dismissBlock() {
        if (this.active) {
            this.rotation = 0;
            this.scale = 1;
            this.updateSubBlock();
            this.clearBlock(this.active);
            this.findBlock(this.active).removeClass('active');
            this.active = '';
        }
    }

    hoverBlock(idlist) {
        let id = idlist.find(function (a) {
            return this.availables.includes(a.id);
        }, this).id;
        this.findBlock(this.hover).removeClass('hover');
        this.hover = id;
        this.findBlock(this.hover).addClass('hover');
    }

    changePage(p, force = false) {
        if (p < 0) p = 0
        else if (p >= this.pages) p = this.pages - 1;

        this.spi.find('.spicircle').animate({
            svgTransform: 'translate(0 ' + p * this.tilesize + ')'
        }, {
            duration: force ? 0 : this.duration,
            queue: false
        });

        if (force || p != this.page) {
            this.page = p;
            for (let i in this.positions) {
                if (this.active != i) {
                    this.clearBlock(i, force);
                }
            }
        }
    }
    clearBlock(id, instant = false) {
        let block = this.findBlock(id);
        let xx = this.positions[id].x + this.positions[id].cx;
        let yy = (this.positions[id].y + this.positions[id].cy + (this.positions[id].p - this.page) * this.tilesize * (this.boardsize + 1));
        block.animate({
            svgTransform: 'translate(' + xx + ' ' + yy + ')'
        }, {
            duration: instant ? 0 : this.duration,
            queue: false
        });
    }
    updateBlock(instant = false) {
        this.findBlock(this.active).animate({
            svgTransform: 'translate(' + this.translationX + ' ' + this.translationY + ')'
        }, {
            duration: instant ? 0 : this.duration,
            queue: false
        });
    }
    updateSubBlock() {
        /* this piece of code is for those we hate the most 😜
         * 
         * let cx=this.pa.cx;
         * let cy=this.pa.cy;
         * let sinrot=Math.cos(this.rotation*Math.PI/180-1.571);
         * let cosrot=Math.cos(this.rotation*Math.PI/180+0.001);
         * let swap=this.scale;
         * 
         * let a=(cosrot).toFixed(5);
         * let c=(-sinrot).toFixed(5);
         * let e=-cx//(-cx*cosrot+cy*sinrot).toFixed(5);
         * 
         * let b=( sinrot).toFixed(5);
         * let d=( cosrot).toFixed(5);
         * let f=-cy//(cx*sinrot-cy*cosrot).toFixed(5);
         * 
         * console.log( '{0}   {2}   {4} \n{1}   {3}   {5})'.format(a,b,c,d,e,f));
         * 
         */

        this.findBlock(this.active).find('.subblock').animate({
            svgTransform: this.format('scale(1,{0}) rotate({1}) translate({2},{3})', [this.scale, this.rotation, -this.pa.cx, -this.pa.cy])
            //svgTransform: 'matrix({0} {1} {2} {3} {4} {5})'.format(a,b,c,d,e,f)
        }, {
            duration: this.duration,
            queue: false
        });
    }





    // TRANSFORMING ACTIVE BLOCK

    alignBlock(x = 0, y = 0) {
        this.translationX = Math.round(this.translationX / this.tilesize + x) * this.tilesize - (this.rotation % 180 == 0 ? this.pa.cx : this.pa.cy) % this.tilesize;
        this.translationY = Math.round(this.translationY / this.tilesize + y) * this.tilesize - (this.rotation % 180 == 0 ? this.pa.cy : this.pa.cx) % this.tilesize;
        this.updateBlock()
    }
    glideBlock(x = this.translationX, y = this.translationY, instant = false) {
        this.translationX = x;//- this.positions[id].cx;
        this.translationY = y;//- this.positions[id].cy;
        this.updateBlock(instant);
    }

    rotateBlock(c = 0) {
        this.rotation += c * 90 * this.scale * -1;
        this.updateSubBlock();
    }
    swapBlock() {
        this.scale *= -1;
        this.updateSubBlock();
    }



}