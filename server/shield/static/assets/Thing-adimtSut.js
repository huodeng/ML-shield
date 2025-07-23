import{y as l,E as a,U as y,ak as W,D as m,d as w,v as n,al as D,am as G,b3 as J,G as K,H as U,I as R,L as z,b4 as q,$ as S,J as $,b5 as Q,O as h,P as I,r as X,a5 as Y,b6 as Z,b7 as ee,b8 as te,b9 as ne,ba as ie,F as re}from"./index-Bxc172j1.js";const ae=l("alert",`
 line-height: var(--n-line-height);
 border-radius: var(--n-border-radius);
 position: relative;
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 text-align: start;
 word-break: break-word;
`,[a("border",`
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 transition: border-color .3s var(--n-bezier);
 border: var(--n-border);
 pointer-events: none;
 `),y("closable",[l("alert-body",[a("title",`
 padding-right: 24px;
 `)])]),a("icon",{color:"var(--n-icon-color)"}),l("alert-body",{padding:"var(--n-padding)"},[a("title",{color:"var(--n-title-text-color)"}),a("content",{color:"var(--n-content-text-color)"})]),W({originalTransition:"transform .3s var(--n-bezier)",enterToProps:{transform:"scale(1)"},leaveToProps:{transform:"scale(0.9)"}}),a("icon",`
 position: absolute;
 left: 0;
 top: 0;
 align-items: center;
 justify-content: center;
 display: flex;
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 margin: var(--n-icon-margin);
 `),a("close",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 position: absolute;
 right: 0;
 top: 0;
 margin: var(--n-close-margin);
 `),y("show-icon",[l("alert-body",{paddingLeft:"calc(var(--n-icon-margin-left) + var(--n-icon-size) + var(--n-icon-margin-right))"})]),y("right-adjust",[l("alert-body",{paddingRight:"calc(var(--n-close-size) + var(--n-padding) + 2px)"})]),l("alert-body",`
 border-radius: var(--n-border-radius);
 transition: border-color .3s var(--n-bezier);
 `,[a("title",`
 transition: color .3s var(--n-bezier);
 font-size: 16px;
 line-height: 19px;
 font-weight: var(--n-title-font-weight);
 `,[m("& +",[a("content",{marginTop:"9px"})])]),a("content",{transition:"color .3s var(--n-bezier)",fontSize:"var(--n-font-size)"})]),a("icon",{transition:"color .3s var(--n-bezier)"})]),oe=Object.assign(Object.assign({},z.props),{title:String,showIcon:{type:Boolean,default:!0},type:{type:String,default:"default"},bordered:{type:Boolean,default:!0},closable:Boolean,onClose:Function,onAfterLeave:Function,onAfterHide:Function}),de=w({name:"Alert",inheritAttrs:!1,props:oe,slots:Object,setup(t){const{mergedClsPrefixRef:e,mergedBorderedRef:s,inlineThemeDisabled:v,mergedRtlRef:f}=R(t),u=z("Alert","-alert",ae,q,t,e),x=S("Alert",f,e),b=$(()=>{const{common:{cubicBezierEaseInOut:c},self:r}=u.value,{fontSize:E,borderRadius:T,titleFontWeight:P,lineHeight:A,iconSize:j,iconMargin:p,iconMarginRtl:B,closeIconSize:O,closeBorderRadius:L,closeSize:k,closeMargin:H,closeMarginRtl:F,padding:M}=r,{type:d}=t,{left:N,right:V}=Q(p);return{"--n-bezier":c,"--n-color":r[h("color",d)],"--n-close-icon-size":O,"--n-close-border-radius":L,"--n-close-color-hover":r[h("closeColorHover",d)],"--n-close-color-pressed":r[h("closeColorPressed",d)],"--n-close-icon-color":r[h("closeIconColor",d)],"--n-close-icon-color-hover":r[h("closeIconColorHover",d)],"--n-close-icon-color-pressed":r[h("closeIconColorPressed",d)],"--n-icon-color":r[h("iconColor",d)],"--n-border":r[h("border",d)],"--n-title-text-color":r[h("titleTextColor",d)],"--n-content-text-color":r[h("contentTextColor",d)],"--n-line-height":A,"--n-border-radius":T,"--n-font-size":E,"--n-title-font-weight":P,"--n-icon-size":j,"--n-icon-margin":p,"--n-icon-margin-rtl":B,"--n-close-size":k,"--n-close-margin":H,"--n-close-margin-rtl":F,"--n-padding":M,"--n-icon-margin-left":N,"--n-icon-margin-right":V}}),o=v?I("alert",$(()=>t.type[0]),b,t):void 0,g=X(!0),i=()=>{const{onAfterLeave:c,onAfterHide:r}=t;c&&c(),r&&r()};return{rtlEnabled:x,mergedClsPrefix:e,mergedBordered:s,visible:g,handleCloseClick:()=>{var c;Promise.resolve((c=t.onClose)===null||c===void 0?void 0:c.call(t)).then(r=>{r!==!1&&(g.value=!1)})},handleAfterLeave:()=>{i()},mergedTheme:u,cssVars:v?void 0:b,themeClass:o==null?void 0:o.themeClass,onRender:o==null?void 0:o.onRender}},render(){var t;return(t=this.onRender)===null||t===void 0||t.call(this),n(D,{onAfterLeave:this.handleAfterLeave},{default:()=>{const{mergedClsPrefix:e,$slots:s}=this,v={class:[`${e}-alert`,this.themeClass,this.closable&&`${e}-alert--closable`,this.showIcon&&`${e}-alert--show-icon`,!this.title&&this.closable&&`${e}-alert--right-adjust`,this.rtlEnabled&&`${e}-alert--rtl`],style:this.cssVars,role:"alert"};return this.visible?n("div",Object.assign({},G(this.$attrs,v)),this.closable&&n(J,{clsPrefix:e,class:`${e}-alert__close`,onClick:this.handleCloseClick}),this.bordered&&n("div",{class:`${e}-alert__border`}),this.showIcon&&n("div",{class:`${e}-alert__icon`,"aria-hidden":"true"},K(s.icon,()=>[n(Y,{clsPrefix:e},{default:()=>{switch(this.type){case"success":return n(ne,null);case"info":return n(te,null);case"warning":return n(ee,null);case"error":return n(Z,null);default:return null}}})])),n("div",{class:[`${e}-alert-body`,this.mergedBordered&&`${e}-alert-body--bordered`]},U(s.header,f=>{const u=f||this.title;return u?n("div",{class:`${e}-alert-body__title`},u):null}),s.default&&n("div",{class:`${e}-alert-body__content`},s))):null}})}}),le=l("thing",`
 display: flex;
 transition: color .3s var(--n-bezier);
 font-size: var(--n-font-size);
 color: var(--n-text-color);
`,[l("thing-avatar",`
 margin-right: 12px;
 margin-top: 2px;
 `),l("thing-avatar-header-wrapper",`
 display: flex;
 flex-wrap: nowrap;
 `,[l("thing-header-wrapper",`
 flex: 1;
 `)]),l("thing-main",`
 flex-grow: 1;
 `,[l("thing-header",`
 display: flex;
 margin-bottom: 4px;
 justify-content: space-between;
 align-items: center;
 `,[a("title",`
 font-size: 16px;
 font-weight: var(--n-title-font-weight);
 transition: color .3s var(--n-bezier);
 color: var(--n-title-text-color);
 `)]),a("description",[m("&:not(:last-child)",`
 margin-bottom: 4px;
 `)]),a("content",[m("&:not(:first-child)",`
 margin-top: 12px;
 `)]),a("footer",[m("&:not(:first-child)",`
 margin-top: 12px;
 `)]),a("action",[m("&:not(:first-child)",`
 margin-top: 12px;
 `)])])]),se=Object.assign(Object.assign({},z.props),{title:String,titleExtra:String,description:String,descriptionClass:String,descriptionStyle:[String,Object],content:String,contentClass:String,contentStyle:[String,Object],contentIndented:Boolean}),he=w({name:"Thing",props:se,slots:Object,setup(t,{slots:e}){const{mergedClsPrefixRef:s,inlineThemeDisabled:v,mergedRtlRef:f}=R(t),u=z("Thing","-thing",le,ie,t,s),x=S("Thing",f,s),b=$(()=>{const{self:{titleTextColor:g,textColor:i,titleFontWeight:C,fontSize:_},common:{cubicBezierEaseInOut:c}}=u.value;return{"--n-bezier":c,"--n-font-size":_,"--n-text-color":i,"--n-title-font-weight":C,"--n-title-text-color":g}}),o=v?I("thing",void 0,b,t):void 0;return()=>{var g;const{value:i}=s,C=x?x.value:!1;return(g=o==null?void 0:o.onRender)===null||g===void 0||g.call(o),n("div",{class:[`${i}-thing`,o==null?void 0:o.themeClass,C&&`${i}-thing--rtl`],style:v?void 0:b.value},e.avatar&&t.contentIndented?n("div",{class:`${i}-thing-avatar`},e.avatar()):null,n("div",{class:`${i}-thing-main`},!t.contentIndented&&(e.header||t.title||e["header-extra"]||t.titleExtra||e.avatar)?n("div",{class:`${i}-thing-avatar-header-wrapper`},e.avatar?n("div",{class:`${i}-thing-avatar`},e.avatar()):null,e.header||t.title||e["header-extra"]||t.titleExtra?n("div",{class:`${i}-thing-header-wrapper`},n("div",{class:`${i}-thing-header`},e.header||t.title?n("div",{class:`${i}-thing-header__title`},e.header?e.header():t.title):null,e["header-extra"]||t.titleExtra?n("div",{class:`${i}-thing-header__extra`},e["header-extra"]?e["header-extra"]():t.titleExtra):null),e.description||t.description?n("div",{class:[`${i}-thing-main__description`,t.descriptionClass],style:t.descriptionStyle},e.description?e.description():t.description):null):null):n(re,null,e.header||t.title||e["header-extra"]||t.titleExtra?n("div",{class:`${i}-thing-header`},e.header||t.title?n("div",{class:`${i}-thing-header__title`},e.header?e.header():t.title):null,e["header-extra"]||t.titleExtra?n("div",{class:`${i}-thing-header__extra`},e["header-extra"]?e["header-extra"]():t.titleExtra):null):null,e.description||t.description?n("div",{class:[`${i}-thing-main__description`,t.descriptionClass],style:t.descriptionStyle},e.description?e.description():t.description):null),e.default||t.content?n("div",{class:[`${i}-thing-main__content`,t.contentClass],style:t.contentStyle},e.default?e.default():t.content):null,e.footer?n("div",{class:`${i}-thing-main__footer`},e.footer()):null,e.action?n("div",{class:`${i}-thing-main__action`},e.action()):null))}}});export{de as N,he as a};
