var GUI=function(e){function n(n){for(var a,o,c=n[0],l=n[1],s=n[2],u=0,f=[];u<c.length;u++)o=c[u],Object.prototype.hasOwnProperty.call(d,o)&&d[o]&&f.push(d[o][0]),d[o]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(e[a]=l[a]);for(i&&i(n);f.length;)f.shift()();return r.push.apply(r,s||[]),t()}function t(){for(var e,n=0;n<r.length;n++){for(var t=r[n],a=!0,c=1;c<t.length;c++){var l=t[c];0!==d[l]&&(a=!1)}a&&(r.splice(n--,1),e=o(o.s=t[0]))}return e}var a={},d={70:0},r=[];function o(n){if(a[n])return a[n].exports;var t=a[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,o),t.l=!0,t.exports}o.e=function(e){var n=[],t=d[e];if(0!==t)if(t)n.push(t[2]);else{var a=new Promise((function(n,a){t=d[e]=[n,a]}));n.push(t[2]=a);var r,c=document.createElement("script");c.charset="utf-8",c.timeout=120,o.nc&&c.setAttribute("nonce",o.nc),c.src=function(e){return o.p+"js/"+({1:"addon-settings~addons~editor~fullscreen~player",4:"addon-default-entry",5:"addon-entry-2d-color-picker",6:"addon-entry-better-img-uploads",7:"addon-entry-block-count",8:"addon-entry-block-palette-icons",9:"addon-entry-blocks2image",10:"addon-entry-cat-blocks",11:"addon-entry-clones",12:"addon-entry-columns",13:"addon-entry-custom-block-shape",14:"addon-entry-custom-block-text",15:"addon-entry-custom-zoom",16:"addon-entry-data-category-tweaks-v2",17:"addon-entry-debugger",18:"addon-entry-default-costume-editor-color",19:"addon-entry-disable-paste-offset",20:"addon-entry-disable-stage-drag-select",21:"addon-entry-editor-buttons-reverse-order",22:"addon-entry-editor-colored-context-menus",23:"addon-entry-editor-extra-keys",24:"addon-entry-editor-sounds",25:"addon-entry-editor-stage-left",26:"addon-entry-editor-stepping",27:"addon-entry-editor-theme3",28:"addon-entry-fullscreen",29:"addon-entry-gamepad",30:"addon-entry-hide-delete-button",31:"addon-entry-hide-flyout",32:"addon-entry-hide-new-variables",33:"addon-entry-hide-stage",34:"addon-entry-initialise-sprite-position",35:"addon-entry-load-extensions",36:"addon-entry-mediarecorder",37:"addon-entry-mouse-pos",38:"addon-entry-no-script-bumping",39:"addon-entry-paint-by-default",40:"addon-entry-remove-curved-stage-border",41:"addon-entry-remove-sprite-confirm",42:"addon-entry-script-snap",43:"addon-entry-search-sprites",44:"addon-entry-swap-local-global",45:"addon-entry-transparent-orphans",46:"addon-entry-tw-disable-compiler",47:"addon-entry-tw-remove-backpack",48:"addon-entry-tw-remove-feedback",49:"addon-entry-tw-straighten-comments",50:"addon-entry-variable-manager",51:"addon-entry-zebra-striping",52:"addon-l10n-de",53:"addon-l10n-es",54:"addon-l10n-fr",55:"addon-l10n-hu",56:"addon-l10n-it",57:"addon-l10n-ja",58:"addon-l10n-ko",59:"addon-l10n-nl",60:"addon-l10n-pl",61:"addon-l10n-pt",62:"addon-l10n-ro",63:"addon-l10n-ru",64:"addon-l10n-sl",65:"addon-l10n-tr",67:"addons",72:"iframe-extension-worker",73:"library-backdrops",74:"library-costumes",75:"library-sounds",76:"library-sprites",78:"sb"}[e]||e)+"."+{1:"f64477b99f4a4ed58551",4:"f311f94580aff017dffd",5:"425243c7396c4bfd27df",6:"5109b892f1c7f42efd71",7:"0ce08997e1889f55198e",8:"e6cba6ac59ed60048b16",9:"99d57842e9ce7f6732f4",10:"638d937f1d00a1ffa908",11:"657dc13842dc34cf124f",12:"ebc7ff32849b177f3cb5",13:"288034f387f0ec439beb",14:"373a1add71ba9a0e26a6",15:"37374e452c83164bc327",16:"dc313609c7a23e73bc2b",17:"67e98c590937bbda8c03",18:"b5d06a914aa5bd07518f",19:"ddbc7f9ecb170758d098",20:"34307ba5c6b7b4826808",21:"a35d6148bee909b0b838",22:"025a9877029a6e0c7dd4",23:"5d44e8905b7abfef9d6f",24:"d42592814a376a0c317d",25:"dc7fb3ba249855f63c82",26:"94f65e40328e8dc2b042",27:"72da9be016d6493ac7d7",28:"6838ffda7ac8a235ae60",29:"cb7edc98aad412165172",30:"6761b3881d1e3ec26891",31:"06256e602c5ce862ddb1",32:"70256dee66a5eaa25df1",33:"cf6a59de084a7e5d1d29",34:"fe1c473c47ef5bd23950",35:"b9694f71d21fa5e6a745",36:"a92a4e6263cc616cb378",37:"25afde1b8de12d0b51db",38:"60c4229385d0b4b1fa28",39:"620e78070b733eecc423",40:"b8b00820594825302439",41:"2790a299fda812f3873d",42:"075b204c4c7c750737ca",43:"50e82ba402433c36d944",44:"23a657f45ee905e0f5ca",45:"3780d1c7e9f91bf7bca9",46:"ed1b5a5457aa3cf41fd7",47:"f06151686e03a7c8eae8",48:"e93f3c0e7f940e7faad7",49:"24cda02e6b5d0094a70f",50:"5c8a51424318cb95a35a",51:"5dbad705eac02612444c",52:"47302940e9f53ea323ee",53:"67fed675c3d9d1853e23",54:"dc25e74b856e6584723a",55:"036d7476c485b49e56fe",56:"2784268d921490f9dd97",57:"cea11adfd24629505e70",58:"b0a08981a23c8cde6305",59:"86caa693f4ba9aeb48e1",60:"25c1a5da49a7bdd9b223",61:"bf4890055673cb975931",62:"2e0b82a384c7f149cb86",63:"b989d998a8599508b429",64:"4201fb8d418d52b9ce50",65:"9e367651ae5ff283b4c7",67:"e85d3b984be533db10b3",72:"d65f2addcbead25c14e6",73:"28394003f909593639b4",74:"1788b80aca328de6ea70",75:"fa37bf020257ba4494a9",76:"4851e3cd0b0fdec219f8",78:"e649d8fcceb88566b826"}[e]+".js"}(e);var l=new Error;r=function(n){c.onerror=c.onload=null,clearTimeout(s);var t=d[e];if(0!==t){if(t){var a=n&&("load"===n.type?"missing":n.type),r=n&&n.target&&n.target.src;l.message="Loading chunk "+e+" failed.\n("+a+": "+r+")",l.name="ChunkLoadError",l.type=a,l.request=r,t[1](l)}d[e]=void 0}};var s=setTimeout((function(){r({type:"timeout",target:c})}),12e4);c.onerror=c.onload=r,document.head.appendChild(c)}return Promise.all(n)},o.m=e,o.c=a,o.d=function(e,n,t){o.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,n){if(1&n&&(e=o(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var a in e)o.d(t,a,function(n){return e[n]}.bind(null,a));return t},o.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="",o.oe=function(e){throw console.error(e),e};var c=window.webpackJsonpGUI=window.webpackJsonpGUI||[],l=c.push.bind(c);c.push=n,c=c.slice();for(var s=0;s<c.length;s++)n(c[s]);var i=l;return r.push([1564,0,3,2]),t()}({1564:function(e,n,t){"use strict";t.r(n);t(295);var a=t(54),d=t.n(a),r=t(1),o=t.n(r),c=t(50),l=t(65),s=t(163),i=t(7),u=t.n(i),f=t(0),b=t.n(f),p=t(9),y=t(73),h=t(29),m=t(182);const g=["isFullScreen","onSetIsFullScreen","onSetWindowIsFullScreen"];function v(e,n){if(null==e)return{};var t,a,d=function(e,n){if(null==e)return{};var t,a,d={},r=Object.keys(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||(d[t]=e[t]);return d}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(d[t]=e[t])}return d}var S=t(166),w=t(175),F=t(176),O=t(69);const j=(()=>{const e=location.hash.match(/#(\d+)/);if(null!==e)return e[1];const n=location.pathname.match(/(\d+)\/embed/);return null!==n?n[n.length-1]:"0"})(),k=new URLSearchParams(location.search);let I;const x=Object(c.d)(s.a,S.a,(function(e){class n extends o.a.Component{constructor(e){super(e),u()(this,["handleFullScreenChange"])}componentDidMount(){document.addEventListener("fullscreenchange",this.handleFullScreenChange),document.addEventListener("webkitfullscreenchange",this.handleFullScreenChange)}shouldComponentUpdate(e){return this.props.isFullScreen!==e.isFullScreen}componentDidUpdate(){m.a.available()&&(this.props.isFullScreen?m.a.request():m.a.enabled()&&m.a.exit())}componentWillUnmount(){document.removeEventListener("fullscreenchange",this.handleFullScreenChange),document.removeEventListener("webkitfullscreenchange",this.handleFullScreenChange)}handleFullScreenChange(){const e=m.a.enabled();this.props.onSetWindowIsFullScreen(e),this.props.onSetIsFullScreen(e)}render(){const n=this.props,{isFullScreen:t,onSetIsFullScreen:a,onSetWindowIsFullScreen:d}=n,r=v(n,g);return o.a.createElement(e,r)}}n.propTypes={isFullScreen:b.a.bool,onSetIsFullScreen:b.a.func,onSetWindowIsFullScreen:b.a.func};return Object(p.b)(e=>({isFullScreen:e.scratchGui.mode.isFullScreen}),e=>({onSetIsFullScreen:n=>e(Object(y.c)(n)),onSetWindowIsFullScreen:n=>e(Object(h.n)(n))}))(n)}))(F.a);Object(l.setAppElement)(O.a),d.a.render(o.a.createElement(x,{isEmbedded:!0,projectId:j,onVmInit:e=>{I=e,I.runtime.renderer.setPrivateSkinAccess(!1)},onProjectLoaded:()=>{k.has("autoplay")&&(I.start(),I.greenFlag())},routingStyle:"none"}),O.a),k.has("addons")&&Object(w.a)()}});