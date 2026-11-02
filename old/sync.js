/* Sincronización Supabase: no se usan claves privadas en el navegador. */
const CBCSync = (() => {
 const base='https://guqgjutsfxcfqkphvpse.supabase.co';
 const key='sb_publishable_3oAm7c_jPGaFsoFUTA44ow_X6-oWc2b';
 const store='cbc_uja_teacher_session_v1';
 let session=null;
 try { session=JSON.parse(sessionStorage.getItem(store)||'null'); } catch {}
 function currentToken(){return session?.access_token||null}
 async function refreshAuth(){
   if(!session?.refresh_token)throw Error('Inicia sesión como profesor.');
   const response=await fetch(base+'/auth/v1/token?grant_type=refresh_token',{
     method:'POST',headers:{'apikey':key,'Content-Type':'application/json'},
     body:JSON.stringify({refresh_token:session.refresh_token})});
   const data=await response.json().catch(()=>({}));
   if(!response.ok)throw Error(data.msg||data.error_description||'Sesión caducada');
   session=data;sessionStorage.setItem(store,JSON.stringify(session));return session;
 }
 async function rpc(name, params={}, retried=false){
   const headers={'apikey':key,'Content-Type':'application/json'};
   if(currentToken())headers.Authorization='Bearer '+currentToken();
   // Sin sesión, Supabase resuelve el rol anon mediante la cabecera apikey.
   let response;
   try{response=await fetch(base+'/rest/v1/rpc/'+name,{
      method:'POST',headers,body:JSON.stringify(params),cache:'no-store'
   });}catch{throw Error('Sin conexión a Supabase. Comprueba Internet.');}
   const data=await response.json().catch(()=>({}));
   if(response.status===401&&currentToken()&&!retried){
      await refreshAuth();return rpc(name,params,true);
   }
   if(!response.ok)throw Error(data.message||data.error_description||('Error Supabase '+response.status));
   return data;
 }
 async function login(email,password){
   const response=await fetch(base+'/auth/v1/token?grant_type=password',{
     method:'POST',headers:{'apikey':key,'Content-Type':'application/json'},
     body:JSON.stringify({email,password})
   });
   const data=await response.json().catch(()=>({}));
   if(!response.ok)throw Error(data.msg||data.error_description||data.error||'Usuario o contraseña incorrectos');
   session=data;sessionStorage.setItem(store,JSON.stringify(session));
   return rpc('cbc_teacher_state');
 }
 function logout(){session=null;sessionStorage.removeItem(store)}
 return {rpc,login,logout,currentToken};
})();
