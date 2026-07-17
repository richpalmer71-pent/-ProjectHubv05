import { useState, useEffect } from "react";
import { C, ff, hd, bd, bi, rad, Card, Avatar } from "./shared";
import { loadDashboardProjects } from "../supabase";

function useIsMobile(bp=768) {
  const [mob,setMob]=useState(typeof window!=="undefined"?window.innerWidth<=bp:false);
  useEffect(()=>{const h=()=>setMob(window.innerWidth<=bp);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[bp]);
  return mob;
}

// Matches the real status values ProjectActions actually writes
// (App.js handleProjectAction) — "overdue" is derived, not stored.
const PROJECT_STATUSES = [
  {key:"active",label:"ACTIVE",color:C.blue},
  {key:"paused",label:"PAUSED",color:"#FFD93D"},
  {key:"archived",label:"ARCHIVED",color:C.g70},
  {key:"cancelled",label:"CANCELLED",color:"#FF6B6B"},
  {key:"overdue",label:"OVERDUE",color:"#FF6B6B"},
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const TODAY = new Date().toISOString().slice(0,10);

const getEffectiveStatus = (p) => {
  if(p.status==="archived"||p.status==="cancelled") return p.status;
  if(p.end && p.end<TODAY && p.status!=="paused") return "overdue";
  return p.status||"active";
};

// Simple name-to-department lookup for avatar colours
const NAME_DEPT = {"Richard Palmer":"Digital","Farah Yousaf":"Digital"};

function AvatarTooltip({ name }) {
  const [hover, setHover] = useState(false);
  if(!name) return <div style={{width:28,height:28,borderRadius:14,background:C.g88,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:11,color:C.g70,fontFamily:ff}}>—</span></div>;
  const firstName = name.split(" ")[0];
  const dept = NAME_DEPT[name] || "";
  return (
    <div style={{position:"relative",display:"inline-flex"}} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      <Avatar firstName={firstName} department={dept} size={28}/>
      {hover&&<div style={{position:"absolute",bottom:"calc(100% + 6px)",left:"50%",transform:"translateX(-50%)",background:C.black,color:C.card,padding:"6px 12px",...rad,fontSize:11,...hd,fontFamily:ff,whiteSpace:"nowrap",zIndex:50,boxShadow:"0 4px 12px rgba(0,0,0,0.15)"}}>
        <div>{name}</div>
        {dept&&<div style={{fontSize:9,color:C.g70,fontFamily:ff,marginTop:2}}>{dept.toUpperCase()}</div>}
      </div>}
    </div>
  );
}

function StatusBadge({status}) {
  const s=PROJECT_STATUSES.find(x=>x.key===status)||PROJECT_STATUSES[0];
  return <span style={{padding:"4px 12px",...rad,background:s.color+"18",color:s.color,fontSize:10,...hd,fontFamily:ff,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:4}}>
    {status==="overdue"&&<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
    {s.label}
  </span>;
}

function ProgressBar({pct}) {
  return(<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:6,background:C.g88,...rad,overflow:"hidden"}}><div style={{height:"100%",width:pct+"%",background:pct===100?C.green:pct>50?C.blue:C.g70,...rad,transition:"width 0.3s"}}/></div><span style={{fontSize:11,fontWeight:600,color:pct===100?C.green:C.g50,fontFamily:ff,minWidth:32}}>{pct}%</span></div>);
}

function DaysLabel({end, status}) {
  if(status==="archived") return <span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>ARCHIVED</span>;
  if(!end) return <span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>NO DUE DATE</span>;
  const diff=Math.ceil((new Date(end)-new Date(TODAY))/86400000);
  if(diff<0) return <span style={{fontSize:10,...hd,color:"#FF6B6B",fontFamily:ff}}>{Math.abs(diff)}d OVERDUE</span>;
  if(diff<=14) return <span style={{fontSize:10,...hd,color:"#FFD93D",fontFamily:ff}}>{diff}d LEFT</span>;
  return <span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>{diff}d LEFT</span>;
}

// MAIN DASHBOARD
export default function Dashboard({ onOpenProject }) {
  const mob = useIsMobile();
  const [projects,setProjects]=useState([]);
  const [loading,setLoading]=useState(true);
  const [loadError,setLoadError]=useState(false);
  const [filter,setFilter]=useState("all");
  const [brandFilter,setBrandFilter]=useState("all");
  const [channelFilter,setChannelFilter]=useState("all");
  const [monthFilter,setMonthFilter]=useState("all");
  const [dateSort,setDateSort]=useState("end_asc");
  const [search,setSearch]=useState("");

  const refresh=()=>{
    setLoading(true);setLoadError(false);
    loadDashboardProjects().then(data=>{setProjects(data);setLoading(false);}).catch(()=>{setLoadError(true);setLoading(false);});
  };
  useEffect(()=>{refresh();
    // eslint-disable-next-line
  },[]);

  const BRANDS=[...new Set(projects.map(p=>p.brand))].filter(Boolean).sort();
  const withStatus=projects.map(p=>({...p,effectiveStatus:getEffectiveStatus(p)}));

  const filtered=withStatus.filter(p=>{
    if(filter!=="all"&&p.effectiveStatus!==filter)return false;
    if(brandFilter!=="all"&&p.brand!==brandFilter)return false;
    if(channelFilter!=="all"&&!p.briefs.some(b=>b.channel===channelFilter))return false;
    if(monthFilter!=="all"){if(!p.end)return false;const endMonth=new Date(p.end).getMonth();if(endMonth!==parseInt(monthFilter))return false;}
    if(search){const s=search.toLowerCase();return p.id.toLowerCase().includes(s)||p.brand.toLowerCase().includes(s)||p.title.toLowerCase().includes(s);}
    return true;
  }).sort((a,b)=>{
    const ea=a.end||"9999-12-31",eb=b.end||"9999-12-31",sa=a.start||"9999-12-31",sb=b.start||"9999-12-31";
    if(dateSort==="end_asc")return ea.localeCompare(eb);
    if(dateSort==="end_desc")return eb.localeCompare(ea);
    if(dateSort==="start_asc")return sa.localeCompare(sb);
    if(dateSort==="start_desc")return sb.localeCompare(sa);
    return 0;
  });

  const stats={total:withStatus.length,active:withStatus.filter(p=>p.effectiveStatus==="active").length,archived:withStatus.filter(p=>p.effectiveStatus==="archived").length,overdue:withStatus.filter(p=>p.effectiveStatus==="overdue").length};

  const pctFor=(p)=>{const total=p.briefs.length;if(!total)return 0;const done=p.briefs.filter(b=>b.status==="complete").length;return Math.round((done/total)*100);};

  if(loading) return (
    <Card style={{padding:"40px 20px",textAlign:"center"}}>
      <div style={{fontSize:13,color:C.g50,fontFamily:ff,...bd}}>Loading projects…</div>
    </Card>
  );

  if(loadError) return (
    <Card style={{padding:"40px 20px",textAlign:"center"}}>
      <div style={{fontSize:13,color:"#FF6B6B",fontFamily:ff,...bd,marginBottom:12}}>Couldn't load projects from the database.</div>
      <button onClick={refresh} style={{padding:"10px 20px",border:"none",...rad,background:C.black,color:C.card,fontSize:11,...hd,fontFamily:ff,cursor:"pointer"}}>RETRY</button>
    </Card>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:mob?"repeat(2,1fr)":"repeat(4,1fr)",gap:10}}>
        <Card style={{padding:"14px 16px",textAlign:"center"}}><div style={{fontSize:mob?22:26,fontWeight:700,color:C.black,fontFamily:ff}}>{stats.total}</div><div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,marginTop:4}}>TOTAL</div></Card>
        <Card style={{padding:"14px 16px",textAlign:"center"}}><div style={{fontSize:mob?22:26,fontWeight:700,color:C.blue,fontFamily:ff}}>{stats.active}</div><div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,marginTop:4}}>ACTIVE</div></Card>
        <Card style={{padding:"14px 16px",textAlign:"center"}}><div style={{fontSize:mob?22:26,fontWeight:700,color:C.g70,fontFamily:ff}}>{stats.archived}</div><div style={{fontSize:9,...hd,color:C.g70,fontFamily:ff,marginTop:4}}>ARCHIVED</div></Card>
        <Card style={{padding:"14px 16px",textAlign:"center",border:stats.overdue>0?"1px solid #FF6B6B33":`1px solid ${C.g88}`}}><div style={{fontSize:mob?22:26,fontWeight:700,color:stats.overdue>0?"#FF6B6B":C.g70,fontFamily:ff}}>{stats.overdue}</div><div style={{fontSize:9,...hd,color:stats.overdue>0?"#FF6B6B":C.g70,fontFamily:ff,marginTop:4}}>OVERDUE</div></Card>
      </div>

      <Card style={{padding:"14px 16px"}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{...bi,width:mob?"100%":180,fontSize:13}}/>
            {mob ? (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,width:"100%"}}>
                <select value={brandFilter} onChange={e=>setBrandFilter(e.target.value)} style={{...bi,fontSize:12,cursor:"pointer",padding:"8px 10px"}}><option value="all">All Brands</option>{BRANDS.map(b=><option key={b} value={b}>{b}</option>)}</select>
                <select value={channelFilter} onChange={e=>setChannelFilter(e.target.value)} style={{...bi,fontSize:12,cursor:"pointer",padding:"8px 10px"}}><option value="all">All Channels</option>{["Web","Email","Paid"].map(ch=><option key={ch} value={ch}>{ch}</option>)}</select>
                <select value={monthFilter} onChange={e=>setMonthFilter(e.target.value)} style={{...bi,fontSize:12,cursor:"pointer",padding:"8px 10px"}}><option value="all">All Months</option>{MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}</select>
                <select value={dateSort} onChange={e=>setDateSort(e.target.value)} style={{...bi,fontSize:12,cursor:"pointer",padding:"8px 10px"}}><option value="end_asc">Due (Soonest)</option><option value="end_desc">Due (Latest)</option><option value="start_asc">Start (Earliest)</option><option value="start_desc">Start (Latest)</option></select>
              </div>
            ) : (<>
              <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>BRAND:</span><select value={brandFilter} onChange={e=>setBrandFilter(e.target.value)} style={{...bi,width:"auto",fontSize:12,cursor:"pointer",padding:"8px 12px"}}><option value="all">All Brands</option>{BRANDS.map(b=><option key={b} value={b}>{b}</option>)}</select></div>
              <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>CHANNEL:</span><select value={channelFilter} onChange={e=>setChannelFilter(e.target.value)} style={{...bi,width:"auto",fontSize:12,cursor:"pointer",padding:"8px 12px"}}><option value="all">All Channels</option>{["Web","Email","Paid"].map(ch=><option key={ch} value={ch}>{ch}</option>)}</select></div>
              <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>MONTH:</span><select value={monthFilter} onChange={e=>setMonthFilter(e.target.value)} style={{...bi,width:"auto",fontSize:12,cursor:"pointer",padding:"8px 12px"}}><option value="all">All Months</option>{MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}</select></div>
              <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>DATE:</span><select value={dateSort} onChange={e=>setDateSort(e.target.value)} style={{...bi,width:"auto",fontSize:12,cursor:"pointer",padding:"8px 12px"}}><option value="end_asc">Due (Soonest)</option><option value="end_desc">Due (Latest)</option><option value="start_asc">Start (Earliest)</option><option value="start_desc">Start (Latest)</option></select></div>
              <button onClick={refresh} title="Refresh" style={{marginLeft:"auto",padding:"8px 10px",border:`1px solid ${C.g88}`,...rad,background:C.card,cursor:"pointer",display:"flex",alignItems:"center"}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.g50} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
              </button>
            </>)}
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            <button onClick={()=>setFilter("all")} style={{padding:"6px 12px",border:`1px solid ${filter==="all"?C.black:C.g88}`,...rad,background:filter==="all"?C.black:C.card,color:filter==="all"?C.card:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>ALL</button>
            {PROJECT_STATUSES.map(s=><button key={s.key} onClick={()=>setFilter(f=>f===s.key?"all":s.key)} style={{padding:"6px 12px",border:`1px solid ${filter===s.key?s.color:C.g88}`,...rad,background:filter===s.key?s.color+"18":C.card,color:filter===s.key?s.color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>{s.label}</button>)}
          </div>
        </div>
      </Card>

      {filtered.length===0&&<Card style={{padding:"40px 20px",textAlign:"center"}}><div style={{fontSize:13,color:C.g50,fontFamily:ff,...bd}}>{projects.length===0?"No projects yet — create one from the Project Hub to see it here.":"No projects match your filters."}</div></Card>}

      {mob ? (
        /* MOBILE: Project Cards */
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.map(p=>{const sc=PROJECT_STATUSES.find(x=>x.key===p.effectiveStatus);const tabCol=sc?sc.color:C.g88;return(
            <div key={p.id} onClick={()=>onOpenProject(p.id)} style={{background:C.card,border:`1px solid ${C.g88}`,...rad,padding:16,borderLeft:`4px solid ${tabCol}`,cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:11,fontWeight:700,color:C.g50,fontFamily:ff}}>{p.id}</span>
                  <span style={{fontSize:11,...hd,color:C.g70,fontFamily:ff}}>{p.brand}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  {p.owner&&<AvatarTooltip name={p.owner}/>}
                </div>
              </div>
              <div style={{fontSize:15,fontWeight:600,color:C.black,fontFamily:ff,marginBottom:8}}>{p.title}</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <StatusBadge status={p.effectiveStatus}/>
                <DaysLabel end={p.end} status={p.effectiveStatus}/>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:11,...bd,color:C.g70,fontFamily:ff}}>{p.start||"—"} → {p.end||"—"}</span>
                <ProgressBar pct={pctFor(p)}/>
              </div>
              {p.briefs.length>0&&<div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${C.g94}`,display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:10,...hd,color:C.g70,fontFamily:ff}}>{p.briefs.length} BRIEF{p.briefs.length!==1?"S":""}</span>
                <span style={{fontSize:10,...bd,color:C.g70,fontFamily:ff}}>·</span>
                <span style={{fontSize:10,...bd,color:C.green,fontFamily:ff,fontWeight:600}}>{p.briefs.filter(b=>b.status==="complete").length} COMPLETE</span>
              </div>}
            </div>
          );})}
        </div>
      ) : (
        /* DESKTOP: Project Table */
        <Card style={{padding:0,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"120px 80px 1fr 50px 110px 80px 130px",padding:"12px 20px",background:C.g94,borderBottom:`1px solid ${C.g88}`,gap:10}}>
            <span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>JOB NUMBER</span><span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>BRAND</span><span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>PROJECT</span><span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>OWNER</span><span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>STATUS</span><span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>DUE</span><span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>PROGRESS</span>
          </div>
          {filtered.map((p,idx)=>{const sc=PROJECT_STATUSES.find(x=>x.key===p.effectiveStatus);const tabCol=sc?sc.color:C.g88;return(
            <div key={p.id} style={{display:"grid",gridTemplateColumns:"120px 80px 1fr 50px 110px 80px 130px",padding:"14px 20px",borderBottom:idx<filtered.length-1?`1px solid ${C.g94}`:"none",alignItems:"center",gap:10,cursor:"pointer",transition:"background 0.1s",borderLeft:`3px solid ${tabCol}`}}
              onClick={()=>onOpenProject(p.id)}
              onMouseEnter={e=>e.currentTarget.style.background=C.g94} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{fontSize:13,fontWeight:600,color:C.black,fontFamily:ff}}>{p.id}</div>
              <div style={{fontSize:12,color:C.g50,fontFamily:ff,...bd}}>{p.brand}</div>
              <div><div style={{fontSize:13,fontWeight:500,color:C.black,fontFamily:ff}}>{p.title}</div><div style={{fontSize:11,color:C.g70,fontFamily:ff,...bd,marginTop:1}}>{p.start||"—"} → {p.end||"—"}</div></div>
              <AvatarTooltip name={p.owner}/>
              <StatusBadge status={p.effectiveStatus}/>
              <DaysLabel end={p.end} status={p.effectiveStatus}/>
              <ProgressBar pct={pctFor(p)}/>
            </div>
          );})}
        </Card>
      )}

      <div style={{display:"flex",gap:mob?8:16,flexWrap:"wrap",padding:"4px 0"}}>
        {PROJECT_STATUSES.map(s=><div key={s.key} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:8,height:8,borderRadius:4,background:s.color}}/><span style={{fontSize:mob?9:10,...hd,color:C.g70,fontFamily:ff}}>{s.label}</span></div>)}
      </div>
    </div>
  );
}
