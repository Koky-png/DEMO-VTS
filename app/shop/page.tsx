'use client';
import {useEffect,useMemo,useState} from 'react';
import {ShoppingBag,Search,Minus,Plus,X,ArrowRight,ShieldCheck,Menu} from 'lucide-react';
import {categories,exampleMixers} from '../../lib/catalog';
import type {Product} from '../../lib/catalog';
import {supabase} from '../../lib/supabase';
import {rumShowcase} from '../../lib/rum-showcase';
import {newCollectionPhotos} from '../../lib/new-collection-photos';
import {additionalPhotos} from '../../lib/additional-photos';
import {softDrinks} from '../../lib/soft-drinks';

type CartItem={id:string;qty:number};
type CatalogCard={key:string;name:string;category:string;image:string|null;size:string|null;price:number|null;stock:number;product:Product|null};
const photoCatalog:CatalogCard[]=[
 ...rumShowcase.map((p,i)=>({key:`rum-photo-${i}`,name:p.name,category:'rum',image:p.image,size:null,price:null,stock:0,product:null})),
 ...newCollectionPhotos.map((p,i)=>({key:`${p.category}-photo-${i}`,name:p.name,category:p.category,image:p.image,size:null,price:null,stock:0,product:null})),
 ...additionalPhotos.map((p,i)=>({key:`extra-photo-${i}`,name:p.name,category:p.category,image:p.image,size:null,price:null,stock:0,product:null})),
 ...softDrinks.map((p,i)=>({key:`soft-drink-${i}`,name:p.name,category:p.category,image:p.image,size:p.size,price:null,stock:0,product:null})),
];
// Demonstration catalog only. No prices or stock values below represent store inventory.
const demoPricesByCategory:Record<string,number>={
 whisky:2800,vodka:1400,gin:2100,rum:1650,tequila:3200,
 spirits:650,'brandy-cognac':2400,liqueurs:2100,
 'beer-cider':300,mixers:650,'soft-drinks':180,
 wine:2000,'champagne-sparkling':4500
};
const demoOverrides:Record<string,number>={
 'jameson irish whiskey':2800,'johnnie walker black label':5200,
 'captain morgan spiced gold':1650,'don julio blanco':8500,
 'hennessy vs':6200,'bombay sapphire':3200,
 'smirnoff vodka':1400,'baileys original':2900,
 'tequila rose strawberry cream':2500,'candy floss sweet white wine':1500,'four cousins natural sweet white':1400,'tusker lager':250,
 'heineken':300,'dormans lime syrup':750,
};
function demoPrice(name:string,category:string,index:number){
 const soft=softDrinks.find(p=>p.name===name); if(soft) return soft.priceKes;
 const key=name.trim().toLowerCase();
 if(demoOverrides[key])return demoOverrides[key];
 const base=demoPricesByCategory[category]??1200;
 if(category==='beer-cider') return base+((index%4)*50);
 return Math.round((base*(0.8+(index%5)*0.15))/50)*50;
}
const demoItems:Product[]=photoCatalog.map((p,i)=>({
 id:p.key,name:p.name,category:p.category,price_kes:demoPrice(p.name,p.category,i),
 size_label:p.size??'Size to confirm',stock_quantity:12,image_url:p.image,
 active:true,description:'Demo catalog item — sample price and stock only'
}));
function isCartItem(value:unknown):value is CartItem {
 if(!value||typeof value!=='object')return false;
 const item=value as Record<string,unknown>;
 return typeof item.id==='string'&&Number.isSafeInteger(item.qty)&&typeof item.qty==='number'&&item.qty>0;
}
export default function Home(){
 const [gate,setGate]=useState(true);
 const [category,setCategory]=useState('all');
 const [query,setQuery]=useState('');
 const [items,setItems]=useState<Product[]>([]);
 const [cart,setCart]=useState<CartItem[]>([]);
 const [cartOpen,setCartOpen]=useState(false);
 const [menuOpen,setMenuOpen]=useState(false);
 const [loading,setLoading]=useState(true);
 const [notice,setNotice]=useState('');
 const [hydrated,setHydrated]=useState(false);
 useEffect(()=>{
  try {
   setGate(sessionStorage.getItem('adult-confirmed')!=='yes');
   const stored:unknown=JSON.parse(localStorage.getItem('shop-cart')||'[]');
   if(Array.isArray(stored))setCart(stored.filter(isCartItem));
  }catch{setCart([])}
  const selected=new URLSearchParams(window.location.search).get('category'); if(selected&&categories.some(c=>c.slug===selected))setCategory(selected); setHydrated(true);
 },[]);
 useEffect(()=>{
  if(!hydrated)return;
  try{localStorage.setItem('shop-cart',JSON.stringify(cart))}catch{/* Storage can be unavailable */}
 },[cart,hydrated]);
 useEffect(()=>{
   // Showcase pricing is intentionally isolated from real payment and stock systems.
   setItems(demoItems);
   setLoading(false);
   setNotice('Preview mode: prices and stock are fictional; checkout is disabled.');
 },[]);
 const cards=useMemo<CatalogCard[]>(()=>{
  const live=items.map(p=>({key:p.id,name:p.name,category:p.category,image:p.image_url,size:p.size_label,price:Number(p.price_kes),stock:p.stock_quantity,product:p}));
  
  return live;
 },[items]);
 const visible=useMemo(()=>cards.filter(p=>(category==='all'||p.category===category)&&`${p.name} ${p.product?.description||''}`.toLowerCase().includes(query.trim().toLowerCase())),[cards,category,query]);
 const cartRows=cart.flatMap(c=>{const p=items.find(x=>x.id===c.id);return p?[{id:c.id,qty:Math.min(c.qty,Math.max(0,p.stock_quantity)),p}]:[]}).filter(r=>r.qty>0);
 const total=cartRows.reduce((sum,r)=>sum+r.qty*Number(r.p.price_kes),0);
 const itemCount=cartRows.reduce((sum,r)=>sum+r.qty,0);
 function add(p:Product){
  if(!Number.isFinite(Number(p.price_kes))||Number(p.price_kes)<=0||p.stock_quantity<=0)return;
  setCart(prev=>{
   const current=prev.find(x=>x.id===p.id);
   return current?prev.map(x=>x.id===p.id?{...x,qty:Math.min(x.qty+1,p.stock_quantity)}:x):[...prev,{id:p.id,qty:1}];
  });
  setCartOpen(true);
 }
 function qty(id:string,amount:number){
  const product=items.find(p=>p.id===id);
  const maximum=product?.stock_quantity??0;
  setCart(prev=>prev.map(x=>x.id===id?{...x,qty:Math.min(Math.max(0,amount),maximum)}:x).filter(x=>x.qty>0));
 }
 function chooseCategory(value:string){setCategory(value);document.getElementById('shop')?.scrollIntoView({behavior:'smooth'});}
 return <>
 <header className="header"><div className="shell nav"><a className="brand" href="/">VTS <b>Vogue Tawala Sky</b><small>WINES · SPIRITS · MIXERS</small></a><nav id="site-nav" className={"navlinks "+(menuOpen?"navlinksOpen":"")} aria-label="Main navigation"><a href="/" onClick={()=>setMenuOpen(false)}>Home</a><a href="/shop" onClick={()=>setMenuOpen(false)}>Shop</a><a href="/experience" onClick={()=>setMenuOpen(false)}>The VTS Experience</a></nav><div className="navActions"><button className="menuButton" onClick={()=>setMenuOpen(v=>!v)} aria-label={menuOpen?"Close menu":"Open menu"} aria-expanded={menuOpen} aria-controls="site-nav">{menuOpen?<X size={21}/>:<Menu size={21}/>}</button><button className="cartButton" onClick={()=>{setMenuOpen(false);setCartOpen(true)}} aria-label={`Open basket with ${itemCount} items`}><ShoppingBag size={20}/> <span>{itemCount}</span></button></div></div></header>
 <section className="hero shopHero"><div className="shell heroInner"><p className="eyebrow">VOGUE TAWALA SKY · UTAWALA</p><h1>Find your<br/><i>favourites.</i></h1><p>Explore your favourite spirits, wines, beers and mixers. Carefully selected, all in one place.</p><a href="#categories" className="primary">Browse the collection <ArrowRight size={17}/></a><div className="heroNote">18+ only · Availability and delivery subject to store approval</div></div></section>
 <section className="shell section" id="categories"><div className="sectionHead"><div><p className="eyebrow dark">DISCOVER</p><h2>Shop by category</h2></div><p>Explore by spirit, flavour, or favourite brand.</p></div><div className="categories">{categories.map(c=><button key={c.slug} className={'category '+(category===c.slug?'selected':'')} onClick={()=>{chooseCategory(c.slug)}}><span className="categoryEmoji">{c.symbol}</span><strong>{c.name}</strong><small>{c.detail}</small></button>)}</div></section>
 <section className="shelf" id="shop"><div className="shell section">
  <div className="sectionHead"><div><p className="eyebrow dark">THE COLLECTION</p><h2>{category==='all'?'Explore our shelves':categories.find(c=>c.slug===category)?.name||'Explore our shelves'}</h2><p className="demoPriceLabel">DEMO STORE · SAMPLE PRICES</p></div>
   <div className="search"><Search size={17}/><input aria-label="Search products" placeholder="Search drinks..." value={query} onChange={e=>setQuery(e.target.value)}/></div></div>
  <div className="filters"><button className={category==='all'?'active':''} onClick={()=>chooseCategory('all')}>All products</button>{categories.map(c=><button key={c.slug} className={category===c.slug?'active':''} onClick={()=>chooseCategory(c.slug)}>{c.name}</button>)}</div>
  {notice&&<p className="muted" role="status">{notice}</p>}
  {loading?<p className="muted" role="status">Checking current inventory…</p>:null}
  {visible.length?<div className="products">{visible.map(p=><article className="product" key={p.key}><div className="productVisual">{p.image?<img src={p.image} alt={p.name} loading="lazy"/>:<span>{categories.find(c=>c.slug===p.category)?.symbol||'🍾'}</span>}</div><div className="productBody"><small>{categories.find(c=>c.slug===p.category)?.name||p.category} · {p.size||'Size to confirm'}</small><h3>{p.name}</h3><div className="productBottom">{p.product&&p.price!==null&&Number.isFinite(p.price)&&p.price>0?<strong><small className="demoPriceTag">DEMO</small> KSh {p.price.toLocaleString('en-KE')}</strong>:<strong>Price pending</strong>}{p.product&&p.price!==null&&p.price>0?<button disabled={p.stock<=0} onClick={()=>p.product&&add(p.product)}>{p.stock>0?'Add +':'Sold out'}</button>:<span className="muted">Preview only</span>}</div></div></article>)}</div>:<div className="empty"><strong>{query?'No matching products found':'No products in this category yet.'}</strong><p>Try a different category or search term. More products can be added to the catalog files.</p></div>}
 </div></section>
 <section className="shell section" id="about"><div className="twoCols"><div><p className="eyebrow dark">DON'T FORGET THE MIXERS</p><h2>Everything for the perfect pour.</h2><p className="muted">Sodas, juices and energy drinks live in Soft Drinks. Syrups and cocktail essentials live in Mixers.</p></div><div className="mixerTags">{exampleMixers.map(m=><span key={m}>{m}</span>)}</div></div></section>
 <footer><div className="shell footerInner"><strong>VTS · Vogue Tawala Sky</strong><p>Visit VTS in Utawala, opposite Ballmaina Shell when approaching from Ruai. Confirm hours and delivery eligibility before launch.</p><a href="/admin">Store admin</a></div></footer>
 {cartOpen&&<div className="overlay" onClick={()=>setCartOpen(false)}><aside className="drawer" role="dialog" aria-modal="true" aria-label="Shopping basket" onClick={e=>e.stopPropagation()}><div className="drawerTop"><h2>Your basket</h2><button onClick={()=>setCartOpen(false)} aria-label="Close cart"><X/></button></div><div className="drawerRows">{!cartRows.length?<p>Your basket is empty.</p>:cartRows.map(r=><div key={r.id} className="cartRow"><div><strong>{r.p.name}</strong><small>{r.p.size_label||''}</small><p>KSh {(Number(r.p.price_kes)*r.qty).toLocaleString('en-KE')}</p></div><div className="qty"><button onClick={()=>qty(r.id,r.qty-1)} aria-label="Decrease"><Minus size={15}/></button>{r.qty}<button onClick={()=>qty(r.id,r.qty+1)} aria-label="Increase"><Plus size={15}/></button></div></div>)}</div><div className="drawerBottom"><div className="subtotal">Subtotal <b>KSh {total.toLocaleString('en-KE')}</b></div><p className="muted">Demo basket only. Prices and stock are fictional; checkout is disabled until verified store information, inventory, legal permissions and payment credentials are configured.</p><button className="checkout" disabled>Demo only · Checkout disabled</button></div></aside></div>}
 {gate&&<div className="gate"><div className="gateBox"><div className="gateIcon"><ShieldCheck size={29}/></div><p className="eyebrow dark">WELCOME</p><h2>Are you 18 or older?</h2><p>Alcohol purchases are restricted to adults. Age and identity must also be verified at checkout and delivery.</p><button className="primary" onClick={()=>{sessionStorage.setItem('adult-confirmed','yes');setGate(false)}}>Yes, I am 18 or older</button><button className="underButton" onClick={()=>window.location.assign('https://www.google.com/')}>No, leave this site</button><small>This confirmation alone does not constitute identity verification.</small></div></div>}
 </>;
}
