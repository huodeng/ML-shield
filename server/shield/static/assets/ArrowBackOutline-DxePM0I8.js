import{d as U,v as l,r as $,bG as he,bH as ct,bI as ft,x as pt,a3 as ut,K as Ce,am as vt,bO as ht,F as gt,a5 as xt,b3 as mt,J,c4 as yt,y as r,U as n,D as u,E as m,X as wt,Y as te,H as ge,V as ae,I as St,L as Re,c5 as Ct,aU as xe,aH as Rt,S as re,b as zt,c6 as oe,a1 as $t,at as A,c7 as Tt,R as Pt,O as E,b5 as K,P as Wt,bL as _t,bd as kt,c8 as Bt,a$ as Lt,aI as ne,a_ as At,a4 as q,c as Et,a as me,o as jt}from"./index-Bxc172j1.js";import{A as Ht}from"./Add-Dci-peTu.js";const Ot=he(".v-x-scroll",{overflow:"auto",scrollbarWidth:"none"},[he("&::-webkit-scrollbar",{width:0,height:0})]),It=U({name:"XScroll",props:{disabled:Boolean,onScroll:Function},setup(){const e=$(null);function s(d){!(d.currentTarget.offsetWidth<d.currentTarget.scrollWidth)||d.deltaY===0||(d.currentTarget.scrollLeft+=d.deltaY+d.deltaX,d.preventDefault())}const b=ct();return Ot.mount({id:"vueuc/x-scroll",head:!0,anchorMetaName:ft,ssr:b}),Object.assign({selfRef:e,handleWheel:s},{scrollTo(...d){var y;(y=e.value)===null||y===void 0||y.scrollTo(...d)}})},render(){return l("div",{ref:"selfRef",onScroll:this.onScroll,onWheel:this.disabled?void 0:this.handleWheel,class:"v-x-scroll"},this.$slots)}}),le=pt("n-tabs"),ze={tab:[String,Number,Object,Function],name:{type:[String,Number],required:!0},disabled:Boolean,displayDirective:{type:String,default:"if"},closable:{type:Boolean,default:void 0},tabProps:Object,label:[String,Number,Object,Function]},Xt=U({__TAB_PANE__:!0,name:"TabPane",alias:["TabPanel"],props:ze,slots:Object,setup(e){const s=Ce(le,null);return s||ut("tab-pane","`n-tab-pane` must be placed inside `n-tabs`."),{style:s.paneStyleRef,class:s.paneClassRef,mergedClsPrefix:s.mergedClsPrefixRef}},render(){return l("div",{class:[`${this.mergedClsPrefix}-tab-pane`,this.class],style:this.style},this.$slots)}}),Ft=Object.assign({internalLeftPadded:Boolean,internalAddable:Boolean,internalCreatedByPane:Boolean},yt(ze,["displayDirective"])),ie=U({__TAB__:!0,inheritAttrs:!1,name:"Tab",props:Ft,setup(e){const{mergedClsPrefixRef:s,valueRef:b,typeRef:w,closableRef:d,tabStyleRef:y,addTabStyleRef:v,tabClassRef:S,addTabClassRef:C,tabChangeIdRef:h,onBeforeLeaveRef:f,triggerRef:j,handleAdd:B,activateTab:g,handleClose:R}=Ce(le);return{trigger:j,mergedClosable:J(()=>{if(e.internalAddable)return!1;const{closable:x}=e;return x===void 0?d.value:x}),style:y,addStyle:v,tabClass:S,addTabClass:C,clsPrefix:s,value:b,type:w,handleClose(x){x.stopPropagation(),!e.disabled&&R(e.name)},activateTab(){if(e.disabled)return;if(e.internalAddable){B();return}const{name:x}=e,P=++h.id;if(x!==b.value){const{value:L}=f;L?Promise.resolve(L(e.name,b.value)).then(T=>{T&&h.id===P&&g(x)}):g(x)}}}},render(){const{internalAddable:e,clsPrefix:s,name:b,disabled:w,label:d,tab:y,value:v,mergedClosable:S,trigger:C,$slots:{default:h}}=this,f=d??y;return l("div",{class:`${s}-tabs-tab-wrapper`},this.internalLeftPadded?l("div",{class:`${s}-tabs-tab-pad`}):null,l("div",Object.assign({key:b,"data-name":b,"data-disabled":w?!0:void 0},vt({class:[`${s}-tabs-tab`,v===b&&`${s}-tabs-tab--active`,w&&`${s}-tabs-tab--disabled`,S&&`${s}-tabs-tab--closable`,e&&`${s}-tabs-tab--addable`,e?this.addTabClass:this.tabClass],onClick:C==="click"?this.activateTab:void 0,onMouseenter:C==="hover"?this.activateTab:void 0,style:e?this.addStyle:this.style},this.internalCreatedByPane?this.tabProps||{}:this.$attrs)),l("span",{class:`${s}-tabs-tab__label`},e?l(gt,null,l("div",{class:`${s}-tabs-tab__height-placeholder`}," "),l(xt,{clsPrefix:s},{default:()=>l(Ht,null)})):h?h():typeof f=="object"?f:ht(f??b)),S&&this.type==="card"?l(mt,{clsPrefix:s,class:`${s}-tabs-tab__close`,onClick:this.handleClose,disabled:w}):null))}}),Dt=r("tabs",`
 box-sizing: border-box;
 width: 100%;
 display: flex;
 flex-direction: column;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
`,[n("segment-type",[r("tabs-rail",[u("&.transition-disabled",[r("tabs-capsule",`
 transition: none;
 `)])])]),n("top",[r("tab-pane",`
 padding: var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left);
 `)]),n("left",[r("tab-pane",`
 padding: var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left) var(--n-pane-padding-top);
 `)]),n("left, right",`
 flex-direction: row;
 `,[r("tabs-bar",`
 width: 2px;
 right: 0;
 transition:
 top .2s var(--n-bezier),
 max-height .2s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),r("tabs-tab",`
 padding: var(--n-tab-padding-vertical); 
 `)]),n("right",`
 flex-direction: row-reverse;
 `,[r("tab-pane",`
 padding: var(--n-pane-padding-left) var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom);
 `),r("tabs-bar",`
 left: 0;
 `)]),n("bottom",`
 flex-direction: column-reverse;
 justify-content: flex-end;
 `,[r("tab-pane",`
 padding: var(--n-pane-padding-bottom) var(--n-pane-padding-right) var(--n-pane-padding-top) var(--n-pane-padding-left);
 `),r("tabs-bar",`
 top: 0;
 `)]),r("tabs-rail",`
 position: relative;
 padding: 3px;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 background-color: var(--n-color-segment);
 transition: background-color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 `,[r("tabs-capsule",`
 border-radius: var(--n-tab-border-radius);
 position: absolute;
 pointer-events: none;
 background-color: var(--n-tab-color-segment);
 box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .08);
 transition: transform 0.3s var(--n-bezier);
 `),r("tabs-tab-wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[r("tabs-tab",`
 overflow: hidden;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[n("active",`
 font-weight: var(--n-font-weight-strong);
 color: var(--n-tab-text-color-active);
 `),u("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])])]),n("flex",[r("tabs-nav",`
 width: 100%;
 position: relative;
 `,[r("tabs-wrapper",`
 width: 100%;
 `,[r("tabs-tab",`
 margin-right: 0;
 `)])])]),r("tabs-nav",`
 box-sizing: border-box;
 line-height: 1.5;
 display: flex;
 transition: border-color .3s var(--n-bezier);
 `,[m("prefix, suffix",`
 display: flex;
 align-items: center;
 `),m("prefix","padding-right: 16px;"),m("suffix","padding-left: 16px;")]),n("top, bottom",[r("tabs-nav-scroll-wrapper",[u("&::before",`
 top: 0;
 bottom: 0;
 left: 0;
 width: 20px;
 `),u("&::after",`
 top: 0;
 bottom: 0;
 right: 0;
 width: 20px;
 `),n("shadow-start",[u("&::before",`
 box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, .12);
 `)]),n("shadow-end",[u("&::after",`
 box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, .12);
 `)])])]),n("left, right",[r("tabs-nav-scroll-content",`
 flex-direction: column;
 `),r("tabs-nav-scroll-wrapper",[u("&::before",`
 top: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),u("&::after",`
 bottom: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),n("shadow-start",[u("&::before",`
 box-shadow: inset 0 10px 8px -8px rgba(0, 0, 0, .12);
 `)]),n("shadow-end",[u("&::after",`
 box-shadow: inset 0 -10px 8px -8px rgba(0, 0, 0, .12);
 `)])])]),r("tabs-nav-scroll-wrapper",`
 flex: 1;
 position: relative;
 overflow: hidden;
 `,[r("tabs-nav-y-scroll",`
 height: 100%;
 width: 100%;
 overflow-y: auto; 
 scrollbar-width: none;
 `,[u("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb",`
 width: 0;
 height: 0;
 display: none;
 `)]),u("&::before, &::after",`
 transition: box-shadow .3s var(--n-bezier);
 pointer-events: none;
 content: "";
 position: absolute;
 z-index: 1;
 `)]),r("tabs-nav-scroll-content",`
 display: flex;
 position: relative;
 min-width: 100%;
 min-height: 100%;
 width: fit-content;
 box-sizing: border-box;
 `),r("tabs-wrapper",`
 display: inline-flex;
 flex-wrap: nowrap;
 position: relative;
 `),r("tabs-tab-wrapper",`
 display: flex;
 flex-wrap: nowrap;
 flex-shrink: 0;
 flex-grow: 0;
 `),r("tabs-tab",`
 cursor: pointer;
 white-space: nowrap;
 flex-wrap: nowrap;
 display: inline-flex;
 align-items: center;
 color: var(--n-tab-text-color);
 font-size: var(--n-tab-font-size);
 background-clip: padding-box;
 padding: var(--n-tab-padding);
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[n("disabled",{cursor:"not-allowed"}),m("close",`
 margin-left: 6px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `),m("label",`
 display: flex;
 align-items: center;
 z-index: 1;
 `)]),r("tabs-bar",`
 position: absolute;
 bottom: 0;
 height: 2px;
 border-radius: 1px;
 background-color: var(--n-bar-color);
 transition:
 left .2s var(--n-bezier),
 max-width .2s var(--n-bezier),
 opacity .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `,[u("&.transition-disabled",`
 transition: none;
 `),n("disabled",`
 background-color: var(--n-tab-text-color-disabled)
 `)]),r("tabs-pane-wrapper",`
 position: relative;
 overflow: hidden;
 transition: max-height .2s var(--n-bezier);
 `),r("tab-pane",`
 color: var(--n-pane-text-color);
 width: 100%;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .2s var(--n-bezier);
 left: 0;
 right: 0;
 top: 0;
 `,[u("&.next-transition-leave-active, &.prev-transition-leave-active, &.next-transition-enter-active, &.prev-transition-enter-active",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 transform .2s var(--n-bezier),
 opacity .2s var(--n-bezier);
 `),u("&.next-transition-leave-active, &.prev-transition-leave-active",`
 position: absolute;
 `),u("&.next-transition-enter-from, &.prev-transition-leave-to",`
 transform: translateX(32px);
 opacity: 0;
 `),u("&.next-transition-leave-to, &.prev-transition-enter-from",`
 transform: translateX(-32px);
 opacity: 0;
 `),u("&.next-transition-leave-from, &.next-transition-enter-to, &.prev-transition-leave-from, &.prev-transition-enter-to",`
 transform: translateX(0);
 opacity: 1;
 `)]),r("tabs-tab-pad",`
 box-sizing: border-box;
 width: var(--n-tab-gap);
 flex-grow: 0;
 flex-shrink: 0;
 `),n("line-type, bar-type",[r("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 box-sizing: border-box;
 vertical-align: bottom;
 `,[u("&:hover",{color:"var(--n-tab-text-color-hover)"}),n("active",`
 color: var(--n-tab-text-color-active);
 font-weight: var(--n-tab-font-weight-active);
 `),n("disabled",{color:"var(--n-tab-text-color-disabled)"})])]),r("tabs-nav",[n("line-type",[n("top",[m("prefix, suffix",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 bottom: -1px;
 `)]),n("left",[m("prefix, suffix",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 right: -1px;
 `)]),n("right",[m("prefix, suffix",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 left: -1px;
 `)]),n("bottom",[m("prefix, suffix",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 top: -1px;
 `)]),m("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-nav-scroll-content",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-bar",`
 border-radius: 0;
 `)]),n("card-type",[m("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-pad",`
 flex-grow: 1;
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-tab-pad",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 border: 1px solid var(--n-tab-border-color);
 background-color: var(--n-tab-color);
 box-sizing: border-box;
 position: relative;
 vertical-align: bottom;
 display: flex;
 justify-content: space-between;
 font-size: var(--n-tab-font-size);
 color: var(--n-tab-text-color);
 `,[n("addable",`
 padding-left: 8px;
 padding-right: 8px;
 font-size: 16px;
 justify-content: center;
 `,[m("height-placeholder",`
 width: 0;
 font-size: var(--n-tab-font-size);
 `),wt("disabled",[u("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])]),n("closable","padding-right: 8px;"),n("active",`
 background-color: #0000;
 font-weight: var(--n-tab-font-weight-active);
 color: var(--n-tab-text-color-active);
 `),n("disabled","color: var(--n-tab-text-color-disabled);")])]),n("left, right",`
 flex-direction: column; 
 `,[m("prefix, suffix",`
 padding: var(--n-tab-padding-vertical);
 `),r("tabs-wrapper",`
 flex-direction: column;
 `),r("tabs-tab-wrapper",`
 flex-direction: column;
 `,[r("tabs-tab-pad",`
 height: var(--n-tab-gap-vertical);
 width: 100%;
 `)])]),n("top",[n("card-type",[r("tabs-scroll-padding","border-bottom: 1px solid var(--n-tab-border-color);"),m("prefix, suffix",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-top-right-radius: var(--n-tab-border-radius);
 `,[n("active",`
 border-bottom: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `)])]),n("left",[n("card-type",[r("tabs-scroll-padding","border-right: 1px solid var(--n-tab-border-color);"),m("prefix, suffix",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-bottom-left-radius: var(--n-tab-border-radius);
 `,[n("active",`
 border-right: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-right: 1px solid var(--n-tab-border-color);
 `)])]),n("right",[n("card-type",[r("tabs-scroll-padding","border-left: 1px solid var(--n-tab-border-color);"),m("prefix, suffix",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-tab",`
 border-top-right-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[n("active",`
 border-left: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-left: 1px solid var(--n-tab-border-color);
 `)])]),n("bottom",[n("card-type",[r("tabs-scroll-padding","border-top: 1px solid var(--n-tab-border-color);"),m("prefix, suffix",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-tab",`
 border-bottom-left-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[n("active",`
 border-top: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-top: 1px solid var(--n-tab-border-color);
 `)])])])]),Mt=Object.assign(Object.assign({},Re.props),{value:[String,Number],defaultValue:[String,Number],trigger:{type:String,default:"click"},type:{type:String,default:"bar"},closable:Boolean,justifyContent:String,size:{type:String,default:"medium"},placement:{type:String,default:"top"},tabStyle:[String,Object],tabClass:String,addTabStyle:[String,Object],addTabClass:String,barWidth:Number,paneClass:String,paneStyle:[String,Object],paneWrapperClass:String,paneWrapperStyle:[String,Object],addable:[Boolean,Object],tabsPadding:{type:Number,default:0},animated:Boolean,onBeforeLeave:Function,onAdd:Function,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onClose:[Function,Array],labelSize:String,activeName:[String,Number],onActiveNameChange:[Function,Array]}),Gt=U({name:"Tabs",props:Mt,slots:Object,setup(e,{slots:s}){var b,w,d,y;const{mergedClsPrefixRef:v,inlineThemeDisabled:S}=St(e),C=Re("Tabs","-tabs",Dt,Ct,e,v),h=$(null),f=$(null),j=$(null),B=$(null),g=$(null),R=$(null),x=$(!0),P=$(!0),L=xe(e,["labelSize","size"]),T=xe(e,["activeName","value"]),V=$((w=(b=T.value)!==null&&b!==void 0?b:e.defaultValue)!==null&&w!==void 0?w:s.default?(y=(d=te(s.default())[0])===null||d===void 0?void 0:d.props)===null||y===void 0?void 0:y.name:null),W=Rt(T,V),c={id:0},z=J(()=>{if(!(!e.justifyContent||e.type==="card"))return{display:"flex",justifyContent:e.justifyContent}});re(W,()=>{c.id=0,X(),be()});function H(){var t;const{value:a}=W;return a===null?null:(t=h.value)===null||t===void 0?void 0:t.querySelector(`[data-name="${a}"]`)}function $e(t){if(e.type==="card")return;const{value:a}=f;if(!a)return;const o=a.style.opacity==="0";if(t){const i=`${v.value}-tabs-bar--disabled`,{barWidth:p,placement:_}=e;if(t.dataset.disabled==="true"?a.classList.add(i):a.classList.remove(i),["top","bottom"].includes(_)){if(de(["top","maxHeight","height"]),typeof p=="number"&&t.offsetWidth>=p){const k=Math.floor((t.offsetWidth-p)/2)+t.offsetLeft;a.style.left=`${k}px`,a.style.maxWidth=`${p}px`}else a.style.left=`${t.offsetLeft}px`,a.style.maxWidth=`${t.offsetWidth}px`;a.style.width="8192px",o&&(a.style.transition="none"),a.offsetWidth,o&&(a.style.transition="",a.style.opacity="1")}else{if(de(["left","maxWidth","width"]),typeof p=="number"&&t.offsetHeight>=p){const k=Math.floor((t.offsetHeight-p)/2)+t.offsetTop;a.style.top=`${k}px`,a.style.maxHeight=`${p}px`}else a.style.top=`${t.offsetTop}px`,a.style.maxHeight=`${t.offsetHeight}px`;a.style.height="8192px",o&&(a.style.transition="none"),a.offsetHeight,o&&(a.style.transition="",a.style.opacity="1")}}}function Te(){if(e.type==="card")return;const{value:t}=f;t&&(t.style.opacity="0")}function de(t){const{value:a}=f;if(a)for(const o of t)a.style[o]=""}function X(){if(e.type==="card")return;const t=H();t?$e(t):Te()}function be(){var t;const a=(t=g.value)===null||t===void 0?void 0:t.$el;if(!a)return;const o=H();if(!o)return;const{scrollLeft:i,offsetWidth:p}=a,{offsetLeft:_,offsetWidth:k}=o;i>_?a.scrollTo({top:0,left:_,behavior:"smooth"}):_+k>i+p&&a.scrollTo({top:0,left:_+k-p,behavior:"smooth"})}const G=$(null);let Q=0,O=null;function Pe(t){const a=G.value;if(a){Q=t.getBoundingClientRect().height;const o=`${Q}px`,i=()=>{a.style.height=o,a.style.maxHeight=o};O?(i(),O(),O=null):O=i}}function We(t){const a=G.value;if(a){const o=t.getBoundingClientRect().height,i=()=>{document.body.offsetHeight,a.style.maxHeight=`${o}px`,a.style.height=`${Math.max(Q,o)}px`};O?(O(),O=null,i()):O=i}}function _e(){const t=G.value;if(t){t.style.maxHeight="",t.style.height="";const{paneWrapperStyle:a}=e;if(typeof a=="string")t.style.cssText=a;else if(a){const{maxHeight:o,height:i}=a;o!==void 0&&(t.style.maxHeight=o),i!==void 0&&(t.style.height=i)}}}const ce={value:[]},fe=$("next");function ke(t){const a=W.value;let o="next";for(const i of ce.value){if(i===a)break;if(i===t){o="prev";break}}fe.value=o,Be(t)}function Be(t){const{onActiveNameChange:a,onUpdateValue:o,"onUpdate:value":i}=e;a&&q(a,t),o&&q(o,t),i&&q(i,t),V.value=t}function Le(t){const{onClose:a}=e;a&&q(a,t)}function pe(){const{value:t}=f;if(!t)return;const a="transition-disabled";t.classList.add(a),X(),t.classList.remove(a)}const I=$(null);function Z({transitionDisabled:t}){const a=h.value;if(!a)return;t&&a.classList.add("transition-disabled");const o=H();o&&I.value&&(I.value.style.width=`${o.offsetWidth}px`,I.value.style.height=`${o.offsetHeight}px`,I.value.style.transform=`translateX(${o.offsetLeft-_t(getComputedStyle(a).paddingLeft)}px)`,t&&I.value.offsetWidth),t&&a.classList.remove("transition-disabled")}re([W],()=>{e.type==="segment"&&ne(()=>{Z({transitionDisabled:!1})})}),zt(()=>{e.type==="segment"&&Z({transitionDisabled:!0})});let ue=0;function Ae(t){var a;if(t.contentRect.width===0&&t.contentRect.height===0||ue===t.contentRect.width)return;ue=t.contentRect.width;const{type:o}=e;if((o==="line"||o==="bar")&&pe(),o!=="segment"){const{placement:i}=e;ee((i==="top"||i==="bottom"?(a=g.value)===null||a===void 0?void 0:a.$el:R.value)||null)}}const Ee=oe(Ae,64);re([()=>e.justifyContent,()=>e.size],()=>{ne(()=>{const{type:t}=e;(t==="line"||t==="bar")&&pe()})});const F=$(!1);function je(t){var a;const{target:o,contentRect:{width:i,height:p}}=t,_=o.parentElement.parentElement.offsetWidth,k=o.parentElement.parentElement.offsetHeight,{placement:M}=e;if(!F.value)M==="top"||M==="bottom"?_<i&&(F.value=!0):k<p&&(F.value=!0);else{const{value:N}=B;if(!N)return;M==="top"||M==="bottom"?_-i>N.$el.offsetWidth&&(F.value=!1):k-p>N.$el.offsetHeight&&(F.value=!1)}ee(((a=g.value)===null||a===void 0?void 0:a.$el)||null)}const He=oe(je,64);function Oe(){const{onAdd:t}=e;t&&t(),ne(()=>{const a=H(),{value:o}=g;!a||!o||o.scrollTo({left:a.offsetLeft,top:0,behavior:"smooth"})})}function ee(t){if(!t)return;const{placement:a}=e;if(a==="top"||a==="bottom"){const{scrollLeft:o,scrollWidth:i,offsetWidth:p}=t;x.value=o<=0,P.value=o+p>=i}else{const{scrollTop:o,scrollHeight:i,offsetHeight:p}=t;x.value=o<=0,P.value=o+p>=i}}const Ie=oe(t=>{ee(t.target)},64);$t(le,{triggerRef:A(e,"trigger"),tabStyleRef:A(e,"tabStyle"),tabClassRef:A(e,"tabClass"),addTabStyleRef:A(e,"addTabStyle"),addTabClassRef:A(e,"addTabClass"),paneClassRef:A(e,"paneClass"),paneStyleRef:A(e,"paneStyle"),mergedClsPrefixRef:v,typeRef:A(e,"type"),closableRef:A(e,"closable"),valueRef:W,tabChangeIdRef:c,onBeforeLeaveRef:A(e,"onBeforeLeave"),activateTab:ke,handleClose:Le,handleAdd:Oe}),Tt(()=>{X(),be()}),Pt(()=>{const{value:t}=j;if(!t)return;const{value:a}=v,o=`${a}-tabs-nav-scroll-wrapper--shadow-start`,i=`${a}-tabs-nav-scroll-wrapper--shadow-end`;x.value?t.classList.remove(o):t.classList.add(o),P.value?t.classList.remove(i):t.classList.add(i)});const Fe={syncBarPosition:()=>{X()}},De=()=>{Z({transitionDisabled:!0})},ve=J(()=>{const{value:t}=L,{type:a}=e,o={card:"Card",bar:"Bar",line:"Line",segment:"Segment"}[a],i=`${t}${o}`,{self:{barColor:p,closeIconColor:_,closeIconColorHover:k,closeIconColorPressed:M,tabColor:N,tabBorderColor:Me,paneTextColor:Ve,tabFontWeight:Ne,tabBorderRadius:Ue,tabFontWeightActive:Xe,colorSegment:Ge,fontWeightStrong:Ye,tabColorSegment:Ke,closeSize:qe,closeIconSize:Je,closeColorHover:Qe,closeColorPressed:Ze,closeBorderRadius:et,[E("panePadding",t)]:Y,[E("tabPadding",i)]:tt,[E("tabPaddingVertical",i)]:at,[E("tabGap",i)]:rt,[E("tabGap",`${i}Vertical`)]:ot,[E("tabTextColor",a)]:nt,[E("tabTextColorActive",a)]:st,[E("tabTextColorHover",a)]:it,[E("tabTextColorDisabled",a)]:lt,[E("tabFontSize",t)]:dt},common:{cubicBezierEaseInOut:bt}}=C.value;return{"--n-bezier":bt,"--n-color-segment":Ge,"--n-bar-color":p,"--n-tab-font-size":dt,"--n-tab-text-color":nt,"--n-tab-text-color-active":st,"--n-tab-text-color-disabled":lt,"--n-tab-text-color-hover":it,"--n-pane-text-color":Ve,"--n-tab-border-color":Me,"--n-tab-border-radius":Ue,"--n-close-size":qe,"--n-close-icon-size":Je,"--n-close-color-hover":Qe,"--n-close-color-pressed":Ze,"--n-close-border-radius":et,"--n-close-icon-color":_,"--n-close-icon-color-hover":k,"--n-close-icon-color-pressed":M,"--n-tab-color":N,"--n-tab-font-weight":Ne,"--n-tab-font-weight-active":Xe,"--n-tab-padding":tt,"--n-tab-padding-vertical":at,"--n-tab-gap":rt,"--n-tab-gap-vertical":ot,"--n-pane-padding-left":K(Y,"left"),"--n-pane-padding-right":K(Y,"right"),"--n-pane-padding-top":K(Y,"top"),"--n-pane-padding-bottom":K(Y,"bottom"),"--n-font-weight-strong":Ye,"--n-tab-color-segment":Ke}}),D=S?Wt("tabs",J(()=>`${L.value[0]}${e.type[0]}`),ve,e):void 0;return Object.assign({mergedClsPrefix:v,mergedValue:W,renderedNames:new Set,segmentCapsuleElRef:I,tabsPaneWrapperRef:G,tabsElRef:h,barElRef:f,addTabInstRef:B,xScrollInstRef:g,scrollWrapperElRef:j,addTabFixed:F,tabWrapperStyle:z,handleNavResize:Ee,mergedSize:L,handleScroll:Ie,handleTabsResize:He,cssVars:S?void 0:ve,themeClass:D==null?void 0:D.themeClass,animationDirection:fe,renderNameListRef:ce,yScrollElRef:R,handleSegmentResize:De,onAnimationBeforeLeave:Pe,onAnimationEnter:We,onAnimationAfterEnter:_e,onRender:D==null?void 0:D.onRender},Fe)},render(){const{mergedClsPrefix:e,type:s,placement:b,addTabFixed:w,addable:d,mergedSize:y,renderNameListRef:v,onRender:S,paneWrapperClass:C,paneWrapperStyle:h,$slots:{default:f,prefix:j,suffix:B}}=this;S==null||S();const g=f?te(f()).filter(c=>c.type.__TAB_PANE__===!0):[],R=f?te(f()).filter(c=>c.type.__TAB__===!0):[],x=!R.length,P=s==="card",L=s==="segment",T=!P&&!L&&this.justifyContent;v.value=[];const V=()=>{const c=l("div",{style:this.tabWrapperStyle,class:`${e}-tabs-wrapper`},T?null:l("div",{class:`${e}-tabs-scroll-padding`,style:b==="top"||b==="bottom"?{width:`${this.tabsPadding}px`}:{height:`${this.tabsPadding}px`}}),x?g.map((z,H)=>(v.value.push(z.props.name),se(l(ie,Object.assign({},z.props,{internalCreatedByPane:!0,internalLeftPadded:H!==0&&(!T||T==="center"||T==="start"||T==="end")}),z.children?{default:z.children.tab}:void 0)))):R.map((z,H)=>(v.value.push(z.props.name),se(H!==0&&!T?Se(z):z))),!w&&d&&P?we(d,(x?g.length:R.length)!==0):null,T?null:l("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}));return l("div",{ref:"tabsElRef",class:`${e}-tabs-nav-scroll-content`},P&&d?l(ae,{onResize:this.handleTabsResize},{default:()=>c}):c,P?l("div",{class:`${e}-tabs-pad`}):null,P?null:l("div",{ref:"barElRef",class:`${e}-tabs-bar`}))},W=L?"top":b;return l("div",{class:[`${e}-tabs`,this.themeClass,`${e}-tabs--${s}-type`,`${e}-tabs--${y}-size`,T&&`${e}-tabs--flex`,`${e}-tabs--${W}`],style:this.cssVars},l("div",{class:[`${e}-tabs-nav--${s}-type`,`${e}-tabs-nav--${W}`,`${e}-tabs-nav`]},ge(j,c=>c&&l("div",{class:`${e}-tabs-nav__prefix`},c)),L?l(ae,{onResize:this.handleSegmentResize},{default:()=>l("div",{class:`${e}-tabs-rail`,ref:"tabsElRef"},l("div",{class:`${e}-tabs-capsule`,ref:"segmentCapsuleElRef"},l("div",{class:`${e}-tabs-wrapper`},l("div",{class:`${e}-tabs-tab`}))),x?g.map((c,z)=>(v.value.push(c.props.name),l(ie,Object.assign({},c.props,{internalCreatedByPane:!0,internalLeftPadded:z!==0}),c.children?{default:c.children.tab}:void 0))):R.map((c,z)=>(v.value.push(c.props.name),z===0?c:Se(c))))}):l(ae,{onResize:this.handleNavResize},{default:()=>l("div",{class:`${e}-tabs-nav-scroll-wrapper`,ref:"scrollWrapperElRef"},["top","bottom"].includes(W)?l(It,{ref:"xScrollInstRef",onScroll:this.handleScroll},{default:V}):l("div",{class:`${e}-tabs-nav-y-scroll`,onScroll:this.handleScroll,ref:"yScrollElRef"},V()))}),w&&d&&P?we(d,!0):null,ge(B,c=>c&&l("div",{class:`${e}-tabs-nav__suffix`},c))),x&&(this.animated&&(W==="top"||W==="bottom")?l("div",{ref:"tabsPaneWrapperRef",style:h,class:[`${e}-tabs-pane-wrapper`,C]},ye(g,this.mergedValue,this.renderedNames,this.onAnimationBeforeLeave,this.onAnimationEnter,this.onAnimationAfterEnter,this.animationDirection)):ye(g,this.mergedValue,this.renderedNames)))}});function ye(e,s,b,w,d,y,v){const S=[];return e.forEach(C=>{const{name:h,displayDirective:f,"display-directive":j}=C.props,B=R=>f===R||j===R,g=s===h;if(C.key!==void 0&&(C.key=h),g||B("show")||B("show:lazy")&&b.has(h)){b.has(h)||b.add(h);const R=!B("if");S.push(R?kt(C,[[At,g]]):C)}}),v?l(Bt,{name:`${v}-transition`,onBeforeLeave:w,onEnter:d,onAfterEnter:y},{default:()=>S}):S}function we(e,s){return l(ie,{ref:"addTabInstRef",key:"__addable",name:"__addable",internalCreatedByPane:!0,internalAddable:!0,internalLeftPadded:s,disabled:typeof e=="object"&&e.disabled})}function Se(e){const s=Lt(e);return s.props?s.props.internalLeftPadded=!0:s.props={internalLeftPadded:!0},s}function se(e){return Array.isArray(e.dynamicProps)?e.dynamicProps.includes("internalLeftPadded")||e.dynamicProps.push("internalLeftPadded"):e.dynamicProps=["internalLeftPadded"],e}const Vt={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Yt=U({name:"ArrowBackOutline",render:function(s,b){return jt(),Et("svg",Vt,b[0]||(b[0]=[me("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"48",d:"M244 400L100 256l144-144"},null,-1),me("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"48",d:"M120 256h292"},null,-1)]))}});export{Yt as A,Gt as N,Xt as a};
