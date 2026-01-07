import{c as d,a as l,r as m}from"./hoisted.BYdrvtP8.js";const s=document.getElementById("cart-empty"),c=document.getElementById("cart-content"),o=document.getElementById("cart-items-container"),u=document.getElementById("cart-total"),g=document.getElementById("btn-cancel"),b=document.getElementById("btn-pay");function h(i){const a=Object.values(i);if(a.length===0){s?.classList.remove("hidden"),c?.classList.add("hidden");return}s?.classList.add("hidden"),c?.classList.remove("hidden"),o.innerHTML="";let r=0;a.forEach(t=>{const n=t.price*t.quantity;r+=n;const e=document.createElement("div");e.className="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/5",e.innerHTML=`
        <div class="w-20 h-20 bg-black/20 rounded overflow-hidden flex-shrink-0">
          ${t.image?`<img src="${t.image}" alt="${t.name}" class="w-full h-full object-cover" />`:'<div class="w-full h-full flex items-center justify-center text-2xl">🌸</div>'}
        </div>
        <div class="flex-grow">
          <h3 class="font-serif text-lg text-honey-bronze-100">${t.name}</h3>
          <p class="text-sm text-gray-400">Tamaño: ${t.size}</p>
          <p class="text-sm text-cherry-blossom-100">Cantidad: ${t.quantity}</p>
        </div>
        <div class="text-right">
          <p class="font-bold text-honey-bronze-400">$${n.toLocaleString("es-CL")}</p>
          <button class="text-xs text-red-400 hover:text-red-300 mt-1 underline btn-remove" data-id="${t.id}">
            Eliminar
          </button>
        </div>
      `,o.appendChild(e)}),u.innerText=`$${r.toLocaleString("es-CL")}`,document.querySelectorAll(".btn-remove").forEach(t=>{t.addEventListener("click",n=>{const e=n.target.getAttribute("data-id");e&&m(e)})})}d.subscribe(h);g?.addEventListener("click",()=>{confirm("¿Estás seguro de que quieres vaciar tu carrito?")&&l()});b?.addEventListener("click",()=>{alert("¡Iniciando pago simulado!"),window.location.href="/webpay/return?token_ws=MOCK_TOKEN"});
