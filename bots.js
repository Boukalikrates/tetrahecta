function botstarter(){
    var p=player;
    var loop=myblocks[p].length;
    if(loop>18){
        do{
            var bestnum=qr(startfigures.length);
            var besttype=startfigures[bestnum];
        }while(myblocks[p].indexOf(besttype.id)<-0.5)
        var rep=(-3*loop)+63;
        var nx=(p==2||p==3)?rep:17-rep;
        var ny=(p==4||p==3)?rep:17-rep;
        setblock(p,besttype,nx,ny,0,0,(p==2||p==4),true);
        
        
        
        
    }//else stupidob()
}
//---------------------------------------------------



function makerandomob(k){
    return;
    if(!gone&&(!network||network==player)){
        var p=player;
        var loop=myblocks[p].length;
        var bloc=k?blk[k]:blk[myblocks[p][qr(loop)]];
        if(k&&!validate(p,bloc.id,true))return;
        while(!k&&!validate(p,bloc.id,true)){
            bloc=blk[myblocks[p][qr(loop)]];
        }
        while(!setblock(p,bloc,qr(20),qr(20),qr(2),qr(2),qr(2),true)){}
    }
}

function stupidob(){
    return;
    if(!gone&&(!network||network==player)){
        var p=player;
        var willing=true;
        var loop=myblocks[p].length;
        var wtable=[];
        for(var i=0;i<loop;i++){
            for(var j=0;j<blk[myblocks[p][i]].ps*blk[myblocks[p][i]].ps;j++){
                wtable.push(blk[myblocks[p][i]]);
            }
        }
        do{
            wtable.sort(function(a, b){return 0.5 - Math.random()});
        }while(!validate(p,wtable[0].id,true))
        var bloc=wtable[0];
        while(willing){
            if(setblock(p,bloc,qr(20),qr(20),qr(2),qr(2),qr(2),true)){
                willing=false;
            }
        }
    }
}
