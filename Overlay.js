class Overlay {

    constructor(top, game) {
        this.game = game;
        this.elem = top.find('.brandnewoverlays').first();
        this.opened = false;
        this.stack = [];
        this.tabs = {};
        this.timeout=0;
        this.alltabs = this.elem.children();
        //this.alltabs.each(function(){})
        for (var i = 0; i < this.alltabs.length; i++) {
            this.tabs[this.alltabs.eq(i).attr('data-title')] = this.alltabs.eq(i);
        }



        //sidepanel
        this.panel = top.find('.panel').first();
        this.table = this.panel.find('table');


    }

    open(what = "settings") {
        if (this.stack[this.stack.length - 1] != what) {
            this.alltabs.css('display','none');
            this.opened = true;
            this.stack.push(what);
            this.tabs[what].css('display','flex');
            
        }
    }
    back() {
        this.alltabs.css('display','none');
        this.stack.pop();
        if (this.stack.length == 0) {
            this.opened = false;
        } else {
            this.tabs[this.stack[this.stack.length - 1]].css('display','flex');
        }
    }
    close() {
        this.alltabs.css('display','none');
        this.stack = [];
        this.opened = false;
    }

    hideresults() {

        this.panel.find(".ngres").hide();
    }

    gameindi() {
        if (gone || alert("Really want to start a new game?")) {

        }
    }

    gameover(current) {
        let gonetable = this.elem.find('.gonetable');
        let temp = "<thead><th>Name</th>";
        let pts0 = [];
        for (let i = current.rule.counts.length - 1; i > -1; i--) {
            if (current.rule.counts[i] != 0)
                temp += "<th>" + i + "</th>";
        }
        if (current.rule.clearbonus > 0)
            temp += "<th>Clr</th>";
        if (current.rule.ubonus > 0)
            temp += "<th>UB</th>";

        temp += "<th>Total</th></thead>";
        for (let j = 0; j < current.guys.length; j++) {
            if (current.guys[j].plays) {
                let guy = current.guys[j];
                pts0.push(guy.countall());
                let colour = ' style="color:' + guy.colour + '"'

                temp += "<tr><th" + colour + ">" + guy.name + "</th>";

                for (let i = current.rule.counts.length - 1; i > -1; i--) {
                    if (current.rule.counts[i] != 0)
                        temp += "<td" + (current.rule.counts[i] * i == guy.count()[i] ? colour : "") + ">" + guy.count()[i] + "</td>";
                }

                let isclearbonus = guy.blocks.length == 0;
                let isubonus = isclearbonus ? (guy.last.ps == 1) : (guy.count()[1] == 0);

                if (current.rule.clearbonus > 0)
                    temp += "<td" + (isclearbonus ? colour : "") + ">" + (isclearbonus ? current.rule.clearbonus : 0) + "</td>";

                if (current.rule.ubonus > 0)
                    temp += "<td" + (isubonus ? colour : "") + ">" + (isubonus ? current.rule.ubonus : 0) + "</td>";

                temp += "<th" + colour + ">" + (pts0[pts0.length - 1]) + "</th></tr>";
            }
        }

        gonetable.html(temp);


        let ptsmax = pts0.reduce(function (a, b) {
            return Math.max(a, b)
        });
        let winner = "";
        let maxscore=0;
        for (let i = 0; i < pts0.length; i++) {
            if (pts0[i] == ptsmax) maxscore++;
        }
        this.elem.find(".great").html(maxscore>1?'The Great Winners are':'The Great Winner is');

        for (let i = 0; i < pts0.length; i++) {
            if (pts0[i] == ptsmax){
                maxscore--;
                winner += '<span style="color:' + current.guys[i].colour + '">' + current.guys[i].name + "</span>";
                if(maxscore>1)winner += ', '
                if(maxscore==1)winner += ' and '
            }
        }

        this.elem.find(".finalpts").html(ptsmax);
        this.elem.find(".winner").html(winner);
        current.paint(false);
        current.layout.paintshapes(current.guy());
        // $("meta").eq(2).attr("content", '#' + schememod(scheme)[0]);
        this.panel.find(".ngres").show();
        this.open("results");

    }


    //sidepanel
    setnames(names, max) {
        this.table.html('');
        for (let i = 0; i < names.length; i++) {
            this.table.append('<tr><th style="color:' + names[i].colour + '">' + names[i].name
                + '</th><td class="point">0</td><td class="rem">' + max + '</td></tr>');
        }
    }
    setscore(num, point, rem) {
        this.table.find('tr').eq(num).find('.point').html(point).next().html(rem);
    }


}
