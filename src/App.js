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
const defaultEmail=()=>({id:Date.now()+Math.random(),parentId:null,locale:"",name:"",purpose:"",subjectLine:"",preHeader:"",heroImage:"",heading:"",bodyCopy:"",cta:"",secondaryCta:"",notes:"",briefStatus:"brief_added"});
const defaultWebAsset=()=>({id:Date.now()+Math.random(),parentId:null,locale:"",name:"",heroImage:"",heading:"",subcopy:"",cta:"",secondaryCta:"",notes:"",briefStatus:"brief_added"});

export default function App(){
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
  const [et,setEt]=useState([]); const [emails,setEmails]=useState([defaultEmail()]); const [emailOwner,setEmailOwner]=useState("");
  const addE=()=>setEmails(e=>[...e,defaultEmail()]); const rmE=id=>setEmails(e=>e.filter(em=>em.id!==id)); const upE=(id,f,v)=>setEmails(e=>e.map(em=>em.id===id?{...em,[f]:v}:em));
  const dupE=async(em,loc)=>{const cid=Date.now()+Math.random();const clone={...em,id:cid,parentId:em.parentId||em.id,locale:loc||""};const idx=emails.findIndex(e=>e.id===em.id);const updated=[...emails];updated.splice(idx+1,0,clone);setEmails(updated);if(LANG[loc]){const t=await tx({name:em.name,subjectLine:em.subjectLine,preHeader:em.preHeader,heading:em.heading,bodyCopy:em.bodyCopy,cta:em.cta,secondaryCta:em.secondaryCta,notes:em.notes},loc);setEmails(a=>a.map(e=>e.id===cid?{...e,...t}:e));}};
  const emailNum=(em,idx)=>{if(!em.parentId){let n=0;for(let i=0;i<=idx;i++){if(!emails[i].parentId)n++;}return String(n).padStart(2,"0");}const pIdx=emails.findIndex(e=>e.id===em.parentId);let pNum=0;for(let i=0;i<=pIdx;i++){if(!emails[i].parentId)pNum++;}let sub=1;for(let i=pIdx+1;i<=idx;i++){if(emails[i].parentId===em.parentId)sub++;}return String(pNum).padStart(2,"0")+"."+sub;};
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
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}><span style={{fontSize:13,...hd,color:C.black,fontFamily:ff}}>INDIVIDUAL EMAIL BRIEFS</span><button onClick={addE} style={{padding:"8px 18px",border:"none",...rad,background:C.black,color:C.card,fontSize:11,...hd,fontFamily:ff,cursor:"pointer"}}>+ ADD EMAIL</button></div>
        {emails.map((em,idx)=>(<Card key={em.id} style={{marginBottom:8,borderLeft:em.parentId?`3px solid ${C.yellow}`:`1px solid ${C.g88}`,padding:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:12,...hd,color:C.black,fontFamily:ff}}>EMAIL {emailNum(em,idx)}{em.locale?` — ${em.locale}`:""}</span><BriefStatusSelect value={em.briefStatus||"brief_added"} onChange={v=>upE(em.id,"briefStatus",v)}/></div>{emails.length>1&&<button onClick={()=>rmE(em.id)} style={{padding:"4px 12px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>REMOVE</button>}</div>
          <div style={{marginBottom:12}}><Field label="EMAIL TYPE"><CG options={EMAIL_TYPES} selected={et} onChange={setEt}/></Field></div>
          <div style={{marginBottom:12}}><Field label="LOCALE / LANGUAGE"><CG options={LOCALES} selected={em.locale?[em.locale]:[]} onChange={v=>upE(em.id,"locale",v.length?v[v.length-1]:"")}/></Field></div>
          <div className="hub-grid-2" style={g(2)}><Field label="EMAIL NAME"><Input value={em.name} onChange={v=>upE(em.id,"name",v)} placeholder="e.g. Launch Email"/></Field><Field label="HERO IMAGE (LINK)"><Input value={em.heroImage} onChange={v=>upE(em.id,"heroImage",v)} placeholder="https://..."/></Field></div>
          <div style={{marginTop:12}}><Field label="MAIN HEADING"><Input value={em.heading} onChange={v=>upE(em.id,"heading",v)} placeholder="Main headline"/></Field></div>
          <div className="hub-grid-2" style={{...g(2),marginTop:12}}><Field label="SUBJECT LINE"><Input value={em.subjectLine} onChange={v=>upE(em.id,"subjectLine",v)} placeholder="Subject line"/></Field><Field label="PRE-HEADER"><Input value={em.preHeader} onChange={v=>upE(em.id,"preHeader",v)} placeholder="Pre-header text"/></Field></div>
          <div style={{marginTop:12}}><Field label="BODY COPY"><TextArea value={em.bodyCopy} onChange={v=>upE(em.id,"bodyCopy",v)} placeholder="Body copy..." rows={3}/></Field></div>
          <div className="hub-grid-2" style={{...g(2),marginTop:12}}><Field label="CTA"><Input value={em.cta} onChange={v=>upE(em.id,"cta",v)} placeholder="e.g. Shop Now"/></Field><Field label="SECONDARY CTA"><Input value={em.secondaryCta} onChange={v=>upE(em.id,"secondaryCta",v)} placeholder="e.g. Learn More"/></Field></div>
          <div style={{marginTop:12}}><Field label="ADDITIONAL NOTES"><TextArea value={em.notes} onChange={v=>upE(em.id,"notes",v)} placeholder="Any additional notes..." rows={2}/></Field></div>
          <div style={{marginTop:16,display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:11,...hd,color:C.g50,fontFamily:ff}}>DUPLICATE FOR:</span><select onChange={e=>{if(e.target.value){dupE(em,e.target.value);e.target.value="";}}} style={{...bi,width:"auto",fontSize:11,cursor:"pointer"}}><option value="">Select locale...</option>{LOCALES.map(l=><option key={l} value={l}>{l}{LANG[l]?" (auto-translate)":""}</option>)}</select></div>
        </Card>))}
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
