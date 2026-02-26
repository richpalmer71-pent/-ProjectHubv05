import { useState } from "react";
import { C, ff, hd, bd, bi, rad, Card, BriefStatusSelect, BRIEF_STATUSES } from "./shared";

const PROJECT_STATUSES = [
  {key:"draft",label:"DRAFT",color:C.g70},
  {key:"briefing",label:"BRIEFING",color:C.blue},
  {key:"in_progress",label:"IN PROGRESS",color:"#f59e0b"},
  {key:"review",label:"REVIEW",color:"#8b5cf6"},
  {key:"approved",label:"APPROVED",color:C.green},
  {key:"delivered",label:"DELIVERED",color:C.black},
  {key:"overdue",label:"OVERDUE",color:"#ef4444"},
];

const CHANNELS = ["Web","Email","Paid"];
const CHANNEL_COLORS = { Web:C.red, Email:"#f59e0b", Paid:C.blue };
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const TODAY = new Date().toISOString().slice(0,10);

const MOCK_PROJECTS = [
  { id:"PEN-2025-0042",brand:"Speedo",title:"Summer 25 Launch",status:"in_progress",start:"2025-03-01",end:"2026-06-15",modules:{overview:true,toolkit:true,brief:true,resources:true,approval:false,delivery:false,feedback:false},
    briefs:[{id:"W01",channel:"Web",name:"Homepage Hero Banner",locale:"UK (ENG)",status:"with_design"},{id:"W02",channel:"Web",name:"PLP Category Banner",locale:"UK (ENG)",status:"with_copy"},{id:"W03",channel:"Web",name:"Homepage Hero Banner",locale:"DE (GER)",status:"brief_added"},{id:"E01",channel:"Email",name:"Launch Email",locale:"UK (ENG)",status:"awaiting_approval"},{id:"E02",channel:"Email",name:"Promo Follow-Up",locale:"UK (ENG)",status:"with_copy"},{id:"E03",channel:"Email",name:"Launch Email",locale:"FR (FR)",status:"brief_added"},{id:"P01",channel:"Paid",name:"PMAX 1200x628",locale:"UK (ENG)",status:"with_design"},{id:"P02",channel:"Paid",name:"Social 1080x1080",locale:"UK (ENG)",status:"brief_added"}]},
  { id:"PEN-2025-0038",brand:"Berghaus",title:"AW25 Digital Campaign",status:"review",start:"2025-02-15",end:"2026-04-30",modules:{overview:true,toolkit:true,brief:true,resources:true,approval:true,delivery:false,feedback:false},
    briefs:[{id:"W01",channel:"Web",name:"Hero Banner — AW25",locale:"UK (ENG)",status:"awaiting_approval"},{id:"W02",channel:"Web",name:"PDP Feature Block",locale:"UK (ENG)",status:"handover"},{id:"E01",channel:"Email",name:"AW25 Teaser Email",locale:"UK (ENG)",status:"complete"},{id:"E02",channel:"Email",name:"AW25 Launch Email",locale:"UK (ENG)",status:"awaiting_approval"},{id:"P01",channel:"Paid",name:"Display 728x90",locale:"UK (ENG)",status:"with_design"}]},
  { id:"PEN-2025-0035",brand:"Canterbury",title:"Six Nations Promo",status:"delivered",start:"2025-01-10",end:"2025-03-20",modules:{overview:true,toolkit:true,brief:true,resources:true,approval:true,delivery:true,feedback:true},
    briefs:[{id:"W01",channel:"Web",name:"Six Nations Hero",locale:"UK (ENG)",status:"complete"},{id:"W02",channel:"Web",name:"Kit Builder CTA",locale:"UK (ENG)",status:"complete"},{id:"E01",channel:"Email",name:"Match Day Email",locale:"UK (ENG)",status:"complete"},{id:"P01",channel:"Paid",name:"Social 1080x1920",locale:"UK (ENG)",status:"complete"}]},
  { id:"PEN-2025-0031",brand:"Speedo",title:"Fastskin Launch",status:"in_progress",start:"2025-01-05",end:"2025-12-01",modules:{overview:true,toolkit:true,brief:true,resources:true,approval:true,delivery:false,feedback:false},
    briefs:[{id:"W01",channel:"Web",name:"Fastskin PDP Hero",locale:"UK (ENG)",status:"handover"},{id:"W02",channel:"Web",name:"Technology Explainer",locale:"UK (ENG)",status:"with_design"},{id:"E01",channel:"Email",name:"Pre-Launch Teaser",locale:"UK (ENG)",status:"complete"},{id:"E02",channel:"Email",name:"Launch Day Email",locale:"UK (ENG)",status:"awaiting_approval"},{id:"E03",channel:"Email",name:"Launch Day Email",locale:"DE (GER)",status:"with_copy"},{id:"P01",channel:"Paid",name:"PMAX 1200x300",locale:"UK (ENG)",status:"with_design"},{id:"P02",channel:"Paid",name:"Display 300x250",locale:"UK (ENG)",status:"brief_added"}]},
  { id:"PEN-2025-0029",brand:"Ellesse",title:"SS25 Social Push",status:"briefing",start:"2025-03-10",end:"2026-07-01",modules:{overview:true,toolkit:false,brief:false,resources:false,approval:false,delivery:false,feedback:false},
    briefs:[{id:"W01",channel:"Web",name:"Homepage Takeover",locale:"UK (ENG)",status:"brief_added"},{id:"P01",channel:"Paid",name:"Social 1080x1080",locale:"UK (ENG)",status:"brief_added"},{id:"P02",channel:"Paid",name:"Social 1080x1920",locale:"UK (ENG)",status:"brief_added"}]},
  { id:"PEN-2024-0112",brand:"Berghaus",title:"Winter 24 Wrap-Up",status:"delivered",start:"2024-09-01",end:"2024-12-15",modules:{overview:true,toolkit:true,brief:true,resources:true,approval:true,delivery:true,feedback:true},
    briefs:[{id:"W01",channel:"Web",name:"Winter Sale Hero",locale:"UK (ENG)",status:"complete"},{id:"E01",channel:"Email",name:"Winter Sale Launch",locale:"UK (ENG)",status:"complete"},{id:"E02",channel:"Email",name:"Last Chance Email",locale:"UK (ENG)",status:"complete"},{id:"P01",channel:"Paid",name:"Display 970x250",locale:"UK (ENG)",status:"complete"}]},
  { id:"PEN-2025-0044",brand:"Mitre",title:"Grassroots Kit Launch",status:"draft",start:"2025-04-01",end:"2026-08-01",modules:{overview:false,toolkit:false,brief:false,resources:false,approval:false,delivery:false,feedback:false},briefs:[]},
  { id:"PEN-2025-0048",brand:"Ellesse",title:"Heritage Collection",status:"review",start:"2025-06-01",end:"2026-01-15",modules:{overview:true,toolkit:true,brief:true,resources:true,approval:false,delivery:false,feedback:false},
    briefs:[{id:"W01",channel:"Web",name:"Heritage Landing Page",locale:"UK (ENG)",status:"with_design"},{id:"W02",channel:"Web",name:"Heritage Landing Page",locale:"FR (FR)",status:"with_copy"},{id:"E01",channel:"Email",name:"Heritage Launch Email",locale:"UK (ENG)",status:"with_design"},{id:"P01",channel:"Paid",name:"PMAX 1200x1200",locale:"UK (ENG)",status:"with_copy"},{id:"P02",channel:"Paid",name:"Social 1080x1350",locale:"UK (ENG)",status:"brief_added"}]},
  { id:"PEN-2025-0050",brand:"Canterbury",title:"Lions Tour Kit",status:"in_progress",start:"2025-05-01",end:"2026-03-15",modules:{overview:true,toolkit:true,brief:false,resources:true,approval:false,delivery:false,feedback:false},
    briefs:[{id:"W01",channel:"Web",name:"Lions Hero Banner",locale:"UK (ENG)",status:"with_copy"},{id:"W02",channel:"Web",name:"Kit Customiser CTA",locale:"UK (ENG)",status:"brief_added"},{id:"E01",channel:"Email",name:"Lions Announcement",locale:"UK (ENG)",status:"with_copy"},{id:"P01",channel:"Paid",name:"Social 1080x1080",locale:"UK (ENG)",status:"brief_added"}]},
];

const getEffectiveStatus = (p) => {
  if(p.status==="delivered") return "delivered";
  if(p.end < TODAY && p.status !== "delivered") return "overdue";
  return p.status;
};

const BRANDS = [...new Set(MOCK_PROJECTS.map(p=>p.brand))].sort();

function StatusBadge({status}) {
  const s=PROJECT_STATUSES.find(x=>x.key===status)||PROJECT_STATUSES[0];
  return <span style={{padding:"4px 12px",...rad,background:s.color+"18",color:s.color,fontSize:10,...hd,fontFamily:ff,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:4}}>
    {status==="overdue"&&<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
    {s.label}
  </span>;
}

function ProgressBar({modules}) {
  const total=Object.keys(modules).length;const done=Object.values(modules).filter(Boolean).length;const pct=Math.round((done/total)*100);
  return(<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:6,background:C.g88,...rad,overflow:"hidden"}}><div style={{height:"100%",width:pct+"%",background:pct===100?C.green:pct>50?C.blue:C.g70,...rad,transition:"width 0.3s"}}/></div><span style={{fontSize:11,fontWeight:600,color:pct===100?C.green:C.g50,fontFamily:ff,minWidth:32}}>{pct}%</span></div>);
}

function DaysLabel({end, status}) {
  if(status==="delivered") return <span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>COMPLETE</span>;
  const diff=Math.ceil((new Date(end)-new Date(TODAY))/86400000);
  if(diff<0) return <span style={{fontSize:10,...hd,color:"#ef4444",fontFamily:ff}}>{Math.abs(diff)}d OVERDUE</span>;
  if(diff<=14) return <span style={{fontSize:10,...hd,color:"#f59e0b",fontFamily:ff}}>{diff}d LEFT</span>;
  return <span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>{diff}d LEFT</span>;
}

// PROJECT DETAIL VIEW
function ProjectDetail({ project, briefs, onBack, onUpdateStatus }) {
  const [chFilter,setChFilter]=useState("all");
  const [bsFilter,setBsFilter]=useState("all");
  const es=getEffectiveStatus(project);

  const filtered=briefs.filter(b=>{
    if(chFilter!=="all"&&b.channel!==chFilter)return false;
    if(bsFilter!=="all"&&b.status!==bsFilter)return false;
    return true;
  });
  const grouped=CHANNELS.map(ch=>({channel:ch,briefs:filtered.filter(b=>b.channel===ch)})).filter(g=>g.briefs.length>0);
  const totalBriefs=briefs.length;const completeBriefs=briefs.filter(b=>b.status==="complete").length;
  const pct=totalBriefs>0?Math.round((completeBriefs/totalBriefs)*100):0;

  return (<div style={{display:"flex",flexDirection:"column",gap:14}}>
    <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",border:`1px solid ${C.g88}`,...rad,background:C.card,cursor:"pointer",fontFamily:ff,fontSize:12,fontWeight:500,color:C.g50,alignSelf:"flex-start"}}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.g50} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      BACK TO DASHBOARD
    </button>
    <Card style={{padding:"24px 28px"}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16}}>
        <div>
          <div style={{fontSize:11,...hd,color:C.g70,fontFamily:ff,marginBottom:4}}>{project.brand}</div>
          <div style={{fontSize:22,...hd,color:C.black,fontFamily:ff,letterSpacing:"0.02em"}}>{project.title}</div>
          <div style={{fontSize:13,...bd,color:C.g50,fontFamily:ff,marginTop:4}}>{project.id} · {project.start} → {project.end}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}><StatusBadge status={es}/><DaysLabel end={project.end} status={es}/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        <div style={{padding:"12px 16px",background:C.g94,...rad,textAlign:"center"}}><div style={{fontSize:22,fontWeight:700,color:C.black,fontFamily:ff}}>{totalBriefs}</div><div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,marginTop:2}}>TOTAL BRIEFS</div></div>
        <div style={{padding:"12px 16px",background:C.g94,...rad,textAlign:"center"}}><div style={{fontSize:22,fontWeight:700,color:C.green,fontFamily:ff}}>{completeBriefs}</div><div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,marginTop:2}}>COMPLETE</div></div>
        <div style={{padding:"12px 16px",background:C.g94,...rad,textAlign:"center"}}><div style={{fontSize:22,fontWeight:700,color:totalBriefs-completeBriefs>0?"#f59e0b":C.g70,fontFamily:ff}}>{totalBriefs-completeBriefs}</div><div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,marginTop:2}}>IN PROGRESS</div></div>
        <div style={{padding:"12px 16px",background:C.g94,...rad,textAlign:"center"}}><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><div style={{flex:1,maxWidth:80,height:6,background:C.g88,...rad,overflow:"hidden"}}><div style={{height:"100%",width:pct+"%",background:pct===100?C.green:C.blue,...rad}}/></div><span style={{fontSize:14,fontWeight:700,color:pct===100?C.green:C.black,fontFamily:ff}}>{pct}%</span></div><div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,marginTop:4}}>BRIEF PROGRESS</div></div>
      </div>
    </Card>
    <Card style={{padding:"12px 20px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>FILTER:</span>
        <div style={{display:"flex",gap:4}}>
          <button onClick={()=>setChFilter("all")} style={{padding:"6px 14px",border:`1px solid ${chFilter==="all"?C.black:C.g88}`,...rad,background:chFilter==="all"?C.black:C.card,color:chFilter==="all"?C.card:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>ALL</button>
          {CHANNELS.map(ch=><button key={ch} onClick={()=>setChFilter(f=>f===ch?"all":ch)} style={{padding:"6px 14px",border:`1px solid ${chFilter===ch?CHANNEL_COLORS[ch]:C.g88}`,...rad,background:chFilter===ch?CHANNEL_COLORS[ch]+"18":C.card,color:chFilter===ch?CHANNEL_COLORS[ch]:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>{ch.toUpperCase()}</button>)}
        </div>
        <div style={{height:20,width:1,background:C.g88}}/>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          <button onClick={()=>setBsFilter("all")} style={{padding:"6px 14px",border:`1px solid ${bsFilter==="all"?C.black:C.g88}`,...rad,background:bsFilter==="all"?C.black:C.card,color:bsFilter==="all"?C.card:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>ALL</button>
          {BRIEF_STATUSES.map(s=><button key={s.key} onClick={()=>setBsFilter(f=>f===s.key?"all":s.key)} style={{padding:"6px 14px",border:`1px solid ${bsFilter===s.key?s.color:C.g88}`,...rad,background:bsFilter===s.key?s.color+"18":C.card,color:bsFilter===s.key?s.color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>{s.label}</button>)}
        </div>
      </div>
    </Card>
    {grouped.length===0&&<Card style={{padding:"40px 20px",textAlign:"center"}}><div style={{fontSize:13,color:C.g50,fontFamily:ff,...bd}}>No briefs match your filters.</div></Card>}
    {grouped.map(grp=>(<div key={grp.channel}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,padding:"0 4px"}}><div style={{width:4,height:16,...rad,background:CHANNEL_COLORS[grp.channel]}}/><span style={{fontSize:12,...hd,color:C.black,fontFamily:ff}}>{grp.channel.toUpperCase()} ASSETS</span><span style={{fontSize:11,...bd,color:C.g50,fontFamily:ff}}>{grp.briefs.length} brief{grp.briefs.length!==1?"s":""}</span></div>
      <div style={{background:C.card,border:`1px solid ${C.g88}`,...rad,overflow:"hidden",marginBottom:8}}>
        <div style={{display:"grid",gridTemplateColumns:"50px 1fr 120px 180px",padding:"10px 20px",background:C.g94,borderBottom:`1px solid ${C.g88}`,gap:10}}>
          <span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>ID</span><span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>BRIEF NAME</span><span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>LOCALE</span><span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>STATUS</span>
        </div>
        {grp.briefs.map((b,idx)=>(<div key={b.id+b.channel} style={{display:"grid",gridTemplateColumns:"50px 1fr 120px 180px",padding:"14px 20px",borderBottom:idx<grp.briefs.length-1?`1px solid ${C.g94}`:"none",alignItems:"center",gap:10,borderLeft:`3px solid ${CHANNEL_COLORS[grp.channel]}`}}>
          <div style={{fontSize:12,fontWeight:600,color:C.g50,fontFamily:ff}}>{b.id}</div>
          <div style={{fontSize:13,fontWeight:500,color:C.black,fontFamily:ff}}>{b.name}</div>
          <div style={{fontSize:12,...bd,color:C.g50,fontFamily:ff}}>{b.locale}</div>
          <BriefStatusSelect value={b.status} onChange={v=>onUpdateStatus(project.id,b.id,b.channel,v)}/>
        </div>))}
      </div>
    </div>))}
  </div>);
}

// MAIN DASHBOARD
export default function Dashboard({ setView, setJobNum }) {
  const [projects,setProjects]=useState(MOCK_PROJECTS);
  const [selectedProject,setSelectedProject]=useState(null);
  const [filter,setFilter]=useState("all");
  const [brandFilter,setBrandFilter]=useState("all");
  const [channelFilter,setChannelFilter]=useState("all");
  const [monthFilter,setMonthFilter]=useState("all");
  const [dateSort,setDateSort]=useState("end_asc");
  const [search,setSearch]=useState("");

  const updateBriefStatus=(projectId,briefId,channel,newStatus)=>{
    setProjects(prev=>prev.map(p=>{if(p.id!==projectId)return p;return{...p,briefs:p.briefs.map(b=>b.id===briefId&&b.channel===channel?{...b,status:newStatus}:b)};}));
  };

  const withStatus=projects.map(p=>({...p,effectiveStatus:getEffectiveStatus(p)}));

  const filtered=withStatus.filter(p=>{
    if(filter!=="all"&&p.effectiveStatus!==filter)return false;
    if(brandFilter!=="all"&&p.brand!==brandFilter)return false;
    if(channelFilter!=="all"&&!p.briefs.some(b=>b.channel===channelFilter))return false;
    if(monthFilter!=="all"){const endMonth=new Date(p.end).getMonth();if(endMonth!==parseInt(monthFilter))return false;}
    if(search){const s=search.toLowerCase();return p.id.toLowerCase().includes(s)||p.brand.toLowerCase().includes(s)||p.title.toLowerCase().includes(s);}
    return true;
  }).sort((a,b)=>{
    if(dateSort==="end_asc")return a.end.localeCompare(b.end);
    if(dateSort==="end_desc")return b.end.localeCompare(a.end);
    if(dateSort==="start_asc")return a.start.localeCompare(b.start);
    if(dateSort==="start_desc")return b.start.localeCompare(a.start);
    return 0;
  });

  const stats={total:withStatus.length,active:withStatus.filter(p=>!["delivered","draft","overdue"].includes(p.effectiveStatus)).length,delivered:withStatus.filter(p=>p.effectiveStatus==="delivered").length,overdue:withStatus.filter(p=>p.effectiveStatus==="overdue").length};

  // Detail view
  if(selectedProject){const proj=projects.find(p=>p.id===selectedProject);if(proj)return <ProjectDetail project={proj} briefs={proj.briefs} onBack={()=>setSelectedProject(null)} onUpdateStatus={updateBriefStatus}/>;}

  // List view
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div className="hub-grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        <Card style={{padding:"16px 18px",textAlign:"center"}}><div style={{fontSize:26,fontWeight:700,color:C.black,fontFamily:ff}}>{stats.total}</div><div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,marginTop:4}}>TOTAL</div></Card>
        <Card style={{padding:"16px 18px",textAlign:"center"}}><div style={{fontSize:26,fontWeight:700,color:C.blue,fontFamily:ff}}>{stats.active}</div><div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,marginTop:4}}>ACTIVE</div></Card>
        <Card style={{padding:"16px 18px",textAlign:"center"}}><div style={{fontSize:26,fontWeight:700,color:C.green,fontFamily:ff}}>{stats.delivered}</div><div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,marginTop:4}}>DELIVERED</div></Card>
        <Card style={{padding:"16px 18px",textAlign:"center",border:stats.overdue>0?"1px solid #ef444433":`1px solid ${C.g88}`}}><div style={{fontSize:26,fontWeight:700,color:stats.overdue>0?"#ef4444":C.g70,fontFamily:ff}}>{stats.overdue}</div><div style={{fontSize:9,...hd,color:stats.overdue>0?"#ef4444":C.g70,fontFamily:ff,marginTop:4}}>OVERDUE</div></Card>
      </div>

      <Card style={{padding:"14px 20px"}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects..." style={{...bi,width:180,fontSize:13}}/>
            <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>BRAND:</span><select value={brandFilter} onChange={e=>setBrandFilter(e.target.value)} style={{...bi,width:"auto",fontSize:12,cursor:"pointer",padding:"8px 12px"}}><option value="all">All Brands</option>{BRANDS.map(b=><option key={b} value={b}>{b}</option>)}</select></div>
            <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>CHANNEL:</span><select value={channelFilter} onChange={e=>setChannelFilter(e.target.value)} style={{...bi,width:"auto",fontSize:12,cursor:"pointer",padding:"8px 12px"}}><option value="all">All Channels</option>{CHANNELS.map(ch=><option key={ch} value={ch}>{ch}</option>)}</select></div>
            <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>MONTH:</span><select value={monthFilter} onChange={e=>setMonthFilter(e.target.value)} style={{...bi,width:"auto",fontSize:12,cursor:"pointer",padding:"8px 12px"}}><option value="all">All Months</option>{MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}</select></div>
            <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>DATE:</span><select value={dateSort} onChange={e=>setDateSort(e.target.value)} style={{...bi,width:"auto",fontSize:12,cursor:"pointer",padding:"8px 12px"}}><option value="end_asc">Due (Soonest)</option><option value="end_desc">Due (Latest)</option><option value="start_asc">Start (Earliest)</option><option value="start_desc">Start (Latest)</option></select></div>
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            <button onClick={()=>setFilter("all")} style={{padding:"6px 14px",border:`1px solid ${filter==="all"?C.black:C.g88}`,...rad,background:filter==="all"?C.black:C.card,color:filter==="all"?C.card:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>ALL</button>
            {PROJECT_STATUSES.map(s=><button key={s.key} onClick={()=>setFilter(f=>f===s.key?"all":s.key)} style={{padding:"6px 14px",border:`1px solid ${filter===s.key?s.color:C.g88}`,...rad,background:filter===s.key?s.color+"18":C.card,color:filter===s.key?s.color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>{s.label}</button>)}
          </div>
        </div>
      </Card>

      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"130px 90px 1fr 110px 90px 130px 40px",padding:"12px 20px",background:C.g94,borderBottom:`1px solid ${C.g88}`,gap:10}}>
          <span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>JOB NUMBER</span><span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>BRAND</span><span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>PROJECT</span><span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>STATUS</span><span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>DUE</span><span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>PROGRESS</span><span></span>
        </div>
        {filtered.length===0&&<div style={{padding:"40px 20px",textAlign:"center"}}><div style={{fontSize:13,color:C.g50,fontFamily:ff,...bd}}>No projects match your filters.</div></div>}
        {filtered.map((p,idx)=>{const sc=PROJECT_STATUSES.find(x=>x.key===p.effectiveStatus);const tabCol=sc?sc.color:C.g88;return(
          <div key={p.id} style={{display:"grid",gridTemplateColumns:"130px 90px 1fr 110px 90px 130px 40px",padding:"14px 20px",borderBottom:idx<filtered.length-1?`1px solid ${C.g94}`:"none",alignItems:"center",gap:10,cursor:"pointer",transition:"background 0.1s",borderLeft:`3px solid ${tabCol}`}}
            onClick={()=>setSelectedProject(p.id)}
            onMouseEnter={e=>e.currentTarget.style.background=C.g94} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{fontSize:13,fontWeight:600,color:C.black,fontFamily:ff}}>{p.id}</div>
            <div style={{fontSize:12,color:C.g50,fontFamily:ff,...bd}}>{p.brand}</div>
            <div><div style={{fontSize:13,fontWeight:500,color:C.black,fontFamily:ff}}>{p.title}</div><div style={{fontSize:11,color:C.g70,fontFamily:ff,...bd,marginTop:1}}>{p.start} → {p.end}</div></div>
            <StatusBadge status={p.effectiveStatus}/>
            <DaysLabel end={p.end} status={p.effectiveStatus}/>
            <ProgressBar modules={p.modules}/>
            <div style={{textAlign:"right",color:C.g70,fontSize:16}}>›</div>
          </div>
        );})}
      </Card>

      <div style={{display:"flex",gap:16,flexWrap:"wrap",padding:"4px 0"}}>
        {PROJECT_STATUSES.map(s=><div key={s.key} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:4,background:s.color}}/><span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>{s.label}</span></div>)}
      </div>
    </div>
  );
}
