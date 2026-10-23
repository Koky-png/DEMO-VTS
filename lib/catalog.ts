export const categories = [
 {slug:'whisky',name:'Whisky',detail:'Scotch, bourbon, Irish and blends',symbol:'🥃'},
 {slug:'vodka',name:'Vodka',detail:'Classic and flavoured',symbol:'❄️'},
 {slug:'gin',name:'Gin',detail:'Dry, pink and botanical',symbol:'🌿'},
 {slug:'rum',name:'Rum',detail:'White, spiced and dark',symbol:'🍹'},
 {slug:'tequila',name:'Tequila',detail:'Blanco, reposado and añejo',symbol:'🌵'},
 {slug:'spirits',name:'Local Spirits',detail:'Kenyan and regional spirits',symbol:'🍶'},
 {slug:'brandy-cognac',name:'Brandy & Cognac',detail:'Brandy, VS, VSOP and XO',symbol:'🍂'},
 {slug:'wine',name:'Wine',detail:'Red, white and rosé',symbol:'🍷'},
 {slug:'beer-cider',name:'Beer & Cider',detail:'Lagers, stouts, craft and cider',symbol:'🍺'},
 {slug:'champagne-sparkling',name:'Champagne & Sparkling',detail:'Sparkling wine and champagne',symbol:'🥂'},
 {slug:'liqueurs',name:'Liqueurs',detail:'Cream, coffee and herbal',symbol:'🍫'},
 {slug:'mixers',name:'Mixers',detail:'Syrups, tonic water and cocktail essentials',symbol:'🧊'},
 {slug:'soft-drinks',name:'Soft Drinks',detail:'Sodas, juices and energy drinks',symbol:'🥤'},
] as const;
export type Product = {id:string; name:string;category:string;price_kes:number;size_label:string|null;stock_quantity:number;image_url:string|null;active:boolean;description:string|null};
export const exampleMixers = ['Tonic water','Ginger ale','Cola','Lemon-lime soda','Soda water','Ginger beer','Orange juice','Pineapple juice','Cranberry juice','Energy drinks','Bottled water','Cocktail syrups','Ice'];
