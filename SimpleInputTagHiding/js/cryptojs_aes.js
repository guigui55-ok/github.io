
// licence : <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js" integrity="sha512-nOQuvD9nKirvxDdvQ9OMqe2dgapbPB7vYAMrzJihw5m+aNcf0dX53m6YxM4LgA9u8e9eg9QX+/+mPu8kCNpV2A==" crossorigin="anonymous"></script>

//document.write("<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js'></script>");

function Encrypt(pw,keyPhrase) {
    return CryptoJS.AES.encrypt(pw, keyPhrase).toString();
}

function Decrypt(encpw,keyPhrase) {
    return CryptoJS.AES.decrypt(encpw, keyPhrase).toString(CryptoJS.enc.Utf8);
}
