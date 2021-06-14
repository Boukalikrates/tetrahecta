
const SHA3 = require('sha3');
class Identity {
    constructor(identity, name = '') {
        let hash = new SHA3.SHA3(256);
        this.room = null;
        this.name = 'Guest';
        hash.update(identity);

        this.hash = hash.digest('hex');
        this.changename(name);
        this.lastseen = Date.now();
        this.message = 'Welcome to Tetrahecta!';
        this.playsAs = null;
        // console.log(this.name + ' joined');
    }
    changename(name = '') {
        this.lastseen = Date.now();
        let k = name.replace(/[^\u0410-\u042F\u0430-\u044FA-Za-z0-9 _.,!'+]/g, '').substr(0, 20);
        if (k) {
            if (k.length < 1) k = 'Guest ' + k;
            if (this.name != k) {
                this.name = k;
            }
        }
    }
    leaveroom() {
        if (this.playsAs) {
            this.playsAs.bot = this.playsAs.getbottype('_bot');
            this.playsAs = null;
        }
        if (this.room) {
            this.room.leave(this);
            this.room = null;
        }
        return true;
    }
    enterroom(room, password) {
        if (this.room == room) return true;
        if (this.room && this.room != room) {
            this.leaveroom();
        }
        this.room = room;
        return room.join(this, password);
    }
    getmessage() {
        if (this.message) {
            let message = this.message;
            this.message = '';
            return message;
        } else return '';
    }




}
try {
    module.exports = Identity;
} catch (e) {

}