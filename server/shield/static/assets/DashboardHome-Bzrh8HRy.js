import{x as he,y as b,z as we,C as ze,D as B,E as V,d as E,G as J,H as ae,v as p,I as de,r as T,J as j,K as le,L as Z,M as ye,O as $,P as ve,Q as _e,b as me,R as Ce,e as Se,S as Oe,V as Re,T as $e,U as te,W as oe,X as Te,Y as Ie,Z as Ne,$ as je,a0 as Fe,a1 as Pe,a2 as Be,a3 as Ee,a4 as ce,a5 as ue,a6 as Le,c as N,a,o as x,a7 as Me,a8 as Ae,a9 as He,g as r,w as n,u as o,s as D,n as G,k as P,j as S,F as K,f as q,p as L,aa as Ve,q as ne,t as H,ab as re,B as se,A as Q,ac as X,l as We,ad as Ue,i as De,h as Ge,ae as Ke,af as qe,ag as Qe,ah as Xe,_ as Ye}from"./index-Bxc172j1.js";import{u as Je}from"./analysis-ByMONqT_.js";import{N as Y,a as M}from"./Grid-Usiry6Fz.js";import{S as ie}from"./ShieldCheckmarkOutline-CNq_kuPr.js";import{N as Ze,a as et}from"./Thing-adimtSut.js";import{S as tt}from"./SearchOutline-DGiSeQv6.js";import{F as ot}from"./Checkmark-jiQ0kBN6.js";import{i as nt,o as rt}from"./utils-DaFc0M5i.js";import{N as st}from"./Statistic-DEVMq7ns.js";const it=he("n-avatar-group"),at=b("avatar",`
 width: var(--n-merged-size);
 height: var(--n-merged-size);
 color: #FFF;
 font-size: var(--n-font-size);
 display: inline-flex;
 position: relative;
 overflow: hidden;
 text-align: center;
 border: var(--n-border);
 border-radius: var(--n-border-radius);
 --n-merged-color: var(--n-color);
 background-color: var(--n-merged-color);
 transition:
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
`,[we(B("&","--n-merged-color: var(--n-color-modal);")),ze(B("&","--n-merged-color: var(--n-color-popover);")),B("img",`
 width: 100%;
 height: 100%;
 `),V("text",`
 white-space: nowrap;
 display: inline-block;
 position: absolute;
 left: 50%;
 top: 50%;
 `),b("icon",`
 vertical-align: bottom;
 font-size: calc(var(--n-merged-size) - 6px);
 `),V("text","line-height: 1.25")]),lt=Object.assign(Object.assign({},Z.props),{size:[String,Number],src:String,circle:{type:Boolean,default:void 0},objectFit:String,round:{type:Boolean,default:void 0},bordered:{type:Boolean,default:void 0},onError:Function,fallbackSrc:String,intersectionObserverOptions:Object,lazy:Boolean,onLoad:Function,renderPlaceholder:Function,renderFallback:Function,imgProps:Object,color:String}),dt=E({name:"Avatar",props:lt,slots:Object,setup(e){const{mergedClsPrefixRef:d,inlineThemeDisabled:l}=de(e),f=T(!1);let k=null;const g=T(null),h=T(null),O=()=>{const{value:s}=g;if(s&&(k===null||k!==s.innerHTML)){k=s.innerHTML;const{value:t}=h;if(t){const{offsetWidth:v,offsetHeight:z}=t,{offsetWidth:y,offsetHeight:W}=s,A=.9,U=Math.min(v/y*A,z/W*A,1);s.style.transform=`translateX(-50%) translateY(-50%) scale(${U})`}}},_=le(it,null),C=j(()=>{const{size:s}=e;if(s)return s;const{size:t}=_||{};return t||"medium"}),w=Z("Avatar","-avatar",at,ye,e,d),F=le($e,null),c=j(()=>{if(_)return!0;const{round:s,circle:t}=e;return s!==void 0||t!==void 0?s||t:F?F.roundRef.value:!1}),u=j(()=>_?!0:e.bordered||!1),R=j(()=>{const s=C.value,t=c.value,v=u.value,{color:z}=e,{self:{borderRadius:y,fontSize:W,color:A,border:U,colorModal:be,colorPopover:xe},common:{cubicBezierEaseInOut:ke}}=w.value;let ee;return typeof s=="number"?ee=`${s}px`:ee=w.value.self[$("height",s)],{"--n-font-size":W,"--n-border":v?U:"none","--n-border-radius":t?"50%":y,"--n-color":z||A,"--n-color-modal":z||be,"--n-color-popover":z||xe,"--n-bezier":ke,"--n-merged-size":`var(--n-avatar-size-override, ${ee})`}}),I=l?ve("avatar",j(()=>{const s=C.value,t=c.value,v=u.value,{color:z}=e;let y="";return s&&(typeof s=="number"?y+=`a${s}`:y+=s[0]),t&&(y+="b"),v&&(y+="c"),z&&(y+=_e(z)),y}),R,e):void 0,m=T(!e.lazy);me(()=>{if(e.lazy&&e.intersectionObserverOptions){let s;const t=Ce(()=>{s==null||s(),s=void 0,e.lazy&&(s=rt(h.value,e.intersectionObserverOptions,m))});Se(()=>{t(),s==null||s()})}}),Oe(()=>{var s;return e.src||((s=e.imgProps)===null||s===void 0?void 0:s.src)},()=>{f.value=!1});const i=T(!e.lazy);return{textRef:g,selfRef:h,mergedRoundRef:c,mergedClsPrefix:d,fitTextTransform:O,cssVars:l?void 0:R,themeClass:I==null?void 0:I.themeClass,onRender:I==null?void 0:I.onRender,hasLoadError:f,shouldStartLoading:m,loaded:i,mergedOnError:s=>{if(!m.value)return;f.value=!0;const{onError:t,imgProps:{onError:v}={}}=e;t==null||t(s),v==null||v(s)},mergedOnLoad:s=>{const{onLoad:t,imgProps:{onLoad:v}={}}=e;t==null||t(s),v==null||v(s),i.value=!0}}},render(){var e,d;const{$slots:l,src:f,mergedClsPrefix:k,lazy:g,onRender:h,loaded:O,hasLoadError:_,imgProps:C={}}=this;h==null||h();let w;const F=!O&&!_&&(this.renderPlaceholder?this.renderPlaceholder():(d=(e=this.$slots).placeholder)===null||d===void 0?void 0:d.call(e));return this.hasLoadError?w=this.renderFallback?this.renderFallback():J(l.fallback,()=>[p("img",{src:this.fallbackSrc,style:{objectFit:this.objectFit}})]):w=ae(l.default,c=>{if(c)return p(Re,{onResize:this.fitTextTransform},{default:()=>p("span",{ref:"textRef",class:`${k}-avatar__text`},c)});if(f||C.src){const u=this.src||C.src;return p("img",Object.assign(Object.assign({},C),{loading:nt&&!this.intersectionObserverOptions&&g?"lazy":"eager",src:g&&this.intersectionObserverOptions?this.shouldStartLoading?u:void 0:u,"data-image-src":u,onLoad:this.mergedOnLoad,onError:this.mergedOnError,style:[C.style||"",{objectFit:this.objectFit},F?{height:"0",width:"0",visibility:"hidden",position:"absolute"}:""]}))}}),p("span",{ref:"selfRef",class:[`${k}-avatar`,this.themeClass],style:this.cssVars},w,g&&F)}}),ct=b("steps",`
 width: 100%;
 display: flex;
`,[b("step",`
 position: relative;
 display: flex;
 flex: 1;
 `,[te("disabled","cursor: not-allowed"),te("clickable",`
 cursor: pointer;
 `),B("&:last-child",[b("step-splitor","display: none;")])]),b("step-splitor",`
 background-color: var(--n-splitor-color);
 margin-top: calc(var(--n-step-header-font-size) / 2);
 height: 1px;
 flex: 1;
 align-self: flex-start;
 margin-left: 12px;
 margin-right: 12px;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),b("step-content","flex: 1;",[b("step-content-header",`
 color: var(--n-header-text-color);
 margin-top: calc(var(--n-indicator-size) / 2 - var(--n-step-header-font-size) / 2);
 line-height: var(--n-step-header-font-size);
 font-size: var(--n-step-header-font-size);
 position: relative;
 display: flex;
 font-weight: var(--n-step-header-font-weight);
 margin-left: 9px;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `,[V("title",`
 white-space: nowrap;
 flex: 0;
 `)]),V("description",`
 color: var(--n-description-text-color);
 margin-top: 12px;
 margin-left: 9px;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `)]),b("step-indicator",`
 background-color: var(--n-indicator-color);
 box-shadow: 0 0 0 1px var(--n-indicator-border-color);
 height: var(--n-indicator-size);
 width: var(--n-indicator-size);
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `,[b("step-indicator-slot",`
 position: relative;
 width: var(--n-indicator-icon-size);
 height: var(--n-indicator-icon-size);
 font-size: var(--n-indicator-icon-size);
 line-height: var(--n-indicator-icon-size);
 `,[V("index",`
 display: inline-block;
 text-align: center;
 position: absolute;
 left: 0;
 top: 0;
 white-space: nowrap;
 font-size: var(--n-indicator-index-font-size);
 width: var(--n-indicator-icon-size);
 height: var(--n-indicator-icon-size);
 line-height: var(--n-indicator-icon-size);
 color: var(--n-indicator-text-color);
 transition: color .3s var(--n-bezier);
 `,[oe()]),b("icon",`
 color: var(--n-indicator-text-color);
 transition: color .3s var(--n-bezier);
 `,[oe()]),b("base-icon",`
 color: var(--n-indicator-text-color);
 transition: color .3s var(--n-bezier);
 `,[oe()])])]),te("vertical","flex-direction: column;",[Te("show-description",[B(">",[b("step","padding-bottom: 8px;")])]),B(">",[b("step","margin-bottom: 16px;",[B("&:last-child","margin-bottom: 0;"),B(">",[b("step-indicator",[B(">",[b("step-splitor",`
 position: absolute;
 bottom: -8px;
 width: 1px;
 margin: 0 !important;
 left: calc(var(--n-indicator-size) / 2);
 height: calc(100% - var(--n-indicator-size));
 `)])]),b("step-content",[V("description","margin-top: 8px;")])])])])])]);function ut(e,d){return typeof e!="object"||e===null||Array.isArray(e)?null:(e.props||(e.props={}),e.props.internalIndex=d+1,e)}function pt(e){return e.map((d,l)=>ut(d,l))}const ft=Object.assign(Object.assign({},Z.props),{current:Number,status:{type:String,default:"process"},size:{type:String,default:"medium"},vertical:Boolean,"onUpdate:current":[Function,Array],onUpdateCurrent:[Function,Array]}),ge=he("n-steps"),ht=E({name:"Steps",props:ft,slots:Object,setup(e,{slots:d}){const{mergedClsPrefixRef:l,mergedRtlRef:f}=de(e),k=je("Steps",f,l),g=Z("Steps","-steps",ct,Fe,e,l);return Pe(ge,{props:e,mergedThemeRef:g,mergedClsPrefixRef:l,stepsSlots:d}),{mergedClsPrefix:l,rtlEnabled:k}},render(){const{mergedClsPrefix:e}=this;return p("div",{class:[`${e}-steps`,this.rtlEnabled&&`${e}-steps--rtl`,this.vertical&&`${e}-steps--vertical`]},pt(Ie(Ne(this))))}}),vt={status:String,title:String,description:String,disabled:Boolean,internalIndex:{type:Number,default:0}},mt=E({name:"Step",props:vt,slots:Object,setup(e){const d=le(ge,null);d||Ee("step","`n-step` must be placed inside `n-steps`.");const{inlineThemeDisabled:l}=de(),{props:f,mergedThemeRef:k,mergedClsPrefixRef:g,stepsSlots:h}=d,O=j(()=>f.vertical),_=j(()=>{const{status:c}=e;if(c)return c;{const{internalIndex:u}=e,{current:R}=f;if(R===void 0)return"process";if(u<R)return"finish";if(u===R)return f.status||"process";if(u>R)return"wait"}return"process"}),C=j(()=>{const{value:c}=_,{size:u}=f,{common:{cubicBezierEaseInOut:R},self:{stepHeaderFontWeight:I,[$("stepHeaderFontSize",u)]:m,[$("indicatorIndexFontSize",u)]:i,[$("indicatorSize",u)]:s,[$("indicatorIconSize",u)]:t,[$("indicatorTextColor",c)]:v,[$("indicatorBorderColor",c)]:z,[$("headerTextColor",c)]:y,[$("splitorColor",c)]:W,[$("indicatorColor",c)]:A,[$("descriptionTextColor",c)]:U}}=k.value;return{"--n-bezier":R,"--n-description-text-color":U,"--n-header-text-color":y,"--n-indicator-border-color":z,"--n-indicator-color":A,"--n-indicator-icon-size":t,"--n-indicator-index-font-size":i,"--n-indicator-size":s,"--n-indicator-text-color":v,"--n-splitor-color":W,"--n-step-header-font-size":m,"--n-step-header-font-weight":I}}),w=l?ve("step",j(()=>{const{value:c}=_,{size:u}=f;return`${c[0]}${u[0]}`}),C,f):void 0,F=j(()=>{if(e.disabled)return;const{onUpdateCurrent:c,"onUpdate:current":u}=f;return c||u?()=>{c&&ce(c,e.internalIndex),u&&ce(u,e.internalIndex)}:void 0});return{stepsSlots:h,mergedClsPrefix:g,vertical:O,mergedStatus:_,handleStepClick:F,cssVars:l?void 0:C,themeClass:w==null?void 0:w.themeClass,onRender:w==null?void 0:w.onRender}},render(){const{mergedClsPrefix:e,onRender:d,handleStepClick:l,disabled:f}=this,k=ae(this.$slots.default,g=>{const h=g||this.description;return h?p("div",{class:`${e}-step-content__description`},h):null});return d==null||d(),p("div",{class:[`${e}-step`,f&&`${e}-step--disabled`,!f&&l&&`${e}-step--clickable`,this.themeClass,k&&`${e}-step--show-description`,`${e}-step--${this.mergedStatus}-status`],style:this.cssVars,onClick:l},p("div",{class:`${e}-step-indicator`},p("div",{class:`${e}-step-indicator-slot`},p(Be,null,{default:()=>ae(this.$slots.icon,g=>{const{mergedStatus:h,stepsSlots:O}=this;return h==="finish"||h==="error"?h==="finish"?p(ue,{clsPrefix:e,key:"finish"},{default:()=>J(O["finish-icon"],()=>[p(ot,null)])}):h==="error"?p(ue,{clsPrefix:e,key:"error"},{default:()=>J(O["error-icon"],()=>[p(Le,null)])}):null:g||p("div",{key:this.internalIndex,class:`${e}-step-indicator-slot__index`},this.internalIndex)})})),this.vertical?p("div",{class:`${e}-step-splitor`}):null),p("div",{class:`${e}-step-content`},p("div",{class:`${e}-step-content-header`},p("div",{class:`${e}-step-content-header__title`},J(this.$slots.title,()=>[this.title])),this.vertical?null:p("div",{class:`${e}-step-splitor`})),k))}}),gt={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},bt=E({name:"ArrowForwardOutline",render:function(d,l){return x(),N("svg",gt,l[0]||(l[0]=[a("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"48",d:"M268 112l144 144l-144 144"},null,-1),a("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"48",d:"M392 256H100"},null,-1)]))}}),xt={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},pe=E({name:"BulbOutline",render:function(d,l){return x(),N("svg",xt,l[0]||(l[0]=[Me('<path d="M304 384v-24c0-29 31.54-56.43 52-76c28.84-27.57 44-64.61 44-108c0-80-63.73-144-144-144a143.6 143.6 0 0 0-144 144c0 41.84 15.81 81.39 44 108c20.35 19.21 52 46.7 52 76v24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M224 480h64"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M208 432h96"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 384V256"></path><path d="M294 240s-21.51 16-38 16s-38-16-38-16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path>',5)]))}}),kt={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},wt=E({name:"PlayCircleOutline",render:function(d,l){return x(),N("svg",kt,l[0]||(l[0]=[a("path",{d:"M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192z",fill:"none",stroke:"currentColor","stroke-miterlimit":"10","stroke-width":"32"},null,-1),a("path",{d:"M216.32 334.44l114.45-69.14a10.89 10.89 0 0 0 0-18.6l-114.45-69.14a10.78 10.78 0 0 0-16.32 9.31v138.26a10.78 10.78 0 0 0 16.32 9.31z",fill:"currentColor"},null,-1)]))}}),zt={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},fe=E({name:"TrendingUpOutline",render:function(d,l){return x(),N("svg",zt,l[0]||(l[0]=[a("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M352 144h112v112"},null,-1),a("path",{d:"M48 368l121.37-121.37a32 32 0 0 1 45.26 0l50.74 50.74a32 32 0 0 0 45.26 0L448 160",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1)]))}}),yt={class:"dashboard-home"},_t={class:"welcome-content"},Ct={class:"welcome-text"},St={class:"welcome-title"},Ot={class:"welcome-stats"},Rt={class:"feature-content"},$t={class:"feature-header"},Tt={class:"feature-info"},It={class:"feature-title"},Nt={class:"feature-description"},jt={key:0,class:"feature-action"},Ft={class:"activity-header"},Pt={class:"activity-time"},Bt={href:"https://huodeng.github.io/shield-ml/",target:"_blank",class:"guide-link"},Et={class:"guide-item"},Lt={class:"guide-item"},Mt={class:"guide-item"},At=E({__name:"DashboardHome",setup(e){const d=We(),l=Ae(),f=Je();He("theme-mode",!1);const k=T(!1),g=T(!1),h=T(!1),O=T(!1),_=T([{label:"已完成分析",value:0,target:f.analysisHistory.length,color:"#18a058"},{label:"运行中任务",value:0,target:l.getRunningTasks().length,color:"#2080f0"},{label:"安全评分",value:0,target:85,color:"#f0a020"},{label:"检测漏洞",value:0,target:12,color:"#d03050"}]),C=[{title:"模型分析",description:"对机器学习模型进行全面的安全性分析，检测潜在的隐私泄露风险",icon:Q,color:"#2080f0",path:"/dashboard/model-analysis",status:"ready"},{title:"超参数搜索",description:"智能搜索最优攻击参数，自动调优攻击强度和迭代次数，提升分析精度",icon:tt,color:"#722ed1",path:"/dashboard/model-analysis",status:"ready"},{title:"数据集上传",description:"安全上传和管理您的训练数据集，支持多种格式",icon:X,color:"#18a058",path:"/dashboard/dataset-upload",status:"ready"},{title:"神经网络可视化",description:"直观展示神经网络结构和训练过程，便于理解模型行为",icon:fe,color:"#f0a020",path:"/dashboard/neural-network",status:"ready"},{title:"安全报告",description:"生成详细的安全评估报告，提供专业的防护建议",icon:ie,color:"#d03050",path:"/dashboard/model-analysis",status:"ready"}],w=[{title:"上传数据集",description:"首先上传您的训练数据集",icon:X,action:()=>d.push("/dashboard/dataset-upload")},{title:"选择分析类型",description:"选择适合的安全分析方法",icon:Q,action:()=>d.push("/dashboard/model-analysis")},{title:"查看结果",description:"分析完成后查看详细报告",icon:Ue,action:()=>{}}],F=T([{title:"成员推理攻击分析",description:"对CIFAR-10数据集进行了成员推理攻击检测",time:"2小时前",status:"completed",type:"analysis"},{title:"数据集上传",description:"成功上传了新的图像分类数据集",time:"1天前",status:"completed",type:"upload"},{title:"模型训练",description:"ResNet-18模型训练已完成",time:"2天前",status:"completed",type:"training"}]),c=()=>{_.value.forEach((m,i)=>{const v=m.target/60;let z=0;const y=setInterval(()=>{z+=v,z>=m.target?(m.value=m.target,clearInterval(y)):m.value=Math.floor(z)},2e3/60)})};me(()=>{setTimeout(()=>k.value=!0,100),setTimeout(()=>g.value=!0,300),setTimeout(()=>h.value=!0,500),setTimeout(()=>O.value=!0,700),setTimeout(()=>c(),1e3)});const u=m=>{m.status==="ready"&&d.push(m.path)},R=m=>{switch(m){case"completed":return"success";case"running":return"info";case"error":return"error";default:return"default"}},I=m=>{switch(m){case"analysis":return Q;case"upload":return X;case"training":return fe;default:return pe}};return(m,i)=>{const s=Qe("TimeOutline");return x(),N("div",yt,[a("div",{class:G(["welcome-section",{"animate-in":k.value}])},[r(o(D),{class:"welcome-card"},{default:n(()=>[a("div",_t,[a("div",Ct,[a("h1",St,[r(o(S),{size:"32",class:"welcome-icon"},{default:n(()=>[r(o(ie))]),_:1}),i[2]||(i[2]=P(" 欢迎使用 ML-Shield "))]),i[4]||(i[4]=a("p",{class:"welcome-subtitle"},"您的机器学习模型安全防护专家",-1)),r(o(Ze),{type:"info",class:"welcome-tip"},{icon:n(()=>[r(o(S),null,{default:n(()=>[r(o(pe))]),_:1})]),default:n(()=>[i[3]||(i[3]=P(" 开始您的第一次安全分析，保护您的AI模型免受隐私泄露威胁 "))]),_:1})]),a("div",Ot,[r(o(Y),{cols:4,"x-gap":16},{default:n(()=>[(x(!0),N(K,null,q(_.value,t=>(x(),L(o(M),{key:t.label},{default:n(()=>[r(o(st),{value:t.value,label:t.label,"value-style":{color:t.color,fontSize:"1.8rem",fontWeight:"bold"}},null,8,["value","label","value-style"])]),_:2},1024))),128))]),_:1})])])]),_:1})],2),a("div",{class:G(["features-section",{"animate-in":g.value}])},[i[8]||(i[8]=a("h2",{class:"section-title"},"核心功能",-1)),r(o(Y),{cols:3,"x-gap":20,"y-gap":20},{default:n(()=>[(x(),N(K,null,q(C,t=>r(o(M),{key:t.title},{default:n(()=>[r(o(D),{class:G(["feature-card",{clickable:t.status==="ready",disabled:t.status==="coming-soon"}]),onClick:v=>u(t),hoverable:""},{default:n(()=>[a("div",Rt,[a("div",$t,[r(o(S),{size:"28",color:t.color,class:"feature-icon"},{default:n(()=>[(x(),L(ne(t.icon)))]),_:2},1032,["color"]),a("div",Tt,[a("h3",It,H(t.title),1),t.status==="coming-soon"?(x(),L(o(re),{key:0,type:"warning",size:"small"},{default:n(()=>i[5]||(i[5]=[P(" 即将推出 ")])),_:1})):(x(),L(o(re),{key:1,type:"success",size:"small"},{default:n(()=>i[6]||(i[6]=[P(" 可用 ")])),_:1}))])]),a("p",Nt,H(t.description),1),t.status==="ready"?(x(),N("div",jt,[r(o(se),{text:"",type:"primary"},{icon:n(()=>[r(o(S),null,{default:n(()=>[r(o(bt))]),_:1})]),default:n(()=>[i[7]||(i[7]=P(" 开始使用 "))]),_:1})])):Ve("",!0)])]),_:2},1032,["class","onClick"])]),_:2},1024)),64))]),_:1})],2),a("div",{class:G(["quick-actions-section",{"animate-in":h.value}])},[r(o(Y),{cols:2,"x-gap":20},{default:n(()=>[r(o(M),null,{default:n(()=>[r(o(D),{title:"快速开始",class:"quick-start-card"},{"header-extra":n(()=>[r(o(S),null,{default:n(()=>[r(o(wt))]),_:1})]),default:n(()=>[r(o(ht),{vertical:"",current:1,size:"small"},{default:n(()=>[(x(),N(K,null,q(w,(t,v)=>r(o(mt),{key:v,title:t.title,description:t.description},{icon:n(()=>[r(o(S),null,{default:n(()=>[(x(),L(ne(t.icon)))]),_:2},1024)]),_:2},1032,["title","description"])),64))]),_:1}),r(o(De)),r(o(Ge),null,{default:n(()=>[r(o(se),{type:"primary",onClick:i[0]||(i[0]=t=>o(d).push("/dashboard/dataset-upload"))},{default:n(()=>i[9]||(i[9]=[P(" 立即开始 ")])),_:1}),r(o(se),{quaternary:"",onClick:i[1]||(i[1]=t=>o(d).push("/dashboard/model-analysis"))},{default:n(()=>i[10]||(i[10]=[P(" 查看示例 ")])),_:1})]),_:1})]),_:1})]),_:1}),r(o(M),null,{default:n(()=>[r(o(D),{title:"最近活动",class:"recent-activity-card"},{"header-extra":n(()=>[r(o(S),null,{default:n(()=>[r(s)]),_:1})]),default:n(()=>[r(o(Ke),null,{default:n(()=>[(x(!0),N(K,null,q(F.value,t=>(x(),L(o(qe),{key:t.title},{default:n(()=>[r(o(et),null,{avatar:n(()=>[r(o(dt),null,{default:n(()=>[r(o(S),null,{default:n(()=>[(x(),L(ne(I(t.type))))]),_:2},1024)]),_:2},1024)]),header:n(()=>[a("div",Ft,[a("span",null,H(t.title),1),r(o(re),{type:R(t.status),size:"small"},{default:n(()=>[P(H(t.status==="completed"?"已完成":t.status),1)]),_:2},1032,["type"])])]),description:n(()=>[P(H(t.description),1)]),footer:n(()=>[a("span",Pt,H(t.time),1)]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1})]),_:1})]),_:1})],2),a("div",{class:G(["guide-section",{"animate-in":O.value}])},[r(o(D),{title:"使用指南",class:"guide-card"},{"header-extra":n(()=>[a("a",Bt,[r(o(S),{size:"20",class:"guide-icon"},{default:n(()=>[r(o(Xe))]),_:1})])]),default:n(()=>[r(o(Y),{cols:3,"x-gap":16},{default:n(()=>[r(o(M),null,{default:n(()=>[a("div",Et,[r(o(S),{size:"24",color:"#2080f0"},{default:n(()=>[r(o(Q))]),_:1}),i[11]||(i[11]=a("h4",null,"模型分析",-1)),i[12]||(i[12]=a("p",null,"学习如何对您的机器学习模型进行全面的安全性评估",-1))])]),_:1}),r(o(M),null,{default:n(()=>[a("div",Lt,[r(o(S),{size:"24",color:"#18a058"},{default:n(()=>[r(o(X))]),_:1}),i[13]||(i[13]=a("h4",null,"数据管理",-1)),i[14]||(i[14]=a("p",null,"了解如何安全地上传和管理您的训练数据集",-1))])]),_:1}),r(o(M),null,{default:n(()=>[a("div",Mt,[r(o(S),{size:"24",color:"#f0a020"},{default:n(()=>[r(o(ie))]),_:1}),i[15]||(i[15]=a("h4",null,"安全防护",-1)),i[16]||(i[16]=a("p",null,"掌握各种防护技术，提升模型的安全性和隐私保护",-1))])]),_:1})]),_:1})]),_:1})],2)])}}}),Xt=Ye(At,[["__scopeId","data-v-06ee2901"]]);export{Xt as default};
