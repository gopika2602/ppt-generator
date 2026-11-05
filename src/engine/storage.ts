import type { Project } from '../types';
const DB='worship-studio',STORE='projects';
function openDB():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>req.result.createObjectStore(STORE,{keyPath:'id'});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
export async function allProjects():Promise<Project[]>{const db=await openDB();return new Promise((resolve,reject)=>{const r=db.transaction(STORE).objectStore(STORE).getAll();r.onsuccess=()=>resolve(r.result as Project[]);r.onerror=()=>reject(r.error)})}
export async function saveProject(p:Project){const db=await openDB();return new Promise<void>((resolve,reject)=>{const r=db.transaction(STORE,'readwrite').objectStore(STORE).put(p);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
export async function deleteProject(id:string){const db=await openDB();return new Promise<void>((resolve,reject)=>{const r=db.transaction(STORE,'readwrite').objectStore(STORE).delete(id);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
