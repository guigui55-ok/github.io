var matchFlag = false;
// window 起動時に実行される
window.onload = loadFinished;
function loadFinished(){

}

window.addEventListener('beforeunload', (event) => {
    //画面を閉じる動きをキャンセル
    //event.preventDefault();
    //event.returnValue = '';
    ConsoleLogCustom('beforeunload');
    if (matchFlag){
        location.href = "https://www.google.com/?hl=ja" ;
    }
});


window.addEventListener("load", excuteLoaded, false);

function excuteLoaded(e) {
    try {
        let arykeyword;
        let waitTime = 0;
        // keywords を取得する
        chrome.storage.local.get('keywords', function (items) {
            arykeyword = items.keywords;
        });
        // switchOn を取得する
        chrome.storage.local.get('switchOn', function (items) {
            ConsoleLogCustom('switchOn = '+items.switchOn);
            if (items.switchOn){
                // waittime を取得する
                chrome.storage.local.get('waittime', function (items) {            
                    // 取得値をチェックする
                    waiTime = CheckDefaultTimeFromStrage(items.waittime);
                    const jsInitCheckTimer = setInterval(jsLoaded, waiTime);
                    // load するまでの待ち時間がある
                    function jsLoaded() {
                        if (document.querySelector('body') != null) {
                            clearInterval(jsInitCheckTimer);
                            //要素を取得する処理
                            let bodyText = document.body.outerHTML; 
                            // 合致するキーワードがあるか判定する
                            matchFlag = isMatchKeyword(arykeyword,bodyText);
                            if ( matchFlag ) {
                                //window.location.href = "alert.html"; // 通常の遷移
                                changeStyleVisibilityToHiddenForInput();
                            }
                        };
                    }
                });
            } else {
                // swichOn=false 実行されない
            }
        });

        
    } catch (e){
        console.log('excuteLoaded Failed.',e);
    }
}

// キーワードがマッチするか判定する
function isMatchKeyword(arykeyword,bodyText){
    try {
        if (arykeyword == undefined ){ return false;}
        if (Array.isArray(arykeyword)){
            for(i=0;i<arykeyword.length;i++){
                if ( bodyText.includes(arykeyword[i])) {
                    ConsoleLogCustom('matched keyword : ' + arykeyword[i]);
                    return  true;                
                }
            }
        } else {
            if ( bodyText.includes(arykeyword)) {
                return  true;                
            }
        }
        ConsoleLogCustom('not matched keyword');
        return false;
    } catch(e){
        console.log('isMatchKeyword Failed.',e);
        return false;
    }
}
// input の visibility を 変更する
function changeStyleVisibilityToHiddenForInput(){
    try {
        let target = document.getElementsByTagName('input');
        Array.prototype.forEach.call(target, function(item) {
            item.style.visibility = "hidden";
            item.style.color = "gray";
            item.value = "エラー：入力できません";
        });

    } catch(e){
        console.log('changeStyleVisibilityToHiddenForInput Failed.',e);
    }
}