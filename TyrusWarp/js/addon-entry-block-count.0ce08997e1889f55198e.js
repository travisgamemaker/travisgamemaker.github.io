(window.webpackJsonpGUI=window.webpackJsonpGUI||[]).push([[7],{1704:function(e,t,n){"use strict";n.r(t),n.d(t,"resources",(function(){return o}));const o={"blockcount.js":async function({addon:e,console:t,msg:n}){const o=e.tab.traps.vm,s=()=>{let e=0,t=0,n=new Set(o.runtime.targets.map(e=>e.sprite.blocks._blocks));return n.forEach((n,o)=>{t+=Object.values(n).filter(e=>!e.parent).length,e+=Object.values(n).filter(e=>!e.shadow).length}),{blockCount:e,scriptCount:t,spriteCount:n.size-1}},a=async()=>{if(o.editingTarget){let t=null;for(;;){let a,c=(await e.tab.waitForElement("[class^='menu-bar_main-menu']",{markAsSeen:!0,reduxEvents:["scratch-gui/mode/SET_PLAYER","fontsLoaded/SET_FONTS_LOADED","scratch-gui/locales/SELECT_LOCALE"],reduxCondition:e=>!e.scratchGui.mode.isPlayerOnly})).appendChild(document.createElement("span"));e.tab.displayNoneWhileDisabled(c),c.style.order=1,c.style.padding="9px",c.innerText=n("blocks",{num:s().blockCount}),t&&(o.off("PROJECT_CHANGED",t),o.runtime.off("PROJECT_LOADED",t)),t=async()=>{clearTimeout(a),a=setTimeout(async()=>{c.innerText=n("blocks",{num:s().blockCount})},1e3)},o.on("PROJECT_CHANGED",t),o.runtime.on("PROJECT_LOADED",t)}}else{let e=setTimeout((function(){a(),clearTimeout(e)}),1e3)}};a()}}}}]);