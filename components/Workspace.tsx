'use client';

import {useEffect, useReducer, useRef, useState} from 'react';
import Link from 'next/link';
import {ArrowLeft, ArrowUpRight, BatteryFull, BookOpen, Camera, Check, Code2, ExternalLink, Fingerprint, Github, Globe, Grip, Home, Linkedin, LockKeyholeOpen, Mail, Mic, Search, Smartphone, Terminal, TrendingUp, UserRound, Wifi, X} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {usePortfolioAccess} from '@/components/PortfolioAccess';
import {researchStudies, projects, talks} from '@/lib/portfolio-content';
import {navigateWorkspace} from '@/lib/workspace-navigation.mjs';

type Panel = 'about'|'research'|'projects'|'writing'|'speaking'|'toolkit'|'journey'|'personal'|'apps'|'connect';
type ArticlePreview = {slug:string;title:string;description:string;category:string};
type WorkspaceApp = {name:string;description:string;icon:LucideIcon;tone:string;href?:string;panel?:Panel};
const apps:WorkspaceApp[] = [
  {name:'About Me',description:'Background & experience',icon:UserRound,tone:'mint',panel:'about'},
  {name:'My Toolkit',description:'How I explore',icon:Terminal,tone:'sage',panel:'toolkit'},
  {name:'Research',description:'Follow the findings',icon:Search,tone:'lavender',panel:'research'},
  {name:'My Journey',description:'Learning, building, sharing',icon:TrendingUp,tone:'gold',panel:'journey'},
  {name:'Projects',description:'Security tools & experiments',icon:Code2,tone:'mint',panel:'projects'},
  {name:'Writing',description:'Blogs & field notes',icon:BookOpen,tone:'gold',panel:'writing'},
  {name:'Speaking',description:'Talks & workshops',icon:Mic,tone:'rose',panel:'speaking'},
  {name:'Fun Stuff',description:'A little beyond security',icon:Camera,tone:'lavender',panel:'personal'},
];
const titles:Record<Panel,string>={about:'About Me',research:'Follow the trust boundary',projects:'Built to investigate',writing:'Notes from the field',speaking:'Ideas worth discussing',toolkit:'Inside the toolkit',journey:'Always learning',personal:'Make yourself at home',apps:'Explore the workspace',connect:'Let’s connect'};

export default function Workspace({articles}:{articles:ArticlePreview[]}){
  const {unlocked} = usePortfolioAccess();
  const tablet=useRef<HTMLDivElement>(null);
  const tiltFrame=useRef<number|null>(null);
  const [windowState, dispatch]=useReducer(navigateWorkspace,{current:null,history:[]});
  const panel=windowState.current as Panel|null;
  const [mood,setMood]=useState('night');
  const dialog=useRef<HTMLDialogElement>(null);
  const opener=useRef<HTMLElement|null>(null);
  function openApp(next:Panel){dispatch({type:'open',panel:next});}
  function closeApp(){dispatch({type:'home'});}
  function goBack(){dispatch({type:'back'});}
  function tilt(event:React.PointerEvent<HTMLDivElement>){
    if(event.pointerType!=='mouse'||window.matchMedia('(prefers-reduced-motion: reduce)').matches||panel)return;
    const rect=event.currentTarget.getBoundingClientRect();
    const x=((event.clientY-rect.top)/rect.height-.5)*-1.5;const y=((event.clientX-rect.left)/rect.width-.5)*2;
    if(tiltFrame.current!==null)cancelAnimationFrame(tiltFrame.current);
    tiltFrame.current=requestAnimationFrame(()=>{tablet.current?.style.setProperty('--tilt-x',`${x}deg`);tablet.current?.style.setProperty('--tilt-y',`${y}deg`);});
  }
  function resetTilt(){if(tiltFrame.current!==null)cancelAnimationFrame(tiltFrame.current);tablet.current?.style.setProperty('--tilt-x','0deg');tablet.current?.style.setProperty('--tilt-y','0deg');}
  useEffect(()=>()=>{if(tiltFrame.current!==null)cancelAnimationFrame(tiltFrame.current)},[]);
  useEffect(()=>{
    if(panel){
      resetTilt();
      if(!dialog.current?.open){opener.current=document.activeElement as HTMLElement;dialog.current?.showModal();}
    } else {
      dialog.current?.close();
      opener.current?.focus();
    }
  },[panel]);
  function appItem(app:WorkspaceApp){const Icon=app.icon;const content=<><span className={`workspace-app-icon icon-${app.tone}`}><Icon size={33} strokeWidth={1.7}/></span><strong>{app.name}</strong><span className="workspace-app-description">{app.description}</span></>;return app.href?<Link className="workspace-app" href={app.href} key={app.name}>{content}</Link>:<button className="workspace-app" onClick={()=>openApp(app.panel!)} key={app.name}>{content}</button>;}

  return <main id="main" className={`workspace-page mood-${mood}`}>
    <div className="research-tablet" ref={tablet} onPointerMove={tilt} onPointerLeave={resetTilt}>
      <div className="tablet-stylus" aria-hidden="true"/><div className="tablet-camera" aria-hidden="true"/>
      <div className="workspace-wallpaper">
        <div className="workspace-statusbar"><span>9:41</span><div><span>ANDROID 14 · RESEARCHER OS</span><Wifi size={15}/><BatteryFull size={20}/></div></div>
        <div className="workspace-content">
          <section className="workspace-launcher" aria-labelledby="workspace-heading">
            <span className="workspace-eyebrow">WELCOME TO MY WORKSPACE</span>
            <h1 id="workspace-heading">Inside the Researcher<span>.</span></h1>
            <p className="workspace-welcome">{unlocked?'You bypassed the checks. Now explore the person':'Explore the person'}<br className="desktop-break"/> behind the research, the tools, and the stories.</p><p className="workspace-help">Choose an app below to explore. Use Home to return here.</p>
            <nav className="workspace-apps" aria-label="Portfolio apps">{apps.map(appItem)}</nav>
            <div className="workspace-personal-note"><span className="note-tape"/><p>Same curiosity.<br/>Different targets.<br/>Always learning.</p><span>— Puja</span></div>
          </section>
          <aside className="workspace-widgets" aria-label="About this workspace">
            <section className="workspace-security"><Smartphone className="workspace-android" size={35}/><div><h2>Security checks</h2><p><span>Root detection</span><b>{unlocked?<>Bypassed <Check size={12}/></>:<>Not run</>}</b></p><p><span>SSL pinning</span><b>{unlocked?<>Bypassed <Check size={12}/></>:<>Not run</>}</b></p></div><div className="workspace-access"><span>Access level</span><strong>{unlocked?'RESEARCHER':'VISITOR'} <LockKeyholeOpen size={17}/></strong></div></section>
            <section className="workspace-intro"><div className="workspace-widget-label"><span>Quick Intro</span><button onClick={()=>openApp('about')} aria-label="Read more about Puja"><ArrowUpRight size={16}/></button></div><h2>I’m Puja.<span className="workspace-cursor">_</span></h2><p>I explore how mobile applications work—and where their security breaks down. This is where I turn that curiosity into practical research, tools, and writeups.</p><div className="workspace-interests">{['Mobile Security','Reverse Engineering','Web & API Security','Tool Development','Security Research'].map(t=><span key={t}>{t}</span>)}</div></section>
            <figure className="workspace-quote"><span aria-hidden="true">“</span><blockquote>Curiosity finds the cracks.<br/>Research turns them into understanding.</blockquote><button onClick={()=>openApp('research')} aria-label="Explore research"><ArrowUpRight size={18}/></button></figure>
          </aside>
        </div>
        <nav className="workspace-dock" aria-label="Workspace shortcuts">
          <button onClick={()=>openApp('apps')} aria-label="All apps" title="All apps"><Grip size={27}/></button>
          <button onClick={()=>openApp('writing')} aria-label="Browse writing" title="Browse writing" className="dock-browser"><Globe size={26}/></button>
          <Link href="/" aria-label="Return to the terminal challenge" title="Terminal" className="dock-terminal"><Terminal size={24}/></Link>
          <button onClick={()=>openApp('projects')} aria-label="Explore projects" title="Projects" className="dock-code"><Code2 size={25}/></button>
          <button onClick={()=>openApp('connect')} aria-label="GitHub and contact profiles" title="GitHub"><Github size={27}/></button>
          <Link href="/contact/" aria-label="Contact Puja" title="Contact" className="dock-linkedin"><Linkedin size={24}/></Link>
        </nav>
        <button className="workspace-home-indicator" aria-label="Tablet home" onClick={closeApp}/>
      </div>
    </div>
    <dialog ref={dialog} className="workspace-dialog" aria-labelledby="workspace-dialog-title" onCancel={closeApp} onClick={e=>{if(e.target===e.currentTarget)closeApp()}}>
      <div className="workspace-dialog-inner"><div className="workspace-dialog-top"><span className="workspace-eyebrow">RESEARCHER OS</span><div className="android-window-controls"><button onClick={goBack} aria-label="Back" title="Back"><ArrowLeft size={18}/></button><button onClick={closeApp} aria-label="Home" title="Home"><Home size={18}/></button><button onClick={closeApp} aria-label="Close window" title="Close"><X size={21}/></button></div></div><h2 id="workspace-dialog-title">{panel?titles[panel]:''}</h2>
      {panel==='about'&&<div className="workspace-about-content"><p className="dialog-lead">I’m Puja. My focus is mobile application security, reverse engineering, and making complex security ideas easier to understand.</p><h3>Understanding what’s underneath.</h3><p>This portfolio is a place for hands-on exploration: following application behavior, questioning trust boundaries, and turning findings into clear technical writing.</p><p>My areas of interest include Android runtime instrumentation, application hardening, and the APIs that connect mobile experiences.</p><h3>How I approach research</h3><p>Observe the system. Build a small, reproducible test. Understand the root cause. Share what helps others build more securely.</p><p className="workspace-small-note">Professional roles and experience have not been added yet.</p><button className="workspace-modal-link" onClick={()=>openApp('journey')}>Explore my journey <ArrowUpRight size={15}/></button></div>}
      {panel==='research'&&<><p className="dialog-lead">Reproducible explorations of mobile application behavior. These starter studies use fictional lab targets.</p><div className="workspace-content-list">{researchStudies.map(([n,t,d,slug])=><Link href={`/blog/${slug}/`} key={n}><span>LAB STUDY / {n}</span><h3>{t}</h3><p>{d}</p><ArrowUpRight size={15}/></Link>)}</div><Link className="workspace-modal-link" href="/research/">Open the Research page <ExternalLink size={15}/></Link></>}
      {panel==='writing'&&<><p className="dialog-lead">Technical blogs and field notes. Open an article for the full reading experience.</p><div className="workspace-content-list">{articles.map(a=><Link href={`/blog/${a.slug}/`} key={a.slug}><span>{a.category}</span><h3>{a.title}</h3><p>{a.description}</p><ArrowUpRight size={15}/></Link>)}</div><Link className="workspace-modal-link" href="/blog/">Open all writing & search <ExternalLink size={15}/></Link></>}
      {panel==='projects'&&<><p className="dialog-lead">Small, focused tools for understanding applications. Unreleased project concepts are marked below.</p><div className="workspace-content-list">{projects.map(([n,t,d,tech,url,cta])=><section key={n}><span>{tech}</span><h3>{t}</h3><p>{d}</p>{url?<Link href={url}>{cta} ↗</Link>:<small>{cta}</small>}</section>)}</div><Link className="workspace-modal-link" href="/projects/">Open the Projects page <ExternalLink size={15}/></Link></>}
      {panel==='speaking'&&<><p className="dialog-lead">No confirmed appearances have been added. These session outlines are sample proposals, not past conference credits.</p><div className="workspace-content-list">{talks.map(([l,t,d])=><section key={t}><span>{l}</span><h3>{t}</h3><p>{d}</p></section>)}</div><Link className="workspace-modal-link" href="/speaking/">Open Speaking & workshops <ExternalLink size={15}/></Link></>}
      {panel==='toolkit'&&<><p className="dialog-lead">A practical workflow, from first observation to a reproducible finding.</p><div className="toolkit-list">{[['01','Inspect','Read the manifest, map entry points, and follow code paths.','Android Studio · JADX'],['02','Observe','Understand what the app does while it runs.','Frida · adb · logcat'],['03','Investigate','Trace the requests connecting mobile clients and APIs.','Burp Suite · test accounts'],['04','Document','Turn evidence into clear, reproducible field notes.','Python · Markdown · Git']].map(([n,t,d,tools])=><div key={n}><span>{n}</span><section><h3>{t}</h3><p>{d}</p><code>{tools}</code></section></div>)}</div><Link className="workspace-modal-link" href="/projects/">Explore tools & projects <ArrowUpRight size={15}/></Link></>}
      {panel==='journey'&&<><p className="dialog-lead">A workspace built around three habits.</p><p className="workspace-small-note">Career dates, achievements, and conference appearances have not been added yet. These are research principles, not a professional timeline.</p><div className="journey-list"><section><span>01 / LEARN</span><h3>Ask better questions.</h3><p>Understand the platform, challenge assumptions, and keep a notebook of what is still unclear.</p></section><section><span>02 / BUILD</span><h3>Make ideas testable.</h3><p>Small experiments help connect a theory to application behavior.</p></section><section><span>03 / SHARE</span><h3>Leave useful field notes.</h3><p>Write down the steps, the evidence, and the limitations so someone else can learn too.</p></section></div><Link className="workspace-modal-link" href="/speaking/">Talks & workshops <ArrowUpRight size={15}/></Link></>}
      {panel==='personal'&&<><p className="dialog-lead">A quiet desk, a mountain view, and room for the next idea. Choose the atmosphere for this workspace.</p><div className="wallpaper-options">{[['night','Nightfall','Cool, quiet, and focused.'],['warm','Lamplight','A little warmth for late-night reading.']].map(([value,name,desc])=><button key={value} aria-pressed={mood===value} onClick={()=>setMood(value)} className={mood===value?'active':''}><span className={`mood-preview preview-${value}`}/><strong>{name} {mood===value?'✓':''}</strong><span>{desc}</span></button>)}</div><p className="workspace-small-note">Stay curious. Take a break. Come back with a better question.</p></>}
      {panel==='apps'&&<nav className="workspace-apps modal-apps" aria-label="All portfolio apps">{apps.map(appItem)}</nav>}
      {panel==='connect'&&<><p className="dialog-lead">For collaboration, research conversations, and thoughtful questions.</p><p className="workspace-small-note">Personal GitHub and LinkedIn profile links haven’t been added yet.</p><Link className="workspace-modal-link" href="/contact/"><Mail size={16}/> Open contact details <ArrowUpRight size={15}/></Link></>}
      </div>
    </dialog>
  </main>;
}
