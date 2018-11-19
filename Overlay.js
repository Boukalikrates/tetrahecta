function Overlay() {

    this.opened = false;
    this.stack = [];

    this.open = function (what) {
        if (what == undefined) what = false ? "results" : "settings";
        if (this.stack[this.stack.length - 1] != what) {
            $(".overlaytab").hide();
            this.opened = true;
            this.stack.push(what);
            if (what == "settings") {

            }
            $(".overlaytab." + what).show();
        }

    }
    this.back = function () {
        $(".overlaytab").hide();
        this.stack.pop();
        if (this.stack.length == 0) {
            this.opened = false;
        } else {
            $(".overlaytab." + this.stack[this.stack.length - 1]).show();
        }
    }
    this.close = function () {
        $(".overlaytab").hide();
        this.stack = [];
        this.opened = false;
    }
    this.save = function () {
        if (current.gone || confirm("Really start a new game?")) {
            var names = [];
            $(".ten").each(function (i) {
                names.push($("#tmname" + i).val());
            });
            current.newgame($("#timegame").is(":checked"), names, $("#grchooser").val());
            this.close();
        }
    }
    this.gameindi = function () {
        if (gone || alert("Really want to start a new game?")) {

        }
    }

    return this;
}
