import { useState } from "react";
import { C, ff, hd, bd, bi, rad, Field, Input, Card } from "./shared";

export default function AssetDelivery() {
  const [figma,setFigma]=useState(["","","",""]);
  const upF=(i,v)=>setFigma(f=>f.map((x,j)=>j===i?v:x));
  const [dropbox,setDropbox]=useState("");
  const [dam,setDam]=useState("");
  const [addLinks,setAddLinks]=useState([{id:1,label:"",url:""}]);
  const addLink=()=>setAddLinks(p=>[...p,{id:Date.now(),label:"",url:""}]);
  const rmLink=(id)=>setAddLinks(p=>p.filter(l=>l.id!==id));
  const upLink=(id,f,v)=>setAddLinks(p=>p.map(l=>l.id===id?{...l,[f]:v}:l));
  const [files,setFiles]=useState([]);
  const handleUpload=(e)=>{Array.from(e.target.files).forEach(file=>{const r=new FileReader();r.onload=ev=>setFiles(p=>[...p,{id:Date.now()+Math.random(),name:file.name,size:file.size,url:ev.target.result}]);r.readAsDataURL(file);});e.target.value="";};
  const rmFile=(id)=>setFiles(p=>p.filter(f=>f.id!==id));
  const fmtSize=(b)=>b<1024?b+" B":b<1048576?Math.round(b/1024)+" KB":(b/1048576).toFixed(1)+" MB";
  const [saved,setSaved]=useState(false);
  const doSave=()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);};

  return (<div style={{display:"flex",flexDirection:"column",gap:14}}>
    <Card>
      <div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:16}}>DESIGN FILES</div>
      <Field label="FIGMA FILE LINKS">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{figma.map((v,i)=><Input key={i} value={v} onChange={x=>upF(i,x)} placeholder={`Figma link ${i+1}...`}/>)}</div>
      </Field>
    </Card>

    <Card>
      <div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:16}}>REPOSITORIES</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Field label="DROPBOX REPOSITORY"><Input value={dropbox} onChange={setDropbox} placeholder="https://dropbox.com/..."/></Field>
        <Field label="DAM LINK"><Input value={dam} onChange={setDam} placeholder="https://dam.pentland.com/..."/></Field>
      </div>
    </Card>

    <Card>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff}}>ADDITIONAL LINKS</div>
        <button onClick={addLink} style={{padding:"6px 14px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>+ ADD LINK</button>
      </div>
      {addLinks.map((link,idx)=>(<div key={link.id} style={{display:"flex",gap:12,marginBottom:8,alignItems:"flex-end"}}>
        <div style={{flex:1}}><Field label={`LINK ${String(idx+1).padStart(2,"0")} LABEL`}><Input value={link.label} onChange={v=>upLink(link.id,"label",v)} placeholder="e.g. Google Drive"/></Field></div>
        <div style={{flex:1}}><Field label="URL"><Input value={link.url} onChange={v=>upLink(link.id,"url",v)} placeholder="https://..."/></Field></div>
        {addLinks.length>1&&<button onClick={()=>rmLink(link.id)} style={{padding:"8px 12px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer",marginBottom:4}}>REMOVE</button>}
      </div>))}
    </Card>

    <Card>
      <div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:16}}>UPLOAD ASSETS</div>
      <div onClick={()=>document.getElementById("asset-upload").click()} style={{border:`2px dashed ${C.g88}`,padding:28,textAlign:"center",background:C.g94,...rad,cursor:"pointer",marginBottom:files.length?24:0}}>
        <input id="asset-upload" type="file" multiple onChange={handleUpload} style={{display:"none"}}/>
        <div style={{fontSize:13,...hd,color:C.g50,fontFamily:ff,marginBottom:4}}>CLICK TO UPLOAD FILES</div>
        <div style={{fontSize:12,...bd,color:C.g70,fontFamily:ff}}>Images, PDFs, ZIPs, Figma exports, video files</div>
      </div>
      {files.length>0&&<div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff}}>ASSET DIRECTORY</div>
          <div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff}}>{files.length} FILE{files.length>1?"S":""}</div>
        </div>
        <div style={{border:`1px solid ${C.g88}`,...rad,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 100px 120px 80px",padding:"10px 16px",background:C.g94,borderBottom:`1px solid ${C.g88}`}}>
            <span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>FILE NAME</span><span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>SIZE</span><span style={{fontSize:10,...hd,color:C.g50,fontFamily:ff}}>ACTION</span><span></span>
          </div>
          {files.map(file=>(<div key={file.id} style={{display:"grid",gridTemplateColumns:"1fr 100px 120px 80px",padding:"12px 16px",borderBottom:`1px solid ${C.g94}`,alignItems:"center"}}>
            <div style={{fontSize:13,...bd,color:C.black,fontFamily:ff,wordBreak:"break-all"}}>{file.name}</div>
            <div style={{fontSize:12,...bd,color:C.g50,fontFamily:ff}}>{fmtSize(file.size)}</div>
            <div><a href={file.url} download={file.name} style={{padding:"6px 14px",border:"none",...rad,background:C.black,color:C.card,fontSize:10,...hd,fontFamily:ff,textDecoration:"none",display:"inline-block"}}>DOWNLOAD</a></div>
            <div style={{textAlign:"right"}}><button onClick={()=>rmFile(file.id)} style={{padding:"4px 10px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>REMOVE</button></div>
          </div>))}
        </div>
      </div>}
    </Card>

    <div style={{position:"relative"}}>
      {saved&&<div style={{position:"absolute",top:-40,left:"50%",transform:"translateX(-50%)",background:C.black,color:C.card,padding:"6px 16px",...rad,fontSize:11,...hd,fontFamily:ff}}>CHANGES SAVED</div>}
      <button onClick={doSave} style={{width:"100%",padding:"13px 24px",border:"none",...rad,background:C.black,color:C.card,fontSize:13,...hd,fontFamily:ff,cursor:"pointer"}}>SAVE CHANGES</button>
    </div>
  </div>);
}
