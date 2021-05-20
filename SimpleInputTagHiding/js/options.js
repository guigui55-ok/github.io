debugMode = 0;
const g_DefaultTime = 1500;
const g_LoginPageName = 'SimpleInputTagHiding_login.html';
const g_OptionsPageName = 'SimpleInputTagHiding_options.html';

// -----------------------------------------------------------
 // window 起動時、ページ遷移時に実行される
 window.onload = loadFinished;
 function loadFinished(){
     // 現在の URL が options.html なら VerifiKeywords を実行する
     if (location.href.indexOf(g_OptionsPageName) > 0){
       // password を入力していない場合
      chrome.storage.local.get('LoginNow', function (items) {
        if(items.LoginNow) {
          // ログインできる状態
          // 設定値を読みこんで反映する
          ReflectsSetttingThatEnablesFunction();
          // キーワードを取得して要素に出力する
          VerifiKeywords();
          // 国際化対応メッセージを置き換える
          replaceMessage_options();
        } else {
          // ログインできない状態
          // login ページに移動する
          location.href = g_LoginPageName;
        }
      });
     }     
     if(location.href.indexOf(g_LoginPageName) > 0){
       //SetLoginNow(false);
      // 国際化対応メッセージを置き換える
      replaceMessage_login_Checkfirst_AndLocalize();
      return;
    }
 }

// -----------------------------------------------------------
// ページを閉じるときに実行される
window.addEventListener('beforeunload', (event) => {
  //画面を閉じる動きをキャンセル
  //event.preventDefault();
  //event.returnValue = '';
  ConsoleLogCustom('beforenload');
  // オプションページを閉じるときにログイン状態を解除する
  if (location.href.indexOf(g_OptionsPageName) > 0 ){
    
    let flag = false;
    chrome.storage.local.set({'LoginNow': flag}, function () {
    });
  }
});



// -----------------------------------------------------------
// ブラウザバックを検知したときに実行される
window.addEventListener('popstate', function(e) {
});

// -----------------------------------------------------------
// マウスクリック時に実行される
document.addEventListener("click", (e) => { 
  if( e !== null){
      let item = e.target;
      // ID 属性または name 属性を指定して要素を判別する
      if (item.id == 'button_verify'){
        ConsoleLogCustom('id:button_verify clicked');
        // 登録されているキーワードを確認・表示する
        VerifiKeywords();
      }
      if (item.id == 'button_save'){
        ConsoleLogCustom('id:button_save clicked');
        // キーワードを設定する
        SaveKeywordsnew();
      }
      if (item.id == 'button_delete'){
        ConsoleLogCustom('id:button_delete clicked');
        // キーワードを削除する
        DeleteKeywords();
      }
      if (item.id == 'inputhider_login_button'){
        ConsoleLogCustom('id:inputhider_login_button clicked');
        // キーワードを削除する
        //DeleteKeywords();
        LoginInputHider();
      }
      if (item.id == 'inputhider_changepass_button'){
        ConsoleLogCustom('id:inputhider_changepass_button clicked');
        // パスワードを変更する
        ChangePassword();
      }
      if (item.id == 'changepass_link'){
        // パスワード変更フォームを表示する
        clickChangePassword();
      }
      if (item.id == 'button_save2'){
        ConsoleLogCustom('id:button_save2 clicked');
        // waitTime を変更する
        SaveWaitTime();
      }
      if (item.tagName == 'A'){
      }
      if ((item.id == 'switch_p')||(item.id == 'swich_input')){
        // 設定値を保存する
        console.log('id:switch clicked');
        SetValueSetttingThatEnablesFunction();
      }
  }
}, false);

// -----------------------------------------------------------
// キーが押されたときに実行される
var g_eventkeys = [];
const g_eventkeysMaxCount = 9;
document.onkeydown = function(e) {
  try {
    if(location.href.indexOf(g_OptionsPageName) > 0){
      SaveEventKey(e.key);
      if (IsMatchKeyCode(g_eventkeys,'passreset')){
        ResetPassword();
      }
      return;
    }
  } catch (e){
    ShowStack(e,'document.onkeydown');
  }
}
// -----------------------------------------------------------
// パスワードをリセットする (undefined にする)
function ResetPassword(){
  try {
    let pass = '';
    chrome.storage.local.set({'password': pass}, function () {
      ConsoleLogCustom('Password Reset Success.');
      alert(chrome.i18n.getMessage('PasswordReset_message'));      
      // Login ページに遷移する
      location.href = g_LoginPageName;         
    });
  } catch(e){
    ShowStack(e,'ResetPassword');
  }
}
// -----------------------------------------------------------
// keyCodeAry と compareString のキーコードが合致しているか判定する
function IsMatchKeyCode(keyCodeAry,compareString){
  try {
    if (typeof compareString != 'string'){ return false; }
    if (compareString.length < 1){ return false;}

    if (Array.isArray(keyCodeAry)){
      ConsoleLogCustom('keyCodeAry : '+keyCodeAry);
      if (keyCodeAry.length == compareString.length){
        let flag = true;
        for (let index = 0; index < compareString.length; index++) {
          const element = keyCodeAry[index];
          if (keyCodeAry[index] != compareString[index]) {
            flag = false;
            break;
          }         
        }
        return flag;
      }
    }
  } catch(e){
    ShowStack(e,'IsMatchKeyCode');
  }
}
// -----------------------------------------------------------
// key を保存する
function SaveEventKey(key){
  try {
    if (Array.isArray(g_eventkeys)){
      // 配列に追加する
      PushToEventKey(g_eventkeys,g_eventkeysMaxCount,key);
    } else {
      // 配列がない
      g_eventkeys = [key];
    }
  } catch(e){
    ShowStack(e,'SaveEventKey');
  }
}
// -----------------------------------------------------------
// 配列に key を追加する
// 要素数を maxCount にする、超えた分は最初の要素から削除する
function PushToEventKey(ary,max,key){
  try {
    // まず追加する
    ary.push(key);
    if (ary.length == max){
      // 同じときは消さない
    } else if (ary.length > max) {
      // max まで消し続ける
      for (let index = 0; index <= ary.length - max -1 ; index++) {
        // 最初の要素を消すことを繰り返す
        ary.splice(0, 1);
      }
    } else {
      // max 以下なら追加のみ
    }
  } catch (e){
    ShowStack(e,'PushToEventKey');
  }
}
// -----------------------------------------------------------
// login ページの国際化対応、読み込み時に実行する
// ページ内の Tag の ContentText を mesages.json のものにすべて置き換える
function replaceMessage_options(){
  try {
      replaceTagText('subject_p','options_subject');
      replaceTagTextForInputValue('button_save','options_buton_settings');
      replaceTagText('registKeywordDescription','options_registKeywordDescription');
      replaceTagText('registKeywordDescription_example','options_registKeywordDescription_example');
      replaceTagText('keywordDisplay_p','options_keywordDisplay');
      replaceTagTextForInputValue('button_delete','options_buton_delete');
      replaceTagText('options_other_setings_p','options_other_setings_p');
      replaceTagText('other_settings_dDescription_p','other_settings_dDescription_p');
      replaceTagTextForInputValue('button_save2','options_buton_settings');
  }catch(e){
      console.log('replaceMessage_options Failed.',e);
  }
}
// -----------------------------------------------------------
// password が設定されているかによって、表示するメッセージを変更する、読み込み時に実行する
function replaceMessage_login_Checkfirst_AndLocalize(){
  try{
      // password を取得する
      chrome.storage.local.get('password', function (items) {
          let nowPassword = items.password;
          ConsoleLogCustom('nowPassword : ' + nowPassword);
          if ((typeof nowPassword == 'undefined')||(nowPassword == undefined)||(nowPassword.length < 1)){
              // パスワードが設定されていない
              // [設定してください]と表示する
              replaceTagText('contens_p','SerPassWord_message');
              // パスワードを変更するを非表示にする
              changeVisible('changepass_link',false);
          } else {
              // パスワードが設定されている
              // [入力してください]と表示する
              replaceTagText('contens_p','InputPassWord_message');
              // パスワード入力 input を type=password にする
              let target = document.getElementById('inputhider_login_text');
              target.type = 'password';
          }
      });
  } catch(e){
      console.log('replaceMessage_login_Checkfirst_AndLocalize Failed.',e);
  }
}

// -----------------------------------------------------------
// 要素の textContext を chrome.il8n.getMessage のものに置き換える
function replaceTagText(elementId,messageId){
  try {
      // id 属性から要素を取得する
      let target = document.getElementById(elementId);
      // message key から要素の textContent を置き換える
      target.textContent = chrome.i18n.getMessage(messageId);
  } catch(e){
      console.log('replaceTagText Failed.',e);
  }
}

// -----------------------------------------------------------
// input 要素のメッセージを chrome.il8n.getMessage のものに置き換える
function replaceTagTextForInputValue(elementId,messageId){
  try {
      // id 属性から要素を取得する
      let target = document.getElementById(elementId);
      // message key から要素の value を置き換える
      target.value = chrome.i18n.getMessage(messageId);
  } catch(e){
      console.log('replaceTagText Failed.',e);
  }
}

// -----------------------------------------------------------
// 要素を visibility を変更する
function changeVisible(elementId,flag){
  try {
      // id 属性から要素を取得する
      let target = document.getElementById(elementId);
      // 非表示にする
      target.style.visibility = "hidden";
  } catch(e){
      console.log('changeVisible Failed.',e);
  }
}

// -----------------------------------------------------------
// 機能を有効にする設定値を strage.local に保存する
function SetValueSetttingThatEnablesFunction (){
  try {
    // チェックボックスの状態を取得する
    // 要素を取得する
    let target = document.getElementById('swich_input');
    let flag = false;
    if(target.checked == true){ flag = true; }
    // strage へ登録する
    chrome.storage.local.set({'switchOn': flag}, function () {
      ConsoleLogCustom('swichOn : '+flag)
    });
  } catch(e){
    ShowStack(e,'SetValueSetttingThatEnablesFunction');
  }
}

// -----------------------------------------------------------
// 機能を有効にする設定値を反映する
// Reflects the setting value that enables the function
function ReflectsSetttingThatEnablesFunction () {
  try{
    let switchOn;
    // strage から値を取得する
    chrome.storage.local.get('switchOn', function (items) {
      switchOn = items.switchOn;
      // undefined の時の処理
      if ((typeof switchOn == 'undefined')||(switchOn == undefined)){
        switchOn = false;
      }
      // boolean 型でないときの処理
      if (typeof switchOn != 'boolean'){
        switchOn = false;
      }
      // チェックボックスの状態を変更する
      // 要素を取得する
      let target = document.getElementById('swich_input');
      if(switchOn){
        // フラグ ON はチェックする
        target.checked = 'checked';
      } else {
        // フラグ OFF はチェックしない
        target.checked = '';
      }
    });
  } catch (e){
    ShowStack(e,'ReflectsSetttingThatEnablesFunction');
  }
}

// -----------------------------------------------------------
function SaveWaitTime() {
  try {
    const defaultTime = g_DefaultTime;
    let waitTime = 0;
    // 値を input から取得する
    let readValue = document.getElementById('textinput_waittime').value    
    // 数値として読み込む
    if (StringisNumber(readValue)){
      waitTime = Number(readValue)
    } else {
      // エラーを表示する
      // エラー：数値を入力してください
      outputMessageInElement('waittime_message',chrome.i18n.getMessage('SaveWaitTime_error1'));
      return;
    }
    // 取得した値が 0 以下なら default にする
    if (waitTime <= 0){
      // エラーを表示する
      // エラー：0 以上の数値を入力してください
      outputMessageInElement('waittime_message',chrome.i18n.getMessage('SaveWaitTime_error2'));
      return;
    }
    // strage へ登録する
    chrome.storage.local.set({'waitTime': waitTime}, function () {
      // 結果を表示する
      // '時間を ' + waitTime +' [ミリ秒] に設定しました。
      outputMessageInElement('waittime_message',
        chrome.i18n.getMessage('SaveWaitTime_error3_1') + waitTime + 
        chrome.i18n.getMessage('SaveWaitTime_error3_2')
      );
      ConsoleLogCustom('Save waitTime');
    });
  } catch (e) {
    console.log('SaveWaitTime Failed.',e);
  }
}


// -----------------------------------------------------------
 // inputbox のキーワードを登録する
function SaveKeywordsnew() {
  try{
  // 登録用のキーワードを inputbox から取得する
  let inputval = document.getElementById('textinput_keyword').value
  // 値が空の場合は終了する
  if (inputval == ""){
    // エラーを表示する
    // エラー：追加するキーワードを入力してください。
    outputMessageInElement('addmessage',chrome.i18n.getMessage('SaveKeywordsnew_error_1'));
    return;
  }
  let setKeywords = strtoary(inputval);
  ConsoleLogCustom('setKeywords = '+setKeywords);
  let nowgetKeywords = null;

  // 配列を取得する
    chrome.storage.local.get('keywords', function (items) {
      nowgetKeywords = items.keywords;
      
      // 登録完了表示用配列
      let addlist = [];
      // キーワード登録用配列
      let setnewKeywords;
      // 配列同値検出用フラグ
      let matchFlag;
      // local.strage から取得された値があるか
      if (
        (nowgetKeywords == undefined)||
        (typeof nowgetKeywords == 'undefined')||
        (nowgetKeywords == 'undefined')||
        (nowgetKeywords == '')){
        // local.strage に保存されている配列がない
        ConsoleLogCustom('SaveKeywordsnew nowgetKeywords == undefined');
        nowgetKeywords = [];
        setnewKeywords = setKeywords;
        addlist = setKeywords;
      } else {
        if (!Array.isArray(nowgetKeywords)){
          nowgetKeywords = [nowgetKeywords];
          console.log('nowgetKeywords :' + nowgetKeywords);
          console.log('setKeywords :' + setKeywords);
          setnewKeywords = setKeywords;
          addlist = setKeywords;
        }
        // local.srage に保存されている配列がある
        // 同じキーワードは消して、同じでないキーワード配列に追加する
        setnewKeywords = nowgetKeywords;
        // setKeywords と nowgetKeywords の値を比較して同じ値を除外する
        setKeywords.forEach(setVal => {
          matchFlag = false;
          nowgetKeywords.forEach(getVal => {
            if (setVal == getVal){
              // 同じ値があれば true にする
              matchFlag = true;
            }
          });
          // 同値がなければ配列に追加する
          if (!matchFlag){
            setnewKeywords.push(setVal);
            addlist.push(setVal);
          }
        });
        
        // 念のため既存配列内に一致するものがあれば消す
        let newnewList = [];
        let count=0;

        for (let i = 0; i < setnewKeywords.length; i++) {
          const val1 = setnewKeywords[i];
          matchFlag = false;
          for (let j = i+1; j < setnewKeywords.length; j++) {
            const val2 = setnewKeywords[j];
            if (val1 == val2){ 
              matchFlag = true;
              setnewKeywords.splice(j, 1); // j番目から一つ削除
            }
          }
        }
      }
            
      // 配列を保存する
      if(!(typeof setnewKeywords == 'undefined')||(setnewKeywords == undefined)){
          chrome.storage.local.set({'keywords': setnewKeywords}, function () {
            //ConsoleLogCustom('SaveKeywordsnew chrome.storage.local.set :after process');
            // 保存後にテキストボックスの値を消去する
            document.getElementById('textinput_keyword').value = "";
            if (addlist.length >= 1){
              // 保存完了のメッセージを表示する
              // 結果を表示する
              // addmessage','キーワードを [ '+ addlist +' ] 登録しました。
              outputMessageInElement('addmessage',
                chrome.i18n.getMessage('SaveKeywordsnew_result2_1') + '[' + addlist + ' ]' +
                chrome.i18n.getMessage('SaveKeywordsnew_result2_2')
              );
            } else{
              // エラーはないが、addlist がない、以前と同じ状態
              outputMessageInElement('addmessage','');
            }
          });
          // 非同期処理なのでこの中で実行する
          VerifiKeywords();
      } else {
        // 配列がnullの場合
        ConsoleLogCustom('setnewKeywords = null');
        // エラーを表示する
        // エラー：不明なエラーです。キーワードを読み取れませんでした。(Error:2)
        outputMessageInElement('addmessage',chrome.i18n.getMessage('SaveKeywordsnew_error_2'));
      }
    });
  } catch(e){
    ShowStack(e,'SaveKeywordsnew');
  }
}

// -----------------------------------------------------------
// inputbox のキーワードを登録する
function SaveKeywords() {
    let InputValue = document.getElementById('textinput_keyword').value
    if (InputValue == ""){
      ConsoleLogCustom('value is blank');
      return;
    }
    let keywords = strtoary(InputValue);
    ConsoleLogCustom('SaveKeywords = '+ keywords);
    if(!(keywords == null)){
        chrome.storage.local.set({'keywords': keywords}, function () {
          ConsoleLogCustom('SaveKeywords chrome.storage.local.set');
        });
    } else {
      ConsoleLogCustom('keywords = null');
    }   
}
// -----------------------------------------------------------
// キーワードを取得して要素に出力する
function VerifiKeywords(){
  try{
    ConsoleLogCustom('VerifiKeywords');
    // 値を strage から取得する
    chrome.storage.local.get('keywords', function (items) {
      // 配列から文字列にする
      let keywords = arytostr(items.keywords);
      // キーワード出力用の要素を取得する
      var element = document.getElementById('now_keyword');
      // 相曽に値を設定する
      element.textContent = keywords;
      // チェックボックスの値をすべて削除する
      DeleteKeywordInCheckbox();
      // 登録されているキーワードをチェックボックスに表示する
      ShowNowKeywords(items.keywords);
    });
    const defaultTime = g_DefaultTime;
    // 値を strage から取得する
    chrome.storage.local.get('waitTime', function (items) {
      let waitTime = 0;
      ConsoleLogCustom('items.waitTime = '+items.waitTime);
      // 取得値をチェックする
      waitTime = CheckDefaultTimeFromStrage(items.waitTime);
      // input text へ出力する
      document.getElementById('textinput_waittime').value = String(waitTime);
    });
  } catch(e){
    console.log('VerifiKeywords failed:',e);
  }
}
// -----------------------------------------------------------
// strageから得た waitTime をチェックする
function CheckDefaultTimeFromStrage(value){
  try {
    let ret;
    const defaultTime = g_DefaultTime;
    // 数値として読み込む
    if (Number.isInteger(value)){
      ret = Number(value)
    } else {
      // 数値でなければ default にする
      ret = defaultTime;
    }
    if ((typeof ret == 'undefined')||(ret == undefined)||(ret == 'undefined')){
      ret = defaultTime;
    }
    // 取得した値が 0 以下なら default にする
    if (ret < 0){
      ret = defaultTime;
    }
    return ret;
  } catch (e){
    console.log('GetDefaultTimeFromStrage failed:',e);
    return g_DefaultTime;
  }
}
// -----------------------------------------------------------
// チェックボックスをすべて削除する
function DeleteKeywordInCheckbox(){
  try {
    ConsoleLogCustom('DeleteKeywordInCheckbox');
    // id 属性から要素を取得
    let listformElement = document.getElementById('keyword_listform');
    // form 要素内のすべての要素を削除する
    while( listformElement.firstChild ){
      listformElement.removeChild( listformElement.firstChild );
    }
  } catch(e){
    console.log('DeleteKeywordInCheckbox failed:',e);
  }
}

// -----------------------------------------------------------
// 指定した id の要素内の子要素をすべて削除する
function DeleteChildElement(targetElementName){
  try {
    // id 属性から要素を取得する
    let targetElement = document.getElementById(targetElementName);
    // null なら終了する
    if (targetElement == null){return;}
    // form 要素内のすべての要素を削除する
    while( targetElement.firstChild ){
      targetElement.removeChild( targetElement.firstChild );
    }
  } catch(e){
    console.log('DeleteChildElement failed:',e);
  }
}

// -----------------------------------------------------------
// チェックボックスリストにキーワードを表示する
function ShowNowKeywords(aryKeywords){
  try {
    // checkboxid 命名用カウンタ
    let count=1;
    // id 属性で要素を取得する
    let listformElement = document.getElementById('keyword_listform');
    let checkboxIdName = 'checkbox';
    // 配列に値がなければ終了する
    if ((typeof aryKeywords == 'undefined')||
      (aryKeywords == undefined))
    {return;}
    if (!Array.isArray(aryKeywords)){
      console.log('!Array.isArray(aryKeywords)');
      return;
    }
    // 配列処理
    aryKeywords.forEach(element => {
      // 新しい要素 labelElement を作成する
      let labelElement = document.createElement('label');
      // 新しい要素 labelElement の属性を設定する
      labelElement.setAttribute('for',checkboxIdName+count );
      // 新しい要素 inputElement を作成
      let inputElement = document.createElement('input');
      // 新しい要素 inputElement の属性を設定する
      inputElement.value = element;
      inputElement.setAttribute('type','checkbox');
      inputElement.setAttribute('name','checkboxKeywords');
      inputElement.setAttribute('id',checkboxIdName+count);
      inputElement.checked = false;
      // p 要素を作成する
      let textElement = document.createElement('span');
      textElement.textContent = element;
      // br 要素を作成する
      let brElement = document.createElement('br');
      // 構成：label < input + span + br
      // 指定した要素の中の末尾に挿入する1
      labelElement.appendChild(inputElement);
      labelElement.appendChild(textElement);
      labelElement.appendChild(brElement);
      // 指定した要素の中の末尾に挿入する2
      listformElement.appendChild(labelElement);
      // checkboxid 命名用カウンタをインクリメントする
      count++;
    });
  } catch(e){
    console.log('ShowNowKeywords failed:',e);
  }
}

// -----------------------------------------------------------
// キーワードをロードして、要素に表示する
function LoadKeywords() {
    // strageから値を取得
    chrome.storage.local.get('keywords', function (items) {
        // 要素に値を設定する
        document.getElementById('textinput_keyword').textContent = items.keywords;
    });
}

// -----------------------------------------------------------
// チェックボックスリストの操作によってキーワードを削除する
function DeleteKeywords() {
  try {
    ConsoleLogCustom('DeleteKeywords');
    // id から削除する要素を取得する
    let deleteitem = document.getElementById('textinput_keyword');
    // 削除する name から要素を取得する
    let checkboxKeywords = document.getElementsByName("checkboxKeywords");
    // 登録更新用配列
    let aryKeywords = [];
    // 削除完了表示用配列
    let deleteKeywords = [];
    // チェック状態から配列を作成する
    checkboxKeywords.forEach(element => {
      if (!element.checked) {
        // チェックしていないものを配列に追加する
        aryKeywords.push(element.value);
      } else {
        deleteKeywords.push(element.value);
      }
    });
    if (deleteKeywords.length < 1){
      // エラーを表示する
      // エラー：キーワードが選択されていません。
      outputMessageInElement('deletemessage',chrome.i18n.getMessage('DeleteKeywords_error'));
      return;
    }
    chrome.storage.local.set({'keywords': aryKeywords}, function () {      
          // 非同期処理なのでこの中で実行する
          VerifiKeywords();
          if(deleteKeywords.length >= 1){
            // 結果を表示する
            // キーワード[ ' + deleteKeywords + ' ]を削除しました。
            outputMessageInElement('deletemessage',
              chrome.i18n.getMessage('DeleteKeywords_result1') + '[ ' + deleteKeywords + ' ]' +
              chrome.i18n.getMessage('DeleteKeywords_result2')
            );
          }          
    });
  } catch(e){
    console.log('DeleteKeywords failed:',e);
  }
}
// -----------------------------------------------------------
// input hider ログイン
function LoginInputHider(){
  let encdeckey = 'key';
  try {
    // id から削除する要素の値を取得する
    let inputPassword = document.getElementById('inputhider_login_text').value;
    // パスワードが空の場合は終了する
    if (inputPassword == "" ){
      ConsoleLogCustom('inputPassword blank');
      // エラーを表示する
      // エラー：パスワードを入力してください。
      outputMessageInElement('message',chrome.i18n.getMessage('LoginInputHider_error1'));
      return;
    }
    // 半角英数記号以外の場合は終了する
    if (!isHalfWithAlphanumeric(inputPassword)){
      // エラーを表示する
      // エラー：パスワードは半角英数・記号を入力してください。
      outputMessageInElement('message',chrome.i18n.getMessage('LoginInputHider_error2'));
      return;
    }

    // id message 要素内の子要素をすべて削除する
    DeleteChildElement('message');
    // パスワードを strage から取得する
    chrome.storage.local.get('password', function (items) {
      let nowPassword = items.password;
      ConsoleLogCustom('password = '+nowPassword);
      // パスワードが設定されているか
      if ((nowPassword == undefined)||(typeof nowPassword == 'undefined')||(nowPassword.length < 1)){
        // password が設定されていない
        ConsoleLogCustom('nowPassword undefined');
        // パスワードを設定するか確認する
        // 'パスワード「'+ inputPassword +'」を設定しますか？'
        let confirm_message = 
          chrome.i18n.getMessage('LoginInputHider_alert1_1') + '[ ' + inputPassword + ' ]' +
          chrome.i18n.getMessage('LoginInputHider_alert1_2')
        let ret = confirm(confirm_message); 
        // ok=true,cancel=false
        if (ret) {
          // パスワードを設定する
          // パスワードを暗号化する
          let encpw = Encrypt(inputPassword,encdeckey);
          ConsoleLogCustom('encpw : ' + encpw);
          // 暗号化したものを local.strage に保存する
          chrome.storage.local.set({'password': encpw}, function () {
            ConsoleLogCustom('local.set password');
            // 結果を表示する
            // パスワードを設定しました。
            outputMessageInElement('message',chrome.i18n.getMessage('LoginInputHider_result1'));
            // 設定が完了したら inputbox を空にして、文言を表示しなおす
            document.getElementById('inputhider_login_text').value = '';
            document.getElementById('contens_p').textContent = chrome.i18n.getMessage('InputPassWord_message');
            
            // パスワード入力 input を type=password にする
            let target = document.getElementById('inputhider_login_text');
            target.type = 'password';
          });
        } else {
          // エラーを表示する
          // パスワード設定をキャンセルしました。
            outputMessageInElement('message',chrome.i18n.getMessage('LoginInputHider_alert2'));
        }              
      } else {
        // password が設定されている
        let decpw = Decrypt(nowPassword,encdeckey);
        if (inputPassword == decpw ){
          ConsoleLogCustom('inputPassword == decpw');
          // ログインする
          // ログイン状態であることを変数に保持する
          SetLoginNow(true);
          // オプションページに遷移する
          location.href = g_OptionsPageName;          
        } else{
          // password が合致しない
          // エラーを表示する
          // エラー：パスワードが間違っています。
          outputMessageInElement('message',chrome.i18n.getMessage('LoginInputHider_error3'));
        }
      }
    });
  } catch(e){
    console.log('LoginInputHider failed:',e);
    ShowStack(e,'LoginInputHider')
  }
}

// -----------------------------------------------------------
// ログイン時にエラーメッセージを表示する
function login_outputMessage(msgval){
  try {
    // すでにエラーが表示されていたら削除する
    DeleteChildElement('message');
    // id 属性から要素を取得する
    let idmessage = document.getElementById('message');
    //ConsoleLogCustom('idmessage = '+idmessage);
    // 新たに p 要素を作成する
    let ptag = document.createElement('p');
    // p 要素のテキストを設定する
    ptag.textContent = msgval;
    //ptag.value = "パスワードが空です。"; // NG
    // 要素 id=message に 要素 p を追加する
    idmessage.appendChild(ptag);
  } catch(e){
    console.log('login_outputMessage failed:',e);
  }
}

// -----------------------------------------------------------
// 特定の要素にエラーメッセージを表示する
function outputMessageInElement(ElementIdName,msgval){
  try {
    // すでにエラーが表示されていたら削除する
    DeleteChildElement(ElementIdName);
    // id 属性から要素を取得する
    let idmessage = document.getElementById(ElementIdName);
    //ConsoleLogCustom('idmessage = '+idmessage);
    // 新たに p 要素を作成する
    let ptag = document.createElement('p');
    // p 要素のテキストを設定する
    ptag.textContent = msgval;
    // 要素 id=message に 要素 p を追加する
    idmessage.appendChild(ptag);
  } catch(e){
    console.log('login_outputMessage failed:',e);
  }
}

// -----------------------------------------------------------
// パスワードを変更リンクをクリックした際に、入力フォームを表示する
function clickChangePassword(){
  try {
    ConsoleLogCustom('clickChangePassword');
    // id 属性から要素を取得する
    let change_password_frame = document.getElementById('change_password_frame');
    // css スタイルを取得する    
    var cssStyleDeclaration = getComputedStyle( change_password_frame, null ) ;
    // visibility スタイルの値を取得する    
    let value = cssStyleDeclaration.getPropertyValue( "visibility" ) ;
    // visibility スタイルの値を設定する
    if (value == 'hidden'){
      change_password_frame.style.visibility = 'visible';
    } else {
      change_password_frame.style.visibility = 'hidden';
    }
  } catch (e){
    console.log('clickChangePassword failed:',e);
  }
}

// -----------------------------------------------------------
// パスワードを変更する
function ChangePassword(){
  let encdeckey = 'key';
  try {
    // id から削除する要素の値を取得する
    let inputOldPassword = document.getElementById('inputhider_changepass_old_text').value;
    let inputNewPassword = document.getElementById('inputhider_changepass_new_text').value;
    // いずれかの値が空の場合はエラー
    if (inputOldPassword == ''){
      // エラーを表示する
      // エラー：現在のパスワードを入力してください。
      outputMessageInElement('message',chrome.i18n.getMessage('ChangePassword_error1'));
      return;
    }
    if (inputNewPassword == ''){
      // エラーを表示する
      // エラー：新しいパスワードを入力してください。
      outputMessageInElement('message',chrome.i18n.getMessage('ChangePassword_error2'));
      return;
    }
    // パスワードが半角英数記号かチェックする
    if (!isHalfWithAlphanumeric(inputOldPassword)){
      // エラーを表示する
      // エラー：パスワードは半角英数・記号を入力してください。(現在のパスワード)
      outputMessageInElement('message',chrome.i18n.getMessage('ChangePassword_error3'));
      return;
    }
    if (!isHalfWithAlphanumeric(inputNewPassword)){
      login_outputMessage('エラー：パスワードは半角英数・記号を入力してください。');
      // エラーを表示する
      // エラー：パスワードは半角英数・記号を入力してください。(新しいパスワード)
      outputMessageInElement('message',chrome.i18n.getMessage('ChangePassword_error4'));
      return;
    }    
    // パスワードを strage から取得する
    chrome.storage.local.get('password', function (items) {
      let nowPassword = items.password;
      ConsoleLogCustom('password = '+nowPassword);
      if ((nowPassword == undefined)||(typeof nowPassword == 'undefined')){
        // password が設定されていない
        ConsoleLogCustom('nowPassword undefined');
        // ページ遷移時にチェックする
      } else{
        // password が設定されている
        let decpw = Decrypt(nowPassword,encdeckey);
        // 古いパスワードが一致するか
        if (inputOldPassword == decpw ){
          ConsoleLogCustom('inputOldPassword == decpw');
          // password が合致した          
          // 新しいパスワードを暗号化する
          let encpw = Encrypt(inputNewPassword,encdeckey);
          ConsoleLogCustom('encpw : ' + encpw);
          // 暗号化したものを local.strage に保存する
          chrome.storage.local.set({'password': encpw}, function () {
            ConsoleLogCustom('local.set New password');
            // 結果を表示する
            // パスワードを変更しました
            outputMessageInElement('message',chrome.i18n.getMessage('ChangePassword_error5'));
            // 変更したら、フォームを非表示にする
            clickChangePassword();
          });
        } else{
          // password が合致しない
          // エラーを表示する
          // エラー：現在のパスワードが間違っています。
          outputMessageInElement('message',chrome.i18n.getMessage('ChangePassword_error6'));
        }
      }
    });
  } catch(e){
    console.log('ChangePassword failed:',e);
  }
}
// -----------------------------------------------------------
// Half-width alphanumeric
function isHalfWithAlphanumeric(value){
  try {
    // 半角英数記号のみ（空文字可）
    let regexp = new RegExp(/^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/);
    let ret = regexp.test(value);
    return ret;
  } catch(e){
    console.log('isHalfWithAlphanumeric failed:',e);
    return false;
  }
}

// -----------------------------------------------------------
// 文字列か数値かどうか判定する
function StringisNumber(value){
  try {
    // 半角英数記号のみ（空文字可）
    let regexp = new RegExp(/^[-]?([1-9]\d*|0)$/);
    let ret = regexp.test(value);
    return ret;
  } catch(e){
    console.log('StringisNumber failed:',e);
    return false;
  }
}
// -----------------------------------------------------------
// Login フラグを取得する
function GetLoginNow(){
  try {
    let ret;
    chrome.storage.local.get('LoginNow', function (items) {
      return items.LoginNow;
    });
  } catch(e){
    console.log('GetLoginNow failed:',e);
    return false;
  }
}
// -----------------------------------------------------------
// Login フラグを設定する
function SetLoginNow(flag){
  try {
    chrome.storage.local.set({'LoginNow': flag}, function () {
    });
  } catch(e){
    console.log('SetLoginNow failed:',e);
  }
}
// -----------------------------------------------------------
// 例外のスタックを表示する
function ShowStack(ex,functionName){
  try {
    console.log(functionName + ' Failed.');
    console.log(ex.stack);
  } catch(e){
    console.log('ShowStack Failed.');
    console.log('functionName : '+functionName);
    console.log(ex.stack);
  }
}

