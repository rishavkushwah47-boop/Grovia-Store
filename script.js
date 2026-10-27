/* Grovia Store starter interactions.
   IMPORTANT: pincode results and portal buttons are DEMO UI only.
   Connect these to a trusted backend before accepting real orders. */
const products = [
  {id:1,name:"Fresh spinach",category:"Vegetables",unit:"1 bunch",price:25,tag:"Seasonal",emoji:"🥬",bg:"#eef4e9"},
  {id:2,name:"Red tomatoes",category:"Vegetables",unit:"500 g",price:28,tag:"Daily pick",emoji:"🍅",bg:"#fbefea"},
  {id:3,name:"Sweet oranges",category:"Fruits",unit:"500 g",price:55,tag:"In season",emoji:"🍊",bg:"#fbf0e1"},
  {id:4,name:"Fresh bananas",category:"Fruits",unit:"6 pieces",price:36,tag:"Popular",emoji:"🍌",bg:"#f8f3dc"},
  {id:5,name:"Farm milk",category:"Dairy",unit:"500 ml",price:32,tag:"Daily essential",emoji:"🥛",bg:"#f0eaf6"},
  {id:6,name:"Farm eggs",category:"Dairy",unit:"6 pieces",price:48,tag:"Protein",emoji:"🥚",bg:"#f8f1e6"},
  {id:7,name:"Everyday rice",category:"Staples",unit:"1 kg",price:68,tag:"Pantry",emoji:"🌾",bg:"#f5f0e6"},
  {id:8,name:"Whole wheat atta",category:"Staples",unit:"1 kg",price:42,tag:"Pantry",emoji:"🌾",bg:"#f1ece4"}
];
const cart = new Map();
const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");
let toastTimer;

function money(value){ return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(value); }
function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove("show"),2600);
}
function renderProducts(filter="All", query=""){
  const normalized = query.trim().toLowerCase();
  const filtered = products.filter(p=>(filter==="All" || p.category===filter) && (!normalized || (p.name+" "+p.category).toLowerCase().includes(normalized)));
  productGrid.innerHTML = "";
  if(!filtered.length){
    productGrid.innerHTML = '<div class="empty-products">No sample products match that search. Try another term.</div>';
    return;
  }
  filtered.forEach((p,index)=>{
    const card=document.createElement("article");
    card.className="product-card reveal";
    card.style.transitionDelay=`${Math.min(index,3)*60}ms`;
    card.innerHTML=`
      <div class="product-image" style="--product-bg:${p.bg}">
        <span class="product-tag">${p.tag}</span><span class="product-emoji" aria-hidden="true">${p.emoji}</span>
      </div>
      <div class="product-name" title="${p.name}">${p.name}</div>
      <div class="product-unit">${p.unit}</div>
      <div class="product-bottom"><span class="product-price">${money(p.price)}</span><button class="add-button" type="button" data-add="${p.id}">${cart.has(p.id)?"Add another":"Add"}</button></div>`;
    productGrid.appendChild(card);
  });
  observeReveals(productGrid.querySelectorAll(".reveal"));
}
function updateCart(){
  const count=[...cart.values()].reduce((sum,n)=>sum+n,0);
  cartCount.textContent=count;
}
productGrid.addEventListener("click",event=>{
  const button=event.target.closest("[data-add]");
  if(!button)return;
  const id=Number(button.dataset.add);
  cart.set(id,(cart.get(id)||0)+1);
  updateCart();
  button.textContent="Added ✓";
  button.classList.add("added");
  showToast(`${products.find(p=>p.id===id).name} added to demo cart`);
  setTimeout(()=>{if(button.isConnected){button.textContent="Add another";button.classList.remove("added");}},1000);
});

const filterButtons=[...document.querySelectorAll("[data-filter]")];
filterButtons.forEach(button=>button.addEventListener("click",()=>{
  filterButtons.forEach(b=>b.classList.toggle("active",b===button));
  renderProducts(button.dataset.filter,document.getElementById("searchInput").value);
}));
document.querySelectorAll("[data-category]").forEach(button=>button.addEventListener("click",()=>{
  const category=button.dataset.category;
  filterButtons.forEach(b=>b.classList.toggle("active",b.dataset.filter===category));
  renderProducts(category,document.getElementById("searchInput").value);
  document.getElementById("products").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
}));

document.getElementById("searchForm").addEventListener("submit",event=>{
  event.preventDefault();
  filterButtons.forEach(b=>b.classList.toggle("active",b.dataset.filter==="All"));
  renderProducts("All",document.getElementById("searchInput").value);
  document.getElementById("products").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
});
document.getElementById("searchInput").addEventListener("input",event=>{
  const query=event.target.value;
  if(query.length>=2)renderProducts("All",query);
  else if(!query)renderProducts("All","");
});

/* DEMO ONLY: Replace with a backend endpoint that checks configured service zones.
   Do not treat a six-digit pincode as proof that delivery is available. */
const pincodeForm=document.getElementById("pincodeForm");
const pincodeInput=document.getElementById("pincodeInput");
const availabilityResult=document.getElementById("availabilityResult");
pincodeInput.addEventListener("input",()=>{pincodeInput.value=pincodeInput.value.replace(/\D/g,"").slice(0,6);});
pincodeForm.addEventListener("submit",event=>{
  event.preventDefault();
  const pin=pincodeInput.value.trim();
  availabilityResult.hidden=false;
  availabilityResult.className="availability-result";
  if(!/^\d{6}$/.test(pin)){
    availabilityResult.classList.add("error");
    availabilityResult.textContent="Please enter a valid 6-digit pincode.";
    return;
  }
  availabilityResult.classList.add("demo");
  availabilityResult.textContent="Demo mode: pincode format is valid, but live delivery coverage is not connected yet. Connect your configured village/service-zone database to confirm delivery days and charges.";
  showToast("Pincode format checked — live serviceability is not connected.");
});
document.getElementById("locationButton").addEventListener("click",()=>{
  document.getElementById("pincodeInput").focus();
  document.getElementById("availability").scrollIntoView({behavior:"smooth"});
});
document.getElementById("cartButton").addEventListener("click",()=>{
  const lines=[...cart.entries()].map(([id,n])=>`${products.find(p=>p.id===id).name} × ${n}`);
  if(!lines.length){showToast("Your demo cart is empty. Add a product to begin.");return;}
  const total=[...cart.entries()].reduce((sum,[id,n])=>sum+products.find(p=>p.id===id).price*n,0);
  openModal("Your demo cart",`${lines.join(" · ")}. Sample subtotal: ${money(total)}. Checkout and order placement are not connected yet.`);
});
const modal=document.getElementById("simpleModal");
function openModal(title,message){
  document.getElementById("modalTitle").textContent=title;
  document.getElementById("modalText").textContent=message;
  if(typeof modal.showModal==="function")modal.showModal();
  else showToast(message);
}
document.getElementById("accountButton").addEventListener("click",()=>openModal("Customer account","Login/signup needs a configured authentication backend. No real account has been created."));
document.querySelectorAll("[data-portal]").forEach(button=>button.addEventListener("click",()=>{
  const portal=button.dataset.portal;
  const content={
    customer:["Customer sign in","This is the entry point for customer login, saved addresses and order history. Connect secure authentication before production."],
    admin:["Protected admin access","Admin features must be protected by server-side roles and permissions. Hiding this entry point alone is not security."],
    partner:["Delivery partner access","Partner accounts should only access their assigned orders, route information and permitted delivery updates."]
  };
  openModal(content[portal][0],content[portal][1]);
}));
document.getElementById("menuButton").addEventListener("click",()=>openModal("Grovia navigation","Use the homepage sections to explore categories, products, delivery availability and role entry points."));
document.getElementById("year").textContent=new Date().getFullYear();

function observeReveals(nodes=document.querySelectorAll(".reveal")){
  if(!("IntersectionObserver" in window)){nodes.forEach(node=>node.classList.add("is-visible"));return;}
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}
    });
  },{threshold:.12,rootMargin:"0px 0px -25px 0px"});
  nodes.forEach(node=>{if(!node.classList.contains("is-visible"))observer.observe(node);});
}
renderProducts();
observeReveals();
document.getElementById("announcementText").textContent="Your village, your delivery day — planned with care.";
   
