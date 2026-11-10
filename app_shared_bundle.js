import{o as tr}from"./rolldown-runtime-CSz5w8F5.js";import{$z as Se,AL as nr,BB as oe,BR as rr,BT as De,DG as ft,DU as ar,DW as or,Dw as ir,EG as He,Ew as sr,FC as lr,Gq as et,IC as cr,ID as Z,IH as $t,KU as dr,Kh as pr,Kq as un,LU as ur,Lz as fr,ML as gr,MW as hr,Mh as _t,NU as St,Ng as xr,Nh as Et,PN as fn,PU as tt,Qz as qe,SG as nt,SS as br,TG as vr,XS as it,ZK as Oe,_D as mr,_K as ke,cz as wr,dq as yr,dz as gn,fE as rt,fj as Mt,gt as kr,gw as _r,hq as At,jL as Sr,jW as at,kG as hn,lJ as Er,lc as Mr,mB as Ar,mj as xn,mx as Cr,oL as Ir,o_ as Tr,qU as st,qh as Pr,qq as bn,rt as zr,sU as Or,uK as Ct,wG as Pe,wS as qr,zD as Ht,zb as Rr}from"./app-shared-rm6ljTeo.js";import{T as Ue,r as be,u as Fr}from"./vendor-tanstack-D6yZ0yGH.js";import{i as Lr,r as Dr}from"./vendor-react-Fx2PtaaM.js";import{ad as Nr,cd as Ur,dd as jr,fd as $r,id as Hr,ld as Br,nd as Bt,od as Gr,rd as Vr,sd as Qr,td as Kr,ud as Wr}from"./i18n-fn/_eager-BPyu6Z-0.js";import{Tn as Yr,_ as Xr}from"./flag-catalog-BvlCnb6-.js";import{Fc as Jr,Sa as Zr,ba as ea,va as ta,xa as na,ya as ra}from"./i18n-fn/_misc-DLHl5c9M.js";import{T as lt,k as aa}from"./vendor-schema-CqY_I52z.js";import{C as Q,h as oa}from"./vendor-protobuf-D6p2Jlqd.js";import{$d as ia,Ac as Ae,Ao as sa,Bd as Gt,Eo as la,Fd as ca,Fn as da,Gc as vn,Go as mn,Hd as pa,Id as ua,Jd as fa,Kd as Qe,Ko as ga,Ls as ha,Md as xa,Nd as ba,Nn as va,Od as ma,Qd as wa,Rd as ya,Ro as ka,Ru as _a,To as Sa,Us as Ea,Vd as Ma,Wd as Aa,Xd as Ca,Yd as Ia,Yo as wn,Zd as Ta,_n as Pa,_o as yn,cf as za,dc as Oa,df as qa,ef as kn,ff as Ra,gf as Fa,hf as La,hn as Da,if as Na,jd as Ua,jr as ja,kc as $a,lf as Ha,mf as Ba,nf as Ga,of as Va,pf as Qa,po as Ka,qd as Vt,rf as Wa,sf as Ya,tf as Xa,uc as It,uf as Ja,vo as Za}from"./dashboard-shared-ClCbSTBn.js";import{$p as eo,Bp as to,Bv as _n,Gp as no,Hp as ro,Ip as Ke,Jh as ao,Jp as oo,Kp as io,Qp as so,Rp as lo,Rr as co,Up as po,Vb as Sn,Vp as uo,Wb as En,Wp as fo,Xp as Mn,Yp as go,Zp as ho,_m as xo,_y as bo,ap as vo,cm as mo,dp as wo,dy as yo,e_ as ko,fp as _o,fy as So,hy as te,i_ as Eo,la as An,lm as Mo,lp as Ao,my as Co,no as Io,om as To,oy as Po,pp as Cn,py as zo,qp as Oo,sm as In,vm as qo,xs as Ro,zh as Fo,zr as Lo}from"./app-lazy-shared-C0zdoeVz.js";import{Uo as Do,Zo as No,as as We,fs as Uo,hs as jo,ls as $o,ms as Ho,ns as Bo,os as Tn,ps as Go,ts as ze,zo as Vo}from"./dashboard-boot-shared-BvC1VTbe.js";import{Lt as Qo}from"./settings-shared-leaves-NKlEkNV2.js";import{Mi as Ko,Ri as Wo,Sr as Yo,Tr as Xo,dr as Jo,la as _e,li as Tt,ua as Pn,ui as Zo}from"./route-shared-leaves-D6WMgwYG.js";import{Ir as ei,Or as ti,Pr as ni,Qr as ri,wr as ai,zr as oi}from"./app-lazy-surfaces-Cin8kwlx.js";try{(function(){var e=typeof window<"u"?window:typeof global<"u"?global:typeof globalThis<"u"?globalThis:typeof self<"u"?self:{},t=new e.Error().stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="52472128-fcfd-4bb0-9a28-72da2f82ac3b",e._sentryDebugIdIdentifier="sentry-dbid-52472128-fcfd-4bb0-9a28-72da2f82ac3b")})()}catch{}var E=tr(Lr(),1),ii=aa({status:lt(402),type:lt("Payment required"),message:lt("Workspace out of credits")});function zn(e){if(e.status===402)return!0;if(e.type!==Ar.malformed||e.status!==502)return!1;try{return ii.safeParse(JSON.parse(e.message)).success}catch{return!1}}function O0(e){const t=Tt();return Mo(e??t,Ye,li)}function si(e,t){return t?jo(Ye(e)?.toolCall.tool_call_event,t):!1}function q0(e){return To(t=>si(t,e))}function Ye(e){let t=!1;for(let n=e.orderedItems.length-1;n>=0;n--){const r=e.orderedItems[n];if(r.payload.type==="user_message"&&!r.payload.voice&&!r.payload.isExternalAgent&&!r.isStreaming&&(t=!0),r.payload.type!=="ai_message"||!r.payload.voiceDelegation&&r.payload.parts.length>0&&r.payload.parts.every(i=>i.type==="text"&&i.voiceTranscript!==void 0))continue;const a=r.payload.parts.find(i=>i.type==="tool_call"&&i.approval_status==="pending");return!a||t&&!yn(a.tool_id)?null:{toolCall:a,message:r.payload,messageEventId:r.startEvent,legacyAiMessageFirestoreId:r.payload.legacyAiMessageFirestoreIds.at(-1)??""}}return null}function li(e,t){return e===null||t===null?e===t:e.toolCall.tool_call_event===t.toolCall.tool_call_event&&e.toolCall.approval_status===t.toolCall.approval_status&&e.legacyAiMessageFirestoreId===t.legacyAiMessageFirestoreId&&ci(e.message.parts,t.message.parts)}function ci(e,t){return e.length===t.length&&e.every((n,r)=>Qt(n)===Qt(t[r]))}function Qt(e){return e.type!=="tool_call"?e.type:["tool_call",e.tool_call_event,e.tool_exec_end_event??"",e.done?"done":"pending"].join(":")}var gt="Before sending this message I saved an updated version of the pending plan in the plan editor. Treat the plan below as the current draft — the version from your last plan--show is stale — and base any revision on it:",On=`Figure files wrapped in <updated-figure src="..."> blocks inside the plan also differ from the ones on disk; treat each block body as that figure file's current content.`,Pt="<<<UPDATED_PLAN",zt="UPDATED_PLAN>>>",di=2e3,pi=`

[... middle of the plan truncated for length ...]

`;function ui(e){return e.replaceAll(zt,"UPDATED_PLAN\\>>>").replaceAll(Pt,"<<<\\UPDATED_PLAN")}function fi(e){return e.replaceAll("UPDATED_PLAN\\>>>",zt).replaceAll("<<<\\UPDATED_PLAN",Pt)}function gi(e,t){if(e.length<=t)return e;const n=Math.max(t-53,200),r=Math.ceil(n*.6),a=n-r;return e.slice(0,r)+pi+e.slice(e.length-a)}function hi(e,t){const n=oi(e);return n.some(r=>r.kind==="html"&&t[r.src]!==void 0)?n.map(r=>{if(r.kind==="md")return r.content.trim();const a=t[r.src];return a===void 0?ni(r.src,r.sha):`<updated-figure src="${r.src}">
${a.trim()}
</updated-figure>`}).join(`

`):e}function xi(e,t,n,r){const a=r?hi(t,r):t,i=a===t?gt:`${gt}

${On}`,s=ui(a.trim()),d=n-(e.length+i.length+15+15+8);if(d<di)return e;const h=`${i}

${Pt}
${gi(s,d)}
${zt}`;return e.trim().length>0?`${e}

${h}`:h}function R0(e){const t=e.lastIndexOf(gt);if(t===-1)return null;const n=e.slice(0,t);if(n!==""&&!n.endsWith(`

`))return null;const r=e.slice(t+216),a=r.startsWith(`

${On}`)?r.slice(171):r,i=/^\n\n<<<UPDATED_PLAN\n([\s\S]*)\nUPDATED_PLAN>>>\s*$/.exec(a);return i?{prose:n.slice(0,Math.max(n.length-2,0)),planContent:fi(i[1])}:null}var Be=864e5;var bi=[1*Be,2*Be,4*Be,7*Be],Xe="chat-nudge-keep-chatting:schedule",ct={firstUsedAt:null,lastShownAt:null,shownCount:0,interjected:!1},Ce=null,Ot=0,Ie=new Set,Kt=e=>typeof e=="number"&&Number.isFinite(e)&&e>0?e:null;function qn(e){if(!e)return{...ct};try{const t=JSON.parse(e);if(typeof t!="object"||t===null)return{...ct};const{firstUsedAt:n,lastShownAt:r,shownCount:a,interjected:i}=t;return{firstUsedAt:Kt(n),lastShownAt:Kt(r),shownCount:typeof a=="number"&&Number.isFinite(a)&&a>0?Math.floor(a):0,interjected:i===!0}}catch{return{...ct}}}function Rn(e,t){return{firstUsedAt:e.firstUsedAt===null||t.firstUsedAt===null?e.firstUsedAt??t.firstUsedAt:Math.min(e.firstUsedAt,t.firstUsedAt),lastShownAt:e.lastShownAt===null||t.lastShownAt===null?e.lastShownAt??t.lastShownAt:Math.max(e.lastShownAt,t.lastShownAt),shownCount:Math.max(e.shownCount,t.shownCount),interjected:e.interjected||t.interjected}}function je(){const e=qn(nt(Xe));return Ce=Ce===null?e:Rn(Ce,e),Ce}function qt(e){Ce=Rn(e,qn(nt(Xe))),hn(Xe,JSON.stringify(Ce)),Ot+=1;for(const t of Ie)t()}function Wt(e){if(!(e.key!==null&&e.key!==Xe)){Ot+=1;for(const t of Ie)t()}}function F0(e){return Ie.size===0&&typeof window<"u"&&window.addEventListener("storage",Wt),Ie.add(e),()=>{Ie.delete(e),Ie.size===0&&typeof window<"u"&&window.removeEventListener("storage",Wt)}}var L0=()=>Ot;function D0(e){const t=je();t.firstUsedAt===null&&qt({...t,firstUsedAt:e})}function vi(){const e=je();e.interjected||qt({...e,interjected:!0})}function N0(){return je().interjected}function mi(e){const t=je();qt({...t,lastShownAt:e,shownCount:t.shownCount+1})}var Ne=null;function U0(e,t){Ne!==e&&(Ne=e,mi(t))}function j0(e){return Ne===e}function $0(e){Ne===e&&(Ne=null)}function H0(e){const t=je();if(t.interjected||t.firstUsedAt===null||e<t.firstUsedAt+864e5)return!1;if(t.lastShownAt===null)return!0;const n=bi,r=n[Math.min(Math.max(t.shownCount-1,0),n.length-1)];return e>=t.lastShownAt+r}var B0=()=>et((e,t)=>({anchor:null,source:void 0,resolve:null,confirm:(n,r)=>t().resolve?Promise.resolve(!1):new Promise(a=>{e({anchor:n??null,source:r,resolve:i=>{e({resolve:null}),a(i)}})})})),Fn=(0,E.createContext)(null);Fn.displayName="BuildSwitchConfirmationContext";function wi(){const e=(0,E.use)(Fn);if(!e)throw new Error("useBuildSwitchConfirmationStore must be used within ProjectChatInputProvider");return e}async function G0(e){const{draftStore:t,messageId:n,preview:r,scope:a,startEditing:i,stopEditing:s}=e,{begin:d,update:h,clear:p}=t.getState();d(n,r,a);const w=await i(n);if(!w.success){p(n);return}const l=t.getState().drafts[n];if(!l){s(n,a);return}l.text===r&&h(n,w.messageContent??r)}function yi(){return et(e=>({drafts:{},begin:(t,n,r)=>e(a=>({drafts:{...a.drafts,[t]:{text:n,scope:r}}})),update:(t,n)=>e(r=>r.drafts[t]?{drafts:{...r.drafts,[t]:{...r.drafts[t],text:n}}}:{}),clear:t=>e(n=>{if(!n.drafts[t])return{};const{[t]:r,...a}=n.drafts;return{drafts:a}})}))}function Ln({hasAnyEdits:e,hasHomeSurfaceArtifact:t}){return e||t}function ki({canAutoExit:e,hasAnyEdits:t,hasHomeSurfaceArtifact:n}){return Ln({hasAnyEdits:t,hasHomeSurfaceArtifact:n})&&e}function _i({fullscreenEnabled:e,intendedState:t,isWaitingForArtifactLookup:n,shouldExitOnboarding:r}){return n?{kind:"wait"}:t!==void 0?{kind:"restore",fullscreen:t}:r?{kind:"exit"}:e?{kind:"force"}:{kind:"none"}}function Si(){const e=_e(r=>r.updateProject),t=_e(r=>r.projectId),{permitted:n}=Mt(Oe.EditProject);return(0,E.useCallback)(r=>{gr(t,r),n&&e({fullscreen_enabled:r},{onError:a=>{console.error("Failed to update fullscreen:",{error:a})}})},[n,t,e])}function Ei({storeRef:e,projectId:t}){const n=We(R=>R.setIsFullscreenChat),r=We(R=>R.isFullscreenChat),a=_e(R=>R.project),i=_e(R=>R.viewTier==="full"),s=Si(),d=fo(),h=$o(),p=gn(Yr).enabled,w=Cr(),{permitted:l,isResolved:c}=Mt(Oe.ViewProjectArtifacts),f=h&&i,b=Xo(),v=f&&l,{data:S,isError:z}=Fr({...zr({projectId:t,threadId:b}),enabled:v}),H=v?S:void 0,u=Jo(Yo(H?.artifacts,p))!==null,x=!f||c&&(!l||z||u),T=f&&(!c||l&&!z&&(H===void 0||!w&&!u)),o=a?.creation_options?.metadata?.fullscreen_enabled===!0,y=a?.edit_count??0,_=a!=null,M=(0,E.useEffectEvent)(()=>{d({projectId:t,trigger:"first_artifact",project:a})}),I=(0,E.useRef)(!1),O=(0,E.useRef)(!1),G=(0,E.useRef)(!1);(0,E.useEffect)(()=>{if(o||(I.current=!1),!_)return;const R=g=>{if(!g.isInitialized)return;const k=Object.keys(g.edits).length,A=y>0||k>0,P=Ln({hasAnyEdits:A,hasHomeSurfaceArtifact:u}),q=ki({canAutoExit:x,hasAnyEdits:A,hasHomeSurfaceArtifact:u});if(!O.current){const j=Sr(new URLSearchParams(window.location.search).get("fullscreen")),D=_i({fullscreenEnabled:o,intendedState:j??nr(Er("editor_fullscreen_chat"),t),isWaitingForArtifactLookup:T,shouldExitOnboarding:q});if(D.kind==="wait")return;if(O.current=!0,D.kind==="restore"){P&&(G.current=!0),r!==D.fullscreen&&n(D.fullscreen);return}if(D.kind==="exit"){r&&(n(!1),M()),o&&!I.current&&(I.current=!0,s(!1)),G.current=!0;return}D.kind==="force"&&n(!0);return}!G.current&&q&&(G.current=!0,r&&(n(!1),M()),o&&!I.current&&(I.current=!0,s(!1)))};return R(e.current.getState()),e.current.subscribe(R)},[x,o,u,_,r,T,t,y,n,e,s])}var Le={messages:(e,t)=>[...$t.detail(e),"messages",t],edits:(e,t)=>[...$t.detail(e),"edits",t]},ht;(function(e){e.tag=(function(t){return t.MESSAGE_BASED_REVERT_SUCCESS="message-based-revert-success",t})({})})(ht||(ht={}));var Ge=[],xe=e=>typeof e=="string"?new Date(e):Bo(e)?e.toDate():new ze(e.seconds,e.nanoseconds).toDate(),Rt=(e,t)=>{switch(e.tag){case uo.tag.INSTANT_MODE_MESSAGE:return e.role==="user"?{createdAt:xe(e.created_at),role:"user",id:e.id,content:e.content,type:"userMessage",selectedElements:e.selected_elements??Ge,selectedCanvasShapes:e.selected_canvas_shapes??Ge,images:e.images??Ge,containsError:e.contains_error??!1,userId:e.user_id??void 0,chatOnly:e.chat_only??!1,interjection:e.interjection??!1,intent:e.intent??void 0,roadmapTask:e.roadmap_task??void 0,fromAgent:e.from_agent??!1,fromAgentKind:e.from_agent_kind,senderIntent:e.from_agent_intent,fromAgentSource:e.from_agent_source}:{createdAt:xe(e.created_at),role:"ai",id:e.id,content:e.content,type:"aiMessage",editId:e.edit_id??void 0,stopped:!!e.stopped,errors:e.errors?.sort((a,i)=>{const s=typeof a.created_at=="string"?new Date(a.created_at).getTime():(a.created_at.seconds??0)*1e3;return(typeof i.created_at=="string"?new Date(i.created_at).getTime():(i.created_at.seconds??0)*1e3)-s})??void 0,sqlRunState:e.sql_run_state??void 0,persisted:t?.persisted??!1,status:e.status??"completed",thinkingTimeMs:e.thinking_time_ms??void 0,timeToFirstTokenMs:e.time_to_first_token_ms??void 0,feedbackSentiment:e.feedback_sentiment??void 0,feedbackContent:e.feedback_content??void 0,feedbackCategory:e.feedback_category??void 0,costCredits:e.cost_credits??void 0,braintrustSpanId:e.braintrust_span_id??void 0,pipelineErrors:(e.pipeline_errors||[]).map(a=>({traceId:a.trace_id,code:a.code,message:a.message,details:a.details})),activityDescription:e.activity_description??void 0,toolDiffs:e.tool_diffs??void 0,toolDiffsSkipped:e.tool_diffs_skipped??void 0};case po.tag.BRANCH_SWITCHED:return{createdAt:xe(e.created_at),id:e.id,type:"branchSwitched",branchName:e.branch_name};case ro.tag.EXTERNAL_COMMIT_PUSHED:return{createdAt:xe(e.created_at),id:e.id,type:"userCommit",shortCommitHash:e.commit_hash??void 0,commitMessage:e.commit_message,editId:e.edit_id??void 0};case to.tag.REVERT_SUCCESS:case"revert-success-v2":return{createdAt:xe(e.created_at),id:e.id,type:"revertSuccess",shortCommitHash:e.commit_hash??void 0,editId:e.edit_id??""};case ht.tag.MESSAGE_BASED_REVERT_SUCCESS:const n=Array.isArray(e.reverted_event_ids)?e.reverted_event_ids:Ge;return{createdAt:xe(e.created_at),id:e.id,type:"messageBasedRevertSuccess",editId:e.edit_id??"",revertedEventIds:n,amountOfRevertedEdits:e.amount_of_reverted_edits??n.length};case"manual-edit":const r=e;return{createdAt:xe(r.created_at),id:r.id,type:"manualEdit",content:r.content,editId:r.edit_id,errors:r.errors?.sort((a,i)=>{const s=typeof a.created_at=="string"?new Date(a.created_at).getTime():(a.created_at.seconds??0)*1e3;return(typeof i.created_at=="string"?new Date(i.created_at).getTime():(i.created_at.seconds??0)*1e3)-s})??void 0};case"revert":return e.role==="user"?{createdAt:xe(e.created_at),id:e.id,type:"userMessage",content:e.content,containsError:!1,images:[],selectedElements:[],selectedCanvasShapes:[],userId:e.user_id,role:"user"}:{createdAt:xe(e.created_at),id:e.id,type:"aiMessage",content:e.content,role:"ai",persisted:!0,status:"completed",sqlRunState:void 0,stopped:!1};default:return console.error("Unknown message tag",{message:e}),null}};function Mi(e){return{id:String(e.id??""),created_at:typeof e.created_at=="string"&&e.created_at?ze.fromDate(new Date(e.created_at)):ze.now(),type:String(e.type??""),occurred_at:String(e.occurred_at??""),error_message:String(e.error_message??""),message_id:e.message_id!=null?String(e.message_id):void 0,meta_data:e.meta_data??void 0,edit_count:typeof e.edit_count=="number"?e.edit_count:void 0,dont_show:typeof e.dont_show=="boolean"?e.dont_show:void 0}}function Ai(e,t){let n=e;return typeof t.edit_id=="string"&&(n={...n,editId:t.edit_id}),typeof t.cost_credits=="number"&&(n={...n,costCredits:t.cost_credits}),typeof t.braintrust_span_id=="string"&&(n={...n,braintrustSpanId:t.braintrust_span_id}),typeof t.stopped=="boolean"&&(n={...n,stopped:t.stopped}),t.status&&(n={...n,status:t.status}),Array.isArray(t.errors)&&(n={...n,errors:t.errors.map(Mi)}),n}var Te={API_BATCH_SIZE:100,MESSAGES_PAGE_SIZE:30,EDIT_PAGE_SIZE:30,PREFETCH_STALE_TIME_MS:3e4},Yt=`
<lov-tool-use id="thinking-opt" name="lov-think" data="">
`;function Ci({array:e,batchSize:t}){return Array.from({length:Math.ceil(e.length/t)},(n,r)=>e.slice(r*t,(r+1)*t))}function Ii({projectId:e}){return{fetchMessagesForEdits:(0,E.useCallback)(async t=>{if(t.length===0)return{};const n=qe(),r=At(),a=Ci({array:[...t].sort(),batchSize:Te.API_BATCH_SIZE}),i=await Promise.all(a.map(d=>r.fetchQuery({queryKey:Le.messages(e,{edit_ids:d}),queryFn:()=>n.get(`/projects/${e}/messages?edit_ids=${d.map(encodeURIComponent).join(",")}`),staleTime:0}))),s={};for(const d of i)for(const h of d?.events??[]){const p=Rt(h,{persisted:!0});p&&typeof h.id=="string"&&(s[h.id]=p)}return s},[e])}}function Ti(e,t){const n={...e};return"status"in t&&(n.status=t.status),"preview_build_status"in t&&(n.previewBuildStatus=t.preview_build_status),"bookmarked"in t&&(n.bookmarked=t.bookmarked),"reverted"in t&&(n.reverted=t.reverted),"pages"in t&&(n.pages=t.pages),"archived"in t&&(n.archived=t.archived),"diff"in t&&(n.diff=t.diff),"commit_sha"in t&&(n.commit_sha=t.commit_sha),"commit_message"in t&&(n.commit_message=t.commit_message),n}function xt(e){if(typeof e.id!="string")return null;const t=e.created_at;let n;if(typeof t=="string")n=ze.fromDate(new Date(t));else if(t&&typeof t.seconds=="number"){const r=t;n=new ze(r.seconds,r.nanoseconds??0)}else n=ze.now();return{id:e.id,commit_sha:typeof e.commit_sha=="string"?e.commit_sha:"unknown",commit_message:typeof e.commit_message=="string"?e.commit_message:"unknown",created_at:n,reverted:e.reverted===!0,archived:e.archived===!0,type:e.type??"ai_update",diff:e.diff??null,status:e.status??null,previewBuildStatus:e.preview_build_status??null,bookmarked:e.bookmarked===!0,revert_target_edit_id:e.revert_target_edit_id??void 0,pages:e.pages??[]}}Sn();var Pi=()=>et()(_n(e=>({sortedMessageIds:[],messages:{},edits:{},isInitialized:!1,latestStreamedMessage:void 0,streamingUIMessage:void 0,pendingEditUpdates:{},pendingMessageFieldUpdates:{},setStreamingMessage:t=>{e(n=>{n.latestStreamedMessage=t,n.streamingUIMessage=t?Rt(t)??void 0:void 0})}})));function zi(e,t){const n=e.messages[t];return n?.type==="aiMessage"&&n.persisted?n.status==="running"&&e.streamingUIMessage?.id===t?e.streamingUIMessage:n:n&&n.type!=="aiMessage"?n:e.streamingUIMessage?.id===t?e.streamingUIMessage:n}function V0(e){if(e.streamingUIMessage&&e.streamingUIMessage.content!==Yt)return{messageId:e.streamingUIMessage.id,message:e.streamingUIMessage};const{sortedMessageIds:t}=e;for(let n=t.length-1;n>=0;n--){const r=t[n],a=zi(e,r);if(a?.type==="aiMessage"&&a.content!==Yt)return{messageId:r,message:a}}return null}function Oi(e,t){return e.map((n,r)=>({id:n,index:r})).sort((n,r)=>{const a=t[n.id]?.createdAt?.getTime()??1/0,i=t[r.id]?.createdAt?.getTime()??1/0;return a!==i?a-i:n.index-r.index}).map(({id:n})=>n)}async function qi({projectId:e,fetchMessagesForEdits:t,fetchEditsForMessages:n}){const r=qe(),a=At(),i=Te.MESSAGES_PAGE_SIZE,s=Te.PREFETCH_STALE_TIME_MS,[d,h,p]=await Promise.all([a.ensureQueryData({queryKey:Le.messages(e,{limit:i}),queryFn:()=>r.get(`/projects/${e}/messages?limit=${i}`),staleTime:s}),a.ensureQueryData({queryKey:Le.edits(e,{limit:Te.EDIT_PAGE_SIZE}),queryFn:()=>r.get(`/projects/${e}/edits?limit=${Te.EDIT_PAGE_SIZE}`),staleTime:s}),a.ensureQueryData({queryKey:Le.edits(e,{bookmarked:!0}),queryFn:()=>r.get(`/projects/${e}/edits?bookmarked=true`),staleTime:s})]),w={},l=[];for(const u of d?.events??[]){const x=Rt(u,{persisted:!0});if(x&&typeof u.id=="string"){const T=u.id;w[T]=x,l.push(T)}}const c={};for(const u of h?.edits??[]){const x=xt(u);x&&(c[x.id]=x)}const f={};for(const u of p?.edits??[]){const x=xt(u);x&&(f[x.id]=x)}const b=Object.keys(f),v=new Set([...Object.keys(c),...Object.keys(f)]),S=Object.values(w).map(u=>u.type==="aiMessage"?u.editId:void 0).filter(u=>!!u&&!v.has(u)),[z,H]=await Promise.all([b.length>0?t(b):Promise.resolve({}),S.length>0?n(S):Promise.resolve({})]);return{parsedMessages:w,messageIds:l,recentEdits:c,bookmarkedEdits:f,bookmarkedMessages:z,messageReferencedEdits:H}}function Ri({storeRef:e,fetchMessagesForEdits:t,fetchEditsForMessages:n,currentConversationIdRef:r,projectId:a}){return{loadInitialData:(0,E.useCallback)(async i=>{performance.mark("chat:initial-data:fetch-start");try{const s=await qi({projectId:a,fetchMessagesForEdits:t,fetchEditsForMessages:n});if(performance.mark("chat:initial-data:fetch-end"),i?.()||r?.current!==null&&r?.current!==void 0||(e.current.setState(d=>{const h={...d.messages};for(const[b,v]of Object.entries({...s.parsedMessages,...s.bookmarkedMessages}))d.messages[b]?.createdAt?h[b]={...v,createdAt:d.messages[b].createdAt}:h[b]=v;let p=[...new Set([...d.sortedMessageIds,...s.messageIds])].filter(b=>h[b]!=null);p=Oi(p,h);const w=d.streamingUIMessage?.id;w&&!p.includes(w)&&(p=[...p,w]);const l={...d.edits,...s.messageReferencedEdits,...s.recentEdits,...s.bookmarkedEdits},c={...d.pendingMessageFieldUpdates};for(const[b,v]of Object.entries(h)){const S=c[b];S&&v.type==="aiMessage"&&(h[b]=Ai(v,S),delete c[b])}const f={...d.pendingEditUpdates};for(const[b,v]of Object.entries(l)){const S=f[b];S&&(l[b]=Ti(v,S),delete f[b])}return{messages:h,edits:l,sortedMessageIds:p,isInitialized:!0,pendingMessageFieldUpdates:c,pendingEditUpdates:f}}),i?.()))return;performance.mark("chat:initial-data:store-updated"),dr("editor:chat:nav-to-initial-data","chat:initial-data:store-updated"),st("editor:chat:fetch-to-data","chat:initial-data:fetch-start","chat:initial-data:store-updated"),st("editor:chat:fetch-to-response","chat:initial-data:fetch-start","chat:initial-data:fetch-end"),st("editor:chat:response-to-data","chat:initial-data:fetch-end","chat:initial-data:store-updated")}catch(s){if(console.warn("API error - loadInitialData",{error:s}),r?.current!==null&&r?.current!==void 0)return;e.current.setState({isInitialized:!0})}},[a,e,r,t,n])}}function Fi({array:e,batchSize:t}){return Array.from({length:Math.ceil(e.length/t)},(n,r)=>e.slice(r*t,(r+1)*t))}function Li({projectId:e}){return{fetchEditsForMessages:(0,E.useCallback)(async t=>{if(t.length===0)return{};const n=qe(),r=At(),a=Fi({array:[...t].sort(),batchSize:Te.API_BATCH_SIZE}),i=await Promise.all(a.map(d=>r.fetchQuery({queryKey:Le.edits(e,{ids:d}),queryFn:()=>n.get(`/projects/${e}/edits?ids=${d.map(encodeURIComponent).join(",")}`),staleTime:0}))),s={};for(const d of i)for(const h of d?.edits??[]){const p=xt(h);p&&(s[p.id]=p)}return s},[e])}}function Di({storeRef:e}){return{updateMessage:(0,E.useCallback)((t,n,r)=>{if(!e.current.getState().isInitialized)return;const a=e.current.getState().messages[t];a&&r&&!(a.content!==n.content||n.role==="ai"&&a.role==="ai"&&(a.thinkingTimeMs!==n.thinkingTimeMs||a.timeToFirstTokenMs!==n.timeToFirstTokenMs||a.activityDescription!==n.activityDescription))||e.current.setState(En(i=>{const s=a&&r?{...a,content:n.content}:n;n.role==="ai"&&s.role==="ai"&&r&&(n.thinkingTimeMs!==void 0&&(s.thinkingTimeMs=n.thinkingTimeMs),n.timeToFirstTokenMs!==void 0&&(s.timeToFirstTokenMs=n.timeToFirstTokenMs),n.activityDescription!==void 0&&(s.activityDescription=n.activityDescription)),i.messages[t]=s,r&&(i.sortedMessageIds=i.sortedMessageIds.filter(d=>d!==t),i.sortedMessageIds.push(t))}))},[e])}}function Ni({storeRef:e}){return{setLatestStreamedMessage:(0,E.useCallback)(t=>{e.current.getState().setStreamingMessage(t)},[e])}}var ce=Dr(),Ft=(0,E.createContext)(null);Ft.displayName="ChatContext";var Lt=(0,E.createContext)(null);Lt.displayName="ChatStoreContext";var Ui=e=>{const t=(0,E.useRef)(new Date),n=(0,E.useCallback)(()=>{const r=e.current.getState();return{messageCount:Object.keys(r.messages).length,editCount:Object.keys(r.edits).length,memoryUsage:new Blob([JSON.stringify(r)]).size,lastUpdate:t.current}},[e]);return(0,E.useMemo)(()=>({getPerformanceMetrics:n,updateLastUpdate:()=>{t.current=new Date}}),[n])},Q0=({projectId:e,children:t})=>{const n=tt("conversation"),[r]=(0,E.useState)(()=>Pi()),a=(0,E.useRef)(r),i=(0,E.useRef)(n);i.current=n;const s=(0,E.useRef)(n);if(s.current!==n){const u=s.current==="new"&&n!==null&&n!=="new";s.current=n,u||a.current.setState({messages:{},edits:{},sortedMessageIds:[],latestStreamedMessage:void 0,streamingUIMessage:void 0,isInitialized:!1})}const d=Ui(a);Ei({storeRef:a,projectId:e});const{updateMessage:h}=Di({storeRef:a}),{fetchEditsForMessages:p}=Li({projectId:e}),{fetchMessagesForEdits:w}=Ii({projectId:e}),l=(0,E.useCallback)(u=>{try{if(a.current.getState().isInitialized===u)return;a.current.setState(En(x=>{x.isInitialized=u})),d.updateLastUpdate()}catch(x){console.error("Failed to set initialization state:",x)}},[a,d]),{loadInitialData:c}=Ri({storeRef:a,fetchMessagesForEdits:w,fetchEditsForMessages:p,currentConversationIdRef:i,projectId:e}),{setLatestStreamedMessage:f}=Ni({storeRef:a}),{permissions:b,isResolved:v}=xn(),S=v&&b.includes(Oe.ViewProject),z=v&&b.includes(Oe.EditProject);(0,E.useEffect)(()=>{if(!(S&&z&&!n))return;let u=!1;return c(()=>u),()=>{u=!0}},[c,S,z,n]),(0,E.useEffect)(()=>{},[d]);const H=(0,E.useMemo)(()=>({store:a.current,updateMessage:h,setIsInitialized:l,setLatestStreamedMessage:f}),[h,l,f]);return(0,ce.jsx)(Lt.Provider,{value:a.current,children:(0,ce.jsx)(Ft.Provider,{value:H,children:t})})};function ji(){const e=(0,E.useContext)(Ft);if(!e)throw new Error("useChatContextLegacy must be used within a ChatProviderLegacy");return e}function $i(){const e=(0,E.use)(Lt);if(!e)throw new Error("useChatStoreLegacy must be used within a ChatProviderLegacy");return e}function K0(e){return $i()(e)}var Hi={seo_opportunities:"",marketing_search:"search",marketing_social:"social",marketing_referral:"referral",marketing_attribution:"attribution",marketing_announcement:"announcement",marketing_wait_tip:ao};function Bi(e,t){const n=e?Hi[e]:void 0;if(n!==void 0)return{case:"seoOpportunities",value:Q(Wa,{channel:n})};if(t?.seo_fix_metadata)return{case:"seoFix",value:Q(Xa,{auditKey:t.seo_fix_metadata.audit_key,auditTitle:t.seo_fix_metadata.audit_title,description:t.seo_fix_metadata.description??""})};if(t?.seo_fix_v2_metadata)return{case:"seoFixV2",value:Q(Ga,{findingId:t.seo_fix_v2_metadata.finding_id??"",name:t.seo_fix_v2_metadata.name,description:t.seo_fix_v2_metadata.description??"",isFixAll:t.seo_fix_v2_metadata.is_fix_all??!1})};if(t?.seo_site_appearance_metadata)return{case:"seoSiteAppearance",value:Q(Na,{target:t.seo_site_appearance_metadata.target})};if(t?.health_check_finding_fix_metadata)return{case:"qaFindingFix",value:Q(Vt,{title:t.health_check_finding_fix_metadata.title})};if(t?.finding_fix_metadata)return{case:"qaFindingFix",value:Q(Vt,{title:t.finding_fix_metadata.title})};if(t?.fix_error_metadata)return{case:"fixError",value:Q(Ma,{errors:t.fix_error_metadata.errors.map(a=>"build_event_id"in a?Q(Gt,{detail:{case:"build",value:Q(ma,{errorMessage:a.error_message,buildEventId:a.build_event_id})}}):Q(Gt,{detail:{case:"generic",value:Q(pa,{errorType:a.error_type,errorMessage:a.error_message,errorId:a.error_id??""})}}))})};if(e==="security_review")return{case:"securityReview",value:Q(wa,{})};if(e==="security_scan")return{case:"securityScan",value:Q(ia,{})};if(e==="security_fix_v2")return{case:"securityFixV2",value:Q(Ta,{selectedFindingIds:t?.security_fix_v2_metadata?.selected_finding_ids??[],selectedIssueCount:t?.security_fix_v2_metadata?.selected_issue_count??0})};if(e==="security_fix_dependency")return{case:"securityFixDependency",value:Q(Ca,{name:t?.security_fix_dependency_metadata?.name??""})};if(e==="security_chat")return{case:"securityChat",value:Q(Ia,{})};if(e==="enable_cloud")return{case:"enableCloud",value:Q(ca,{})};const r=t?.question_answer_metadata;if(e==="question_answer"&&r)return{case:"questionAnswer",value:Q(fa,{toolCall:Q(ua,{value:r.tool_call_event_id}),options:r.options??[],ownWords:r.own_words??""})};if(e==="visual_edit"||t?.visual_edit_metadata){const a=t?.visual_edit_metadata;return{case:"visualEdit",value:Q(La,{textReplacements:(a?.text_replacements??[]).map(i=>Q(Fa,{oldText:i.old_text,newText:i.new_text,textNodeIndex:i.text_node_index,selectedElementIndex:i.selected_element_index})),imageReplacements:(a?.image_replacements??[]).map(i=>Q(Ba,{imageKind:i.image_kind,oldUrl:i.old_url,newUrl:i.new_url,attachedFileName:i.attached_file_name,selectedElementIndex:i.selected_element_index})),classNameEdits:(a?.class_name_edits??[]).map(i=>Q(Ra,{property:i.property,oldValue:i.old_value??void 0,newValue:i.new_value??void 0,oldClassName:i.old_class_name,newClassName:i.new_class_name,selectedElementIndex:i.selected_element_index})),attributeEdits:(a?.attribute_edits??[]).map(i=>Q(qa,{attribute:i.attribute,oldValue:i.old_value,newValue:i.new_value,selectedElementIndex:i.selected_element_index})),elementDeletions:(a?.element_deletions??[]).map(i=>Q(Qa,{selectedElementIndex:i.selected_element_index}))})}}return t?.comment_feedback_metadata?{case:"commentFeedback",value:Q(ba,{page:t.comment_feedback_metadata.page,annotations:t.comment_feedback_metadata.annotations.map(a=>Q(Ua,{annotationId:a.annotation_id,selector:a.selector,filePath:a.file_path,lineNumber:a.line_number,columnNumber:a.column_number,comments:a.comments.map(i=>Q(xa,{text:i.text,commentId:i.comment_id})),screenshotUrl:a.screenshot_url??""}))})}:{case:"userChat",value:Q(Ya,{})}}function W0(e){return e.flatMap(t=>{if(!t.fileId||!t.dirName)return[];const n=`${t.dirName}/`,r=t.fileId.startsWith(n)?t.fileId:n+t.fileId;return[{id:r,url:"",name:t.fileName,uploading:!1,uploaded:!0,existingFileId:r,existingDirName:t.dirName}]})}function Dn(e,t,n,r=[],a=[],i,s,d=[],h=!1,p="",w=!1,l=!1){const c=d.flatMap(f=>{if(!f.existingFileId||!f.existingDirName)return[];const b=`${f.existingDirName}/`,v=f.existingFileId.startsWith(b)?f.existingFileId.slice(b.length):f.existingFileId;return[Q(za,{dirName:f.existingDirName,fileId:v,fileName:f.name,type:Ha.USER_UPLOAD})]});return Q(ya,{timestamp:oa(new Date),payload:{event:{case:"userMessage",value:Q(Ja,{content:e,messageMode:t,readOnlyChat:l,maxMode:h,maxModeSlashCommand:h&&!!w,intent:Bi(i,s),userId:n,selectedElements:r,selectedCanvasShapes:a,files:c,legacyFirestoreId:p})}}})}var Gi={emit:async()=>!1};function Vi(e){return{interjectMessage:async()=>{},deleteMessages:async()=>{},reorderQueue:async()=>{},setPaused:(t,n)=>n.onSuccess(),startEditing:async({messageId:t})=>({message:{chat_request:{message:e()?.getState().queue.find(n=>n.message_id===t)?.message_preview??""}}}),stopEditing:async()=>{},updateMessages:async({messageIds:t,message:n})=>{e()?.setState(r=>({queue:r.queue.map(a=>t.includes(a.message_id)?{...a,message_preview:n}:a)}))},repeatMessages:(t,n)=>n.onSuccess()}}function Qi({projectId:e}){return be({mutationFn:async({messageIds:t,scope:n})=>{if(!e)throw new Error("Project ID is required to delete messages");await Se().POST("/projects/{project_id}/chat/queue/delete-messages",{params:{path:{project_id:e}},body:{message_ids:t,scope:n}})}})}function Ki({projectId:e}){return be({mutationFn:async({messageId:t,scope:n})=>{if(!e)throw new Error("Project ID is required to interject a message");await qe().post(`/projects/${e}/chat/queue/interject`,{message_id:t,scope:n})}})}function Wi({projectId:e}){return be({mutationFn:async({messageId:t,scope:n})=>{if(!e)throw new Error("Project ID is required to start editing");return await qe().post(`/projects/${e}/chat/queue/start-editing`,{message_id:t,scope:n})}})}function Yi({projectId:e}){return be({mutationFn:async({messageId:t,scope:n})=>{if(!e)throw new Error("Project ID is required to stop editing");await Se().POST("/projects/{project_id}/chat/queue/stop-editing",{params:{path:{project_id:e}},body:{message_id:t,scope:n}})}})}function Xi({projectId:e}){return be({mutationFn:async({messageIds:t,message:n,scope:r})=>{if(!e)throw new Error("Project ID is required to update messages");await Se().POST("/projects/{project_id}/chat/queue/update-messages",{params:{path:{project_id:e}},body:{message_ids:t,message:n,scope:r}})}})}function Ji({projectId:e}){return be({mutationFn:async({afterMessageId:t,content:n,count:r,isChatOnly:a,scope:i})=>{if(!e)throw new Error("Project ID is required to repeat messages");return{message_ids:(await Se().POST("/projects/{project_id}/chat/queue/repeat",{params:{path:{project_id:e}},body:{after_message_id:t,content:n,count:r,is_chat_only:a,scope:i}})).message_ids??[]}}})}var Zi=3e4;function es({projectId:e,queueScope:t,store:n,enabled:r,onProcessingStarted:a,userDeletedMessageIdsRef:i}){const s=Ue(),d=(0,E.useEffectEvent)(()=>a);(0,E.useEffect)(()=>{if(!e||!r)return;let h=null,p=!1,w=!1;const l=x=>!x.isAgentResponding&&(x.hasQueuedItems&&!x.isPaused||x.hasSettledUnackedGhosts),c=x=>JSON.stringify({isAgentResponding:x.isAgentResponding,isPaused:x.isPaused,queue:x.queue}),f=x=>{const T=ts(x);n.getState()._applyStreamedState(T.queue,T.is_paused,d(),i?.current,T.scope,T.pause_reason)},b=()=>s.fetchQuery(kr({projectId:e,scope:t})),v=async()=>{try{const x=await b();w||f(x)}catch(x){console.warn("Failed to load queue state",{error:x,projectId:e,queueScope:t})}},S=()=>{h&&(clearTimeout(h),h=null)},z=async()=>{const x=n.getState();if(!l(x))return;const T=c(x);p=!0;try{const o=await b();if(w)return;const y=n.getState();if(!l(y)||c(y)!==T)return;f(o)}catch(o){console.warn("Failed to recover stale queue state",{error:o,projectId:e})}finally{p=!1,!w&&l(n.getState())&&H()}},H=()=>{h||p||(h=setTimeout(()=>{h=null,z()},Zi))},u=n.subscribe(x=>{l(x)?H():S()});return v(),()=>{w=!0,u(),S()}},[e,t,r,s,n,i])}function ts(e){return{scope:e.scope,queue:e.queue.map(t=>({...t,editing_by:t.editing_by??null,intent:t.intent,message_intent_metadata:t.message_intent_metadata,selected_elements:t.selected_elements??void 0,files:t.files??void 0})),is_paused:e.is_paused,pause_reason:e.pause_reason}}function ns({projectId:e}){return be({mutationFn:async({messageIds:t,scope:n})=>{if(!e)throw new Error("Project ID is required to reorder queue");await Se().POST("/projects/{project_id}/chat/queue/reorder",{params:{path:{project_id:e}},body:{message_ids:t,scope:n}})}})}function rs({projectId:e}){const t=xr(),n=qr(),r=rt();return be({mutationFn:async({isPaused:a,scope:i})=>{if(!e)throw new Error("Project ID is required to set the pause state of the queue");await qe().post(`/projects/${e}/chat/queue/pause`,{is_paused:a,scope:i})},onError:a=>{if(a instanceof ke){if(a.type==="credit_limit_reached"){n(br(a));return}a.status===402&&(r.emit(Ka,{}),t())}}})}function as({projectId:e,store:t,onProcessingStarted:n,userDeletedMessageIdsRef:r}){const a=In(),i=(0,E.useEffectEvent)(s=>{e&&t.getState()._applyStreamedState(s.queue,s.is_paused,n,r?.current,s.scope,s.pause_reason)});(0,E.useEffect)(()=>{if(!e)return;const s=a.subscribe("queueState",i);return()=>{s()}},[e,a])}function os(e){return e==="hitl_tool"||e==="server_error"||e==="region_capacity"}function Y0(e){return e==="user_hold"||e==="user"}function is(e,t){return t.map((n,r)=>{const a=e[n];return{message_id:a.message_id,scope:a.scope,position:r+1,message_preview:a.message_preview,file_count:a.file_count,files:a.files,user_id:a.user_id,is_chat_only:a.is_chat_only,editing_by:a.editing_by}})}function pe(e,t){const n=!!(e&&!t._isInConversation&&(t._showStopAction||t.isStopPending)),r=!!(e&&!t._isInConversation&&t._hasPendingSend),a=t.isPaused&&t.hasQueuedItems&&(t._autoInterjections||t._interjectionMode==="manual"&&!os(t.pauseReason));return{isAgentResponding:n,shouldUseQueueFlow:!!(n||r||!t._isInConversation&&t.hasQueuedItems&&!t.isPaused||!t._isInConversation&&a)}}function Xt(e,t,n){const r={...t,...n},a=is(r.queuedMessages,r.sortedMessageIds),i=a.length>0,{isAgentResponding:s,shouldUseQueueFlow:d}=pe(e,{...r,hasQueuedItems:i});return{...n,queue:a,hasQueuedItems:i,isLoading:!r.isInitialized,isAgentResponding:s,shouldUseQueueFlow:d}}function dt(e,t,n){const{isAgentResponding:r,shouldUseQueueFlow:a}=pe(e,{...t,...n});return{...n,isAgentResponding:r,shouldUseQueueFlow:a}}function ss(e,t,n){const{isAgentResponding:r,shouldUseQueueFlow:a}=pe(e,{...t,_isInConversation:n.isInConversation,_showStopAction:n.showStopAction,isStopPending:n.isStopPending,_canSendMessages:n.canSendMessages});return{_isInConversation:n.isInConversation,_showStopAction:n.showStopAction,isStopPending:n.isStopPending,_canSendMessages:n.canSendMessages,isAgentResponding:r,shouldUseQueueFlow:a}}function ls(e){function t(h){return n()._canSendMessages?e:(oe.error(h==="queue messages"?Nr():Hr()),null)}let n,r=new Map,a=e.getQueueScope(),i=[];const s=new Map;function d(h){return h.map(p=>({file_id:p.id,file_name:p.name,mime_type:p.mimeType,is_image:ha({name:p.name,mimeType:p.mimeType}),direct_url:p.url}))}return bn()((h,p)=>{n=p;const w=h;let l=Promise.resolve();const c=new Set,f=new Map,b=new Set,v=new Set,S=new Set,z=new Set;function H(o){return o.some(y=>c.has(y.message_id)&&z.has(y.message_id))}function u(o){const y=s.get(o.message_id);return e.solidifyInterjectedMessage({userMessageId:o.message_id,aiMessageId:o.ai_message_id??"",content:o.message_preview,userId:o.user_id,selectedElements:y?.selectedElements??o.selected_elements??[],selectedCanvasShapes:y?.selectedCanvasShapes??o.selected_canvas_shapes??[],isChatOnly:o.is_chat_only,createdAt:o.created_at?new Date(o.created_at):new Date,images:[],optimisticImageUrls:y?.optimisticImageUrls,intent:y?.intent??o.intent??void 0,messageIntentMetadata:y?.messageIntentMetadata??o.message_intent_metadata??void 0,maxModeSlashCommand:y?.maxModeSlashCommand})}function x(o,y,_,M,I){const O=n(),G={message_id:o,scope:e.getQueueScope(),position:O.queue.length+1,message_preview:y,file_count:_,files:I,user_id:"",is_chat_only:M,editing_by:null,intent:s.get(o)?.intent,message_intent_metadata:s.get(o)?.messageIntentMetadata},R=[...O.queue,G],g=!0,{isAgentResponding:k,shouldUseQueueFlow:A}=pe(e.projectId,{...O,hasQueuedItems:g});w({queue:R,hasQueuedItems:g,isInitialized:!0,isLoading:!1,isAgentResponding:k,shouldUseQueueFlow:A})}function T(o){const y=n(),_=y.queue.filter(G=>G.message_id!==o);if(_.length===y.queue.length)return;const M=_.length>0,{isAgentResponding:I,shouldUseQueueFlow:O}=pe(e.projectId,{...y,hasQueuedItems:M});w({queue:_,hasQueuedItems:M,isAgentResponding:I,shouldUseQueueFlow:O})}return{queuedMessages:{},sortedMessageIds:[],isPaused:!1,pauseReason:void 0,isInitialized:!1,queue:[],hasQueuedItems:!1,isLoading:!0,shouldUseQueueFlow:!1,isAgentResponding:!1,isQueueingMessage:!1,isStopPending:!1,_isInConversation:!1,_showStopAction:!1,failedGhostIds:[],hasSettledUnackedGhosts:!1,_canSendMessages:!1,_autoInterjections:!1,_interjectionMode:"off",_hasPendingSend:!1,_confirmedPauseState:!1,insertGhost:(o,y)=>{if(n().queue.some(I=>I.message_id===o.id))return;const _=o.selectedCanvasShapes??[],M=d(o.images);(o.images.length>0||o.selectedElements.length>0||_.length>0||o.intent||o.messageIntentMetadata||o.maxModeSlashCommand)&&s.set(o.id,{selectedElements:o.selectedElements,selectedCanvasShapes:_,optimisticImageUrls:o.images.map(I=>I.url),optimisticFiles:M.length>0?M:void 0,intent:o.intent,messageIntentMetadata:o.messageIntentMetadata,maxModeSlashCommand:o.maxModeSlashCommand}),x(o.id,o.message,o.images.length,o.chatMode===Z.PLAN,M.length>0?M:void 0),c.add(o.id),f.set(o.id,y)},failGhost:o=>{w(y=>({failedGhostIds:[...y.failedGhostIds,o]}))},markGhostEnqueued:o=>{c.has(o)&&(z.add(o),w({hasSettledUnackedGhosts:H(n().queue)}))},runInSendOrder:(o,y)=>{S.add(o),w({isQueueingMessage:!0});const _=l.then(y,y).finally(()=>{S.delete(o),w({isQueueingMessage:S.size>0})});return l=_,_},interjectQueuedMessage:async o=>{if(!t("manage the queue"))return!1;const{projectId:y}=e;if(!y)return!1;const _=n().queue.find(M=>M.message_id===o);if(!_||c.has(o)||_.interjected||v.has(o))return!1;v.add(o);try{await e.interjectMessage({messageId:o,scope:e.getQueueScope()})}catch(M){return oe.error(Jr()),console.error("Failed to interject queued message",{error:M,projectId:y,messageId:o}),!1}finally{v.delete(o)}return b.add(o),u(_),n().dismissGhost(_.message_id),e.events.emit(Ae,{projectId:y,queueMessageAction:"interjected",queueLength:n().queue.length,triggerElement:"button_clicked",triggerLocation:"chat_queue_item"}),!0},isUnackedGhost:o=>c.has(o),isSendInFlight:o=>S.has(o),removeFromQueue:o=>{if(!t("manage the queue"))return;const{projectId:y}=e,_=o.filter(R=>!c.has(R));if(!y||_.length===0)return;e.trackUserDeletedMessageIds(_);const M=new Set(_),I=n().queue.filter(R=>M.has(R.message_id)),O=Object.fromEntries(Object.entries(n().queuedMessages).filter(([R])=>M.has(R))),G=n().sortedMessageIds.filter(R=>M.has(R));w(R=>{const g=R.queue.filter(q=>!M.has(q.message_id)),k={...R,queue:g,hasQueuedItems:g.length>0},{isAgentResponding:A,shouldUseQueueFlow:P}=pe(e.projectId,k);return{queue:g,queuedMessages:Object.fromEntries(Object.entries(R.queuedMessages).filter(([q])=>!M.has(q))),sortedMessageIds:R.sortedMessageIds.filter(q=>!M.has(q)),hasQueuedItems:g.length>0,isAgentResponding:A,shouldUseQueueFlow:P}}),e.deleteMessages(_).then(()=>{for(const R of _)s.delete(R);e.events.emit(Ae,{projectId:y,queueMessageAction:"deleted",queueLength:n().queue.length,triggerElement:"button_clicked",triggerLocation:"chat_queue_item"})}).catch(R=>{e.untrackUserDeletedMessageIds(_),w(g=>{const k=new Set(g.queue.map(F=>F.message_id)),A=[...g.queue,...I.filter(F=>!k.has(F.message_id))],P={...O,...g.queuedMessages},q=[...g.sortedMessageIds,...G.filter(F=>!g.sortedMessageIds.includes(F))],j={...g,queue:A,queuedMessages:P,sortedMessageIds:q,hasQueuedItems:A.length>0},{isAgentResponding:D,shouldUseQueueFlow:W}=pe(e.projectId,j);return{queue:A,queuedMessages:P,sortedMessageIds:q,hasQueuedItems:j.hasQueuedItems,isAgentResponding:D,shouldUseQueueFlow:W}}),oe.error(Qr({count:_.length})),console.error("Failed to delete queued message(s)",{error:R,projectId:y,messageIds:_})})},reorderQueue:(o,y)=>{if(!t("manage the queue"))return;const{projectId:_}=e;if(!_)return;const M=new Set(i),I=G=>c.has(G)&&!z.has(G),O=[...i,...o.map(G=>G.message_id).filter(G=>!M.has(G)&&!I(G))];if(O.length===0){y?.();return}e.reorderQueue(O).then(()=>{e.events.emit(Ae,{projectId:_,queueMessageAction:"reordered",queueLength:o.length,triggerElement:"drag_dropped",triggerLocation:"chat_queue_list"})}).catch(G=>{oe.error(Ur()),console.error("Failed to reorder queue",{error:G,projectId:_,messageIds:O}),y?.()})},startEditingMessage:async o=>{if(!t("manage the queue"))return{success:!1,error:"permission_denied"};const{projectId:y}=e;if(!y)return{success:!1,error:"no_project"};try{return{success:!0,messageContent:(await e.startEditing({messageId:o})).message.chat_request?.message??""}}catch(_){if(_ instanceof ke){if(_.status===409)return oe.error(Kr()),{success:!1,error:"conflict"};if(_.status===404)return oe.error(Bt()),{success:!1,error:"not_found"}}return oe.error(Wr()),console.error("Failed to start editing queued message",{error:_,projectId:y,messageId:o}),{success:!1,error:"unknown"}}},stopEditingMessage:async(o,y)=>{const{projectId:_}=e;if(_)try{await e.stopEditing({messageId:o,scope:y})}catch(M){console.error("Failed to stop editing queued message",{error:M,projectId:_,messageId:o})}},getActiveQueueScope:()=>e.getQueueScope(),updateQueueMessages:async(o,y)=>{if(!t("manage the queue"))throw new Error("Permission denied");const{projectId:_}=e;if(!_||o.length===0)throw new Error("Project ID and at least one message ID are required");try{await e.updateMessages({messageIds:o,message:y}),e.events.emit(Ae,{projectId:_,queueMessageAction:"edited",queueLength:n().queue.length,triggerElement:"button_clicked",triggerLocation:"chat_queue_item"})}catch(M){if(M instanceof ke){if(M.status===409)throw oe.error(Vr()),M;if(M.status===404)throw oe.error(Bt()),M}throw oe.error($r()),console.error("Failed to update queued message(s)",{error:M,projectId:_,messageIds:o}),M}},repeatMessages:(o,y,_,M)=>{if(!t("manage the queue"))return;const{projectId:I}=e;I&&e.repeatMessages({afterMessageId:o,content:y,count:_,isChatOnly:M},{onSuccess:()=>{e.events.emit(Ae,{projectId:I,queueMessageAction:"repeated",queueLength:n().queue.length+_,repeatCount:_,triggerElement:"button_clicked",triggerLocation:"chat_queue_item"})},onError:O=>{oe.error(Br()),console.error("Failed to repeat queued message",{error:O,projectId:I,afterMessageId:o,count:_})}})},resumeQueue:()=>{n().isPaused&&n().togglePause()},togglePause:()=>{if(!t("manage the queue"))return;const{projectId:o}=e;if(!o)return;const{isPaused:y,queue:_}=n(),M=!y;w(I=>dt(e.projectId,I,M?{isPaused:!0,pauseReason:"user_hold"}:{isPaused:!1})),e.setPaused({isPaused:M},{onSuccess:()=>{w({_confirmedPauseState:M}),e.events.emit($a,{projectId:o,queueAction:M?"paused":"resumed",queueLength:_.length,triggerElement:"button_clicked",triggerLocation:"chat_queue_controls"})},onError:I=>{w(O=>dt(e.projectId,O,{isPaused:n()._confirmedPauseState})),!(I instanceof ke&&(I.type==="credit_limit_reached"||I.status===402))&&oe.error(M?Gr():jr())}})},_applyQueueUpdate:o=>{w(y=>Xt(e.projectId,y,o))},_applyPauseUpdate:o=>{w(y=>dt(e.projectId,y,o))},_applyStreamedState:(o,y,_,M,I,O)=>{const G=e.getQueueScope();if((I??"main")!==G)return;a!==G&&(r=new Map,a=G,i=[]);const R=n(),g=R.isPaused!==R._confirmedPauseState;g&&(y=R.isPaused);const k=new Set(o.map(m=>m.message_id));M&&M.size>0&&(o=o.filter(m=>!M.has(m.message_id))),o=o.map(m=>{if(m.files&&m.files.length>0)return m;const N=s.get(m.message_id);return N?.optimisticFiles?.length?{...m,files:N.optimisticFiles}:m}),o=o.map(m=>b.has(m.message_id)?m.interjected?(b.delete(m.message_id),m):{...m,interjected:!0}:m),i=o.filter(m=>m.seed_delivered).map(m=>m.message_id);const A=new Set(i);o=o.filter(m=>!A.has(m.message_id));for(const m of A)s.delete(m);if(r.size>0){const m=new Set(o.map(V=>V.message_id)),N=[];for(const[V,Y]of r)if(!m.has(V)){if(M?.has(V)||A.has(V))continue;N.push(Y)}if(_&&N.length===1){const V=N[0];if(V.ai_message_id){const Y=s.get(V.message_id);_({userMessageId:V.message_id,aiMessageId:V.ai_message_id,content:V.message_preview,userId:V.user_id,selectedElements:Y?.selectedElements??V.selected_elements??[],selectedCanvasShapes:Y?.selectedCanvasShapes??V.selected_canvas_shapes??[],isChatOnly:V.is_chat_only,createdAt:V.created_at?new Date(V.created_at):new Date,images:[],optimisticImageUrls:Y?.optimisticImageUrls,intent:Y?.intent??V.intent??void 0,messageIntentMetadata:Y?.messageIntentMetadata??V.message_intent_metadata??void 0,maxModeSlashCommand:Y?.maxModeSlashCommand})}}for(const V of N)s.delete(V.message_id)}if(M)for(const m of M)k.has(m)||M.delete(m);for(const m of b)k.has(m)||b.delete(m);r=new Map(o.map(m=>[m.message_id,m]));const P=new Set(o.map(m=>m.message_id));for(const m of A)P.add(m);for(const m of P)c.has(m)&&(c.delete(m),f.delete(m),z.delete(m));for(const m of R.queue){const N=m.message_id;!c.has(N)||!z.has(N)||(c.delete(N),f.delete(N),z.delete(N))}o=[...o,...R.queue.filter(m=>c.has(m.message_id))],o.length===0&&R.queue.length===0&&(o=R.queue);const q=R.failedGhostIds.some(m=>P.has(m))?R.failedGhostIds.filter(m=>!P.has(m)):R.failedGhostIds,j=o.length>0,D=g?R.pauseReason:O,{isAgentResponding:W,shouldUseQueueFlow:F}=pe(e.projectId,{...R,hasQueuedItems:j,isPaused:y,pauseReason:D});w({queue:o,isPaused:y,hasQueuedItems:j,isInitialized:!0,isLoading:!1,failedGhostIds:q,hasSettledUnackedGhosts:H(o),isAgentResponding:W,shouldUseQueueFlow:F,pauseReason:D,_confirmedPauseState:g?R._confirmedPauseState:y})},_applyRuntimeUpdate:o=>{w(y=>ss(e.projectId,y,o))},retryGhost:o=>{if(!t("queue messages")||S.has(o))return;const y=f.get(o);y&&(w(_=>({failedGhostIds:_.failedGhostIds.filter(M=>M!==o)})),y().catch(()=>{}))},dismissGhost:o=>{T(o),s.delete(o),c.delete(o),f.delete(o),z.delete(o),w(y=>({failedGhostIds:y.failedGhostIds.filter(_=>_!==o),hasSettledUnackedGhosts:H(y.queue)}))},_setInterjectionMode:o=>{w(y=>{if(y._interjectionMode===o)return{};const _=o==="auto",M={...y,_interjectionMode:o,_autoInterjections:_},{isAgentResponding:I,shouldUseQueueFlow:O}=pe(e.projectId,M);return{_interjectionMode:o,_autoInterjections:_,isAgentResponding:I,shouldUseQueueFlow:O}})},_setHasPendingSend:o=>{w(y=>{if(y._hasPendingSend===o)return{};const _={...y,_hasPendingSend:o},{isAgentResponding:M,shouldUseQueueFlow:I}=pe(e.projectId,_);return{_hasPendingSend:o,isAgentResponding:M,shouldUseQueueFlow:I}})},_resetForScopeChange:()=>{r=new Map,a=e.getQueueScope(),i=[],c.clear(),f.clear(),z.clear(),b.clear(),S.clear(),l=Promise.resolve(),w(o=>({...Xt(e.projectId,o,{queuedMessages:{},sortedMessageIds:[],isPaused:!1,isInitialized:!1}),pauseReason:void 0,_confirmedPauseState:!1,failedGhostIds:[],hasSettledUnackedGhosts:!1,isQueueingMessage:!1}))}}})}function cs(e){return e||"main"}var X0=({projectId:e,threadIdOverride:t,stopController:n,createOptimisticAIMessage:r,children:a})=>{const i=rt(),s=tt("conversation"),d=Tt(),h=t??d,p=t!==void 0,w=cs(h),l=!1,{updateMessage:c,store:f}=ji(),{permitted:b}=Mt(Oe.EditProject),v=p||b,{stopAsync:S,isStopPending:z,showStopAction:H}=n,u=(0,E.useRef)(new Set),x=(0,E.useRef)(w),T=(0,E.useRef)(h??"main"),o=_e(C=>C.viewTier==="full"),y=Qi({projectId:e}),_=ns({projectId:e}),M=rs({projectId:e}),I=Wi({projectId:e}),O=Yi({projectId:e}),G=Xi({projectId:e}),R=Ji({projectId:e}),g=(0,E.useCallback)(C=>C.forEach($=>u.current.add($)),[]),k=(0,E.useCallback)(C=>C.forEach($=>u.current.delete($)),[]),A=mo(C=>C.optimisticControls),P=Ki({projectId:e}),[q]=(0,E.useState)(()=>yi()),j=(0,E.useRef)(null),[D]=(0,E.useState)(()=>ls({events:p?Gi:i,projectId:e,getQueueScope:()=>x.current,solidifyInterjectedMessage:C=>Y.current(C),trackUserDeletedMessageIds:g,untrackUserDeletedMessageIds:k,...p?Vi(()=>j.current):{interjectMessage:C=>P.mutateAsync(C),deleteMessages:C=>y.mutateAsync({messageIds:C,scope:x.current}),reorderQueue:C=>_.mutateAsync({messageIds:C,scope:x.current}),setPaused:(C,$)=>M.mutate({...C,scope:x.current},$),startEditing:C=>I.mutateAsync({...C,scope:x.current}),stopEditing:C=>O.mutateAsync({...C,scope:C.scope??x.current}),updateMessages:C=>G.mutateAsync({...C,scope:x.current}),repeatMessages:(C,$)=>R.mutate({...C,scope:x.current},$)}}));j.current=D,(0,E.useEffect)(()=>{T.current=h??"main",x.current!==w&&(x.current=w,D.getState()._resetForScopeChange())},[h,w,D]);const{store:W}=xo();(0,E.useEffect)(()=>{const C=()=>{const{pendingThreadIds:$}=W.getState();D.getState()._setHasPendingSend($.includes(T.current))};return C(),W.subscribe(C)},[D,W,w]);const F=(0,E.useCallback)(async()=>{await S()},[S]),m=so(),N=eo();(0,E.useEffect)(()=>{D.getState()._setInterjectionMode(N)},[N,D]);const V=(0,E.useCallback)(C=>A?.emitOptimisticEvent(T.current,Dn(C.content,C.isChatOnly?Qe.PLANNING:Qe.DEFAULT,C.userId,C.selectedElements,(C.selectedCanvasShapes??[]).map($=>Q(kn,{id:$.id,label:$.label,componentPath:$.componentPath})),C.intent,C.messageIntentMetadata,[],C.maxModeSlashCommand??!1,C.userMessageId,C.maxModeSlashCommand)),[A]),Y=(0,E.useRef)(V);(0,E.useEffect)(()=>{Y.current=V},[V]);const J=(0,E.useCallback)(C=>{if(s||f.getState().messages[C.userMessageId])return;const $={id:C.userMessageId,createdAt:C.createdAt,role:"user",type:"userMessage",content:C.content,selectedElements:C.selectedElements,selectedCanvasShapes:C.selectedCanvasShapes??[],images:C.images,containsError:!1,userId:C.userId,chatOnly:C.isChatOnly,optimisticImageUrls:C.optimisticImageUrls,intent:C.intent,messageIntentMetadata:C.messageIntentMetadata};c(C.userMessageId,$,!1);const ee=f.getState();ee.messages[C.userMessageId]&&(ee.sortedMessageIds.includes(C.userMessageId)||f.setState(re=>re.sortedMessageIds.includes(C.userMessageId)?re:{sortedMessageIds:[...re.sortedMessageIds,C.userMessageId]}),r({aiMessageId:C.aiMessageId,updateMessage:c}))},[c,s,f,r]);as({projectId:e,store:D,onProcessingStarted:m?void 0:J,userDeletedMessageIdsRef:u}),(0,E.useEffect)(()=>{D.getState()._applyRuntimeUpdate({isInConversation:l,showStopAction:H,isStopPending:z,canSendMessages:v})},[D,l,H,z,v]);const B=(0,E.useCallback)(C=>{D.getState()._applyStreamedState(C.queue,C.is_paused,m?void 0:J,u.current,C.scope,C.pause_reason)},[D,J,m]);return es({projectId:e,queueScope:w,store:D,enabled:o&&v&&t===void 0,onProcessingStarted:m?void 0:J,userDeletedMessageIdsRef:u}),(0,ce.jsx)(Oo,{value:D,children:(0,ce.jsx)(io,{value:q,children:(0,ce.jsx)(no,{value:B,children:(0,ce.jsx)(oo,{value:F,children:a})})})})};function J0(e){const t=Mn();if(!t)throw new Error("useMessageQueueStore must be used within MessageQueueProvider");return un(t,e)}function ds(){const e=Mn();if(!e)throw new Error("useMessageQueueStoreApi must be used within MessageQueueProvider");return e}function Z0(){const e=ho();if(!e)throw new Error("useStopAgent must be used within MessageQueueProvider");return e}function ec(){const e=go();if(!e)throw new Error("useEditDraftStore must be used within MessageQueueProvider");return e}Sn();var ps=e=>e==="escape_key"?"escape_key":e==="discard_unsaved"?"discard_unsaved":"toggle_button",us=e=>e==="preview_double_click"?"preview_double_click":e==="keyboard_shortcut"||e==="cmdk"?"keyboard_shortcut":"toggle_button";function fs(e){return t=>t.type===e}function gs(e,t){return[...e.values()].filter(fs(t))}function ot(e,t){return e.selector&&t.selector?e.selector===t.selector:Ke(e,t)}function Dt(e,t){return!!e?.some(n=>Ke(n,t))}function hs(e){const t=new Map,n=r=>{const a={filePath:r.filePath,lineNumber:r.lineNumber,col:r.col,instanceId:r.instanceId};t.set(lo(a),a),r.children?.forEach(n)};return n(e),[...t.values()]}function pt(e,t){for(const[n,r]of e)n!==t.key&&(ot(r.element,t.element)||Dt(t.removedElementIdentifiers,r.element))&&e.delete(n)}function xs(e,t){for(const n of e.values())if(n.type==="delete"){if(ot(n.element,t))return"same";if(Dt(n.removedElementIdentifiers,t))return"descendant"}return null}function bs(e,t){for(const[n,r]of e)r.type==="delete"&&ot(r.element,t.element)&&e.delete(n)}function vs(e,t){switch(t.type){case"text":{const n=e?.type==="text"?e.oldText:t.oldText;return n===t.newText?null:{...t,oldText:n}}case"image":{const n=e?.type==="image"?e.oldUrl:t.oldUrl;return n===t.newUrl?null:{...t,oldUrl:n}}case"className":{const{oldClassName:n,oldValue:r}=e?.type==="className"?e:t;return(t.property?r===t.newValue:n===t.newClassName)?null:{...t,oldClassName:n,oldValue:r}}case"attribute":{const n=e?.type==="attribute"?e.oldValue:t.oldValue;return n===t.newValue?null:{...t,oldValue:n}}case"delete":return e?.type==="delete"&&(!t.requestId||t.requestId===e.requestId)?e:t}}function tc(e,t){return e.threadId===t.threadId&&e.sessionId===t.sessionId}function ms({projectId:e,threadId:t=De,getTracker:n,successDisplayDurationMs:r}){let a=null,i=null;const s=new Map,d=new WeakMap,h=()=>{i&&(clearTimeout(i),i=null)};return bn()(_n((p,w)=>({threadId:t,sessionId:0,setThreadId:l=>{const c=w();if(c.threadId===l)return;(c.pendingEdits.size>0||c.isSaving)&&s.set(c.threadId,{pendingEdits:c.pendingEdits,isSaving:c.isSaving});const f=s.get(l);s.delete(l),h(),w().closeVisualEditsPanel(),p(b=>{b.threadId=l,b.sessionId+=1,b.pendingEdits=f?.pendingEdits??new Map,b.isSaving=f?.isSaving??!1,b.sendFeedback=null})},selectedElements:[],pendingEdits:new Map,customPromptValue:"",isSaving:!1,sendFeedback:null,visualEditsPanelIsOpen:!1,visualEditsPanelElementBounds:null,visualEditsPanelIframeBounds:null,visualEditsPanelHiddenOutOfView:!1,pendingDrawingScreenshot:null,pendingDrawingStrokeCount:0,pendingDrawingCanRedo:!1,sessionStartedAt:null,editsMadeCount:0,setSelectedElements:l=>p(c=>{c.selectedElements=l}),handleVisualModeTransition:(l,c)=>{if(l){if(w().sessionStartedAt!==null)return;if(p(v=>{v.sessionStartedAt=Date.now(),v.editsMadeCount=0}),e){const v=n();v.interacted({action:"panel_opened",projectId:e,source:c}),v.sessionStarted({projectId:e,activationMethod:us(c)})}return}const{sessionStartedAt:f,editsMadeCount:b}=w();f!==null&&e&&n().sessionEnded({projectId:e,sessionDurationMs:Math.max(0,Date.now()-f),editsMadeCount:b,exitMethod:ps(c)}),h(),p(v=>{v.selectedElements=[],v.sendFeedback=null,v.visualEditsPanelIsOpen=!1,v.visualEditsPanelElementBounds=null,v.visualEditsPanelIframeBounds=null,v.visualEditsPanelHiddenOutOfView=!1,v.pendingDrawingScreenshot=null,v.pendingDrawingStrokeCount=0,v.pendingDrawingCanRedo=!1,v.sessionStartedAt=null,v.editsMadeCount=0})},selectElement:(l,c=!1)=>p(f=>{const b={...l,children:l.children?.map(v=>({filePath:v.filePath,lineNumber:v.lineNumber,elementType:v.elementType,componentName:v.componentName,selector:v.selector}))};if(c){const v=f.selectedElements.findIndex(S=>ot(S,b));v>-1?f.selectedElements=f.selectedElements.filter((S,z)=>z!==v):f.selectedElements.push(b)}else f.selectedElements=[b];f.pendingDrawingScreenshot=null,f.pendingDrawingStrokeCount=0,f.pendingDrawingCanRedo=!1}),showVisualEditsPanel:(l,c)=>{p(f=>{f.visualEditsPanelIsOpen=!0,f.visualEditsPanelElementBounds=l,f.visualEditsPanelIframeBounds=c,f.visualEditsPanelHiddenOutOfView=!1})},updatePanelPosition:(l,c)=>p(f=>{f.visualEditsPanelIsOpen&&(f.visualEditsPanelElementBounds=l,f.visualEditsPanelIframeBounds=c)}),closeVisualEditsPanel:()=>p(l=>{l.visualEditsPanelIsOpen=!1,l.visualEditsPanelElementBounds=null,l.visualEditsPanelIframeBounds=null,l.visualEditsPanelHiddenOutOfView=!1,l.customPromptValue="",l.selectedElements=[],l.pendingDrawingScreenshot=null,l.pendingDrawingStrokeCount=0,l.pendingDrawingCanRedo=!1}),hideVisualEditsPanel:()=>p(l=>{l.visualEditsPanelIsOpen=!1,l.visualEditsPanelElementBounds=null,l.visualEditsPanelIframeBounds=null,l.visualEditsPanelHiddenOutOfView=!1}),hideVisualEditsPanelOutOfView:()=>p(l=>{l.visualEditsPanelIsOpen&&(l.visualEditsPanelIsOpen=!1,l.visualEditsPanelElementBounds=null,l.visualEditsPanelIframeBounds=null,l.visualEditsPanelHiddenOutOfView=!0)}),setCustomPromptValue:l=>p(c=>{c.customPromptValue=l}),setIsSaving:(l,c=w().threadId)=>{if(w().threadId===c)p(f=>{f.isSaving=l});else{const f=s.get(c);f&&s.set(c,{...f,isSaving:l})}},showSendFeedback:l=>{h(),p(c=>{c.sendFeedback=l}),l.kind==="success"&&(i=setTimeout(()=>{p(c=>{c.sendFeedback=null}),i=null},r))},clearSendFeedback:()=>{h(),p(l=>{l.sendFeedback=null})},upsertPendingEdit:l=>p(c=>{const f=c.pendingEdits.size===0;let b=l;if(l.type==="delete")b={...l,removedElementIdentifiers:l.removedElementIdentifiers??hs(l.element)},pt(c.pendingEdits,b);else{if(xs(c.pendingEdits,l.element)==="descendant")return;bs(c.pendingEdits,l)}const v=c.pendingEdits.get(b.key),S=vs(v,b);S?(c.pendingEdits.set(b.key,S),c.sessionStartedAt!==null&&S!==v&&(c.editsMadeCount+=1)):c.pendingEdits.delete(b.key),f&&c.pendingEdits.size>0&&(h(),c.sendFeedback=null)}),stagePendingDelete:(l,c,f)=>{w().upsertPendingEdit(l);const b=w().pendingEdits.get(l.key);b?.type==="delete"&&b.requestId===l.requestId&&d.set(b,{source:c,origin:f})},resolvePendingDeleteRequest:(l,c,f,b)=>{const v=w();for(const[S,z]of[[v.threadId,v],...s])for(const[H,u]of z.pendingEdits){if(u.type!=="delete"||u.requestId!==l)continue;const x=d.get(u);if(!x||x.source!==c||x.origin!==f)return null;d.delete(u);const T=new Map(z.pendingEdits);if(b){const o={...u,removedElementIdentifiers:b};T.set(H,o),pt(T,o)}else T.delete(H);return S===v.threadId?p(o=>{o.pendingEdits=T}):s.set(S,{pendingEdits:T,isSaving:z.isSaving}),S}return null},confirmPendingDelete:(l,c)=>p(f=>{let b=null;for(const[v,S]of f.pendingEdits)if(S.type==="delete"&&!S.requestId&&Ke(S.element,l)){b=v,S.removedElementIdentifiers=c,pt(f.pendingEdits,S);break}if(!b)for(const[v,S]of f.pendingEdits)!(S.type==="delete"&&S.requestId)&&Dt(c,S.element)&&f.pendingEdits.delete(v)}),rejectPendingDelete:l=>{let c=!1;return p(f=>{for(const[b,v]of f.pendingEdits)if(v.type==="delete"&&!v.requestId&&Ke(v.element,l)){f.pendingEdits.delete(b),c=!0;break}}),c},getPendingEdits:l=>gs(w().pendingEdits,l),hasPendingEdits:l=>{const c=w(),f=c.threadId===l?c:s.get(l);return!!f&&(f.pendingEdits.size>0||f.isSaving)},clearPendingEdits:()=>p(l=>{l.pendingEdits=new Map}),clearSubmittedEdits:(l,c)=>{const f=w(),b=f.threadId===l?f:s.get(l);if(!b)return;const v=new Map(b.pendingEdits);for(const[S,z]of c){const H=v.get(S);(H===z||z.type==="delete"&&z.requestId&&H?.type==="delete"&&H.requestId===z.requestId)&&v.delete(S)}f.threadId===l?p(S=>{S.pendingEdits=v}):s.set(l,{pendingEdits:v,isSaving:b.isSaving})},setPendingDrawingScreenshot:l=>p(c=>{c.pendingDrawingScreenshot=l}),setPendingDrawingStrokeCount:l=>p(c=>{c.pendingDrawingStrokeCount=l}),setPendingDrawingCanRedo:l=>p(c=>{c.pendingDrawingCanRedo=l}),clearPendingDrawingScreenshot:()=>p(l=>{l.pendingDrawingScreenshot=null,l.pendingDrawingStrokeCount=0,l.pendingDrawingCanRedo=!1}),registerChatInputRef:l=>{a=l},focusChatInput:()=>{a?.focus()}})))}var nc=({children:e,tracker:t,successDisplayDurationMs:n})=>{const r=yr(),a=Tt(),i=(0,E.useRef)(t);i.current=t;const[s]=(0,E.useState)(()=>ms({projectId:r,threadId:a,getTracker:()=>i.current,successDisplayDurationMs:n})),d=It(),h=We(l=>l.activeView),p=We(l=>l.viewBlocker),w=(0,E.useRef)(h);return(0,E.useLayoutEffect)(()=>{s.getState().setThreadId(a)},[s,a]),(0,E.useEffect)(()=>d.subscribe((l,c)=>{const f=Ht(l.activePreviewMode);f!==Ht(c.activePreviewMode)&&s.getState().handleVisualModeTransition(f,l.previewModeTrigger)}),[d,s]),(0,E.useEffect)(()=>{const l=w.current!==h;w.current=h,!(!l||p)&&s.getState().closeVisualEditsPanel()},[h,s,p]),(0,ce.jsx)(_o,{value:s,children:e})};function rc(e){const t=Cn();if(!t)throw new Error("useVisualEditorStore must be used within a VisualEditorProvider");return un(t,e)}function ws(){const e=Cn();if(!e)throw new Error("useVisualEditorStoreApi must be used within a VisualEditorProvider");return e}function ys(e){const{message:t,images:n,selectedElements:r,selectedCanvasShapes:a,canvasViewport:i,chatMode:s,maxModeSlashCommand:d,view:h,viewDescription:p,roadmapTask:w,optimisticImageUrls:l,id:c,model:f,intent:b,messageIntentMetadata:v,integrationMetadata:S,errorIds:z,containsError:H,errorSource:u,continuationOverride:x,clientId:T}=e,o=ks(b,v),y=fn();return{id:c??mn(),message:t,files:n.map(_=>({file_id:_.existingFileId||_.id,file_name:_.name,type:mr.USER_UPLOAD,..._.mimeType?{mime_type:_.mimeType}:{}})),selected_elements:r.map(Ao),...a&&a.length>0&&{selected_canvas_shapes:a},...i&&{canvas_viewport:i},chat_only:s===Z.PLAN,...s===Z.CHAT&&{mode:"chat"},...s===Z.MAX&&{max_mode:!0},...s===Z.MAX&&d&&{max_mode_slash_command:!0},...h&&{view:h},...p&&{view_description:p},...w&&{roadmap_task:w},...t==="noop"&&{noop_mode:!0},...l&&{optimisticImageUrls:l},...f&&f!=="auto"&&{model:f},...o&&{intent:o},...v&&{message_intent_metadata:v},...S&&{integration_metadata:S},...H&&{contains_error:!0},...z&&z.length>0&&{error_ids:z},...u&&{error_source:u},...x&&x!=="default"&&{continuation:x},...T&&{client_id:T},...y&&{user_timezone:y}}}function ks(e,t){const n=t?.visual_edit_metadata,r=wo(n),a=[{intent:te.SEO_FIX,label:"SEO_FIX",metadataKey:"seo_fix_metadata",present:!!t?.seo_fix_metadata},{intent:te.SEO_FIX_V2,label:"SEO_FIX_V2",metadataKey:"seo_fix_v2_metadata",present:!!t?.seo_fix_v2_metadata},{intent:te.SEO_SITE_APPEARANCE,label:"SEO_SITE_APPEARANCE",metadataKey:"seo_site_appearance_metadata",present:!!t?.seo_site_appearance_metadata},{intent:te.FIX_ERROR,label:"FIX_ERROR",metadataKey:"fix_error_metadata",present:!!t?.fix_error_metadata},{intent:te.HEALTH_CHECK_FINDING_FIX,label:"HEALTH_CHECK_FINDING_FIX",metadataKey:"health_check_finding_fix_metadata",present:!!t?.health_check_finding_fix_metadata},{intent:te.QA_FINDING_FIX,label:"QA_FINDING_FIX",metadataKey:"finding_fix_metadata",present:!!t?.finding_fix_metadata},{intent:te.COMMENT_FEEDBACK,label:"COMMENT_FEEDBACK",metadataKey:"comment_feedback_metadata",present:!!t?.comment_feedback_metadata},{intent:te.VISUAL_EDIT,label:"VISUAL_EDIT",metadataKey:"visual_edit_metadata",present:!!n},{intent:te.DOC_EDIT,label:"DOC_EDIT",metadataKey:"doc_edit_metadata",present:!!t?.doc_edit_metadata},{intent:te.QUESTION_ANSWER,label:"QUESTION_ANSWER",metadataKey:"question_answer_metadata",present:!!t?.question_answer_metadata}];for(const{intent:i,label:s,metadataKey:d,present:h}of a){if(e===i&&!h)throw new Error(`${s} intent requires ${d}`);if(h&&e&&e!==i)throw new Error(`${d} requires ${s} intent`)}if(n&&!r)throw new Error(e===te.VISUAL_EDIT?"VISUAL_EDIT intent requires at least one edit":"visual_edit_metadata requires at least one edit");return a.find(i=>i.present)?.intent??e}var Nt="lovable_rate_limit_until";var _s=1;function Ss(e){return e===void 0||!Number.isFinite(e)?60:Math.min(Math.max(Math.ceil(e),_s),60)}var ac=(e,t=Date.now())=>{const n=t+Ss(e)*1e3;localStorage.setItem(Nt,n.toString())},Es=()=>{const e=localStorage.getItem(Nt);if(!e)return null;const t=parseInt(e,10);return Number.isFinite(t)?t:null},Ms=()=>{localStorage.removeItem(Nt)},As=(e=Date.now())=>{const t=Es();if(t===null)return{isRateLimited:!1,secondsRemaining:0};const n=Math.ceil((t-e)/1e3);return n<=0||n>60?(Ms(),{isRateLimited:!1,secondsRemaining:0}):{isRateLimited:!0,secondsRemaining:n}},Cs=e=>["trajectory-threads",e];function Is(){const e=tt("conversation");return{conversationId:e,conversation:void 0,isLoading:!1,isInConversation:!1,isNewConversation:e==="new",refetch:async()=>{}}}var Ts=(e,t)=>["trajectory-thread",e,t],Ps=()=>{const e=Tn(),t=ti(),n=ai();return(0,E.useCallback)(()=>{const{activeView:r,clearViewBlocker:a}=e.getState();r&&n?.[r]?.closeOnSend&&(a(),t?.exitView())},[e,t,n])};function zs(){const{getBridge:e,isAvailable:t}=wr(),n=Ue(),r=(0,E.useRef)(!1),a=vo();return{triggerPushRegistration:(0,E.useCallback)(async i=>{if(!(!t||r.current)&&(r.current=!0,!await a({trigger:"first_message",projectId:i})))try{const s=await e();if(!s?.isWebViewBridgeAvailable)return;const d=await Do(s,{trigger:"first_message",projectId:i});(d==="granted"||d==="provisional")&&await n.invalidateQueries({queryKey:No})}catch(s){r.current=!1,console.warn("[PushRegistration] Failed:",s)}},[e,t,n,a])}}var Os=()=>{const e=Tn(),t=Go(),n=Uo(r=>r.setPlanFollowFromEventId);return{armPlanFollowOnSend:(0,E.useCallback)(()=>{const r=e.getState().activeView==="plan"?t.getState().activePlanEventId:void 0;n(r)},[n,e,t])}};function qs(){const e=_e(a=>a.project?.id),t=St(),{conversationId:n,isInConversation:r}=Is();return{resolveThread:(0,E.useCallback)(async a=>{if(r){if(n&&n!=="new")return n;if(n==="new"&&e){const i=await Se().POST("/projects/{project_id}/trajectory/threads",{params:{path:{project_id:e}},body:{message:a}}),s=new URLSearchParams(window.location.search);return s.set("conversation",i.thread_id),t.replace(`?${s.toString()}`),i.thread_id}}},[r,n,e,t])}}var oc=()=>et(e=>({showDialog:!1,setShowDialog:t=>e({showDialog:t})})),Nn=(0,E.createContext)(null);Nn.displayName="SupabaseReauthContext";function Rs(e){const t=(0,E.use)(Nn);if(!t)throw new Error("useSupabaseReauthStore must be used within ProjectChatInputProvider");return t(e)}function Fs(){const e=Ue(),t=Pn(),{permissions:n,isResolved:r}=xn(),a=hr(),i=fr(),s=Rs(d=>d.setShowDialog);return{checkSupabaseReauth:(0,E.useCallback)(async()=>{const{project:d,projectId:h}=t.getState(),p=d?.supabase_project_config,w=d?.workspace_id??"";if(!p||!w||!r)return!1;const l=n.includes(Oe.ViewWorkspace);if(!(a&&(l||i)))return!1;const c=Vo(w,h),f=v=>{const S=v.find(z=>z.id===p.supabase_organization_id);return S&&!S.has_analytics_scope?(s(!0),!0):!1},b=e.getQueryData(c.queryKey);if(b!==void 0)return e.prefetchQuery(c),f(b);try{return f(await e.fetchQuery(c))}catch{return e.removeQueries({queryKey:c.queryKey}),!1}},[t,e,n,r,a,i,s])}}var Ls=new Set([te.FIX_ERROR,te.SECURITY_SCAN,te.SECURITY_FIX_V2,te.SECURITY_CHAT,te.SECURITY_FIX_DEPENDENCY,te.SEO_FIX,te.VISUAL_EDIT]);function Un(e){return e instanceof ke&&e.type==="pii_detected"}function Ds(e){return Un(e)?!0:e instanceof ke?zn(e)||e.status===404&&e.type==="unknown_thread":!1}function jn(){const e=rt(),t=_e(o=>o.projectId),n=Pn(),r=at(),a=Ue(),i=It(),s=wi(),{checkSupabaseReauth:d}=Fs(),{resolveThread:h}=qs(),p=ds(),w=Zo(),l=gn(Xr).enabled,c=In(),f=Ho(),b=Ps(),{startLiveMode:v}=Eo(),{freezeAcquired:S,freezeReleased:z}=ko(),{armPlanFollowOnSend:H}=Os(),{triggerPushRegistration:u}=zs(),x=ws(),T=ri()({projectId:t});return(0,E.useCallback)(async(o,y)=>{if(As().isRateLimited)return"blocked";const _=pr(),M=o.images??[],I=o.selectedElements??[],O=o.threadId??w();if(t&&Wo(a,t,O))return"blocked";const G=o.message,R=f?.getState().savedPlans,g=zo(o.message)?.filePath;if(R!==void 0&&R.size>0&&!o.system&&o.intent===void 0&&o.messageIntentMetadata===void 0&&(g===void 0||g===".lovable/plan.md"||ei(g))&&Po(o.message)===null&&(O==="main"||Ko(O))){const U=Ye(c.getOrCreateThreadStore(O).getState());if(U?.toolCall.tool_id==="plan--show"){const ie=R.get(_a(U.toolCall.tool_call_event));ie!==void 0&&(o={...o,message:xi(o.message,ie.content,ga,ie.htmlOverrides)})}}let k=o.chatMode??Z.AGENT;const A=k===Z.PLAN&&G.toLowerCase().includes("lov-action");A&&(k=Z.AGENT);const P=()=>i.getState().activeThreadId===O,q=!o.system&&!y?.afterSettingsChange&&!o.maxModeSlashCommand&&!(o.intent!==void 0&&Ls.has(o.intent))&&i.getState().chatMode===Z.CHAT&&P()&&(k===Z.AGENT||k===Z.MAX);if(q&&!await s.getState().confirm(y?.confirmationAnchor,o.source))return"skipped";const j=o.selectedCanvasShapes??[],D=await Co(o.message),W=ys({message:o.message,images:M,selectedElements:I,selectedCanvasShapes:j,canvasViewport:o.canvasViewport,chatMode:k,maxModeSlashCommand:o.maxModeSlashCommand,view:o.view,viewDescription:o.viewDescription,roadmapTask:o.roadmapTask,optimisticImageUrls:M.map(U=>U.url),model:o.model,intent:o.intent,messageIntentMetadata:o.messageIntentMetadata,errorIds:o.errorIds,containsError:o.containsError,errorSource:o.errorSource,continuationOverride:o.continuationOverride,clientId:D});if(!o.system&&await d())return"blocked";const{optimisticControls:F}=c.global.getState(),m=o.id??mn();W.id=m;let N=O;if(o.resolveThread&&O==="main")try{N=await h(ka(o.message)?.prose??o.message)??O}catch(U){return oe.error("Failed to create conversation",{description:String(U)}),"blocked"}const V=()=>{const U=Ye(c.getOrCreateThreadStore(N).getState());if(!(!U||yn(U.toolCall.tool_id)))return F?.emitOptimisticEvent(N,Za(U.toolCall.tool_call_event,Va.CANCELLED))};A&&i.getState().setChatMode(Z.AGENT,"builder_action_send"),q&&P()&&i.getState().chatMode===Z.CHAT&&i.getState().setChatMode(Z.AGENT,"build_send_confirmed");const Y=l&&I.length>0;let J=!1;const B=()=>{J||(J=!0,z(m))},C=N,$=C==="main"?void 0:c.getOrCreateThreadStore(C).getState().observedGenerationCompletionCount;S(m,{blocksAutoStart:Y,ownerThreadId:C,...$!==void 0&&{ownerGenerationCompletionCount:$}});try{!o.system&&!o.skipVisualEditCleanup&&x.getState().closeVisualEditsPanel(),o.system||(H(),b(),yo.getState().leave()),v()}catch(U){throw B(),U}const ee=Fo(c.getOrCreateThreadStore(N).getState()),re=p.getState(),Re=re._interjectionMode,fe=re.queue.some(U=>!re.failedGhostIds.includes(U.message_id)),se=re.getActiveQueueScope(),de=N===se,ne=de&&(ee.isAgentRunning||!ee.isKnown&&re.isAgentResponding||fe&&(!re.isPaused||Re!=="off")),ye=()=>de&&p.getState().getActiveQueueScope()===se,Fe=o.messageIntentMetadata?.doc_edit_metadata?So(o.message,o.messageIntentMetadata.doc_edit_metadata):o.message,$e=()=>F?.emitOptimisticEvent(N,Dn(Fe,k===Z.PLAN?Qe.PLANNING:Qe.DEFAULT,r?.uid??"",I,j.map(U=>Q(kn,{id:U.id,label:U.label,componentPath:U.componentPath})),o.intent,o.messageIntentMetadata,M,k===Z.MAX,m,k===Z.MAX&&o.maxModeSlashCommand,k===Z.CHAT));let Ee,L;const ae={id:m,message:o.message,images:M,selectedElements:I,selectedCanvasShapes:j,chatMode:k,maxModeSlashCommand:o.maxModeSlashCommand,intent:o.intent,messageIntentMetadata:o.messageIntentMetadata},K=async()=>{let U=!1;const ie=()=>T.mutateAsync({body:{...W,thread_id:N},threadId:N,onError:()=>{U&&y?.onError?.()},onDelivered:()=>{U&&y?.onSuccess?.()}});let ge;try{ge=await p.getState().runInSendOrder(m,ie)}catch(ve){U=!0,L?.cancel(),Ee?.cancel();const me=p.getState(),jt=me.isUnackedGhost(m);if(!jt&&me.queue.some(er=>er.message_id===m))return"queued";if(B(),me._interjectionMode==="auto"&&jt&&!o.retainFailedVisualEdits&&!Ds(ve))return me.failGhost(m),"queue_failed";throw me.dismissGhost(m),Un(ve)||y?.onError?.(),ve}U=!0;const le=ge?.status==="queued";if(le&&!ne&&(L?.cancel(),Ee?.cancel(),ye()&&p.getState().insertGhost(ae,K)),le&&p.getState().markGhostEnqueued(m),!le&&ne&&(p.getState().dismissGhost(m),Ee=V(),L=$e()),y?.onSuccess?.(),!o.system){if(le&&(t&&e.emit(Ae,{projectId:t,queueMessageAction:"queued",attachmentType:M.length>0?"image":void 0,chatMode:k===Z.PLAN?"chat":"default",triggerElement:"button_clicked",triggerLocation:"chat_input"}),ee.isAgentRunning&&vi()),t){const ve=Pr(t,o.message,o.composer,_);e.emit(sa,{projectId:t,selectedElement:I.length>0?I.length:void 0,source:o.source,...ve})}Qo("web.chat",le?"message queued":"message sent",o.source?{source:o.source}:void 0),u(t??""),r?.uid&&t&&Rr(r.uid),window.dispatchEvent(new CustomEvent("desktop-app-survey:trigger"))}const he=n.getState().project?.id;return N!=="main"&&he&&(a.invalidateQueries({queryKey:Cs(he)}),a.invalidateQueries({queryKey:Ts(he,N)})),le?"queued":"sent"};try{ne?p.getState().insertGhost(ae,K):(Ee=V(),L=$e())}catch(U){throw B(),U}return K()},[p,T,e,w,l,c,f,r,t,n,i,s,x,a,d,h,b,H,v,S,z,u])}var Ns="chat:pending-prompt:",bt="chat:pending-prompt-ready",$n="chat:pending-prompt-handoff:",Us=6e4,vt="handoff",js="chat:pending-prompt-sent",$s="chat:pending-prompt-held",Hs=e=>e instanceof ke&&zn(e)?"no_credits":"error";function Bs(e,t,n){window.dispatchEvent(new CustomEvent(js,{detail:{projectId:e,source:t,marker:n}}))}function mt(e){return Ns+e}function Ut(e,t){return`${$n}${e}:${t}`}function Gs(e,t,{userId:n,nonce:r}){if(typeof window>"u")return!1;Vs();const a={userId:n,expiresAt:Date.now()+Us};return hn(Ut(e,r),JSON.stringify({...t,handoffScope:a}))}function Vs(){let e;try{e=Object.keys(localStorage).filter(t=>t.startsWith($n))}catch{return}for(const t of e)try{const{handoffScope:n}=JSON.parse(nt(t)??"{}");n&&n.expiresAt>Date.now()||Pe(t)}catch{Pe(t)}}function Jt(e,t){return e?.userId===t&&Number.isFinite(e.expiresAt)&&e.expiresAt>Date.now()}function ic(e,t,n){return typeof window>"u"||!ft(mt(e),JSON.stringify({...t,...n?{handoffScope:n}:{}}))?!1:(window.dispatchEvent(new CustomEvent(bt,{detail:{projectId:e}})),!0)}function sc(){const e=at()?.uid,t=St(),n=rr();return(0,E.useCallback)((r,a,{newTab:i})=>{if(!e)return!1;const s=_r();if(!Gs(r,a,{userId:e,nonce:s}))return!1;const d=or({name:"project",params:{projectId:r},search:{thread:De,[vt]:s}});if(!i)return t.push(d),!0;const h=window.open(d,"_blank");return h?(h.opener=null,!0):n?!0:(Pe(Ut(r,s)),!1)},[t,e,n])}async function Qs(e,t,n){if(t.containsError&&t.intent===te.FIX_ERROR){const r=t.messageIntentMetadata?.fix_error_metadata?.errors??[],a=r.length>0?r.map(i=>({message:i.error_message,error_type:i.error_type})):[{message:t.message}];await Promise.all(a.map(i=>bo(e,i)))}return n(t)}function Hn(e,t){const n=_t(e).filter(r=>r.marker!==t.marker);Et(e,[...n,{...t,heldAt:Date.now()}])}function lc(e){const t=_t(e);return Et(e,t),t.map(({marker:n,source:r,chatMode:a})=>({marker:n,source:r,chatMode:a}))}function cc(e,t,n,r){Hn(e,{marker:t,source:n}),sr(e,t,r)}function Ks(e,t){Et(e,_t(e).filter(n=>n.marker!==t))}function Ws(){const e=vn(),t=(0,E.useContext)(wn)?.store,n=Oa();return(0,E.useCallback)(async({message:r,source:a,chatMode:i},s,d)=>{if(!e)return!1;i&&!d?.keepPickerMode&&n&&(n.getState().enterThread(De,i),n.getState().keepThreadChatMode());const h=p=>p.replace(/\s+/g," ").trim();return!h(t?.getState().message??"").includes(h(r))&&!await e.insertText(r,{position:"end",focus:!0})?!1:(a&&(e.draftMessageContextRef.current={marker:r,source:a,chatMode:i},Hn(s,{marker:r,source:a,chatMode:i})),!0)},[e,t,n])}function Ys(){const e=vn(),t=(0,E.useContext)(wn);return(0,E.useCallback)((n,r)=>{Ks(n,r),e?.draftMessageContextRef.current?.marker===r&&(e.draftMessageContextRef.current=null);const a=i=>i.replace(/\s+/g," ").trim();t&&a(t.store.getState().message??"")===a(r)&&t.clearEditorState()},[e,t])}async function Zt(e,t,n,r,a,i){let s;try{const d=await Qs(e,t,n);if(d==="sent"||d==="queued")return i(e,t.message),Bs(e,t.source,t.message);if(d!=="blocked"&&d!=="skipped")return;s=d}catch(d){s=Hs(d)}if(!t.intent){if(!await r(t,e,{keepPickerMode:s==="skipped"}))return a();window.dispatchEvent(new CustomEvent($s,{detail:{projectId:e,source:t.source,reason:s}}))}}function dc(e){const t=at(),n=jn(),r=(0,E.useRef)(!1),a=ar(),i=Ws(),s=(0,E.useEffectEvent)(i),d=Ys(),h=(0,E.useEffectEvent)(d);(0,E.useEffect)(()=>{if(typeof window>"u")return;const f=()=>{if(r.current)return;const v=mt(e),S=vr(v);if(!S)return;let z;try{z=JSON.parse(S)}catch{He(v);return}if(!z?.message){He(v);return}const{handoffScope:H,...u}=z;if(H!==void 0){if(!t)return;if(!Jt(H,t.uid)){He(v);return}}r.current=!0,He(v),Zt(e,u,n,s,()=>ft(v,S),h)},b=v=>{v.detail?.projectId===e&&f()};return f(),window.addEventListener(bt,b),()=>window.removeEventListener(bt,b)},[e,n,a,t]);const p=tt(vt),w=St(),l=ur(),c=It();(0,E.useEffect)(()=>{if(typeof window>"u"||!p||!t)return;const f=()=>{const u=new URLSearchParams(l());u.delete(vt);const x=u.toString();w.replace(x?`${a}?${x}`:a,{scroll:!1})},b=Ut(e,p),v=nt(b);if(!v){f();return}let S;try{S=JSON.parse(v)}catch{Pe(b),f();return}const{handoffScope:z,...H}=S;if(!H.message||!Jt(z,t.uid)){Pe(b),f();return}if(Pe(b),f(),H.chatMode){const u=c.getState();u.enterThread(De,H.chatMode),u.keepThreadChatMode()}Zt(e,H,u=>n({...u,threadId:De}),s,()=>ft(mt(e),v),h)},[e,p,t,a,w,l,n,c])}function Xs(e){return e==="sent"||e==="queued"}function Js(){const e=jn(),t=qo(n=>n.isSendChatMessageMutationPending);return{sendAgentMessage:(0,E.useCallback)((n,r)=>{e({message:n,chatMode:Z.AGENT,threadId:r?.threadId,source:r?.source,intent:r?.intent},{confirmationAnchor:r?.confirmationAnchor}).catch(()=>"error").then(a=>{!Xs(a)&&a!=="skipped"&&oe.error("Couldn't send your message. Please try again."),r?.onSettled?.(a)})},[e]),isPending:t}}function pc(){const{sendAgentMessage:e}=Js();(0,E.useEffect)(()=>ir(t=>e(t)),[e])}var uc=({isOpen:e,onDismiss:t=()=>{},onConfirm:n=()=>{}})=>(0,ce.jsx)(cr,{open:e,onOpenChange:r=>!r&&t(),title:Zr(),description:ta(),actions:[{label:ea(),variant:"ghost",icon:lr,iconPosition:"end",closeOnClick:!1,render:(0,ce.jsx)(Or,{href:"https://docs.lovable.dev/features/security",target:"_blank",rel:"noopener noreferrer"})},{label:na(),variant:"outline",closeOnClick:!1,onClick:n},{label:ra()}]});function fc(e){return Zs(e.orderedItems)}function gc(e){if(e.hasMoreOlderEvents&&e.orderedItems.length>0)return!0;for(let t=e.orderedItems.length-1;t>=0;t--)if(Bn(e.orderedItems[t])!==null)return!0;return!1}function hc(e,t){if(e===t)return!0;if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n].eventId!==t[n].eventId||e[n].endEventId!==t[n].endEventId)return!1;return!0}function Zs(e){const t=[],n=new Map;let r;for(const a of e){const{payload:i}=a;i.type==="user_message"&&!i.isExternalAgent&&i.userId&&(r=i.userId);const s=el(i);s&&n.set(a.endEvent,s);const d=Bn(a);d&&(d.authorId=r,d.kind==="revert"&&(d.revertedToTitle=n.get(d.revertedTo)),t.push(d))}return t}function el(e){if(e.type==="ai_message")return e.remoteCommit?.title;if(e.type==="git_commit")return e.title;if(e.type==="revert")return e.commit?.title}function Bn(e){const{payload:t,timestamp:n,startEvent:r,endEvent:a}=e;switch(t.type){case"ai_message":{const i=t.remoteCommit;return!i||en(i)?null:{...wt(i,n,e),snapshotEventId:r,endEventId:a,agentMessageEventId:r}}case"git_commit":return en(t)||!tl(t)?null:wt(t,n,e);case"revert":{const i=t.commit;return{eventId:r,snapshotEventId:r,endEventId:a,timestamp:n,kind:"revert",title:i?.title??"Reverted",hash:i?.hash,revertedTo:t.revertedTo,revertedFrom:t.from,trajectoryItem:e}}case"user_message":case"scheduled_task_run":case"branch_switch":case"pull_request_created":case"pull_request_approved":case"pull_request_closed":case"reducer_error":return null}}function wt(e,t,n){return{eventId:e.event,snapshotEventId:n.startEvent,endEventId:e.event,timestamp:t,kind:"commit",source:e.source,title:e.title,hash:e.hash,legacyEditId:e.legacyEditId,trajectoryItem:n}}function xc(e){const t=e.trajectoryItem.payload;if(t.type!=="revert"||!t.commit)return null;const n=t.commit,r={...e.trajectoryItem,payload:n,startEvent:n.event,endEvent:n.event};return wt(n,e.timestamp,r)}function en(e){return e.source==="initial"}function tl(e){return e.visibility===Aa.EXTERNAL}var nl=7;function ue(e,t){if(!e||!t)return!1;if(e===t)return!0;const[n,r]=e.length<=t.length?[e,t]:[t,e];return n.length>=nl&&r.startsWith(n)}function yt(e){const t=e.latest_commit_sha??void 0;return t&&!ue(t,e.base_sha??void 0)?t:void 0}function bc(e,t){if(!t)return[];const n=e.findIndex(r=>ue(r.hash,t));return n<0?[]:e.slice(0,n+1).reverse()}function rl(e,t){const n=t?e.findIndex(r=>ue(r.hash,t)):-1;return n<0?{unpublished:[...e],published:[]}:{unpublished:e.slice(0,n),published:e.slice(n)}}function vc(e,t,n){const r=rl(e,n);if(r.published.length>0||!n||e.length===0)return r;const a=t.findIndex(s=>ue(s.hash,n));if(a<0)return r;const i=t.findIndex(s=>ue(s.hash,e[0].hash));return i>=0&&a<=i?{unpublished:[],published:[...e]}:r}function al(e,t,n){return t?e.findIndex(r=>ue(r.hash,t)):n===void 0?-1:e.findIndex(r=>r.timestamp<=n)}function mc(e,t,n,r,a){const i=yt(n);if(!i)return tn(n.accepted_at,a);const s=al(e,t,r),d=e.findIndex(h=>ue(h.hash,i));return s>=0?d<0||d>=s:d<0&&tn(n.accepted_at,t?a:r)}function tn(e,t){const n=e?new Date(e).getTime():NaN;return Number.isFinite(n)&&t!==void 0&&Number.isFinite(t)&&n<=t}function wc(e,t){return t?e.filter(n=>n.kind!=="commit"||!ue(n.hash,t)):[...e]}function yc(e,t,n){const r=e.filter(h=>yt(h)),a=r.find(h=>ue(yt(h),n));if(a)return{kind:"draft",draftId:a.draft_id};const i=t.find(h=>ue(h.hash,n));if(i)return{kind:"row",eventId:i.eventId};if(t.length===0)return null;const[s]=r;if(s)return{kind:"draft",draftId:s.draft_id};const[d]=t;return d?{kind:"row",eventId:d.eventId}:null}function kc(e,t,n=!0){if(t.length===0)return e.map(s=>({kind:"item",item:s}));const r=t.map(s=>({publish:s,timestamp:new Date(s.published_at).getTime()})).filter(({timestamp:s})=>Number.isFinite(s)).sort((s,d)=>d.timestamp-s.timestamp),a=[];let i=0;for(const s of e){for(;i<r.length&&r[i].timestamp>=s.timestamp;)a.push({kind:"publish",publish:r[i].publish}),i++;a.push({kind:"item",item:s})}if(!n)for(;i<r.length;i++)a.push({kind:"publish",publish:r[i].publish});return a}function _c(e,t){const n=t?e.findIndex(r=>r.kind==="item"&&r.item.eventId===t):e.findIndex(r=>r.kind==="publish");return n<0?{unpublished:[...e],published:[]}:{unpublished:e.slice(0,n),published:e.slice(n)}}var Gn="mr-1 flex max-w-sm flex-col transition-[background-color,box-shadow,border-color] duration-200 ease-out motion-reduce:transition-none",ol="rounded-4 shadow-surface-md bg-secondary-pulse",Sc="after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[inset_0_0_0_var(--border-default)_var(--border-translucent)]",il={default:ol,error:"rounded-4 border border-attention-pulse bg-attention-translucent-pulse"},Ec=Gn,sl="text-[color:color-mix(in_oklch,var(--fg-tertiary),var(--fg-quaternary))]",ll="color-mix(in oklch, var(--fg-tertiary), var(--fg-quaternary))",nn={default:"bg-[var(--border-translucent)]",error:"bg-[var(--border-attention)]"},Mc="shadow-[var(--shadow-surface-md),0_0_0_3px_color-mix(in_oklch,var(--bg-accent)_20%,transparent),0_0_0_1px_var(--border-accent)]",cl="bg-[var(--border-translucent)]";function dl({hasError:e}){return e?"error":"default"}function pl(e,t){return Ct(Gn,il[e],t&&!Vn(e)&&"shadow-[var(--shadow-surface-md),0_0_0_3px_color-mix(in_oklch,var(--bg-accent)_20%,transparent),0_0_0_1px_var(--border-accent)]")}function Ac(e=!1){return Ct(pl(dl({hasError:!1}),e),"animate-in fade-in-0 w-full max-w-sm flex-row items-center gap-3 overflow-hidden py-2 ps-2.5 pe-3 duration-200 ease-out motion-reduce:animate-none")}function Cc(e,t){return Vn(e)?nn.error:t?cl:nn[e]}function Vn(e){return e==="error"}var Ic={duration:.2,ease:"easeOut"},Tc={initial:{opacity:0,y:4},animate:{opacity:1,y:0},exit:{opacity:0,y:-4}},Pc={duration:.15,ease:"easeOut"},zc={duration:.3,ease:"easeOut"},Oc={duration:.08,ease:"easeOut"},qc={duration:.18,ease:"easeOut"},Rc={initial:{opacity:0},animate:{opacity:1},exit:{opacity:0}},Fc={bounce:0,duration:.2};function Lc({children:e}){return(0,ce.jsx)("output",{className:Ct(sl,Ir,"block text-lg md:text-base"),children:(0,ce.jsx)(Io,{cycleTints:Mr,cycleKey:"inline-tool-loading",baseColor:ll,children:e})})}function Dc({result:e},t){const n=(e?.type==="tool_output"?e.output.metadata:e?.type==="soft_tool_error"?e.metadata:void 0)?.[t];if(!n)return null;try{return JSON.parse(n)}catch{return null}}function Nc({result:e}){return e?.type==="soft_tool_error"?e.metadata?.screens_failure:void 0}function Uc(e){return!!e.html&&e.width>0&&e.height>0}function jc(e){return e.target_device==="mobile"?e.height+54:e.height}function $c(e,t=!1){const n=e==="mobile"?"min(63vh, 664px)":"min(80vh, 860px)";return t?`var(--stage-budget, ${n})`:n}var Hc="2.25rem",ul=.81;function Bc(e){return e.fidelity==="sketch"?{side:0,below:0}:{side:12,below:37}}function Gc(e){return e.width*ul}function Vc(e,t){let n=0;for(const{width:r,height:a}of e)r>0&&(n=Math.max(n,a*Math.min(1,t/r)));return n}var Je={mobile:{width:393,height:764},desktop:{width:1280,height:832},"tablet-landscape":{width:1133,height:744},"tablet-portrait":{width:744,height:1133}};function Qc(e){return Je[e]??Je.mobile}function Kc(e,t){const n=e.target_device&&Je[e.target_device]?e.target_device:"mobile";return{screen_id:e.screen_id??"",screen_name:e.screen_name??"",version:0,target_device:n,fidelity:t??e.fidelity,html:"",...Je[n]}}function Qn(e){try{const t=document.documentElement,n=Math.max(1,Math.ceil(t.clientWidth||window.innerWidth)),r=Math.max(1,Math.ceil(window.innerHeight||t.clientHeight)),a=Math.max(r,Math.ceil(t.scrollHeight));let i="";for(const f of Array.from(document.styleSheets))try{for(const b of Array.from(f.cssRules))i+=`${b.cssText}
`}catch{}i=i.replace(/:root\b/g,"html");const s=t.cloneNode(!0),d=t.querySelectorAll("*"),h=s.querySelectorAll("*");for(let f=0;f<d.length&&f<h.length;f++){const b=d[f],v=h[f];if(b instanceof HTMLInputElement)v.setAttribute("value",b.value),b.checked?v.setAttribute("checked",""):v.removeAttribute("checked");else if(b instanceof HTMLTextAreaElement)v.textContent=b.value;else if(b instanceof HTMLSelectElement)Array.from(v.querySelectorAll("option")).forEach((S,z)=>{z===b.selectedIndex?S.setAttribute("selected",""):S.removeAttribute("selected")});else if(b instanceof HTMLCanvasElement)try{const S=document.createElement("img");S.src=b.toDataURL(),S.setAttribute("style",b.getAttribute("style")??""),S.width=b.clientWidth,S.height=b.clientHeight,v.replaceWith(S)}catch{}}s.querySelectorAll("script, style, link, meta, noscript, iframe").forEach(f=>f.remove());const p=document.createElement("style");p.textContent=i,(s.querySelector("head")??s).append(p);const w=new XMLSerializer().serializeToString(s),l=`<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${r}"><foreignObject x="${-window.scrollX}" y="${-window.scrollY}" width="${n}" height="${a}">${w}</foreignObject></svg>`,c=new Image;return c.src=`data:image/svg+xml;charset=utf-8,${encodeURIComponent(l)}`,c.decode().then(()=>{const f=Math.min(window.devicePixelRatio||1,2,e/n),b=document.createElement("canvas");b.width=Math.round(n*f),b.height=Math.round(r*f);const v=b.getContext("2d");if(!v)return null;const S=[document.body,t].map(z=>z?getComputedStyle(z).backgroundColor:"").find(z=>z&&z!=="transparent"&&z!=="rgba(0, 0, 0, 0)");return S&&(v.fillStyle=S,v.fillRect(0,0,b.width,b.height)),v.drawImage(c,0,0,b.width,b.height),b.toDataURL("image/png")}).catch(()=>null)}catch{return Promise.resolve(null)}}var Kn="lov-screen-capture",Wn=3e3,Ve=new WeakMap;function Wc(e,t){return Ve.set(e,t),()=>{Ve.get(e)===t&&Ve.delete(e)}}function Yc(e,t){const n=Ve.get(e);return n?fl(n(t).catch(()=>null)):Promise.resolve(null)}function fl(e){return new Promise(t=>{const n=setTimeout(()=>t(null),Wn);e.then(r=>{clearTimeout(n),t(r)})})}var rn=0;function gl(){return rn+=1,rn}function Xc(e){return t=>new Promise(n=>{const r=e.contentWindow;if(!r){n(null);return}const a=gl(),i=()=>{clearTimeout(d),window.removeEventListener("message",s)},s=h=>{if(h.source!==r)return;const p=h.data;if(typeof p!="object"||p===null)return;const w=p;w.type!=="lov-screen-capture"||w.id!==a||(i(),n(hl(w.png)))},d=setTimeout(()=>{i(),n(null)},Wn);window.addEventListener("message",s),r.postMessage({type:Kn,id:a,maxWidth:t},"*")})}function hl(e){return typeof e=="string"&&e.startsWith("data:image/png;base64,")?e:null}var Jc=`
(function () {
  var TYPE = ${JSON.stringify(Kn)};
  var snapshot = ${Qn.toString()};
  window.addEventListener("message", function (event) {
    var data = event.data;
    if (event.source !== parent || !data || data.type !== TYPE || typeof data.id !== "number") return;
    snapshot(Number(data.maxWidth) || 1600).then(function (png) {
      parent.postMessage({ type: TYPE, id: data.id, png: png }, "*");
    });
  });
})();`,xl={src:"https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.2.4",integrity:"sha384-yNSZBFvuOWcmww494a9+1zNuvgUGEXoWkein7cxP8wHUTi3iXCU4vJ7hr3tzBCml"},Yn=[xl,{src:"https://cdn.jsdelivr.net/npm/motion@12.38.0/dist/motion.min.js",integrity:"sha384-g8N0Gj0RdmxtvvOen8pbSSvJ6TCbjcdI+ZiiZP6m7EsoWGg5nb7oZKKf63W6rPcJ"},{src:"https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js",integrity:"sha384-XmJ9SoHtVOHoQUcKvFAzVXwdkKo1Ie3bhmSoIAkcdsHGaIrVJIkmozyq0FJeb/Ly"},{src:"https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/Flip.min.js",integrity:"sha384-LY8cG/IUULu4u3V3AhwWBt01HIuO/hlekjkqgBx0DOJ/oquEL0Qk2L6qy+1QeRZM"},{src:"https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/Draggable.min.js",integrity:"sha384-k9SCZn5JmxO3oyPDFbaTMy2eSu3WzGB2Qfg+htfhZCEomNh7o48hKFV38IEKsYr0"},{src:"https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/InertiaPlugin.min.js",integrity:"sha384-R8g6f6kDZh4vwaTTVFMOCQ98vOAwhOD3OfjZCIb44f87BERTczxbYSRjRR6+lNdP"}],Zc={root:"https://cdn.jsdelivr.net/npm/three@0.170.0/",module:"https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",addons:"https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"},ed={styles:"https://fonts.googleapis.com",files:"https://fonts.gstatic.com"},td="https://images.unsplash.com";function bl(){const e=["$","€","£","¥","₹","₩","₺","₪","₦","₱","฿"],t=["%","‰","°","×","x","′","″","k","K","M","B"];function r(u){return u.step&&u.step>0?u.step:(u.max-u.min)/100}function a(u){if(!Number.isFinite(u)||u===0)return 0;const[x,T]=String(Number(Math.abs(u).toPrecision(12))).split("e"),o=x.indexOf(".");return Math.max(0,(o<0?0:x.length-o-1)-Number(T??0))}function i(u){return Number.isFinite(u)&&u>0?Math.min(3,a(u)):0}function s(u){return Math.max(i(r(u)),i(Math.abs(u.min)))}function d(u,x,T=x,o=!0){return new Intl.NumberFormat("en-US",{minimumFractionDigits:T,maximumFractionDigits:x,useGrouping:o}).format(u)}function h(u,x,T=!1){const o=typeof x=="number"&&Number.isFinite(x)?x:u.value,y=s(u),_=(u.unit??"").trim(),M=o<0?"-":"",I=e.find(R=>_.startsWith(R)),O=!!I||Math.max(Math.abs(u.min),Math.abs(u.max))>=1e4,G=d(Math.abs(o),y,T?0:y,O);return I?`${M}${I}${G}${_.slice(I.length)}`:_?t.includes(_)||_.startsWith("/")?`${M}${G}${_}`:`${M}${G} ${_}`:M+G}function p(u){const x=u.trim();return x.length>1&&x[1]===x[1].toUpperCase()&&x[1]!==x[1].toLowerCase()?x:x.charAt(0).toLowerCase()+x.slice(1)}function w(u){const x=/([^0-9.]*?)(\d*\.?\d+)/.exec(u.replace(/,/g,""));if(!x)return null;const T=Number(x[2]);return Number.isFinite(T)?/[-\u2212]/.test(x[1])?-T:T:null}function l(u,x){if(!Number.isFinite(x))return u.value;const T=r(u),o=Math.min(u.max,Math.max(u.min,x)),y=T>0?u.min+Math.round((o-u.min)/T)*T:o,_=Math.min(20,Math.max(a(T),a(u.min)));return Math.min(u.max,Math.max(u.min,Number(y.toFixed(_))))}function c(u){if(!u.step||u.step<=0)return null;const x=Math.round((u.max-u.min)/u.step)+1;return x<2||x>5?null:Array.from({length:x},(T,o)=>l(u,u.min+o*(u.step??0)))}function f(u,x){return x==="slider"||x==="stepper"||x==="field"?x:c(u)?"segmented":"slider"}function b(u){if(!(u>0))return 1;const x=10**Math.floor(Math.log10(u)),T=u/x;return(T<=1?1:T<=2?2:T<=2.5?2.5:T<=5?5:10)*x}function v(u){const x=u.filter(O=>Number.isFinite(O)),T=Math.min(0,...x),o=Math.max(0,...x);if(T>=0){const O=b(o);return{min:0,max:O,ticks:[0,O/2,O]}}const y=b((o-T)/3),_=Math.floor(T/y)*y,M=Math.max(y,Math.ceil(o/y)*y),I=[];for(let O=_;O<=M+y/2;O+=y)I.push(Number(O.toPrecision(12)));return{min:_,max:M,ticks:I}}function S(u,x){const T=Math.abs(u)>=1e3?10**(3*Math.floor(Math.log10(Math.abs(u))/3)):1,o=Math.min(3,i(x/T));return new Intl.NumberFormat("en-US",{notation:"compact",maximumFractionDigits:o}).format(u)}function z(u,x,T){if(typeof x=="function")return String(x(u));const o=x?.prefix??"",y=x?.suffix??"";return`${u<0?"-":""}${o}${typeof x?.decimals=="number"?d(Math.abs(u),x.decimals):S(Math.abs(u),T)}${y}`}function H(u,x){const T=u.length,o=T>2,y=I=>o&&I===0?"start":o&&I===T-1?"end":"middle",_=T<=7?Array.from({length:T},(I,O)=>O):Array.from({length:5},(I,O)=>Math.round(O/4*(T-1))),M=[];for(const I of _){const O=y(I),G=u[I],R=O==="start"?x[I]:O==="end"?x[I]-G:x[I]-G/2,g=M.at(-1);if(g&&g.to+6>R){if(I!==T-1||M.length===1)continue;M.pop()}M.push({index:I,anchor:O,to:R+G})}return M.map(({index:I,anchor:O})=>({index:I,anchor:O}))}return{stepOf:r,decimalsOf:i,formatKnob:h,parseKnob:w,lowerFirst:p,snapKnob:l,optionsOf:c,controlOf:f,niceMax:b,axisOf:v,compact:S,formatValue:z,xLabelsOf:H}}function vl(e,t){const n="http://www.w3.org/2000/svg",r=6.720000000000001,a={right:14,top:26,bottom:26};let i=0;const s=new Map;let d=!1,h="";const p=new Map;function w(){if(!d)return;const g=new Set;s.forEach((P,q)=>{q.isConnected&&P.forEach(j=>g.add(j))});const k={title:!!document.querySelector(".lov-title"),knobs:Array.from(g)},A=JSON.stringify(k);A===h||!h&&!k.title&&k.knobs.length===0||(h=A,t.post({kind:"kit",title:k.title,knobs:k.knobs}))}function l(g,k,A){const P=document.createElement(g);return k&&(P.className=k),A!==void 0&&(P.textContent=A),P}function c(g,k,A){const P=document.createElementNS(n,g);for(const q of Object.keys(k))P.setAttribute(q,String(k[q]));return A!==void 0&&(P.textContent=A),P}function f(g,k){const A=e.snapKnob(g,k);if(t.knobs[g.name]===A)return;t.knobs[g.name]=A,b(),t.knobsMoved();const P={};P[g.name]=A,t.post({kind:"knobs",values:P})}function b(){p.forEach(g=>g())}function v(g,k){if(!g||!(g instanceof Element))return g;const A=k&&k.controls||{},P=k&&Array.isArray(k.names)?k.names.map(String):null,q=P?P.flatMap(F=>t.specs.filter(m=>m.name===F)):t.specs;g.classList.add("lov-controls"),g.querySelectorAll(":scope > [data-lov-knob]").forEach(F=>F.remove());const j=[],D=[];for(const F of q){const m=e.controlOf(F,A[F.name]),N=`lov-knob-${++i}`,V=l("div","lov-control"),Y=l("span","lov-label",F.label);Y.id=N;const J=()=>{const B=t.knobs[F.name];return typeof B=="number"?B:F.value};if(m==="slider"){const B=l("div","lov-control-head"),C=l("span","lov-value");B.append(Y,C);const $=document.createElement("input");$.type="range",$.min=String(F.min),$.max=String(F.max),$.step=String(e.stepOf(F)),$.setAttribute("aria-labelledby",N),$.addEventListener("input",()=>f(F,Number($.value))),V.append(B,$),j.push(()=>{const ee=e.formatKnob(F,J());C.textContent=ee,$.value=String(J()),$.setAttribute("aria-valuetext",ee)})}else if(m==="segmented"){const B=l("div","lov-seg");B.setAttribute("role","group"),B.setAttribute("aria-labelledby",N);const C=(e.optionsOf(F)??[]).map($=>{const ee=l("button","",e.formatKnob(F,$,!0));return ee.type="button",ee.addEventListener("click",()=>f(F,$)),B.append(ee),{button:ee,option:$}});V.append(Y,B),j.push(()=>{for(const{button:$,option:ee}of C)$.setAttribute("aria-pressed",String(ee===J()))})}else{const B=document.createElement("input");B.setAttribute("aria-labelledby",N),m==="stepper"?(B.type="number",B.min=String(F.min),B.max=String(F.max),B.step=String(e.stepOf(F))):(B.type="text",B.inputMode="decimal",B.className="lov-field");const C=()=>{B.value=m==="field"?e.formatKnob(F,J()):String(J())};B.addEventListener("change",()=>{const $=e.parseKnob(B.value);$!==null&&f(F,$),C()}),V.append(Y,B),m==="stepper"&&t.stepper(B),j.push(()=>{(document.activeElement!==B||m!=="field")&&C()})}D.push({kind:m,control:V})}s.set(g,q.map(F=>F.name));for(let F=0;F<D.length;F++){const m=D[F+1];if(D[F].kind==="stepper"&&m&&m.kind==="stepper"){const N=l("div","lov-pair");N.append(D[F].control,m.control),N.dataset.lovKnob="",g.append(N),F++}else D[F].control.dataset.lovKnob="",g.append(D[F].control)}const W=()=>j.forEach(F=>F());return W(),p.set(g,W),w(),g}const S=new WeakMap;function z(g){const k=g.series??[];return k.length===0?[]:typeof k[0]=="number"?[{label:"",values:k.map(Number)}]:k.filter(A=>A&&Array.isArray(A.values)).map(A=>({label:A.label?String(A.label):"",values:A.values.map(Number)}))}function H(g,k,A){const P=typeof g=="number"?Math.round(g):k.indexOf(String(g));return P>=0&&P<A?P:-1}function u(g){return g.length*r}function x(g,k,A,P){const q=l("p","lov-sr");q.textContent=A.map(j=>(j.label?`${j.label}: `:"")+j.values.map((D,W)=>`${k[W]??W+1} ${P(D)}`).join(", ")).join(". "),g.append(q)}function T(g,k,A,P){const q=(A[0]?.values??[]).map(m=>Math.max(0,Number.isFinite(m)?m:0)),j=Math.max(0,...q),D=new Set((k.markers??[]).map(m=>H(m.at,P,q.length))),W=m=>e.formatValue(m,k.yFormat,1),F=l("div","lc-funnel");F.setAttribute("aria-hidden","true"),q.forEach((m,N)=>{if(N>0){const J=q[N-1];F.append(l("span"),l("span","lc-step",J>0?`↓ ${Math.round(m/J*100)}%`:"–"),l("span"))}const V=l("span","lc-track"),Y=l("span",D.has(N)?"lc-fbar lc-on":"lc-fbar");Y.style.width=`${j>0?Math.max(2,m/j*100):0}%`,V.append(Y),F.append(l("span","lc-name",P[N]??""),V,l("span","lc-num",W(m)))}),g.append(F),x(g,P,A.slice(0,1),W)}function o(g,k,A){g.textContent="";const P=k.kind??"area",q=z(k),j=Math.max(0,...q.map(L=>L.values.length)),D=(k.labels??[]).map(String);if(P==="funnel")return T(g,k,q,D);if(j===0||A<=0)return;const W=k.target&&Number.isFinite(k.target.value)?k.target:null,F=q.flatMap(L=>L.values).concat(W?[W.value]:[]),m=e.axisOf(F),N=m.ticks.length>1?m.ticks[1]-m.ticks[0]:m.max,V=L=>e.formatValue(L,k.yFormat,N),Y=m.ticks.map(V),J=W&&!m.ticks.includes(W.value)?e.formatValue(W.value,k.yFormat,N/10):"",B=Math.max(28,Math.ceil(Math.max(...Y.concat(J).map(u))+10)),C=k.height&&k.height>0?k.height:Math.round(Math.min(280,Math.max(180,A*.42))),$=Math.max(1,A-B-a.right),ee=Math.max(1,C-a.top-a.bottom),re=P==="bars",Re=$/Math.max(1,j),fe=L=>re?B+Re*L+Re/2:B+(j===1?$/2:L/(j-1)*$),se=L=>a.top+ee-(L-m.min)/(m.max-m.min||1)*ee,de=se(Math.max(m.min,0)),ne=c("svg",{width:A,height:C,"aria-hidden":"true"});if(m.ticks.forEach((L,ae)=>{ne.append(c("line",{class:"lc-grid",x1:B,x2:A-a.right,y1:se(L),y2:se(L)})),ne.append(c("text",{class:"lc-axis",x:B-10,y:se(L),dy:"0.32em","text-anchor":"end"},Y[ae]))}),W){const L=se(W.value);ne.append(c("line",{class:"lc-target",x1:B,x2:A-a.right,y1:L,y2:L})),J&&ne.append(c("text",{class:"lc-axis",x:B-10,y:L,dy:"0.32em","text-anchor":"end"},J)),W.label&&ne.append(c("text",{class:"lc-axis",x:A-a.right,y:L-6,"text-anchor":"end"},W.label))}const ye=q[0],Fe=(k.markers??[]).map(L=>({marker:L,index:H(L.at,D,j)})).filter(L=>L.index>=0),$e=L=>Number.isFinite(ye.values[L])?ye.values[L]:0;if(re){const L=Math.max(4,Math.min(28,Re*.58)),ae=new Set(Fe.map(K=>K.index));ye.values.forEach((K,U)=>{const ie=Number.isFinite(K)?K:0,ge=ie!==0?Math.max(2,Math.abs(de-se(ie))):1,le=ie>=0?de-ge:de;ne.append(c("rect",{class:ae.has(U)?"lc-bar lc-on":"lc-bar",x:fe(U)-L/2,y:le,width:L,height:ge,rx:Math.min(L/2,ge/2)}))})}else{const L=ae=>ae.map((K,U)=>`${U===0?"M":"L"}${fe(U)},${se(Number.isFinite(K)?K:0)}`).join(" ");P==="area"&&j>1&&ne.append(c("path",{class:"lc-area",d:`${L(ye.values)} L${fe(j-1)},${de} L${fe(0)},${de} Z`})),q.slice(1).reverse().forEach((ae,K)=>{const U=q.length-1-K;ne.append(c("path",{class:U===1?"lc-line lc-quiet":"lc-line lc-quieter",d:L(ae.values)}))}),ne.append(c("path",{class:"lc-line",d:L(ye.values)}))}const Ee=Fe.length>0||Array.isArray(k.markers)?Fe:[{marker:{at:j-1},index:j-1}];for(const{marker:L,index:ae}of Ee){const K=fe(ae),U=$e(ae),ie=re?U>=0?se(U):de:se(U);L.guide&&!re&&ne.append(c("line",{class:"lc-guide",x1:K,x2:K,y1:ie,y2:de})),re||ne.append(c("circle",{class:L.hollow?"lc-dot lc-hollow":"lc-dot",cx:K,cy:ie,r:4.5}));const ge=L.label??V(U),le=u(ge);let he="middle",ve=K,me=ie-10;re?K-le/2<B?he="start":K+le/2>A-a.right&&(he="end"):(he=K-8-le<B?"start":"end",ve=he==="start"?K+8:K-8,me=ie-8),ne.append(c("text",{class:"lc-label",x:ve,y:Math.max(12,me),"text-anchor":he},ge))}if(D.length>0){const L=D.slice(0,j),ae=e.xLabelsOf(L.map(u),L.map((K,U)=>fe(U)));for(const{index:K,anchor:U}of ae)ne.append(c("text",{class:"lc-axis",x:fe(K),y:C-6,"text-anchor":U},L[K]))}if(q.length>1&&q.some(L=>L.label)){const L=l("div","lc-legend");L.setAttribute("aria-hidden","true"),q.forEach((ae,K)=>{const U=l("span",K===0?"lc-key":K===1?"lc-key lc-quiet":"lc-key lc-quieter");U.append(l("i"),l("span","",ae.label)),L.append(U)}),g.append(L)}g.append(ne),x(g,D,q,V)}function y(g,k){if(!g||!(g instanceof Element))return null;let A=S.get(g);if(A)A.options=k||{},o(g,A.options,g.clientWidth);else{g.classList.add("lov-chart");const P=new ResizeObserver(()=>{const q=S.get(g);!q||q.redraw!==void 0||(q.redraw=setTimeout(()=>{q.redraw=void 0,!(S.get(g)!==q||g.clientWidth===q.width)&&(q.width=g.clientWidth,o(g,q.options,q.width))},0))});A={options:k||{},width:g.clientWidth,observer:P},S.set(g,A),P.observe(g),o(g,A.options,A.width)}return{update:P=>y(g,P),destroy:()=>{const P=S.get(g);P?.observer.disconnect(),clearTimeout(P?.redraw),S.delete(g)}}}t.onTheme(()=>{for(const g of Array.from(document.querySelectorAll(".lov-chart"))){const k=S.get(g);k&&o(g,k.options,k.width)}});function _(g){if(g.type!=="range")return;const k=g.min===""?0:Number(g.min),A=g.max===""?100:Number(g.max),P=A>k?(Number(g.value)-k)/(A-k)*100:0;g.style.setProperty("--lov-fill",`${Math.min(100,Math.max(0,P))}%`)}for(const g of["value","valueAsNumber"]){const k=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,g);if(!k||!k.set||!k.get)continue;const A=k;Object.defineProperty(HTMLInputElement.prototype,g,{configurable:!0,enumerable:A.enumerable,get(){return A.get?.call(this)},set(P){A.set?.call(this,P),this.type==="range"&&_(this)}})}const M=g=>g.querySelectorAll?.('input[type="range"]').forEach(k=>_(k));document.addEventListener("input",g=>{g.target instanceof HTMLInputElement&&_(g.target)},!0);let I;const O=new WeakMap;function G(){I=void 0;for(const g of Array.from(document.querySelectorAll(".lov-num"))){const k=O.get(g),A=k&&g.style.fontSize===k.set?k.own:g.style.fontSize;g.style.fontSize=A,O.delete(g);const P=g.clientWidth,q=g.scrollWidth;if(!P||q<=P+.5)continue;const j=parseFloat(getComputedStyle(g).fontSize);g.style.fontSize=`${Math.max(j/2,Math.floor(j*P/q*10)/10)}px`,O.set(g,{own:A,set:g.style.fontSize})}}const R=()=>{I===void 0&&document.querySelector(".lov-num")&&(I=setTimeout(G,0))};return document.addEventListener("DOMContentLoaded",()=>{d=!0,w(),M(document),G(),new ResizeObserver(R).observe(document.documentElement),new MutationObserver(g=>{for(const k of g){if(k.type==="attributes"){k.target instanceof HTMLInputElement&&_(k.target);continue}k.addedNodes.forEach(A=>{A instanceof HTMLInputElement?_(A):A instanceof Element&&M(A)})}w(),R()}).observe(document.body,{childList:!0,subtree:!0,characterData:!0,attributes:!0,attributeFilter:["value","min","max"]})}),{chart:y,knobControls:v,knobsChanged:b}}var ml=`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 500 500"><path fill="#fff" d="M0 0h500v500H0z"/><g clip-path="url(#a)"><path fill="#0acf83" d="M200.01 401c27.595 0 49.99-22.475 49.99-50.167v-50.166h-49.99c-27.594 0-49.99 22.474-49.99 50.166S172.416 401 200.01 401"/><path fill="#a259ff" d="M150.02 250.5c0-27.692 22.396-50.167 49.99-50.167H250v100.334h-49.99c-27.594 0-49.99-22.475-49.99-50.167"/><path fill="#f24e1e" d="M150.02 150.167c0-27.692 22.396-50.167 49.99-50.167H250v100.333h-49.99c-27.594 0-49.99-22.474-49.99-50.166"/><path fill="#ff7262" d="M250 100h49.99c27.594 0 49.99 22.475 49.99 50.167s-22.396 50.166-49.99 50.166H250z"/><path fill="#1abcfe" d="M349.98 250.5c0 27.692-22.396 50.167-49.99 50.167S250 278.192 250 250.5s22.396-50.167 49.99-50.167 49.99 22.475 49.99 50.167"/></g><defs><clipPath id="a"><path fill="#fff" d="M150 100h200v301H150z"/></clipPath></defs></svg>
`,wl='<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" fill="none" viewBox="0 0 500 500"><path fill="#24292e" d="M0 0h500v500H0z"/><path fill="#fff" fill-rule="evenodd" d="M250 100c-82.875 0-150 67.125-150 150 0 66.375 42.937 122.437 102.562 142.312 7.5 1.313 10.313-3.187 10.313-7.125 0-3.562-.187-15.375-.187-27.937-37.688 6.937-47.438-9.188-50.438-17.625-1.688-4.313-9-17.625-15.375-21.188-5.25-2.812-12.75-9.75-.187-9.937 11.812-.188 20.25 10.875 23.062 15.375 13.5 22.687 35.063 16.312 43.688 12.375 1.312-9.75 5.249-16.313 9.562-20.063-33.375-3.75-68.25-16.687-68.25-74.062 0-16.313 5.813-29.813 15.375-40.313-1.5-3.75-6.75-19.125 1.5-39.75 0 0 12.563-3.937 41.25 15.375 12-3.375 24.75-5.062 37.5-5.062s25.5 1.687 37.5 5.062c28.688-19.5 41.25-15.375 41.25-15.375 8.25 20.625 3 36 1.5 39.75 9.563 10.5 15.375 23.813 15.375 40.313 0 57.562-35.062 70.312-68.437 74.062 5.437 4.688 10.125 13.688 10.125 27.75 0 20.063-.188 36.188-.188 41.25 0 3.938 2.813 8.625 10.313 7.125C357.063 372.437 400 316.187 400 250c0-82.875-67.125-150-150-150" clip-rule="evenodd"/></svg>',yl='<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" fill="none" viewBox="0 0 500 500"><path fill="#fff" d="M0 0h500v500H0z"/><g transform="translate(86.364 86.363)scale(1.7045)"><path xmlns="http://www.w3.org/2000/svg" fill="url(#a)" d="M146 44h38v110c0 6.627-5.373 12-12 12h-20a6 6 0 0 1-6-6z"/><path xmlns="http://www.w3.org/2000/svg" fill="#fc413d" d="M46 44H8v110c0 6.627 5.373 12 12 12h20a6 6 0 0 0 6-6z"/><path xmlns="http://www.w3.org/2000/svg" fill="url(#b)" d="M39.226 30.456c-8.033-6.752-20.018-5.714-26.77 2.319-6.752 8.032-5.714 20.017 2.319 26.77l76.078 63.949a8 8 0 0 0 10.295 0l76.078-63.95c8.032-6.752 9.07-18.737 2.318-26.77-6.752-8.032-18.737-9.07-26.769-2.318L96 78.18z"/><defs xmlns="http://www.w3.org/2000/svg"><linearGradient id="a" x1="165" x2="165" y1="44" y2="166" gradientUnits="userSpaceOnUse"><stop stop-color="#60d673"/><stop offset=".17" stop-color="#42c868"/><stop offset=".39" stop-color="#0ebc5f"/><stop offset=".62" stop-color="#00a9bb"/><stop offset=".86" stop-color="#3c90ff"/><stop offset="1" stop-color="#3186ff"/></linearGradient><linearGradient id="b" x1="8" x2="184" y1="46.13" y2="46.13" gradientUnits="userSpaceOnUse"><stop offset=".08" stop-color="#ff63a0"/><stop offset=".3" stop-color="#fc413d"/><stop offset=".5" stop-color="#fc413d"/><stop offset=".65" stop-color="#fc413d"/><stop offset=".72" stop-color="#fc5c30"/><stop offset=".86" stop-color="#feb10c"/><stop offset=".91" stop-color="#fec700"/><stop offset=".96" stop-color="#ffdb0f"/></linearGradient></defs></g></svg>',kl='<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" fill="none" viewBox="0 0 500 500"><path fill="#fff" d="M0 0h500v500H0z"/><g transform="translate(66.096 77.594)scale(1.9157)"><path xmlns="http://www.w3.org/2000/svg" fill="#bbe2ff" d="M32 36.8C32 20.894 44.894 8 60.8 8h70.4C147.106 8 160 20.894 160 36.8v30.4c0 15.906-12.894 28.8-28.8 28.8H60.8C44.894 96 32 83.106 32 67.2z"/><path xmlns="http://www.w3.org/2000/svg" fill="#3c90ff" d="M19.867 49.392C17.818 33.82 29.94 20 45.645 20h100.71c15.706 0 27.827 13.82 25.778 29.392L166 96l6.133 46.608C174.182 158.18 162.061 172 146.355 172H45.645c-15.706 0-27.827-13.82-25.778-29.392L26 96z"/><mask xmlns="http://www.w3.org/2000/svg" id="a" width="154" height="152" x="19" y="20" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#3c90ff" d="M19.867 49.392C17.818 33.82 29.94 20 45.645 20h100.71c15.706 0 27.827 13.82 25.778 29.392L166 96l6.133 46.608C174.182 158.18 162.061 172 146.355 172H45.645c-15.706 0-27.827-13.82-25.778-29.392L26 96z"/></mask><g xmlns="http://www.w3.org/2000/svg" mask="url(#a)"><path fill="url(#b)" d="M0 0h166v76H0z" transform="matrix(1 0 0 -1 13 172)"/></g><mask xmlns="http://www.w3.org/2000/svg" id="c" width="154" height="152" x="19" y="20" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#3186ff" d="M19.867 49.392C17.818 33.82 29.94 20 45.645 20h100.71c15.706 0 27.827 13.82 25.778 29.392L166 96l6.133 46.608C174.182 158.18 162.061 172 146.355 172H45.645c-15.706 0-27.827-13.82-25.778-29.392L26 96z"/></mask><g xmlns="http://www.w3.org/2000/svg" mask="url(#c)"><path fill="url(#d)" d="M32 27.2C32 16.596 40.596 8 51.2 8h89.6c10.604 0 19.2 8.596 19.2 19.2V96H32z" filter="url(#e)"/></g><path xmlns="http://www.w3.org/2000/svg" fill="#fff" d="M75.353 133.336q-6.282 0-10.777-2.043t-7.61-5.465q-3.065-3.474-4.342-6.793T51.603 115a2.07 2.07 0 0 1 1.021-1.124l5.67-2.247q.714-.357 1.43-.102.714.204 1.685 2.349 1.022 2.145 2.86 4.546a14.3 14.3 0 0 0 4.495 3.728q2.606 1.328 6.435 1.328 6.18 0 9.807-3.575 3.677-3.575 3.677-9.091 0-5.976-3.882-9.194-3.881-3.269-10.266-3.269h-5.362a1.9 1.9 0 0 1-1.328-.51q-.51-.562-.511-1.277v-5.465q0-.767.51-1.277a1.82 1.82 0 0 1 1.329-.562h4.647q5.721 0 9.194-3.116t3.473-8.07q0-4.902-3.116-7.916t-8.58-3.014q-3.065 0-5.312 1.022a11.5 11.5 0 0 0-3.882 2.86 22.7 22.7 0 0 0-2.809 3.78q-1.174 1.941-1.89 2.145-.714.153-1.379-.255l-5.363-2.605q-.664-.358-.868-1.124t1.226-3.575q1.481-2.86 4.494-5.823a21 21 0 0 1 7.049-4.597q4.035-1.635 9.398-1.634 9.96 0 15.782 5.26 5.823 5.21 5.823 13.791 0 5.925-2.86 10.266-2.81 4.34-7.968 6.13v.204q6.231 1.838 9.806 6.741 3.627 4.853 3.626 11.594 0 9.654-6.742 15.834-6.74 6.18-17.57 6.18zm51.25-1.175q-.868 0-1.533-.664a2.25 2.25 0 0 1-.612-1.583V73.118l-11.492 8.274q-.614.46-1.431.307a1.96 1.96 0 0 1-1.225-.766l-3.32-4.7a1.98 1.98 0 0 1-.358-1.43q.153-.816.817-1.276l20.379-14.557q.256-.204.562-.306.307-.153.715-.153h4.291q.868 0 1.379.613.562.56.562 1.43v69.36q0 .92-.664 1.583a2 2 0 0 1-1.533.664z"/><defs xmlns="http://www.w3.org/2000/svg"><linearGradient id="b" x1="83" x2="83" y1="76" gradientUnits="userSpaceOnUse"><stop stop-color="#4fa0ff"/><stop offset="1" stop-color="#3186ff"/></linearGradient><linearGradient id="d" x1="89.06" x2="89.06" y1="21.75" y2="96.39" gradientUnits="userSpaceOnUse"><stop stop-color="#a9a8ff"/><stop offset=".8" stop-color="#3c90ff"/></linearGradient><filter id="e" width="152" height="112" x="20" y="-4" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_37330_7673" stdDeviation="6"/></filter></defs></g></svg>',_l='<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" fill="none" viewBox="0 0 500 500"><path fill="#fff" d="M0 0h500v500H0z"/><g transform="translate(80.951 82.613)scale(1.7609)"><mask xmlns="http://www.w3.org/2000/svg" id="a" width="128" height="176" x="32" y="8" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#3186ff" d="M130.33 184H61.6c-8.94 0-13.42 0-16.96-1.4a20 20 0 0 1-11.24-11.24c-1.4-3.55-1.4-8.02-1.4-16.96V37.6c0-8.94 0-13.42 1.4-16.96A20 20 0 0 1 44.64 9.4C48.18 8 52.66 8 61.6 8H100l54.8 54.8c1.65 1.65 2.48 2.48 3.12 3.42a12 12 0 0 1 1.87 4.5c.2 1.12.2 2.3.2 4.68-.03 48.92-.05 49.4-.05 78.97 0 8.96 0 13.45-1.4 17a20 20 0 0 1-11.24 11.23c-3.55 1.4-8.02 1.4-16.97 1.4"/></mask><g xmlns="http://www.w3.org/2000/svg" mask="url(#a)"><path fill="#3186ff" d="M159.94 184H32V8h68l60 60z"/><g filter="url(#b)"><path fill="url(#c)" d="M43 192h106V20H43z"/></g></g><path xmlns="http://www.w3.org/2000/svg" fill="#76bbff" d="M155 63c-2.51-1.89-5.62-3-9-3h-33.2A12.8 12.8 0 0 1 100 47.2V8z"/><rect xmlns="http://www.w3.org/2000/svg" width="64" height="12" x="64" y="114" fill="#fff" rx="6"/><rect xmlns="http://www.w3.org/2000/svg" width="48" height="12" x="64" y="143" fill="#fff" rx="6"/><defs xmlns="http://www.w3.org/2000/svg"><linearGradient id="c" x1="96" x2="54.61" y1="59.28" y2="171.34" gradientUnits="userSpaceOnUse"><stop offset=".33" stop-color="#3186ff"/><stop offset="1" stop-color="#a9a8ff"/></linearGradient><filter id="b" width="130" height="196" x="31" y="8" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_37242_8762" stdDeviation="6"/></filter></defs></g></svg>',Sl='<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" fill="none" viewBox="0 0 500 500"><path fill="#fff" d="M0 0h500v500H0z"/><g transform="translate(68.25 65.64)scale(1.8934)"><mask xmlns="http://www.w3.org/2000/svg" id="a" width="168" height="154" x="12" y="18" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#b43333" d="M63.09 37c14.626-25.333 51.193-25.334 65.819 0l45.033 78c14.626 25.334-3.657 57.001-32.91 57.001H50.967c-29.253 0-47.536-31.667-32.91-57.001z"/></mask><g xmlns="http://www.w3.org/2000/svg" mask="url(#a)"><path fill="url(#b)" d="M206.905 172.02h-91.888l-19.015-32.934 45.944-79.578z"/><path fill="url(#c)" d="M-14.919 172.006 50.04 59.494v.002L31.032 92.422h38.02L115 172.004l-129.918.001z"/><path fill="url(#d)" d="M96.007-20.085 141.954 59.5l-19.011 32.928H31.048z"/></g><defs xmlns="http://www.w3.org/2000/svg"><linearGradient id="b" x1="193.6" x2="103.09" y1="165.6" y2="111.21" gradientUnits="userSpaceOnUse"><stop offset=".09" stop-color="#ffe921"/><stop offset="1" stop-color="#fec700"/></linearGradient><linearGradient id="c" x1="114.4" x2="15.53" y1="181.61" y2="121.8" gradientUnits="userSpaceOnUse"><stop offset=".15" stop-color="#a9a8ff"/><stop offset=".33" stop-color="#6d97ff"/><stop offset=".48" stop-color="#3186ff"/></linearGradient><linearGradient id="d" x1="128.88" x2="28.7" y1="37.88" y2="84.64" gradientUnits="userSpaceOnUse"><stop offset=".55" stop-color="#0ebc5f"/><stop offset=".85" stop-color="#78c9ff"/></linearGradient></defs></g></svg>',El='<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" fill="none" viewBox="0 0 500 500"><path fill="#fff" d="M0 0h500v500H0z"/><g transform="translate(70.266 76.542)scale(1.8068)"><path xmlns="http://www.w3.org/2000/svg" fill="#009954" d="M8 74.6c0-8.943 0-13.415 1.404-16.962a20 20 0 0 1 11.234-11.233C24.185 45 28.656 45 37.6 45h60.8c8.943 0 13.415 0 16.962 1.404a20 20 0 0 1 11.234 11.234C128 61.185 128 65.656 128 74.6v42.8c0 8.943 0 13.415-1.404 16.962a20 20 0 0 1-11.234 11.234C111.815 147 107.343 147 98.4 147H37.6c-8.943 0-13.415 0-16.963-1.404a20 20 0 0 1-11.233-11.234C8 130.815 8 126.343 8 117.4z"/><mask xmlns="http://www.w3.org/2000/svg" id="a" width="160" height="128" x="24" y="32" maskUnits="userSpaceOnUse" style="mask-type:alpha"><rect width="160" height="128" x="24" y="32" fill="#0ebc5f" rx="20"/></mask><g xmlns="http://www.w3.org/2000/svg" mask="url(#a)"><path fill="#0ebc5f" d="M24 32h160v128H24z"/><g filter="url(#b)"><rect width="144" height="102" fill="url(#c)" rx="25.6" transform="matrix(1 0 0 -1 8 147)"/></g></g><path xmlns="http://www.w3.org/2000/svg" stroke="#fff" stroke-linecap="round" stroke-width="12" d="M80 121h84m-20 19V76"/><defs xmlns="http://www.w3.org/2000/svg"><linearGradient id="c" x1="122.24" x2="20.76" y1="43.31" y2="43.31" gradientUnits="userSpaceOnUse"><stop stop-color="#0ebc5f"/><stop offset=".95" stop-color="#78c9ff"/></linearGradient><filter id="b" width="168" height="126" x="-4" y="33" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_37435_8174" stdDeviation="6"/></filter></defs></g></svg>',Ml='<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" fill="none" viewBox="0 0 500 500"><path fill="#fe4802" d="M0 0h500v500H0z"/><mask id="mask0_68_9224" width="254" height="300" x="123" y="100" maskUnits="userSpaceOnUse" style="mask-type:luminance"><path fill="#fff" d="M376.024 100H123.812v300h252.212z"/></mask><g mask="url(#mask0_68_9224)"><path fill="#fff" fill-rule="evenodd" d="M316.735 177.348v30.811h-.049c28.221 4.311 50.765 25.494 56.548 53.135s-6.411 55.923-30.586 70.945c-24.176 15.022-55.249 13.622-77.943-3.51l-25.374 25.08a21.5 21.5 0 0 1 1.036 6.291c0 12.154-9.968 22.007-22.265 22.007s-22.266-9.853-22.266-22.007 9.969-22.009 22.266-22.009c2.16.032 4.305.377 6.364 1.025l25.65-25.352a66.87 66.87 0 0 1-1.053-76.123l-84.286-64.855c-11.309 6.416-25.628 4.049-34.209-5.656a26.79 26.79 0 0 1-1.09-34.265c7.947-10.218 22.087-13.471 33.782-7.77s17.691 18.769 14.326 31.221l85.727 65.992a68.5 68.5 0 0 1 32.387-14.085v-30.875c-8.422-3.888-13.821-12.228-13.862-21.416v-.72c.036-13.095 10.766-23.701 24.015-23.736h.729c13.247.035 23.978 10.641 24.014 23.736v.72c-.041 9.188-5.439 17.528-13.861 21.416m-45.585 97.56c-.033 19.155 15.646 34.713 35.026 34.758l.081.017c19.389 0 35.107-15.537 35.107-34.701.009-19.156-15.688-34.695-35.069-34.716-19.38-.021-35.112 15.486-35.145 34.642" clip-rule="evenodd"/></g></svg>',Al='<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" fill="none" viewBox="0 0 500 500"><g clip-path="url(#clip0_68_9228)"><path fill="#0052cc" d="M0 0h500v500H0z"/><path fill="url(#paint0_linear_68_9228)" d="M189.014 238.514c-4.544-5.004-11.36-4.549-14.542 1.365l-73.616 147.384c-2.727 5.914 1.363 12.738 7.725 12.738h102.246c3.181 0 6.361-1.82 7.725-5.004 22.721-45.489 9.088-115.088-29.538-156.483"/><path fill="#fff" d="M243.089 104.775c-40.899 65.05-38.172 137.379-11.362 191.51 27.265 54.133 47.716 95.982 49.533 98.712 1.363 3.184 4.544 5.004 7.725 5.004h102.246c6.361 0 10.906-6.824 7.725-12.738 0 0-137.691-275.664-141.326-282.488-2.726-6.368-10.906-6.368-14.541 0"/></g><defs><linearGradient id="paint0_linear_68_9228" x1="229.232" x2="151.527" y1="261.313" y2="395.762" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".4"/><stop offset=".923" stop-color="#fff"/></linearGradient><clipPath id="clip0_68_9228"><path fill="#fff" d="M0 0h500v500H0z"/></clipPath></defs></svg>',Cl='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 500 500"><path fill="#f4f5f8" d="M0 0h500v500H0z"/><g clip-path="url(#a)"><path fill="#222326" d="M103.676 284.568c-.667-2.845 2.723-4.637 4.789-2.571l109.538 109.537c2.066 2.067.274 5.457-2.571 4.79-55.277-12.968-98.789-56.479-111.756-111.756m-3.67-43.901c-.053.85.266 1.68.868 2.282l156.177 156.176a2.97 2.97 0 0 0 2.282.869 150 150 0 0 0 20.887-2.778c2.293-.471 3.09-3.288 1.434-4.944L107.728 218.345c-1.656-1.655-4.474-.858-4.945 1.435a150 150 0 0 0-2.777 20.887m12.627-51.551a2.96 2.96 0 0 0 .623 3.3l194.328 194.328a2.96 2.96 0 0 0 3.3.623 150 150 0 0 0 15.556-8.052c1.657-.984 1.912-3.26.55-4.622L125.307 173.01c-1.362-1.362-3.638-1.107-4.622.55a150 150 0 0 0-8.052 15.556m25.343-34.894c-1.11-1.11-1.179-2.891-.133-4.062C165.339 119.378 205.334 100 249.856 100 332.778 100 400 167.222 400 250.144c0 44.522-19.378 84.517-50.16 112.013-1.171 1.046-2.952.977-4.062-.133z"/></g><defs><clipPath id="a"><path fill="#fff" d="M100 100h300v300H100z"/></clipPath></defs></svg>',Il='<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" fill="none" viewBox="0 0 500 500"><g clip-path="url(#clip0_68_9226)"><path fill="#fff" d="M0 0h500v500H0z"/><path fill="#fff" d="M118.981 107.061 292.27 94.04c21.035-2.004 26.544-.501 40.067 9.015l55.592 39.065c9.015 6.511 12.02 8.514 12.02 16.026v213.857c0 13.522-5.008 21.536-22.037 22.537l-201.335 12.02c-13.022.501-19.032-1.001-25.543-9.515l-40.567-52.588c-7.513-10.017-10.518-17.028-10.518-25.543V128.597c0-11.018 5.009-20.534 19.032-21.536"/><path fill="#000" fill-rule="evenodd" d="m292.27 94.04-173.289 13.02c-14.023 1.002-19.032 10.518-19.032 21.536v190.317c0 8.514 3.005 16.027 10.518 25.543l40.567 53.088c6.511 8.515 13.022 10.518 25.543 9.516l201.335-12.02c17.029-1.001 22.037-9.015 22.037-22.537V158.146c0-7.011-2.504-9.015-11.018-15.025-.501-.501-1.002-.5-1.503-1.001l-55.091-38.565c-13.022-10.016-18.531-11.018-40.067-9.516M181.084 154.64c-16.527 1.001-20.033 1.502-29.549-6.511l-23.539-18.531c-2.504-2.504-1.503-5.509 5.008-6.01l166.778-12.02c14.024-1.002 21.035 3.506 26.545 8.013l28.547 20.534c1.503.501 4.508 4.007.501 4.007L183.088 154.64zM162.053 370.5V188.697c0-8.013 2.504-11.519 9.516-12.02l197.829-11.519c6.511-.501 9.516 3.506 9.516 11.519v180.301c0 8.013-1.502 14.524-12.02 15.025l-189.315 11.018c-10.518 1.002-15.526-3.005-15.526-12.521m186.811-171.786c1.002 5.509 0 11.018-5.509 11.519l-9.015 2.004V346.46c-8.013 4.508-15.025 6.511-21.035 6.511-9.516 0-12.02-3.005-19.533-12.02l-60.1-94.157v90.651l19.032 4.508s0 11.018-15.025 11.018l-42.07 2.504c-1.002-2.504 0-8.514 4.006-9.516l11.019-3.005v-120.2l-15.025-1.502c-1.002-5.51 2.003-13.523 10.517-14.024l45.075-3.005 62.104 95.159v-84.14l-16.027-2.004c-1.002-6.511 3.506-11.519 9.516-12.02z" clip-rule="evenodd"/></g><defs><clipPath id="clip0_68_9226"><path fill="#fff" d="M0 0h500v500H0z"/></clipPath></defs></svg>',Tl='<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" fill="none" viewBox="0 0 500 500"><path fill="#fff" d="M0 0h500v500H0z"/><g clip-path="url(#clip0_4692_20568)"><path fill="url(#paint0_linear_4692_20568)" d="M312.538 120.376 122.851 240.498l-16.312-25.711v-22.155a23.8 23.8 0 0 1 10.862-19.974l110.264-71.481a50.78 50.78 0 0 1 55.238-.004z"/><path fill="url(#paint1_linear_4692_20568)" d="M281.204 100.121q.855.507 1.697 1.054l86.053 55.766L155.587 292.06l-32.742-51.605L279.437 141.1c14.832-9.412 15.482-30.582 1.767-40.979"/><path fill="url(#paint2_linear_4692_20568)" d="M281.204 100.121q.855.507 1.697 1.054l86.053 55.766L155.587 292.06l-32.742-51.605L279.437 141.1c14.832-9.412 15.482-30.582 1.767-40.979"/><path fill="url(#paint3_linear_4692_20568)" d="m240.716 317.861-85.127-25.799L336.58 177.441c15.243-9.652 15.204-31.885-.073-41.483l-.816-.512 2.348 1.458 55.083 35.698a23.8 23.8 0 0 1 10.865 19.978v21.442z"/><path fill="url(#paint4_linear_4692_20568)" d="m240.716 317.861-85.127-25.799L336.58 177.441c15.243-9.652 15.204-31.885-.073-41.483l-.816-.512 2.348 1.458 55.083 35.698a23.8 23.8 0 0 1 10.865 19.978v21.442z"/><path fill="url(#paint5_radial_4692_20568)" d="M282.903 101.173a50.79 50.79 0 0 0-55.24.004l-110.262 71.481a23.8 23.8 0 0 0-10.862 19.974v1.083a24.47 24.47 0 0 0 11.421 19.9l137.101 86.354 137.448-86.223a24.46 24.46 0 0 0 11.471-20.727v21.005l.005-21.444a23.81 23.81 0 0 0-10.865-19.978z"/><path fill="url(#paint6_linear_4692_20568)" d="M230.893 389.99h121.436c28.522 0 51.643-23.1 51.643-51.595V193.019c0 8.42-4.332 16.25-11.469 20.727l-180.63 113.31a33.4 33.4 0 0 0-15.656 28.295c.002 19.13 15.525 34.639 34.676 34.639"/><path fill="url(#paint7_radial_4692_20568)" d="M230.893 389.99h121.436c28.522 0 51.643-23.1 51.643-51.595V193.019c0 8.42-4.332 16.25-11.469 20.727l-180.63 113.31a33.4 33.4 0 0 0-15.656 28.295c.002 19.13 15.525 34.639 34.676 34.639"/><path fill="url(#paint8_radial_4692_20568)" d="M230.893 389.99h121.436c28.522 0 51.643-23.1 51.643-51.595V193.019c0 8.42-4.332 16.25-11.469 20.727l-180.63 113.31a33.4 33.4 0 0 0-15.656 28.295c.002 19.13 15.525 34.639 34.676 34.639"/><path fill="url(#paint9_radial_4692_20568)" d="M280.268 389.981H158.162c-28.522 0-51.643-23.099-51.643-51.594V192.911a24.47 24.47 0 0 0 11.433 20.704l180.451 113.656a33.97 33.97 0 0 1 15.869 28.742c-.002 18.761-15.226 33.968-34.004 33.968"/><path fill="url(#paint10_linear_4692_20568)" d="M280.268 389.981H158.162c-28.522 0-51.643-23.099-51.643-51.594V192.911a24.47 24.47 0 0 0 11.433 20.704l180.451 113.656a33.97 33.97 0 0 1 15.869 28.742c-.002 18.761-15.226 33.968-34.004 33.968"/><path fill="url(#paint11_radial_4692_20568)" d="M116.854 233.116h78.498c14.832 0 26.854 12.01 26.854 26.829v78.423c0 14.818-12.022 26.828-26.854 26.828h-78.498c-14.832 0-26.854-12.01-26.854-26.828v-78.423c0-14.819 12.022-26.829 26.854-26.829"/><path fill="url(#paint12_radial_4692_20568)" d="M116.854 233.116h78.498c14.832 0 26.854 12.01 26.854 26.829v78.423c0 14.818-12.022 26.828-26.854 26.828h-78.498c-14.832 0-26.854-12.01-26.854-26.828v-78.423c0-14.819 12.022-26.829 26.854-26.829"/><path fill="#fff" d="M155.765 337.129q-16.399-.001-26.923-10.25-10.526-10.249-10.527-26.749 0-17.425 10.684-28.188 10.686-10.76 27.982-10.759 16.344 0 26.605 10.299 10.315 10.301 10.315 27.16-.001 17.322-10.685 27.93-10.632 10.557-27.451 10.557m.316-14.502q8.939 0 14.387-6.099 5.45-6.099 5.449-16.963-.002-11.325-5.289-17.628-5.29-6.304-14.123-6.304-9.1 0-14.651 6.508-5.554 6.459-5.554 17.116 0 10.815 5.554 17.116 5.551 6.254 14.227 6.254"/><path fill="#fff" d="M155.735 338.146q-16.335 0-26.822-10.527-10.485-10.529-10.486-27.478 0-17.9 10.645-28.953 10.645-11.057 27.874-11.056 16.281 0 26.504 10.581 10.276 10.582 10.275 27.901-.001 17.791-10.643 28.689-10.593 10.843-27.347 10.843m.314-14.896q8.907 0 14.333-6.264 5.428-6.266 5.427-17.426 0-11.633-5.268-18.107-5.27-6.475-14.068-6.475-9.066-.001-14.598 6.685-5.532 6.632-5.532 17.581 0 11.108 5.532 17.583 5.533 6.423 14.174 6.423"/></g><defs><linearGradient id="paint0_linear_4692_20568" x1="139.487" x2="312.446" y1="227.873" y2="120.494" gradientUnits="userSpaceOnUse"><stop stop-color="#20a7fa"/><stop offset=".4" stop-color="#3bd5ff"/><stop offset="1" stop-color="#c4b0ff"/></linearGradient><linearGradient id="paint1_linear_4692_20568" x1="199.047" x2="295.252" y1="264.439" y2="110.246" gradientUnits="userSpaceOnUse"><stop stop-color="#165ad9"/><stop offset=".501" stop-color="#1880e5"/><stop offset="1" stop-color="#8587ff"/></linearGradient><linearGradient id="paint2_linear_4692_20568" x1="269.308" x2="162.433" y1="266.535" y2="179.37" gradientUnits="userSpaceOnUse"><stop offset=".237" stop-color="#448aff" stop-opacity="0"/><stop offset=".792" stop-color="#0032b1" stop-opacity=".2"/></linearGradient><linearGradient id="paint3_linear_4692_20568" x1="255.699" x2="424.636" y1="300.063" y2="191.841" gradientUnits="userSpaceOnUse"><stop stop-color="#1a43a6"/><stop offset=".492" stop-color="#2052cb"/><stop offset="1" stop-color="#5f20cb"/></linearGradient><linearGradient id="paint4_linear_4692_20568" x1="303.414" x2="200.785" y1="293.603" y2="204.711" gradientUnits="userSpaceOnUse"><stop stop-color="#0045b9" stop-opacity="0"/><stop offset=".67" stop-color="#0d1f69" stop-opacity=".2"/></linearGradient><linearGradient id="paint6_linear_4692_20568" x1="403.972" x2="254.032" y1="290.431" y2="290.431" gradientUnits="userSpaceOnUse"><stop stop-color="#4dc4ff"/><stop offset=".196" stop-color="#0fafff"/></linearGradient><linearGradient id="paint10_linear_4692_20568" x1="85.518" x2="229.883" y1="355.887" y2="355.783" gradientUnits="userSpaceOnUse"><stop offset=".206" stop-color="#6ce0ff"/><stop offset=".535" stop-color="#50d5ff" stop-opacity="0"/></linearGradient><radialGradient id="paint5_radial_4692_20568" cx="0" cy="0" r="1" gradientTransform="matrix(0 -222.908 241.492 0 255.272 99.532)" gradientUnits="userSpaceOnUse"><stop offset=".568" stop-color="#275ff0" stop-opacity="0"/><stop offset=".992" stop-color="#002177"/></radialGradient><radialGradient id="paint7_radial_4692_20568" cx="0" cy="0" r="1" gradientTransform="matrix(67.6121 -67.5481 67.6121 67.5481 289.076 356.212)" gradientUnits="userSpaceOnUse"><stop offset=".259" stop-color="#0060d1" stop-opacity=".4"/><stop offset=".908" stop-color="#0383f1" stop-opacity="0"/></radialGradient><radialGradient id="paint8_radial_4692_20568" cx="0" cy="0" r="1" gradientTransform="matrix(196.88 -257.803 233.34 177.862 144.794 426.878)" gradientUnits="userSpaceOnUse"><stop offset=".732" stop-color="#f4a7f7" stop-opacity="0"/><stop offset="1" stop-color="#f4a7f7" stop-opacity=".502"/></radialGradient><radialGradient id="paint9_radial_4692_20568" cx="0" cy="0" r="1" gradientTransform="matrix(-94.12 142.936 -371.288 -244.021 210.397 270.527)" gradientUnits="userSpaceOnUse"><stop stop-color="#49deff"/><stop offset=".724" stop-color="#29c3ff"/></radialGradient><radialGradient id="paint11_radial_4692_20568" cx="0" cy="0" r="1" gradientTransform="matrix(118.857 127.001 -127.121 118.745 89.528 238.196)" gradientUnits="userSpaceOnUse"><stop offset=".039" stop-color="#0091ff"/><stop offset=".919" stop-color="#183dad"/></radialGradient><radialGradient id="paint12_radial_4692_20568" cx="0" cy="0" r="1" gradientTransform="matrix(0 92.4565 -106.746 0 156.103 313.552)" gradientUnits="userSpaceOnUse"><stop offset=".558" stop-color="#0fa5f7" stop-opacity="0"/><stop offset="1" stop-color="#74c6ff" stop-opacity=".502"/></radialGradient><clipPath id="clip0_4692_20568"><path fill="#fff" d="M90 93h314v297H90z"/></clipPath></defs></svg>',Pl='<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" fill="none" viewBox="0 0 500 500"><path fill="#fff" d="M0 0h500v500H0z"/><path fill="#e01e5a" d="M163.028 289.577c0 17.345-14.169 31.514-31.514 31.514-17.346 0-31.515-14.169-31.515-31.514 0-17.346 14.169-31.515 31.515-31.515h31.514zm15.882 0c0-17.346 14.169-31.515 31.514-31.515s31.515 14.169 31.515 31.515v78.908c0 17.346-14.17 31.515-31.515 31.515s-31.514-14.169-31.514-31.515z"/><path fill="#36c5f0" d="M210.424 163.029c-17.345 0-31.514-14.169-31.514-31.514 0-17.346 14.169-31.515 31.514-31.515s31.515 14.169 31.515 31.515v31.514zm-.002 15.88c17.346 0 31.515 14.169 31.515 31.514 0 17.346-14.169 31.515-31.515 31.515h-78.908c-17.346 0-31.515-14.169-31.515-31.515 0-17.345 14.169-31.514 31.515-31.514z"/><path fill="#2eb67d" d="M336.969 210.423c0-17.345 14.169-31.514 31.515-31.514 17.345 0 31.514 14.169 31.514 31.514 0 17.346-14.169 31.515-31.514 31.515h-31.515zm-15.881 0c0 17.346-14.17 31.515-31.515 31.515s-31.515-14.169-31.515-31.515v-78.908c0-17.346 14.17-31.515 31.515-31.515s31.515 14.169 31.515 31.515z"/><path fill="#ecb22e" d="M289.573 336.971c17.345 0 31.515 14.169 31.515 31.514 0 17.346-14.17 31.515-31.515 31.515s-31.515-14.169-31.515-31.515v-31.514zm0-15.88c-17.345 0-31.515-14.169-31.515-31.514 0-17.346 14.17-31.515 31.515-31.515h78.909c17.345 0 31.514 14.169 31.514 31.515 0 17.345-14.169 31.514-31.514 31.514z"/></svg>',zl='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 500 500"><path fill="#25d366" d="M0 0h500v500H0z"/><path fill="#fff" fill-rule="evenodd" d="M356.579 143.084a149.17 149.17 0 0 0-95.472-42.788 149.07 149.07 0 0 0-100.074 30.479 149.15 149.15 0 0 0-55.428 88.734 149.1 149.1 0 0 0 16.526 103.31L101.002 400l78.972-20.705a148.65 148.65 0 0 0 71.186 18.145 149.05 149.05 0 0 0 82.672-25.201 149.1 149.1 0 0 0 63.32-152.85 149.1 149.1 0 0 0-40.626-76.278h.053zm-105.38 229.182a123.66 123.66 0 0 1-63.015-17.256l-4.523-2.759-46.94 12.282 12.534-45.587-2.931-4.669a123.8 123.8 0 0 1-18.344-78.003 123.85 123.85 0 0 1 33.266-72.897 123.77 123.77 0 0 1 70.933-37.27 123.82 123.82 0 0 1 78.905 13.979 123.8 123.8 0 0 1 53.824 59.368 123.816 123.816 0 0 1-37.828 146.842 123.8 123.8 0 0 1-75.801 25.97zm67.791-92.726c-3.701-1.884-22.084-10.876-25.427-12.123s-5.876-1.844-8.29 1.883c-2.4 3.727-9.602 12.097-11.791 14.577-2.175 2.48-4.337 2.759-8.064.942a102.3 102.3 0 0 1-29.91-18.33 113 113 0 0 1-20.704-25.785c-2.149-3.727-.225-5.743 1.631-7.587 1.844-1.843 3.727-4.337 5.518-6.512a25.4 25.4 0 0 0 3.701-6.207 6.76 6.76 0 0 0 .676-3.303 6.8 6.8 0 0 0-.981-3.223c-.916-1.884-8.29-20.187-11.46-27.615s-6.101-6.274-8.29-6.38c-2.175-.106-4.642 0-7.122 0a13.5 13.5 0 0 0-5.439 1.3 13.8 13.8 0 0 0-4.469 3.369 41.8 41.8 0 0 0-9.802 13.993 41.8 41.8 0 0 0-3.369 16.739c0 18.33 13.33 35.891 15.187 38.491 1.843 2.599 26.262 40.096 63.506 56.224a208 208 0 0 0 21.208 7.839 51 51 0 0 0 23.437 1.459c7.149-1.074 22.084-9.006 25.121-17.694 3.038-8.701 3.091-16.155 2.176-17.693-.889-1.579-3.197-2.507-7.043-4.364" clip-rule="evenodd"/></svg>',Ol={slack:Pl,gmail:yl,"google-calendar":kl,"google-drive":Sl,"google-docs":_l,"google-sheets":El,notion:Il,linear:Cl,github:wl,figma:ml,whatsapp:zl,hubspot:Ml,jira:Al,outlook:Tl};function ql(e){return Object.entries(Ol).filter(([t])=>new RegExp(`data-app=["']?${t}["'\\s>]`).test(e)).map(([t,n])=>`.lov-logo[data-app="${t}"]{background-image:url("data:image/svg+xml,${encodeURIComponent(n.trim())}")}`).join(`
`)}var Rl=16;function we(e,t,n=0){const r=e.indexOf(t,n);if(r===-1)return null;let a=0;for(let i=e.indexOf("{",r);i<e.length;i++)if(e[i]==="{")a++;else if(e[i]==="}"&&--a===0)return{body:e.slice(e.indexOf("{",r)+1,i),end:i};return null}function Me(e){let t=0,n="";for(const r of e)r==="{"?t++:r==="}"?t--:t===0&&(n+=r);return n.split(";").map(r=>r.trim()).filter(r=>r.startsWith("--")&&!/:\s*initial$/.test(r)).map(r=>r.replace(/(-?\d*\.?\d+)rem\b/g,(a,i)=>`${Number(i)*Rl}px`)).join(";")}function Fl(e,t){const n=we(e,`@utility typestyle-${t} {`);if(!n)throw new Error(`Pulse has no typestyle-${t}`);let r=0,a="";for(const i of n.body)i==="{"?r++:i==="}"?r--:r===0&&(a+=i);return a.split(";").map(i=>i.trim()).filter(i=>i&&!i.startsWith("color")&&!i.startsWith("&")).join(";")}var Ll=String.raw`/* StyleX consumes these variables outside Tailwind's utility graph. */
@theme static {
  --spacing: 0.25rem;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --font-weight-medium: 480;
}

/* Tailwind v4 theme: type and supplemental colors. */
@theme {
  --font-sans: "Camera Plain Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Roboto Mono Variable", monospace;

  --text-2xs: 0.625rem;
  --text-2xs--line-height: inherit;
  --text-xs--line-height: inherit;
  --text-sm--line-height: inherit;
  --text-base: 1rem;
  --text-base--line-height: inherit;
  --text-lg: 1.125rem;
  --text-lg--line-height: inherit;
  --text-xl: 1.25rem;
  --text-xl--line-height: inherit;
  --text-2xl: 1.5rem;
  --text-2xl--line-height: inherit;
  --text-3xl: 1.875rem;
  --text-3xl--line-height: inherit;
  --text-4xl: 2.25rem;
  --text-4xl--line-height: inherit;
  --text-5xl: 3rem;
  --text-5xl--line-height: inherit;
  --text-6xl: 3.75rem;
  --text-6xl--line-height: inherit;
  --text-7xl: 4.5rem;
  --text-7xl--line-height: inherit;
  --text-8xl: 6rem;
  --text-8xl--line-height: inherit;
  --text-9xl: 8rem;
  --text-9xl--line-height: inherit;

  --default-border-width: var(--border-default);

  /* Cleared so rounded-* in pulse-utilities.css owns the numeric scale. */
  --radius-xs: initial;
  --radius-sm: initial;
  --radius-md: initial;
  --radius-lg: initial;
  --radius-xl: initial;
  --radius-2xl: initial;
  --radius-3xl: initial;
  --radius-4xl: initial;

  --color-yellow-50: oklch(98.7% 0.026 102.212);
  --color-yellow-100: oklch(97.3% 0.071 103.193);
  --color-yellow-200: oklch(94.5% 0.129 101.54);
  --color-yellow-300: oklch(90.5% 0.182 98.111);
  --color-yellow-400: oklch(85.2% 0.199 91.936);
  --color-yellow-500: oklch(79.5% 0.184 86.047);
  --color-yellow-600: oklch(68.1% 0.162 75.834);
  --color-yellow-700: oklch(55.4% 0.135 66.442);
  --color-yellow-800: oklch(47.6% 0.114 61.907);
  --color-yellow-900: oklch(42.1% 0.095 57.708);
  --color-yellow-950: oklch(28.6% 0.066 53.813);

  --color-security-risk-critical-fg: #ff1f2d;
  --color-security-risk-critical-bg: rgb(255 31 45 / 10%);
  --color-security-risk-high-fg: #ff5c1a;
  --color-security-risk-high-bg: rgb(255 92 26 / 12%);
  --color-security-risk-medium-fg: #f59e4b;
  --color-security-risk-medium-bg: rgb(245 158 75 / 16%);
  --color-security-risk-low-fg: #eab308;
  --color-security-risk-low-bg: rgb(234 179 8 / 20%);
}
`;function Dl(e,t){const n=[];let r=0;for(;;){const w=we(t,"@theme",r);if(!w)break;n.push(Me(w.body)),r=w.end}const a=we(e,':root, [data-pulse-theme="light"] {'),i=we(e,`
.dark {`),s=we(e,":root { --border-default:"),d=we(e,"/* --- high-DPI border color restore --- */"),h=d&&we(d.body,':root, [data-pulse-theme="light"] {'),p=d&&we(d.body,".dark {");if(!a||!i||!s||!h||!p)throw new Error("Pulse's token blocks moved");return[`:root{${n.join(";")};${Me(s.body)};${Me(a.body)}}`,`:root[data-theme="dark"]{${Me(i.body)}}`,`@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx){:root{--border-default:0.5px;${Me(h.body)}}:root[data-theme="dark"]{${Me(p.body)}}}`].join(`
`)}var Nl=Dl(An,Ll),X=e=>Fl(An,e),Ul=`/*! tailwindcss v4.2.4 | MIT License | https://tailwindcss.com */
@layer theme, base, components, utilities;
@layer theme {
  :root, :host {
    --font-sans: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
    --default-font-family: var(--font-sans);
    --default-mono-font-family: var(--font-mono);
  }
}
@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0 solid;
  }
  html, :host {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji');
    font-feature-settings: var(--default-font-feature-settings, normal);
    font-variation-settings: var(--default-font-variation-settings, normal);
    -webkit-tap-highlight-color: transparent;
  }
  hr {
    height: 0;
    color: inherit;
    border-top-width: 1px;
  }
  abbr:where([title]) {
    -webkit-text-decoration: underline dotted;
    text-decoration: underline dotted;
  }
  h1, h2, h3, h4, h5, h6 {
    font-size: inherit;
    font-weight: inherit;
  }
  a {
    color: inherit;
    -webkit-text-decoration: inherit;
    text-decoration: inherit;
  }
  b, strong {
    font-weight: bolder;
  }
  code, kbd, samp, pre {
    font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace);
    font-feature-settings: var(--default-mono-font-feature-settings, normal);
    font-variation-settings: var(--default-mono-font-variation-settings, normal);
    font-size: 1em;
  }
  small {
    font-size: 80%;
  }
  sub, sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  sub {
    bottom: -0.25em;
  }
  sup {
    top: -0.5em;
  }
  table {
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse;
  }
  :-moz-focusring {
    outline: auto;
  }
  progress {
    vertical-align: baseline;
  }
  summary {
    display: list-item;
  }
  ol, ul, menu {
    list-style: none;
  }
  img, svg, video, canvas, audio, iframe, embed, object {
    display: block;
    vertical-align: middle;
  }
  img, video {
    max-width: 100%;
    height: auto;
  }
  button, input, select, optgroup, textarea, ::file-selector-button {
    font: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    letter-spacing: inherit;
    color: inherit;
    border-radius: 0;
    background-color: transparent;
    opacity: 1;
  }
  :where(select:is([multiple], [size])) optgroup {
    font-weight: bolder;
  }
  :where(select:is([multiple], [size])) optgroup option {
    padding-inline-start: 20px;
  }
  ::file-selector-button {
    margin-inline-end: 4px;
  }
  ::placeholder {
    opacity: 1;
  }
  @supports (not (-webkit-appearance: -apple-pay-button))  or (contain-intrinsic-size: 1px) {
    ::placeholder {
      color: currentcolor;
      @supports (color: color-mix(in lab, red, red)) {
        color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }
  }
  textarea {
    resize: vertical;
  }
  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  ::-webkit-date-and-time-value {
    min-height: 1lh;
    text-align: inherit;
  }
  ::-webkit-datetime-edit {
    display: inline-flex;
  }
  ::-webkit-datetime-edit-fields-wrapper {
    padding: 0;
  }
  ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datetime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-datetime-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-datetime-edit-meridiem-field {
    padding-block: 0;
  }
  ::-webkit-calendar-picker-indicator {
    line-height: 1;
  }
  :-moz-ui-invalid {
    box-shadow: none;
  }
  button, input:where([type='button'], [type='reset'], [type='submit']), ::file-selector-button {
    appearance: button;
  }
  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
    height: auto;
  }
  [hidden]:where(:not([hidden='until-found'])) {
    display: none !important;
  }
}
@layer utilities;`,Xn="lov-mini-app",nd=e=>/^[a-z0-9_-]{1,64}$/.test(e),jl=4e3,$l=5e4;var Hl=1e5;var Bl="https://fonts.googleapis.com/";function Gl(e){return[["default-src 'none'",`script-src 'nonce-${e}'`,"style-src 'unsafe-inline' https://fonts.googleapis.com","font-src https://fonts.gstatic.com","img-src data:","form-action 'none'","base-uri 'none'"].join("; "),`script-src 'unsafe-inline' ${Yn.map(t=>t.src).join(" ")}`]}var an="font:inherit;font-size:14px;line-height:1.5;font-weight:400;letter-spacing:normal;box-sizing:border-box;height:36px;padding:0 14px;border:0;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:4px;white-space:nowrap;color:var(--ink);background:transparent;box-shadow:inset 0 0 0 1px var(--rim);cursor:pointer;transition:background-color 120ms,box-shadow 120ms,opacity 120ms",on="background:var(--bar)",ut="opacity:.5;cursor:default",sn="background:var(--ink);color:var(--page);box-shadow:none;font-weight:500",Vl="font:inherit;font-size:13px;line-height:18px;font-weight:400;letter-spacing:normal;box-sizing:border-box;flex:0 1 auto;min-width:0;height:auto;padding:5px 10px;border:0;border-radius:999px;display:block;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--muted);background:transparent;box-shadow:none;cursor:pointer;transition:background-color 120ms,color 120ms,box-shadow 120ms",Ql="@container lov-app (width < 900px)",Kl="@container lov-app (width < 440px)",ln=e=>`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${e}' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E")`,Wl=`
:root{--ink:oklch(10% 0 0);--muted:oklch(30% 0.001 107);--faint:oklch(50% 0.001 107);--quiet:oklch(69% 0.001 107);--page:oklch(98.51% 0 107);--accent:oklch(43.93% 0.2138 264.41);--raised:oklch(100% 0 0);--grid:oklch(85.12% 0 107 / 0.4);--area:oklch(56.74% 0.009 106.68 / 16%);--attention:oklch(49.33% 0.1528 40.04);--positive:oklch(45.82% 0.1382 138.23);--shadow:oklch(0% 0 0 / 15%);color-scheme:light}
:root[data-theme="dark"]{--ink:oklch(100% 0 0);--muted:oklch(90.95% 0.002 107);--faint:oklch(72.34% 0.002 107);--quiet:oklch(56.74% 0.002 107);--page:oklch(24.74% 0.002 107);--accent:oklch(70.62% 0.1391 264.41);--raised:oklch(34% 0.002 107);--grid:oklch(34.74% 0.004 107 / 0.4);--area:oklch(56.74% 0.009 106.68 / 8%);--attention:oklch(75.82% 0.1594 40.04);--positive:oklch(72.92% 0.155 138.23);--shadow:oklch(0% 0 0 / 40%);color-scheme:dark}
:root:not([data-lov-shown]){opacity:0}
:root{--line:color-mix(in srgb,var(--ink) 20%,transparent);--rim:color-mix(in srgb,var(--ink) 25%,transparent);--bar:color-mix(in srgb,var(--ink) 10%,transparent);--track:color-mix(in srgb,var(--ink) 16%,transparent);--hair:oklch(55% 0.002 107 / 0.16)}
@layer base{
html,body{background:var(--page);color:var(--ink);font-family:"Camera Plain Variable",ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:14px;line-height:1.45;-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent}
body{min-height:100vh;box-sizing:border-box}
*,*::before,*::after{box-sizing:border-box}
button:not([data-kit-none]){${an}}
button:not([data-kit-none]):hover{${on}}
button:not([data-kit-none]):disabled{${ut}}
button.primary:not([data-kit-none]),button[data-primary]:not([data-kit-none]){${sn}}
button.primary:not([data-kit-none]):hover,button[data-primary]:not([data-kit-none]):hover{opacity:.85}
input:not([type=range]):not([type=checkbox]):not([type=radio]):not([data-kit-none]),select:not([data-kit-none]),textarea:not([data-kit-none]){font:inherit;font-size:14px;color:var(--ink);background:transparent;border:1px solid var(--line);border-radius:10px;padding:0 12px;outline:none}
input:not([type=range]):not([type=checkbox]):not([type=radio]):not([data-kit-none]),select:not([data-kit-none]){box-sizing:border-box;height:36px}
textarea:not([data-kit-none]){padding:8px 12px}
input:focus-visible,select:focus-visible,textarea:focus-visible{border-color:var(--ink)}
input:is([type=checkbox],[type=radio]):not([data-kit-none]){-webkit-appearance:none;appearance:none;flex-shrink:0;width:18px;height:18px;margin:0;border:0;border-radius:5px;background:transparent no-repeat center/12px 12px;box-shadow:inset 0 0 0 1.5px var(--rim);vertical-align:-4px;cursor:pointer;transition:background-color 120ms,box-shadow 120ms}
input[type=radio]:not([data-kit-none]){border-radius:999px}
input[type=checkbox]:not([data-kit-none]):checked{background-color:var(--ink);background-image:${ln("white")};box-shadow:none}
:root[data-theme="dark"] input[type=checkbox]:not([data-kit-none]):checked{background-image:${ln("black")}}
input[type=radio]:not([data-kit-none]):checked{box-shadow:inset 0 0 0 5px var(--ink)}
input:is([type=checkbox],[type=radio]):not([data-kit-none]):disabled{opacity:.5;cursor:default}
input:is([type=checkbox],[type=radio])[data-kit-none]{accent-color:var(--ink)}
label:has(>input:is([type=checkbox],[type=radio]):not([data-kit-none])){display:flex;align-items:center;gap:10px;min-height:28px;font-size:14px;line-height:20px;color:var(--ink);cursor:pointer}
input[type=range]:not([data-kit-none]){-webkit-appearance:none;appearance:none;height:18px;margin:0;padding:0;background:transparent;cursor:pointer}
input[type=range]:not([data-kit-none])::-webkit-slider-runnable-track{height:4px;border-radius:999px;background:linear-gradient(to right,var(--ink) var(--lov-fill,0%),var(--track) var(--lov-fill,0%))}
input[type=range]:not([data-kit-none])::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:16px;height:16px;margin-top:-6px;border:0;border-radius:999px;background:var(--raised);box-shadow:0 0 0 1px var(--shadow),0 1px 3px var(--shadow)}
input[type=range]:not([data-kit-none])::-moz-range-track{height:4px;border-radius:999px;background:var(--track)}
input[type=range]:not([data-kit-none])::-moz-range-progress{height:4px;border-radius:999px;background:var(--ink)}
input[type=range]:not([data-kit-none])::-moz-range-thumb{width:16px;height:16px;border:0;border-radius:999px;background:var(--raised);box-shadow:0 0 0 1px var(--shadow),0 1px 3px var(--shadow)}
input[type=range][data-kit-none]{accent-color:var(--ink)}
input[type=number]{-moz-appearance:textfield;appearance:textfield}
input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
.lov-step{position:relative;display:inline-flex;align-items:stretch;max-width:100%}
.lov-step:not(.lov-step-narrow)>input{padding-right:58px!important}
.lov-step>input{width:100%}
.lov-step-narrow>span{display:none}
.lov-step>span{position:absolute;right:6px;top:0;bottom:0;display:flex;align-items:center;gap:2px}
.lov-step button{all:unset;box-sizing:border-box;cursor:pointer;color:var(--faint);width:24px;height:24px;display:grid;place-items:center;border-radius:999px;transition:color 120ms,background-color 120ms}
.lov-step button:hover{color:var(--ink);background:var(--bar)}
.lov-step button svg{width:10px;height:10px;display:block}
:focus-visible{outline:2px solid color-mix(in srgb,var(--ink) 60%,transparent);outline-offset:2px}
::selection{background:color-mix(in srgb,var(--accent) 30%,transparent)}
}
.lov-btn{${an}}
.lov-btn:hover{${on}}
.lov-btn:disabled{${ut}}
.lov-btn.lov-btn-primary{${sn}}
.lov-btn.lov-btn-primary:hover{background:var(--ink);opacity:.85}
.lov-seg{box-sizing:border-box;display:inline-flex;align-items:stretch;max-width:100%;gap:2px;padding:2px;border-radius:999px;background:var(--bar)}
.lov-seg>button{${Vl}}
.lov-seg>button:hover{color:var(--ink);background:transparent}
.lov-seg>button[aria-pressed=true]{background:var(--raised);color:var(--ink);box-shadow:0 1px 2px var(--shadow)}
.lov-seg>button:disabled{${ut}}
.lov-app{container:lov-app/inline-size;width:100%;display:flex;flex-direction:column;gap:12px;min-width:0}
.lov-title{margin:0 0 4px;font-size:20px;line-height:1.25;letter-spacing:-.01em;font-weight:400;color:var(--ink);text-wrap:balance}
.lov-grid{display:grid;gap:12px;grid-template-columns:minmax(0,1fr) clamp(260px,36%,380px);align-items:stretch}
.lov-grid.lov-side-left{grid-template-columns:clamp(260px,36%,380px) minmax(0,1fr)}
.lov-grid.lov-side-left>.lov-side{order:-1}
.lov-grid.lov-even{grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))}
.lov-main,.lov-side,.lov-stack{display:flex;flex-direction:column;gap:12px;min-width:0}
.lov-panel{min-width:0;display:flex;flex-direction:column;gap:16px;padding:20px 24px 24px;border:1px solid var(--hair);border-radius:22px}
.lov-panel-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:4px 12px}
.lov-panel-title{margin:0;font-size:16px;line-height:1.4;font-weight:400;color:var(--ink)}
.lov-aside{font-size:12px;line-height:1.5;color:var(--faint)}
.lov-panel:has(>.lov-stats){container:lov-stats-panel/inline-size}
.lov-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:20px 28px}
.lov-stat{display:flex;flex-direction:column;gap:10px;min-width:0}
.lov-stat-head{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.lov-label{font-size:12px;line-height:1.5;color:var(--muted)}
.lov-num{display:block;font-size:38px;line-height:1.1;letter-spacing:-.02em;font-weight:400;color:var(--ink);white-space:nowrap;font-variant-numeric:tabular-nums}
.lov-stat.lov-secondary{gap:6px}
.lov-stat.lov-secondary .lov-num,.lov-num.lov-secondary{font-size:24px;line-height:28px;letter-spacing:-.01em}
.lov-note{font-size:12px;line-height:1.5;color:var(--faint)}
.lov-badge{display:inline-flex;align-items:center;gap:6px;flex-shrink:0;padding:1px 8px;border:1px solid var(--hair);border-radius:999px;font-size:12px;line-height:1.5;color:var(--muted);white-space:nowrap}
.lov-badge::before{content:"";width:6px;height:6px;border-radius:999px;background:currentColor}
.lov-badge.lov-attention{color:var(--attention)}
.lov-badge.lov-positive{color:var(--positive)}
.lov-badge.lov-count{color:var(--ink);font-variant-numeric:tabular-nums}
.lov-badge.lov-count::before{display:none}
.lov-controls{display:flex;flex-direction:column;gap:18px;min-width:0}
.lov-control{display:flex;flex-direction:column;gap:6px;min-width:0}
.lov-control:has(>.lov-control-head){gap:8px}
.lov-control-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px}
.lov-value{font-size:12px;line-height:1.5;color:var(--ink);font-variant-numeric:tabular-nums;white-space:nowrap}
.lov-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.lov-control>.lov-seg,.lov-panel .lov-seg,:is(.lov-app,.lov-main,.lov-side,.lov-stack)>.lov-seg{display:flex;width:100%}
.lov-control>.lov-seg>button,.lov-panel .lov-seg>button,:is(.lov-app,.lov-main,.lov-side,.lov-stack)>.lov-seg>button{flex:1 1 0;padding-left:4px;padding-right:4px}
.lov-checks{display:flex;flex-direction:column;gap:2px;min-width:0}
.lov-check{display:flex;align-items:center;gap:10px;min-height:28px;font-size:14px;line-height:20px;color:var(--ink);cursor:pointer}
.lov-stage{position:relative;display:grid;place-items:center;min-width:0;min-height:240px;padding:20px;overflow:hidden;border:1px solid var(--hair);border-radius:22px;background:color-mix(in srgb,var(--ink) 3%,var(--page))}
.lov-stage.lov-flush{padding:0}
.lov-stage>:is(canvas,svg,img){display:block;max-width:100%;height:auto}
.lov-control>.lov-step{display:flex;width:100%}
.lov-control>input,.lov-field{width:100%}
.lov-list{display:flex;flex-direction:column;min-width:0}
:where(button.lov-item){all:unset}
.lov-item{box-sizing:border-box;display:flex;align-items:center;gap:12px;width:100%;min-width:0;padding:7px 0;border-bottom:1px solid var(--hair);color:var(--ink);font-size:14px;line-height:20px;text-align:left}
.lov-item:last-child{border-bottom:0}
button.lov-item{cursor:pointer}
button.lov-item:hover .lov-item-name{opacity:.75}
.lov-item:focus-visible{outline:2px solid color-mix(in srgb,var(--ink) 60%,transparent);outline-offset:2px;border-radius:4px}
.lov-item>svg{flex-shrink:0;width:22px;height:22px}
.lov-swatch{flex-shrink:0;width:22px;height:22px;border-radius:7px;box-shadow:inset 0 0 0 1px var(--hair)}
.lov-item-name{flex:1;min-width:0;overflow-wrap:anywhere}
.lov-item-value{flex-shrink:0;font-size:12px;line-height:1.5;color:var(--faint);font-variant-numeric:tabular-nums}
.lov-chart{display:flex;flex-direction:column;gap:12px;width:100%;min-width:0}
.lov-chart svg{display:block;overflow:visible;user-select:none}
.lov-chart text{font-family:inherit;font-size:12px;font-variant-numeric:tabular-nums}
.lc-grid{stroke:var(--grid)}
.lc-axis{fill:var(--faint)}
.lc-label{fill:var(--ink)}
.lc-area{fill:var(--area)}
.lc-line{fill:none;stroke:var(--ink);stroke-width:1.75;stroke-linejoin:round;stroke-linecap:round}
.lc-line.lc-quiet{stroke:var(--faint);stroke-width:1.5}
.lc-line.lc-quieter{stroke:var(--quiet);stroke-width:1.5}
.lc-target{stroke:var(--ink);stroke-dasharray:4 4;opacity:.5}
.lc-guide{stroke:var(--line)}
.lc-dot{fill:var(--ink);stroke:var(--page);stroke-width:2}
.lc-dot.lc-hollow{fill:var(--page);stroke:var(--ink)}
.lc-bar{fill:var(--faint)}
.lc-bar.lc-on{fill:var(--ink)}
.lc-legend{display:flex;flex-wrap:wrap;gap:6px 20px;font-size:12px;line-height:1.5;color:var(--muted)}
.lc-key{display:inline-flex;align-items:center;gap:8px}
.lc-key>i{width:14px;height:2px;border-radius:2px;background:var(--ink)}
.lc-key.lc-quiet>i{background:var(--faint)}
.lc-key.lc-quieter>i{background:var(--quiet)}
.lc-funnel{display:grid;grid-template-columns:minmax(0,auto) minmax(0,1fr) auto;align-items:center;gap:0 16px;font-size:12px;line-height:1.5}
.lc-name{max-width:11rem;color:var(--ink);overflow-wrap:anywhere}
.lc-track{display:flex;justify-content:center}
.lc-fbar{display:block;height:28px;border-radius:5px;background:var(--faint)}
.lc-fbar.lc-on{background:var(--ink)}
.lc-num{color:var(--ink);font-size:14px;text-align:right;font-variant-numeric:tabular-nums}
.lc-step{padding:6px 0;text-align:center;color:var(--faint);font-variant-numeric:tabular-nums}
.lov-sr{position:absolute;width:1px;height:1px;margin:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
${Ql}{
.lov-grid,.lov-grid.lov-side-left,.lov-grid.lov-even{grid-template-columns:minmax(0,1fr)}
.lov-grid.lov-side-left>.lov-side{order:0}
.lov-panel{padding:18px 18px 20px;border-radius:20px}
.lov-num{font-size:36px}
}
${Kl}{
.lov-pair{grid-template-columns:minmax(0,1fr)}
.lov-stage{padding:14px;border-radius:18px}
}
@container lov-stats-panel (width < 620px){
.lov-stats{grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 0}
.lov-stats>.lov-stat:first-child{grid-column:1/-1;gap:8px}
.lov-stats>.lov-stat:not(:first-child){gap:6px;padding-top:14px;border-top:1px solid var(--hair)}
.lov-stats>.lov-stat:not(:first-child):nth-child(even){padding-right:16px}
.lov-stats>.lov-stat:not(:first-child) .lov-num{font-size:24px;line-height:28px;letter-spacing:-.01em}
}`,Yl=`
:root{--soft:color-mix(in srgb,var(--ink) 5.5%,transparent);--lov-chevron:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E")}
html:has(.lov-view),body:has(.lov-view){background:transparent}
/* A card's surface draws its ring and shadow outside its box: the frame leaves room for them (ChatView pulls it back). */
body:has(.lov-view){padding:4px 4px 12px}
/* A card drawn as a bubble (the card message's bubble) takes the chat bubbles' grey, ring, radius and padding, with its
   insets lifted to the white the card had; its ring needs 4px all round. In a run its left corners meet the bubbles next
   to it the way theirs meet, pointed; data-lov-bubble names the ends that round. */
body:has(.lov-view[data-lov-bubble]){padding:4px}
.lov-view[data-lov-bubble] :is(.lov-card,.lov-tile){--surface-shadow-base:var(--bg-depth);--surface-shadow-highlight:white;background:var(--bg-depth);box-shadow:var(--shadow-surface-xs);border-radius:calc(var(--spacing) * 6)}
.lov-view[data-lov-bubble] .lov-card{padding:calc(var(--spacing) * 3) calc(var(--spacing) * 4)}
.lov-view[data-lov-bubble]>.lov-card{border-top-left-radius:var(--spacing);border-bottom-left-radius:var(--spacing)}
.lov-view[data-lov-bubble~=top]>.lov-card:nth-child(1 of .lov-card){border-top-left-radius:calc(var(--spacing) * 6)}
.lov-view[data-lov-bubble~=bottom]>.lov-card:nth-last-child(1 of .lov-card){border-bottom-left-radius:calc(var(--spacing) * 6)}
.lov-view[data-lov-bubble] :is(.lov-icon:not(:has(>.lov-logo)),.lov-why,.lov-log,.lov-draft){background:var(--bg-secondary)}
.lov-view[data-lov-bubble] .lov-card .lov-tile{background:var(--bg-secondary);box-shadow:none;border-radius:calc(var(--spacing) * 4)}
:where(.lov-view) :where(.lov-card,.lov-cards,.lov-tiles,.lov-stack)+:where(.lov-card,.lov-cards,.lov-tiles,.lov-stack){margin-top:12px}
.lov-view{max-width:var(--lov-card-width);min-width:0;--lov-card-width:calc(var(--spacing) * 144)}
.lov-view[data-lov-full-width]{--lov-card-width:none}
.lov-cards{display:grid;gap:calc(var(--spacing) * 3);grid-template-columns:minmax(0,1fr);max-width:var(--lov-card-width)}
.lov-card{box-sizing:border-box;display:flex;flex-direction:column;gap:calc(var(--spacing) * 3);min-width:0;max-width:var(--lov-card-width);padding:calc(var(--spacing) * 4);background:var(--bg-secondary);border:0;border-radius:calc(var(--spacing) * 4);box-shadow:var(--shadow-surface-md)}
.lov-cards>.lov-card{max-width:none;margin-top:0}
.lov-card-head{display:flex;align-items:center;justify-content:space-between;gap:12px;min-width:0}
.lov-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;min-width:0}
.lov-card-top>div{display:flex;flex-direction:column;gap:2px;min-width:0}
.lov-card-title{margin:0;${X("title-lg")};color:var(--fg-primary);text-wrap:balance}
.lov-card-name{margin:0;${X("title-base")};color:var(--fg-primary)}
.lov-card-sub{margin:0;${X("body-sm")};color:var(--fg-tertiary)}
.lov-card-text{margin:0;${X("body-sm")};color:var(--fg-primary);text-wrap:pretty}
.lov-card-aside{${X("body-xs")};color:var(--fg-tertiary);white-space:nowrap;font-variant-numeric:tabular-nums}
.lov-tag{display:inline-flex;align-items:center;gap:6px;align-self:flex-start;padding:4px 10px;border-radius:999px;background:var(--bg-muted);${X("title-xs")};color:var(--fg-primary);white-space:nowrap}
.lov-tag>svg,.lov-status>svg,.lov-draft-to>svg,.lov-log>svg{width:15px;height:15px;flex-shrink:0}
.lov-status{display:inline-flex;align-items:center;gap:5px;flex-shrink:0;padding:2px 9px;border-radius:999px;${X("title-xs")};white-space:nowrap;color:var(--fg-accent);background:var(--bg-accent-translucent)}
.lov-status.lov-quiet{color:var(--fg-secondary);background:var(--bg-muted)}
.lov-status.lov-positive{color:var(--fg-positive);background:var(--bg-positive-translucent)}
.lov-status.lov-attention{color:var(--fg-attention);background:var(--bg-attention-translucent)}
.lov-facts{display:flex;flex-direction:column;margin:0;border-top:var(--border-default) solid var(--border-primary)}
.lov-fact{display:flex;align-items:baseline;justify-content:space-between;gap:calc(var(--spacing) * 4);padding:calc(var(--spacing) * 3) 0;border-bottom:var(--border-default) solid var(--border-primary);${X("body-sm")}}
.lov-fact>:first-child{color:var(--fg-secondary)}
.lov-fact>:last-child{color:var(--fg-primary);font-weight:var(--font-weight-medium);text-align:right;font-variant-numeric:tabular-nums}
.lov-source{display:flex;align-items:center;gap:8px;min-width:0;${X("body-xs")};color:var(--fg-secondary)}
.lov-source>svg{width:16px;height:16px;flex-shrink:0}
.lov-source>span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lov-source>time{margin-left:auto;flex-shrink:0;color:var(--fg-tertiary);font-variant-numeric:tabular-nums}
.lov-meta{display:grid;grid-template-columns:auto minmax(0,1fr);gap:8px 20px;margin:0;${X("body-sm")}}
.lov-meta>dt{color:var(--fg-tertiary)}
.lov-meta>dd{margin:0;color:var(--fg-primary);overflow-wrap:anywhere}
.lov-body{padding-top:calc(var(--spacing) * 3);border-top:var(--border-default) solid var(--border-primary);${X("body-sm")};color:var(--fg-primary);white-space:pre-wrap;overflow-wrap:anywhere}
details.lov-more{border-top:var(--border-default) solid var(--border-primary);padding-top:12px}
.lov-view details>summary::after{content:"";display:inline-block;width:14px;height:14px;margin-left:4px;vertical-align:-2px;background:currentColor;-webkit-mask:var(--lov-chevron) center/contain no-repeat;mask:var(--lov-chevron) center/contain no-repeat;transition:transform 200ms cubic-bezier(0.165,0.84,0.44,1)}
.lov-view details[open]>summary::after{transform:rotate(90deg)}
@media (prefers-reduced-motion:reduce){.lov-view details>summary::after{transition:none}}
details.lov-more>.lov-body{border-top:0;padding-top:8px;color:var(--muted)}
.lov-actions>.lov-btn.lov-wide,.lov-actions.lov-fill>.lov-btn.lov-wide{flex:1 1 100%}
:where(button.lov-next){all:unset}
.lov-next{box-sizing:border-box;display:block;width:100%;padding-top:14px;border-top:var(--border-default) solid var(--border-primary);text-align:center;font-size:14px;line-height:20px;color:var(--ink);cursor:pointer}
.lov-next::after{content:" ›";color:var(--faint)}
.lov-next:hover{opacity:.75}
details.lov-rest{border-top:var(--border-default) solid var(--border-primary);padding-top:14px}
details.lov-rest[open]{padding-top:0}
details.lov-rest[open]>summary{display:none}
details.lov-rest>div{display:flex;flex-direction:column;gap:12px;padding-top:14px}
.lov-row>.lov-btn{flex-shrink:0}
.lov-why{display:flex;align-items:flex-start;gap:10px;padding:calc(var(--spacing) * 3) calc(var(--spacing) * 3.5);border-radius:calc(var(--spacing) * 3);background:var(--bg-depth);${X("body-sm")};color:var(--fg-primary)}
.lov-why::before{content:"";flex-shrink:0;width:18px;height:18px;margin-top:1px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23FF8A3D'/%3E%3Cstop offset='.5' stop-color='%23FF4D8D'/%3E%3Cstop offset='1' stop-color='%236A7CFF'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23g)' d='M12 21.2c-.4 0-.8-.1-1.1-.4C6.6 17.4 2.5 14 2.5 9.4 2.5 6.4 4.8 4 7.7 4c1.8 0 3.3.9 4.3 2.3C13 4.9 14.5 4 16.3 4c2.9 0 5.2 2.4 5.2 5.4 0 4.6-4.1 8-8.4 11.4-.3.3-.7.4-1.1.4z'/%3E%3C/svg%3E") center/contain no-repeat}
.lov-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.lov-actions.lov-fill>.lov-btn{flex:1 1 0}
.lov-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;min-width:0}
.lov-foot>span{min-width:0;${X("body-xs")};color:var(--fg-tertiary)}
.lov-progress{display:block;height:4px;border-radius:999px;background:var(--bar);overflow:hidden}
.lov-progress>i{display:block;height:100%;border-radius:inherit;background:var(--ink)}
.lov-progress.lov-accent>i{background:var(--accent)}
.lov-log{display:flex;align-items:center;gap:8px;min-width:0;padding:9px 12px;border-radius:calc(var(--spacing) * 3);background:var(--bg-depth);${X("body-xs")};color:var(--fg-secondary)}
.lov-log{align-items:flex-start}
.lov-log>svg{margin-top:1.5px}
.lov-log>span{min-width:0;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow-wrap:anywhere}
.lov-draft{display:flex;flex-direction:column;gap:6px;padding:calc(var(--spacing) * 3) calc(var(--spacing) * 3.5);border-radius:calc(var(--spacing) * 3);background:var(--bg-depth)}
.lov-draft-to{display:flex;align-items:center;gap:6px;${X("body-xs")};color:var(--fg-tertiary)}
.lov-draft-body{margin:0;${X("body-sm")};color:var(--fg-primary);white-space:pre-wrap}
.lov-editor{display:block;box-sizing:border-box;width:100%;min-height:84px;margin:0;padding:10px 12px;resize:none;overflow:hidden;border:0;border-radius:12px;background:var(--raised);box-shadow:inset 0 0 0 1px var(--rim);font:inherit;font-size:14px;line-height:21px;color:var(--ink);outline:none}
.lov-editor:focus{box-shadow:inset 0 0 0 1.5px var(--accent)}
.lov-row{display:flex;align-items:center;gap:12px;min-width:0}
.lov-row-main{display:flex;flex-direction:column;gap:1px;flex:1;min-width:0}
.lov-row-name{${X("title-sm")};color:var(--fg-primary)}
.lov-row-sub{${X("body-xs")};color:var(--fg-tertiary)}
.lov-icon{flex-shrink:0;display:grid;place-items:center;width:40px;height:40px;border-radius:calc(var(--spacing) * 3);background:var(--bg-depth);color:var(--fg-secondary)}
.lov-icon>svg{width:18px;height:18px}
.lov-logo{display:inline-block;flex-shrink:0;width:16px;height:16px;border-radius:4px;background:var(--raised) center/cover no-repeat;box-shadow:inset 0 0 0 1px var(--hair)}
.lov-icon:has(>.lov-logo){background:transparent}
.lov-draft-to>.lov-logo,.lov-source>.lov-logo,.lov-tag>.lov-logo{width:18px;height:18px;border-radius:5px}
.lov-icon>.lov-logo{width:100%;height:100%;border-radius:inherit}
.lov-time+.lov-row-main>.lov-row-name{font-size:17px;line-height:22px}
.lov-time{flex-shrink:0;font-size:34px;line-height:1;letter-spacing:-.02em;color:var(--ink);font-variant-numeric:tabular-nums}
.lov-options{display:flex;flex-direction:column;gap:2px}
:where(button.lov-option){all:unset}
.lov-option{box-sizing:border-box;display:flex;align-items:center;gap:12px;width:100%;padding:11px 12px;border:1.5px solid transparent;border-radius:calc(var(--spacing) * 3);cursor:pointer;text-align:left}
.lov-option:hover{background:var(--soft)}
.lov-option:focus-visible,.lov-next:focus-visible{outline:2px solid color-mix(in srgb,var(--ink) 60%,transparent);outline-offset:2px}
.lov-option::before{content:"";flex-shrink:0;width:18px;height:18px;border-radius:999px;box-shadow:inset 0 0 0 1.5px var(--line)}
.lov-option[aria-checked=true]{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 5%,transparent)}
.lov-option[aria-checked=true]::before{box-shadow:inset 0 0 0 5px var(--accent)}
.lov-option-main{display:flex;flex-direction:column;gap:1px;flex:1;min-width:0}
.lov-option-name{${X("title-sm")};color:var(--fg-primary)}
.lov-option-sub{${X("body-xs")};color:var(--fg-tertiary)}
.lov-option-meta{flex-shrink:0;${X("body-sm")};color:var(--fg-secondary);font-variant-numeric:tabular-nums}
.lov-tiles{max-width:var(--lov-card-width);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,110px),1fr));gap:calc(var(--spacing) * 2)}
.lov-tile{display:flex;flex-direction:column;gap:4px;padding:calc(var(--spacing) * 3.5) calc(var(--spacing) * 4);border:0;border-radius:calc(var(--spacing) * 4);background:var(--bg-secondary);box-shadow:var(--shadow-surface-md)}
.lov-tile>b{font-size:28px;line-height:1.1;font-weight:400;letter-spacing:-.02em;color:var(--fg-primary);font-variant-numeric:tabular-nums}
.lov-tile.lov-accent>b{color:var(--accent)}
.lov-card .lov-tile{background:var(--bg-depth);box-shadow:none}
.lov-tile>span{${X("body-xs")};color:var(--fg-tertiary)}
.lov-tl{display:flex;flex-direction:column;margin:0;padding:0;list-style:none}
.lov-tl>li{position:relative;display:grid;grid-template-columns:18px 52px minmax(0,1fr);gap:0 8px;padding-bottom:18px}
.lov-tl>li:last-child{padding-bottom:0}
.lov-tl>li::before{content:"";grid-column:1;grid-row:1;margin-top:3px;width:12px;height:12px;border-radius:999px;box-shadow:inset 0 0 0 1.5px var(--faint);background:var(--raised);z-index:1}
.lov-tl>li:not(:last-child)::after{content:"";position:absolute;left:5.5px;top:16px;bottom:0;width:1px;background:var(--line)}
.lov-tl>li.lov-now::before{background:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 25%,transparent)}
.lov-tl>li>:not(.lov-tl-time){grid-column:3;justify-self:start;min-width:0}
.lov-tl>li>:not(.lov-tl-time):not(.lov-tl-main){margin-top:4px}
.lov-tl-time{grid-column:2;font-size:14px;line-height:20px;color:var(--muted);font-variant-numeric:tabular-nums}
.lov-tl-main{grid-column:3;display:flex;flex-direction:column;align-items:flex-start;gap:2px;min-width:0}
.lov-tl-name{font-size:15px;line-height:20px;color:var(--ink)}
.lov-tl-sub{font-size:13px;line-height:18px;color:var(--faint)}

/* Buttons are Pulse's Button at its default size and rounded, one size everywhere: outline, inverse for the primary (with the
   skin matrix's lighting), ghost for a way out. Buttons only act; a disclosure reads as text with a chevron, never as a
   button. A full row only widens a button. A card that takes no answer rests all its buttons as disabled, the one it was
   answered with included, which keeps its check; its disclosures still open. */
.lov-view{--pb-hair:var(--border-default);--pb-rim:oklch(0 0 0 / .25);--pb-hover:oklch(0 0 0 / .08);--pb-press:oklch(0 0 0 / .1);--pb-inverse:var(--bg-inverse);--pb-on-inverse:var(--fg-inverse);--pb-inverse-rim:oklch(0 0 0);--pb-lift:oklch(1 0 0 / .08);--pb-lift-press:oklch(1 0 0 / .12);--pb-spots:inset 0 1px 0 0 oklch(.98 .01 0 / .24),inset 0 -1px 0 0 oklch(.98 .01 0);--pb-dome:linear-gradient(to bottom,transparent,oklch(0 0 0 / .88));--pb-glints:inset 0 .5px 0 0 oklch(1 0 0 / .08),inset 0 -.5px 0 0 oklch(0 0 0 / .16);--pb-drop:0 2px 2px -1px oklch(.2 0 0 / .12),0 4px 4px -2px oklch(.2 0 0 / .12)}
:root[data-theme="dark"] .lov-view{--pb-rim:oklch(1 0 0 / .25);--pb-hover:oklch(1 0 0 / .12);--pb-press:oklch(1 0 0 / .16);--pb-inverse-rim:oklch(1 0 0);--pb-lift:oklch(0 0 0 / .08);--pb-lift-press:oklch(0 0 0 / .12);--pb-spots:inset 0 .5px 0 0 oklch(.98 .01 0),inset 0 -.5px 0 0 oklch(.98 .01 0);--pb-dome:linear-gradient(to bottom,transparent,oklch(0 0 0 / .08));--pb-glints:0 0 transparent}
.lov-view .lov-btn{position:relative;isolation:isolate;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:4px;height:32px;padding:0 10px;border:0;border-radius:999px;${X("control-sm")};white-space:nowrap;-webkit-user-select:none;user-select:none;list-style:none;color:var(--fg-primary);background:transparent;box-shadow:inset 0 0 0 var(--pb-hair) var(--pb-rim);opacity:1;cursor:pointer;transition:background-color 150ms,box-shadow 150ms,opacity 150ms}
.lov-view details>summary{display:block;list-style:none;cursor:pointer;${X("body-sm")};color:var(--fg-tertiary);transition:color 120ms}
.lov-view details>summary:hover{color:var(--ink)}
.lov-view details.lov-rest>summary{text-align:center;color:var(--ink)}
.lov-view details.lov-rest>summary:hover{color:var(--muted)}
.lov-view details.lov-entry>summary{display:flex;align-items:center;gap:12px;padding:10px 0;color:var(--ink)}
.lov-view details.lov-rest>div{gap:0;padding-top:0}
.lov-view details.lov-rest>div>details.lov-entry+details.lov-entry{border-top:var(--border-default) solid var(--border-primary)}
.lov-view details.lov-entry>summary::after{flex-shrink:0;width:16px;height:16px;margin-left:auto;color:var(--faint)}
.lov-view details.lov-entry>div{display:flex;flex-direction:column;gap:12px;padding:4px 0 12px}
.lov-view details.lov-entry>div>.lov-body:first-child{padding-top:0;border-top:0}
.lov-view details>summary::-webkit-details-marker{display:none}
.lov-view .lov-btn>svg{width:16px;height:16px;flex-shrink:0}
.lov-view .lov-btn:hover{background-color:var(--pb-hover)}
.lov-view .lov-btn:active{background-color:var(--pb-press)}
.lov-view .lov-btn.lov-quiet{box-shadow:none;color:var(--ink)}
.lov-view .lov-btn.lov-btn-primary{color:var(--pb-on-inverse);background-color:var(--pb-inverse);background-image:none;box-shadow:var(--pb-drop),var(--pb-spots)}
.lov-view .lov-btn.lov-btn-primary::after{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none;background-image:var(--pb-dome);box-shadow:var(--pb-glints),inset 0 0 0 var(--pb-hair) var(--pb-inverse-rim)}
.lov-view .lov-btn.lov-btn-primary:hover{opacity:1;background-color:var(--pb-inverse);background-image:linear-gradient(var(--pb-lift),var(--pb-lift))}
.lov-view .lov-btn.lov-btn-primary:active{background-image:linear-gradient(var(--pb-lift-press),var(--pb-lift-press));box-shadow:none}
.lov-view .lov-btn.lov-btn-primary:active::after{box-shadow:inset 0 0 0 var(--pb-hair) var(--pb-inverse-rim)}
.lov-view .lov-btn:disabled{opacity:.5;cursor:not-allowed}
.lov-view .lov-btn.lov-btn-primary:disabled,.lov-view .lov-btn.lov-btn-primary:disabled::after{box-shadow:none}
.lov-view[data-lov-closed] button:not([data-connect]){pointer-events:none;cursor:default}
.lov-view[data-lov-closed] button:not(.lov-option):not([data-connect]){opacity:.5}
.lov-view[data-lov-closed] .lov-btn.lov-btn-primary,.lov-view[data-lov-closed] .lov-btn.lov-btn-primary::after{box-shadow:none}
.lov-view[data-lov-closed] .lov-option:not([aria-checked=true]){opacity:.5}
.lov-view[data-lov-settling],.lov-view[data-lov-settling] *,.lov-view[data-lov-settling] *::before,.lov-view[data-lov-settling] *::after{transition:none!important}
.lov-view .lov-btn[data-lov-chosen]>svg,.lov-view:has([data-lov-chosen]) .lov-btn:not([data-lov-chosen])>svg{display:none}
.lov-view .lov-btn[data-lov-chosen]::before,.lov-view .lov-btn[data-lov-connect="connected"]::before{content:"";width:16px;height:16px;flex-shrink:0;background:currentColor;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E") center/contain no-repeat;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E") center/contain no-repeat}
.lov-view [data-connect]:not([data-lov-connect]){visibility:hidden}
.lov-view .lov-btn[data-lov-connect="connected"]{padding:0;background:none;box-shadow:none;color:var(--fg-positive);opacity:1;cursor:default}
.lov-view .lov-btn[data-lov-connect="busy"]::before{content:"";width:14px;height:14px;flex-shrink:0;box-sizing:border-box;border:1.5px solid currentColor;border-right-color:transparent;border-radius:50%;animation:lov-spin .8s linear infinite}
@keyframes lov-spin{to{transform:rotate(360deg)}}
`,Xl=/\b(?:gsap|Flip|Draggable|InertiaPlugin|Motion|tailwind)\b|classList|className|setAttribute\(\s*["']class/,Jl=/\bclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;function Zl(e){if(/<(?:style|link)\b/i.test(e))return!0;const t=Jn(e);if(!t||[...Ze(t.doc,"script").map(n=>n.textContent??""),...t.handlers].some(n=>Xl.test(n)||/\bclass\s*=/.test(n)))return!0;for(const n of e.matchAll(Jl))if((n[1]??n[2]??n[3]??"").split(/\s+/).some(r=>r!==""&&!r.startsWith("lov-")))return!0;return!1}function rd(e,{nonce:t,theme:n,knobs:r,knobSpecs:a,width:i}){const s=Gl(t).map(p=>`<meta http-equiv="Content-Security-Policy" content="${p}" />`).join(`
`),d=e.includes('class="lov-view"'),h=!d||Zl(e)?Yn.map(p=>`<script nonce="${t}" src="${p.src}" integrity="${p.integrity}" crossorigin="anonymous"><\/script>`).join(`
`):null;return`<!DOCTYPE html>
<html lang="en"${h===null?' data-lov-libraries="none"':""}>
<head>
<meta charset="UTF-8" />
${s}
<meta name="viewport" content="width=${i}, initial-scale=1.0" />
${h??`<style nonce="${t}">${Ul}</style>`}
<style>html, body { margin: 0; padding: 0; }</style>
</head>
<body>
<style nonce="${t}">${d?Nl:""}${Wl}${Yl}${ql(e)}</style><script nonce="${t}">${l0(n,r,a)}<\/script>${a0(e,t)}<script nonce="${t}">${t0}<\/script>
</body>
</html>`}function ad(e,{nonce:t,theme:n,label:r}){return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta http-equiv="Content-Security-Policy" content="frame-src 'none'" />
<style nonce="${t}">html, body { margin: 0; height: 100%; background: transparent; color-scheme: ${n}; } div { height: 100%; cursor: pointer; } iframe { display: block; border: 0; width: 100%; height: 100%; background: transparent; color-scheme: ${n}; }</style>
</head>
<body>
<script nonce="${t}">${e0(JSON.stringify(e).replace(/</g,"\\u003c"),JSON.stringify(r).replace(/</g,"\\u003c"))}<\/script>
</body>
</html>`}function e0(e,t){return`
(function () {
  var TYPE = ${JSON.stringify(Xn)};
  var frame = document.createElement("iframe");
  frame.setAttribute("sandbox", "allow-scripts");
  frame.setAttribute("referrerpolicy", "no-referrer");
  frame.title = ${t};
  var loads = 0;
  frame.addEventListener("load", function () {
    if (++loads > 1) parent.postMessage({ type: TYPE, kind: "left" }, "*");
  });
  // Focus the chat did not allow is taken back and the frame goes inert; taken again, or held past HELD_MS, is evasion.
  // Taken within PRESS_MS of a press the bridge reports over its private port, the chat hands the app the keyboard.
  var HELD_MS = 50;
  var PRESS_MS = 400;
  // The press's report can trail the focus it moved: an activated frame waits up to this long for it.
  var PRESS_WAIT_MS = 100;
  var allowed = false;
  var entered = false;
  var grabbedAt = 0;
  var seenAt = 0;
  var pressed = false;
  var pressedAt = 0;
  var refusedAt = 0;
  var presses = false;
  // A send counts as the user's only this soon after a press or click in the app: the browser's user-activation window,
  // so a send that waits on an animation or an await still counts.
  var CLICK_MS = 5000;
  var clickedAt = 0;
  // Keys in the app count as clicks only once the user put focus there, by a press or a Tab: not after the app took it.
  var userFocused = false;
  var open = false;
  var handedOver = false;
  // Out of the tab order, so Tab from the chat stops on this document; the app's frame is entered only once allowed.
  frame.tabIndex = -1;
  function sendOpen(force) {
    var next = allowed || entered;
    if ((!force && open === next) || !frame.contentWindow) return;
    open = next;
    // Only the user's press hands over the focus call the app was refused, never pointing at it.
    frame.contentWindow.postMessage({ type: TYPE, kind: "focusOpen", open: open, replay: open && handedOver }, "*");
    handedOver = false;
  }
  // Focus landed on this document (Tab from the chat) and waits there for the allow before entering the app.
  var landed = false;
  // Focusing the frame alone can leave the app's own document unfocused, with nowhere for keys to go.
  function focusApp() {
    frame.focus();
    if (frame.contentWindow) frame.contentWindow.focus();
  }
  function enter() {
    if (!landed || !allowed || !document.hasFocus()) return;
    landed = false;
    focusApp();
  }
  function guard() {
    var focused = document.activeElement === frame && document.hasFocus();
    var now = Date.now();
    if (!focused) {
      // Focus left the app, as the frame's blur says: a press before it no longer counts.
      if (entered || seenAt) pressedAt = clickedAt = 0;
      userFocused = false;
      entered = false;
      grabbedAt = 0;
      seenAt = 0;
      pressed = false;
    } else if (allowed) entered = true;
    else if (!entered && !grabbedAt) {
      seenAt = seenAt || now;
      pressed = now - pressedAt < PRESS_MS;
      var activated = !!(navigator.userActivation && navigator.userActivation.isActive);
      if (pressed || !activated || now - seenAt > PRESS_WAIT_MS) {
        grabbedAt = now;
        // Read before it is set: a browser without inert keeps it as a plain property.
        var again = frame.inert === true;
        if (!pressed) {
          frame.inert = true;
          refusedAt = now;
        }
        parent.postMessage({ type: TYPE, kind: "grab", held: again, pressed: pressed }, "*");
      }
    } else if (!entered && !pressed && now - grabbedAt > HELD_MS) {
      grabbedAt = now;
      parent.postMessage({ type: TYPE, kind: "grab", held: true }, "*");
    }
    sendOpen(false);
  }
  setInterval(guard, 10);
  // The user's click on the inert frame lets the app in. iOS WebKit clicks only a clickable element, never the bare body,
  // hence the holder; on click, not press, so the press's own focus step on this document can't take the focus back.
  var holder = document.createElement("div");
  holder.addEventListener("click", function (event) {
    if (!event.isTrusted || frame.inert !== true) return;
    frame.inert = false;
    pressedAt = Date.now();
    userFocused = true;
    focusApp();
  });
  // Focus leaving the app ends its entry at once, not at the next poll, and tells it so.
  frame.addEventListener("blur", function () {
    entered = false;
    grabbedAt = 0;
    seenAt = 0;
    pressed = false;
    pressedAt = clickedAt = 0;
    userFocused = false;
    sendOpen(true);
  });
  // Tab, or the chat after a hand-over, focused this document: the app's frame takes focus if it may.
  // Firefox fires these at the document, the others at the window.
  window.addEventListener(
    "focus",
    function (event) {
      if (event.target !== window && event.target !== document) return;
      landed = document.activeElement !== frame;
      enter();
      sendOpen(true);
    },
    true,
  );
  window.addEventListener(
    "blur",
    function (event) {
      if (event.target === window || event.target === document) landed = false;
    },
    true,
  );
  function fromBridge(event) {
    var data = event.data;
    // A press whose default the app prevented moves no focus: it still lets the app in.
    if (data === 0) {
      pressedAt = clickedAt = Date.now();
      userFocused = true;
      if (allowed) return;
      // An inert frame takes no presses, so one reported after its refusal moved that focus: it still hands over.
      if (frame.inert === true && pressedAt - refusedAt < PRESS_MS) {
        refusedAt = 0;
        parent.postMessage({ type: TYPE, kind: "grab", held: false, pressed: true }, "*");
      } else focusApp();
    }
    else if (data === 1 && userFocused && document.activeElement === frame && document.hasFocus()) clickedAt = Date.now();
    else if (data && typeof data.connect === "string") parent.postMessage({ type: TYPE, kind: "connect", connector: data.connect }, "*");
    else if (data && data.type === TYPE && data.kind === "send") {
      data.pressed = Date.now() - clickedAt < CLICK_MS;
      parent.postMessage(data, "*");
    }
  }
  window.addEventListener("message", function (event) {
    var data = event.data;
    if (!data || data.type !== TYPE) return;
    var ownKind = data.kind === "left" || data.kind === "grab" || data.kind === "focusAck" || data.kind === "connect";
    if (event.source === frame.contentWindow && data.kind === "presses") {
      // Only the first: the bridge sends it before any of the app's scripts run.
      if (!presses && event.ports[0]) event.ports[0].onmessage = fromBridge;
      presses = true;
    } else if (event.source === frame.contentWindow && data.kind === "send") {
      data.pressed = false;
      parent.postMessage(data, "*");
    } else if (event.source === frame.contentWindow && !ownKind) {
      // Says again what may have reached the frame before the app's document did.
      if (data.kind === "ready") frame.contentWindow.postMessage({ type: TYPE, kind: "focusOpen", open: open }, "*");
      // The app closed its gate on leaving (another window, another tab) while focus here stayed open: it may go on.
      if (data.kind === "wantsFocus" && open) {
        frame.contentWindow.postMessage({ type: TYPE, kind: "focusOpen", open: true, replay: true }, "*");
      }
      parent.postMessage(data, "*");
    } else if (event.source === parent && data.kind === "focusAllowed") {
      allowed = data.allowed === true;
      if (allowed) frame.inert = false;
      handedOver = allowed && data.focus === true;
      if (handedOver) {
        userFocused = true;
        focusApp();
      } else enter();
      guard();
      // The chat focuses this frame only after this, so the app is never found holding focus it was about to be given.
      parent.postMessage({ type: TYPE, kind: "focusAck", allowed: allowed, focus: data.focus === true }, "*");
    } else if (event.source === parent) {
      // A frame whose scheme differs from its document's gets an opaque backdrop; matching keeps the app's page the only fill.
      if (data.kind === "theme" && (data.theme === "light" || data.theme === "dark")) {
        document.documentElement.style.colorScheme = data.theme;
        frame.style.colorScheme = data.theme;
      }
      if (frame.contentWindow) frame.contentWindow.postMessage(data, "*");
    }
  });
  frame.srcdoc = ${e};
  holder.appendChild(frame);
  document.body.appendChild(holder);
})();`}var t0=`
document.addEventListener("click", function (event) {
  var link = event.target instanceof Element ? event.target.closest("a[href], area[href]") : null;
  if (!link) return;
  var href = link.getAttribute("href");
  if (href && href.startsWith("#")) return;
  event.preventDefault();
}, true);
document.addEventListener("submit", function (event) { event.preventDefault(); }, true);`,n0=new Set(["","module","application/ecmascript","application/javascript","application/x-ecmascript","application/x-javascript","text/ecmascript","text/javascript","text/javascript1.0","text/javascript1.1","text/javascript1.2","text/javascript1.3","text/javascript1.4","text/javascript1.5","text/jscript","text/livescript","text/x-ecmascript","text/x-javascript","lovable/script","motion/script"]),kt="data-lov-mini-app-script",r0=new Set(["afterprint","beforeprint","beforeunload","blur","error","focus","hashchange","languagechange","load","message","messageerror","offline","online","pagehide","pageshow","popstate","rejectionhandled","resize","scroll","storage","unhandledrejection","unload"]);function a0(e,t){const n=Jn(e);if(!n)return"";const{doc:r,handlers:a}=n,i=r.body.getAttributeNames().map(h=>[h,r.body.getAttribute(h)??""]),s=o0(r.head.innerHTML+r.body.innerHTML,t),d=[];return i.length>0&&d.push(`${JSON.stringify(i)}.forEach(function(a){if(!/^on/i.test(a[0]))document.body.setAttribute(a[0],a[1]);});`),d.push(...i0(a)),d.length===0?s:`${s}<script nonce="${t}">${s0(d)}<\/script>`}function Jn(e,{keepScriptSources:t=!1,keepHandlers:n=!1}={}){if(typeof DOMParser>"u")return null;const r=new DOMParser().parseFromString(e,"text/html");for(const s of Ze(r,"script")){const d=(s.getAttribute("type")??"").trim().toLowerCase();if(s.hasAttribute("src")&&!t){s.remove();continue}if(!n0.has(d)&&!(t&&d==="importmap"))continue;const h=s.getAttributeNames().map(p=>[p,s.getAttribute(p)??""]);for(const[p]of h)s.removeAttribute(p);if(t){cn(s);for(const[p,w]of h)p!=="nonce"&&s.setAttribute(p,w);continue}d==="module"&&s.setAttribute("type","module"),cn(s)}for(const s of Ze(r,"[autofocus]"))s.removeAttribute("autofocus");const a=[];if(n)return{doc:r,handlers:a};let i=0;for(const s of Array.from(r.querySelectorAll("*"))){const d=s===r.body||s.localName==="frameset";for(const h of s.getAttributeNames()){if(!/^on[a-z]+$/.test(h))continue;const p=s.getAttribute(h)??"";if(s.removeAttribute(h),!p.trim())continue;if(d&&r0.has(h.slice(2))){a.push(`onWindow(${JSON.stringify(h.slice(2))},function(event){${p}
});`);continue}let w=s.getAttribute("data-lov-on");w===null&&(w=String(i++),s.setAttribute("data-lov-on",w)),a.push(`on(${JSON.stringify(w)},${JSON.stringify(h.slice(2))},function(event){${p}
});`)}}return{doc:r,handlers:a}}function Ze(e,t){const n=Array.from(e.querySelectorAll(t));for(const r of Array.from(e.querySelectorAll("template")))n.push(...Ze(r.content,t));return n}function cn(e){e.setAttribute(kt,"")}function o0(e,t){return e.replaceAll(`<script ${kt}=""`,`<script nonce="${t}"`).replaceAll(`<script type="module" ${kt}=""`,`<script type="module" nonce="${t}"`)}function i0(e){if(e.length===0)return[];const t=[];return e.some(n=>n.startsWith("on("))&&t.push(`function on(id,type,fn){var el=document.querySelector('[data-lov-on="'+id+'"]');if(el)el.addEventListener(type,function(event){if(fn.call(el,event)===false)event.preventDefault();});}`),e.some(n=>n.startsWith("onWindow("))&&t.push("function onWindow(type,fn){addEventListener(type,function(event){if(fn.call(window,event)===false)event.preventDefault();});}"),[...t,...e]}function s0(e){return`(function(){${e.join(`
`).replace(/<\/(script)/gi,"<\\/$1").replace(/<!--/g,"<\\!--")}})();`}function l0(e,t,n){const r=n.map(({name:a,label:i,min:s,max:d,step:h,value:p,unit:w})=>({name:a,label:i,min:s,max:d,step:h,value:p,unit:w}));return`
(function () {
  var TYPE = ${JSON.stringify(Xn)};
  function post(message) { message.type = TYPE; parent.postMessage(message, "*"); }
  // The user's presses and clicks reach the shell over a port only this script holds, bound now so the app can't reach
  // it. Sends travel the same port, behind the click that made them, so the shell can tell which a click made.
  var toShell = null;
  if (typeof MessageChannel === "function") {
    var presses = new MessageChannel();
    toShell = MessagePort.prototype.postMessage.bind(presses.port1);
    parent.postMessage({ type: TYPE, kind: "presses" }, "*", [presses.port2]);
    // A trusted click is a press (keyboards and screen readers make one, a swipe none), and so is any other key for a
    // send. A connect row's click (case 11) starts its connect flow this way too, so no script of the app can.
    var targetOf = Function.prototype.call.bind(Object.getOwnPropertyDescriptor(Event.prototype, "target").get);
    var closestOf = Function.prototype.call.bind(Element.prototype.closest);
    var attributeOf = Function.prototype.call.bind(Element.prototype.getAttribute);
    var soon = queueMicrotask.bind(window);
    var clicking = false;
    window.addEventListener("click", function (event) {
      // A click inside another click's dispatch is one a label or form forwarded, trusted even when a script made it.
      var forwarded = clicking;
      clicking = true;
      soon(function () { clicking = false; });
      if (!event.isTrusted || forwarded) return;
      toShell(0);
      var button = null;
      try { button = closestOf(targetOf(event), ".lov-view button[data-connect]"); } catch (error) {}
      if (button) toShell({ connect: attributeOf(button, "data-connect") });
    }, true);
    var NOT_ACTIVATING = ["Escape", "Tab", "Shift", "Control", "Alt", "Meta", "CapsLock"];
    window.addEventListener("keydown", function (event) {
      if (event.isTrusted && NOT_ACTIVATING.indexOf(event.key) < 0) toShell(1);
    }, true);
  }
  if (toShell && typeof PointerEvent === "function") {
    var pointerTypeOf = Function.prototype.call.bind(
      Object.getOwnPropertyDescriptor(PointerEvent.prototype, "pointerType").get,
    );
    // A mouse or pen focuses on press, a tap on release; a swipe ends in pointercancel, with no release.
    ["pointerdown", "pointerup"].forEach(function (type) {
      window.addEventListener(type, function (event) {
        if (event.isTrusted && (pointerTypeOf(event) !== "touch") === (type === "pointerdown")) toShell(0);
      }, true);
    });
  }
  var reported = {};
  function report(message) {
    message = String(message || "Unknown error").slice(0, 300);
    if (reported[message]) return;
    reported[message] = true;
    post({ kind: "error", message: message });
  }
  window.addEventListener("error", function (event) {
    if (event.target && event.target !== window) return;
    // The browser's notice that a resize settled a frame late; nothing in the app broke.
    if (/^ResizeObserver loop/.test(event.message || "")) return;
    report(event.message || (event.error && event.error.message));
  });
  window.addEventListener("unhandledrejection", function (event) {
    var reason = event.reason;
    report(reason && reason.message ? reason.message : String(reason));
  });
  document.addEventListener("securitypolicyviolation", function (event) {
    var directive = event.effectiveDirective || event.violatedDirective || "";
    if (directive === "script-src-attr") report("An inline on… handler set from script was blocked; use addEventListener");
    else if (directive.indexOf("script-src") === 0) report("A script was blocked: apps run inline scripts only");
    else if (directive.indexOf("font-src") !== 0 && directive.indexOf("style-src") !== 0)
      report("Blocked " + (event.blockedURI || "a request") + ": apps have no network");
  });
  if (window.gsap) {
    ["Flip", "Draggable", "InertiaPlugin"].forEach(function (name) {
      if (window[name]) window.gsap.registerPlugin(window[name]);
    });
  }

  // Answers only its parent's request, made for staff feedback; in every app so a frame never reloads to gain it.
  var snapshot = ${Qn.toString()};
  var knobs = ${JSON.stringify(t)};
  var knobListeners = [], themeListeners = [], kitThemeListeners = [], loads = {}, loadSeq = 0;
  var lovable = {
    knobs: knobs,
    theme: ${JSON.stringify(e)},
    send: function (text) {
      text = String(text == null ? "" : text).trim().slice(0, ${jl});
      if (!text) return;
      var message = { type: TYPE, kind: "send", text: text, choice: cardChoice() };
      if (toShell) toShell(message);
      else parent.postMessage(message, "*");
    },
    onKnobs: function (fn) {
      if (typeof fn !== "function") return function () {};
      knobListeners.push(fn);
      return function () { knobListeners = knobListeners.filter(function (f) { return f !== fn; }); };
    },
    onTheme: function (fn) {
      if (typeof fn !== "function") return function () {};
      themeListeners.push(fn);
      return function () { themeListeners = themeListeners.filter(function (f) { return f !== fn; }); };
    },
    save: function (state) {
      var json;
      try { json = JSON.stringify(state === undefined ? null : state); } catch (error) { report("lovable.save needs JSON-safe state"); return; }
      if (json.length > ${$l}) { report("lovable.save: state is too large"); return; }
      post({ kind: "save", state: json });
    },
    artwork: function (svg, options) {
      var markup = svg instanceof SVGSVGElement ? artworkMarkup(svg) : String(svg == null ? "" : svg).trim();
      if (!markup) return;
      if (new TextEncoder().encode(markup).length > ${Hl}) { report("lovable.artwork: the artwork is too large"); return; }
      var name = options && options.name != null ? String(options.name).trim().slice(0, 60) : "";
      var logo = options && (options.logo === "lockup" || options.logo === "mark") ? options.logo : "";
      var brand = logo && options.brand != null ? String(options.brand).trim().slice(0, 60) : "";
      post({ kind: "artwork", svg: markup, name: name, logo: logo, brand: brand, fonts: pageFonts(markup) });
    },
    chart: function (el, options) { return kit.chart(el, options); },
    knobControls: function (el, options) { return kit.knobControls(el, options); },
    load: function () {
      return new Promise(function (resolve) {
        var id = ++loadSeq;
        loads[id] = resolve;
        post({ kind: "load", id: id });
        setTimeout(function () { if (loads[id]) { delete loads[id]; resolve(null); } }, 2000);
      });
    },
  };
  window.lovable = lovable;

  // A card (chat-views.md) is answered with one of its buttons: a send says which, with the options checked then, and
  // the chat says back what the card was answered with, so the card keeps showing it.
  var pressedButton = null;
  document.addEventListener("click", function (event) {
    var button = event.target instanceof Element ? event.target.closest("button") : null;
    // A closed card takes no answer from a press or a key; showCard's own replay clicks are untrusted and still run.
    if (button && event.isTrusted && button.matches(CLOSED_BUTTON)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    pressedButton = button;
    // Only a send in the press's own handler comes from it; one on a timer later doesn't.
    if (button) setTimeout(function () { if (pressedButton === button) pressedButton = null; }, 0);
  }, true);
  var CLOSED_BUTTON = ".lov-view[data-lov-closed] button:not([data-connect])";
  function cardButtons() { return Array.prototype.slice.call(document.querySelectorAll(".lov-view button:not(.lov-option):not(.lov-editing button):not([data-connect])")); }
  function editedFrom(button) {
    var row = button.closest(".lov-editing");
    return row ? row.lovEdit : button;
  }
  function cardGroups() { return Array.prototype.slice.call(document.querySelectorAll(".lov-view .lov-options")); }
  function groupOptions(group) { return Array.prototype.slice.call(group.querySelectorAll(".lov-option")); }
  function cardChoice() {
    if (!document.querySelector(".lov-view")) return undefined;
    return {
      button: pressedButton ? cardButtons().indexOf(editedFrom(pressedButton)) : -1,
      options: cardGroups().map(function (group) {
        return groupOptions(group).findIndex(function (option) { return option.getAttribute("aria-checked") === "true"; });
      }),
    };
  }
  var cardState = null;
  var cardSettled = false;
  function showCard() {
    var view = document.querySelector(".lov-view");
    if (!view || !cardState) return;
    // The state the card loads in (answered, closed) draws at once; only a later change, a press, animates.
    var first = !cardSettled;
    cardSettled = true;
    if (first) view.setAttribute("data-lov-settling", "");
    var chosen = cardState.chosen;
    // The options as they were checked; a press on each runs the card's own script, so its labels follow.
    if (chosen && Array.isArray(chosen.options)) {
      cardGroups().forEach(function (group, index) {
        var option = groupOptions(group)[chosen.options[index]];
        if (option && option.getAttribute("aria-checked") !== "true") option.click();
      });
    }
    // An editor still open closes once the answer is in.
    if (chosen) Array.prototype.slice.call(view.querySelectorAll(".lov-editing")).forEach(function (row) {
      row.lovEditor.remove();
      row.lovDraft.hidden = false;
      row.previousElementSibling.hidden = false;
      row.remove();
    });
    var buttons = cardButtons();
    var answer = chosen ? answerButton(buttons, chosen) : null;
    // A reply from elsewhere (typed, or from the phone) names its pick: check that option, and its label follows.
    if (chosen && !answer && !Array.isArray(chosen.options)) {
      var said = String(chosen.text || "").toLowerCase();
      cardGroups().forEach(function (group) {
        var option = groupOptions(group).find(function (option) {
          var name = option.querySelector(".lov-option-name");
          var words = String(name ? name.textContent : "").replace(/\\s+/g, " ").trim().toLowerCase();
          return words.length >= 2 && said.indexOf(words) !== -1;
        });
        if (option && option.getAttribute("aria-checked") !== "true") option.click();
      });
      answer = answerButton(buttons, chosen);
    }
    buttons.forEach(function (button) { button.toggleAttribute("data-lov-chosen", button === answer); });
    // Answered with an edit, the draft reads as the user left it.
    var prefix = answer && answer.getAttribute("data-edit");
    var draft = prefix && draftOf(answer);
    if (draft && String(chosen.text).indexOf(prefix) === 0) {
      draft.textContent = String(chosen.text).slice(prefix.length).trim();
      answer.textContent = "Edited";
    }
    view.toggleAttribute("data-lov-closed", !cardState.answerable);
    // Posted rather than built into the page, so the turn ending, which rounds a run's last corner, never reloads it.
    if (cardState.bubble) {
      var ends = [cardState.bubble.roundTop && "top", cardState.bubble.roundBottom && "bottom"];
      view.setAttribute("data-lov-bubble", ends.filter(Boolean).join(" "));
    } else {
      view.removeAttribute("data-lov-bubble");
    }
    view.toggleAttribute("data-lov-full-width", cardState.fullWidth);
    // Only the disable the bridge set lifts, so a card script's own aria-disabled stays.
    Array.prototype.slice.call(view.querySelectorAll("button:not([data-connect])")).forEach(function (button) {
      if (cardState.answerable) {
        if (button.hasAttribute("data-lov-disabled")) {
          button.removeAttribute("data-lov-disabled");
          button.removeAttribute("aria-disabled");
        }
      } else if (button.getAttribute("aria-disabled") !== "true") {
        button.setAttribute("data-lov-disabled", "");
        button.setAttribute("aria-disabled", "true");
      }
    });
    showConnectors(view, cardState.connectors || {});
    if (first) {
      void view.offsetWidth;
      view.removeAttribute("data-lov-settling");
    }
  }
  // The button a reply came from: the one pressed here, else the one that sends or reads as the reply's words.
  function answerButton(buttons, chosen) {
    if (typeof chosen.button === "number" && buttons[chosen.button]) return buttons[chosen.button];
    var said = String(chosen.text || "").replace(/\\s+/g, " ").trim().toLowerCase();
    if (!said) return null;
    function words(text) { return String(text || "").replace(/\\s+/g, " ").trim().toLowerCase(); }
    return buttons.find(function (button) { var edit = words(button.getAttribute("data-edit")); return edit && said.indexOf(edit) === 0; })
      || buttons.find(function (button) { return words(button.getAttribute("data-send")) === said; })
      || buttons.find(function (button) { return words(button.textContent) === said; })
      || buttons.find(function (button) { var label = words(button.textContent); return label.length >= 4 && said.indexOf(label) === 0; })
      || null;
  }
  document.addEventListener("DOMContentLoaded", showCard);
  // A connect row's button (case 11) opens the app's connect flow in the chat, on any card, answered or not: the chat
  // says back where each one stands, and the button shows it.
  function showConnectors(view, states) {
    Array.prototype.slice.call(view.querySelectorAll("button[data-connect]")).forEach(function (button) {
      var state = states[button.getAttribute("data-connect")];
      if (!state) return;
      if (button.lovLabel == null) button.lovLabel = button.textContent;
      button.setAttribute("data-lov-connect", state.state);
      button.disabled = state.state !== "connect";
      button.hidden = state.state === "unavailable";
      button.textContent = state.label || button.lovLabel;
      var sub = button.closest(".lov-row") && button.closest(".lov-row").querySelector(".lov-row-sub");
      if (sub) {
        if (sub.lovText == null) sub.lovText = sub.textContent;
        sub.textContent = state.note || sub.lovText;
      }
    });
  }
  // A card's disclosures open and close as Pulse's Accordion does: the height glides open on ease-out-quart, and
  // closes faster (MOTION.md). A queue keeps one item open, so opening one folds the one that was open, together.
  var SLIDE_EASE = "cubic-bezier(0.165, 0.84, 0.44, 1)";
  function stillMotion() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  // Measured closed, since an open disclosure can restyle its summary and padding (a rest list hides both).
  function closedHeight(details) {
    var wasOpen = details.open;
    details.open = false;
    var height = details.offsetHeight;
    details.open = wasOpen;
    return height;
  }
  // Where a disclosure is headed: its target while it slides, else whether it is open.
  function headed(details) { return details.lovTarget != null ? details.lovTarget : details.open; }
  function slide(details, open) {
    if (headed(details) === open) return;
    // Reversed mid-slide, it starts from where it is.
    var from = details.offsetHeight;
    var running = details.lovSlide;
    details.lovSlide = null;
    if (running) running.cancel();
    if (open) details.open = true;
    var to = open ? details.offsetHeight : closedHeight(details);
    if (stillMotion() || !details.animate) {
      details.open = open;
      return;
    }
    details.lovTarget = open;
    details.style.overflow = "hidden";
    var run = details.animate([{ height: from + "px" }, { height: to + "px" }], { duration: open ? 200 : 150, easing: SLIDE_EASE });
    details.lovSlide = run;
    run.onfinish = run.oncancel = function () {
      if (details.lovSlide !== run) return;
      details.lovSlide = null;
      details.lovTarget = null;
      details.style.overflow = "";
      if (!open) details.open = false;
    };
  }
  document.addEventListener("click", function (event) {
    var summary = event.target instanceof Element ? event.target.closest(".lov-view details > summary") : null;
    if (!summary) return;
    var details = summary.parentElement;
    event.preventDefault();
    var open = !headed(details);
    if (open && details.classList.contains("lov-entry")) {
      details.closest(".lov-view").querySelectorAll("details.lov-entry").forEach(function (other) {
        if (other !== details && headed(other)) slide(other, false);
      });
    }
    slide(details, open);
  });
  // Edit opens a card's draft as a text area right in the card; Send hands the agent the edited text, after the Edit
  // button's data-edit ("Send this to Fabian instead:"), and Cancel puts the draft back.
  function draftOf(button) {
    var scope = button.closest("details.lov-entry, .lov-card");
    if (!scope) return null;
    return Array.prototype.slice.call(scope.querySelectorAll(".lov-draft-body, .lov-body")).find(function (el) {
      return !el.closest("details.lov-more") && el.closest("details.lov-entry, .lov-card") === scope;
    }) || null;
  }
  document.addEventListener("click", function (event) {
    var target = event.target instanceof Element ? event.target : null;
    var edit = target && target.closest(".lov-view [data-edit]");
    if (edit && !edit.closest("[data-lov-closed]")) {
      var draft = draftOf(edit);
      var actions = edit.closest(".lov-actions");
      if (!draft || !actions || draft.hidden) return;
      var editor = document.createElement("textarea");
      editor.className = "lov-editor";
      editor.setAttribute("data-kit-none", "");
      editor.value = (draft.textContent || "").trim();
      var fit = function () { editor.style.height = "auto"; editor.style.height = editor.scrollHeight + "px"; };
      editor.addEventListener("input", fit);
      draft.hidden = true;
      draft.after(editor);
      var row = document.createElement("div");
      row.className = "lov-actions lov-editing";
      row.innerHTML = '<button class="lov-btn lov-btn-primary" data-lov-edit-send></button><button class="lov-btn" data-lov-edit-cancel>Cancel</button>';
      row.firstChild.textContent = edit.getAttribute("data-edit-send") || "Send";
      row.lovEdit = edit;
      row.lovEditor = editor;
      row.lovDraft = draft;
      actions.hidden = true;
      actions.after(row);
      fit();
      editor.focus();
      editor.setSelectionRange(editor.value.length, editor.value.length);
      return;
    }
    var row = target && target.closest(".lov-editing");
    if (!row) return;
    if (target.closest("[data-lov-edit-cancel]")) {
      row.lovEditor.remove();
      row.lovDraft.hidden = false;
      row.previousElementSibling.hidden = false;
      row.remove();
    } else if (target.closest("[data-lov-edit-send]")) {
      var text = row.lovEditor.value.trim();
      if (text) lovable.send(row.lovEdit.getAttribute("data-edit") + "\\n\\n" + text);
    }
  });
  // The chat's own "one open" is this script's: a group the browser closes at once couldn't slide.
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".lov-view details[name]").forEach(function (details) { details.removeAttribute("name"); });
  });

  // An <svg> in the page as standalone markup; one without a viewBox and a px width and height (sized by CSS, in %,
  // em or pt) takes the size it is drawn at, as the server reads only px.
  function artworkMarkup(svg) {
    var copy = svg.cloneNode(true);
    if (!svg.getAttribute("viewBox") && !(pxLength(svg.getAttribute("width")) && pxLength(svg.getAttribute("height")))) {
      var box = svg.getBoundingClientRect();
      copy.setAttribute("viewBox", "0 0 " + Math.round(box.width) + " " + Math.round(box.height));
    }
    standalone(svg, copy);
    return new XMLSerializer().serializeToString(copy);
  }
  // The page's CSS variables and the colour and font the svg inherits from the page, written into the copy, so the
  // file looks as drawn once it opens without the page.
  var ARTWORK_INHERITED = ["color", "fill", "stroke", "font-family", "font-size", "font-weight", "font-style", "letter-spacing"];
  function standalone(svg, copy) {
    var page = getComputedStyle(svg);
    ARTWORK_INHERITED.forEach(function (name) {
      var value = page.getPropertyValue(name);
      if (value && !copy.style.getPropertyValue(name)) copy.style.setProperty(name, value);
    });
    var originals = [svg].concat(Array.prototype.slice.call(svg.querySelectorAll("*")));
    var copies = [copy].concat(Array.prototype.slice.call(copy.querySelectorAll("*")));
    copies.forEach(function (element, i) {
      var computed = getComputedStyle(originals[i]);
      Array.prototype.slice.call(element.attributes).forEach(function (attribute) {
        if (attribute.value.indexOf("var(") >= 0) element.setAttribute(attribute.name, withVars(attribute.value, computed));
      });
      if (element.tagName.toLowerCase() === "style") element.textContent = withVars(element.textContent || "", page);
    });
  }
  // Each var(--name, fallback) in value as the element resolves it, innermost first.
  function withVars(value, computed) {
    for (var pass = 0; pass < 8 && value.indexOf("var(") >= 0; pass++) {
      var next = value.replace(/var[(][ ]*(--[-_a-zA-Z0-9]+)[ ]*(?:,((?:[^()]|[(][^()]*[)])*))?[)]/g, function (match, name, fallback) {
        var resolved = computed.getPropertyValue(name).trim();
        return resolved || (fallback || "").trim() || match;
      });
      if (next === value) break;
      value = next;
    }
    return value;
  }
  // Whether a width or height is a positive length in px, as the server's cssLength reads it.
  function pxLength(value) {
    var number = String(value || "").trim().replace(/px$/, "").trim();
    return /^[0-9]*[.]?[0-9]+$/.test(number) && parseFloat(number) > 0;
  }
  // The Google Fonts stylesheets the page loads, so the saved artwork can carry its fonts; those asking for a family
  // the markup names come first, so a font picker's other typefaces never crowd out the picked one.
  function pageFonts(markup) {
    var found = [];
    function add(href) {
      if (typeof href === "string" && href.indexOf(${JSON.stringify(Bl)}) === 0 && found.indexOf(href) < 0) found.push(href);
    }
    Array.prototype.forEach.call(document.styleSheets, function (sheet) {
      add(sheet.href);
      var rules;
      try { rules = sheet.cssRules; } catch (error) { return; }
      Array.prototype.forEach.call(rules || [], function (rule) { if (rule.href) add(rule.href); });
    });
    var lower = markup.toLowerCase();
    function used(href) {
      return (href.split("?")[1] || "").split("&").some(function (pair) {
        if (pair.indexOf("family=") !== 0) return false;
        var param;
        try { param = decodeURIComponent(pair.slice(7).replace(/[+]/g, " ")); } catch (error) { return false; }
        return param.split("|").some(function (spec) {
          var family = spec.split(":")[0].trim().toLowerCase();
          return family !== "" && lower.indexOf(family) >= 0;
        });
      });
    }
    return found.filter(used).concat(found.filter(function (href) { return !used(href); })).slice(0, 8);
  }

  function call(listeners, value) {
    listeners.forEach(function (fn) { try { fn(value); } catch (error) { report(error && error.message); } });
  }
  var kit = (${vl.toString()})((${bl.toString()})(), {
    specs: ${JSON.stringify(r).replace(/</g,"\\u003c")},
    knobs: knobs,
    post: post,
    knobsMoved: function () { call(knobListeners, knobs); },
    onTheme: function (fn) { kitThemeListeners.push(fn); },
    stepper: function (input) { stepper(input, true); },
  });
  function setTheme(theme) {
    lovable.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
  }
  setTheme(lovable.theme);

  var fitting = false;
  var lastHeight = 0;
  function reportSize() {
    // Mid-parse, only the card's top line is in; a height from then would show for a moment before the real one.
    if (!fitting || document.readyState === "loading") return;
    // The content's own extent, not the page's: scrollHeight never drops below the frame, so a
    // card declared taller than its app could only grow. A 100vh layout still reports the frame.
    var body = document.body;
    var bottom = 0;
    if (body) {
      for (var i = 0; i < body.children.length; i++) {
        var child = body.children[i];
        if (child.tagName === "SCRIPT" || child.tagName === "STYLE") continue;
        var rect = child.getBoundingClientRect();
        if (rect.height === 0 && rect.width === 0) continue;
        bottom = Math.max(bottom, rect.bottom + parseFloat(getComputedStyle(child).marginBottom || "0"));
      }
      bottom += parseFloat(getComputedStyle(body).paddingBottom || "0");
    }
    var height = Math.ceil(bottom > 0 ? bottom + window.scrollY : document.documentElement.scrollHeight);
    if (Math.abs(height - lastHeight) < 2) return;
    lastHeight = height;
    post({ kind: "size", height: height });
  }
  new ResizeObserver(reportSize).observe(document.documentElement);
  // A fit can arrive mid-parse, before there is a height to report. The observers don't run while the frame is
  // offscreen, so the card is measured once it has parsed (after the card's own DOMContentLoaded scripts have built
  // it), and again just before it shows.
  document.addEventListener("DOMContentLoaded", function () {
    new ResizeObserver(reportSize).observe(document.body);
    setTimeout(reportSize, 0);
  });

  window.addEventListener("message", function (event) {
    var data = event.data;
    if (event.source !== parent || !data || data.type !== TYPE) return;
    if (data.kind === "knobs" && data.values && typeof data.values === "object") {
      Object.keys(data.values).forEach(function (key) { knobs[key] = data.values[key]; });
      kit.knobsChanged();
      call(knobListeners, knobs);
    } else if (data.kind === "fit") {
      // The host grows the card to the content, so the page never scrolls inside it unless the host caps it.
      document.documentElement.style.overflow = data.scroll === true ? "auto" : "hidden";
      document.body.style.minHeight = "0";
      fitting = true;
      reportSize();
    } else if (data.kind === "theme" && (data.theme === "light" || data.theme === "dark")) {
      if (data.theme === lovable.theme) return;
      setTheme(data.theme);
      call(kitThemeListeners, data.theme);
      call(themeListeners, data.theme);
    } else if (data.kind === "card") {
      cardState = {
        answerable: data.answerable === true,
        chosen: data.chosen && typeof data.chosen === "object" ? data.chosen : null,
        connectors: data.connectors && typeof data.connectors === "object" ? data.connectors : null,
        bubble: data.bubble && typeof data.bubble === "object" ? data.bubble : null,
        fullWidth: data.fullWidth === true,
      };
      // Before the card is in the page, it shows its answer as it arrives.
      if (document.readyState !== "loading") showCard();
      revealWhenReady();
    } else if (data.kind === "capture" && typeof data.id === "number") {
      snapshot(Number(data.maxWidth) || 1600).then(function (png) { post({ kind: "captured", id: data.id, png: png }); });
    } else if (data.kind === "loaded") {
      var resolve = loads[data.id];
      if (!resolve) return;
      delete loads[data.id];
      var value = null;
      try { value = data.state == null ? null : JSON.parse(data.state); } catch (error) {}
      resolve(value);
    }
  });

  // Every script call that moves focus waits until the shell says the user lets the app take focus; until then it asks
  // for a click instead, and the last one held runs on that click, so keys reach what the app meant.
  var focusOpen = false;
  var askedFocus = false;
  // In order. A call that changes the app (opens a dialog, toggles a control) is never dropped; of the calls that only
  // move focus, the last one counts.
  var held = [];
  function hold(target, run, args, changes) {
    if (!changes) held = held.filter(function (call) { return call.changes; });
    held.push({ target: target, run: run, args: args, changes: changes === true });
    if (held.length > 20) held.shift();
    if (askedFocus) return;
    askedFocus = true;
    post({ kind: "wantsFocus" });
  }
  function gate(owner, name, wrap) {
    var native = owner && owner[name];
    if (typeof native === "function") owner[name] = wrap(native);
  }
  function always(native) {
    return function () {
      if (focusOpen) return native.apply(this, arguments);
      hold(this, native, arguments, false);
    };
  }
  function changing(native) {
    return function () {
      if (focusOpen) return native.apply(this, arguments);
      hold(this, native, arguments, true);
    };
  }
  [window.HTMLElement, window.SVGElement, window.MathMLElement].forEach(function (type) {
    if (type) gate(type.prototype, "focus", always);
  });
  gate(window, "focus", always);
  [window.HTMLDialogElement].forEach(function (type) {
    if (!type) return;
    gate(type.prototype, "showModal", changing);
    gate(type.prototype, "show", changing);
  });
  // select() selects at once; only its focus waits.
  [window.HTMLInputElement, window.HTMLTextAreaElement].forEach(function (type) {
    if (!type) return;
    var focus = window.HTMLElement.prototype.focus;
    gate(type.prototype, "select", function (native) {
      return function () {
        if (focusOpen) return native.apply(this, arguments);
        try {
          this.setSelectionRange(0, this.value.length);
        } catch (error) {}
        hold(this, focus, [], false);
      };
    });
  });
  // A popover moves focus only to an autofocus element in it.
  function focusesOnOpen(popover) {
    return popover.hasAttribute("autofocus") || !!popover.querySelector("[autofocus]");
  }
  if (window.HTMLElement) {
    gate(window.HTMLElement.prototype, "showPopover", function (native) {
      return function () {
        if (focusOpen || !focusesOnOpen(this)) return native.apply(this, arguments);
        hold(this, native, arguments, true);
      };
    });
    gate(window.HTMLElement.prototype, "togglePopover", function (native) {
      return function (force) {
        var opening = force === undefined ? !this.matches(":popover-open") : force === true || (force && force.force);
        if (focusOpen || !opening || !focusesOnOpen(this)) return native.apply(this, arguments);
        hold(this, native, arguments, true);
      };
    });
    // A click on a label, or on its text, focuses its control; one on the control or another control in it does not.
    var CONTROL = "a[href], button, input, select, textarea, summary, [contenteditable]";
    gate(window.HTMLElement.prototype, "click", function (native) {
      return function () {
        if (focusOpen || !this.closest("label") || this.matches(CONTROL)) return native.apply(this, arguments);
        hold(this, native, arguments, true);
      };
    });
  }
  // reportValidity focuses the first invalid control; until then it answers as checkValidity does.
  ["HTMLFormElement", "HTMLInputElement", "HTMLSelectElement", "HTMLTextAreaElement", "HTMLButtonElement",
    "HTMLFieldSetElement", "HTMLOutputElement", "HTMLObjectElement"].forEach(function (name) {
    var type = window[name];
    if (!type) return;
    gate(type.prototype, "reportValidity", function (native) {
      return function () {
        if (focusOpen) return native.apply(this, arguments);
        var valid = this.checkValidity();
        if (!valid) hold(this, native, arguments, false);
        return valid;
      };
    });
  });
  // A press starts afresh: of the calls that only move focus, only those it makes run on its hand-over.
  window.addEventListener("pointerdown", function (event) {
    if (event.isTrusted) held = held.filter(function (call) { return call.changes; });
  }, true);
  // On the user's click every held call runs; when focus opens otherwise, only those that change the app.
  function replay(all) {
    var calls = held;
    held = [];
    calls.forEach(function (call) {
      if (!all && !call.changes) return;
      if (call.target !== window && !(call.target && call.target.isConnected)) return;
      call.run.apply(call.target, call.args);
    });
  }
  // Closed before the app's own blur handlers run, so one that focuses again is held. Firefox blurs the element while
  // the document still has focus: closed until that settles, then reopened if focus only moved within the app.
  var settling = 0;
  window.addEventListener(
    "blur",
    function (event) {
      if (!focusOpen) return;
      if (event.target === window || event.target === document || !document.hasFocus()) {
        focusOpen = false;
        return;
      }
      if (event.relatedTarget) return;
      focusOpen = false;
      clearTimeout(settling);
      settling = setTimeout(function () {
        if (!document.hasFocus()) return;
        focusOpen = true;
        replay(true);
      }, 0);
    },
    true,
  );
  window.addEventListener("message", function (event) {
    var data = event.data;
    if (event.source !== parent || !data || data.type !== TYPE || data.kind !== "focusOpen") return;
    clearTimeout(settling);
    focusOpen = data.open === true;
    askedFocus = false;
    if (focusOpen) replay(data.replay === true);
  });

  // Escape the app did not use hands focus back to the chat.
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !event.defaultPrevented) post({ kind: "escape" });
  });

  // A card waits for the chat to say where it stands too, so it never shows a state it's about to leave.
  var fontsIn = false;
  function revealWhenReady() {
    if (fontsIn && (cardState || !document.querySelector(".lov-view"))) reveal();
  }
  // Shown once Tailwind and fonts have applied. Timers and no transition: an
  // offscreen cross-origin frame gets no animation frames until it scrolls in.
  function reveal() {
    if (document.documentElement.hasAttribute("data-lov-shown")) return;
    document.documentElement.setAttribute("data-lov-shown", "");
    reportSize();
    post({ kind: "shown" });
  }
  // Native number spinners can't be styled; quiet − and + take their place and step the same way.
  function stepper(input, always) {
    if (input.dataset.kitNone !== undefined || input.parentElement && input.parentElement.classList.contains("lov-step")) return;
    // A kit control is a stepper by choice, whatever sits near it.
    if (input.closest(".lov-control")) always = true;
    // A number paired with a slider is stepped by the slider; it needs no buttons of its own.
    for (var at = input.parentElement, up = 0; !always && at && up < 3; at = at.parentElement, up++) {
      if (at.querySelector('input[type="range"]')) return;
    }
    var wrap = document.createElement("span");
    // Bare until measured: a box too narrow for − and + beside its digits keeps none.
    wrap.className = "lov-step lov-step-narrow";
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);
    var arrows = document.createElement("span");
    [["down", "M1 5h8"], ["up", "M1 5h8M5 1v8"]].forEach(function (spec) {
      var button = document.createElement("button");
      button.type = "button";
      button.tabIndex = -1;
      button.setAttribute("aria-label", spec[0] === "up" ? "Increase" : "Decrease");
      button.innerHTML = '<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="' + spec[1] + '"/></svg>';
      button.addEventListener("click", function () {
        if (spec[0] === "up") input.stepUp(); else input.stepDown();
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      arrows.appendChild(button);
    });
    wrap.appendChild(arrows);
    fitStepper(input);
    // A kit control is stepped before it is in the page; measure it once it is.
    setTimeout(function () { fitStepper(input); }, 0);
    if (stepWidths) stepWidths.observe(input);
  }
  // − and + need about 120px of box; a narrower one, as an app's own w-16 box can be, stays a bare input.
  function fitStepper(input) {
    var wrap = input.parentElement;
    var width = input.getBoundingClientRect().width;
    // A box with no layout yet is measured again when it gets one. The observer only reports while the frame is
    // drawn, so a frame offscreen catches up as it scrolls in.
    if (wrap && width > 0) wrap.classList.toggle("lov-step-narrow", width < 120);
  }
  // After the observer's callback, never in it: the padding a fit changes resizes the box it watches.
  var stepWidths = typeof ResizeObserver === "function" ? new ResizeObserver(function (entries) {
    setTimeout(function () { entries.forEach(function (entry) { fitStepper(entry.target); }); }, 0);
  }) : null;
  function steppers(root) {
    // One argument: forEach's index would read as always.
    (root.querySelectorAll ? root.querySelectorAll('input[type="number"]') : []).forEach(function (input) { stepper(input); });
  }
  document.addEventListener("DOMContentLoaded", function () {
    steppers(document);
    new MutationObserver(function (records) {
      records.forEach(function (record) {
        record.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (node.matches && node.matches('input[type="number"]')) stepper(node);
          else steppers(node);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    // Tailwind's runtime restyles just after the page settles; a card drawn without it is ready with its fonts.
    var runtime = document.documentElement.getAttribute("data-lov-libraries") !== "none";
    fontsReady.then(function () {
      fontsIn = true;
      if (runtime) setTimeout(revealWhenReady, 40);
      else revealWhenReady();
    });
  });
  setTimeout(reveal, 1500);

  post({ kind: "ready" });
})();`}var od=(0,E.createContext)(null),id=(0,E.createContext)(!1),c0=(0,E.createContext)(!1),sd=()=>(0,E.use)(c0);function d0(e){return e.replace(/\x1B\[[0-9;]*[JKmsu]/g,"")}function p0(e){return e.replace(/`{3,}/g,"'''")}var dn=2e4;function Zn(e){const t=p0(d0(e));return t.length>dn?t.slice(0,dn)+"... (truncated)":t}function ld(e){const t=Lo(e),n=t.length>1?r=>`# Error number ${r+1}:
#################

`:()=>"";return Zn(t.map((r,a)=>`${n(a)}${r.error_message}
${r.meta_data?`
`+co(r.meta_data,2):""}`).join(`

`))}function cd(e,t){const n=`For the code present, I get the error below.

Please think step-by-step in order to resolve it.
\`\`\`
${Zn(e)}
\`\`\`
`;return!t||t!==t.trim()||!/^br_[A-Za-z0-9_-]{1,128}$/.test(t)?n:`${n}
For the project agent: if these errors do not contain enough detail to identify the fix, run \`lovable build diagnostics ${t} --json\` with code--exec in the project's sandbox.`}function dd(e,{surface:t,projectId:n}){const r=rt(),a=(0,E.useRef)(null),[i,s]=(0,E.useState)(!1);return{send:it(async d=>Ea(d)?(a.current=d,r.emit(Sa,{projectId:n}),s(!0),!1):e(d)),isDialogOpen:i,confirmSend:it(async()=>{const d=a.current;return a.current=null,s(!1),d===null?!1:(r.emit(la,{projectId:n,surface:t}),e(d))}),closeDialog:it(()=>{a.current=null,s(!1)})}}var u0=(0,E.createContext)(null),f0=()=>(0,E.use)(u0);function g0(e){return Object.fromEntries(Object.entries(e).filter(([,t])=>t!=null))}function h0(e,t,n){if(!(e.intent||(e.selected_elements?.length??0)>0))return Pa({message:e.message,projectIds:t?[t]:void 0,model:n});const r=fn();return{message:e.message,...e.intent?{intent:e.intent}:{},...e.message_intent_metadata?{message_intent_metadata:g0(e.message_intent_metadata)}:{},...t?{intent_project_id:t}:{},...e.selected_elements?.length?{selected_elements:e.selected_elements}:{},...r?{user_timezone:r}:{}}}var pn=class extends Error{},pd=e=>{const{projectId:t}=e,n=Ro(),r=f0(),a=at(),i=da(),s=Ue(),d=Da(),{mutateAsync:h}=be({mutationFn:async p=>{if(!n)throw new Error("workspace chat send adapter mounted outside a workspace chat");if(r)throw new pn(r.placeholder);const w=i?va({userId:a?.uid,workspaceId:n.workspaceId,chatId:n.chatId}):void 0,l=h0(p,t,w);await Se().POST("/workspaces/{workspace_id}/chats/{chat_id}/messages",{params:{path:{workspace_id:n.workspaceId,chat_id:n.chatId}},body:l}),Tr(s,n.workspaceId,n.chatId,p.message,l.project_ids??void 0)},onError:p=>{if(p instanceof pn){oe.info(p.message);return}d(p)||ja(p)}});return(0,E.useMemo)(()=>({mutateAsync:({body:p,onError:w})=>h(p,{onError:w})}),[h])};export{Oc as $,nc as $t,Wn as A,L0 as An,pc as At,Nc as B,q0 as Bn,Ws as Bt,o0 as C,Mi as Cn,fc as Ct,td as D,B0 as Dn,_c as Dt,ed as E,Fn as En,rl as Et,Wc as F,D0 as Fn,lc as Ft,$c as G,jn as Gt,Gc as H,zn as Hn,dc as Ht,Xc as I,F0 as In,Hs as It,Vc as J,Ps as Jt,Bc as K,Nn as Kt,Hc as L,R0 as Ln,Bs as Lt,Yc as M,j0 as Mn,$s as Mt,gl as N,H0 as Nn,js as Nt,xl as O,U0 as On,uc as Ot,hl as P,vi as Pn,Ks as Pt,qc as Q,ys as Qt,ul as R,Ye as Rn,cc as Rt,Jn as S,Rt as Sn,gc as St,Yn as T,yi as Tn,vc as Tt,Dc as U,Ys as Ut,Uc as V,O0 as Vn,sc as Vt,Kc as W,Un as Wt,ll as X,As as Xt,Lc as Y,Is as Yt,sl as Z,ac as Zt,r0 as _,zi as _n,kc as _t,cd as a,J0 as an,Rc as at,nd as b,Yt as bn,xc as bt,c0 as c,Y0 as cn,Mc as ct,sd as d,W0 as dn,dl as dt,tc as en,zc as et,Xn as f,Q0 as fn,Pc as ft,jl as g,V0 as gn,hc as gt,$l as h,$i as hn,yc as ht,dd as i,ec as in,Fc as it,Jc as j,N0 as jn,Js as jt,Zc as k,$0 as kn,Xs as kt,id as l,os as ln,Sc as lt,Hl as m,K0 as mn,yt as mt,u0 as n,ws as nn,Ic as nt,ld as o,ds as on,pl as ot,Bl as p,ji as pn,Zs as pt,jc as q,oc as qt,f0 as r,X0 as rn,Tc as rt,Zn as s,Z0 as sn,Cc as st,pd as t,rc as tn,Ec as tt,od as u,Dn as un,Ac as ut,rd as v,Ti as vn,mc as vt,bl as w,G0 as wn,ue as wt,cn as x,Ai as xn,bc as xt,ad as y,xt as yn,wc as yt,Qc as z,si as zn,ic as zt};
