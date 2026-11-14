import {type V3} from '../characters/performance';import {type AstroActor,type PlushActor} from './locomotion';
export type Contact={kind:string;target:V3;side:-1|1;surface?:V3;normal?:V3};
export type Blocking={a:AstroActor;w:PlushActor;lamp:number;contact?:Contact;cell?:V3};
