'use client';
import Link from 'next/link';
import {useState} from 'react';
import {Menu,X,ShoppingBag} from 'lucide-react';
export default function SiteNav(){const [open,setOpen]=useState(false);return <header className="header"><div className="shell nav"><Link className="brand" href="/">VTS <b>Vogue Tawala Sky</b><small>WINES · SPIRITS · MIXERS</small></Link><nav id="site-nav" className={'navlinks '+(open?'navlinksOpen':'')} aria-label="Main navigation"><Link href="/" onClick={()=>setOpen(false)}>Home</Link><Link href="/shop" onClick={()=>setOpen(false)}>Shop</Link><Link href="/experience" onClick={()=>setOpen(false)}>Experience</Link></nav><div className="navActions"><button className="menuButton" aria-controls="site-nav" aria-expanded={open} aria-label="Toggle menu" onClick={()=>setOpen(!open)}>{open?<X size={21}/>:<Menu size={21}/>}</button><Link className="cartButton" href="/shop" aria-label="Visit shop and basket"><ShoppingBag size={20}/></Link></div></div></header>}
