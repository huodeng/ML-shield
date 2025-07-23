import{r as F,J as L,aD as Fe,a1 as dt,d as he,K as ht,v as l,V as mt,am as cn,bG as nt,bH as fn,bI as hn,b as Xe,bJ as vn,bK as bn,at as J,bL as fe,aT as ye,b0 as gn,bM as ot,S as Te,e as kt,aj as pn,y as $,D as le,E as w,W as ut,a2 as Ot,G as vt,bN as mn,a5 as bt,bO as ze,bP as gt,as as zt,U as X,X as Ve,bs as Mt,H as pe,aR as pt,az as wn,I as Ye,$ as Pt,L as xe,bQ as yn,bR as xn,O as se,b5 as Ne,P as Ze,bS as Cn,bT as Ae,aI as It,bU as Sn,bV as Rn,ab as lt,bW as wt,F as Fn,bX as Tn,bY as yt,bZ as kn,R as On,bA as zn,bB as Mn,bC as Pn,bD as ct,bd as In,a_ as _n,bf as xt,b_ as Bn,aH as ft,aU as $n,b$ as Ln,bu as En,aG as _t,bn as Nn,c0 as An,c1 as Vn,a4 as ce,c2 as it,c3 as Dn}from"./index-Bxc172j1.js";import{F as Wn}from"./Checkmark-jiQ0kBN6.js";function Ct(e){return e&-e}class Bt{constructor(n,o){this.l=n,this.min=o;const r=new Array(n+1);for(let i=0;i<n+1;++i)r[i]=0;this.ft=r}add(n,o){if(o===0)return;const{l:r,ft:i}=this;for(n+=1;n<=r;)i[n]+=o,n+=Ct(n)}get(n){return this.sum(n+1)-this.sum(n)}sum(n){if(n===void 0&&(n=this.l),n<=0)return 0;const{ft:o,min:r,l:i}=this;if(n>i)throw new Error("[FinweckTree.sum]: `i` is larger than length.");let c=n*r;for(;n>0;)c+=o[n],n-=Ct(n);return c}getBound(n){let o=0,r=this.l;for(;r>o;){const i=Math.floor((o+r)/2),c=this.sum(i);if(c>n){r=i;continue}else if(c<n){if(o===i)return this.sum(o+1)<=n?o+1:i;o=i}else return i}return o}}let qe;function jn(){return typeof document>"u"?!1:(qe===void 0&&("matchMedia"in window?qe=window.matchMedia("(pointer:coarse)").matches:qe=!1),qe)}let rt;function St(){return typeof document>"u"?1:(rt===void 0&&(rt="chrome"in window?window.devicePixelRatio:1),rt)}const $t="VVirtualListXScroll";function Hn({columnsRef:e,renderColRef:n,renderItemWithColsRef:o}){const r=F(0),i=F(0),c=L(()=>{const p=e.value;if(p.length===0)return null;const x=new Bt(p.length,0);return p.forEach((T,m)=>{x.add(m,T.width)}),x}),v=Fe(()=>{const p=c.value;return p!==null?Math.max(p.getBound(i.value)-1,0):0}),d=p=>{const x=c.value;return x!==null?x.sum(p):0},y=Fe(()=>{const p=c.value;return p!==null?Math.min(p.getBound(i.value+r.value)+1,e.value.length-1):0});return dt($t,{startIndexRef:v,endIndexRef:y,columnsRef:e,renderColRef:n,renderItemWithColsRef:o,getLeft:d}),{listWidthRef:r,scrollLeftRef:i}}const Rt=he({name:"VirtualListRow",props:{index:{type:Number,required:!0},item:{type:Object,required:!0}},setup(){const{startIndexRef:e,endIndexRef:n,columnsRef:o,getLeft:r,renderColRef:i,renderItemWithColsRef:c}=ht($t);return{startIndex:e,endIndex:n,columns:o,renderCol:i,renderItemWithCols:c,getLeft:r}},render(){const{startIndex:e,endIndex:n,columns:o,renderCol:r,renderItemWithCols:i,getLeft:c,item:v}=this;if(i!=null)return i({itemIndex:this.index,startColIndex:e,endColIndex:n,allColumns:o,item:v,getLeft:c});if(r!=null){const d=[];for(let y=e;y<=n;++y){const p=o[y];d.push(r({column:p,left:c(y),item:v}))}return d}return null}}),Kn=nt(".v-vl",{maxHeight:"inherit",height:"100%",overflow:"auto",minWidth:"1px"},[nt("&:not(.v-vl--show-scrollbar)",{scrollbarWidth:"none"},[nt("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb",{width:0,height:0,display:"none"})])]),Un=he({name:"VirtualList",inheritAttrs:!1,props:{showScrollbar:{type:Boolean,default:!0},columns:{type:Array,default:()=>[]},renderCol:Function,renderItemWithCols:Function,items:{type:Array,default:()=>[]},itemSize:{type:Number,required:!0},itemResizable:Boolean,itemsStyle:[String,Object],visibleItemsTag:{type:[String,Object],default:"div"},visibleItemsProps:Object,ignoreItemResize:Boolean,onScroll:Function,onWheel:Function,onResize:Function,defaultScrollKey:[Number,String],defaultScrollIndex:Number,keyField:{type:String,default:"key"},paddingTop:{type:[Number,String],default:0},paddingBottom:{type:[Number,String],default:0}},setup(e){const n=fn();Kn.mount({id:"vueuc/virtual-list",head:!0,anchorMetaName:hn,ssr:n}),Xe(()=>{const{defaultScrollIndex:s,defaultScrollKey:g}=e;s!=null?Y({index:s}):g!=null&&Y({key:g})});let o=!1,r=!1;vn(()=>{if(o=!1,!r){r=!0;return}Y({top:C.value,left:v.value})}),bn(()=>{o=!0,r||(r=!0)});const i=Fe(()=>{if(e.renderCol==null&&e.renderItemWithCols==null||e.columns.length===0)return;let s=0;return e.columns.forEach(g=>{s+=g.width}),s}),c=L(()=>{const s=new Map,{keyField:g}=e;return e.items.forEach((P,V)=>{s.set(P[g],V)}),s}),{scrollLeftRef:v,listWidthRef:d}=Hn({columnsRef:J(e,"columns"),renderColRef:J(e,"renderCol"),renderItemWithColsRef:J(e,"renderItemWithCols")}),y=F(null),p=F(void 0),x=new Map,T=L(()=>{const{items:s,itemSize:g,keyField:P}=e,V=new Bt(s.length,g);return s.forEach((q,I)=>{const j=q[P],N=x.get(j);N!==void 0&&V.add(I,N)}),V}),m=F(0),C=F(0),S=Fe(()=>Math.max(T.value.getBound(C.value-fe(e.paddingTop))-1,0)),K=L(()=>{const{value:s}=p;if(s===void 0)return[];const{items:g,itemSize:P}=e,V=S.value,q=Math.min(V+Math.ceil(s/P+1),g.length-1),I=[];for(let j=V;j<=q;++j)I.push(g[j]);return I}),Y=(s,g)=>{if(typeof s=="number"){H(s,g,"auto");return}const{left:P,top:V,index:q,key:I,position:j,behavior:N,debounce:D=!0}=s;if(P!==void 0||V!==void 0)H(P,V,N);else if(q!==void 0)W(q,N,D);else if(I!==void 0){const a=c.value.get(I);a!==void 0&&W(a,N,D)}else j==="bottom"?H(0,Number.MAX_SAFE_INTEGER,N):j==="top"&&H(0,0,N)};let O,k=null;function W(s,g,P){const{value:V}=T,q=V.sum(s)+fe(e.paddingTop);if(!P)y.value.scrollTo({left:0,top:q,behavior:g});else{O=s,k!==null&&window.clearTimeout(k),k=window.setTimeout(()=>{O=void 0,k=null},16);const{scrollTop:I,offsetHeight:j}=y.value;if(q>I){const N=V.get(s);q+N<=I+j||y.value.scrollTo({left:0,top:q+N-j,behavior:g})}else y.value.scrollTo({left:0,top:q,behavior:g})}}function H(s,g,P){y.value.scrollTo({left:s,top:g,behavior:P})}function U(s,g){var P,V,q;if(o||e.ignoreItemResize||oe(g.target))return;const{value:I}=T,j=c.value.get(s),N=I.get(j),D=(q=(V=(P=g.borderBoxSize)===null||P===void 0?void 0:P[0])===null||V===void 0?void 0:V.blockSize)!==null&&q!==void 0?q:g.contentRect.height;if(D===N)return;D-e.itemSize===0?x.delete(s):x.set(s,D-e.itemSize);const h=D-N;if(h===0)return;I.add(j,h);const A=y.value;if(A!=null){if(O===void 0){const ie=I.sum(j);A.scrollTop>ie&&A.scrollBy(0,h)}else if(j<O)A.scrollBy(0,h);else if(j===O){const ie=I.sum(j);D+ie>A.scrollTop+A.offsetHeight&&A.scrollBy(0,h)}Q()}m.value++}const te=!jn();let G=!1;function M(s){var g;(g=e.onScroll)===null||g===void 0||g.call(e,s),(!te||!G)&&Q()}function ae(s){var g;if((g=e.onWheel)===null||g===void 0||g.call(e,s),te){const P=y.value;if(P!=null){if(s.deltaX===0&&(P.scrollTop===0&&s.deltaY<=0||P.scrollTop+P.offsetHeight>=P.scrollHeight&&s.deltaY>=0))return;s.preventDefault(),P.scrollTop+=s.deltaY/St(),P.scrollLeft+=s.deltaX/St(),Q(),G=!0,gn(()=>{G=!1})}}}function ne(s){if(o||oe(s.target))return;if(e.renderCol==null&&e.renderItemWithCols==null){if(s.contentRect.height===p.value)return}else if(s.contentRect.height===p.value&&s.contentRect.width===d.value)return;p.value=s.contentRect.height,d.value=s.contentRect.width;const{onResize:g}=e;g!==void 0&&g(s)}function Q(){const{value:s}=y;s!=null&&(C.value=s.scrollTop,v.value=s.scrollLeft)}function oe(s){let g=s;for(;g!==null;){if(g.style.display==="none")return!0;g=g.parentElement}return!1}return{listHeight:p,listStyle:{overflow:"auto"},keyToIndex:c,itemsStyle:L(()=>{const{itemResizable:s}=e,g=ye(T.value.sum());return m.value,[e.itemsStyle,{boxSizing:"content-box",width:ye(i.value),height:s?"":g,minHeight:s?g:"",paddingTop:ye(e.paddingTop),paddingBottom:ye(e.paddingBottom)}]}),visibleItemsStyle:L(()=>(m.value,{transform:`translateY(${ye(T.value.sum(S.value))})`})),viewportItems:K,listElRef:y,itemsElRef:F(null),scrollTo:Y,handleListResize:ne,handleListScroll:M,handleListWheel:ae,handleItemResize:U}},render(){const{itemResizable:e,keyField:n,keyToIndex:o,visibleItemsTag:r}=this;return l(mt,{onResize:this.handleListResize},{default:()=>{var i,c;return l("div",cn(this.$attrs,{class:["v-vl",this.showScrollbar&&"v-vl--show-scrollbar"],onScroll:this.handleListScroll,onWheel:this.handleListWheel,ref:"listElRef"}),[this.items.length!==0?l("div",{ref:"itemsElRef",class:"v-vl-items",style:this.itemsStyle},[l(r,Object.assign({class:"v-vl-visible-items",style:this.visibleItemsStyle},this.visibleItemsProps),{default:()=>{const{renderCol:v,renderItemWithCols:d}=this;return this.viewportItems.map(y=>{const p=y[n],x=o.get(p),T=v!=null?l(Rt,{index:x,item:y}):void 0,m=d!=null?l(Rt,{index:x,item:y}):void 0,C=this.$slots.default({item:y,renderedCols:T,renderedItemWithCols:m,index:x})[0];return e?l(mt,{key:p,onResize:S=>this.handleItemResize(p,S)},{default:()=>C}):(C.key=p,C)})}})]):(c=(i=this.$slots).empty)===null||c===void 0?void 0:c.call(i)])}})}});function Lt(e,n){n&&(Xe(()=>{const{value:o}=e;o&&ot.registerHandler(o,n)}),Te(e,(o,r)=>{r&&ot.unregisterHandler(r)},{deep:!1}),kt(()=>{const{value:o}=e;o&&ot.unregisterHandler(o)}))}function at(e){const n=e.filter(o=>o!==void 0);if(n.length!==0)return n.length===1?n[0]:o=>{e.forEach(r=>{r&&r(o)})}}const qn=he({name:"ChevronDown",render(){return l("svg",{viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg"},l("path",{d:"M3.14645 5.64645C3.34171 5.45118 3.65829 5.45118 3.85355 5.64645L8 9.79289L12.1464 5.64645C12.3417 5.45118 12.6583 5.45118 12.8536 5.64645C13.0488 5.84171 13.0488 6.15829 12.8536 6.35355L8.35355 10.8536C8.15829 11.0488 7.84171 11.0488 7.64645 10.8536L3.14645 6.35355C2.95118 6.15829 2.95118 5.84171 3.14645 5.64645Z",fill:"currentColor"}))}}),Gn=pn("clear",()=>l("svg",{viewBox:"0 0 16 16",version:"1.1",xmlns:"http://www.w3.org/2000/svg"},l("g",{stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},l("g",{fill:"currentColor","fill-rule":"nonzero"},l("path",{d:"M8,2 C11.3137085,2 14,4.6862915 14,8 C14,11.3137085 11.3137085,14 8,14 C4.6862915,14 2,11.3137085 2,8 C2,4.6862915 4.6862915,2 8,2 Z M6.5343055,5.83859116 C6.33943736,5.70359511 6.07001296,5.72288026 5.89644661,5.89644661 L5.89644661,5.89644661 L5.83859116,5.9656945 C5.70359511,6.16056264 5.72288026,6.42998704 5.89644661,6.60355339 L5.89644661,6.60355339 L7.293,8 L5.89644661,9.39644661 L5.83859116,9.4656945 C5.70359511,9.66056264 5.72288026,9.92998704 5.89644661,10.1035534 L5.89644661,10.1035534 L5.9656945,10.1614088 C6.16056264,10.2964049 6.42998704,10.2771197 6.60355339,10.1035534 L6.60355339,10.1035534 L8,8.707 L9.39644661,10.1035534 L9.4656945,10.1614088 C9.66056264,10.2964049 9.92998704,10.2771197 10.1035534,10.1035534 L10.1035534,10.1035534 L10.1614088,10.0343055 C10.2964049,9.83943736 10.2771197,9.57001296 10.1035534,9.39644661 L10.1035534,9.39644661 L8.707,8 L10.1035534,6.60355339 L10.1614088,6.5343055 C10.2964049,6.33943736 10.2771197,6.07001296 10.1035534,5.89644661 L10.1035534,5.89644661 L10.0343055,5.83859116 C9.83943736,5.70359511 9.57001296,5.72288026 9.39644661,5.89644661 L9.39644661,5.89644661 L8,7.293 L6.60355339,5.89644661 Z"}))))),Xn=$("base-clear",`
 flex-shrink: 0;
 height: 1em;
 width: 1em;
 position: relative;
`,[le(">",[w("clear",`
 font-size: var(--n-clear-size);
 height: 1em;
 width: 1em;
 cursor: pointer;
 color: var(--n-clear-color);
 transition: color .3s var(--n-bezier);
 display: flex;
 `,[le("&:hover",`
 color: var(--n-clear-color-hover)!important;
 `),le("&:active",`
 color: var(--n-clear-color-pressed)!important;
 `)]),w("placeholder",`
 display: flex;
 `),w("clear, placeholder",`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[ut({originalTransform:"translateX(-50%) translateY(-50%)",left:"50%",top:"50%"})])])]),Yn=he({name:"BaseClear",props:{clsPrefix:{type:String,required:!0},show:Boolean,onClear:Function},setup(e){return mn("-base-clear",Xn,J(e,"clsPrefix")),{handleMouseDown(n){n.preventDefault()}}},render(){const{clsPrefix:e}=this;return l("div",{class:`${e}-base-clear`},l(Ot,null,{default:()=>{var n,o;return this.show?l("div",{key:"dismiss",class:`${e}-base-clear__clear`,onClick:this.onClear,onMousedown:this.handleMouseDown,"data-clear":!0},vt(this.$slots.icon,()=>[l(bt,{clsPrefix:e},{default:()=>l(Gn,null)})])):l("div",{key:"icon",class:`${e}-base-clear__placeholder`},(o=(n=this.$slots).placeholder)===null||o===void 0?void 0:o.call(n))}}))}}),Zn=he({props:{onFocus:Function,onBlur:Function},setup(e){return()=>l("div",{style:"width: 0; height: 0",tabindex:0,onFocus:e.onFocus,onBlur:e.onBlur})}}),Ft=he({name:"NBaseSelectGroupHeader",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(){const{renderLabelRef:e,renderOptionRef:n,labelFieldRef:o,nodePropsRef:r}=ht(gt);return{labelField:o,nodeProps:r,renderLabel:e,renderOption:n}},render(){const{clsPrefix:e,renderLabel:n,renderOption:o,nodeProps:r,tmNode:{rawNode:i}}=this,c=r==null?void 0:r(i),v=n?n(i,!1):ze(i[this.labelField],i,!1),d=l("div",Object.assign({},c,{class:[`${e}-base-select-group-header`,c==null?void 0:c.class]}),v);return i.render?i.render({node:d,option:i}):o?o({node:d,option:i,selected:!1}):d}});function Jn(e,n){return l(zt,{name:"fade-in-scale-up-transition"},{default:()=>e?l(bt,{clsPrefix:n,class:`${n}-base-select-option__check`},{default:()=>l(Wn)}):null})}const Tt=he({name:"NBaseSelectOption",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(e){const{valueRef:n,pendingTmNodeRef:o,multipleRef:r,valueSetRef:i,renderLabelRef:c,renderOptionRef:v,labelFieldRef:d,valueFieldRef:y,showCheckmarkRef:p,nodePropsRef:x,handleOptionClick:T,handleOptionMouseEnter:m}=ht(gt),C=Fe(()=>{const{value:O}=o;return O?e.tmNode.key===O.key:!1});function S(O){const{tmNode:k}=e;k.disabled||T(O,k)}function K(O){const{tmNode:k}=e;k.disabled||m(O,k)}function Y(O){const{tmNode:k}=e,{value:W}=C;k.disabled||W||m(O,k)}return{multiple:r,isGrouped:Fe(()=>{const{tmNode:O}=e,{parent:k}=O;return k&&k.rawNode.type==="group"}),showCheckmark:p,nodeProps:x,isPending:C,isSelected:Fe(()=>{const{value:O}=n,{value:k}=r;if(O===null)return!1;const W=e.tmNode.rawNode[y.value];if(k){const{value:H}=i;return H.has(W)}else return O===W}),labelField:d,renderLabel:c,renderOption:v,handleMouseMove:Y,handleMouseEnter:K,handleClick:S}},render(){const{clsPrefix:e,tmNode:{rawNode:n},isSelected:o,isPending:r,isGrouped:i,showCheckmark:c,nodeProps:v,renderOption:d,renderLabel:y,handleClick:p,handleMouseEnter:x,handleMouseMove:T}=this,m=Jn(o,e),C=y?[y(n,o),c&&m]:[ze(n[this.labelField],n,o),c&&m],S=v==null?void 0:v(n),K=l("div",Object.assign({},S,{class:[`${e}-base-select-option`,n.class,S==null?void 0:S.class,{[`${e}-base-select-option--disabled`]:n.disabled,[`${e}-base-select-option--selected`]:o,[`${e}-base-select-option--grouped`]:i,[`${e}-base-select-option--pending`]:r,[`${e}-base-select-option--show-checkmark`]:c}],style:[(S==null?void 0:S.style)||"",n.style||""],onClick:at([p,S==null?void 0:S.onClick]),onMouseenter:at([x,S==null?void 0:S.onMouseenter]),onMousemove:at([T,S==null?void 0:S.onMousemove])}),l("div",{class:`${e}-base-select-option__content`},C));return n.render?n.render({node:K,option:n,selected:o}):d?d({node:K,option:n,selected:o}):K}}),Qn=$("base-select-menu",`
 line-height: 1.5;
 outline: none;
 z-index: 0;
 position: relative;
 border-radius: var(--n-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-color);
`,[$("scrollbar",`
 max-height: var(--n-height);
 `),$("virtual-list",`
 max-height: var(--n-height);
 `),$("base-select-option",`
 min-height: var(--n-option-height);
 font-size: var(--n-option-font-size);
 display: flex;
 align-items: center;
 `,[w("content",`
 z-index: 1;
 white-space: nowrap;
 text-overflow: ellipsis;
 overflow: hidden;
 `)]),$("base-select-group-header",`
 min-height: var(--n-option-height);
 font-size: .93em;
 display: flex;
 align-items: center;
 `),$("base-select-menu-option-wrapper",`
 position: relative;
 width: 100%;
 `),w("loading, empty",`
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `),w("loading",`
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 `),w("header",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),w("action",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-top: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),$("base-select-group-header",`
 position: relative;
 cursor: default;
 padding: var(--n-option-padding);
 color: var(--n-group-header-text-color);
 `),$("base-select-option",`
 cursor: pointer;
 position: relative;
 padding: var(--n-option-padding);
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 box-sizing: border-box;
 color: var(--n-option-text-color);
 opacity: 1;
 `,[X("show-checkmark",`
 padding-right: calc(var(--n-option-padding-right) + 20px);
 `),le("&::before",`
 content: "";
 position: absolute;
 left: 4px;
 right: 4px;
 top: 0;
 bottom: 0;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `),le("&:active",`
 color: var(--n-option-text-color-pressed);
 `),X("grouped",`
 padding-left: calc(var(--n-option-padding-left) * 1.5);
 `),X("pending",[le("&::before",`
 background-color: var(--n-option-color-pending);
 `)]),X("selected",`
 color: var(--n-option-text-color-active);
 `,[le("&::before",`
 background-color: var(--n-option-color-active);
 `),X("pending",[le("&::before",`
 background-color: var(--n-option-color-active-pending);
 `)])]),X("disabled",`
 cursor: not-allowed;
 `,[Ve("selected",`
 color: var(--n-option-text-color-disabled);
 `),X("selected",`
 opacity: var(--n-option-opacity-disabled);
 `)]),w("check",`
 font-size: 16px;
 position: absolute;
 right: calc(var(--n-option-padding-right) - 4px);
 top: calc(50% - 7px);
 color: var(--n-option-check-color);
 transition: color .3s var(--n-bezier);
 `,[Mt({enterScale:"0.5"})])])]),eo=he({name:"InternalSelectMenu",props:Object.assign(Object.assign({},xe.props),{clsPrefix:{type:String,required:!0},scrollable:{type:Boolean,default:!0},treeMate:{type:Object,required:!0},multiple:Boolean,size:{type:String,default:"medium"},value:{type:[String,Number,Array],default:null},autoPending:Boolean,virtualScroll:{type:Boolean,default:!0},show:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},loading:Boolean,focusable:Boolean,renderLabel:Function,renderOption:Function,nodeProps:Function,showCheckmark:{type:Boolean,default:!0},onMousedown:Function,onScroll:Function,onFocus:Function,onBlur:Function,onKeyup:Function,onKeydown:Function,onTabOut:Function,onMouseenter:Function,onMouseleave:Function,onResize:Function,resetMenuOnOptionsChange:{type:Boolean,default:!0},inlineThemeDisabled:Boolean,onToggle:Function}),setup(e){const{mergedClsPrefixRef:n,mergedRtlRef:o}=Ye(e),r=Pt("InternalSelectMenu",o,n),i=xe("InternalSelectMenu","-internal-select-menu",Qn,yn,e,J(e,"clsPrefix")),c=F(null),v=F(null),d=F(null),y=L(()=>e.treeMate.getFlattenedNodes()),p=L(()=>xn(y.value)),x=F(null);function T(){const{treeMate:a}=e;let h=null;const{value:A}=e;A===null?h=a.getFirstAvailableNode():(e.multiple?h=a.getNode((A||[])[(A||[]).length-1]):h=a.getNode(A),(!h||h.disabled)&&(h=a.getFirstAvailableNode())),g(h||null)}function m(){const{value:a}=x;a&&!e.treeMate.getNode(a.key)&&(x.value=null)}let C;Te(()=>e.show,a=>{a?C=Te(()=>e.treeMate,()=>{e.resetMenuOnOptionsChange?(e.autoPending?T():m(),It(P)):m()},{immediate:!0}):C==null||C()},{immediate:!0}),kt(()=>{C==null||C()});const S=L(()=>fe(i.value.self[se("optionHeight",e.size)])),K=L(()=>Ne(i.value.self[se("padding",e.size)])),Y=L(()=>e.multiple&&Array.isArray(e.value)?new Set(e.value):new Set),O=L(()=>{const a=y.value;return a&&a.length===0});function k(a){const{onToggle:h}=e;h&&h(a)}function W(a){const{onScroll:h}=e;h&&h(a)}function H(a){var h;(h=d.value)===null||h===void 0||h.sync(),W(a)}function U(){var a;(a=d.value)===null||a===void 0||a.sync()}function te(){const{value:a}=x;return a||null}function G(a,h){h.disabled||g(h,!1)}function M(a,h){h.disabled||k(h)}function ae(a){var h;Ae(a,"action")||(h=e.onKeyup)===null||h===void 0||h.call(e,a)}function ne(a){var h;Ae(a,"action")||(h=e.onKeydown)===null||h===void 0||h.call(e,a)}function Q(a){var h;(h=e.onMousedown)===null||h===void 0||h.call(e,a),!e.focusable&&a.preventDefault()}function oe(){const{value:a}=x;a&&g(a.getNext({loop:!0}),!0)}function s(){const{value:a}=x;a&&g(a.getPrev({loop:!0}),!0)}function g(a,h=!1){x.value=a,h&&P()}function P(){var a,h;const A=x.value;if(!A)return;const ie=p.value(A.key);ie!==null&&(e.virtualScroll?(a=v.value)===null||a===void 0||a.scrollTo({index:ie}):(h=d.value)===null||h===void 0||h.scrollTo({index:ie,elSize:S.value}))}function V(a){var h,A;!((h=c.value)===null||h===void 0)&&h.contains(a.target)&&((A=e.onFocus)===null||A===void 0||A.call(e,a))}function q(a){var h,A;!((h=c.value)===null||h===void 0)&&h.contains(a.relatedTarget)||(A=e.onBlur)===null||A===void 0||A.call(e,a)}dt(gt,{handleOptionMouseEnter:G,handleOptionClick:M,valueSetRef:Y,pendingTmNodeRef:x,nodePropsRef:J(e,"nodeProps"),showCheckmarkRef:J(e,"showCheckmark"),multipleRef:J(e,"multiple"),valueRef:J(e,"value"),renderLabelRef:J(e,"renderLabel"),renderOptionRef:J(e,"renderOption"),labelFieldRef:J(e,"labelField"),valueFieldRef:J(e,"valueField")}),dt(Sn,c),Xe(()=>{const{value:a}=d;a&&a.sync()});const I=L(()=>{const{size:a}=e,{common:{cubicBezierEaseInOut:h},self:{height:A,borderRadius:ie,color:ve,groupHeaderTextColor:be,actionDividerColor:de,optionTextColorPressed:ue,optionTextColor:ke,optionTextColorDisabled:me,optionTextColorActive:Me,optionOpacityDisabled:Pe,optionCheckColor:Ie,actionTextColor:_e,optionColorPending:Ce,optionColorActive:Se,loadingColor:Be,loadingSize:$e,optionColorActivePending:Le,[se("optionFontSize",a)]:Oe,[se("optionHeight",a)]:Re,[se("optionPadding",a)]:re}}=i.value;return{"--n-height":A,"--n-action-divider-color":de,"--n-action-text-color":_e,"--n-bezier":h,"--n-border-radius":ie,"--n-color":ve,"--n-option-font-size":Oe,"--n-group-header-text-color":be,"--n-option-check-color":Ie,"--n-option-color-pending":Ce,"--n-option-color-active":Se,"--n-option-color-active-pending":Le,"--n-option-height":Re,"--n-option-opacity-disabled":Pe,"--n-option-text-color":ke,"--n-option-text-color-active":Me,"--n-option-text-color-disabled":me,"--n-option-text-color-pressed":ue,"--n-option-padding":re,"--n-option-padding-left":Ne(re,"left"),"--n-option-padding-right":Ne(re,"right"),"--n-loading-color":Be,"--n-loading-size":$e}}),{inlineThemeDisabled:j}=e,N=j?Ze("internal-select-menu",L(()=>e.size[0]),I,e):void 0,D={selfRef:c,next:oe,prev:s,getPendingTmNode:te};return Lt(c,e.onResize),Object.assign({mergedTheme:i,mergedClsPrefix:n,rtlEnabled:r,virtualListRef:v,scrollbarRef:d,itemSize:S,padding:K,flattenedNodes:y,empty:O,virtualListContainer(){const{value:a}=v;return a==null?void 0:a.listElRef},virtualListContent(){const{value:a}=v;return a==null?void 0:a.itemsElRef},doScroll:W,handleFocusin:V,handleFocusout:q,handleKeyUp:ae,handleKeyDown:ne,handleMouseDown:Q,handleVirtualListResize:U,handleVirtualListScroll:H,cssVars:j?void 0:I,themeClass:N==null?void 0:N.themeClass,onRender:N==null?void 0:N.onRender},D)},render(){const{$slots:e,virtualScroll:n,clsPrefix:o,mergedTheme:r,themeClass:i,onRender:c}=this;return c==null||c(),l("div",{ref:"selfRef",tabindex:this.focusable?0:-1,class:[`${o}-base-select-menu`,this.rtlEnabled&&`${o}-base-select-menu--rtl`,i,this.multiple&&`${o}-base-select-menu--multiple`],style:this.cssVars,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onKeyup:this.handleKeyUp,onKeydown:this.handleKeyDown,onMousedown:this.handleMouseDown,onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave},pe(e.header,v=>v&&l("div",{class:`${o}-base-select-menu__header`,"data-header":!0,key:"header"},v)),this.loading?l("div",{class:`${o}-base-select-menu__loading`},l(pt,{clsPrefix:o,strokeWidth:20})):this.empty?l("div",{class:`${o}-base-select-menu__empty`,"data-empty":!0},vt(e.empty,()=>[l(Cn,{theme:r.peers.Empty,themeOverrides:r.peerOverrides.Empty,size:this.size})])):l(wn,{ref:"scrollbarRef",theme:r.peers.Scrollbar,themeOverrides:r.peerOverrides.Scrollbar,scrollable:this.scrollable,container:n?this.virtualListContainer:void 0,content:n?this.virtualListContent:void 0,onScroll:n?void 0:this.doScroll},{default:()=>n?l(Un,{ref:"virtualListRef",class:`${o}-virtual-list`,items:this.flattenedNodes,itemSize:this.itemSize,showScrollbar:!1,paddingTop:this.padding.top,paddingBottom:this.padding.bottom,onResize:this.handleVirtualListResize,onScroll:this.handleVirtualListScroll,itemResizable:!0},{default:({item:v})=>v.isGroup?l(Ft,{key:v.key,clsPrefix:o,tmNode:v}):v.ignored?null:l(Tt,{clsPrefix:o,key:v.key,tmNode:v})}):l("div",{class:`${o}-base-select-menu-option-wrapper`,style:{paddingTop:this.padding.top,paddingBottom:this.padding.bottom}},this.flattenedNodes.map(v=>v.isGroup?l(Ft,{key:v.key,clsPrefix:o,tmNode:v}):l(Tt,{clsPrefix:o,key:v.key,tmNode:v})))}),pe(e.action,v=>v&&[l("div",{class:`${o}-base-select-menu__action`,"data-action":!0,key:"action"},v),l(Zn,{onFocus:this.onTabOut,key:"focus-detector"})]))}}),to=he({name:"InternalSelectionSuffix",props:{clsPrefix:{type:String,required:!0},showArrow:{type:Boolean,default:void 0},showClear:{type:Boolean,default:void 0},loading:{type:Boolean,default:!1},onClear:Function},setup(e,{slots:n}){return()=>{const{clsPrefix:o}=e;return l(pt,{clsPrefix:o,class:`${o}-base-suffix`,strokeWidth:24,scale:.85,show:e.loading},{default:()=>e.showArrow?l(Yn,{clsPrefix:o,show:e.showClear,onClear:e.onClear},{placeholder:()=>l(bt,{clsPrefix:o,class:`${o}-base-suffix__arrow`},{default:()=>vt(n.default,()=>[l(qn,null)])})}):null})}}}),no=le([$("base-selection",`
 --n-padding-single: var(--n-padding-single-top) var(--n-padding-single-right) var(--n-padding-single-bottom) var(--n-padding-single-left);
 --n-padding-multiple: var(--n-padding-multiple-top) var(--n-padding-multiple-right) var(--n-padding-multiple-bottom) var(--n-padding-multiple-left);
 position: relative;
 z-index: auto;
 box-shadow: none;
 width: 100%;
 max-width: 100%;
 display: inline-block;
 vertical-align: bottom;
 border-radius: var(--n-border-radius);
 min-height: var(--n-height);
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[$("base-loading",`
 color: var(--n-loading-color);
 `),$("base-selection-tags","min-height: var(--n-height);"),w("border, state-border",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border: var(--n-border);
 border-radius: inherit;
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),w("state-border",`
 z-index: 1;
 border-color: #0000;
 `),$("base-suffix",`
 cursor: pointer;
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 right: 10px;
 `,[w("arrow",`
 font-size: var(--n-arrow-size);
 color: var(--n-arrow-color);
 transition: color .3s var(--n-bezier);
 `)]),$("base-selection-overlay",`
 display: flex;
 align-items: center;
 white-space: nowrap;
 pointer-events: none;
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 padding: var(--n-padding-single);
 transition: color .3s var(--n-bezier);
 `,[w("wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),$("base-selection-placeholder",`
 color: var(--n-placeholder-color);
 `,[w("inner",`
 max-width: 100%;
 overflow: hidden;
 `)]),$("base-selection-tags",`
 cursor: pointer;
 outline: none;
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 display: flex;
 padding: var(--n-padding-multiple);
 flex-wrap: wrap;
 align-items: center;
 width: 100%;
 vertical-align: bottom;
 background-color: var(--n-color);
 border-radius: inherit;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),$("base-selection-label",`
 height: var(--n-height);
 display: inline-flex;
 width: 100%;
 vertical-align: bottom;
 cursor: pointer;
 outline: none;
 z-index: auto;
 box-sizing: border-box;
 position: relative;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: inherit;
 background-color: var(--n-color);
 align-items: center;
 `,[$("base-selection-input",`
 font-size: inherit;
 line-height: inherit;
 outline: none;
 cursor: pointer;
 box-sizing: border-box;
 border:none;
 width: 100%;
 padding: var(--n-padding-single);
 background-color: #0000;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 caret-color: var(--n-caret-color);
 `,[w("content",`
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap; 
 `)]),w("render-label",`
 color: var(--n-text-color);
 `)]),Ve("disabled",[le("&:hover",[w("state-border",`
 box-shadow: var(--n-box-shadow-hover);
 border: var(--n-border-hover);
 `)]),X("focus",[w("state-border",`
 box-shadow: var(--n-box-shadow-focus);
 border: var(--n-border-focus);
 `)]),X("active",[w("state-border",`
 box-shadow: var(--n-box-shadow-active);
 border: var(--n-border-active);
 `),$("base-selection-label","background-color: var(--n-color-active);"),$("base-selection-tags","background-color: var(--n-color-active);")])]),X("disabled","cursor: not-allowed;",[w("arrow",`
 color: var(--n-arrow-color-disabled);
 `),$("base-selection-label",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `,[$("base-selection-input",`
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 `),w("render-label",`
 color: var(--n-text-color-disabled);
 `)]),$("base-selection-tags",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `),$("base-selection-placeholder",`
 cursor: not-allowed;
 color: var(--n-placeholder-color-disabled);
 `)]),$("base-selection-input-tag",`
 height: calc(var(--n-height) - 6px);
 line-height: calc(var(--n-height) - 6px);
 outline: none;
 display: none;
 position: relative;
 margin-bottom: 3px;
 max-width: 100%;
 vertical-align: bottom;
 `,[w("input",`
 font-size: inherit;
 font-family: inherit;
 min-width: 1px;
 padding: 0;
 background-color: #0000;
 outline: none;
 border: none;
 max-width: 100%;
 overflow: hidden;
 width: 1em;
 line-height: inherit;
 cursor: pointer;
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 `),w("mirror",`
 position: absolute;
 left: 0;
 top: 0;
 white-space: pre;
 visibility: hidden;
 user-select: none;
 -webkit-user-select: none;
 opacity: 0;
 `)]),["warning","error"].map(e=>X(`${e}-status`,[w("state-border",`border: var(--n-border-${e});`),Ve("disabled",[le("&:hover",[w("state-border",`
 box-shadow: var(--n-box-shadow-hover-${e});
 border: var(--n-border-hover-${e});
 `)]),X("active",[w("state-border",`
 box-shadow: var(--n-box-shadow-active-${e});
 border: var(--n-border-active-${e});
 `),$("base-selection-label",`background-color: var(--n-color-active-${e});`),$("base-selection-tags",`background-color: var(--n-color-active-${e});`)]),X("focus",[w("state-border",`
 box-shadow: var(--n-box-shadow-focus-${e});
 border: var(--n-border-focus-${e});
 `)])])]))]),$("base-selection-popover",`
 margin-bottom: -3px;
 display: flex;
 flex-wrap: wrap;
 margin-right: -8px;
 `),$("base-selection-tag-wrapper",`
 max-width: 100%;
 display: inline-flex;
 padding: 0 7px 3px 0;
 `,[le("&:last-child","padding-right: 0;"),$("tag",`
 font-size: 14px;
 max-width: 100%;
 `,[w("content",`
 line-height: 1.25;
 text-overflow: ellipsis;
 overflow: hidden;
 `)])])]),oo=he({name:"InternalSelection",props:Object.assign(Object.assign({},xe.props),{clsPrefix:{type:String,required:!0},bordered:{type:Boolean,default:void 0},active:Boolean,pattern:{type:String,default:""},placeholder:String,selectedOption:{type:Object,default:null},selectedOptions:{type:Array,default:null},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},multiple:Boolean,filterable:Boolean,clearable:Boolean,disabled:Boolean,size:{type:String,default:"medium"},loading:Boolean,autofocus:Boolean,showArrow:{type:Boolean,default:!0},inputProps:Object,focused:Boolean,renderTag:Function,onKeydown:Function,onClick:Function,onBlur:Function,onFocus:Function,onDeleteOption:Function,maxTagCount:[String,Number],ellipsisTagPopoverProps:Object,onClear:Function,onPatternInput:Function,onPatternFocus:Function,onPatternBlur:Function,renderLabel:Function,status:String,inlineThemeDisabled:Boolean,ignoreComposition:{type:Boolean,default:!0},onResize:Function}),setup(e){const{mergedClsPrefixRef:n,mergedRtlRef:o}=Ye(e),r=Pt("InternalSelection",o,n),i=F(null),c=F(null),v=F(null),d=F(null),y=F(null),p=F(null),x=F(null),T=F(null),m=F(null),C=F(null),S=F(!1),K=F(!1),Y=F(!1),O=xe("InternalSelection","-internal-selection",no,kn,e,J(e,"clsPrefix")),k=L(()=>e.clearable&&!e.disabled&&(Y.value||e.active)),W=L(()=>e.selectedOption?e.renderTag?e.renderTag({option:e.selectedOption,handleClose:()=>{}}):e.renderLabel?e.renderLabel(e.selectedOption,!0):ze(e.selectedOption[e.labelField],e.selectedOption,!0):e.placeholder),H=L(()=>{const u=e.selectedOption;if(u)return u[e.labelField]}),U=L(()=>e.multiple?!!(Array.isArray(e.selectedOptions)&&e.selectedOptions.length):e.selectedOption!==null);function te(){var u;const{value:b}=i;if(b){const{value:Z}=c;Z&&(Z.style.width=`${b.offsetWidth}px`,e.maxTagCount!=="responsive"&&((u=m.value)===null||u===void 0||u.sync({showAllItemsBeforeCalculate:!1})))}}function G(){const{value:u}=C;u&&(u.style.display="none")}function M(){const{value:u}=C;u&&(u.style.display="inline-block")}Te(J(e,"active"),u=>{u||G()}),Te(J(e,"pattern"),()=>{e.multiple&&It(te)});function ae(u){const{onFocus:b}=e;b&&b(u)}function ne(u){const{onBlur:b}=e;b&&b(u)}function Q(u){const{onDeleteOption:b}=e;b&&b(u)}function oe(u){const{onClear:b}=e;b&&b(u)}function s(u){const{onPatternInput:b}=e;b&&b(u)}function g(u){var b;(!u.relatedTarget||!(!((b=v.value)===null||b===void 0)&&b.contains(u.relatedTarget)))&&ae(u)}function P(u){var b;!((b=v.value)===null||b===void 0)&&b.contains(u.relatedTarget)||ne(u)}function V(u){oe(u)}function q(){Y.value=!0}function I(){Y.value=!1}function j(u){!e.active||!e.filterable||u.target!==c.value&&u.preventDefault()}function N(u){Q(u)}const D=F(!1);function a(u){if(u.key==="Backspace"&&!D.value&&!e.pattern.length){const{selectedOptions:b}=e;b!=null&&b.length&&N(b[b.length-1])}}let h=null;function A(u){const{value:b}=i;if(b){const Z=u.target.value;b.textContent=Z,te()}e.ignoreComposition&&D.value?h=u:s(u)}function ie(){D.value=!0}function ve(){D.value=!1,e.ignoreComposition&&s(h),h=null}function be(u){var b;K.value=!0,(b=e.onPatternFocus)===null||b===void 0||b.call(e,u)}function de(u){var b;K.value=!1,(b=e.onPatternBlur)===null||b===void 0||b.call(e,u)}function ue(){var u,b;if(e.filterable)K.value=!1,(u=p.value)===null||u===void 0||u.blur(),(b=c.value)===null||b===void 0||b.blur();else if(e.multiple){const{value:Z}=d;Z==null||Z.blur()}else{const{value:Z}=y;Z==null||Z.blur()}}function ke(){var u,b,Z;e.filterable?(K.value=!1,(u=p.value)===null||u===void 0||u.focus()):e.multiple?(b=d.value)===null||b===void 0||b.focus():(Z=y.value)===null||Z===void 0||Z.focus()}function me(){const{value:u}=c;u&&(M(),u.focus())}function Me(){const{value:u}=c;u&&u.blur()}function Pe(u){const{value:b}=x;b&&b.setTextContent(`+${u}`)}function Ie(){const{value:u}=T;return u}function _e(){return c.value}let Ce=null;function Se(){Ce!==null&&window.clearTimeout(Ce)}function Be(){e.active||(Se(),Ce=window.setTimeout(()=>{U.value&&(S.value=!0)},100))}function $e(){Se()}function Le(u){u||(Se(),S.value=!1)}Te(U,u=>{u||(S.value=!1)}),Xe(()=>{On(()=>{const u=p.value;u&&(e.disabled?u.removeAttribute("tabindex"):u.tabIndex=K.value?-1:0)})}),Lt(v,e.onResize);const{inlineThemeDisabled:Oe}=e,Re=L(()=>{const{size:u}=e,{common:{cubicBezierEaseInOut:b},self:{fontWeight:Z,borderRadius:Je,color:Qe,placeholderColor:De,textColor:We,paddingSingle:je,paddingMultiple:et,caretColor:tt,colorDisabled:He,textColorDisabled:we,placeholderColorDisabled:t,colorActive:f,boxShadowFocus:R,boxShadowActive:E,boxShadowHover:_,border:z,borderFocus:B,borderHover:ee,borderActive:ge,arrowColor:Nt,arrowColorDisabled:At,loadingColor:Vt,colorActiveWarning:Dt,boxShadowFocusWarning:Wt,boxShadowActiveWarning:jt,boxShadowHoverWarning:Ht,borderWarning:Kt,borderFocusWarning:Ut,borderHoverWarning:qt,borderActiveWarning:Gt,colorActiveError:Xt,boxShadowFocusError:Yt,boxShadowActiveError:Zt,boxShadowHoverError:Jt,borderError:Qt,borderFocusError:en,borderHoverError:tn,borderActiveError:nn,clearColor:on,clearColorHover:ln,clearColorPressed:rn,clearSize:an,arrowSize:sn,[se("height",u)]:dn,[se("fontSize",u)]:un}}=O.value,Ke=Ne(je),Ue=Ne(et);return{"--n-bezier":b,"--n-border":z,"--n-border-active":ge,"--n-border-focus":B,"--n-border-hover":ee,"--n-border-radius":Je,"--n-box-shadow-active":E,"--n-box-shadow-focus":R,"--n-box-shadow-hover":_,"--n-caret-color":tt,"--n-color":Qe,"--n-color-active":f,"--n-color-disabled":He,"--n-font-size":un,"--n-height":dn,"--n-padding-single-top":Ke.top,"--n-padding-multiple-top":Ue.top,"--n-padding-single-right":Ke.right,"--n-padding-multiple-right":Ue.right,"--n-padding-single-left":Ke.left,"--n-padding-multiple-left":Ue.left,"--n-padding-single-bottom":Ke.bottom,"--n-padding-multiple-bottom":Ue.bottom,"--n-placeholder-color":De,"--n-placeholder-color-disabled":t,"--n-text-color":We,"--n-text-color-disabled":we,"--n-arrow-color":Nt,"--n-arrow-color-disabled":At,"--n-loading-color":Vt,"--n-color-active-warning":Dt,"--n-box-shadow-focus-warning":Wt,"--n-box-shadow-active-warning":jt,"--n-box-shadow-hover-warning":Ht,"--n-border-warning":Kt,"--n-border-focus-warning":Ut,"--n-border-hover-warning":qt,"--n-border-active-warning":Gt,"--n-color-active-error":Xt,"--n-box-shadow-focus-error":Yt,"--n-box-shadow-active-error":Zt,"--n-box-shadow-hover-error":Jt,"--n-border-error":Qt,"--n-border-focus-error":en,"--n-border-hover-error":tn,"--n-border-active-error":nn,"--n-clear-size":an,"--n-clear-color":on,"--n-clear-color-hover":ln,"--n-clear-color-pressed":rn,"--n-arrow-size":sn,"--n-font-weight":Z}}),re=Oe?Ze("internal-selection",L(()=>e.size[0]),Re,e):void 0;return{mergedTheme:O,mergedClearable:k,mergedClsPrefix:n,rtlEnabled:r,patternInputFocused:K,filterablePlaceholder:W,label:H,selected:U,showTagsPanel:S,isComposing:D,counterRef:x,counterWrapperRef:T,patternInputMirrorRef:i,patternInputRef:c,selfRef:v,multipleElRef:d,singleElRef:y,patternInputWrapperRef:p,overflowRef:m,inputTagElRef:C,handleMouseDown:j,handleFocusin:g,handleClear:V,handleMouseEnter:q,handleMouseLeave:I,handleDeleteOption:N,handlePatternKeyDown:a,handlePatternInputInput:A,handlePatternInputBlur:de,handlePatternInputFocus:be,handleMouseEnterCounter:Be,handleMouseLeaveCounter:$e,handleFocusout:P,handleCompositionEnd:ve,handleCompositionStart:ie,onPopoverUpdateShow:Le,focus:ke,focusInput:me,blur:ue,blurInput:Me,updateCounter:Pe,getCounter:Ie,getTail:_e,renderLabel:e.renderLabel,cssVars:Oe?void 0:Re,themeClass:re==null?void 0:re.themeClass,onRender:re==null?void 0:re.onRender}},render(){const{status:e,multiple:n,size:o,disabled:r,filterable:i,maxTagCount:c,bordered:v,clsPrefix:d,ellipsisTagPopoverProps:y,onRender:p,renderTag:x,renderLabel:T}=this;p==null||p();const m=c==="responsive",C=typeof c=="number",S=m||C,K=l(Rn,null,{default:()=>l(to,{clsPrefix:d,loading:this.loading,showArrow:this.showArrow,showClear:this.mergedClearable&&this.selected,onClear:this.handleClear},{default:()=>{var O,k;return(k=(O=this.$slots).arrow)===null||k===void 0?void 0:k.call(O)}})});let Y;if(n){const{labelField:O}=this,k=s=>l("div",{class:`${d}-base-selection-tag-wrapper`,key:s.value},x?x({option:s,handleClose:()=>{this.handleDeleteOption(s)}}):l(lt,{size:o,closable:!s.disabled,disabled:r,onClose:()=>{this.handleDeleteOption(s)},internalCloseIsButtonTag:!1,internalCloseFocusable:!1},{default:()=>T?T(s,!0):ze(s[O],s,!0)})),W=()=>(C?this.selectedOptions.slice(0,c):this.selectedOptions).map(k),H=i?l("div",{class:`${d}-base-selection-input-tag`,ref:"inputTagElRef",key:"__input-tag__"},l("input",Object.assign({},this.inputProps,{ref:"patternInputRef",tabindex:-1,disabled:r,value:this.pattern,autofocus:this.autofocus,class:`${d}-base-selection-input-tag__input`,onBlur:this.handlePatternInputBlur,onFocus:this.handlePatternInputFocus,onKeydown:this.handlePatternKeyDown,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),l("span",{ref:"patternInputMirrorRef",class:`${d}-base-selection-input-tag__mirror`},this.pattern)):null,U=m?()=>l("div",{class:`${d}-base-selection-tag-wrapper`,ref:"counterWrapperRef"},l(lt,{size:o,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,onMouseleave:this.handleMouseLeaveCounter,disabled:r})):void 0;let te;if(C){const s=this.selectedOptions.length-c;s>0&&(te=l("div",{class:`${d}-base-selection-tag-wrapper`,key:"__counter__"},l(lt,{size:o,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,disabled:r},{default:()=>`+${s}`})))}const G=m?i?l(wt,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,getTail:this.getTail,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:W,counter:U,tail:()=>H}):l(wt,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:W,counter:U}):C&&te?W().concat(te):W(),M=S?()=>l("div",{class:`${d}-base-selection-popover`},m?W():this.selectedOptions.map(k)):void 0,ae=S?Object.assign({show:this.showTagsPanel,trigger:"hover",overlap:!0,placement:"top",width:"trigger",onUpdateShow:this.onPopoverUpdateShow,theme:this.mergedTheme.peers.Popover,themeOverrides:this.mergedTheme.peerOverrides.Popover},y):null,Q=(this.selected?!1:this.active?!this.pattern&&!this.isComposing:!0)?l("div",{class:`${d}-base-selection-placeholder ${d}-base-selection-overlay`},l("div",{class:`${d}-base-selection-placeholder__inner`},this.placeholder)):null,oe=i?l("div",{ref:"patternInputWrapperRef",class:`${d}-base-selection-tags`},G,m?null:H,K):l("div",{ref:"multipleElRef",class:`${d}-base-selection-tags`,tabindex:r?void 0:0},G,K);Y=l(Fn,null,S?l(Tn,Object.assign({},ae,{scrollable:!0,style:"max-height: calc(var(--v-target-height) * 6.6);"}),{trigger:()=>oe,default:M}):oe,Q)}else if(i){const O=this.pattern||this.isComposing,k=this.active?!O:!this.selected,W=this.active?!1:this.selected;Y=l("div",{ref:"patternInputWrapperRef",class:`${d}-base-selection-label`,title:this.patternInputFocused?void 0:yt(this.label)},l("input",Object.assign({},this.inputProps,{ref:"patternInputRef",class:`${d}-base-selection-input`,value:this.active?this.pattern:"",placeholder:"",readonly:r,disabled:r,tabindex:-1,autofocus:this.autofocus,onFocus:this.handlePatternInputFocus,onBlur:this.handlePatternInputBlur,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),W?l("div",{class:`${d}-base-selection-label__render-label ${d}-base-selection-overlay`,key:"input"},l("div",{class:`${d}-base-selection-overlay__wrapper`},x?x({option:this.selectedOption,handleClose:()=>{}}):T?T(this.selectedOption,!0):ze(this.label,this.selectedOption,!0))):null,k?l("div",{class:`${d}-base-selection-placeholder ${d}-base-selection-overlay`,key:"placeholder"},l("div",{class:`${d}-base-selection-overlay__wrapper`},this.filterablePlaceholder)):null,K)}else Y=l("div",{ref:"singleElRef",class:`${d}-base-selection-label`,tabindex:this.disabled?void 0:0},this.label!==void 0?l("div",{class:`${d}-base-selection-input`,title:yt(this.label),key:"input"},l("div",{class:`${d}-base-selection-input__content`},x?x({option:this.selectedOption,handleClose:()=>{}}):T?T(this.selectedOption,!0):ze(this.label,this.selectedOption,!0))):l("div",{class:`${d}-base-selection-placeholder ${d}-base-selection-overlay`,key:"placeholder"},l("div",{class:`${d}-base-selection-placeholder__inner`},this.placeholder)),K);return l("div",{ref:"selfRef",class:[`${d}-base-selection`,this.rtlEnabled&&`${d}-base-selection--rtl`,this.themeClass,e&&`${d}-base-selection--${e}-status`,{[`${d}-base-selection--active`]:this.active,[`${d}-base-selection--selected`]:this.selected||this.active&&this.pattern,[`${d}-base-selection--disabled`]:this.disabled,[`${d}-base-selection--multiple`]:this.multiple,[`${d}-base-selection--focus`]:this.focused}],style:this.cssVars,onClick:this.onClick,onMouseenter:this.handleMouseEnter,onMouseleave:this.handleMouseLeave,onKeydown:this.onKeydown,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onMousedown:this.handleMouseDown},Y,v?l("div",{class:`${d}-base-selection__border`}):null,v?l("div",{class:`${d}-base-selection__state-border`}):null)}});function Ge(e){return e.type==="group"}function Et(e){return e.type==="ignored"}function st(e,n){try{return!!(1+n.toString().toLowerCase().indexOf(e.trim().toLowerCase()))}catch{return!1}}function lo(e,n){return{getIsGroup:Ge,getIgnored:Et,getKey(r){return Ge(r)?r.name||r.key||"key-required":r[e]},getChildren(r){return r[n]}}}function io(e,n,o,r){if(!n)return e;function i(c){if(!Array.isArray(c))return[];const v=[];for(const d of c)if(Ge(d)){const y=i(d[r]);y.length&&v.push(Object.assign({},d,{[r]:y}))}else{if(Et(d))continue;n(o,d)&&v.push(d)}return v}return i(e)}function ro(e,n,o){const r=new Map;return e.forEach(i=>{Ge(i)?i[o].forEach(c=>{r.set(c[n],c)}):r.set(i[n],i)}),r}const ao=le([$("select",`
 z-index: auto;
 outline: none;
 width: 100%;
 position: relative;
 font-weight: var(--n-font-weight);
 `),$("select-menu",`
 margin: 4px 0;
 box-shadow: var(--n-menu-box-shadow);
 `,[Mt({originalTransition:"background-color .3s var(--n-bezier), box-shadow .3s var(--n-bezier)"})])]),so=Object.assign(Object.assign({},xe.props),{to:ct.propTo,bordered:{type:Boolean,default:void 0},clearable:Boolean,clearFilterAfterSelect:{type:Boolean,default:!0},options:{type:Array,default:()=>[]},defaultValue:{type:[String,Number,Array],default:null},keyboard:{type:Boolean,default:!0},value:[String,Number,Array],placeholder:String,menuProps:Object,multiple:Boolean,size:String,menuSize:{type:String},filterable:Boolean,disabled:{type:Boolean,default:void 0},remote:Boolean,loading:Boolean,filter:Function,placement:{type:String,default:"bottom-start"},widthMode:{type:String,default:"trigger"},tag:Boolean,onCreate:Function,fallbackOption:{type:[Function,Boolean],default:void 0},show:{type:Boolean,default:void 0},showArrow:{type:Boolean,default:!0},maxTagCount:[Number,String],ellipsisTagPopoverProps:Object,consistentMenuWidth:{type:Boolean,default:!0},virtualScroll:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},childrenField:{type:String,default:"children"},renderLabel:Function,renderOption:Function,renderTag:Function,"onUpdate:value":[Function,Array],inputProps:Object,nodeProps:Function,ignoreComposition:{type:Boolean,default:!0},showOnFocus:Boolean,onUpdateValue:[Function,Array],onBlur:[Function,Array],onClear:[Function,Array],onFocus:[Function,Array],onScroll:[Function,Array],onSearch:[Function,Array],onUpdateShow:[Function,Array],"onUpdate:show":[Function,Array],displayDirective:{type:String,default:"show"},resetMenuOnOptionsChange:{type:Boolean,default:!0},status:String,showCheckmark:{type:Boolean,default:!0},onChange:[Function,Array],items:Array}),vo=he({name:"Select",props:so,slots:Object,setup(e){const{mergedClsPrefixRef:n,mergedBorderedRef:o,namespaceRef:r,inlineThemeDisabled:i}=Ye(e),c=xe("Select","-select",ao,Bn,e,n),v=F(e.defaultValue),d=J(e,"value"),y=ft(d,v),p=F(!1),x=F(""),T=$n(e,["items","options"]),m=F([]),C=F([]),S=L(()=>C.value.concat(m.value).concat(T.value)),K=L(()=>{const{filter:t}=e;if(t)return t;const{labelField:f,valueField:R}=e;return(E,_)=>{if(!_)return!1;const z=_[f];if(typeof z=="string")return st(E,z);const B=_[R];return typeof B=="string"?st(E,B):typeof B=="number"?st(E,String(B)):!1}}),Y=L(()=>{if(e.remote)return T.value;{const{value:t}=S,{value:f}=x;return!f.length||!e.filterable?t:io(t,K.value,f,e.childrenField)}}),O=L(()=>{const{valueField:t,childrenField:f}=e,R=lo(t,f);return Ln(Y.value,R)}),k=L(()=>ro(S.value,e.valueField,e.childrenField)),W=F(!1),H=ft(J(e,"show"),W),U=F(null),te=F(null),G=F(null),{localeRef:M}=En("Select"),ae=L(()=>{var t;return(t=e.placeholder)!==null&&t!==void 0?t:M.value.placeholder}),ne=[],Q=F(new Map),oe=L(()=>{const{fallbackOption:t}=e;if(t===void 0){const{labelField:f,valueField:R}=e;return E=>({[f]:String(E),[R]:E})}return t===!1?!1:f=>Object.assign(t(f),{value:f})});function s(t){const f=e.remote,{value:R}=Q,{value:E}=k,{value:_}=oe,z=[];return t.forEach(B=>{if(E.has(B))z.push(E.get(B));else if(f&&R.has(B))z.push(R.get(B));else if(_){const ee=_(B);ee&&z.push(ee)}}),z}const g=L(()=>{if(e.multiple){const{value:t}=y;return Array.isArray(t)?s(t):[]}return null}),P=L(()=>{const{value:t}=y;return!e.multiple&&!Array.isArray(t)?t===null?null:s([t])[0]||null:null}),V=_t(e),{mergedSizeRef:q,mergedDisabledRef:I,mergedStatusRef:j}=V;function N(t,f){const{onChange:R,"onUpdate:value":E,onUpdateValue:_}=e,{nTriggerFormChange:z,nTriggerFormInput:B}=V;R&&ce(R,t,f),_&&ce(_,t,f),E&&ce(E,t,f),v.value=t,z(),B()}function D(t){const{onBlur:f}=e,{nTriggerFormBlur:R}=V;f&&ce(f,t),R()}function a(){const{onClear:t}=e;t&&ce(t)}function h(t){const{onFocus:f,showOnFocus:R}=e,{nTriggerFormFocus:E}=V;f&&ce(f,t),E(),R&&de()}function A(t){const{onSearch:f}=e;f&&ce(f,t)}function ie(t){const{onScroll:f}=e;f&&ce(f,t)}function ve(){var t;const{remote:f,multiple:R}=e;if(f){const{value:E}=Q;if(R){const{valueField:_}=e;(t=g.value)===null||t===void 0||t.forEach(z=>{E.set(z[_],z)})}else{const _=P.value;_&&E.set(_[e.valueField],_)}}}function be(t){const{onUpdateShow:f,"onUpdate:show":R}=e;f&&ce(f,t),R&&ce(R,t),W.value=t}function de(){I.value||(be(!0),W.value=!0,e.filterable&&je())}function ue(){be(!1)}function ke(){x.value="",C.value=ne}const me=F(!1);function Me(){e.filterable&&(me.value=!0)}function Pe(){e.filterable&&(me.value=!1,H.value||ke())}function Ie(){I.value||(H.value?e.filterable?je():ue():de())}function _e(t){var f,R;!((R=(f=G.value)===null||f===void 0?void 0:f.selfRef)===null||R===void 0)&&R.contains(t.relatedTarget)||(p.value=!1,D(t),ue())}function Ce(t){h(t),p.value=!0}function Se(){p.value=!0}function Be(t){var f;!((f=U.value)===null||f===void 0)&&f.$el.contains(t.relatedTarget)||(p.value=!1,D(t),ue())}function $e(){var t;(t=U.value)===null||t===void 0||t.focus(),ue()}function Le(t){var f;H.value&&(!((f=U.value)===null||f===void 0)&&f.$el.contains(An(t))||ue())}function Oe(t){if(!Array.isArray(t))return[];if(oe.value)return Array.from(t);{const{remote:f}=e,{value:R}=k;if(f){const{value:E}=Q;return t.filter(_=>R.has(_)||E.has(_))}else return t.filter(E=>R.has(E))}}function Re(t){re(t.rawNode)}function re(t){if(I.value)return;const{tag:f,remote:R,clearFilterAfterSelect:E,valueField:_}=e;if(f&&!R){const{value:z}=C,B=z[0]||null;if(B){const ee=m.value;ee.length?ee.push(B):m.value=[B],C.value=ne}}if(R&&Q.value.set(t[_],t),e.multiple){const z=Oe(y.value),B=z.findIndex(ee=>ee===t[_]);if(~B){if(z.splice(B,1),f&&!R){const ee=u(t[_]);~ee&&(m.value.splice(ee,1),E&&(x.value=""))}}else z.push(t[_]),E&&(x.value="");N(z,s(z))}else{if(f&&!R){const z=u(t[_]);~z?m.value=[m.value[z]]:m.value=ne}We(),ue(),N(t[_],t)}}function u(t){return m.value.findIndex(R=>R[e.valueField]===t)}function b(t){H.value||de();const{value:f}=t.target;x.value=f;const{tag:R,remote:E}=e;if(A(f),R&&!E){if(!f){C.value=ne;return}const{onCreate:_}=e,z=_?_(f):{[e.labelField]:f,[e.valueField]:f},{valueField:B,labelField:ee}=e;T.value.some(ge=>ge[B]===z[B]||ge[ee]===z[ee])||m.value.some(ge=>ge[B]===z[B]||ge[ee]===z[ee])?C.value=ne:C.value=[z]}}function Z(t){t.stopPropagation();const{multiple:f}=e;!f&&e.filterable&&ue(),a(),f?N([],[]):N(null,null)}function Je(t){!Ae(t,"action")&&!Ae(t,"empty")&&!Ae(t,"header")&&t.preventDefault()}function Qe(t){ie(t)}function De(t){var f,R,E,_,z;if(!e.keyboard){t.preventDefault();return}switch(t.key){case" ":if(e.filterable)break;t.preventDefault();case"Enter":if(!(!((f=U.value)===null||f===void 0)&&f.isComposing)){if(H.value){const B=(R=G.value)===null||R===void 0?void 0:R.getPendingTmNode();B?Re(B):e.filterable||(ue(),We())}else if(de(),e.tag&&me.value){const B=C.value[0];if(B){const ee=B[e.valueField],{value:ge}=y;e.multiple&&Array.isArray(ge)&&ge.includes(ee)||re(B)}}}t.preventDefault();break;case"ArrowUp":if(t.preventDefault(),e.loading)return;H.value&&((E=G.value)===null||E===void 0||E.prev());break;case"ArrowDown":if(t.preventDefault(),e.loading)return;H.value?(_=G.value)===null||_===void 0||_.next():de();break;case"Escape":H.value&&(Vn(t),ue()),(z=U.value)===null||z===void 0||z.focus();break}}function We(){var t;(t=U.value)===null||t===void 0||t.focus()}function je(){var t;(t=U.value)===null||t===void 0||t.focusInput()}function et(){var t;H.value&&((t=te.value)===null||t===void 0||t.syncPosition())}ve(),Te(J(e,"options"),ve);const tt={focus:()=>{var t;(t=U.value)===null||t===void 0||t.focus()},focusInput:()=>{var t;(t=U.value)===null||t===void 0||t.focusInput()},blur:()=>{var t;(t=U.value)===null||t===void 0||t.blur()},blurInput:()=>{var t;(t=U.value)===null||t===void 0||t.blurInput()}},He=L(()=>{const{self:{menuBoxShadow:t}}=c.value;return{"--n-menu-box-shadow":t}}),we=i?Ze("select",void 0,He,e):void 0;return Object.assign(Object.assign({},tt),{mergedStatus:j,mergedClsPrefix:n,mergedBordered:o,namespace:r,treeMate:O,isMounted:Nn(),triggerRef:U,menuRef:G,pattern:x,uncontrolledShow:W,mergedShow:H,adjustedTo:ct(e),uncontrolledValue:v,mergedValue:y,followerRef:te,localizedPlaceholder:ae,selectedOption:P,selectedOptions:g,mergedSize:q,mergedDisabled:I,focused:p,activeWithoutMenuOpen:me,inlineThemeDisabled:i,onTriggerInputFocus:Me,onTriggerInputBlur:Pe,handleTriggerOrMenuResize:et,handleMenuFocus:Se,handleMenuBlur:Be,handleMenuTabOut:$e,handleTriggerClick:Ie,handleToggle:Re,handleDeleteOption:re,handlePatternInput:b,handleClear:Z,handleTriggerBlur:_e,handleTriggerFocus:Ce,handleKeydown:De,handleMenuAfterLeave:ke,handleMenuClickOutside:Le,handleMenuScroll:Qe,handleMenuKeydown:De,handleMenuMousedown:Je,mergedTheme:c,cssVars:i?void 0:He,themeClass:we==null?void 0:we.themeClass,onRender:we==null?void 0:we.onRender})},render(){return l("div",{class:`${this.mergedClsPrefix}-select`},l(zn,null,{default:()=>[l(Mn,null,{default:()=>l(oo,{ref:"triggerRef",inlineThemeDisabled:this.inlineThemeDisabled,status:this.mergedStatus,inputProps:this.inputProps,clsPrefix:this.mergedClsPrefix,showArrow:this.showArrow,maxTagCount:this.maxTagCount,ellipsisTagPopoverProps:this.ellipsisTagPopoverProps,bordered:this.mergedBordered,active:this.activeWithoutMenuOpen||this.mergedShow,pattern:this.pattern,placeholder:this.localizedPlaceholder,selectedOption:this.selectedOption,selectedOptions:this.selectedOptions,multiple:this.multiple,renderTag:this.renderTag,renderLabel:this.renderLabel,filterable:this.filterable,clearable:this.clearable,disabled:this.mergedDisabled,size:this.mergedSize,theme:this.mergedTheme.peers.InternalSelection,labelField:this.labelField,valueField:this.valueField,themeOverrides:this.mergedTheme.peerOverrides.InternalSelection,loading:this.loading,focused:this.focused,onClick:this.handleTriggerClick,onDeleteOption:this.handleDeleteOption,onPatternInput:this.handlePatternInput,onClear:this.handleClear,onBlur:this.handleTriggerBlur,onFocus:this.handleTriggerFocus,onKeydown:this.handleKeydown,onPatternBlur:this.onTriggerInputBlur,onPatternFocus:this.onTriggerInputFocus,onResize:this.handleTriggerOrMenuResize,ignoreComposition:this.ignoreComposition},{arrow:()=>{var e,n;return[(n=(e=this.$slots).arrow)===null||n===void 0?void 0:n.call(e)]}})}),l(Pn,{ref:"followerRef",show:this.mergedShow,to:this.adjustedTo,teleportDisabled:this.adjustedTo===ct.tdkey,containerClass:this.namespace,width:this.consistentMenuWidth?"target":void 0,minWidth:"target",placement:this.placement},{default:()=>l(zt,{name:"fade-in-scale-up-transition",appear:this.isMounted,onAfterLeave:this.handleMenuAfterLeave},{default:()=>{var e,n,o;return this.mergedShow||this.displayDirective==="show"?((e=this.onRender)===null||e===void 0||e.call(this),In(l(eo,Object.assign({},this.menuProps,{ref:"menuRef",onResize:this.handleTriggerOrMenuResize,inlineThemeDisabled:this.inlineThemeDisabled,virtualScroll:this.consistentMenuWidth&&this.virtualScroll,class:[`${this.mergedClsPrefix}-select-menu`,this.themeClass,(n=this.menuProps)===null||n===void 0?void 0:n.class],clsPrefix:this.mergedClsPrefix,focusable:!0,labelField:this.labelField,valueField:this.valueField,autoPending:!0,nodeProps:this.nodeProps,theme:this.mergedTheme.peers.InternalSelectMenu,themeOverrides:this.mergedTheme.peerOverrides.InternalSelectMenu,treeMate:this.treeMate,multiple:this.multiple,size:this.menuSize,renderOption:this.renderOption,renderLabel:this.renderLabel,value:this.mergedValue,style:[(o=this.menuProps)===null||o===void 0?void 0:o.style,this.cssVars],onToggle:this.handleToggle,onScroll:this.handleMenuScroll,onFocus:this.handleMenuFocus,onBlur:this.handleMenuBlur,onKeydown:this.handleMenuKeydown,onTabOut:this.handleMenuTabOut,onMousedown:this.handleMenuMousedown,show:this.mergedShow,showCheckmark:this.showCheckmark,resetMenuOnOptionsChange:this.resetMenuOnOptionsChange}),{empty:()=>{var r,i;return[(i=(r=this.$slots).empty)===null||i===void 0?void 0:i.call(r)]},header:()=>{var r,i;return[(i=(r=this.$slots).header)===null||i===void 0?void 0:i.call(r)]},action:()=>{var r,i;return[(i=(r=this.$slots).action)===null||i===void 0?void 0:i.call(r)]}}),this.displayDirective==="show"?[[_n,this.mergedShow],[xt,this.handleMenuClickOutside,void 0,{capture:!0}]]:[[xt,this.handleMenuClickOutside,void 0,{capture:!0}]])):null}})})]}))}}),uo=$("switch",`
 height: var(--n-height);
 min-width: var(--n-width);
 vertical-align: middle;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 outline: none;
 justify-content: center;
 align-items: center;
`,[w("children-placeholder",`
 height: var(--n-rail-height);
 display: flex;
 flex-direction: column;
 overflow: hidden;
 pointer-events: none;
 visibility: hidden;
 `),w("rail-placeholder",`
 display: flex;
 flex-wrap: none;
 `),w("button-placeholder",`
 width: calc(1.75 * var(--n-rail-height));
 height: var(--n-rail-height);
 `),$("base-loading",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 font-size: calc(var(--n-button-width) - 4px);
 color: var(--n-loading-color);
 transition: color .3s var(--n-bezier);
 `,[ut({left:"50%",top:"50%",originalTransform:"translateX(-50%) translateY(-50%)"})]),w("checked, unchecked",`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 box-sizing: border-box;
 position: absolute;
 white-space: nowrap;
 top: 0;
 bottom: 0;
 display: flex;
 align-items: center;
 line-height: 1;
 `),w("checked",`
 right: 0;
 padding-right: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),w("unchecked",`
 left: 0;
 justify-content: flex-end;
 padding-left: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),le("&:focus",[w("rail",`
 box-shadow: var(--n-box-shadow-focus);
 `)]),X("round",[w("rail","border-radius: calc(var(--n-rail-height) / 2);",[w("button","border-radius: calc(var(--n-button-height) / 2);")])]),Ve("disabled",[Ve("icon",[X("rubber-band",[X("pressed",[w("rail",[w("button","max-width: var(--n-button-width-pressed);")])]),w("rail",[le("&:active",[w("button","max-width: var(--n-button-width-pressed);")])]),X("active",[X("pressed",[w("rail",[w("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])]),w("rail",[le("&:active",[w("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])])])])])]),X("active",[w("rail",[w("button","left: calc(100% - var(--n-button-width) - var(--n-offset))")])]),w("rail",`
 overflow: hidden;
 height: var(--n-rail-height);
 min-width: var(--n-rail-width);
 border-radius: var(--n-rail-border-radius);
 cursor: pointer;
 position: relative;
 transition:
 opacity .3s var(--n-bezier),
 background .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-rail-color);
 `,[w("button-icon",`
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 font-size: calc(var(--n-button-height) - 4px);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 justify-content: center;
 align-items: center;
 line-height: 1;
 `,[ut()]),w("button",`
 align-items: center; 
 top: var(--n-offset);
 left: var(--n-offset);
 height: var(--n-button-height);
 width: var(--n-button-width-pressed);
 max-width: var(--n-button-width);
 border-radius: var(--n-button-border-radius);
 background-color: var(--n-button-color);
 box-shadow: var(--n-button-box-shadow);
 box-sizing: border-box;
 cursor: inherit;
 content: "";
 position: absolute;
 transition:
 background-color .3s var(--n-bezier),
 left .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 max-width .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `)]),X("active",[w("rail","background-color: var(--n-rail-color-active);")]),X("loading",[w("rail",`
 cursor: wait;
 `)]),X("disabled",[w("rail",`
 cursor: not-allowed;
 opacity: .5;
 `)])]),co=Object.assign(Object.assign({},xe.props),{size:{type:String,default:"medium"},value:{type:[String,Number,Boolean],default:void 0},loading:Boolean,defaultValue:{type:[String,Number,Boolean],default:!1},disabled:{type:Boolean,default:void 0},round:{type:Boolean,default:!0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],checkedValue:{type:[String,Number,Boolean],default:!0},uncheckedValue:{type:[String,Number,Boolean],default:!1},railStyle:Function,rubberBand:{type:Boolean,default:!0},onChange:[Function,Array]});let Ee;const bo=he({name:"Switch",props:co,slots:Object,setup(e){Ee===void 0&&(typeof CSS<"u"?typeof CSS.supports<"u"?Ee=CSS.supports("width","max(1px)"):Ee=!1:Ee=!0);const{mergedClsPrefixRef:n,inlineThemeDisabled:o}=Ye(e),r=xe("Switch","-switch",uo,Dn,e,n),i=_t(e),{mergedSizeRef:c,mergedDisabledRef:v}=i,d=F(e.defaultValue),y=J(e,"value"),p=ft(y,d),x=L(()=>p.value===e.checkedValue),T=F(!1),m=F(!1),C=L(()=>{const{railStyle:M}=e;if(M)return M({focused:m.value,checked:x.value})});function S(M){const{"onUpdate:value":ae,onChange:ne,onUpdateValue:Q}=e,{nTriggerFormInput:oe,nTriggerFormChange:s}=i;ae&&ce(ae,M),Q&&ce(Q,M),ne&&ce(ne,M),d.value=M,oe(),s()}function K(){const{nTriggerFormFocus:M}=i;M()}function Y(){const{nTriggerFormBlur:M}=i;M()}function O(){e.loading||v.value||(p.value!==e.checkedValue?S(e.checkedValue):S(e.uncheckedValue))}function k(){m.value=!0,K()}function W(){m.value=!1,Y(),T.value=!1}function H(M){e.loading||v.value||M.key===" "&&(p.value!==e.checkedValue?S(e.checkedValue):S(e.uncheckedValue),T.value=!1)}function U(M){e.loading||v.value||M.key===" "&&(M.preventDefault(),T.value=!0)}const te=L(()=>{const{value:M}=c,{self:{opacityDisabled:ae,railColor:ne,railColorActive:Q,buttonBoxShadow:oe,buttonColor:s,boxShadowFocus:g,loadingColor:P,textColor:V,iconColor:q,[se("buttonHeight",M)]:I,[se("buttonWidth",M)]:j,[se("buttonWidthPressed",M)]:N,[se("railHeight",M)]:D,[se("railWidth",M)]:a,[se("railBorderRadius",M)]:h,[se("buttonBorderRadius",M)]:A},common:{cubicBezierEaseInOut:ie}}=r.value;let ve,be,de;return Ee?(ve=`calc((${D} - ${I}) / 2)`,be=`max(${D}, ${I})`,de=`max(${a}, calc(${a} + ${I} - ${D}))`):(ve=ye((fe(D)-fe(I))/2),be=ye(Math.max(fe(D),fe(I))),de=fe(D)>fe(I)?a:ye(fe(a)+fe(I)-fe(D))),{"--n-bezier":ie,"--n-button-border-radius":A,"--n-button-box-shadow":oe,"--n-button-color":s,"--n-button-width":j,"--n-button-width-pressed":N,"--n-button-height":I,"--n-height":be,"--n-offset":ve,"--n-opacity-disabled":ae,"--n-rail-border-radius":h,"--n-rail-color":ne,"--n-rail-color-active":Q,"--n-rail-height":D,"--n-rail-width":a,"--n-width":de,"--n-box-shadow-focus":g,"--n-loading-color":P,"--n-text-color":V,"--n-icon-color":q}}),G=o?Ze("switch",L(()=>c.value[0]),te,e):void 0;return{handleClick:O,handleBlur:W,handleFocus:k,handleKeyup:H,handleKeydown:U,mergedRailStyle:C,pressed:T,mergedClsPrefix:n,mergedValue:p,checked:x,mergedDisabled:v,cssVars:o?void 0:te,themeClass:G==null?void 0:G.themeClass,onRender:G==null?void 0:G.onRender}},render(){const{mergedClsPrefix:e,mergedDisabled:n,checked:o,mergedRailStyle:r,onRender:i,$slots:c}=this;i==null||i();const{checked:v,unchecked:d,icon:y,"checked-icon":p,"unchecked-icon":x}=c,T=!(it(y)&&it(p)&&it(x));return l("div",{role:"switch","aria-checked":o,class:[`${e}-switch`,this.themeClass,T&&`${e}-switch--icon`,o&&`${e}-switch--active`,n&&`${e}-switch--disabled`,this.round&&`${e}-switch--round`,this.loading&&`${e}-switch--loading`,this.pressed&&`${e}-switch--pressed`,this.rubberBand&&`${e}-switch--rubber-band`],tabindex:this.mergedDisabled?void 0:0,style:this.cssVars,onClick:this.handleClick,onFocus:this.handleFocus,onBlur:this.handleBlur,onKeyup:this.handleKeyup,onKeydown:this.handleKeydown},l("div",{class:`${e}-switch__rail`,"aria-hidden":"true",style:r},pe(v,m=>pe(d,C=>m||C?l("div",{"aria-hidden":!0,class:`${e}-switch__children-placeholder`},l("div",{class:`${e}-switch__rail-placeholder`},l("div",{class:`${e}-switch__button-placeholder`}),m),l("div",{class:`${e}-switch__rail-placeholder`},l("div",{class:`${e}-switch__button-placeholder`}),C)):null)),l("div",{class:`${e}-switch__button`},pe(y,m=>pe(p,C=>pe(x,S=>l(Ot,null,{default:()=>this.loading?l(pt,{key:"loading",clsPrefix:e,strokeWidth:20}):this.checked&&(C||m)?l("div",{class:`${e}-switch__button-icon`,key:C?"checked-icon":"icon"},C||m):!this.checked&&(S||m)?l("div",{class:`${e}-switch__button-icon`,key:S?"unchecked-icon":"icon"},S||m):null})))),pe(v,m=>m&&l("div",{key:"checked",class:`${e}-switch__checked`},m)),pe(d,m=>m&&l("div",{key:"unchecked",class:`${e}-switch__unchecked`},m)))))}});export{vo as N,bo as a};
