class Overlay {

    constructor(elem) {
        this.elem = elem.filter('div').first();

        this.opened = false;
        this.stack = [];
        this.tabs = {};
        this.alltabs = this.elem.children();
        //this.alltabs.each(function(){})
        for (var i = 0; i < this.alltabs.length; i++) {
            this.tabs[this.alltabs.eq(i).attr('data-title')] = this.alltabs.eq(i);
        }
    }

    open(what = "settings") {
        if (this.stack[this.stack.length - 1] != what) {
            this.alltabs.hide();
            this.opened = true;
            this.stack.push(what);
            this.tabs[what].show();
        }

    }
    back() {
        this.alltabs.hide();
        this.stack.pop();
        if (this.stack.length == 0) {
            this.opened = false;
        } else {
            this.tabs[this.stack[this.stack.length - 1]].show();
        }
    }
    close() {
        this.alltabs.hide();
        this.stack = [];
        this.opened = false;
    }

    save(game) {
        if (game.gone || confirm("Really start a new game?")) {
            var names = [];
            this.tabs['settings'].search('.ten').each(function (i) {
                names.push($("#tmname" + i).val());
            });
            game.newgame(this.tabs['settings'].search("#timegame").is(":checked"), names, this.tabs['settings'].search("#grchooser").val());
            this.close();
        }
    }

    gameindi() {
        if (gone || alert("Really want to start a new game?")) {

        }
    }

}
