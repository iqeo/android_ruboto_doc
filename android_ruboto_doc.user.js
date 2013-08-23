// ==UserScript==
// @name        Android Ruboto Documentation
// @description Ruboto code examples for Android developer documentation. Displayed in context while browsing http://developer.android.com.
// @grant       GM_xmlhttpRequest
// @version     0.4
// @namespace   https://android-ruboto-doc.iqeo.net
// //@require-NOT     http://android-ruboto-doc.iqeo.net/android_ruboto_doc.functions.js
// @icon        https://android-ruboto-doc.iqeo.net/images/icon.png
// @updateURL   https://android-ruboto-doc.iqeo.net/android_ruboto_doc.user.js
// @downloadURL https://android-ruboto-doc.iqeo.net/android_ruboto_doc.user.js
// //@match-NOT       *://android-ruboto-doc.iqeo.net/*
// @match       *://developer.android.com/develop/*
// @match       *://developer.android.com/training/*
// @match       *://developer.android.com/guide/*
// @match       *://developer.android.com/reference/*
// @match       *://developer.android.com/tools/*
// @match       *://developer.android.com/google/*
// ==/UserScript==

/**

  TODO: generate index.html (+favicon link) from readme.md
  TODO: iqeo site home page (index.html), wiki headers & footers
  TODO: setup android-ruboto-doc.iqeo.net site via 'git clone'
  TODO: set version number and announce
  TODO: fails in Chrome & TamperMonkey - response.context is undefined (can't read java_pre) at line 235)
  TODO: + context may only be a string now in Chrome ? - now need to pack and unpack values or serialize ?
  
**/

var ruby_host_url = "http://android-ruboto-doc.iqeo.net";

var style = document.createElement( "style" );
style.innerHTML = [
  ".ard { padding: 3px 0; margin: 0; border-bottom: 1px solid #DDDDDD; font: bold 12px Verdana, sans-serif; }",
  ".ard li.ard-msg { padding: 3px 0.5em; font: italic 12px Verdana, sans-serif; color: #555555; }",
  ".ard li { list-style: none; margin: 0; display: inline; }",
  ".ard li a.ard-tab { padding: 3px 0.5em; border: 1px solid #DDDDDD; border-bottom: none; background: white; text-decoration: none; }",
  ".ard li a.ard-current { background: #F7F7F7; border-bottom: 1px solid #F7F7F7; outline: 0; }",
  ".ard li a.ard-link { padding: 3px 0.5em; font: 12px Verdana, sans-serif; }"
].join('\n');
document.head.appendChild( style );

var pres = document.getElementsByTagName( "pre" );
var doc_name_prefix = window.location.pathname.replace( /^\//, "" ).replace( /[\/\.]/g, "-" ) + "-";

for ( var i = 0 ; i < pres.length; i++ ) {
  var java_pre = pres[i];
  var java_checksum = SHA1( java_pre.innerHTML );
  var doc_name = doc_name_prefix + java_checksum;
  var java_text = java_pre.innerHTML;
  var ruby_url = ruby_host_url + "/data/wiki/" + doc_name;
  GM_xmlhttpRequest( {
    method:  "GET",
    url:     ruby_url,
    data:    "",
    context: { java_pre: java_pre, java_checksum: java_checksum, ruby_host_url: ruby_host_url, doc_name: doc_name },
    onload:  function( response ) {
      var java_pre      = response.context.java_pre;
      var java_checksum = response.context.java_checksum;
      var ruby_host_url = response.context.ruby_host_url;
      var doc_name      = response.context.doc_name;
      var tabs = document.createElement( "ul" );
      tabs.setAttribute( "class", "ard" );
      java_pre.setAttribute( "id",    "ard-java-pre_" + java_checksum );
      java_pre.setAttribute( "style", "border-top: none;" );     
      java_pre.parentElement.insertBefore(tabs,java_pre);
      switch( response.status ) {
        case 200:
          var ruby_text = response.responseText;
          if ( ruby_text.length > 0 ) {
            var ruby_pre = document.createElement( "pre" );
            ruby_pre.appendChild( document.createTextNode( ruby_text ) );      // this does not parse html no escaping needed
            ruby_pre.setAttribute( "id",    "ard-ruby-pre_" + java_checksum );
            ruby_pre.setAttribute( "class", "prettyprint" );
            ruby_pre.setAttribute( "style", "border-top: none;" );     
            java_pre.setAttribute( "style", "border-top: none; display: none;" );     
            java_pre.parentElement.insertBefore( ruby_pre, java_pre );
            var ruby_link = document.createElement( "a" );
            ruby_link.appendChild( document.createTextNode( "Ruboto" ) );
            ruby_link.setAttribute( "id",      "ard-ruby-link_" + java_checksum );
            ruby_link.setAttribute( "class",   "ard-tab ard-current" );
            ruby_link.setAttribute( "href",    "#" );
            ruby_link.setAttribute( "onclick", [
              "this.setAttribute( 'class', 'ard-tab ard-current' );",
              "document.getElementById( 'ard-java-link_" + java_checksum + "').setAttribute( 'class', 'ard-tab' );",
              "document.getElementById( 'ard-edit-link_" + java_checksum + "').style.display = 'inline';",
              "document.getElementById( 'ard-java-pre_"  + java_checksum + "').style.display = 'none';",
              "document.getElementById( 'ard-ruby-pre_"  + java_checksum + "').style.display = 'block';",
              "return false;"
            ].join('\n'));
            var ruby_tab = document.createElement( "li" );
            ruby_tab.appendChild( ruby_link );
            tabs.appendChild( ruby_tab );
            var java_link = document.createElement( "a" );
            java_link.appendChild( document.createTextNode( "Java" ) );
            java_link.setAttribute( "id",      "ard-java-link_" + java_checksum );
            java_link.setAttribute( "class",   "ard-tab" );
            java_link.setAttribute( "href",    "#" );
            java_link.setAttribute( "onclick", [
              "this.setAttribute( 'class', 'ard-tab ard-current' );",
              "document.getElementById( 'ard-ruby-link_" + java_checksum + "').setAttribute( 'class', 'ard-tab' );",
              "document.getElementById( 'ard-edit-link_" + java_checksum + "').style.display = 'none';",
              "document.getElementById( 'ard-ruby-pre_"  + java_checksum + "').style.display = 'none';",
              "document.getElementById( 'ard-java-pre_"  + java_checksum + "').style.display = 'block';",
              "return false;"
            ].join('\n'));
            var java_tab = document.createElement( "li" );
            java_tab.appendChild( java_link );
            tabs.appendChild( java_tab );
            var edit_link = document.createElement( "a" );
            edit_link.appendChild( document.createTextNode( "Edit" ) );
            edit_link.setAttribute( "id",     "ard-edit-link_" + java_checksum );
            edit_link.setAttribute( "class",  "ard-link" );
            edit_link.setAttribute( "href",   ruby_host_url + "/edit/wiki/" + doc_name );
            edit_link.setAttribute( "target", "_blank" );
            var edit_item = document.createElement( "li" );
            edit_item.appendChild( edit_link );
            tabs.appendChild( edit_item );
          } else {
            var create_link = document.createElement( "a" );
            create_link.appendChild( document.createTextNode( "No Ruboto documentation for this example, please create it." ) );
            create_link.setAttribute( "class", "ard-link" );
            create_link.setAttribute( "href", ruby_host_url + "/create/wiki/" + doc_name );
            create_link.setAttribute( "target", "_blank" );
            var create_item = document.createElement( "li" );
            create_item.appendChild( create_link );
            tabs.appendChild( create_item );
          }
          break;        
        default:
          var problem_item = document.createElement( "li" );
          problem_item.appendChild( document.createTextNode( "Ruboto documentation curently unavailable." ) );
          problem_item.setAttribute( "class", "ard-msg" );
          tabs.appendChild( problem_item );
      }
      var about_link = document.createElement( "a" );
      about_link.appendChild( document.createTextNode( "About" ));
      about_link.setAttribute( "class",  "ard-link");
      about_link.setAttribute( "href",   ruby_host_url + "/" );
      about_link.setAttribute( "target", "_blank" );
      var about_item = document.createElement( "li" );
      about_item.appendChild( about_link );
      tabs.appendChild( about_item );
    }
  });
}


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


