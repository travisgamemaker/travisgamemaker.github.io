(window.webpackJsonpGUI=window.webpackJsonpGUI||[]).push([[28],{1672:function(e,s,a){(e.exports=a(11)(!1)).push([e.i,".sa-fullscreen.sa-body-editor {\n  overflow: hidden !important;\n}\n",""])},1673:function(e,s,a){(e.exports=a(11)(!1)).push([e.i,'[class*="stage-wrapper_full-screen"] [class*="stage_full-screen"],\n[class*="stage-wrapper_full-screen"] [class*="stage_green-flag-overlay-wrapper"] {\n  border: 0 !important;\n  border-radius: 0 !important;\n}\n',""])},1674:function(e,s,a){(e.exports=a(11)(!1)).push([e.i,'[class*="stage-wrapper_full-screen"] [class*="stage-wrapper_stage-canvas-wrapper"],\n[class*="stage-wrapper_full-screen"] [class*="stage_stage"],\n[class*="stage-wrapper_full-screen"] [class*="stage-header_stage-menu-wrapper"],\n[class*="stage-wrapper_full-screen"] canvas {\n  width: min(calc((100vh - 44px) * var(--sa-fullscreen-width) / var(--sa-fullscreen-height)), 100vw) !important;\n}\n\n[class*="stage-wrapper_full-screen"] [class*="stage-wrapper_stage-canvas-wrapper"],\n[class*="stage-wrapper_full-screen"] [class*="stage_stage"],\n[class*="stage-wrapper_full-screen"] [class*="stage_green-flag-overlay-wrapper"],\n[class*="stage-wrapper_full-screen"] canvas {\n  height: min(calc(100vh - 44px), calc(100vw * var(--sa-fullscreen-height) / var(--sa-fullscreen-width))) !important;\n}\n\n[class*="stage-wrapper_full-screen"] {\n  padding: 0rem !important;\n}\n\n[class*="stage-wrapper_full-screen"] [class*="monitor-list_monitor-list"] {\n  overflow: visible;\n}\n\n[class*="stage-wrapper_full-screen"] [class*="stage_question-wrapper"] {\n  width: auto !important;\n}\n',""])},1675:function(e,s,a){(e.exports=a(11)(!1)).push([e.i,'[class*="stage-wrapper_full-screen"] [class*="stage-wrapper_stage-canvas-wrapper"],\n[class*="stage-wrapper_full-screen"] [class*="stage_stage"],\n[class*="stage-wrapper_full-screen"] [class*="stage-header_stage-menu-wrapper"],\n[class*="stage-wrapper_full-screen"] canvas {\n  width: min(calc(100vh * var(--sa-fullscreen-width) / var(--sa-fullscreen-height)), 100vw) !important;\n}\n\n[class*="stage-wrapper_full-screen"] [class*="stage-wrapper_stage-canvas-wrapper"],\n[class*="stage-wrapper_full-screen"] [class*="stage_stage"],\n[class*="stage-wrapper_full-screen"] [class*="stage_green-flag-overlay-wrapper"],\n[class*="stage-wrapper_full-screen"] canvas {\n  height: min(100vh, calc(100vw * var(--sa-fullscreen-height) / var(--sa-fullscreen-width))) !important;\n}\n\n[class*="stage-wrapper_full-screen"] {\n  padding: 0rem !important;\n}\n\n[class*="stage-wrapper_full-screen"] [class*="monitor-list_monitor-list"] {\n  overflow: visible;\n}\n\n[class*="stage-wrapper_full-screen"] [class*="stage_question-wrapper"] {\n  width: auto !important;\n}\n',""])},1676:function(e,s,a){(e.exports=a(11)(!1)).push([e.i,'[class*="stage-wrapper_full-screen"] [class*="stage-header_stage-header-wrapper-overlay"] {\n  display: none;\n}\n\n[class*="stage-wrapper_full-screen"] {\n  top: 0rem !important;\n}\n',""])},1731:function(e,s,a){"use strict";a.r(s),a.d(s,"resources",(function(){return g}));var n=a(1672),r=a.n(n),t=a(1673),l=a.n(t),c=a(1674),i=a.n(c),p=a(1675),o=a.n(p),u=a(1676),d=a.n(u);const g={"userscript.js":async function({addon:e,global:s,console:a}){const n=e.tab.traps.vm,r=()=>{document.documentElement.style.setProperty("--sa-fullscreen-width",n.runtime.stageWidth),document.documentElement.style.setProperty("--sa-fullscreen-height",n.runtime.stageHeight)};function t(){e.settings.get("browserFullscreen")&&!e.self.disabled&&(e.tab.redux.state.scratchGui.mode.isFullScreen&&null===document.fullscreenElement?document.documentElement.requestFullscreen():e.tab.redux.state.scratchGui.mode.isFullScreen||null===document.fullscreenElement||document.exitFullscreen())}async function l(){const s=await e.tab.waitForElement(".sa-body-editor");e.tab.redux.state.scratchGui.mode.isFullScreen?s.classList.add("sa-fullscreen"):s.classList.remove("sa-fullscreen")}let c,i,p;async function o(){c=await e.tab.waitForElement("[class*=monitor-list_monitor-list-scaler]"),p=await e.tab.waitForElement('[class*="stage-wrapper_full-screen"] [class*="stage_stage"]'),i=new ResizeObserver(()=>{const e=p.getBoundingClientRect().width/480;c.style.transform="scale(".concat(e,", ").concat(e,")")}),i.observe(p)}r(),n.on("STAGE_SIZE_CHANGED",r),o(),l(),t(),e.tab.redux.initialize(),e.tab.redux.addEventListener("statechanged",e=>{"scratch-gui/mode/SET_FULL_SCREEN"===e.detail.action.type&&(o(),t(),l())}),window.addEventListener("resize",()=>{e.settings.get("browserFullscreen")&&!e.self.disabled&&null===document.fullscreenElement&&e.tab.redux.state.scratchGui.mode.isFullScreen&&e.tab.redux.dispatch({type:"scratch-gui/mode/SET_FULL_SCREEN",isFullScreen:!1})}),document.addEventListener("fullscreenchange",()=>{null===document.fullscreenElement&&e.tab.redux.state.scratchGui.mode.isFullScreen&&e.tab.redux.dispatch({type:"scratch-gui/mode/SET_FULL_SCREEN",isFullScreen:!1})}),e.settings.addEventListener("change",()=>{t()}),e.self.addEventListener("disabled",()=>{i.disconnect()}),e.self.addEventListener("reenabled",()=>{i.observe(p),t()})},"hideOverflow.css":r.a,"removeBorder.css":l.a,"resizeWindow.css":i.a,"resizeWindow_noToolbar.css":o.a,"hideToolbar.css":d.a}}}]);