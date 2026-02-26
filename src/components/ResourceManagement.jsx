import { useState } from "react";
import { C, ff, hd, bd, bi, rad, g, Field, Card, sendNotification, Avatar, DEPARTMENTS, DEPT_COLORS, DEFAULT_AVATAR_COLOR, EmailSelect } from "./shared";

const ROLES = ["BRIEF OWNER","C&C OWNER","CRM MANAGER","ECOMM MANAGER","PAID MEDIA MANAGER","LEAD DESIGNER","ARTWORKER","OTHER"];

function ProfileCard({ user, onUpdate, expanded, onToggle }) {
  const [jobTitle, setJobTitle] = useState(user.jobTitle || "");
  const [dept, setDept] = useState(user.department || "");
  const [saved, setSaved] = useState(false);
  const doSave = () => { onUpdate(user.email, { jobTitle, department: dept }); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ background:C.card, border:`1px solid ${C.g88}`, ...rad, overflow:"hidden", transition:"all 0.2s" }}>
      <button onClick={onToggle} style={{ width:"100%", padding:"16px 20px", border:"none", background:"transparent", cursor:"pointer", fontFamily:ff, textAlign:"left", display:"flex", alignItems:"center", gap:14 }}>
        <Avatar firstName={user.firstName} department={user.department} size={40} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:600, color:C.black, fontFamily:ff }}>{user.firstName} {user.lastName}</div>
          <div style={{ fontSize:12, ...bd, color:C.g50, fontFamily:ff, marginTop:1 }}>{user.email}</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {user.department && <span style={{ padding:"4px 12px", ...rad, background:(DEPT_COLORS[user.department]||C.g70)+"18", color:DEPT_COLORS[user.department]||C.g50, fontSize:10, ...hd, fontFamily:ff }}>{user.department.toUpperCase()}</span>}
          {!user.department && !user.jobTitle && <span style={{ padding:"4px 12px", ...rad, background:C.g94, color:C.g70, fontSize:10, ...hd, fontFamily:ff }}>INCOMPLETE</span>}
          <span style={{ fontSize:16, color:C.g70, transform:expanded?"rotate(180deg)":"rotate(0)", transition:"transform 0.2s", display:"inline-block" }}>&#9660;</span>
        </div>
      </button>
      {expanded && <div style={{ padding:"0 20px 20px", borderTop:`1px solid ${C.g88}` }}>
        <div style={{ paddingTop:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            <div><label style={{ display:"block", fontSize:11, ...hd, color:C.g50, fontFamily:ff, marginBottom:7 }}>FIRST NAME</label><div style={{ ...bi, background:C.g94, color:C.g50 }}>{user.firstName}</div></div>
            <div><label style={{ display:"block", fontSize:11, ...hd, color:C.g50, fontFamily:ff, marginBottom:7 }}>LAST NAME</label><div style={{ ...bi, background:C.g94, color:C.g50 }}>{user.lastName}</div></div>
          </div>
          <div style={{ marginBottom:12 }}><label style={{ display:"block", fontSize:11, ...hd, color:C.g50, fontFamily:ff, marginBottom:7 }}>EMAIL ADDRESS</label><div style={{ ...bi, background:C.g94, color:C.g50 }}>{user.email}</div></div>
          <div style={{ height:1, background:C.g88, margin:"16px 0" }} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            <div><label style={{ display:"block", fontSize:11, ...hd, color:C.g50, fontFamily:ff, marginBottom:7 }}>JOB TITLE</label><input value={jobTitle} onChange={e=>setJobTitle(e.target.value)} placeholder="e.g. Senior Designer" style={bi}/></div>
            <div><label style={{ display:"block", fontSize:11, ...hd, color:C.g50, fontFamily:ff, marginBottom:7 }}>DEPARTMENT</label><select value={dept} onChange={e=>setDept(e.target.value)} style={{ ...bi, cursor:"pointer" }}><option value="">Select department...</option>{DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <span style={{ fontSize:11, ...hd, color:C.g50, fontFamily:ff }}>PREVIEW:</span>
            <Avatar firstName={user.firstName} department={dept} size={32} />
            <span style={{ fontSize:13, fontWeight:500, color:C.black, fontFamily:ff }}>{user.firstName} {user.lastName}</span>
            {dept && <span style={{ padding:"3px 10px", ...rad, background:(DEPT_COLORS[dept]||C.g70)+"18", color:DEPT_COLORS[dept]||C.g50, fontSize:9, ...hd, fontFamily:ff }}>{dept.toUpperCase()}</span>}
          </div>
          <div style={{ position:"relative" }}>
            {saved && <div style={{ position:"absolute", top:-36, left:"50%", transform:"translateX(-50%)", background:C.black, color:C.card, padding:"5px 14px", ...rad, fontSize:10, ...hd, fontFamily:ff, whiteSpace:"nowrap" }}>PROFILE SAVED</div>}
            <button onClick={doSave} style={{ width:"100%", padding:"12px 24px", border:"none", ...rad, background:C.black, color:C.card, fontSize:12, ...hd, fontFamily:ff, cursor:"pointer" }}>SAVE PROFILE</button>
          </div>
        </div>
      </div>}
    </div>
  );
}

export default function ResourceManagement({ profiles, addUser, updateProfile, jobNum, brand, title, setView, initialView }) {
  const [roles,setRoles]=useState({});
  const upR=(k,v)=>setRoles(r=>({...r,[k]:v}));
  const [editing,setEditing]=useState(true);
  const [saved,setSaved]=useState(false);
  const [emailsSent,setEmailsSent]=useState(false);
  const [subView,setSubView]=useState(initialView||"main");
  const [expandedProfile,setExpandedProfile]=useState(null);

  const doSave=async()=>{
    setEditing(false);setSaved(true);setTimeout(()=>setSaved(false),3000);
    const assigned=Object.entries(roles).filter(([k,v])=>v);
    let sent=0;
    for(const [role,email] of assigned){
      const ok=await sendNotification({to_email:email,role,job_number:jobNum,project_name:title,brand});
      if(ok)sent++;
    }
    if(sent>0){setEmailsSent(true);setTimeout(()=>setEmailsSent(false),4000);}
  };
  const assigned=Object.values(roles).filter(Boolean).length;

  const complete = profiles.filter(u => u.department && u.jobTitle).length;
  const incomplete = profiles.length - complete;

  // PROFILES VIEW
  if(subView==="profiles") return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <button onClick={()=>{setSubView("main");if(setView)setView("resources");}} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 16px", border:`1px solid ${C.g88}`, ...rad, background:C.card, cursor:"pointer", fontFamily:ff, fontSize:12, fontWeight:500, color:C.g50, alignSelf:"flex-start" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.g50} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        BACK TO RESOURCE MANAGEMENT
      </button>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12 }}>
        <Card style={{padding:"16px 18px",textAlign:"center"}}><div style={{fontSize:26,fontWeight:700,color:C.black,fontFamily:ff}}>{profiles.length}</div><div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,marginTop:4}}>TOTAL USERS</div></Card>
        <Card style={{padding:"16px 18px",textAlign:"center"}}><div style={{fontSize:26,fontWeight:700,color:C.green,fontFamily:ff}}>{complete}</div><div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,marginTop:4}}>COMPLETE</div></Card>
        <Card style={{padding:"16px 18px",textAlign:"center"}}><div style={{fontSize:26,fontWeight:700,color:incomplete>0?"#f59e0b":C.g70,fontFamily:ff}}>{incomplete}</div><div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,marginTop:4}}>INCOMPLETE</div></Card>
        <Card style={{padding:"16px 18px",textAlign:"center"}}><div style={{display:"flex",justifyContent:"center",gap:4,marginBottom:4}}>{DEPARTMENTS.map(d=><div key={d} style={{width:8,height:8,borderRadius:4,background:DEPT_COLORS[d]}}/>)}</div><div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,marginTop:8}}>DEPARTMENTS</div></Card>
      </div>
      <Card style={{padding:"14px 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>DEPARTMENTS:</span>
          {DEPARTMENTS.map(d=><div key={d} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:5,background:DEPT_COLORS[d]}}/><span style={{fontSize:11,...hd,color:C.g50,fontFamily:ff}}>{d.toUpperCase()}</span></div>)}
          <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:5,background:DEFAULT_AVATAR_COLOR}}/><span style={{fontSize:11,...hd,color:C.g50,fontFamily:ff}}>UNASSIGNED</span></div>
        </div>
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {profiles.map(u=><ProfileCard key={u.email} user={u} onUpdate={updateProfile} expanded={expandedProfile===u.email} onToggle={()=>setExpandedProfile(expandedProfile===u.email?null:u.email)}/>)}
      </div>
    </div>
  );

  // MAIN RESOURCE VIEW
  return (<div style={{display:"flex",flexDirection:"column",gap:14}}>
    {/* Profiles Link Card */}
    <div style={{background:C.card,border:`1px solid ${C.g88}`,...rad,padding:"18px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",transition:"all 0.15s"}} onClick={()=>setSubView("profiles")}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:42,height:42,borderRadius:21,background:C.red+"18",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div>
          <div style={{fontSize:14,...hd,color:C.black,fontFamily:ff}}>TEAM PROFILES</div>
          <div style={{fontSize:12,...bd,color:C.g50,fontFamily:ff,marginTop:2}}>{profiles.length} user{profiles.length!==1?"s":""} · {incomplete>0?`${incomplete} incomplete`:"All complete"}</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{display:"flex"}}>{profiles.slice(0,4).map((u,i)=>(<div key={u.email} style={{marginLeft:i>0?-8:0,zIndex:4-i,border:`2px solid ${C.card}`,borderRadius:20}}><Avatar firstName={u.firstName} department={u.department} size={30}/></div>))}{profiles.length>4&&<div style={{marginLeft:-8,width:30,height:30,borderRadius:15,background:C.g88,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${C.card}`}}><span style={{fontSize:10,fontWeight:700,color:C.g50,fontFamily:ff}}>+{profiles.length-4}</span></div>}</div>
        <span style={{fontSize:18,color:C.g70}}>›</span>
      </div>
    </div>

    <Card>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <span style={{fontSize:11,...hd,color:C.g50,fontFamily:ff}}>TEAM ALLOCATION</span>
        <div style={{padding:"5px 14px",...rad,background:assigned>=ROLES.length?C.green+"18":C.g94,fontSize:11,fontWeight:600,color:assigned>=ROLES.length?C.green:C.g50,fontFamily:ff}}>{assigned} ASSIGNED</div>
      </div>
      <div className="hub-grid-2" style={g(2)}>
        {ROLES.map(role=>(<div key={role} style={{marginBottom:4}}>
          <Field label={role}><EmailSelect value={roles[role]||""} onChange={v=>upR(role,v)} profiles={profiles} onAddUser={addUser}/></Field>
          {roles[role]&&!editing&&<div style={{marginTop:4,fontSize:12,...bd,color:C.g50,fontFamily:ff,display:"flex",alignItems:"center",gap:4}}><span style={{color:C.green,fontSize:13}}>&#10003;</span>{(() => { const u = profiles.find(p=>p.email===roles[role]); return u && u.firstName ? `${u.firstName} ${u.lastName}` : roles[role]; })()}</div>}
          {roles[role]&&editing&&<div style={{marginTop:4,display:"flex",alignItems:"center",gap:6}}><Avatar firstName={profiles.find(p=>p.email===roles[role])?.firstName} department={profiles.find(p=>p.email===roles[role])?.department} size={20}/><span style={{fontSize:12,...bd,color:C.g50,fontFamily:ff}}>{(() => { const u = profiles.find(p=>p.email===roles[role]); return u && u.firstName ? `${u.firstName} ${u.lastName}` : roles[role]; })()}</span></div>}
        </div>))}
      </div>
    </Card>

    <div style={{display:"flex",gap:10,position:"relative"}}>
      {saved&&<div style={{position:"absolute",top:-40,left:"50%",transform:"translateX(-50%)",background:C.black,color:C.card,padding:"6px 16px",...rad,fontSize:11,...hd,fontFamily:ff,whiteSpace:"nowrap"}}>CHANGES SAVED</div>}
      {emailsSent&&<div style={{position:"absolute",top:-40,right:0,background:C.green,color:C.card,padding:"6px 16px",...rad,fontSize:11,...hd,fontFamily:ff,whiteSpace:"nowrap"}}>NOTIFICATIONS SENT</div>}
      {editing?(<button onClick={doSave} style={{flex:1,padding:"13px 24px",border:"none",...rad,background:C.black,color:C.card,fontSize:13,...hd,fontFamily:ff,cursor:"pointer"}}>SAVE CHANGES</button>
      ):(<button onClick={()=>setEditing(true)} style={{flex:1,padding:"13px 24px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:13,...hd,fontFamily:ff,cursor:"pointer"}}>EDIT DETAILS</button>)}
    </div>
  </div>);
}
