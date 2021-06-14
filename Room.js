
const Gamerule = require("./Gamerule.js");
const MockLayout = require("./MockLayout.js");
const Game = require("./Game.js");

const gamerules = require('./gamerules.json')

class Room {
    constructor(id, whose) {
        this.id = id;
        this.name = whose.name + " Room";
        this.slots = [];
        this.public = true;
        this.timeless = true;
        this.password = '';

        let ml = new MockLayout();
        this.game = new Game(ml, ml);

        this.rule = new Gamerule(gamerules['Classic']);
        this.rulename = 'Classic';

        this.capacity = this.rule.starts.length;
        whose.enterroom(this, this.password);
    }
    join(who, password) {
        if (!this.notfull(who)) return false;
        if (!this.checkpassword(who, password)) return false;
        this.slots.push(who);
        return true;
    }
    leave(who) {
        // console.log(who.name + ' left the room')
        this.slots = this.slots.filter(n => n.hash != who.hash);
        return true;
    }
    host(who) {
        return this.slots[0] == who;
    }
    member(who) {
        return this.slots.includes(who);
    }
    memberindex(who) {
        return this.slots.indexOf(who);
    }
    notfull(who = null) {
        if (this.member(who)) return true;
        return this.slots.length < this.capacity;
    }
    checkpassword(who, password) {
        if (this.member(who)) return true;
        return this.password == password;
    }
    kick(who, whom) {
        if (!this.host(who)) return false;
        if (!this.member(whom)) return false;
        return whom.leaveroom();
    }
    changeprops(who, props) {
        if (!this.host(who)) return false;
        this.name = props.name.replace(/[^\u0410-\u042F\u0430-\u044FA-Za-z0-9 _.,!'+]/g, '').substr(0, 20);
        this.rule = new Gamerule(gamerules[props.rule]);

        this.rulename = props.rule;        
        this.capacity = this.rule.starts.length;
        
        this.public = !!props.public;
        return true;
    }
    startgame(who) {
        if (!this.host(who)) return false;
        if (this.notfull()) return false;
        this.game.newgame(this.timeless,this.slots.map(e => e.name),this.rule);
        for(let i=0;i<this.slots.length;i++){
            if(this.game.guys[i]) this.slots[i].playsAs=this.game.guys[i];
        }
        return true;
    }
    clone(who = null) {
        let obj = {
            id: this.id,
            name: this.name,
            capacity: this.capacity,
            slots: this.slots.length,
            full: this.slots.length >= this.capacity,
            public: this.public,
            rulename: this.rulename,
            protected: this.password.length > 0,
            gone: this.game.gone
        }
        if (who) {
            obj['slotlist'] = this.slots.map(e => e.name);
            obj['memberindex'] = this.memberindex(who);
            obj['game'] = this.game.clone();
        }

        return obj;
    }
}
try {
    module.exports = Room;
} catch (e) {

}