class Overlay {

    constructor(top, game) {
        this.game = game;
        this.elem = top.find('.brandnewoverlays').first();
        this.opened = false;
        this.stack = [];
        this.tabs = {};
        this.timeout = 0;
        this.alltabs = this.elem.children();
        //this.alltabs.each(function(){})
        for (var i = 0; i < this.alltabs.length; i++) {
            this.tabs[this.alltabs.eq(i).attr('data-title')] = this.alltabs.eq(i);
        }



        //sidepanel
        this.panel = top.find('.panel').first();
        this.table = this.panel.find('table');


    }

    tick(num=0){
        try{
        if(this.elem.find('#soundcheckbox').prop('checked'))
        this.panel.find('audio.tick').eq(num).prop("currentTime",0).trigger('play');
        }catch(e){
            console.log('Tick! User has muted this tab or hasn\'t clicked yet autoplay is disabled.')
        }
        
    }
    alert(message) {
        return alert(message);
    }
    confirm(message) {
        return confirm(message);
    }

    open(what = "settings") {
        if (this.stack[this.stack.length - 1] != what) {
            this.alltabs.css('display', 'none');
            this.opened = true;
            this.stack.push(what);
            this.tabs[what].css('display', 'flex');

        }
    }
    back() {
        this.alltabs.css('display', 'none');
        this.stack.pop();
        if (this.stack.length == 0) {
            this.opened = false;
        } else {
            this.tabs[this.stack[this.stack.length - 1]].css('display', 'flex');
        }
    }
    close() {
        this.alltabs.css('display', 'none');
        this.stack = [];
        this.opened = false;
    }

    hideresults() {
        this.panel.find(".resultsbutton").hide();
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
        },0);
        let winner = "";
        let maxscore = 0;
        for (let i = 0; i < pts0.length; i++) {
            if (pts0[i] == ptsmax) maxscore++;
        }
        this.elem.find(".great").html(maxscore > 1 ? 'The Great Winners are' : 'The Great Winner is');

        for (let i = 0; i < pts0.length; i++) {
            if (pts0[i] == ptsmax) {
                maxscore--;
                winner += '<span style="color:' + current.guys[i].colour + '">' + current.guys[i].name + "</span>";
                if (maxscore > 1) winner += ', '
                if (maxscore == 1) winner += ' and '
            }
        }

        this.elem.find(".finalpts").html(ptsmax);
        this.elem.find(".winner").html(winner);
        current.paint(false);
        if(current.guy()){
        current.layout.paintshapes(current.guy());
        }
        // $("meta").eq(2).attr("content", '#' + schememod(scheme)[0]);
        this.panel.find(".resultsbutton").show();
        this.open("results");

    }
    // api
    refreshrooms(data) {
        let result = '';
        if (data.error) {
            this.alert(data.error);
        }
        else if (data.data) {
            for (let i = 0; i < data.data.length; i++) {
                let datai = data.data[i];
                let gone = datai.gone ? '<i class="fas fa-fw fa-couch" title="Waiting"></i> ' : '<i class="fas fa-fw fa-border-all" title="In game"></i> ';
                let prot = datai.protected ? '<i class="fas fa-fw fa-lock" title="Password protected"></i> ' : '<i class="fas fa-fw fa-lock-open" title="No password"></i> ';
                let full = datai.full ? '<i class="fas fa-fw fa-door-closed" title="Full"></i> ' : '<i class="fas fa-fw fa-door-open" title="Welcome"></i> ';
                let rule = '<i class="fas fa-fw fa-border-all" title="Gamerule"></i>';
                result += '<div class="roomentry" data-roomid="'+datai.id+'"><div>' + gone + prot + datai.name + '</div><div>' + full + datai.slots + '/' + datai.capacity + rule + datai.rulename + '</div></div>';
            }
        }
        if (result == '') result = '<div class="centered">No rooms found.</div>';
        this.elem.find('.serverlist').html(result);

    }
    enterroom(data) {

        // let result = '';
        if (data.error) {
            this.alert(data.error);
        }
        else if(data.data){
            let d=data.data;
            let memberindex=d.memberindex;

            if(this.elem.find('.publicroom').prop('disabled')){
                this.elem.find('.roomname').val(d.name);
                this.elem.find('.grchooser').val(d.rulename);
                this.elem.find('.publicroom').prop('checked',d.public);
            }

            this.elem.find('.publicroom, .roomname, .gamesaver, .formsaver').prop('disabled',memberindex!=0)
            
            // console.log(d);


            let plist = this.elem.find('.playerlist');
            if(plist.children('.you').length==0){
                plist.append('<label class="you">Player <span class="te memberindex">0</span> (you)<span class="host"></span><input class="tin te premultiplayername multiplayername"></label>')
            }

            let you=plist.children('.you');
            let youinput=you.find('input');
            if(!youinput.hasClass('multiplayername')){
                youinput.val(d.slotlist[memberindex]).addClass('multiplayername');
            }
            you.find('.memberindex').text(memberindex+1);
            you.find('.host').text(memberindex==0?' (host)':'');


            plist.children('.notyou').remove();
            for (let i = memberindex-1; i >=0; i--) {
                let name=d.slotlist[i];
                if (typeof name == 'undefined') name='';
                let host=i==0?' (host)':'';
                plist.prepend('<label class="notyou">Player <span class="te">' + (i + 1) + '</span>'+host+'<input class="tin te" disabled value="'+name+'"></label>')
            }
            for (let i = memberindex+1; i < d.capacity; i++) {
                let name=d.slotlist[i];
                if (typeof name == 'undefined') name='';
                let host=i==0?' (host)':'';
                plist.append('<label class="notyou">Player <span class="te">' + (i + 1) + '</span>'+host+'<input class="tin te" disabled value="'+name+'"></label>')
            }
            for (let i = 0; i < d.capacity; i++) {
                plist.children().eq(i).find('.te').css('color', 'hsl( ' + (360 * i / d.capacity + 225) + ' ,100%,50%)');
            }


            $('.inroom').removeClass('reduced');
            $('.outroom').addClass('reduced');

        }else{
            let plist = this.elem.find('.playerlist');
            plist.children('.you').find('input').removeClass('multiplayername');
            $('.roomname').text('Tetrahecta');
            $('.outroom').removeClass('reduced');
            $('.inroom').addClass('reduced');

        }
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
