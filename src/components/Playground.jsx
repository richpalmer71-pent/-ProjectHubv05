import { useState } from "react";
import { C, ff, hd, bd, bi, rad, Field, Card } from "./shared";

const Inp = ({value,onChange,placeholder}) => { const [f,setF]=useState(false); return <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...bi,borderColor:f?C.blue:C.g88,boxShadow:f?`0 0 0 3px ${C.blue}22`:"none"}} onFocus={()=>setF(true)} onBlur={()=>setF(false)} />; };
const TA = ({value,onChange,placeholder,rows=3}) => { const [f,setF]=useState(false); return <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{...bi,resize:"vertical",minHeight:60,borderColor:f?C.blue:C.g88,boxShadow:f?`0 0 0 3px ${C.blue}22`:"none"}} onFocus={()=>setF(true)} onBlur={()=>setF(false)} />; };
const mkLink=()=>({id:Date.now()+Math.random(),type:"link",url:"",label:"",notes:""});
const mkImg=()=>({id:Date.now()+Math.random(),type:"image",imgUrl:"",caption:""});
const mkNote=()=>({id:Date.now()+Math.random(),type:"text",title:"",content:""});

export default function Playground() {
  const [cards,setCards]=useState([]);
  const addCard=()=>setCards(c=>[...c,{id:Date.now()+Math.random(),title:"",saved:false,sections:[]}]);
  const rmCard=id=>setCards(c=>c.filter(x=>x.id!==id));
  const upCard=(id,f,v)=>setCards(c=>c.map(x=>x.id===id?{...x,[f]:v,saved:false}:x));
  const addSec=(cid,creator)=>setCards(c=>c.map(x=>x.id===cid?{...x,sections:[...x.sections,creator()],saved:false}:x));
  const rmSec=(cid,sid)=>setCards(c=>c.map(x=>x.id===cid?{...x,sections:x.sections.filter(s=>s.id!==sid),saved:false}:x));
  const upSec=(cid,sid,f,v)=>setCards(c=>c.map(x=>x.id===cid?{...x,sections:x.sections.map(s=>s.id===sid?{...s,[f]:v}:s),saved:false}:x));
  const saveCard=id=>setCards(c=>c.map(x=>x.id===id?{...x,saved:true}:x));
  const onFile=(cid,sid,e)=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=ev=>upSec(cid,sid,"imgUrl",ev.target.result);r.readAsDataURL(f);}};
  const secHead=(cid,sid,label,accent,num)=>(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
    <span style={{fontSize:11,...hd,color:accent,fontFamily:ff}}>{label} {String(num).padStart(2,"0")}</span>
    <button onClick={()=>rmSec(cid,sid)} style={{padding:"4px 12px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>REMOVE</button>
  </div>);

  return (<div style={{display:"flex",flexDirection:"column",gap:14}}>
    <button onClick={addCard} style={{width:"100%",padding:"18px 24px",border:`2px dashed ${C.g88}`,...rad,background:"transparent",color:C.g50,fontSize:13,...hd,fontFamily:ff,cursor:"pointer"}}>+ SOMETHING COOL</button>
    {cards.map((card,idx)=>{let linkN=0,imgN=0,noteN=0;return(
      <Card key={card.id}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <span style={{fontSize:11,...hd,color:C.g70,fontFamily:ff}}>ITEM {String(idx+1).padStart(2,"0")}</span>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {card.saved&&<span style={{fontSize:10,...hd,color:C.green,fontFamily:ff}}>SAVED</span>}
            <button onClick={()=>rmCard(card.id)} style={{padding:"4px 12px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:10,...hd,fontFamily:ff,cursor:"pointer"}}>REMOVE</button>
          </div>
        </div>
        <div style={{marginBottom:14}}><Field label="CARD TITLE"><Inp value={card.title} onChange={v=>upCard(card.id,"title",v)} placeholder="Name this item..."/></Field></div>
        <div style={{display:"flex",gap:6,marginBottom:card.sections.length?14:0}}>
          <button onClick={()=>addSec(card.id,mkLink)} style={{flex:1,padding:"11px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:11,...hd,fontFamily:ff,cursor:"pointer",borderBottom:`3px solid ${C.blue}`}}>+ LINK</button>
          <button onClick={()=>addSec(card.id,mkImg)} style={{flex:1,padding:"11px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:11,...hd,fontFamily:ff,cursor:"pointer",borderBottom:`3px solid ${C.yellow}`}}>+ IMAGE / VIDEO</button>
          <button onClick={()=>addSec(card.id,mkNote)} style={{flex:1,padding:"11px",border:`1px solid ${C.g88}`,...rad,background:C.card,color:C.g50,fontSize:11,...hd,fontFamily:ff,cursor:"pointer",borderBottom:`3px solid ${C.red}`}}>+ NOTES / COPY</button>
        </div>
        {card.sections.map(sec=>{
          if(sec.type==="link"){linkN++;return(<div key={sec.id} style={{borderLeft:`3px solid ${C.blue}`,paddingLeft:16,marginTop:12,paddingBottom:4}}>
            {secHead(card.id,sec.id,"LINK",C.blue,linkN)}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}><Field label="LABEL"><Inp value={sec.label} onChange={v=>upSec(card.id,sec.id,"label",v)} placeholder="What is this link?"/></Field><Field label="URL"><Inp value={sec.url} onChange={v=>upSec(card.id,sec.id,"url",v)} placeholder="https://..."/></Field></div>
            <Field label="NOTES"><TA value={sec.notes} onChange={v=>upSec(card.id,sec.id,"notes",v)} placeholder="Why is this relevant?" rows={2}/></Field>
            {sec.url&&<div style={{marginTop:8}}><a href={sec.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,...hd,color:C.blue,fontFamily:ff,textDecoration:"none"}}>OPEN LINK &#8599;</a></div>}
          </div>);}
          if(sec.type==="image"){imgN++;return(<div key={sec.id} style={{borderLeft:`3px solid ${C.yellow}`,paddingLeft:16,marginTop:12,paddingBottom:4}}>
            {secHead(card.id,sec.id,"IMAGE / VIDEO","#c5a800",imgN)}
            <div style={{marginBottom:12}}><Field label="UPLOAD FILE"><div onClick={()=>document.getElementById("up-"+sec.id).click()} style={{border:`1px dashed ${C.g88}`,padding:14,textAlign:"center",background:C.g94,...rad,cursor:"pointer"}}><input id={"up-"+sec.id} type="file" accept="image/*,video/*" onChange={e=>onFile(card.id,sec.id,e)} style={{display:"none"}}/><div style={{fontSize:10,color:C.g50,...hd,fontFamily:ff}}>CLICK TO UPLOAD</div></div></Field></div>
            <div style={{marginBottom:12}}><Field label="OR PASTE URL"><Inp value={sec.imgUrl} onChange={v=>upSec(card.id,sec.id,"imgUrl",v)} placeholder="https://..."/></Field></div>
            <Field label="CAPTION"><Inp value={sec.caption} onChange={v=>upSec(card.id,sec.id,"caption",v)} placeholder="Describe this reference..."/></Field>
            {sec.imgUrl&&(sec.imgUrl.startsWith("data:video")?<div style={{marginTop:10}}><video src={sec.imgUrl} controls style={{width:"100%",maxHeight:220,...rad}}/></div>:<div style={{marginTop:10,border:`1px solid ${C.g88}`,padding:6,background:C.g94,...rad}}><img src={sec.imgUrl} alt={sec.caption||"Ref"} style={{width:"100%",maxHeight:220,objectFit:"contain",display:"block",...rad}} onError={e=>{e.target.style.display="none"}}/></div>)}
          </div>);}
          if(sec.type==="text"){noteN++;return(<div key={sec.id} style={{borderLeft:`3px solid ${C.red}`,paddingLeft:16,marginTop:12,paddingBottom:4}}>
            {secHead(card.id,sec.id,"NOTES / COPY",C.red,noteN)}
            <div style={{marginBottom:12}}><Field label="TITLE"><Inp value={sec.title} onChange={v=>upSec(card.id,sec.id,"title",v)} placeholder="Give this a title..."/></Field></div>
            <Field label="CONTENT"><TA value={sec.content} onChange={v=>upSec(card.id,sec.id,"content",v)} placeholder="Write your thoughts, copy ideas..." rows={5}/></Field>
          </div>);}
          return null;
        })}
        {card.sections.length>0&&<div style={{marginTop:16}}><button onClick={()=>saveCard(card.id)} style={{width:"100%",padding:"12px 24px",border:"none",...rad,background:C.black,color:C.card,fontSize:12,...hd,fontFamily:ff,cursor:"pointer"}}>SAVE</button></div>}
      </Card>
    );})}
  </div>);
}
