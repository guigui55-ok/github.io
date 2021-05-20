var g_LoginNow = false;
function strtoary(value){
    let str = "";
    try{
        str = value;
        if(value==null){return null;}
        if(str.indexOf(",") <= 0){ return [value];}
        const ary = value.split(',');
        return ary;
    } catch(e){
        console.log('strtoary Faild : ',e);
        return null;
    }
}

function arytostr(ary){
    try {
        if(ary==null){return null;}
        if(Array.isArray(ary)){
            let ret = "";
            ary.forEach(function(element){
                ret = ret + element + ","
            });
            ret = ret.substring(0,ret.length-1);
            return ret;
        } else{
            console.log('not Array : ' + ary);
            return ary;
        }
    } catch(e){
        console.log('arytostr Faild : ',e);
        return '';
    }
}

var debugMode = 0;
function ConsoleLogCustom_main(mode,value){
    try {
        if (debugMode == 0){ return; }
        if (debugMode == 1){
            // mode=1 は必ず表示する
            console.log(value);
        } else{
            // 設定値 1 以外は debugMode より大きい mode の時に表示する
            if (debugMode <= mode){
                console.log(value);
            }
        }
    } catch (e){
        console.log('ConsoleLogCustom Failed : ',e);
    }
}

function ConsoleLogCustom(...args) {
    let mode;
    switch (args.length) {
        case 0:
            return;
        case 1:
            // 引数 1 つの場合は mode=1 として、arg[0] を第2引数にして実行する
            return ConsoleLogCustom_main(1,args[0]);
        default:
            // DebugMode 指定用変数を宣言する
            // 第 1 引数を数値か判定する、数値でなければ mode=0 にする
            if (isNaN(args[0])){ mode = Number(args[0]); }
            else { mode = 0;}
            // 第 2 引数はそのまま渡す
            // ConsoleLogCustom を実行する
            return ConsoleLogCustom_main(mode,args[1]);
    }
  }