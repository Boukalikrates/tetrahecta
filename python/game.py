#TETRAHECTA

import json

from gamerule import Gamerule

class Game:
    def __init__(self,g=None):
        if g:
            gamob= json.loads(g) if type(g) is str else g
            self.unclone(gamob)
        else:
            self.newgame([],False,None,True)
            
    def newgame(self,names,timeless=False,gamerule=None,notrigger=False):
        self.board=[0 for i in range(400)]
        self.tempboard=[]
        self.gone=notrigger
        self.timeless=timeless
        self.player=0
        self.time=69
        self.id=0
        
        
        self.rule=Gamerule()
        
        self.guys=[Guy(names[i],i,self) for i in range(5)]
        
        if not notrigger:
            self.nextplayer()
            
    def resettemp(self):
        