export const EPISODE2={
 title:'THE LAST WING',subtitle:'EPISODE 02 / FIRST CONTACT',fps:30,width:1080,height:1920,durationInFrames:750,
 scenes:[
  {id:'descent',start:0,end:120,line:'You chose the unknown planet.',speaker:'narrator'},
  {id:'landing',start:120,end:240,line:'One landing. No way back.',speaker:'narrator'},
  {id:'hello',start:240,end:360,line:'Captain… can I say hello?',speaker:'wangdoo'},
  {id:'bloom',start:360,end:510,line:'Oh! It likes me!',speaker:'wangdoo'},
  {id:'answer',start:510,end:630,line:'Captain… we’re not alone.',speaker:'wangdoo'},
  {id:'choice',start:630,end:750,line:'Do you follow the signal?',speaker:'narrator'},
 ],
 choices:[
  {key:'A',top:'FOLLOW THE SIGNAL',label:'ENTER THE GATE',color:'#63e8e0'},
  {key:'B',top:'RETURN TO SAFETY',label:'BACK TO THE SHIP',color:'#ffc383'},
 ],
} as const;
