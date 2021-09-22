const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const mime = require('mime');
const SHA3 = require('sha3');

const Room = require('./Room.js');
const Identity = require('./Identity.js');

// const options = {
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
//   };

var port = 80

var roomcap = 100;

var rooms = {};
var identities = {};

var roomindex = 1;


if(process.argv){
    for(let i=0;i<process.argv.length-1;i++){
        if(process.argv[i]==='-port'){
            let portnumber = +process.argv[i+1];
            if(portnumber>0&&portnumber<65536) port=portnumber;
        }
    }
}

function removeempty() {
    for (let i in identities) {
        if (Date.now() - identities[i].lastseen > 60000) {
            identities[i].leaveroom();
            delete identities[i];
        }
    }
    for (let i in rooms) {
        if (rooms[i].slots.length == 0) {
            delete rooms[i];
        }
    }
    setTimeout(removeempty, 1000);
}
removeempty();

function checkidentity(idstring, name = '') {
    if (idstring instanceof Identity) return idstring;
    let str = idstring.toString();
    let hash = new SHA3.SHA3(256);
    hash.update('Guest user ');
    hash.update(str);
    let hashstr = hash.digest('hex');
    if (!identities[hashstr]) {
        let newIdentity = new Identity(idstring, name);
        return identities[hashstr] = newIdentity;
    } else {
        identities[hashstr].changename(name);
        return identities[hashstr];
    }

}


function getrooms() {
    let result = [];
    for (let i in rooms) {
        if (rooms[i].public) result.push(rooms[i].clone());
    }
    return JSON.stringify({ data: result });
}
function createroom(identity) {
    if (rooms.length >= roomcap) {
        return JSON.stringify({ 'error': 'There are too many room on this server' })
    }
    let roomid = roomindex++;
    let newRoom = new Room(roomid, identity);
    rooms[roomid] = newRoom;
    return JSON.stringify({ 'data': newRoom.clone(identity) })
}

function enterroom(identity, roomid = 0, password = '') {
    roomid = +roomid;
    let room;
    if (roomid && roomid != NaN) room = rooms[roomid]
    else if (identity.room) room = identity.room;
    else return JSON.stringify({});
    if (!room) return JSON.stringify({ 'error': 'This room does not exist' });
    if (!room.notfull(identity)) return JSON.stringify({ 'error': 'This room is full' });
    if (!room.checkpassword(identity, password)) return JSON.stringify({ 'error': 'Incorrect password' });
    let success = identity.enterroom(room, password);
    if (success) return JSON.stringify({ 'data': room.clone(identity) })
    else return JSON.stringify({ 'error': 'Could not join the room' });
}

function leaveroom(identity) {
    let success = identity.leaveroom();
    if (success) return JSON.stringify({});
    else return JSON.stringify({ 'error': 'Could not leave the room' });
}

function changeprops(identity, props) {
    props = JSON.parse(props);
    let room = identity.room;
    if (!room) return JSON.stringify({ 'error': 'This room does not exist' });
    if (!room.host(identity)) return JSON.stringify({ 'error': 'Not permitted to change props' });
    let success = room.changeprops(identity, props);
    if (success) return JSON.stringify({ 'data': room.clone(identity) })
    else return JSON.stringify({ 'error': 'Could not change props' });

}

function startgame(identity) {
    let room = identity.room;
    if (!room) return JSON.stringify({ 'error': 'This room does not exist' });
    if (!room.host(identity)) return JSON.stringify({ 'error': 'Not permitted to start game' });
    if (room.notfull()) return JSON.stringify({ 'error': 'Not enough players' });
    let success = room.startgame(identity);
    if (success) return JSON.stringify({ 'data': room.clone(identity) })
    else return JSON.stringify({ 'error': 'Could not start game' });
}

function setblock(identity, props) {

    props = JSON.parse(props);
    let guy = identity.playsAs;
    if (!guy) return JSON.stringify({ 'error': 'You\'re not playing anywhere' });
    let room = identity.room;
    if (!room) return JSON.stringify({ 'error': 'This room does not exist' });
    let block = guy.game.rule[props.block];
    let success = guy.setblock(block, props.x, props.y, props.swap, props.rx, props.ry, true);
    if (success) return JSON.stringify({ 'data': room.clone(identity) })
    else return JSON.stringify({ 'error': 'Could not move' });
}

// https.createServer(options, function (req, res) {
http.createServer( function (req, res) {

    let q = url.parse(req.url, true);
    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e7) {
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                request.connection.destroy();
            }
        });
        req.on('end', function () {
            let POST = qs.parse(body);
            if (!POST['identity']) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ 'error': 'No identity provided' }));
            }
            let identity = checkidentity(POST['identity'], POST['name']);
            let command = q.pathname.replace(/\/$/g, '');
            let response = {};
            switch (command) {
                case "/getrooms":
                    response = getrooms();
                    break;
                case "/createroom":
                    response = createroom(identity);
                    break;

                case "/enterroom":
                    response = enterroom(identity, POST['roomid'], POST['password']);
                    break;

                case "/leaveroom":
                    response = leaveroom(identity);
                    break;

                case "/changeprops":
                    response = changeprops(identity, POST['props']);
                    break;
                case "/startgame":
                    response = startgame(identity);
                    break;
                case "/setblock":
                    response = setblock(identity, POST['props']);
                    break;

                default:
                    break;
            }
            // let message=identity.getmessage();
            // if(message) response.message=message;

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(response);
        });

    } else {

        let filename = "." + (q.pathname == "/" ? "/index.html" : q.pathname);
        fs.readFile(filename, function (err, data) {
            let filenamesplit = filename.split('.');
            let fileextension = filenamesplit[filenamesplit.length - 1];

            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end("404 Not Found");
            }
            if (q.pathname == "/") {
                data = data.toString().replace('const serverEnabled = false;', 'const serverEnabled = true;')
            }
            res.writeHead(200, { 'Content-Type': mime.getType(fileextension) });
            res.write(data);
            return res.end();
        });
    }


}).listen(port);

console.log('Welcome to Tetrahecta server! We\'re listening on port ' + port);