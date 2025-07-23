import{D as Z,y as A,aQ as _e,U as ee,d as Y,v as F,aR as ke,as as he,I as be,L as re,aS as Se,J as E,aT as xe,O as we,P as $e,aU as Ce,r as L,R as Ne,c as S,a as g,o as i,b as Ie,g as n,w as a,u as t,h as T,ag as te,aV as Me,l as Re,p as m,s as D,B as P,k as r,j as B,aW as ze,F as O,aa as y,aO as Fe,aP as N,ab as Te,t as f,ae,f as Q,af as se,_ as De}from"./index-Bxc172j1.js";import{A as Oe,N as Ae,a as U}from"./ArrowBackOutline-DxePM0I8.js";import{S as Be}from"./ShieldCheckmarkOutline-CNq_kuPr.js";import{I as Le}from"./ImageOutline-B8AC3KCE.js";import{N as le}from"./Image-C7_q_JdY.js";import{u as Ee,W as je}from"./WarningOutline-XiXWwWXD.js";import{N as Ve,a as ne}from"./Grid-Usiry6Fz.js";import{N as ie}from"./Statistic-DEVMq7ns.js";import{N as X,a as oe}from"./Thing-adimtSut.js";import{N as Pe,a as W}from"./TimelineItem-ClDNjIA7.js";import"./Add-Dci-peTu.js";import"./utils-DaFc0M5i.js";const Ue=Z([Z("@keyframes spin-rotate",`
 from {
 transform: rotate(0);
 }
 to {
 transform: rotate(360deg);
 }
 `),A("spin-container",`
 position: relative;
 `,[A("spin-body",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[_e()])]),A("spin-body",`
 display: inline-flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 `),A("spin",`
 display: inline-flex;
 height: var(--n-size);
 width: var(--n-size);
 font-size: var(--n-size);
 color: var(--n-color);
 `,[ee("rotate",`
 animation: spin-rotate 2s linear infinite;
 `)]),A("spin-description",`
 display: inline-block;
 font-size: var(--n-font-size);
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 margin-top: 8px;
 `),A("spin-content",`
 opacity: 1;
 transition: opacity .3s var(--n-bezier);
 pointer-events: all;
 `,[ee("spinning",`
 user-select: none;
 -webkit-user-select: none;
 pointer-events: none;
 opacity: var(--n-opacity-spinning);
 `)])]),We={small:20,medium:18,large:16},Ge=Object.assign(Object.assign({},re.props),{contentClass:String,contentStyle:[Object,String],description:String,stroke:String,size:{type:[String,Number],default:"medium"},show:{type:Boolean,default:!0},strokeWidth:Number,rotate:{type:Boolean,default:!0},spinning:{type:Boolean,validator:()=>!0,default:void 0},delay:Number}),Je=Y({name:"Spin",props:Ge,slots:Object,setup(_){const{mergedClsPrefixRef:$,inlineThemeDisabled:c}=be(_),p=re("Spin","-spin",Ue,Se,_,$),s=E(()=>{const{size:k}=_,{common:{cubicBezierEaseInOut:I},self:M}=p.value,{opacitySpinning:G,color:j,textColor:V}=M,J=typeof k=="number"?xe(k):M[we("size",k)];return{"--n-bezier":I,"--n-opacity-spinning":G,"--n-size":J,"--n-color":j,"--n-text-color":V}}),x=c?$e("spin",E(()=>{const{size:k}=_;return typeof k=="number"?String(k):k[0]}),s,_):void 0,R=Ce(_,["spinning","show"]),C=L(!1);return Ne(k=>{let I;if(R.value){const{delay:M}=_;if(M){I=window.setTimeout(()=>{C.value=!0},M),k(()=>{clearTimeout(I)});return}}C.value=R.value}),{mergedClsPrefix:$,active:C,mergedStrokeWidth:E(()=>{const{strokeWidth:k}=_;if(k!==void 0)return k;const{size:I}=_;return We[typeof I=="number"?"medium":I]}),cssVars:c?void 0:s,themeClass:x==null?void 0:x.themeClass,onRender:x==null?void 0:x.onRender}},render(){var _,$;const{$slots:c,mergedClsPrefix:p,description:s}=this,x=c.icon&&this.rotate,R=(s||c.description)&&F("div",{class:`${p}-spin-description`},s||((_=c.description)===null||_===void 0?void 0:_.call(c))),C=c.icon?F("div",{class:[`${p}-spin-body`,this.themeClass]},F("div",{class:[`${p}-spin`,x&&`${p}-spin--rotate`],style:c.default?"":this.cssVars},c.icon()),R):F("div",{class:[`${p}-spin-body`,this.themeClass]},F(ke,{clsPrefix:p,style:c.default?"":this.cssVars,stroke:this.stroke,"stroke-width":this.mergedStrokeWidth,class:`${p}-spin`}),R);return($=this.onRender)===null||$===void 0||$.call(this),c.default?F("div",{class:[`${p}-spin-container`,this.themeClass],style:this.cssVars},F("div",{class:[`${p}-spin-content`,this.active&&`${p}-spin-content--spinning`,this.contentClass],style:this.contentStyle},c),F(he,{name:"fade-in-transition"},{default:()=>this.active?C:null})):C}}),He={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Ke=Y({name:"InformationCircleOutline",render:function($,c){return i(),S("svg",He,c[0]||(c[0]=[g("path",{d:"M248 64C146.39 64 64 146.39 64 248s82.39 184 184 184s184-82.39 184-184S349.61 64 248 64z",fill:"none",stroke:"currentColor","stroke-miterlimit":"10","stroke-width":"32"},null,-1),g("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32",d:"M220 220h32v116"},null,-1),g("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-miterlimit":"10","stroke-width":"32",d:"M208 340h88"},null,-1),g("path",{d:"M248 130a26 26 0 1 0 26 26a26 26 0 0 0-26-26z",fill:"currentColor"},null,-1)]))}}),Qe={class:"result-detail-container"},Xe={style:{"text-align":"center",padding:"40px"}},Ye={key:0,class:"attack-result"},qe={class:"image-box"},Ze={key:0,class:"metrics"},et={class:"metric-item"},tt={class:"metric-value"},at={class:"metric-item"},st={class:"metric-value"},lt={style:{"text-align":"center",padding:"40px"}},nt=Y({__name:"AnalysisResultDetail",setup(_){const $=Me(),c=Re(),p=Ee(),s=L(null),x=L(!0),R=L("overview"),C=L(!1),k=L(""),I=E(()=>{var l,e,o,v;return((l=s.value)==null?void 0:l.hasimage)||((e=s.value)==null?void 0:e.images)&&s.value.images.length>0||((v=(o=s.value)==null?void 0:o.message)==null?void 0:v.images)&&s.value.message.images.length>0}),M=E(()=>{var l,e,o;return(e=(l=s.value)==null?void 0:l.message)!=null&&e.images&&s.value.message.images.length>0?s.value.message.images:(o=s.value)!=null&&o.images&&s.value.images.length>0?s.value.images:[]}),G=()=>{try{if($.params.resultData)s.value=JSON.parse($.params.resultData);else{const l=localStorage.getItem("analysisResult")||localStorage.getItem("latestAnalysisResult");if(l)s.value=JSON.parse(l);else{p.warning("未找到分析结果数据"),c.push("/dashboard/model-analysis");return}}x.value=!1}catch(l){console.error("加载分析结果失败:",l),p.error("加载分析结果失败"),c.push("/dashboard/model-analysis")}};E(()=>{var e;if(!((e=s.value)!=null&&e.acc))return{level:"未知",color:"default"};const l=parseFloat(s.value.acc);return l>=.9?{level:"高安全",color:"success"}:l>=.7?{level:"中等安全",color:"warning"}:{level:"低安全",color:"error"}});const j=l=>({all:"对抗攻击评估",backdoor:"后门攻击分析",dlg:"模型推断风险",mia:"成员推断风险"})[l]||l,V=()=>{c.push("/dashboard/model-analysis")},J=()=>{if(!s.value){p.error("无分析结果数据，无法生成报告");return}const l=ue();ve(l),p.success("报告已生成并下载")},ue=()=>{const l=s.value,e=l.attack_type||"未知",o=l.use_privacy?"已启用":"未启用";let u=`# 隐私评估报告

生成时间：${new Date().toLocaleDateString("zh-CN")}
攻击类型：${j(e)}
隐私保护：${o}

`;return e==="mia"?u+=ce(l):e==="dlg"?u+=de(l):e==="backdoor"&&(u+=me(l)),u+=pe(),u},ce=l=>{var d,w,h,b,z;const e=(d=l.message)!=null&&d.clf1?(l.message.clf1*100).toFixed(2):"未知",o=(w=l.message)!=null&&w.clf2?(l.message.clf2*100).toFixed(2):"未知",v=((h=l.message)==null?void 0:h.acc)||l.acc||"未知",u=((b=l.message)==null?void 0:b.epsilon)===1e308?"∞":((z=l.message)==null?void 0:z.epsilon)||"未知";return`## 基于MIA攻击的安全性评估

**定义**：成员推断攻击（Membership Inference Attack，MIA）是一种针对机器学习模型的隐私攻击方法，攻击者试图通过观察模型的输入和输出，推断某个数据样本是否属于模型的训练数据集。

**评估方法**：
1. **攻击模型构建**：攻击者根据目标模型的输出（例如置信度分布）设计一个分类器，用于判断样本是否属于训练集。
2. **数据划分**：将目标模型的训练数据和未见数据分别作为 "成员" 和 "非成员" 样本。
3. **攻击过程**：攻击者通过观察目标模型的输出概率分布，推断样本的成员身份。
4. **指标计算**：基于攻击分类的准确率，计算模型在不同隐私保护设置下的隐私泄露程度。

**评估结果**：

- **训练集准确率**：${e}%
- **测试集准确率**：${o}%
- **攻击准确率**：${v}%
- **隐私预算 (Epsilon)**：${u}

**分析与总结**：
- **隐私泄露现象**：${l.use_privacy?"在差分隐私保护下，模型的隐私泄露风险得到有效控制。":"在无隐私保护的情况下，模型对训练数据的过拟合导致其输出对成员样本和非成员样本存在显著差异。"}
- **隐私保护效果**：${l.use_privacy?"差分隐私技术通过在模型输出或训练过程中加入噪声，模糊了训练数据和非训练数据之间的差异，从根本上提高了模型的隐私安全性。":"建议启用差分隐私保护以降低隐私泄露风险。"}

`},de=l=>{var d,w;const e=((d=l.message)==null?void 0:d.mse_values)||[],o=((w=l.message)==null?void 0:w.ssim_values)||[],v=e.length>0?(e.reduce((h,b)=>h+b,0)/e.length).toFixed(6):"未知",u=o.length>0?(o.reduce((h,b)=>h+b,0)/o.length).toFixed(6):"未知";return`## 基于DLG攻击的安全性评估

**定义**：DLG（Deep Leakage from Gradients）攻击基于模型梯度信息，试图推测训练数据的具体特征或内容。通过分析模型训练过程中的梯度信息，攻击者可以还原训练样本或推断其敏感属性。

**评估方法**：
1. **梯度信息收集**：模拟攻击者获取目标模型在训练过程中生成的梯度信息。
2. **数据推断**：利用梯度信息构建攻击模型，推测训练数据的特征或内容。
3. **误差计算**：比较攻击推测结果与真实数据，计算 MSE 和 SSIM 值，评估模型在面临 DLG 攻击时的隐私泄露程度。

**评估结果**：

- **平均重构误差 (MSE)**：${v}
- **平均结构相似性 (SSIM)**：${u}
- **重构图像数量**：${e.length}
- **MSE 值范围**：${e.length>0?`${Math.min(...e).toFixed(6)} - ${Math.max(...e).toFixed(6)}`:"无数据"}
- **SSIM 值范围**：${o.length>0?`${Math.min(...o).toFixed(6)} - ${Math.max(...o).toFixed(6)}`:"无数据"}

**分析与总结**：
- **隐私泄露现象**：${l.use_privacy?"在差分隐私保护下，梯度中的敏感信息得到有效保护，攻击者难以准确重构原始数据。":"MSE值较低表明攻击者能够利用梯度信息较为准确地还原训练数据特征，存在隐私泄露风险。"}
- **隐私保护效果**：${l.use_privacy?"差分隐私技术在梯度计算过程中引入噪声，通过模糊化敏感信息，有效增强了隐私保护效果。":"建议启用差分隐私保护以提高梯度信息的安全性。"}

`},me=l=>{var v,u;const e=(v=l.message)!=null&&v.clean_acc?(l.message.clean_acc*100).toFixed(2):"未知",o=(u=l.message)!=null&&u.asr?(l.message.asr*100).toFixed(5):"未知";return`## 基于后门攻击的安全性评估

**定义**：后门攻击是一种针对机器学习模型的恶意攻击方式，攻击者在训练数据中植入特定的触发器模式，使得模型在遇到包含触发器的输入时产生预定的错误输出。

**评估方法**：
1. **触发器设计**：设计特定的触发器模式并植入到部分训练样本中。
2. **模型训练**：使用包含后门样本的数据集训练模型。
3. **攻击测试**：测试模型在正常样本和包含触发器样本上的表现。
4. **指标计算**：计算干净准确率和攻击成功率，评估后门攻击的有效性。

**评估结果**：

- **干净准确率 (Clean Accuracy)**：${e}%
- **攻击成功率 (Attack Success Rate)**：${o}%

**分析与总结**：
- **模型性能**：干净准确率为 ${e}%，表明模型在正常样本上${parseFloat(e)>90?"表现良好":"表现一般"}。
- **后门风险**：攻击成功率为 ${o}%，${parseFloat(o)>80?"表明模型存在较高的后门攻击风险":"表明模型对后门攻击具有一定的抵抗能力"}。
- **安全建议**：${l.use_privacy?"当前已启用隐私保护措施，建议继续加强数据质量控制和异常检测。":"建议启用隐私保护措施并加强训练数据的安全性验证。"}

`},pe=()=>`## 改进建议

1. **提升隐私保护技术的精度与效率**：
   - 在差分隐私的实现中，优化噪声注入机制，选择适合的噪声强度和分布，兼顾隐私保护与模型性能。
   - 使用动态噪声注入方法，根据训练过程中的隐私风险实时调整噪声水平，以提高隐私保护的灵活性和效率。
   - 结合梯度裁剪和差分隐私技术，形成多层次隐私保护机制，有效抑制数据泄露风险。

2. **增强模型的泛化能力**：
   - 通过数据增强技术，扩大训练数据的多样性，提高模型在未见数据上的预测能力。
   - 引入更强的正则化手段（如权重衰减或对抗正则化），减少模型过拟合，降低隐私泄露风险。

3. **采用隐私风险评估的多样化指标**：
   - 在传统指标的基础上，引入新的隐私评估方法（如信息熵或混合攻击评估），对隐私泄露进行更全面的评估。
   - 分析不同数据集和任务场景中的隐私保护效果，优化针对性策略。

4. **改进攻击模拟与防御评估**：
   - 构建更复杂和真实的攻击模拟框架，包括联合多种攻击方法，验证模型的综合抗攻击能力。
   - 定期评估隐私保护技术的有效性，动态更新保护策略，保持领先的隐私保护水平。

## 总结

本报告基于实际的模型分析结果，全面评估了模型在隐私保护方面的表现。通过科学的评估方法和详细的数据分析，为模型的隐私安全提供了重要的参考依据。建议根据评估结果，采取相应的隐私保护措施，确保模型在实际应用中的安全性和可靠性。
`,ve=l=>{const e=new Blob([l],{type:"text/markdown;charset=utf-8"}),o=URL.createObjectURL(e),v=document.createElement("a");v.href=o,v.download=`隐私评估报告_${new Date().toISOString().slice(0,10)}.md`,document.body.appendChild(v),v.click(),document.body.removeChild(v),URL.revokeObjectURL(o)},fe=()=>{p.info("分享功能开发中...")},ge=l=>{k.value=l,C.value=!0},ye=l=>{var o;const e=(o=s.value)==null?void 0:o.attack_type;return e==="dlg"?`重构图像 ${l+1}`:e==="backdoor"?`后门样本 ${l+1}`:e==="mia"?`推断样本 ${l+1}`:`图像 ${l+1}`};return Ie(()=>{G()}),(l,e)=>{const o=te("n-empty"),v=te("n-modal");return i(),S("div",Qe,[n(t(T),{vertical:"",size:"large"},{default:a(()=>[n(t(D),{class:"header-card"},{default:a(()=>[n(t(T),{justify:"space-between",align:"center"},{default:a(()=>[n(t(T),{align:"center"},{default:a(()=>[n(t(P),{text:"",onClick:V},{icon:a(()=>[n(t(B),null,{default:a(()=>[n(t(Oe))]),_:1})]),default:a(()=>[e[2]||(e[2]=r(" 返回分析 "))]),_:1}),e[3]||(e[3]=g("h2",{style:{margin:"0"}},"分析结果详情",-1))]),_:1}),n(t(T),null,{default:a(()=>[n(t(P),{onClick:J},{icon:a(()=>[n(t(B),null,{default:a(()=>[n(t(ze))]),_:1})]),default:a(()=>[e[4]||(e[4]=r(" 生成报告 "))]),_:1}),n(t(P),{type:"primary",onClick:fe},{default:a(()=>e[5]||(e[5]=[r(" 分享结果 ")])),_:1})]),_:1})]),_:1})]),_:1}),x.value?(i(),m(t(D),{key:0},{default:a(()=>[g("div",Xe,[n(t(Je),{size:"large"}),e[6]||(e[6]=g("p",{style:{"margin-top":"16px"}},"加载分析结果中...",-1))])]),_:1})):s.value?(i(),S(O,{key:1},[n(t(D),{title:"分析概览",class:"overview-card"},{default:a(()=>[n(t(Ve),{cols:4,"x-gap":20},{default:a(()=>[n(t(ne),null,{default:a(()=>[n(t(ie),{label:"攻击类型",value:j(s.value.attack_type||"")},null,8,["value"])]),_:1}),n(t(ne),null,{default:a(()=>[n(t(ie),{label:"隐私保护",value:s.value.use_privacy?"已启用":"未启用"},null,8,["value"])]),_:1})]),_:1})]),_:1}),n(t(D),null,{default:a(()=>[n(t(Ae),{value:R.value,"onUpdate:value":e[0]||(e[0]=u=>R.value=u),type:"line"},{default:a(()=>[n(t(U),{name:"overview",tab:"基础信息"},{default:a(()=>[n(t(T),{vertical:"",size:"large"},{default:a(()=>[n(t(Fe),{"label-placement":"left",column:2},{default:a(()=>{var u,d,w,h,b,z,H,q;return[n(t(N),{label:"分析状态"},{default:a(()=>[n(t(Te),{type:s.value.status==="success"?"success":"error"},{default:a(()=>[r(f(s.value.status==="success"?"成功":"失败"),1)]),_:1},8,["type"])]),_:1}),s.value.attack_type==="dlg"?(i(),S(O,{key:0},[(u=s.value.message)!=null&&u.mse_values?(i(),m(t(N),{key:0,label:"重构质量 (MSE)"},{default:a(()=>[r(f(s.value.message.mse_values.map(K=>K.toFixed(4)).join(", ")),1)]),_:1})):y("",!0),(d=s.value.message)!=null&&d.ssim_values?(i(),m(t(N),{key:1,label:"结构相似性 (SSIM)"},{default:a(()=>[r(f(s.value.message.ssim_values.map(K=>K.toFixed(4)).join(", ")),1)]),_:1})):y("",!0)],64)):s.value.attack_type==="backdoor"?(i(),S(O,{key:1},[(w=s.value.message)!=null&&w.clean_acc?(i(),m(t(N),{key:0,label:"干净准确率"},{default:a(()=>[r(f((s.value.message.clean_acc*100).toFixed(2))+"% ",1)]),_:1})):y("",!0),(h=s.value.message)!=null&&h.asr?(i(),m(t(N),{key:1,label:"攻击成功率"},{default:a(()=>[r(f((s.value.message.asr*100).toFixed(5))+"% ",1)]),_:1})):y("",!0)],64)):s.value.attack_type==="mia"?(i(),S(O,{key:2},[(b=s.value.message)!=null&&b.clf1?(i(),m(t(N),{key:0,label:"训练集准确率"},{default:a(()=>[r(f((s.value.message.clf1*100).toFixed(2))+"% ",1)]),_:1})):y("",!0),(z=s.value.message)!=null&&z.clf2?(i(),m(t(N),{key:1,label:"测试集准确率"},{default:a(()=>[r(f((s.value.message.clf2*100).toFixed(2))+"% ",1)]),_:1})):y("",!0),(H=s.value.message)!=null&&H.epsilon?(i(),m(t(N),{key:2,label:"隐私预算 (Epsilon)"},{default:a(()=>[r(f(s.value.message.epsilon===1e308?"∞":s.value.message.epsilon),1)]),_:1})):y("",!0),(q=s.value.message)!=null&&q.acc?(i(),m(t(N),{key:3,label:"推断准确率"},{default:a(()=>[r(f((Number(s.value.message.acc)*100).toFixed(4))+"% ",1)]),_:1})):y("",!0)],64)):y("",!0),s.value.acc?(i(),m(t(N),{key:3,label:"总体准确率"},{default:a(()=>[r(f(s.value.acc),1)]),_:1})):y("",!0)]}),_:1}),s.value.use_privacy?(i(),m(t(X),{key:0,type:"info"},{icon:a(()=>[n(t(B),null,{default:a(()=>[n(t(Be))]),_:1})]),default:a(()=>[e[7]||(e[7]=r(" 本次分析启用了隐私保护机制，结果已经过差分隐私处理 "))]),_:1})):y("",!0)]),_:1})]),_:1}),s.value.mse_values||s.value.ssim_values?(i(),m(t(U),{key:0,name:"metrics",tab:"性能指标"},{default:a(()=>[n(t(T),{vertical:"",size:"large"},{default:a(()=>[s.value.mse_values?(i(),m(t(D),{key:0,title:"MSE 值"},{default:a(()=>[n(t(ae),null,{default:a(()=>[(i(!0),S(O,null,Q(s.value.mse_values,(u,d)=>(i(),m(t(se),{key:d},{default:a(()=>[n(t(oe),null,{header:a(()=>[r("样本 "+f(d+1),1)]),description:a(()=>[r(" MSE: "+f(u.toFixed(6)),1)]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1})):y("",!0),s.value.ssim_values?(i(),m(t(D),{key:1,title:"SSIM 值"},{default:a(()=>[n(t(ae),null,{default:a(()=>[(i(!0),S(O,null,Q(s.value.ssim_values,(u,d)=>(i(),m(t(se),{key:d},{default:a(()=>[n(t(oe),null,{header:a(()=>[r("样本 "+f(d+1),1)]),description:a(()=>[r(" SSIM: "+f(u.toFixed(6)),1)]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1})):y("",!0)]),_:1})]),_:1})):y("",!0),I.value?(i(),m(t(U),{key:1,name:"images",tab:"图像展示"},{default:a(()=>[n(t(T),{vertical:"",size:"large"},{default:a(()=>[n(t(X),{type:"info"},{icon:a(()=>[n(t(B),null,{default:a(()=>[n(t(Le))]),_:1})]),default:a(()=>[e[8]||(e[8]=r(" 以下是分析过程中生成的图像结果 "))]),_:1}),s.value.attack_type==="dlg"&&M.value&&M.value.length>0?(i(),S("div",Ye,[g("div",qe,[(i(!0),S(O,null,Q(M.value,(u,d)=>(i(),S("div",{class:"image-wrapper",key:d},[n(t(D),{size:"small",class:"image-card"},{header:a(()=>[r(f(ye(d)),1)]),default:a(()=>{var w,h,b,z;return[n(t(le),{src:`data:image/png;base64,${u}`,"object-fit":"contain",class:"result-image",width:"200px",height:"200px","preview-disabled":"",onClick:H=>{ge(`data:image/png;base64,${u}`)},style:{cursor:"pointer"}},null,8,["src","onClick"]),(w=s.value.message)!=null&&w.mse_values&&((h=s.value.message)!=null&&h.ssim_values)?(i(),S("div",Ze,[g("div",et,[e[9]||(e[9]=g("span",{class:"metric-label"},"MSE:",-1)),g("span",tt,f((b=s.value.message.mse_values[d])==null?void 0:b.toFixed(4)),1)]),g("div",at,[e[10]||(e[10]=g("span",{class:"metric-label"},"SSIM:",-1)),g("span",st,f((z=s.value.message.ssim_values[d])==null?void 0:z.toFixed(4)),1)])])):y("",!0)]}),_:2},1024)]))),128))])])):(i(),m(o,{key:2,description:"暂无图像数据"}))]),_:1})]),_:1})):y("",!0),n(t(U),{name:"recommendations",tab:"安全建议"},{default:a(()=>[n(t(T),{vertical:"",size:"large"},{default:a(()=>[n(t(X),{type:"warning"},{icon:a(()=>[n(t(B),null,{default:a(()=>[n(t(je))]),_:1})]),default:a(()=>[e[11]||(e[11]=r(" 基于分析结果，我们为您提供以下安全建议 "))]),_:1}),n(t(Pe),null,{default:a(()=>[n(t(W),{type:"info",title:"模型加固"},{default:a(()=>e[12]||(e[12]=[r(" 建议采用对抗训练技术，提高模型对对抗样本的鲁棒性 ")])),_:1}),n(t(W),{type:"warning",title:"隐私保护"},{default:a(()=>e[13]||(e[13]=[r(" 考虑使用差分隐私技术保护训练数据的隐私 ")])),_:1}),n(t(W),{type:"success",title:"监控部署"},{default:a(()=>e[14]||(e[14]=[r(" 在生产环境中部署异常检测机制，实时监控模型行为 ")])),_:1}),n(t(W),{type:"error",title:"定期评估"},{default:a(()=>e[15]||(e[15]=[r(" 建议定期进行安全评估，及时发现新的安全威胁 ")])),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["value"])]),_:1})],64)):(i(),m(t(D),{key:2},{default:a(()=>[g("div",lt,[n(t(B),{size:"48",color:"#999"},{default:a(()=>[n(t(Ke))]),_:1}),e[17]||(e[17]=g("h3",{style:{margin:"16px 0 8px 0",color:"#999"}},"暂无分析结果",-1)),e[18]||(e[18]=g("p",{style:{color:"#666","margin-bottom":"24px"}},"请先进行模型分析",-1)),n(t(P),{type:"primary",onClick:V},{default:a(()=>e[16]||(e[16]=[r(" 返回分析页面 ")])),_:1})])]),_:1}))]),_:1}),n(v,{show:C.value,"onUpdate:show":e[1]||(e[1]=u=>C.value=u),preset:"card",style:{width:"80%","max-width":"800px"}},{header:a(()=>e[19]||(e[19]=[r(" 图像预览 ")])),default:a(()=>[n(t(le),{src:k.value,width:"100%","object-fit":"contain"},null,8,["src"])]),_:1},8,["show"])])}}}),_t=De(nt,[["__scopeId","data-v-c351679a"]]);export{_t as default};
