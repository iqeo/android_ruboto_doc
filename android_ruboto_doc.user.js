// ==UserScript==
// @name        Android Ruboto Documentation
// @description Ruboto code examples for Android developer documentation. Displayed in context while browsing http://developer.android.com.
// @grant       GM_xmlhttpRequest
// @version     0.2
// @namespace   https://android-ruboto-doc.iqeo.net
// @require     http://android-ruboto-doc.iqeo.net/android_ruboto_doc.functions.js
// @icon        https://android-ruboto-doc.iqeo.net/icon.png
// @updateURL   https://android-ruboto-doc.iqeo.net/android_ruboto_doc.user.js
// @downloadURL https://android-ruboto-doc.iqeo.net/android_ruboto_doc.user.js
// @match       *://developer.android.com/develop/*
// @match       *://developer.android.com/training/*
// @match       *://developer.android.com/guide/*
// @match       *://developer.android.com/reference/*
// @match       *://developer.android.com/tools/*
// @match       *://developer.android.com/google/*
// ==/UserScript==

/**

  TODO: test install+update+download+operation with Firefox, Chrome, IE?
  TODO: iqeo site home page (index.html), wiki headers & footers
  TODO: site home page - description, script installation, project license, doc CC license, doc guidelines
  TODO: disable wiki home page ?
  TODO: prevent access to .git directories
  TODO: set version number and announce

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

