from block import Block

class Guy:
    def __init__(self,a,n=0,parent=None):
        #if type(a) is dict:
        #    return self.unclone(a,n,parent)
        
        self.game=parent
        self.n=n
        self.name=a if a else ''
        self.plays=bool(a)
        self.still=bool(a)
        self.bot=0
        self.last=Block()
        self.blocks=self.game.rule.toArray() if a else []
    
    def remblock(self,a):
        if not self.hasblock(a): return False
        # pozniej
        
    def color(self):
        return 'stera'.charAt(self.n)
    
    def validate(self,b,mark):
        loop=1 if (b or self.hasblock(self.game.rule.unomino)) else len(self.blocks)
        for i in range(loop):
            bloc=b if b else (self.game.rule.unomino if self.hasblock(self.game.rule.unomino) esle self.blocks[i])
            for ix in range(2):
                for ii in range(21):
                    for iii in range(21):
                        for xi in range(2):
                            for xii in range(2):
                                if self.setblock(bloc,ii,iii,ix,xi,xii,False,mark):
                                    return True
        if mark:
            self.game.paint(True)
        return False
    
    def hasblock(self,blk=False):
        if not blk: return False
        return str(self.blocks).count(str(blk))
    
    def newblocks():
        # HTML function
        pass
    
    def setblock(self,act,x,y,swap,rx,ry,draw,mark):
        p=this.n
        
        empty=True
        border=True
        corner=False
        
        for i in range(act.ps):
            if swap:
                nx=x+act.pd.y-act.pc[i].y-1 if ry else x+act.pc[i].y
                ny=y+act.pd.x-act.pc[i].x-1 if rx else y+act.pc[i].x
            else:
                nx=x+act.pd.x-act.pc[i].x-1 if rx else x+act.pc[i].x
                ny=y+act.pd.y-act.pc[i].y-1 if ry else y+act.pc[i].y
            
            if(self.game.get)