import { useState } from "react";
import Playground from "./components/Playground";
import ResourceManagement from "./components/ResourceManagement";
import AssetDelivery from "./components/AssetDelivery";
import FeedbackCentre from "./components/FeedbackCentre";
import Dashboard from "./components/Dashboard";
import { C, ff, hd, bd, bi, rad, g, LOCALES, DEFAULT_PROFILES, LANG, tx, ICN, MODULES, Card, Field, Input, TextArea, Chip, CG, EmailSelect, Sec, CT, PageTitle, Sidebar, RESPONSIVE_CSS, sendNotification, ProjectActions, SaveBar, PasswordGate, BriefStatusSelect, BRIEF_STATUSES } from "./components/shared";

const PAID_SIZE_GROUPS = {"PMAX / PPC":["1200x300","1200x628","1200x1200","960x1200","300x300"],"PAID SOCIAL":["1080x1080","1080x1350","1080x1920"],"DISPLAY":["728x90","970x250","300x250","160x600","300x600"],"AFFILIATES":["336x280","320x50"]};
const EMAIL_TYPES = ["Launch","Product","Promo","Community"];
const WEB_PLACEMENTS = ["Homepage","PLP","PDP","Other"];
const BANNER_TYPES = ["Full Size Hero","Slim Banners","Secondary Banners","Other"];
const defaultEmailPart=(locale)=>({id:Date.now()+Math.random(),locale:locale||"",briefStatus:"brief_added",subjectLine:"",preHeader:"",heroImage:"",heading:"",bodyCopy:"",cta:"",secondaryCta:"",notes:"",figmaLink:""});
const defaultEmailCard=(num)=>({id:Date.now()+Math.random(),num:num||1,name:"",sendDate:"",handoverDate:"",parts:[defaultEmailPart("UK (ENG)")],activeTab:0,collapsed:false});
const defaultWebAsset=()=>({id:Date.now()+Math.random(),parentId:null,locale:"",name:"",heroImage:"",heading:"",subcopy:"",cta:"",secondaryCta:"",notes:"",briefStatus:"brief_added"});

export default function App(){
  const [copyState,setCopyState]=useState({});
  const CopyBriefLink=({emailNum,locale})=>{const loc=locale?localeShort(locale):`P1`;const ref=`E${String(emailNum).padStart(2,"0")}-${loc}`;const url=`https://pentland-hub.vercel.app/brief/PEN-0000/${ref}`;const k=emailNum+"-"+loc;const copied=copyState[k];const doCopy=()=>{navigator.clipboard.writeText(url).then(()=>{setCopyState(s=>({...s,[k]:true}));setTimeout(()=>setCopyState(s=>({...s,[k]:false})),2000);}).catch(()=>{});};return(<button onClick={doCopy} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",border:`1px solid ${copied?C.green+"66":C.g88}`,...rad,background:copied?C.green+"18":C.card,color:copied?C.green:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>{copied?"COPIED!":"COPY BRIEF LINK"}</button>);};
  const [sec,setSec]=useState({channels:false,web:false,email:false,paid:false});
  const tog=k=>setSec(s=>({...s,[k]:!s[k]}));
  const [profiles,setProfiles]=useState(DEFAULT_PROFILES);
  const addUser=(newUser)=>{if(typeof newUser==="string"){if(profiles.find(p=>p.email===newUser))return;setProfiles(p=>[...p,{firstName:"",lastName:"",email:newUser,jobTitle:"",department:""}]);}else{if(profiles.find(p=>p.email===newUser.email))return;setProfiles(p=>[...p,{...newUser,jobTitle:newUser.jobTitle||"",department:newUser.department||""}]);}};
  const updateProfile=(email,updates)=>setProfiles(p=>p.map(u=>u.email===email?{...u,...updates}:u));
  const getUserName=(email)=>{const u=profiles.find(x=>x.email===email);return u&&u.firstName?`${u.firstName} ${u.lastName}`:email;};
  const userList=profiles.map(p=>p.email);
  const [jobNum,setJobNum]=useState(""); const [brand,setBrand]=useState(""); const [title,setTitle]=useState("");
  const [objective,setObj]=useState(""); const [locales,setLoc]=useState([]); const [sd,setSd]=useState(""); const [ed,setEd]=useState(""); const [hd2,setHd2]=useState("");
  const [tkTitle,setTkTitle]=useState(""); const [damLink,setDam]=useState(""); const [abLink,setAb]=useState(""); const [dFiles,setDf]=useState(""); const [cpTk,setCpTk]=useState(""); const [bGuid,setBg]=useState("");
  const [ch,setCh]=useState([]);
  const [wp,setWp]=useState([]); const [wbt,setWbt]=useState([]); const [webAssets,setWebAssets]=useState([defaultWebAsset()]); const [webOwner,setWebOwner]=useState("");
  const addWA=()=>setWebAssets(a=>[...a,defaultWebAsset()]); const rmWA=id=>setWebAssets(a=>a.filter(w=>w.id!==id)); const upWA=(id,f,v)=>setWebAssets(a=>a.map(w=>w.id===id?{...w,[f]:v}:w));
  const dupWA=async(wa,loc)=>{const cid=Date.now()+Math.random();const clone={...wa,id:cid,parentId:wa.parentId||wa.id,locale:loc||""};const idx=webAssets.findIndex(w=>w.id===wa.id);const updated=[...webAssets];updated.splice(idx+1,0,clone);setWebAssets(updated);if(LANG[loc]){const t=await tx({name:wa.name,heading:wa.heading,subcopy:wa.subcopy,cta:wa.cta,secondaryCta:wa.secondaryCta,notes:wa.notes},loc);setWebAssets(a=>a.map(w=>w.id===cid?{...w,...t}:w));}};
  const webNum=(wa,idx)=>{if(!wa.parentId){let n=0;for(let i=0;i<=idx;i++){if(!webAssets[i].parentId)n++;}return String(n).padStart(2,"0");}const pIdx=webAssets.findIndex(w=>w.id===wa.parentId);let pNum=0;for(let i=0;i<=pIdx;i++){if(!webAssets[i].parentId)pNum++;}let sub=1;for(let i=pIdx+1;i<=idx;i++){if(webAssets[i].parentId===wa.parentId)sub++;}return String(pNum).padStart(2,"0")+"."+sub;};
  const [et,setEt]=useState([]); const [emails,setEmails]=useState([defaultEmailCard(1)]); const [emailOwner,setEmailOwner]=useState(""); const [emailSort,setEmailSort]=useState("asc");
  const addE=()=>setEmails(e=>[...e,defaultEmailCard(e.length+1)]);
  const rmE=id=>setEmails(e=>{const f=e.filter(em=>em.id!==id);return f.map((em,i)=>({...em,num:i+1}));});
  const upEmail=(id,field,val)=>setEmails(e=>e.map(em=>em.id===id?{...em,[field]:val}:em));
  const upEmailPart=(emailId,partIdx,field,val)=>setEmails(e=>e.map(em=>{if(em.id!==emailId)return em;const np=em.parts.map((p,i)=>i===partIdx?{...p,[field]:val}:p);return{...em,parts:np};}));
  const addEmailPart=async(emailId,locale)=>{setEmails(e=>e.map(em=>{if(em.id!==emailId)return em;const src=em.parts[em.activeTab]||em.parts[0];const np={...src,id:Date.now()+Math.random(),locale,briefStatus:"brief_added",figmaLink:""};return{...em,parts:[...em.parts,np],activeTab:em.parts.length,collapsed:false};}));if(LANG[locale]){const em=emails.find(x=>x.id===emailId);const src=em.parts[em.activeTab]||em.parts[0];const t=await tx({subjectLine:src.subjectLine,preHeader:src.preHeader,heading:src.heading,bodyCopy:src.bodyCopy,cta:src.cta,secondaryCta:src.secondaryCta,notes:src.notes},locale);setEmails(e=>e.map(em2=>{if(em2.id!==emailId)return em2;const np=em2.parts.map((p,i)=>i===em2.parts.length-1?{...p,...t}:p);return{...em2,parts:np};}));}};
  const removeEmailPart=(emailId,partIdx)=>{setEmails(e=>e.map(em=>{if(em.id!==emailId||em.parts.length<=1)return em;const np=em.parts.filter((_,i)=>i!==partIdx);const na=em.activeTab>=np.length?np.length-1:em.activeTab>partIdx?em.activeTab-1:em.activeTab;return{...em,parts:np,activeTab:na};}));};
  const dupEmail=(email)=>{const num=emails.length+1;const clone={...email,id:Date.now()+Math.random(),num,parts:email.parts.map(p=>({...p,id:Date.now()+Math.random()})),activeTab:0,collapsed:false};setEmails(e=>[...e,clone]);};
  const sortedEmails=[...emails].sort((a,b)=>{const da=a.sendDate||"9999-12-31";const db=b.sendDate||"9999-12-31";return emailSort==="asc"?da.localeCompare(db):db.localeCompare(da);});
  const localeShort=l=>{if(!l)return"";if(l.includes("UK"))return"UK";if(l.includes("US"))return"US";if(l.includes("CAN (FR)"))return"CAN-FR";if(l.includes("CAN"))return"CAN";if(l.includes("DE"))return"DE";if(l.includes("FR (FR)"))return"FR";return l;};
  const [showLocalePicker,setShowLocalePicker]=useState(null);
  const [ps,setPs]=useState({}); const [os,setOs]=useState(""); const [phi,setPhi]=useState(""); const [pc,setPc]=useState(""); const [pv,setPv]=useState(""); const [paidOwner,setPaidOwner]=useState("");
  const tps=(gr,sz)=>setPs(p=>{const a=p[gr]||[];return{...p,[gr]:a.includes(sz)?a.filter(s=>s!==sz):[...a,sz]};});
  const [dl,setDl]=useState(""); const [cl,setCl]=useState(""); const [crl,setCrl]=useState(""); const [pl,setPl]=useState("");
  const [pdl,setPdl]=useState(""); const [pcl,setPcl]=useState(""); const [pcrl,setPcrl]=useState(""); const [ppl,setPpl]=useState(""); const [pfa,setPfa]=useState("");
  const [es,setEs]=useState(null); const [ho,setHo]=useState("");
  const [showNotifyModal,setShowNotifyModal]=useState(false);
  const [notifyEmail,setNotifyEmail]=useState("");
  const [notifySent,setNotifySent]=useState(false);
  const [modDirty,setModDirty]=useState({}); const [modSaved,setModSaved]=useState({});
  const markDirty=(mod)=>{setModDirty(d=>({...d,[mod]:true}));setModSaved(s=>({...s,[mod]:false}));};
  const saveModule=(mod)=>{setModDirty(d=>({...d,[mod]:false}));setModSaved(s=>({...s,[mod]:true}));setTimeout(()=>setModSaved(s=>({...s,[mod]:false})),3000);};
  const [view,setView]=useState("landing"); const [searchJob,setSearchJob]=useState("");
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [projectStatus,setProjectStatus]=useState("active");
  const [actionMsg,setActionMsg]=useState(null);
  const [authed,setAuthed]=useState(false);
  const [pwInput,setPwInput]=useState("");
  const [pwError,setPwError]=useState(false);
  const GATE_PW = "pentlandhub";
  const checkPw = () => { if(pwInput===GATE_PW){setAuthed(true);setPwError(false);setPwInput("");}else{setPwError(true);} };
  const handleProjectAction=(action)=>{
    if(action==="pause"){setProjectStatus("paused");setActionMsg("PROJECT PAUSED");}
    else if(action==="resume"){setProjectStatus("active");setActionMsg("PROJECT RESUMED");}
    else if(action==="archive"){setProjectStatus("archived");setActionMsg("PROJECT ARCHIVED");}
    else if(action==="cancel"){setProjectStatus("cancelled");setActionMsg("PROJECT CANCELLED");}
    setTimeout(()=>setActionMsg(null),3000);
  };
  const tch=c=>setCh(a=>a.includes(c)?a.filter(x=>x!==c):[...a,c]);
  const tLoc=l=>setLoc(a=>a.includes(l)?a.filter(x=>x!==l):[...a,l]);
  let si=0;

  const GS = `*{margin:0;padding:0;box-sizing:border-box}::placeholder{color:${C.g70}}button:hover{opacity:0.88}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.g88};border-radius:3px}@keyframes fu{from{opacity:0;transform:translateX(-50%) translateY(6px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}${RESPONSIVE_CSS}`;

  // LANDING
  if(view==="landing") return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:ff,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{GS}</style>
      <div style={{maxWidth:520,width:"100%",padding:28}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:11,...hd,color:C.red,fontFamily:ff,letterSpacing:"0.1em",marginBottom:4}}>PENTLAND C&C</div>
          <div style={{fontSize:26,...hd,color:C.black,fontFamily:ff,letterSpacing:"0.03em"}}>PROJECT HUB</div>
          <p style={{fontSize:14,color:C.g50,fontFamily:ff,marginTop:8,...bd}}>End-to-end project tracking from conception to delivery.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <Card style={{cursor:"pointer"}}><button onClick={()=>{setJobNum("NEW-"+Date.now().toString(36).toUpperCase().slice(-6));setView("project");}} style={{width:"100%",border:"none",background:"transparent",cursor:"pointer",fontFamily:ff,textAlign:"left",padding:4}}>
            <div style={{fontSize:14,...hd,color:C.black,fontFamily:ff}}>CREATE NEW PROJECT</div>
            <div style={{fontSize:13,color:C.g70,fontFamily:ff,marginTop:2,...bd}}>Start fresh</div>
          </button></Card>
          <Card>
            <div style={{fontSize:14,...hd,color:C.black,fontFamily:ff,marginBottom:8}}>ENTER JOB NUMBER</div>
            <div style={{display:"flex",gap:8}}>
              <input value={searchJob} onChange={e=>setSearchJob(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&searchJob.trim()){setJobNum(searchJob.trim());setView("project");}}} placeholder="e.g. PEN-2025-001" style={{...bi,flex:1}}/>
              <button onClick={()=>{if(searchJob.trim()){setJobNum(searchJob.trim());setView("project");}}} style={{padding:"11px 20px",border:"none",...rad,background:C.black,color:C.card,fontSize:12,...hd,fontFamily:ff,cursor:"pointer"}}>GO</button>
            </div>
          </Card>
          <div style={{height:1,background:C.g88,margin:"8px 0"}}/>
          <Card style={{cursor:"pointer"}}><button onClick={()=>setView("dashboard")} style={{width:"100%",border:"none",background:"transparent",cursor:"pointer",fontFamily:ff,textAlign:"left",padding:4,display:"flex",alignItems:"center",gap:12}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.g70} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            <div>
              <div style={{fontSize:14,...hd,color:C.black,fontFamily:ff}}>PROJECT DASHBOARD</div>
              <div style={{fontSize:13,color:C.g70,fontFamily:ff,marginTop:2,...bd}}>View all projects &amp; status</div>
            </div>
            <span style={{marginLeft:"auto",color:C.g70,fontSize:16}}>›</span>
          </button></Card>
        </div>
      </div>
    </div>
  );

  // DASHBOARD
  if(view==="dashboard") return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:ff}}>
      <style>{GS}</style>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"32px 28px 60px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <div>
            <div style={{fontSize:10,...hd,color:C.red,fontFamily:ff,letterSpacing:"0.1em",marginBottom:4}}>PENTLAND C&C</div>
            <div style={{fontSize:24,...hd,color:C.black,fontFamily:ff,letterSpacing:"0.03em"}}>PROJECT DASHBOARD</div>
          </div>
          <button onClick={()=>setView("landing")} style={{padding:"10px 20px",border:`1px solid ${C.g88}`,...rad,background:C.card,cursor:"pointer",fontFamily:ff,fontSize:12,fontWeight:500,color:C.g50}}>BACK TO HUB</button>
        </div>
        <Dashboard setView={setView} setJobNum={setJobNum}/>
      </div>
    </div>
  );

  // PROJECT HUB
  if(view==="project") return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:ff,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{GS}</style>
      <div style={{maxWidth:520,width:"100%",padding:28}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:11,...hd,color:C.red,fontFamily:ff,letterSpacing:"0.1em",marginBottom:4}}>PENTLAND C&C</div>
          <div style={{fontSize:26,...hd,color:C.black,fontFamily:ff,letterSpacing:"0.03em"}}>PROJECT HUB</div>
        </div>
        <Card style={{marginBottom:14,textAlign:"center",padding:"18px 28px"}}>
          <div style={{fontSize:10,...hd,color:C.g70,fontFamily:ff,marginBottom:4}}>CURRENT PROJECT</div>
          <div style={{fontSize:20,fontWeight:700,color:C.black,fontFamily:ff}}>{jobNum}</div>
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {MODULES.map(m=>{const vk=m.key==="brief"?"form":m.key;return(
            <button key={m.key} onClick={()=>setView(vk)} style={{width:"100%",padding:"14px 18px",border:`1px solid ${C.g88}`,...rad,background:C.card,cursor:"pointer",fontFamily:ff,textAlign:"left",display:"flex",alignItems:"center",gap:12}}>
              <span style={{color:C.g70,display:"flex",flexShrink:0}}>{ICN[m.key]}</span>
              <div><div style={{fontSize:13,fontWeight:600,color:C.black,fontFamily:ff}}>{m.label}</div><div style={{fontSize:12,color:C.g70,fontFamily:ff,marginTop:1,...bd}}>{m.sub}</div></div>
              <span style={{marginLeft:"auto",color:C.g70,fontSize:16}}>›</span>
            </button>
          );})}
        </div>
        {actionMsg&&<div style={{marginTop:14,padding:"10px 18px",background:projectStatus==="cancelled"?"#ef4444":projectStatus==="paused"?"#f59e0b":projectStatus==="archived"?C.g50:C.green,color:C.card,...rad,fontSize:12,...hd,fontFamily:ff,textAlign:"center"}}>{actionMsg}</div>}
        {projectStatus!=="active"&&<div style={{marginTop:14,padding:"12px 18px",border:`1px solid ${projectStatus==="cancelled"?"#ef444433":projectStatus==="paused"?"#f59e0b33":C.g88}`,...rad,background:C.card,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          <div style={{width:8,height:8,borderRadius:4,background:projectStatus==="cancelled"?"#ef4444":projectStatus==="paused"?"#f59e0b":C.g50}}/>
          <span style={{fontSize:12,...hd,color:projectStatus==="cancelled"?"#ef4444":projectStatus==="paused"?"#f59e0b":C.g50,fontFamily:ff}}>PROJECT {projectStatus.toUpperCase()}</span>
        </div>}
        <div style={{marginTop:20}}><ProjectActions onAction={handleProjectAction} projectStatus={projectStatus}/></div>
        <button onClick={()=>setView("dashboard")} style={{width:"100%",marginTop:10,padding:"12px 18px",border:`1px solid ${C.g88}`,...rad,background:C.panel,cursor:"pointer",fontFamily:ff,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.g50} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
          <span style={{fontSize:12,fontWeight:500,color:C.g50}}>SEE DASHBOARD</span>
        </button>
      </div>
    </div>
  );

  // LAYOUT WRAPPER for all modules
  const ML = (sub, label, accent, content) => (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:ff}}>
      <style>{GS}</style>
      <Sidebar view={view} setView={setView} jobNum={jobNum} open={sidebarOpen} setOpen={setSidebarOpen}/>
      <div className="main-content" style={{marginLeft:250,padding:"32px 40px 60px"}}>
        {actionMsg&&<div style={{marginBottom:16,padding:"10px 18px",background:projectStatus==="cancelled"?"#ef4444":projectStatus==="paused"?"#f59e0b":projectStatus==="archived"?C.g50:C.green,color:C.card,...rad,fontSize:12,...hd,fontFamily:ff,textAlign:"center"}}>{actionMsg}</div>}
        {projectStatus!=="active"&&<div style={{marginBottom:16,padding:"12px 18px",border:`1px solid ${projectStatus==="cancelled"?"#ef444433":projectStatus==="paused"?"#f59e0b33":C.g88}`,...rad,background:C.card,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:8,height:8,borderRadius:4,background:projectStatus==="cancelled"?"#ef4444":projectStatus==="paused"?"#f59e0b":C.g50}}/>
          <span style={{fontSize:12,...hd,color:projectStatus==="cancelled"?"#ef4444":projectStatus==="paused"?"#f59e0b":C.g50,fontFamily:ff}}>THIS PROJECT IS {projectStatus.toUpperCase()}</span>
          {projectStatus==="paused"&&<button onClick={()=>handleProjectAction("resume")} style={{marginLeft:"auto",padding:"6px 14px",border:"none",...rad,background:C.green,color:C.card,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>RESUME</button>}
        </div>}
        <PageTitle title={label} sub={sub} accent={accent} onMenu={()=>setSidebarOpen(true)}/>
        {content}
      </div>
    </div>
  );

  // OVERVIEW
  if(view==="overview") return ML("THE ADMIN BIT","CAMPAIGN OVERVIEW",C.blue,
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card>
        <div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:16}}>PROJECT DETAILS</div>
        <div className="hub-grid-3" style={g(3)}><Field label="JOB NUMBER" required><Input value={jobNum} onChange={v=>{setJobNum(v);markDirty("overview");}} placeholder="e.g. PEN-001"/></Field><Field label="BRAND" required><Input value={brand} onChange={v=>{setBrand(v);markDirty("overview");}} placeholder="e.g. Speedo"/></Field><Field label="CAMPAIGN TITLE" required><Input value={title} onChange={v=>{setTitle(v);markDirty("overview");}} placeholder="e.g. Summer 25"/></Field></div>
        <div style={{marginTop:16}}><Field label="CAMPAIGN OBJECTIVE" required><TextArea value={objective} onChange={v=>{setObj(v);markDirty("overview");}} placeholder="What is this campaign trying to achieve?"/></Field></div>
      </Card>
      <Card>
        <div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:16}}>LOCALES & DATES</div>
        <div style={{marginBottom:16}}><Field label="TARGET LOCALES"><div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>{LOCALES.map(l=><Chip key={l} label={l} active={locales.includes(l)} onClick={()=>{tLoc(l);markDirty("overview");}} accent={C.blue}/>)}</div></Field></div>
        <div className="hub-grid-3" style={g(3)}><Field label="START DATE" required><Input type="date" value={sd} onChange={v=>{setSd(v);markDirty("overview");}}/></Field><Field label="END DATE" required><Input type="date" value={ed} onChange={v=>{setEd(v);markDirty("overview");}}/></Field><Field label="HANDOVER DATE" required><Input type="date" value={hd2} onChange={v=>{setHd2(v);markDirty("overview");}}/></Field></div>
      </Card>
      <SaveBar dirty={modDirty.overview} saved={modSaved.overview} onSave={()=>saveModule("overview")}/>
    </div>
  );

  // TOOLKIT
  if(view==="toolkit") return ML("SHARED RESOURCES","CAMPAIGN TOOLKIT",C.blue,
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card>
        <div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:16}}>TOOLKIT LINKS</div>
        <div className="hub-grid-2" style={g(2)}><Field label="TOOLKIT TITLE"><Input value={tkTitle} onChange={v=>{setTkTitle(v);markDirty("toolkit");}} placeholder="e.g. SS25 Toolkit"/></Field><Field label="DAM TOOLKIT LINK"><Input value={damLink} onChange={v=>{setDam(v);markDirty("toolkit");}} placeholder="https://..."/></Field></div>
        <div className="hub-grid-2" style={{...g(2),marginTop:16}}><Field label="ASSET BANK LINK"><Input value={abLink} onChange={v=>{setAb(v);markDirty("toolkit");}} placeholder="https://..."/></Field><Field label="DESIGN FILES"><Input value={dFiles} onChange={v=>{setDf(v);markDirty("toolkit");}} placeholder="https://figma.com/..."/></Field></div>
        <div style={{...g(2),marginTop:16}}><Field label="COPY TOOLKIT"><Input value={cpTk} onChange={v=>{setCpTk(v);markDirty("toolkit");}} placeholder="https://..."/></Field><Field label="BRAND GUIDELINES"><Input value={bGuid} onChange={v=>{setBg(v);markDirty("toolkit");}} placeholder="https://..."/></Field></div>
      </Card>
      <div style={{padding:"14px 18px",background:C.black,color:C.card,...rad,fontSize:12,...bd,fontFamily:ff,lineHeight:1.5}}>All channels must use assets from this toolkit.</div>
      <SaveBar dirty={modDirty.toolkit} saved={modSaved.toolkit} onSave={()=>saveModule("toolkit")}/>
    </div>
  );

  // APPROVAL
  if(view==="approval") return ML("PROJECT SIGN-OFF","APPROVAL CENTRE",C.green,authed?
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card>
        <div style={{fontSize:14,...hd,color:C.black,fontFamily:ff,marginBottom:16}}>BRIEF APPROVAL</div>
        <div className="hub-grid-2" style={g(2)}><Field label="DIGITAL ASSET LEAD"><EmailSelect value={dl} onChange={setDl} profiles={profiles} onAddUser={addUser}/></Field><Field label="CREATIVE LEAD"><EmailSelect value={cl} onChange={setCl} profiles={profiles} onAddUser={addUser}/></Field><Field label="CRM LEAD"><EmailSelect value={crl} onChange={setCrl} profiles={profiles} onAddUser={addUser}/></Field><Field label="PAID MEDIA LEAD"><EmailSelect value={pl} onChange={setPl} profiles={profiles} onAddUser={addUser}/></Field></div>
        <div style={{height:1,background:C.g88,margin:"20px 0"}}/>
        <div style={{fontSize:12,...hd,color:C.black,fontFamily:ff,marginBottom:12}}>HAND BRIEF OVER TO DESIGNER</div>
        <div style={{display:"flex",gap:12,alignItems:"flex-end"}}><div style={{flex:1}}><Field label="DESIGNER"><EmailSelect value={ho} onChange={setHo} profiles={profiles} onAddUser={addUser}/></Field></div><button onClick={async()=>{if(ho){setEs("brief");setTimeout(()=>setEs(null),3000);await sendNotification({to_email:ho,role:"Designer (Brief Handover)",job_number:jobNum,project_name:title,brand});}}} style={{padding:"11px 24px",border:"none",...rad,background:C.black,color:C.card,fontSize:12,...hd,fontFamily:ff,cursor:"pointer"}}>HAND OVER</button></div>
        {es==="brief"&&<div style={{marginTop:8,fontSize:11,...hd,color:C.green,fontFamily:ff}}>BRIEF HANDED OVER</div>}
      </Card>
      <Card>
        <div style={{fontSize:14,...hd,color:C.black,fontFamily:ff,marginBottom:16}}>PROJECT APPROVAL</div>
        <div className="hub-grid-2" style={g(2)}><Field label="DIGITAL ASSET LEAD"><EmailSelect value={pdl} onChange={setPdl} profiles={profiles} onAddUser={addUser}/></Field><Field label="CREATIVE LEAD"><EmailSelect value={pcl} onChange={setPcl} profiles={profiles} onAddUser={addUser}/></Field><Field label="CRM LEAD"><EmailSelect value={pcrl} onChange={setPcrl} profiles={profiles} onAddUser={addUser}/></Field><Field label="PAID MEDIA LEAD"><EmailSelect value={ppl} onChange={setPpl} profiles={profiles} onAddUser={addUser}/></Field></div>
        <div style={{height:1,background:C.g88,margin:"20px 0"}}/>
        <Field label="FINAL APPROVAL"><EmailSelect value={pfa} onChange={setPfa} profiles={profiles} onAddUser={addUser}/></Field>
        <div style={{marginTop:20}}><button onClick={async()=>{if(pfa){setEs("signed");setTimeout(()=>setEs(null),3000);await sendNotification({to_email:pfa,role:"Final Approver (Project Sign-Off)",job_number:jobNum,project_name:title,brand});}}} style={{width:"100%",padding:"13px 24px",border:"none",...rad,background:C.black,color:C.card,fontSize:13,...hd,fontFamily:ff,cursor:"pointer"}}>SIGN OFF AND MOVE TO FINAL DELIVERY</button></div>
        {es==="signed"&&<div style={{marginTop:8,textAlign:"center",fontSize:11,...hd,color:C.green,fontFamily:ff}}>PROJECT SIGNED OFF</div>}
      </Card>
    </div>
  :<PasswordGate pwInput={pwInput} setPwInput={setPwInput} pwError={pwError} onSubmit={checkPw} moduleName="Approval Centre"/>);

  // EXTERNAL MODULES
  if(view==="playground") return ML("COLLABORATIVE KICK OFF","PROJECT PLAYGROUND",C.blue,<Playground/>);
  if(view==="resources") return ML("WHO NEEDS ACCESS","RESOURCE MANAGEMENT",C.red,authed?<ResourceManagement profiles={profiles} addUser={addUser} updateProfile={updateProfile} jobNum={jobNum} brand={brand} title={title} setView={setView}/>:<PasswordGate pwInput={pwInput} setPwInput={setPwInput} pwError={pwError} onSubmit={checkPw} moduleName="Resource Management"/>);
  if(view==="profiles") return ML("TEAM DIRECTORY","PROFILES",C.red,authed?<ResourceManagement profiles={profiles} addUser={addUser} updateProfile={updateProfile} jobNum={jobNum} brand={brand} title={title} setView={setView} initialView="profiles"/>:<PasswordGate pwInput={pwInput} setPwInput={setPwInput} pwError={pwError} onSubmit={checkPw} moduleName="Profiles"/>);
  if(view==="delivery") return ML("DOWNLOADS & DAM","ASSET DELIVERY",C.blue,<AssetDelivery/>);
  if(view==="feedback") return ML("HOW DID IT GO?","FEEDBACK CENTRE",C.yellow,<FeedbackCentre jobNum={jobNum} brand={brand} title={title}/>);

  // BRIEF FORM
  return ML("MULTI-CHANNEL HUB","PROJECT BRIEF",C.red,
    <div style={{display:"flex",flexDirection:"column",gap:14,paddingBottom:80}}>
      <Card style={{padding:"14px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span style={{fontSize:12,...bd,color:C.g50,fontFamily:ff}}>Auto-translation is enabled for DE/FR locales when duplicating assets.</span>
        </div>
      </Card>

      <Sec title="CHANNEL DELIVERABLES" num={String(++si).padStart(2,"0")} collapsed={sec.channels} onToggle={()=>tog("channels")}>
        <div className="hub-grid-5" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}><CT label="Web Assets" tag="ECOMM" active={ch.includes("web")} onToggle={()=>tch("web")} accent={C.red}/><CT label="Email Assets" tag="CRM" active={ch.includes("email")} onToggle={()=>tch("email")} accent={C.yellow}/><CT label="Paid Media" tag="PAID" active={ch.includes("paid")} onToggle={()=>tch("paid")} accent={C.blue}/><CT label="Social Media" tag="SOCIAL" disabled disabledText="COMING SOON"/><CT label="Amazon Assets" tag="MARKETPLACE" disabled disabledText="COMING SOON"/></div>
      </Sec>

      {ch.includes("web")&&<Sec title="WEB ASSETS (ECOMM)" num={String(++si).padStart(2,"0")} collapsed={sec.web} onToggle={()=>tog("web")} accent={C.red}>
        <Field label="SECTION OWNER"><EmailSelect value={webOwner} onChange={setWebOwner} profiles={profiles} onAddUser={addUser}/></Field>
        <div style={{height:1,background:C.g88,margin:"20px 0"}}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}><span style={{fontSize:13,...hd,color:C.black,fontFamily:ff}}>INDIVIDUAL WEB ASSET BRIEFS</span><button onClick={addWA} style={{padding:"8px 18px",border:"none",...rad,background:C.black,color:C.card,fontSize:11,...hd,fontFamily:ff,cursor:"pointer"}}>+ ADD WEB ASSET</button></div>
        {webAssets.map((wa,idx)=>(<Card key={wa.id} style={{marginBottom:8,borderLeft:wa.parentId?`3px solid ${C.red}`:`1px solid ${C.g88}`,padding:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:12,...hd,color:C.black,fontFamily:ff}}>WEB ASSET {webNum(wa,idx)}{wa.locale?` — ${wa.locale}`:""}</span><BriefStatusSelect value={wa.briefStatus||"brief_added"} onChange={v=>upWA(wa.id,"briefStatus",v)}/></div>{webAssets.length>1&&<button onClick={()=>rmWA(wa.id)} style={{padding:"4px 12px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>REMOVE</button>}</div>
          <div style={{marginBottom:12}}><Field label="LOCALE / LANGUAGE"><CG options={LOCALES} selected={wa.locale?[wa.locale]:[]} onChange={v=>upWA(wa.id,"locale",v.length?v[v.length-1]:"")}/></Field></div>
          <div className="hub-grid-2" style={g(2)}><Field label="KEY PLACEMENTS"><CG options={WEB_PLACEMENTS} selected={wp} onChange={setWp}/></Field><Field label="BANNER SIZES"><CG options={BANNER_TYPES} selected={wbt} onChange={setWbt}/></Field></div>
          <div className="hub-grid-2" style={{...g(2),marginTop:12}}><Field label="ASSET NAME"><Input value={wa.name} onChange={v=>upWA(wa.id,"name",v)} placeholder="e.g. Hero Banner"/></Field><Field label="HERO IMAGE (LINK)"><Input value={wa.heroImage} onChange={v=>upWA(wa.id,"heroImage",v)} placeholder="https://..."/></Field></div>
          <div className="hub-grid-2" style={{...g(2),marginTop:12}}><Field label="MAIN HEADING"><Input value={wa.heading} onChange={v=>upWA(wa.id,"heading",v)} placeholder="Main headline"/></Field><Field label="SUBCOPY"><Input value={wa.subcopy} onChange={v=>upWA(wa.id,"subcopy",v)} placeholder="Supporting copy"/></Field></div>
          <div className="hub-grid-2" style={{...g(2),marginTop:12}}><Field label="CTA"><Input value={wa.cta} onChange={v=>upWA(wa.id,"cta",v)} placeholder="e.g. Shop Now"/></Field><Field label="SECONDARY CTA"><Input value={wa.secondaryCta} onChange={v=>upWA(wa.id,"secondaryCta",v)} placeholder="e.g. Learn More"/></Field></div>
          <div style={{marginTop:12}}><Field label="ADDITIONAL NOTES"><TextArea value={wa.notes} onChange={v=>upWA(wa.id,"notes",v)} placeholder="Any additional notes..." rows={2}/></Field></div>
          <div style={{marginTop:16,display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:11,...hd,color:C.g50,fontFamily:ff}}>DUPLICATE FOR:</span><select onChange={e=>{if(e.target.value){dupWA(wa,e.target.value);e.target.value="";}}} style={{...bi,width:"auto",fontSize:11,cursor:"pointer"}}><option value="">Select locale...</option>{LOCALES.map(l=><option key={l} value={l}>{l}{LANG[l]?" (auto-translate)":""}</option>)}</select></div>
        </Card>))}
      </Sec>}

      {ch.includes("email")&&<Sec title="EMAIL ASSETS (CRM)" num={String(++si).padStart(2,"0")} collapsed={sec.email} onToggle={()=>tog("email")} accent={C.yellow}>
        <Field label="SECTION OWNER"><EmailSelect value={emailOwner} onChange={setEmailOwner} profiles={profiles} onAddUser={addUser}/></Field>
        <div style={{height:1,background:C.g88,margin:"20px 0"}}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:13,...hd,color:C.black,fontFamily:ff}}>INDIVIDUAL EMAIL BRIEFS</span>
            <button onClick={addE} style={{padding:"8px 18px",border:"none",...rad,background:C.black,color:C.card,fontSize:11,...hd,fontFamily:ff,cursor:"pointer"}}>+ ADD EMAIL</button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>SEND DATE:</span>
            <button onClick={()=>setEmailSort("asc")} style={{padding:"6px 12px",border:`1px solid ${emailSort==="asc"?C.black:C.g88}`,...rad,background:emailSort==="asc"?C.black:C.card,color:emailSort==="asc"?C.card:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>SOONEST</button>
            <button onClick={()=>setEmailSort("desc")} style={{padding:"6px 12px",border:`1px solid ${emailSort==="desc"?C.black:C.g88}`,...rad,background:emailSort==="desc"?C.black:C.card,color:emailSort==="desc"?C.card:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>LATEST</button>
          </div>
        </div>
        {sortedEmails.map(em=>{const numStr=String(em.num).padStart(2,"0");const titleDisplay=`${numStr}${em.name?` — ${em.name}`:""}`;const ap=em.parts[em.activeTab]||em.parts[0];const tabIdx=em.activeTab;const completeParts=em.parts.filter(p=>p.briefStatus==="complete").length;const dateRange=(em.sendDate||em.handoverDate)?`${em.sendDate||"—"} → ${em.handoverDate||"—"}`:"No dates set";return(<div key={em.id} style={{marginBottom:12}}>
          <div style={{background:C.card,border:`1px solid ${C.g88}`,...rad,overflow:"hidden"}}>
            {/* Collapsed Header */}
            <div onClick={()=>upEmail(em.id,"collapsed",!em.collapsed)} style={{padding:"16px 22px",background:"#D8DBE0",cursor:"pointer",userSelect:"none"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                <div style={{display:"flex",alignItems:"center",gap:12,flex:1,minWidth:0}}>
                  <div style={{width:4,height:28,...rad,background:C.yellow,flexShrink:0}}/>
                  <span style={{fontSize:15,...hd,color:C.black,fontFamily:ff,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{titleDisplay||numStr}</span>
                  {em.parts.length>1&&<span style={{padding:"2px 8px",...rad,background:C.yellow+"33",color:"#92400e",fontSize:9,...hd,fontFamily:ff,flexShrink:0}}>{em.parts.length} PARTS</span>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
                  <span style={{fontSize:11,...bd,color:C.g50,fontFamily:ff}}>{dateRange}</span>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>{em.parts.map((p,i)=>{const s=BRIEF_STATUSES.find(x=>x.key===p.briefStatus);return<div key={i} style={{width:8,height:8,borderRadius:4,background:s?.color||C.g70}}/>;})}</div>
                  <span style={{fontSize:10,...bd,color:C.g50,fontFamily:ff}}>{completeParts}/{em.parts.length}</span>
                  <span style={{fontSize:16,color:C.g50,transform:em.collapsed?"rotate(0)":"rotate(180deg)",transition:"transform 0.2s",display:"inline-block"}}>▾</span>
                </div>
              </div>
            </div>
            {!em.collapsed&&<>
              {/* Name + Dates */}
              <div style={{padding:"14px 22px",borderBottom:`1px solid ${C.g88}`,background:C.panel}}>
                <div style={{display:"flex",alignItems:"flex-end",gap:12,flexWrap:"wrap"}}>
                  <div style={{flex:1,minWidth:180}}>
                    <label style={{display:"block",fontSize:9,...hd,color:C.g50,fontFamily:ff,marginBottom:4}}>EMAIL NAME</label>
                    <Input value={em.name} onChange={v=>upEmail(em.id,"name",v)} placeholder="e.g. Launch Email"/>
                  </div>
                  <div><label style={{display:"block",fontSize:9,...hd,color:C.g50,fontFamily:ff,marginBottom:4}}>SEND DATE</label><input type="date" value={em.sendDate} onChange={e=>upEmail(em.id,"sendDate",e.target.value)} style={{...bi,fontSize:12,padding:"8px 10px",width:140}}/></div>
                  <div><label style={{display:"block",fontSize:9,...hd,color:C.g50,fontFamily:ff,marginBottom:4}}>HANDOVER DATE</label><input type="date" value={em.handoverDate} onChange={e=>upEmail(em.id,"handoverDate",e.target.value)} style={{...bi,fontSize:12,padding:"8px 10px",width:140}}/></div>
                </div>
              </div>
              {/* Tabs */}
              <div style={{display:"flex",alignItems:"center",borderBottom:`1px solid ${C.g88}`,background:C.g94,overflowX:"auto"}}>
                {em.parts.map((p,i)=>{const isActive=i===tabIdx;const isFirst=i===0;const loc=p.locale?localeShort(p.locale):`Part ${i+1}`;const tabText=isFirst?`${titleDisplay} (${loc})`:`${numStr} ${p.locale||`Part ${i+1}`}`;return(<div key={p.id} style={{display:"flex",alignItems:"center"}}>
                  <button onClick={()=>upEmail(em.id,"activeTab",i)} style={{padding:"12px 16px",border:"none",borderBottom:isActive?`3px solid ${C.yellow}`:"3px solid transparent",background:isActive?C.card:"transparent",cursor:"pointer",fontFamily:ff,fontSize:11,fontWeight:isActive?600:400,color:isActive?C.black:C.g50,whiteSpace:"nowrap",transition:"all 0.15s"}}>{tabText}</button>
                  {em.parts.length>1&&<button onClick={e=>{e.stopPropagation();removeEmailPart(em.id,i);}} style={{padding:"2px 6px",border:"none",background:"transparent",cursor:"pointer",color:C.g70,fontSize:14,lineHeight:1,marginRight:2}}>×</button>}
                </div>);})}
                <button onClick={()=>setShowLocalePicker(em.id)} style={{padding:"10px 14px",border:"none",background:"transparent",cursor:"pointer",fontFamily:ff,fontSize:11,...hd,color:C.blue,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>ADD PART
                </button>
              </div>
              {/* Active Part */}
              <div style={{padding:"22px 22px 18px"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                  <BriefStatusSelect value={ap.briefStatus} onChange={v=>upEmailPart(em.id,tabIdx,"briefStatus",v)}/>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><label style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>LOCALE:</label><select value={ap.locale} onChange={e=>upEmailPart(em.id,tabIdx,"locale",e.target.value)} style={{...bi,width:"auto",fontSize:12,padding:"8px 12px",cursor:"pointer"}}><option value="">Select...</option>{LOCALES.map(l=><option key={l} value={l}>{l}</option>)}</select></div>
                </div>
                {/* Figma + Brief Links */}
                <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
                  {ap.figmaLink&&!ap._editingFigma?(<div style={{display:"flex",alignItems:"center",gap:6}}>
                    <a href={ap.figmaLink} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",border:"1px solid #A259FF44",...rad,background:"#A259FF18",color:"#A259FF",fontSize:10,...hd,fontFamily:ff,textDecoration:"none"}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="0"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" fill="#F24E1E"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" fill="#FF7262"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" fill="#1ABCFE"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" fill="#0ACF83"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" fill="#A259FF"/></svg>FIGMA LINK</a>
                    <button onClick={()=>upEmailPart(em.id,tabIdx,"_editingFigma",true)} style={{padding:"6px 8px",border:`1px solid ${C.g88}`,...rad,background:C.card,cursor:"pointer"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.g50} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                  </div>):(<div style={{display:"flex",alignItems:"center",gap:8,background:C.g94,...rad,padding:"8px 12px",flex:1,maxWidth:300}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="0"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" fill="#F24E1E"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" fill="#FF7262"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" fill="#1ABCFE"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" fill="#0ACF83"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" fill="#A259FF"/></svg>
                    <input value={ap.figmaLink||""} onChange={e=>upEmailPart(em.id,tabIdx,"figmaLink",e.target.value)} onBlur={()=>{if(ap.figmaLink)upEmailPart(em.id,tabIdx,"_editingFigma",false);}} placeholder="Paste Figma URL..." style={{flex:1,border:"none",background:"transparent",fontSize:12,fontFamily:ff,color:C.black,outline:"none",padding:0,...bd}}/>
                  </div>)}
                  <CopyBriefLink emailNum={em.num} locale={ap.locale}/>
                </div>
                {/* Form */}
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div className="hub-grid-2" style={g(2)}><Field label="SUBJECT LINE"><Input value={ap.subjectLine} onChange={v=>upEmailPart(em.id,tabIdx,"subjectLine",v)} placeholder="Subject line"/></Field><Field label="PRE-HEADER"><Input value={ap.preHeader} onChange={v=>upEmailPart(em.id,tabIdx,"preHeader",v)} placeholder="Preview text"/></Field></div>
                  <Field label="HERO IMAGE (LINK)"><Input value={ap.heroImage} onChange={v=>upEmailPart(em.id,tabIdx,"heroImage",v)} placeholder="https://..."/></Field>
                  <Field label="MAIN HEADING"><Input value={ap.heading} onChange={v=>upEmailPart(em.id,tabIdx,"heading",v)} placeholder="Main headline"/></Field>
                  <Field label="BODY COPY"><TextArea value={ap.bodyCopy} onChange={v=>upEmailPart(em.id,tabIdx,"bodyCopy",v)} placeholder="Body copy..." rows={3}/></Field>
                  <div className="hub-grid-2" style={g(2)}><Field label="PRIMARY CTA"><Input value={ap.cta} onChange={v=>upEmailPart(em.id,tabIdx,"cta",v)} placeholder="e.g. Shop Now"/></Field><Field label="SECONDARY CTA"><Input value={ap.secondaryCta} onChange={v=>upEmailPart(em.id,tabIdx,"secondaryCta",v)} placeholder="e.g. Learn More"/></Field></div>
                  <Field label="NOTES"><TextArea value={ap.notes} onChange={v=>upEmailPart(em.id,tabIdx,"notes",v)} placeholder="Additional notes..." rows={2}/></Field>
                </div>
              </div>
              {/* Footer */}
              <div style={{padding:"14px 22px",borderTop:`1px solid ${C.g88}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.g94}}>
                {emails.length>1?<button onClick={()=>rmE(em.id)} style={{padding:"8px 14px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>REMOVE EMAIL</button>:<div/>}
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>{em.parts.map((p,i)=>{const s=BRIEF_STATUSES.find(x=>x.key===p.briefStatus);return<div key={i} style={{width:8,height:8,borderRadius:4,background:s?.color||C.g70}} title={`${p.locale||`Part ${i+1}`}: ${s?.label}`}/>;})}</div>
                  <span style={{fontSize:10,...bd,color:C.g70,fontFamily:ff}}>{completeParts}/{em.parts.length} complete</span>
                </div>
              </div>
            </>}
          </div>
          {!em.collapsed&&<div style={{display:"flex",justifyContent:"flex-end",marginTop:6}}><button onClick={()=>dupEmail(em)} style={{padding:"8px 16px",border:`1px solid ${C.g88}`,...rad,background:C.card,cursor:"pointer",fontFamily:ff,fontSize:10,...hd,color:C.g50,display:"flex",alignItems:"center",gap:6}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.g50} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>DUPLICATE EMAIL
          </button></div>}
        </div>);})}
        {/* Locale Picker Modal */}
        {showLocalePicker&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowLocalePicker(null)}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.card,...rad,padding:"28px",maxWidth:360,width:"90%",boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
            <div style={{fontSize:14,...hd,color:C.black,fontFamily:ff,marginBottom:6}}>ADD TRANSLATED PART</div>
            <div style={{fontSize:12,...bd,color:C.g50,fontFamily:ff,marginBottom:18,lineHeight:1.5}}>Select a locale. All fields will be copied and translated.</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {LOCALES.filter(l=>!(emails.find(x=>x.id===showLocalePicker)?.parts||[]).map(p=>p.locale).includes(l)).map(l=>(
                <button key={l} onClick={()=>{addEmailPart(showLocalePicker,l);setShowLocalePicker(null);}} style={{padding:"12px 16px",border:`1px solid ${C.g88}`,...rad,background:C.card,cursor:"pointer",fontFamily:ff,fontSize:13,fontWeight:500,color:C.black,textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between"}} onMouseEnter={e=>e.currentTarget.style.background=C.g94} onMouseLeave={e=>e.currentTarget.style.background=C.card}>
                  <span>{l}</span>{LANG[l]?<span style={{fontSize:10,...hd,color:C.blue,fontFamily:ff}}>AUTO-TRANSLATE</span>:<span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>COPY ONLY</span>}
                </button>
              ))}
            </div>
            <button onClick={()=>setShowLocalePicker(null)} style={{width:"100%",marginTop:14,padding:"10px",border:`1px solid ${C.g88}`,...rad,background:C.g94,cursor:"pointer",fontFamily:ff,fontSize:11,...hd,color:C.g50}}>CANCEL</button>
          </div>
        </div>}
      </Sec>}

      {ch.includes("paid")&&<Sec title="PAID MEDIA ASSETS" num={String(++si).padStart(2,"0")} collapsed={sec.paid} onToggle={()=>tog("paid")} accent={C.blue}>
        <Field label="SECTION OWNER"><EmailSelect value={paidOwner} onChange={setPaidOwner} profiles={profiles} onAddUser={addUser}/></Field>
        <div style={{height:1,background:C.g88,margin:"20px 0"}}/>
        <div style={{fontSize:12,...hd,color:C.black,fontFamily:ff,marginBottom:16}}>SIZES REQUIRED</div>
        {Object.entries(PAID_SIZE_GROUPS).map(([group,sizes])=>(<div key={group} style={{marginBottom:16}}><div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:6}}>{group}</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{sizes.map(size=>{const active=(ps[group]||[]).includes(size);return <Chip key={size} label={size} active={active} onClick={()=>tps(group,size)}/>;})}</div></div>))}
        <div style={g(1)}><Field label="OTHER SIZES"><Input value={os} onChange={setOs} placeholder="e.g. 320x480, custom..."/></Field><Field label="HERO IMAGE (LINK)"><Input value={phi} onChange={setPhi} placeholder="https://..."/></Field><Field label="COPY REQUIREMENTS"><TextArea value={pc} onChange={setPc} placeholder="Headlines, CTAs..." rows={3}/></Field><Field label="VIDEO / GIF CONTENT"><TextArea value={pv} onChange={setPv} placeholder="Video or animated content..." rows={2}/></Field></div>
      </Sec>}

      {/* Notification Modal */}
      {showNotifyModal&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowNotifyModal(false)}>
        <div onClick={e=>e.stopPropagation()} style={{background:C.card,...rad,padding:"32px 28px",maxWidth:420,width:"90%",boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/></svg>
            <span style={{fontSize:14,...hd,color:C.black,fontFamily:ff}}>SEND NOTIFICATION OF CHANGES</span>
          </div>
          <p style={{fontSize:13,...bd,color:C.g50,fontFamily:ff,marginBottom:16,lineHeight:1.5}}>The brief has been updated. Who should be notified?</p>
          <div style={{marginBottom:12}}>
            <select value={notifyEmail} onChange={e=>setNotifyEmail(e.target.value)} style={{...bi,cursor:"pointer"}}>
              <option value="">Select recipient...</option>
              {userList.map(u=><option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div style={{marginBottom:12}}>
            <input value={notifyEmail} onChange={e=>setNotifyEmail(e.target.value)} placeholder="Or type email address..." style={bi}/>
          </div>
          {notifySent&&<div style={{marginBottom:12,padding:"8px 14px",background:C.green+"18",border:`1px solid ${C.green}33`,...rad,fontSize:12,...hd,color:C.green,fontFamily:ff,textAlign:"center"}}>NOTIFICATION SENT</div>}
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setShowNotifyModal(false);setNotifyEmail("");setNotifySent(false);}} style={{flex:1,padding:"11px 20px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:12,...hd,fontFamily:ff,cursor:"pointer"}}>SKIP</button>
            <button onClick={()=>{if(notifyEmail){setNotifySent(true);setTimeout(()=>{setShowNotifyModal(false);setNotifyEmail("");setNotifySent(false);},2000);}}} style={{flex:1,padding:"11px 20px",border:"none",...rad,background:C.black,color:C.card,fontSize:12,...hd,fontFamily:ff,cursor:"pointer"}}>SEND</button>
          </div>
        </div>
      </div>}

      <div className="brief-footer" style={{position:"fixed",bottom:0,left:250,right:0,background:"rgba(236,238,241,0.96)",backdropFilter:"blur(10px)",borderTop:`1px solid ${C.g88}`,padding:"12px 40px",display:"flex",alignItems:"center",justifyContent:"flex-end",gap:10,zIndex:100}}>
        {es&&<div style={{position:"absolute",top:-40,left:"50%",transform:"translateX(-50%)",background:C.black,color:C.card,padding:"6px 16px",...rad,fontSize:11,...hd,fontFamily:ff,animation:"fu .2s ease"}}>{es==="handed"?"BRIEF SUBMITTED":"CHANGES SAVED"}</div>}
        <button onClick={()=>{setEs("saved");setTimeout(()=>setEs(null),3000);setShowNotifyModal(true);}} style={{padding:"11px 24px",border:"none",...rad,background:C.black,color:C.card,fontSize:13,...hd,fontFamily:ff,cursor:"pointer"}}>SAVE CHANGES</button>
        <button onClick={()=>{setEs("handed");setTimeout(()=>setEs(null),3000);}} style={{padding:"11px 24px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:13,...hd,fontFamily:ff,cursor:"pointer"}}>SUBMIT BRIEF</button>
      </div>
    </div>
  );
}
