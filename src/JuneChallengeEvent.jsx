import React, {useState} from "react";
import JuneFullEvent from "./JuneFullEvent.jsx";
import JuneHalfEvent from "./JuneHalfEvent.jsx";
export default function JuneChallengeEvent({onExit, ruck500Name}) {
  const [choice,setChoice]=useState(null);
  if(choice === "full") return <JuneFullEvent onExit={()=>setChoice(null)} ruck500Name={ruck500Name}/>;
  if(choice === "half") return <JuneHalfEvent onExit={()=>setChoice(null)} ruck500Name={ruck500Name}/>;
  return <div style={{position:"fixed",inset:0,zIndex:80,background:"#0D0D0D",color:"#F3F3EE",overflowY:"auto",padding:"20px",fontFamily:"system-ui,sans-serif"}}>
    <div style={{maxWidth:470,margin:"0 auto"}}>
      <button onClick={onExit} style={{background:"transparent",color:"#C6E70A",marginBottom:24}}>← Back to Ruck 500</button>
      <img src="/reculver-towers-sunset.jpg" alt="Reculver Towers" style={{width:"100%",height:180,objectFit:"cover",borderRadius:16}}/>
      <h1 style={{fontSize:30,fontWeight:900,color:"#C6E70A",marginTop:18}}>COASTAL CHALLENGE 2027</h1>
      <p style={{marginTop:8}}>Saturday 12 June 2027 · 8:00 am start</p>
      <p style={{marginTop:8}}>Reculver Towers → King George VI Memorial Park, Ramsgate → Kingsdown Camping Park</p>
      <p style={{marginTop:8,color:"#bbb"}}>Both groups start together at Reculver. King George VI Memorial Park, Ramsgate is the Coffee Buzz stop for both challenges and the 20 km finish. Distances are approximate.</p>
      <h2 style={{fontSize:22,fontWeight:800,marginTop:24,marginBottom:14}}>CHOOSE YOUR CHALLENGE</h2>
      <button onClick={()=>setChoice("full")} style={{width:"100%",background:"#C6E70A",color:"#0D0D0D",borderRadius:14,padding:20,textAlign:"left",fontWeight:800,marginBottom:12}}>
        FULL COASTAL CHALLENGE · 50 KM / 31.1 MI<br/><span style={{fontWeight:500}}>Reculver Towers → Kingsdown Camping Park · target finish 6 pm</span>
      </button>
      <button onClick={()=>setChoice("half")} style={{width:"100%",background:"#222",color:"#F3F3EE",border:"2px solid #C6E70A",borderRadius:14,padding:20,textAlign:"left",fontWeight:800}}>
        HALF COASTAL CHALLENGE · 20 KM / 12.4 MI<br/><span style={{fontWeight:500}}>Reculver Towers → King George VI Memorial Park, Ramsgate · Coffee Buzz and 20 km finish</span>
      </button>
      <p style={{fontSize:12,color:"#aaa",marginTop:18}}>Your full and half challenge records, photos and certificates are stored separately on this device.</p>
    </div>
  </div>;
}
