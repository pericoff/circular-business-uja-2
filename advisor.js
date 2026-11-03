/* CIRCULAR BUSINESS CHALLENGE 2 · Asesor IA del equipo.
   Frontend solamente: la clave OpenAI queda exclusivamente en la Edge Function.
   El backend valida el código privado y consulta solo el estado del equipo. */
const CircularAdvisor=(()=>{
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const num=x=>Number.isFinite(Number(x))?Number(x):0;
 const fmt=x=>new Intl.NumberFormat('es-ES',{maximumFractionDigits:1}).format(num(x));
 function observations(t){
  const hist=Array.isArray(t.history)?t.history:[];
  if(!hist.length)return ['Aún no existen resultados publicados. El asesor puede orientar sobre costes, circularidad, financiación y análisis de las decisiones, pero no dispone todavía de resultados para diagnosticar.'];
  const h=hist[hist.length-1];
  const notes=['Última ronda publicada: '+h.round+'; ventas: '+fmt(h.sales)+' unidades; resultado operativo: '+fmt(h.operating)+' €; cuota: '+fmt(h.share)+' %.'];
  if(num(h.operating)<0)notes.push('El resultado operativo fue negativo: revisa precio, costes y volumen de ventas.');
  else notes.push('El resultado operativo fue positivo: valora si es sostenible y qué inversiones futuras requiere.');
  if(num(t.cash)<40000)notes.push('La tesorería es reducida: presta atención al presupuesto de inversión.');
  return notes;
 }
 function view(team,game){
  return '<section class="card" id="cbc-advisor-panel"><h2>Asesor IA · Circular Business Challenge</h2>'+
   '<p>Consulta dudas sobre decisiones de precio, producción, inversión, materias primas recicladas, sostenibilidad, rentabilidad y riesgo de tu empresa. El asesor utiliza solo los datos propios del equipo y no revela las decisiones de los competidores.</p>'+
   '<p class="muted">Ronda '+Number(game.round||1)+' · Empresa: '+esc(team.name)+'. El asesor orienta, pero no toma decisiones por vosotros ni garantiza los resultados.</p>'+
   '<div class="card" style="background:#f4f8f5"><h3>Diagnóstico de partida</h3>'+
     observations(team).map(x=>'<p>'+esc(x)+'</p>').join('')+'</div>'+
   '<form id="cbc-advisor-form"><label for="cbc-advisor-question">Pregunta al asesor</label>'+
   '<textarea id="cbc-advisor-question" rows="4" minlength="5" maxlength="400" required placeholder="Por ejemplo: ¿qué compromisos hay entre invertir en reciclaje y mantener la liquidez?"></textarea>'+
   '<p class="muted">Hasta 400 caracteres por consulta. No compartas datos personales ni contraseñas.</p>'+
   '<button type="submit" id="cbc-advisor-send">Consultar al asesor IA</button></form>'+
   '<div id="cbc-advisor-output" class="card" style="white-space:pre-wrap;line-height:1.55" role="status" aria-live="polite">Escribe tu pregunta y pulsa Consultar.</div></section>';
 }
 function bind(teamCode){
  const form=document.getElementById('cbc-advisor-form');if(!form)return;
  form.onsubmit=async e=>{
   e.preventDefault();const button=document.getElementById('cbc-advisor-send'),out=document.getElementById('cbc-advisor-output'),question=document.getElementById('cbc-advisor-question').value.trim();
   if(question.length<5||question.length>400){out.textContent='La consulta debe tener entre 5 y 400 caracteres.';return;}
   button.disabled=true;out.textContent='Consultando al asesor IA…';
   try{const result=await CBCSync.advisor(teamCode,question);out.textContent=String(result.answer||'No se recibió respuesta.');}
   catch(err){out.textContent='El asesor IA no está disponible: '+err.message+' Comprueba que la función circular-advisor esté desplegada y tenga configurada OPENAI_API_KEY.';}
   finally{button.disabled=false;}
  };
 }
 return {view,bind};
})();