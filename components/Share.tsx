'use client';
import {useState} from 'react';export default function Share(){const[copied,setCopied]=useState(false);return <button className="outline" onClick={async()=>{try{await navigator.clipboard.writeText(window.location.href);setCopied(true)}catch{window.prompt('Copy article link',window.location.href)}}}>{copied?'Link copied ✓':'Copy article link ↗'}</button>}
