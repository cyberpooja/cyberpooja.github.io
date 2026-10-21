'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {usePortfolioAccess} from '@/components/PortfolioAccess';
import {ArrowRight, BatteryFull, Check, Copy, Terminal, Wifi} from 'lucide-react';
import {commands, validateCommand} from '@/lib/challenge.mjs';

const startup = `[!] SECURITY ALERT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DEVICE INTEGRITY CHECK: FAILED

[✗] Root Access Detected
[✗] SSL Certificate Pinning Enabled
[✗] Untrusted Environment Detected

PORTFOLIO ACCESS: DENIED 🔒

Welcome to a security researcher's
environment.

Want to know who's behind this device?

Prove your Android pentesting skills.

> STEP 01: Bypass Root Detection
> STEP 02: Bypass SSL Pinning

Use Frida commands in the terminal below
to bypass both security checks.

Two bypasses. One portfolio.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ SYSTEM AWAITING YOUR EXPLOIT ]`;

type Line = {text:string; tone?:'error'|'ok'|'command'|'muted'};
export default function Challenge() {
  const router = useRouter();
  const {unlock} = usePortfolioAccess();
  function enterPortfolio(){unlock();router.replace('/portfolio/');}
  const [stage, setStage] = useState(0);
  const [typed, setTyped] = useState(0);
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<Line[]>([]);
  const [busy, setBusy] = useState(false);
  const [showBoot, setShowBoot] = useState(true);
  const [copied, setCopied] = useState<number|null>(null);
  const [copyError, setCopyError] = useState('');
  const [tilt, setTilt] = useState({x:0,y:0});
  const field = useRef<HTMLInputElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const history = useRef<string[]>([]);
  const historyIndex = useRef(0);
  const draft = useRef('');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const running = useRef(false);
  const finished = typed >= startup.length;
  function later(fn:()=>void, delay:number) { timers.current.push(setTimeout(fn,delay)); }
  function append(line:Line) { setLogs(l=>[...l.slice(-149),line]); }

  useEffect(()=>{
    if(finished)return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setTyped(startup.length);return;}
    const timer=setInterval(()=>setTyped(n=>Math.min(startup.length,n+8)),18);
    return ()=>clearInterval(timer);
  },[finished]);
  useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
  useEffect(()=>{if(viewport.current)viewport.current.scrollTop=viewport.current.scrollHeight;},[typed,logs]);
  useEffect(()=>{if(finished&&!busy&&stage<2)field.current?.focus({preventScroll:true});},[finished,busy,stage]);

  async function copy(index:number) {
    try { await navigator.clipboard.writeText(commands[index]);setCopied(index);setCopyError('');later(()=>setCopied(null),1800); }
    catch { setCopyError('Clipboard unavailable. Select the command to copy, or choose Use command.'); }
  }
  function run(event:React.FormEvent) {
    event.preventDefault();
    if(running.current||stage===2||!finished||!input.trim())return;
    const command=input.trim();
    history.current.push(command);historyIndex.current=history.current.length;draft.current='';setInput('');
    append({text:`android@emulator:~$ ${command}`,tone:'command'});
    if(command==='clear'){setLogs([]);setShowBoot(false);return;}
    if(command==='help'){
      append({text:'Built-ins: help · clear · history · status',tone:'muted'});
      append({text:'↑ / ↓ recall commands. Enter executes. All output is simulated.'});
      commands.forEach((c,i)=>append({text:`STEP 0${i+1}: ${c}`}));return;
    }
    if(command==='history'){history.current.forEach((c,i)=>append({text:`${i+1}  ${c}`,tone:'muted'}));return;}
    if(command==='status'){append({text:`Root detection: ${stage>0?'BYPASSED':'DETECTED'} | SSL pinning: ${stage===2?'BYPASSED':'ENABLED'}`,tone:stage>0?'ok':'error'});return;}
    if(stage===1&&validateCommand(command,0)){append({text:'[✓] Root Detection Bypassed already. Continue with ssl-bypass.js.',tone:'ok'});return;}
    if(stage===0&&validateCommand(command,1)){append({text:'[!] Root check blocks initialization. Complete STEP 01 first.',tone:'error'});return;}
    if(!validateCommand(command,stage)){append({text:'[!] Command rejected. Type help or use a bundled Frida command. No system commands are executed.',tone:'error'});return;}
    running.current=true;setBusy(true);
    const root=stage===0;
    const output:Line[]=[
      {text:'[Frida / simulated] Connected to emulator-5554 over USB',tone:'muted'},
      {text:"Spawning `com.lab.vault`… Resuming main thread.",tone:'muted'},
      {text:`[+] Loaded ${root?'root-bypass.js':'ssl-bypass.js'}; Java.perform() ready`,tone:'ok'},
      {text:root?'[hook] com.lab.vault.RootCheck.isRooted() → false':'[hook] okhttp3.CertificatePinner.check(String, List) → return',tone:'ok'},
      {text:root?'I/Vault(4242): Device integrity gate passed':'I/OkHttp(4242): Lab TLS connection accepted',tone:'muted'},
      {text:root?'[✓] Root Detection Bypassed':'[✓] SSL Pinning Bypassed',tone:'ok'},
      {text:root?'E/Vault(4242): SSLPeerUnverifiedException: Certificate pinning failure!':'[✓] Both simulated checks bypassed. PORTFOLIO ACCESS: GRANTED',tone:root?'error':'ok'}
    ];
    output.forEach((line,i)=>later(()=>append(line),220+i*260));
    later(()=>{setStage(root?1:2);setBusy(false);running.current=false;if(!root)later(enterPortfolio,2400);},220+output.length*260);
  }

  return <section className="terminal-landing" aria-label="Interactive Android security assessment">
    <div className="emulator-perspective" onPointerMove={e=>{if(e.pointerType!=='mouse')return;const r=e.currentTarget.getBoundingClientRect();setTilt({x:(e.clientY-r.top-r.height/2)/200,y:(e.clientX-r.left-r.width/2)/230});}} onPointerLeave={()=>setTilt({x:0,y:0})}>
      <div className={`security-device ${stage===2?'device-unlocked':''}`} style={{transform:`rotateX(${-tilt.x}deg) rotateY(${tilt.y}deg)`}}>
        <div className="device-camera"/>
        <div className="device-status"><span>9:41</span><span>ANDROID 14 · EMULATOR-5554</span><div><Wifi size={13}/><BatteryFull size={17}/></div></div>
        <div className="security-screen">
          <div className="security-titlebar"><span><Terminal size={16}/> vault / security console</span><span className={stage===2?'security-green':'security-red'}>{stage===2?'UNLOCKED':'RESTRICTED'}</span></div>
          <div className="security-workspace">
            <div className="console-panel">
              <div className="console-scroll" ref={viewport} tabIndex={0} aria-label="Terminal output">
                {showBoot&&<div className="boot-output" aria-label={startup}><div aria-hidden="true">{startup.slice(0,typed).split('\n').map((line,i)=><div key={i} className={/SECURITY ALERT|FAILED|\[✗\]|DENIED/.test(line)?'security-red':line.startsWith('>')||line.includes('AWAITING')?'security-green':''}>{line||'\u00a0'}</div>)}{!finished&&<span className="terminal-cursor">▌</span>}</div></div>}
                <div role="log" aria-live="polite" aria-relevant="additions">{logs.map((l,i)=><div className={`console-line tone-${l.tone||'default'}`} key={i}>{l.text}</div>)}</div>
              </div>
              {!finished?<button className="finish-boot" onClick={()=>setTyped(startup.length)}>Skip startup animation →</button>:<form className="security-prompt" onSubmit={run}>
                <label htmlFor="android-command">android@emulator:~$</label><div className="prompt-entry"><input id="android-command" ref={field} aria-label="Android terminal command" aria-describedby="terminal-shortcuts" autoComplete="off" autoCapitalize="off" spellCheck={false} value={input} disabled={busy||stage===2} placeholder={busy?'Running your command…':stage===2?'Access granted':'Use a command from the instructions'} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{
                  if(e.key!=='ArrowUp'&&e.key!=='ArrowDown')return;e.preventDefault();
                  if(historyIndex.current===history.current.length)draft.current=input;
                  historyIndex.current=Math.max(0,Math.min(history.current.length,historyIndex.current+(e.key==='ArrowUp'?-1:1)));
                  setInput(historyIndex.current===history.current.length?draft.current:history.current[historyIndex.current]);
                }}/><button disabled={busy||stage===2||!input.trim()} aria-label="Execute command"><ArrowRight size={17}/></button></div>
              </form>}
              <div className="console-bottom" id="terminal-shortcuts"><span>{busy?'● HOOK IN PROGRESS':stage===2?'● SESSION VERIFIED':''}</span><span>↑↓ history · Enter run</span></div>
            </div>
            <aside className="challenge-guide"><span className="eyebrow">START HERE</span><h1>Break the checks.<br/>Meet the researcher.</h1><p>No technical experience needed. Complete two quick steps to open my portfolio.</p><ol className="visitor-steps"><li>Click <strong>Use command</strong> in Step 1. This fills in the terminal for you.</li><li>Press <strong>Enter</strong> or tap the arrow beside the command. Wait for the success message.</li><li>Repeat with <strong>Step 2</strong>. My portfolio will open automatically.</li></ol>
              {commands.map((command,i)=><div className={`command-guide ${stage>i?'guide-complete':''}`} key={command}><div className="guide-step"><span>STEP {i+1} / {i===0?'FIRST CHECK':'FINAL CHECK'}</span>{stage>i?<Check size={15}/>:<span>{stage===i?'YOUR TURN':'UP NEXT'}</span>}</div><p>{stage>i?'Done! Check passed.':i===0?'Start here: click Use command, then press Enter.':stage===0?'Finish Step 1 first. Then use this command the same way.':'Almost there! Click Use command, then press Enter to open the portfolio.'}</p><code>{command}</code><div className="guide-actions"><button onClick={()=>copy(i)}><Copy size={12}/>{copied===i?'Copied':'Copy'}</button><button disabled={!finished||busy||stage!==i} onClick={()=>{setInput(command);field.current?.focus();}}>Use command ↗</button></div></div>)}
              {copyError&&<p role="status" className="security-red">{copyError}</p>}
            </aside>
          </div>
          {stage===2&&<div className="access-overlay" role="status"><div className="unlock-symbol"><Check size={35}/></div><span>ASSESSMENT COMPLETE</span><h2>ACCESS GRANTED</h2><p>Both checks passed. Opening my portfolio…</p><button onClick={enterPortfolio}>Enter portfolio <ArrowRight size={16}/></button></div>}
        </div><div className="device-navigation"><span/></div>
      </div>
    </div>
  </section>;
}
