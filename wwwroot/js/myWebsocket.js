(function($){
    var myWs={
        url:'',
        isDeconnect:false,
        isConneced:false,
        retryCount:0,
        connect:function(){
            if(typeof(this.WS)!=='undefined'){return;}
            this.handler({action:'connecting',data:this.url});
            var _this = this;
            this.isActiveDisconnect=false;
            var ws = _this.WS = new WebSocket(this.url);
            ws.addEventListener('open', function(){
                _this.retryCount=0;
                _this.isConneced=true;
                _this.onConnected();
            });
            ws.addEventListener('message', function(e){
                _this.onMessage(e);
            });
            //总是会触发
            ws.addEventListener('close',function(){
                _this.isConneced = false;
                _this.WS = undefined;
                _this.onClose();
            });
        },
        close:function(){
            this.handler({action:'closing',data:this.url});
            this.isActiveDisconnect=true;
            this.WS.close();
        },
        send:function(msg){
            if(!this.isConneced){
                this.handler({action:'send',data:{msg:msg,result:false}});
                return false;
            }
            this.handler({action:'send',data:{msg:msg,result:true}});
            this.WS.send(msg);
            return true;
        },
        onConnected:function(){
            this.handler({action:'connected',data:null});
        },
        onMessage:function(e){
            this.handler({action:'message',data:e.data});
        },
        onClose:function(){
            this.handler({action:'closed',data:null});
            if(!this.isActiveDisconnect){
                var _this=this;
                setTimeout(function() {
                    _this.retryCount++;
                    _this.handler({action:'reconnect',data:{retry:_this.retryCount}});
                    _this.connect();
                }, 2000);
            }
        },
        handler:function(obj){
            if(this.hasCustomHandler){
                this.customHandler(obj);
            }else{
                if(this.hasCustomHandler=isFunc(this.customHandler)){
                    this.customHandler(obj);
                }
            }
        },
        hasCustomHandler:false
    };
    var ws=function(){
        this.isConnected=false;
        this.url=null;
        this.handler=null;
        this.timedTaskCmdText='';
        this.connect=function(){
            var _this = this;
            if(!isFunc(this.handler)){
                alert('请为myWebsocket定义handler(obj)方法');
                return;
            }
            if(!isStr(this.url)||this.url.length<1){
                alert('请为myWebsocket定义url目标地址');
                return;
            }
            if(!isStr(this.timedTaskCmdText)||this.timedTaskCmdText.length<1){
                _timedTaskCmdText=false;
            }else{
                _timedTaskCmdText=this.timedTaskCmdText;
            }
            myWs.url=this.url;
            myWs.customHandler=function(obj){
                switch(obj.action){
                    case 'connected':
                        this.isConnected=true;
                        _timedTaskCmdText&&sendTimedTaskCmdText();
                    break;
                    case 'closed':
                        this.isConnected=false;
                    break;
                    case 'closing':
                        this.isConnected=false;
                    break;
                }
                _this.handler(obj);
            };
            myWs.connect();
        };
        this.send=function(msg){
            return myWs.send(msg);
        };
        this.close=function(){
            myWs.close();
        };
        var _timedTaskCmdText='';
        var _this=this;
        var minDif=120000;//定时2分钟
        var lastTimes=((new Date()).getTime())-minDif;
        var sendTimedTaskCmdText=function(myTime){
            if(undefined==myTime){myTime=(new Date()).getTime();}
            lastTimes=myTime;
            var arr=_timedTaskCmdText.split(';');
            for(var i=0;i<arr.length;i++){
                arr[i].length>0&&_this.send(arr[i]);
            }
        };
        setInterval(function(){
            if(!_this.connect){return;}
            if(!_timedTaskCmdText){return;}
            var myTime=(new Date()).getTime();
            var dif=myTime-lastTimes;
            if(dif>minDif){
                sendTimedTaskCmdText(myTime);
            }
        },1000);
    };
    window.myWebsocket=new ws();
})(zero);
