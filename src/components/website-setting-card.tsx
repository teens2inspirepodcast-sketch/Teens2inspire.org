"use client";
import { useState, useTransition, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveWebsiteSetting } from "@/app/admin/website/actions";

export function WebsiteSettingCard({settingKey,label,help,multiline,image,initialValue}:{settingKey:string;label:string;help:string;multiline:boolean;image:boolean;initialValue:string}) {
 const [value,setValue]=useState(initialValue);
 const [file,setFile]=useState<File|null>(null);
 const [error,setError]=useState("");
 const [progress,setProgress]=useState("");
 const [saving,startSaving]=useTransition();
 async function submit(event:FormEvent<HTMLFormElement>) {
  event.preventDefault();setError("");setProgress("");
  let newValue=value.trim();
  try {
   if(image && file) {
    if(!["image/jpeg","image/png","image/webp","image/gif","image/avif"].includes(file.type)) throw new Error("Choose a JPG, PNG, WebP, GIF or AVIF image.");
    if(file.size<1 || file.size>10*1024*1024) throw new Error("Images must be 10 MB or smaller.");
    const ext=({"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/gif":"gif","image/avif":"avif"} as Record<string,string>)[file.type];
    setProgress("Uploading image to Supabase…");
    const supabase=createClient();
    const path=`branding/${crypto.randomUUID()}.${ext}`;
    const {error:uploadError}=await supabase.storage.from("site-brand-assets").upload(path,file,{upsert:false,contentType:file.type});
    if(uploadError)throw uploadError;
    newValue=supabase.storage.from("site-brand-assets").getPublicUrl(path).data.publicUrl;
    setValue(newValue);setProgress("Upload complete. Saving setting…");
   }
   const form=new FormData();form.set("setting_key",settingKey);form.set("setting_value",newValue);
   startSaving(()=>{void saveWebsiteSetting(form)});
  } catch(cause){setError(cause instanceof Error?cause.message:"Upload failed. Setting was not saved.");setProgress("");}
 }
 return <section className="website-setting-card"><h2>{label}</h2><p>{help}</p><form onSubmit={submit}>
 {image ? <><label>Choose a new image<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={e=>setFile(e.target.files?.[0]||null)}/></label><label>Current image URL<input type="url" placeholder="Upload a file or paste an HTTPS image URL" value={value} onChange={e=>setValue(e.target.value)}/></label>{value && <img src={value} alt="Current website image" className="website-setting-preview"/>}</> : multiline ? <textarea rows={5} maxLength={8000} required value={value} onChange={e=>setValue(e.target.value)}/> : <input type="text" maxLength={8000} required value={value} onChange={e=>setValue(e.target.value)}/>}
 <button type="submit" className="admin-button" disabled={saving}>{saving?"Saving…":file?"Upload & save":"Save changes"}</button>
 {progress && <small role="status">{progress}</small>}{error&&<small role="alert" className="admin-alert">{error}</small>}
 </form></section>;
}
