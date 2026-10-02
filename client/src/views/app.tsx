import { useState, useEffect } from 'react'
type Page = 'signin'|'onboarding'|'home'|'food'|'activity'|'profile'
type Goal = 'Lose Weight'|'Maintain Weight'|'Gain Muscle'

export default function App(){
  const [page,setPage]=useState<Page>(()=> (localStorage.getItem('fittrack_auth')?'home':'signin') as Page)
  const [step,setStep]=useState(1)
  const [email,setEmail]=useState(''); const [pass,setPass]=useState('')
  const [age,setAge]=useState(()=>Number(localStorage.getItem('ft_age')||22))
  const [weight,setWeight]=useState(()=>Number(localStorage.getItem('ft_weight')||65))
  const [height,setHeight]=useState(()=>Number(localStorage.getItem('ft_height')||178))
  const [goal,setGoal]=useState<Goal>(()=> (localStorage.getItem('ft_goal') as Goal) || 'Maintain Weight')
  const [intake,setIntake]=useState(()=>Number(localStorage.getItem('ft_intake')||1882))
  const [burnGoal,setBurnGoal]=useState(()=>Number(localStorage.getItem('ft_burn')||400))
  const [foodLog,setFoodLog]=useState<any[]>(()=>JSON.parse(localStorage.getItem('ft_food')||'[]'))
  const [activityLog,setActivityLog]=useState<any[]>(()=>JSON.parse(localStorage.getItem('ft_act')||'[]'))
  const [selectedDate,setSelectedDate]=useState(new Date().toDateString())
  const [showEdit,setShowEdit]=useState(false)
  const [notifOn,setNotifOn]=useState(()=> localStorage.getItem('ft_notif')!=='off')
  const [darkOn,setDarkOn]=useState(()=> localStorage.getItem('ft_dark')!=='off')

  useEffect(()=>{localStorage.setItem('ft_food',JSON.stringify(foodLog))},[foodLog])
  useEffect(()=>{localStorage.setItem('ft_act',JSON.stringify(activityLog))},[activityLog])
  useEffect(()=>{localStorage.setItem('ft_age',String(age));localStorage.setItem('ft_weight',String(weight));localStorage.setItem('ft_height',String(height));localStorage.setItem('ft_goal',goal);localStorage.setItem('ft_intake',String(intake));localStorage.setItem('ft_burn',String(burnGoal))},[age,weight,height,goal,intake,burnGoal])
  useEffect(()=>{ localStorage.setItem('ft_notif', notifOn?'on':'off'); if(notifOn && typeof Notification!=='undefined' && Notification.permission!=='granted'){ Notification.requestPermission() } },[notifOn])
  useEffect(()=>{ localStorage.setItem('ft_dark', darkOn?'on':'off') },[darkOn])

  const login=()=>{if(!email||!pass)return alert('Email/pass daalo');localStorage.setItem('fittrack_auth','true');localStorage.setItem('fittrack_user',email.split('@')[0]||'5787687');if(!localStorage.getItem('ft_age'))setPage('onboarding');else setPage('home')}
  const userName=localStorage.getItem('fittrack_user')||'5787687'
  const consumed=foodLog.reduce((s,f)=>s+f.cal,0)
  const burned=activityLog.reduce((s,a)=>s+a.cal,0)
  const activeMin=activityLog.reduce((s,a)=>s+a.min,0)
  const bmi = (weight / ((height/100)*(height/100))).toFixed(1)

  const formatDay = (dateStr:string) => {
    const d = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(); yesterday.setDate(today.getDate()-1)
    if(d.toDateString()===today.toDateString()) return {label:'Today', sub:new Date().toLocaleDateString('en-US',{weekday:'long', day:'numeric', month:'short'}), isToday:true}
    if(d.toDateString()===yesterday.toDateString()) return {label:'Yesterday', sub:d.toLocaleDateString('en-US',{weekday:'long', day:'numeric'}), isToday:false}
    return {label:d.toLocaleDateString('en-US',{weekday:'short'}), sub:d.toLocaleDateString('en-US',{day:'numeric', month:'short'}), isToday:false}
  }
  const groupByDate = (logs:any[]) => {
    const groups:any = {}
    logs.forEach(item=>{
      const key = item.date? new Date(item.date).toDateString() : new Date().toDateString()
      if(!groups[key]) groups[key]=[]
      groups[key].push(item)
    })
    return Object.entries(groups).sort((a:any,b:any)=> new Date(b[0]).getTime() - new Date(a[0]).getTime())
  }

  const weeklyData = activityLog.length>=3? [...activityLog].slice(-7) : [{min:20},{min:40},{min:25},{min:55},{min:30},{min:65},{min:45}]
  const maxMin = Math.max(...weeklyData.map((d:any)=>d.min), 60)

  const addActivity = (name:string, icon:string, cal:number, min:number) => {
    setActivityLog([...activityLog,{id:Date.now(), name, icon, cal, min, date:new Date().toISOString()}])
  }
  const addFood = (name:string, icon:string, cal:number) => {
    setFoodLog([...foodLog,{id:Date.now(), name, icon, cal, date:new Date().toISOString()}])
  }

  const trackedDays = groupByDate([...foodLog,...activityLog]).length
  const allDates = Array.from({length:28}).map((_,i)=>{ const d=new Date(); d.setDate(d.getDate()-i); return d })
  const hasActivityOnDate = (ds:string) => [...activityLog,...foodLog].some((x:any)=> x.date && new Date(x.date).toDateString()===ds)

  // THEME CLASSES
  const bgMain = darkOn? 'bg-[#050a1a] text-white' : 'bg-[#eef2f7] text-zinc-900'
  const bgSidebar = darkOn? 'bg-[#080d1f]/80 border-white/10' : 'bg-white border-black/10 shadow-sm'
  const bgCard = darkOn? 'bg-[#0e142b] border-white/10' : 'bg-white border-black/5 shadow-sm'
  const bgCardInner = darkOn? 'bg-[#18285e] border-white/5' : 'bg-zinc-100 border-black/5'

  const bgCardSoft = darkOn? 'bg-[#111a32] border-white/10' : 'bg-white border-black/5 shadow-sm'
  const bgMuted = darkOn? 'bg-white/[0.03] border-white/5' : 'bg-black/[0.03] border-black/5'
  const textMuted = darkOn? 'text-zinc-500' : 'text-zinc-500'
  const bottomNav = darkOn? 'bg-[#080d1f]/95 border-white/10' : 'bg-white/95 border-black/10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]'

 if(page==='signin'){
  return <div className={`min-h-screen flex items-center justify-center p-6 ${bgMain} relative overflow-hidden`}>
    <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px]"></div>
    <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-green-400/20 rounded-full blur-[120px]"></div>
    <div className={`w-full max-w-[380px] rounded-[28px] p-8 ${bgCard} backdrop-blur-2xl relative shadow-2xl`}>

      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-2xl shadow-lg shadow-green-500/20">⚡</div>
      </div>

      <h1 className="text-center font-black tracking-[0.18em] text-[18px]">ZENITH <span className="text-emerald-400">AI</span> FITNESS APP</h1>
      <p className="text-center text-[10px] tracking-[0.25em] opacity-50 mt-2 uppercase">Transform Your Body With Intelligence</p>

      <div className="mt-8">
        <p className="font-bold text-lg mb-6">Welcome back</p>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-emerald-400 mb-3" />
        <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-emerald-400 mb-6" />
        <button onClick={login} className="w-full bg-gradient-to-r from-lime-200 to-emerald-400 text-black font-bold py-3.5 rounded-xl hover:scale-[1.02] transition-all shadow-lg">Login →</button>
        <p className="text-center text-[10px] opacity-30 mt-6 tracking-widest uppercase">AI-Powered • Secure & Private</p>
      </div>

    </div>
  </div>
}
  if(page==='onboarding'){
    return <div className={`min-h-screen p-8 ${bgMain}`}><div className="max-w-2xl mx-auto"><div className="flex gap-2 mb-10">{[1,2,3].map(i=><div key={i} className={`h-2 flex-1 rounded-full ${step>=i?'bg-emerald-500': darkOn?'bg-white/10':'bg-black/10'}`}></div>)}</div><div className={`rounded-[28px] p-8 border ${bgCard}`}>
      {step===1&&<><p className="font-bold text-lg mb-6">How old are you?</p><input type="number" value={age} onChange={e=>setAge(Number(e.target.value))} className={`w-full rounded-2xl px-5 py-4 font-bold outline-none border ${darkOn?'bg-[#0c1228] border-white/10':'bg-zinc-100 border-black/5'}`}/></>}
      {step===2&&<><p className="font-bold text-lg mb-6">Your measurements</p><div className="grid grid-cols-2 gap-4"><input type="number" value={weight} onChange={e=>setWeight(Number(e.target.value))} className={`rounded-2xl px-5 py-4 font-bold outline-none border ${darkOn?'bg-[#0c1228] border-white/10':'bg-zinc-100 border-black/5'}`}/><input type="number" value={height} onChange={e=>setHeight(Number(e.target.value))} className="bg-[#0c1228] border border-emerald-500/50 rounded-2xl px-5 py-4 font-bold outline-none text-white"/></div></>}
      {step===3&&<><p className="font-bold text-lg mb-6">What's your goal?</p>{(['Lose Weight','Maintain Weight','Gain Muscle'] as Goal[]).map(g=><button key={g} onClick={()=>setGoal(g)} className={`w-full text-left p-4 rounded-2xl border mb-2 ${goal===g?'bg-emerald-500/20 border-emerald-500': darkOn?'bg-[#0c1228] border-white/10':'bg-zinc-100 border-black/5'}`}>{g}</button>)}<div className="mt-6"><p className="text-xs">Intake {intake} kcal</p><input type="range" min={1200} max={3500} value={intake} onChange={e=>setIntake(Number(e.target.value))} className="w-full accent-emerald-500"/><p className="text-xs mt-3">Burn {burnGoal} kcal</p><input type="range" min={100} max={1000} value={burnGoal} onChange={e=>setBurnGoal(Number(e.target.value))} className="w-full accent-orange-500"/></div></>}
      <div className="flex justify-between mt-10"><button onClick={()=>setStep(s=>Math.max(1,s-1))} className={`px-6 py-3 rounded-xl ${darkOn?'bg-white/5':'bg-black/5'}`}>Back</button><button onClick={()=>step<3?setStep(s=>s+1):setPage('home')} className="bg-emerald-500 text-black font-bold px-8 py-3 rounded-xl">{step===3?'Get Started':'Continue'}</button></div>
    </div></div></div>
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${bgMain}`}>
      <div className={`w-[240px] backdrop-blur-xl border-r min-h-screen p-5 hidden md:flex flex-col justify-between ${bgSidebar}`}>
        <div><div className="flex items-center gap-3 mb-10"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">⚡</div><div><p className="font-black">FitTrack</p><p className={`text-[10px] ${textMuted}`}>PRO</p></div></div>
        {[{id:'home',l:'Home',i:'🏠'},{id:'food',l:'Food',i:'🍽️'},{id:'activity',l:'Activity',i:'⚡'},{id:'profile',l:'Profile',i:'👤'}].map(m=><button key={m.id} onClick={()=>setPage(m.id as Page)} className={`w-full text-left px-4 py-3 rounded-xl text-sm mb-1.5 flex gap-3 ${page===m.id?'bg-emerald-500/20 text-emerald-500 border border-emerald-500/20': darkOn?'text-zinc-500 hover:bg-white/5':'text-zinc-600 hover:bg-black/5'}`}>{m.i} {m.l}</button>)}</div>
        <div className={`border rounded-2xl p-3 flex gap-2 items-center ${darkOn?'bg-white/5 border-white/10':'bg-zinc-100 border-black/5'}`}><div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-xs font-black text-white">{userName.slice(0,2).toUpperCase()}</div><div><p className="text-xs font-bold">{userName}</p><p className={`text-[10px] ${textMuted}`}>Premium Member</p></div></div>
      </div>

      <div className="flex-1 pb-20 md:pb-0">
        {page==='home'&&(
          <div className="p-6 md:p-8 space-y-6">
            <div className="rounded-[32px] bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 p-[1px]"><div className="rounded-[31px] bg-gradient-to-br from-emerald-500 to-green-600 p-8"><p className="text-white/70 text-[11px] font-black uppercase">{new Date().toLocaleDateString('en-IN',{weekday:'long', day:'numeric', month:'long'})}</p><h2 className="text-4xl font-black mt-2 text-white">Hi, {userName}!</h2><p className="text-white/80 text-sm mt-2">{foodLog.filter((f:any)=> f.date && new Date(f.date).toDateString()===new Date().toDateString()).length} meals & {activityLog.filter((a:any)=> a.date && new Date(a.date).toDateString()===new Date().toDateString()).length} workouts today</p></div></div>
            <div className="grid grid-cols-3 gap-4">
              <div className={`rounded-[24px] p-5 border ${bgCard}`}><p className={`text-[10px] font-black uppercase ${textMuted}`}>Consumed</p><p className="text-2xl font-black mt-1">{consumed}</p><p className="text-[10px] text-emerald-500">{(consumed/intake*100).toFixed(0)}% of {intake}</p></div>
              <div className={`rounded-[24px] p-5 border ${bgCard}`}><p className={`text-[10px] font-black uppercase ${textMuted}`}>Active</p><p className="text-2xl font-black mt-1">{activeMin}m</p><p className="text-[10px] text-blue-500">{burned} kcal burned</p></div>
              <div className={`rounded-[24px] p-5 border ${bgCard}`}><p className={`text-[10px] font-black uppercase ${textMuted}`}>Workouts</p><p className="text-2xl font-black mt-1">{activityLog.length}</p><p className="text-[10px] text-purple-500">{groupByDate(activityLog).length} days tracked</p></div>
            </div>
            <div className="grid lg:grid-cols-2 gap-5">
              <div className={`rounded-[24px] p-6 border ${bgCard}`}><p className={`text-xs font-black uppercase mb-4 ${textMuted}`}>Last 7 Days • Activity History</p><div className="space-y-2 max-h-[300px] overflow-auto">{groupByDate(activityLog).slice(0,7).map(([date, items]:any)=>{const info=formatDay(date);return <div key={date} className={`rounded-2xl p-3 border ${bgMuted}`}><div className="flex justify-between items-center mb-2"><p className="text-xs font-black">{info.label} • {info.sub}</p><span className="text-[10px] bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full">{items.length} • {items.reduce((s:any,a:any)=>s+a.cal,0)} kcal</span></div><div className="flex gap-1.5 flex-wrap">{items.map((a:any)=><span key={a.id} className={`text-[11px] px-2.5 py-1 rounded-full border ${darkOn?'bg-[#1a2342] border-white/5':'bg-zinc-100 border-black/5'}`}>{a.icon} {a.name}</span>)}</div></div>})}</div></div>
              <div className={`rounded-[24px] p-6 border ${bgCard}`}><p className={`text-xs font-black uppercase mb-4 ${textMuted}`}>Last 7 Days • Food History</p><div className="space-y-2 max-h-[300px] overflow-auto">{groupByDate(foodLog).slice(0,7).map(([date, items]:any)=>{const info=formatDay(date);return <div key={date} className={`rounded-2xl p-3 border ${bgMuted}`}><div className="flex justify-between items-center mb-2"><p className="text-xs font-black">{info.label} • {info.sub}</p><span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">{items.length} meals • {items.reduce((s:any,f:any)=>s+f.cal,0)} kcal</span></div><div className="flex gap-1.5 flex-wrap">{items.map((f:any)=><span key={f.id} className={`text-[11px] px-2.5 py-1 rounded-full border ${darkOn?'bg-[#1a2342] border-white/5':'bg-zinc-100 border-black/5'}`}>{f.icon} {f.name}</span>)}</div></div>})}</div></div>
            </div>
          </div>
        )}

               {page==='activity'&&(
          <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
            <div className="flex justify-between items-start mb-6">
              <div><h2 className="text-[28px] font-black">Activity Log 🔥</h2><p className={`text-[13px] ${textMuted}`}>Daily tracking</p></div>
              <div className={`px-4 py-2 rounded-xl border ${bgCard}`}><p className={`text-[10px] uppercase font-bold ${textMuted}`}>Active</p><p className="text-[16px] font-black text-[#6ea8fe]">{activeMin} min</p></div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-4">
              {Array.from({length:7}).map((_,i)=>{const d=new Date(); d.setDate(d.getDate()-i); const ds=d.toDateString(); const sel=selectedDate===ds; return <button key={i} onClick={()=>setSelectedDate(ds)} className={`min-w-[74px] py-3 rounded-2xl border text-center shrink-0 ${sel?'bg-emerald-500 text-black border-emerald-500 font-black':'bg-[#101c3d] border-white/10 text-zinc-300'}`}><p className="text-[11px] font-bold uppercase">{d.toLocaleDateString('en-US',{weekday:'short'}).charAt(0)}</p><p className="text-[20px] font-black leading-none mt-1">{d.getDate()}</p><p className="text-[11px] mt-1">{activityLog.filter((a:any)=>a.date&&new Date(a.date).toDateString()===ds).length} acts</p></button>})}
            </div>
            <div className="flex flex-col lg:flex-row gap-6 mt-2">
              <div className="flex-1 space-y-5">
                <div className={`border rounded-[20px] p-6 ${bgCard}`}><p className={`text-[11px] font-black uppercase tracking-widest mb-4 ${textMuted}`}>Quick Add</p><div className="grid grid-cols-3 gap-3">{[{l:'Walking',i:'🚶',c:'100'},{l:'Running',i:'🏃',c:'150'},{l:'Cycling',i:'🚴',c:'120'},{l:'Swimming',i:'🏊',c:'200'},{l:'Yoga',i:'🧘',c:'80'},{l:'Weight',i:'🏋️',c:'180'}].map(t=><button key={t.l} onClick={()=>addActivity(t.l,t.i,parseInt(t.c),20)} className={`rounded-2xl p-4 text-left border ${bgCardInner} hover:scale-[1.02] transition`}><span className="text-[22px]">{t.i}</span><p className="text-[13px] font-bold mt-2">{t.l}</p><p className="text-[11px] text-zinc-400">{t.c} kcal</p></button>)}</div></div>
                <button onClick={()=>{const n=prompt('Activity?'); if(n) addActivity(n,'⚡',150,20)}} className="w-full bg-emerald-500 text-black font-black py-4 rounded-2xl">+ Add Custom Activity</button>
              </div>
              <div className={`w-full lg:w-[400px] lg:min-w-[400px] lg:max-w-[400px] border rounded-[20px] p-4 h-fit shrink-0 ${bgCard}`}><p className={`text-[11px] font-black uppercase mb-3 px-1 ${textMuted}`}>History by Day</p><div className="space-y-3 max-h-[700px] overflow-auto pr-1">{activityLog.length===0?<p className="text-center py-16 text-sm text-zinc-500">No activities logged today</p>:groupByDate(activityLog).map(([date, items]:any)=>{const info=formatDay(date); return <div key={date} className={`rounded-2xl p-4 border ${selectedDate===date?'border-emerald-500/30 bg-emerald-500/5': bgMuted}`}><div className="flex justify-between"><p className="text-[13px] font-black">{info.label} • {info.sub}</p><span className="text-[10px] bg-orange-500/10 text-orange-400 px-2.5 py-1 rounded-full font-bold">{items.length} • {items.reduce((s:any,a:any)=>s+a.cal,0)} kcal</span></div><div className="mt-3 space-y-2">{items.map((a:any)=><div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border text-black"><span className="text-lg">{a.icon}</span><span className="text-[13px] font-bold flex-1">{a.name}</span><span className="text-xs">{a.min}m • {a.cal} kcal</span><button onClick={()=>setActivityLog(activityLog.filter((x:any)=>x.id!==a.id))} className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px]">✕</button></div>)}</div></div>})}</div></div>
            </div>
          </div>
        )}

                {page==='food'&&(
          <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
            <div className="flex justify-between items-start mb-6">
              <div><h2 className="text-[28px] font-black">Food Log 🍎</h2><p className={`text-[13px] ${textMuted}`}>Nutrition tracking</p></div>
              <div className={`px-4 py-2 rounded-xl border ${bgCard}`}><p className={`text-[10px] uppercase font-bold ${textMuted}`}>Today</p><p className="text-[16px] font-black text-emerald-500">{foodLog.filter((f:any)=> f.date && new Date(f.date).toDateString()===new Date().toDateString()).reduce((s:any,f:any)=>s+f.cal,0)} kcal</p></div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-4">
              {Array.from({length:7}).map((_,i)=>{const d=new Date(); d.setDate(d.getDate()-i); const ds=d.toDateString(); const sel=selectedDate===ds; const cals=foodLog.filter((f:any)=>f.date&&new Date(f.date).toDateString()===ds).reduce((s:any,f:any)=>s+f.cal,0); return <button key={i} onClick={()=>setSelectedDate(ds)} className={`min-w-[74px] py-3 rounded-2xl border text-center shrink-0 ${sel?'bg-emerald-500 text-black border-emerald-500 font-black':'bg-[#101c3d] border-white/10 text-zinc-300'}`}><p className="text-[11px] font-bold uppercase">{d.toLocaleDateString('en-US',{weekday:'short'}).charAt(0)}</p><p className="text-[20px] font-black leading-none mt-1">{d.getDate()}</p><p className="text-[11px] mt-1">{cals} kcal</p></button>})}
            </div>
            <div className="flex flex-col lg:flex-row gap-6 mt-2">
              <div className="flex-1 space-y-5">
                <div className={`border rounded-[20px] p-6 ${bgCard}`}><p className={`text-[11px] font-black uppercase tracking-widest mb-4 ${textMuted}`}>Quick Add</p><div className="grid grid-cols-3 gap-3">{[{l:'Eggs',i:'🥚',c:150},{l:'Chicken',i:'🍗',c:250},{l:'Rice',i:'🍚',c:200},{l:'Apple',i:'🍎',c:80},{l:'Milk',i:'🥛',c:120},{l:'Protein',i:'💪',c:180}].map(t=><button key={t.l} onClick={()=>addFood(t.l,t.i,t.c)} className={`rounded-2xl p-4 text-left border ${bgCardInner} hover:scale-[1.02] transition`}><span className="text-[22px]">{t.i}</span><p className="text-[13px] font-bold mt-2">{t.l}</p><p className="text-[11px] text-zinc-400">{t.c} kcal</p></button>)}</div></div>
                <button onClick={()=>{const n=prompt('Food?'); if(n) addFood(n,'🍽️',200)}} className="w-full bg-emerald-500 text-black font-black py-4 rounded-2xl">+ Add Custom Food</button>
              </div>
              <div className={`w-full lg:w-[400px] lg:min-w-[400px] lg:max-w-[400px] border rounded-[20px] p-4 h-fit shrink-0 ${bgCard}`}><p className={`text-[11px] font-black uppercase mb-3 px-1 ${textMuted}`}>History by Day</p><div className="space-y-3 max-h-[700px] overflow-auto pr-1">{groupByDate(foodLog).length===0?<p className="text-center py-16 text-sm text-zinc-500">No meals yet</p>:groupByDate(foodLog).map(([date, items]:any)=>{const info=formatDay(date); return <div key={date} className={`rounded-2xl p-4 border ${selectedDate===date?'border-emerald-500/30 bg-emerald-500/5': bgMuted}`}><div className="flex justify-between"><p className="text-[13px] font-black">{info.label} • {info.sub}</p><span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-bold">{items.reduce((s:any,f:any)=>s+f.cal,0)} kcal</span></div><div className="mt-3 space-y-2">{items.map((f:any)=><div key={f.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border text-black"><span className="text-lg">{f.icon}</span><span className="text-[13px] font-bold flex-1">{f.name}</span><span className="text-xs">{f.cal} kcal</span><button onClick={()=>setFoodLog(foodLog.filter((x:any)=>x.id!==f.id))} className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px]">✕</button></div>)}</div></div>})}</div></div>
            </div>
          </div>
        )}

        {page==='profile'&&(
          <div className="p-6 md:p-8 space-y-6">
            <div className="rounded-[32px] bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 p-[1px]"><div className={`rounded-[31px] p-8 relative overflow-hidden ${darkOn?'bg-gradient-to-br from-[#1a1442] to-[#0e142b]':'bg-gradient-to-br from-white to-zinc-100'}`}><div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative"><div className="flex items-center gap-5"><div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-2xl font-black shadow-xl text-white">{userName.slice(0,2).toUpperCase()}</div><div><div className="flex items-center gap-2"><h2 className="text-3xl font-black">{userName}</h2><span className="bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[10px] font-black px-2.5 py-1 rounded-full">PREMIUM</span></div><p className={`text-sm mt-1 ${textMuted}`}>{trackedDays} days tracked • {activityLog.length} workouts • BMI {bmi}</p></div></div><button onClick={()=>setShowEdit(!showEdit)} className={`${darkOn?'bg-white text-black':'bg-black text-white'} font-black px-6 py-3 rounded-xl text-sm`}>Edit Profile</button></div></div></div>

            {showEdit&&(<div className={`border rounded-[24px] p-6 grid md:grid-cols-4 gap-4 ${bgCard}`}><div><p className={`text-[10px] uppercase font-black mb-2 ${textMuted}`}>Age</p><input type="number" value={age} onChange={e=>setAge(Number(e.target.value))} className={`w-full rounded-xl px-4 py-3 font-bold outline-none border ${darkOn?'bg-[#1a2342] border-white/10':'bg-zinc-100 border-black/5'}`}/></div><div><p className={`text-[10px] uppercase font-black mb-2 ${textMuted}`}>Weight</p><input type="number" value={weight} onChange={e=>setWeight(Number(e.target.value))} className={`w-full rounded-xl px-4 py-3 font-bold outline-none border ${darkOn?'bg-[#1a2342] border-emerald-500/30':'bg-zinc-100 border-black/5'}`}/></div><div><p className={`text-[10px] uppercase font-black mb-2 ${textMuted}`}>Height</p><input type="number" value={height} onChange={e=>setHeight(Number(e.target.value))} className={`w-full rounded-xl px-4 py-3 font-bold outline-none border ${darkOn?'bg-[#1a2342] border-white/10':'bg-zinc-100 border-black/5'}`}/></div><div><p className={`text-[10px] uppercase font-black mb-2 ${textMuted}`}>Goal</p><select value={goal} onChange={e=>setGoal(e.target.value as Goal)} className={`w-full rounded-xl px-4 py-3 font-bold outline-none border ${darkOn?'bg-[#1a2342] border-white/10':'bg-zinc-100 border-black/5'}`}><option>Lose Weight</option><option>Maintain Weight</option><option>Gain Muscle</option></select></div></div>)}

            <div className="grid lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8 space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`border rounded-[20px] p-4 ${bgCard}`}><p className={`text-[10px] uppercase font-black ${textMuted}`}>Weight</p><p className="text-xl font-black mt-1">{weight} kg</p></div>
                  <div className={`border rounded-[20px] p-4 ${bgCard}`}><p className={`text-[10px] uppercase font-black ${textMuted}`}>Height</p><p className="text-xl font-black mt-1">{height} cm</p></div>
                  <div className={`border rounded-[20px] p-4 ${bgCard}`}><p className={`text-[10px] uppercase font-black ${textMuted}`}>Burned</p><p className="text-xl font-black mt-1">{burned}</p></div>
                  <div className={`border rounded-[20px] p-4 ${bgCard}`}><p className={`text-[10px] uppercase font-black ${textMuted}`}>Eaten</p><p className="text-xl font-black mt-1">{consumed}</p></div>
                </div>

                <div className={`border rounded-[24px] p-6 ${bgCard}`}><p className={`text-xs font-black uppercase tracking-widest mb-5 ${textMuted}`}>28-Day Activity Streak</p><div className="grid grid-cols-7 gap-2">{allDates.reverse().map((d,i)=>{const ds=d.toDateString(); const active=hasActivityOnDate(ds); const colors=['from-emerald-400 to-green-600','from-blue-400 to-indigo-600','from-purple-400 to-pink-600','from-orange-400 to-red-600','from-cyan-400 to-teal-600','from-amber-400 to-yellow-600','from-pink-400 to-rose-600'];return <div key={i} className="flex flex-col items-center gap-1"><div className={`w-full aspect-square rounded-[8px] border flex items-center justify-center flex-col transition ${active?`bg-gradient-to-br ${colors[i%colors.length]} border-white/10 text-white`:'border '+ (darkOn?'bg-white/[0.03] border-white/5 text-zinc-600':'bg-black/5 border-black/5 text-zinc-400')}`}><span className="text-[10px] font-black">{d.getDate()}</span>{active&&<span className="text-[8px]">🔥</span>}</div></div>})}</div></div>
              </div>

              <div className="lg:col-span-4 space-y-5">
                <div className={`border rounded-[24px] p-6 ${bgCard}`}><p className={`text-xs font-black uppercase mb-4 ${textMuted}`}>Settings</p><div className="space-y-2">
                  <button onClick={()=>{const n=!notifOn; setNotifOn(n); if(n && typeof Notification!=='undefined'){ if(Notification.permission==='granted'){ new Notification('FitTrack',{body:'Notifications ON'})} else { Notification.requestPermission() }}}} className={`w-full flex justify-between items-center border p-3 rounded-xl transition ${darkOn?'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]':'bg-black/[0.03] border-black/5 hover:bg-black/[0.06]'}`}><span className="text-xs">Notifications</span><div className={`w-9 h-5 rounded-full flex items-center transition-all duration-300 ${notifOn?'bg-emerald-500 justify-end pr-0.5':'bg-zinc-400 justify-start pl-0.5'}`}><div className="w-4 h-4 bg-white rounded-full shadow"></div></div></button>
                  <button onClick={()=>setDarkOn(!darkOn)} className={`w-full flex justify-between items-center border p-3 rounded-xl transition ${darkOn?'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]':'bg-black/[0.03] border-black/5 hover:bg-black/[0.06]'}`}><span className="text-xs">{darkOn?'Dark Mode':'Light Mode'}</span><div className={`w-9 h-5 rounded-full flex items-center transition-all duration-300 ${darkOn?'bg-emerald-500 justify-end pr-0.5':'bg-amber-500 justify-end pr-0.5'}`}><div className="w-4 h-4 bg-white rounded-full shadow"></div></div></button>
                  <button onClick={()=>{if(confirm('Clear all data?')){localStorage.clear(); location.reload()}}} className="w-full mt-3 bg-red-500/10 border border-red-500/20 text-red-500 font-bold py-3 rounded-xl text-xs">Clear All Data</button>
                  <button onClick={()=>{localStorage.removeItem('fittrack_auth'); location.reload()}} className={`w-full border font-bold py-3 rounded-xl text-xs ${darkOn?'bg-white/5 border-white/10':'bg-black/5 border-black/10'}`}>Logout</button>
                </div></div>
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-[24px] p-5 text-black"><p className="font-black text-sm">Premium Member</p><p className="text-xs mt-1 opacity-80">{trackedDays} days journey</p></div>
              </div>
            </div>
          </div>
        )}

        <div className={`md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t flex justify-around py-3 pb-6 ${bottomNav}`}>{[{id:'home',i:'🏠',l:'Home'},{id:'food',i:'🍽️',l:'Food'},{id:'activity',i:'⚡',l:'Activity'},{id:'profile',i:'👤',l:'Profile'}].map(m=><button key={m.id} onClick={()=>setPage(m.id as Page)} className={`flex flex-col items-center ${page===m.id?'text-emerald-500':'text-zinc-500'}`}><span className={`w-8 h-8 rounded-xl flex items-center justify-center ${page===m.id?'bg-emerald-500/15':''}`}>{m.i}</span><span className="text-[10px] font-bold">{m.l}</span></button>)}</div>
      </div>
    </div>
  )
}