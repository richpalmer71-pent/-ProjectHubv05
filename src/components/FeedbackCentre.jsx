import { useState } from "react";
import { C, ff, hd, bd, bi, rad, Card } from "./shared";

const CATEGORIES = [
  {key:"briefing",label:"BRIEFING"},{key:"concepts",label:"CONCEPTS (IF APPLICABLE)"},
  {key:"consultation",label:"CONSULTATION / REVIEW PROCESS"},{key:"updates",label:"UPDATES / CHANGES"},
  {key:"delivery",label:"DELIVERY LEAD TIME"},{key:"overall",label:"OVERALL"}
];

export default function FeedbackCentre({ jobNum, brand, title }) {
  const [ratings,setRatings]=useState({});
  const [feedback,setFeedback]=useState("");
  const [submitted,setSubmitted]=useState(false);
  const [userEmail,setUserEmail]=useState("");
  const [emailError,setEmailError]=useState(false);
  const setR=(key,val)=>setRatings(p=>({...p,[key]:val}));
  const rated=Object.keys(ratings).length;
  const avg=rated>0?Object.values(ratings).reduce((a,b)=>a+b,0)/rated:0;

  if(submitted) return (
    <Card style={{textAlign:"center",padding:"48px 28px"}}>
      <div style={{fontSize:15,...hd,color:C.black,fontFamily:ff,marginBottom:8}}>FEEDBACK SUBMITTED</div>
      <p style={{fontSize:14,...bd,color:C.g50,fontFamily:ff,lineHeight:1.6,maxWidth:400,margin:"0 auto"}}>Thank you for your feedback on {title||"this project"}.</p>
      <div style={{marginTop:24,padding:"12px 20px",background:C.g94,...rad,display:"inline-block"}}>
        <span style={{fontSize:12,...hd,color:C.g50,fontFamily:ff}}>AVERAGE RATING: </span>
        <span style={{fontSize:12,...hd,color:avg>=4?C.green:avg>=3?"#eab308":C.red,fontFamily:ff}}>{avg.toFixed(1)} / 5</span>
      </div>
    </Card>
  );

  return (<div style={{display:"flex",flexDirection:"column",gap:14}}>
    <Card>
      <div className="hub-grid-3" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
        <div><div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:6}}>JOB NUMBER</div><div style={{...bi,background:C.g94,color:C.g50}}>{jobNum||"—"}</div></div>
        <div><div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:6}}>BRAND</div><div style={{...bi,background:C.g94,color:C.g50}}>{brand||"—"}</div></div>
        <div><div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:6}}>CAMPAIGN</div><div style={{...bi,background:C.g94,color:C.g50}}>{title||"—"}</div></div>
      </div>
    </Card>

    <Card>
      <div style={{fontSize:17,...hd,color:C.black,fontFamily:ff,marginBottom:4,letterSpacing:"0.02em"}}>HOW DID IT GO?</div>
      <p style={{fontSize:13,color:C.g50,fontFamily:ff,lineHeight:1.6,marginBottom:20,...bd}}>Rate this project (1 is terrible, 5 is excellent).</p>
      {CATEGORIES.map(cat=>{const active=ratings[cat.key];return(
        <div key={cat.key} style={{marginBottom:8,padding:"14px 18px",border:`1px solid ${C.g88}`,...rad,background:active?C.g94:C.card}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <span style={{fontSize:13,fontWeight:600,color:C.black,fontFamily:ff}}>{cat.label}</span>
            {active&&<span style={{fontSize:12,fontWeight:600,color:active>=4?C.green:active>=3?"#eab308":C.red,fontFamily:ff}}>{active} / 5</span>}
          </div>
          <div style={{display:"flex",gap:6}}>
            {[1,2,3,4,5].map(n=>{const isA=ratings[cat.key]===n;const col=isA?(n<=2?C.red:n===3?"#eab308":C.green):C.g88;return(
              <button key={n} onClick={()=>setR(cat.key,n)} style={{width:46,height:46,border:isA?`2px solid ${col}`:`1px solid ${C.g88}`,...rad,background:isA?col:C.card,color:isA?C.card:C.g50,fontSize:15,fontWeight:700,fontFamily:ff,cursor:"pointer",transition:"all 0.15s"}}>{n}</button>
            );})}
          </div>
        </div>
      );})}
    </Card>

    <Card>
      <div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:7}}>ADDITIONAL FEEDBACK</div>
      <textarea value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="Any other thoughts, suggestions or recommendations..." rows={5} style={{...bi,resize:"vertical",minHeight:100}}/>
    </Card>

    <Card>
      <div style={{fontSize:11,...hd,color:C.g50,fontFamily:ff,marginBottom:7}}>YOUR EMAIL ADDRESS <span style={{color:"#ef4444"}}>*</span></div>
      <input value={userEmail} onChange={e=>{setUserEmail(e.target.value);setEmailError(false);}} placeholder="name@company.com" style={{...bi,borderColor:emailError?"#ef4444":undefined}}/>
      {emailError&&<div style={{fontSize:11,color:"#ef4444",fontFamily:ff,marginTop:4}}>Please enter a valid email address before submitting.</div>}
    </Card>

    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      {rated>0&&<span style={{fontSize:12,fontWeight:500,color:C.g50,fontFamily:ff}}>{rated} / {CATEGORIES.length} RATED</span>}
      <button onClick={()=>{if(!userEmail||!userEmail.includes("@")){setEmailError(true);return;}setSubmitted(true);}} style={{padding:"13px 28px",border:"none",...rad,background:C.black,color:C.card,fontSize:13,...hd,fontFamily:ff,cursor:"pointer",marginLeft:"auto"}}>SUBMIT FEEDBACK</button>
    </div>
  </div>);
}
