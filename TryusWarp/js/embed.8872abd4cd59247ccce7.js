var GUI=function(e){function n(n){for(var a,o,c=n[0],l=n[1],s=n[2],b=0,i=[];b<c.length;b++)o=c[b],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&i.push(r[o][0]),r[o]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(e[a]=l[a]);for(f&&f(n);i.length;)i.shift()();return d.push.apply(d,s||[]),t()}function t(){for(var e,n=0;n<d.length;n++){for(var t=d[n],a=!0,c=1;c<t.length;c++){var l=t[c];0!==r[l]&&(a=!1)}a&&(d.splice(n--,1),e=o(o.s=t[0]))}return e}var a={},r={70:0},d=[];function o(n){if(a[n])return a[n].exports;var t=a[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,o),t.l=!0,t.exports}o.e=function(e){var n=[],t=r[e];if(0!==t)if(t)n.push(t[2]);else{var a=new Promise((function(n,a){t=r[e]=[n,a]}));n.push(t[2]=a);var d,c=document.createElement("script");c.charset="utf-8",c.timeout=120,o.nc&&c.setAttribute("nonce",o.nc),c.src=function(e){return o.p+"js/"+({1:"addon-settings~addons~editor~fullscreen~player",4:"addon-default-entry",5:"addon-entry-2d-color-picker",6:"addon-entry-better-img-uploads",7:"addon-entry-block-count",8:"addon-entry-block-palette-icons",9:"addon-entry-blocks2image",10:"addon-entry-cat-blocks",11:"addon-entry-clones",12:"addon-entry-columns",13:"addon-entry-custom-block-shape",14:"addon-entry-custom-block-text",15:"addon-entry-custom-zoom",16:"addon-entry-data-category-tweaks-v2",17:"addon-entry-debugger",18:"addon-entry-default-costume-editor-color",19:"addon-entry-disable-paste-offset",20:"addon-entry-disable-stage-drag-select",21:"addon-entry-editor-buttons-reverse-order",22:"addon-entry-editor-colored-context-menus",23:"addon-entry-editor-extra-keys",24:"addon-entry-editor-sounds",25:"addon-entry-editor-stage-left",26:"addon-entry-editor-stepping",27:"addon-entry-editor-theme3",28:"addon-entry-fullscreen",29:"addon-entry-gamepad",30:"addon-entry-hide-delete-button",31:"addon-entry-hide-flyout",32:"addon-entry-hide-new-variables",33:"addon-entry-hide-stage",34:"addon-entry-initialise-sprite-position",35:"addon-entry-load-extensions",36:"addon-entry-mediarecorder",37:"addon-entry-mouse-pos",38:"addon-entry-no-script-bumping",39:"addon-entry-paint-by-default",40:"addon-entry-remove-curved-stage-border",41:"addon-entry-remove-sprite-confirm",42:"addon-entry-script-snap",43:"addon-entry-search-sprites",44:"addon-entry-swap-local-global",45:"addon-entry-transparent-orphans",46:"addon-entry-tw-disable-compiler",47:"addon-entry-tw-remove-backpack",48:"addon-entry-tw-remove-feedback",49:"addon-entry-tw-straighten-comments",50:"addon-entry-variable-manager",51:"addon-entry-zebra-striping",52:"addon-l10n-de",53:"addon-l10n-es",54:"addon-l10n-fr",55:"addon-l10n-hu",56:"addon-l10n-it",57:"addon-l10n-ja",58:"addon-l10n-ko",59:"addon-l10n-nl",60:"addon-l10n-pl",61:"addon-l10n-pt",62:"addon-l10n-ro",63:"addon-l10n-ru",64:"addon-l10n-sl",65:"addon-l10n-tr",67:"addons",72:"iframe-extension-worker",73:"library-backdrops",74:"library-costumes",75:"library-sounds",76:"library-sprites",78:"sb"}[e]||e)+"."+{1:"3c60cfa39c7909d5891c",4:"d70e7bb309413c70caed",5:"7e488cf76aae3c85c825",6:"ce869cfbd494d9f71dfe",7:"0c8f9a137394985d24ec",8:"6fe4ce2e8d9c5b8b523b",9:"b4591185f33bed006e9a",10:"de915f99d19fbc9bc368",11:"4c135aa783f1fefab9a4",12:"f2ab34e82ee88dea3e4c",13:"aa6f4e2a2d50af9be2b8",14:"fce4c2c27070ca093e52",15:"5b70e02087a48c3c53c7",16:"efbbdc5bd4d6052839c2",17:"d3cf9b04629bf668f0f4",18:"801c040d46b8932a34db",19:"6582b554025fa3db81ad",20:"657a614298955edcbbe1",21:"3d174f1a89e66a2a4ac8",22:"c97dd115ef30bea2c2a2",23:"808f54c8968530f28bab",24:"b3b518bb8701414885b4",25:"082bb6777b3bb0c4d28d",26:"011504ff4190cfce72e4",27:"cd8f0eee68b6d05691c3",28:"f2228c80beecdc865f1b",29:"bef9b5e77eea3a48aaef",30:"aab7d2be1737fe875bec",31:"e47a90466a4aa568fcf9",32:"e7afc45e6aa924385221",33:"421ad757eea373c2e0a9",34:"c181183a7955fa2f048f",35:"b8c9075def7de3f9376a",36:"2c899a5b901fd11cfc47",37:"8581f4d9d0c2dec96c9a",38:"28ef6eb071d5a00caa96",39:"916f3ffc9b05b79a6b14",40:"8ee01d3e9415f6fb5b46",41:"b368884b5bec2cf74038",42:"fce458fffe979cdb9bf9",43:"08f127efe3315f712e31",44:"b7a766f9af8f5d20377d",45:"55d61ce08c956947c250",46:"3dbe67d75e8b4013849e",47:"6261ac2757daa838e6dd",48:"8be7fcc55935c8641c4e",49:"2df23634ac8165a1863e",50:"3af3515ffa4a583409d6",51:"4fe5f5c63a879e64d5ad",52:"5865d7cd25972fe5ae8d",53:"585c4dc418c2c1bcafe6",54:"d51b854ebe0eeeea78b1",55:"b35c66e46e51b73a6cfb",56:"c4204de66555a64629fd",57:"2227c44568b8ccc6d8c7",58:"565c8fadf9a0fc55bb4d",59:"1e947fd2bcc383a13ec6",60:"fb82bcb079801fb7bc3f",61:"2a8411ccb6c4bf16b79e",62:"90c4a0e0e0817b9504e5",63:"ed19cdaabb37b4bd0d6a",64:"bfbd4a9c0b7801066e22",65:"73d5c26938f0d8fd1554",67:"7fcff7507fc3f7eb369b",72:"8e3a757ecda932f2a3d4",73:"8fd3483e655244515a66",74:"5f773b0de17e22bd2107",75:"f49b9fff58b8e36503fd",76:"4ceae75c6e6d110cb58e",78:"b7f4003a3292dd5c2703"}[e]+".js"}(e);var l=new Error;d=function(n){c.onerror=c.onload=null,clearTimeout(s);var t=r[e];if(0!==t){if(t){var a=n&&("load"===n.type?"missing":n.type),d=n&&n.target&&n.target.src;l.message="Loading chunk "+e+" failed.\n("+a+": "+d+")",l.name="ChunkLoadError",l.type=a,l.request=d,t[1](l)}r[e]=void 0}};var s=setTimeout((function(){d({type:"timeout",target:c})}),12e4);c.onerror=c.onload=d,document.head.appendChild(c)}return Promise.all(n)},o.m=e,o.c=a,o.d=function(e,n,t){o.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,n){if(1&n&&(e=o(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var a in e)o.d(t,a,function(n){return e[n]}.bind(null,a));return t},o.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="",o.oe=function(e){throw console.error(e),e};var c=window.webpackJsonpGUI=window.webpackJsonpGUI||[],l=c.push.bind(c);c.push=n,c=c.slice();for(var s=0;s<c.length;s++)n(c[s]);var f=l;return d.push([1495,0,3,2]),t()}({1495:function(e,n,t){"use strict";t.r(n);t(289);var a=t(51),r=t.n(a),d=t(1),o=t.n(d),c=t(37),l=t(64),s=t(158),f=t(5),b=t.n(f),i=t(0),u=t.n(i),p=t(6),y=t(72),h=t(26),m=t(176);const g=["isFullScreen","onSetIsFullScreen","onSetWindowIsFullScreen"];function v(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},d=Object.keys(e);for(a=0;a<d.length;a++)t=d[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(e);for(a=0;a<d.length;a++)t=d[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var S=t(161),w=t(170),F=t(171),O=t(68);const j=(()=>{const e=location.hash.match(/#(\d+)/);if(null!==e)return e[1];const n=location.pathname.match(/(\d+)\/embed/);return null!==n?n[n.length-1]:"0"})(),k=new URLSearchParams(location.search);let I;const x=Object(c.d)(s.a,S.a,(function(e){class n extends o.a.Component{constructor(e){super(e),b()(this,["handleFullScreenChange"])}componentDidMount(){document.addEventListener("fullscreenchange",this.handleFullScreenChange),document.addEventListener("webkitfullscreenchange",this.handleFullScreenChange)}shouldComponentUpdate(e){return this.props.isFullScreen!==e.isFullScreen}componentDidUpdate(){m.a.available()&&(this.props.isFullScreen?m.a.request():m.a.enabled()&&m.a.exit())}componentWillUnmount(){document.removeEventListener("fullscreenchange",this.handleFullScreenChange),document.removeEventListener("webkitfullscreenchange",this.handleFullScreenChange)}handleFullScreenChange(){const e=m.a.enabled();this.props.onSetWindowIsFullScreen(e),this.props.onSetIsFullScreen(e)}render(){const n=this.props,{isFullScreen:t,onSetIsFullScreen:a,onSetWindowIsFullScreen:r}=n,d=v(n,g);return o.a.createElement(e,d)}}n.propTypes={isFullScreen:u.a.bool,onSetIsFullScreen:u.a.func,onSetWindowIsFullScreen:u.a.func};return Object(p.b)(e=>({isFullScreen:e.scratchGui.mode.isFullScreen}),e=>({onSetIsFullScreen:n=>e(Object(y.c)(n)),onSetWindowIsFullScreen:n=>e(Object(h.n)(n))}))(n)}))(F.a);Object(l.setAppElement)(O.a),r.a.render(o.a.createElement(x,{isEmbedded:!0,projectId:j,onVmInit:e=>{I=e,I.runtime.renderer.setPrivateSkinAccess(!1)},onProjectLoaded:()=>{k.has("autoplay")&&(I.start(),I.greenFlag())},routingStyle:"none"}),O.a),k.has("addons")&&Object(w.a)()}});