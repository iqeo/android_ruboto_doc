// ==UserScript==
// @name    Android Ruboto Documentation
// @namespace http://diveintomark.org/projects/greasemonkey/
// @description Replace Java with Ruboto (Ruby) code examples at http://developer.android.com 
// @include   http://developer.android.com/*
// ==/UserScript==

/**
*
*  Secure Hash Algorithm (SHA1)
*  http://www.webtoolkit.info/
*
**/
 
function SHA1 (msg) {
 
  function rotate_left(n,s) {
    var t4 = ( n<<s ) | (n>>>(32-s));
    return t4;
  };
 
  function lsb_hex(val) {
    var str="";
    var i;
    var vh;
    var vl;
 
    for( i=0; i<=6; i+=2 ) {
      vh = (val>>>(i*4+4))&0x0f;
      vl = (val>>>(i*4))&0x0f;
      str += vh.toString(16) + vl.toString(16);
    }
    return str;
  };
 
  function cvt_hex(val) {
    var str="";
    var i;
    var v;
 
    for( i=7; i>=0; i-- ) {
      v = (val>>>(i*4))&0x0f;
      str += v.toString(16);
    }
    return str;
  };
 
 
  function Utf8Encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
 
    for (var n = 0; n < string.length; n++) {
 
      var c = string.charCodeAt(n);
 
      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
 
    }
 
    return utftext;
  };
 
  var blockstart;
  var i, j;
  var W = new Array(80);
  var H0 = 0x67452301;
  var H1 = 0xEFCDAB89;
  var H2 = 0x98BADCFE;
  var H3 = 0x10325476;
  var H4 = 0xC3D2E1F0;
  var A, B, C, D, E;
  var temp;
 
  msg = Utf8Encode(msg);
 
  var msg_len = msg.length;
 
  var word_array = new Array();
  for( i=0; i<msg_len-3; i+=4 ) {
    j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
    msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
    word_array.push( j );
  }
 
  switch( msg_len % 4 ) {
    case 0:
      i = 0x080000000;
    break;
    case 1:
      i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
    break;
 
    case 2:
      i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
    break;
 
    case 3:
      i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8  | 0x80;
    break;
  }
 
  word_array.push( i );
 
  while( (word_array.length % 16) != 14 ) word_array.push( 0 );
 
  word_array.push( msg_len>>>29 );
  word_array.push( (msg_len<<3)&0x0ffffffff );
 
 
  for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
 
    for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
    for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
 
    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;
 
    for( i= 0; i<=19; i++ ) {
      temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
 
    for( i=20; i<=39; i++ ) {
      temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
 
    for( i=40; i<=59; i++ ) {
      temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
 
    for( i=60; i<=79; i++ ) {
      temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B,30);
      B = A;
      A = temp;
    }
 
    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
 
  }
 
  var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
  return temp.toLowerCase();
 }

/**

  TODO: HTML escape... via DOM Text Node
        
        The "proper" way to escape text is to use the DOM function document.createTextNode. This doesn't actually escape the text; it just tells the browser to create a text element, which is inherently unparsed. You have to be willing to use the DOM for this method to work, however: that is, you have use methods such as appendChild, as opposed to the innerHTML property and similar. This would fill an element with ID an-element with text, which would not be parsed as (X)HTML:
    
          var textNode = document.createTextNode("<strong>This won't be bold.  The tags " + "will be visible.</strong>");
          document.getElementById('an-element').appendChild(textNode);

  TODO: work with http & https
  TODO: limit path at developer.android.com
  TODO: 'edit/contribute' list item (not like a tab)
  TODO: 'about list item' (not like a tab)
  TODO: test with Firefox, Chrome, IE
  
**/
 
var style = document.createElement("style");
style.innerHTML = [
  ".ard-nav { padding: 3px 0; margin: 0; border-bottom: 1px solid #DDDDDD; font: bold 12px Verdana, sans-serif; }",
  ".ard-nav li { list-style: none; margin: 0; display: inline; }",
  ".ard-nav li a { padding: 3px 0.5em; border: 1px solid #DDDDDD; border-bottom: none; background: white; text-decoration: none; }",
  ".ard-nav li a.ard-nav-current { background: #F7F7F7; border-bottom: 1px solid #F7F7F7; outline: 0; }",
  ".ard-nav li a:hover { color: #000; }"
].join('\n');
document.head.appendChild(style);

var pres = document.getElementsByTagName("pre");
var filename_prefix = window.location.pathname.replace(/^\//,"").replace(/[\/\.]/g,"_") + "_";

for (var i = 0 ; i < pres.length; i++) {
  var pre = pres[i];
  var java_checksum = SHA1(pre.innerHTML);
  var filename = filename_prefix + java_checksum + ".txt"
  var java_text = pre.innerHTML
  var ruby_url = "http://android-ruboto-doc.iqeo.net/docs/" + filename
  pre.innerHTML = ruby_url
  GM_xmlhttpRequest({
    method:  "GET",
    url:     ruby_url,
    data:    "",
    context: { pre: pre, filename: filename, java_text: java_text },
    onload:  function(response) {
      var pre = response.context.pre;
      // style change for pre...{ border-top: none; }
      pre.setAttribute("style","border-top: none;");     
      // tabs
      var tabs = document.createElement("ul");
      tabs.setAttribute("class","ard-nav");
      pre.parentElement.insertBefore(tabs,pre);
      if ( response.status == 200 ) {
        // display ruboto content
        var ruby_text = response.responseText; //todo: html escape this ?
        pre.innerHTML = ruby_text;
        // ruby tab
        var ruby_tab_link = document.createElement("a");
        ruby_tab_link.appendChild(document.createTextNode("Ruboto"));
        ruby_tab_link.setAttribute("href","#");
        ruby_tab_link.setAttribute("class","ard-nav-current");
        ruby_tab_link.setAttribute("alt",ruby_text); //todo: html escape this ?
        ruby_tab_link.setAttribute("onclick","this.setAttribute('class','ard-nav-current');this.parentElement.nextElementSibling.firstElementChild.removeAttribute('class');this.parentElement.parentElement.nextElementSibling.innerHTML=this.getAttribute('alt');return false;");
        var ruby_tab = document.createElement("li");
        ruby_tab.appendChild(ruby_tab_link);
        tabs.appendChild(ruby_tab);
        // java tab
        var java_tab_link = document.createElement("a");
        java_tab_link.appendChild(document.createTextNode("Java"));
        java_tab_link.setAttribute("href","#");
        java_tab_link.setAttribute("alt",response.context.java_text); //todo: html escape this ?
        java_tab_link.setAttribute("onclick","this.setAttribute('class','ard-nav-current');this.parentElement.previousElementSibling.firstElementChild.removeAttribute('class');this.parentElement.parentElement.nextElementSibling.innerHTML=this.getAttribute('alt');return false;");
        var java_tab = document.createElement("li");
        java_tab.appendChild(java_tab_link);
        tabs.appendChild(java_tab);
        // edit button
        //var edit_button = document.createElement("button");
        //edit_button.appendChild(document.createTextNode("Contribute edits by email..."));
        //edit_button.setAttribute("onclick","window.location.href='mailto:android-ruboto-doc@iqeo.net?subject=doc:" + filename + "';");
        //div.appendChild(edit_button);
      }
      //var about = document.createElement("a");
      //about.appendChild(document.createTextNode("About"));
      //about.setAttribute("href","http://android-ruboto-doc.iqeo.net");
      //about.setAttribute("target","_blank");
      //div.appendChild(about)
    }
  });
}

