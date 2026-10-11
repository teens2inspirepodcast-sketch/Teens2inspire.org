import {NextResponse} from "next/server";
export const runtime="nodejs";
export async function POST(request:Request){
 const signature=request.headers.get("stripe-signature");
 if(!signature)return NextResponse.json({error:"Missing Stripe signature."},{status:400});
 const body=await request.text();
 try{
  const response=await fetch("https://mphswidvmesdkefkgwjz.supabase.co/functions/v1/stripe-webhook",{
   method:"POST",
   headers:{"content-type":"application/json","stripe-signature":signature},
   body,
   cache:"no-store"
  });
  const responseBody=await response.text();
  return new Response(responseBody,{status:response.status,headers:{"content-type":response.headers.get("content-type")||"application/json","cache-control":"no-store"}});
 }catch{
  return NextResponse.json({error:"Could not forward the Stripe event to the Supabase webhook processor."},{status:502});
 }
}
