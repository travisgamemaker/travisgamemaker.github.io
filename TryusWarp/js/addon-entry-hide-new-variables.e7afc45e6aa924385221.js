(window.webpackJsonpGUI=window.webpackJsonpGUI||[]).push([[32],{1651:function(t,e,s){"use strict";s.r(e),s.d(e,"resources",(function(){return a}));const a={"userscript.js":async function({addon:t,msg:e,global:s,console:a}){const o=await t.tab.traps.getBlockly(),c=o.Variables.createVariable;o.Variables.createVariable=function(e,s,a){if(!t.self.disabled){const t=s;s=s=>{if(s){const t=e.isFlyout?e:e.getFlyout();t.setCheckboxState&&t.setCheckboxState(s,!1)}t&&t(s)}}return c.call(this,e,s,a)}}}}}]);