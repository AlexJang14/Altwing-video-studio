"""Blender source: shaped cloth surfaces, reusable articulated character parts.
Run: blender -b --python scripts/build_reset_characters.py
Coordinates are Blender Z-up / -Y front; glTF exports Y-up / +Z front.
"""
import bpy, math, os, json, random
from mathutils import Vector
import numpy as np
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));OUT=os.path.join(ROOT,'public/three-knocks');os.makedirs(OUT,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
random.seed(71)
def empty(name,parent=None,p=(0,0,0)):
 o=bpy.data.objects.new(name,None);bpy.context.collection.objects.link(o);o.parent=parent;o.location=p;return o
def smooth(o):
 if o.type=='MESH':
  for f in o.data.polygons:f.use_smooth=True
 return o
def material(name,color,rough=.7,metal=0,sheen=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal;p.inputs['Sheen Weight'].default_value=sheen;p.inputs['Sheen Tint'].default_value=(sheen,sheen,sheen,1);p.inputs['Sheen Roughness'].default_value=.75;return m
def image(name,array):
 h,w,_=array.shape;im=bpy.data.images.new(name,width=w,height=h,alpha=True);
 if 'normal' in name:im.colorspace_settings.name='Non-Color'
 im.pixels.foreach_set(np.asarray(array,dtype=np.float32).ravel());im.filepath_raw=os.path.join(OUT,name+'.png');im.file_format='PNG';im.save();return im
# Baked woven micro normal maps are exported, not an unsupported Blender-only shader.
w=256;yy,xx=np.mgrid[0:w,0:w];rnd=np.random.default_rng(71)
nx=.12*np.sin(xx*np.pi/2)+rnd.normal(0,.028,(w,w));ny=.12*np.cos(yy*np.pi/2)+rnd.normal(0,.028,(w,w));nz=np.ones((w,w));length=np.sqrt(nx*nx+ny*ny+nz*nz)
a=np.stack([nx/length*.5+.5,ny/length*.5+.5,nz/length*.5+.5,np.ones((w,w))],-1)
normal=image('woven-normal',a);normal.colorspace_settings.name='Non-Color'
def fabric(m,strength=.30,repeat=9):
 n=m.node_tree.nodes;l=m.node_tree.links;tex=n.new('ShaderNodeTexImage');tex.image=normal;coord=n.new('ShaderNodeTexCoord');mapping=n.new('ShaderNodeMapping');mapping.inputs['Scale'].default_value=(repeat,repeat,repeat);l.new(coord.outputs['UV'],mapping.inputs['Vector']);l.new(mapping.outputs['Vector'],tex.inputs['Vector']);nm=n.new('ShaderNodeNormalMap');nm.inputs['Strength'].default_value=strength;l.new(tex.outputs['Color'],nm.inputs['Color']);l.new(nm.outputs['Normal'],n.get('Principled BSDF').inputs['Normal'])
 return m
GRAY=(.245,.27,.30);IVORY=(.87,.855,.815);YELLOW=(.94,.64,.23)
gray=fabric(material('Cloud gray plush',GRAY,.94,0,.42));ivory=fabric(material('Ivory plush',IVORY,.95,0,.42));yellow=fabric(material('Warm cream beak and feet',YELLOW,.94,0,.36),.18)
thread=material('Embroidery charcoal',(.012,.015,.019),.85);seam=material('Fine gray seam',(.37,.39,.42),.97);beakseam=material('Beak stitch',(.48,.41,.22),.98)
packmat=fabric(material('Tiny canvas pack',(.12,.16,.18),.91,0,.15),.18,4);strapmat=material('Woven straps',(.24,.28,.29),.96)
cyan=material('Discreet status',(.20,.56,.61),.5);cyan.node_tree.nodes.get('Principled BSDF').inputs['Emission Color'].default_value=(.16,.59,.66,1);cyan.node_tree.nodes.get('Principled BSDF').inputs['Emission Strength'].default_value=.7
black=fabric(material('Matte black suit fabric',(.003,.005,.008),.95,0,.006),.28,8);panel=material('Soft black protective panels',(.016,.022,.030),.73,.12);rubber=material('Dark flexible rubber',(.011,.014,.018),.94);visor=material('Opaque smoked visor',(.003,.008,.014),.17,.68);metal=material('Restrained brushed titanium',(.08,.10,.12),.48,.65);stitch=material('Suit seams',(.055,.065,.075),.92)
def attach(o,parent,mat):
 o.parent=parent;o.data.materials.clear();o.data.materials.append(mat);return smooth(o)
def mesh(name,verts,faces,parent,mat,uvs=None):
 me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(o);attach(o,parent,mat)
 if uvs:
  layer=me.uv_layers.new(name='UVMap')
  for poly in me.polygons:
   for li in poly.loop_indices:layer.data[li].uv=uvs[me.loops[li].vertex_index]
 return o
def uvshape(name,fn,parent,mat,nu=80,nv=48):
 vs=[];uv=[];fs=[]
 for j in range(nv+1):
  theta=math.pi*(.00001+(1-.00002)*j/nv)
  for i in range(nu+1):
   phi=2*math.pi*i/nu;vs.append(fn(phi,theta));uv.append((i/nu,1-j/nv))
 for j in range(nv):
  for i in range(nu):
   q=j*(nu+1)+i;fs.append((q,q+nu+1,q+nu+2,q+1))
 return mesh(name,vs,fs,parent,mat,uv)
def ell(name,p,s,parent,mat,nu=48,nv=28):
 return uvshape(name,lambda f,t:(p[0]+s[0]*math.sin(f)*math.sin(t),p[1]-s[1]*math.cos(f)*math.sin(t),p[2]+s[2]*math.cos(t)),parent,mat,nu,nv)
def curve(name,pts,r,parent,mat):
 cu=bpy.data.curves.new(name,'CURVE');cu.dimensions='3D';cu.resolution_u=12;cu.bevel_depth=r;cu.bevel_resolution=3;cu.use_fill_caps=True;sp=cu.splines.new('BEZIER');sp.bezier_points.add(len(pts)-1)
 for b,p in zip(sp.bezier_points,pts):b.co=p;b.handle_left_type='AUTO';b.handle_right_type='AUTO'
 o=bpy.data.objects.new(name,cu);bpy.context.collection.objects.link(o);o.parent=parent;o.data.materials.append(mat);return o
def box(name,p,s,parent,mat,bevel=.02):
 bpy.ops.mesh.primitive_cube_add(size=1);o=bpy.context.object;o.name=name;o.location=p;o.scale=s;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.parent=parent;o.data.materials.append(mat)
 if bevel:
  mod=o.modifiers.new('Tailored rounded edges','BEVEL');mod.width=bevel;mod.segments=4;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=mod.name)
 return smooth(o)
def rings(name,levels,parent,mat,detail=.0,around=64):
 # Sculpted continuous cross-sections; tailored silhouette and cloth folds.
 vs=[];uv=[];fs=[]
 for j,(z,rx,ry,cy)in enumerate(levels):
  for i in range(around+1):
   ph=2*math.pi*i/around;wr=1+detail*math.sin(j*.9+ph*5)*math.sin(j*1.2+ph*3);vs.append((rx*math.sin(ph)*wr,cy-ry*math.cos(ph)*wr,z));uv.append((i/around,j/(len(levels)-1)))
 for j in range(len(levels)-1):
  for i in range(around):q=j*(around+1)+i;fs.append((q,q+1,q+around+2,q+around+1))
 fs.append(tuple(range(around-1,-1,-1)));base=(len(levels)-1)*(around+1);fs.append(tuple(base+i for i in range(around)))
 o=mesh(name,vs,fs,parent,mat,uv);mod=o.modifiers.new('Sculpted surface refinement','SUBSURF');mod.levels=1;mod.render_levels=1;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=mod.name);return o
# WANGDOO -------------------------------------------------------------------
wroot=empty('Wangdoo');body=empty('WangBody',wroot);head=empty('WangHead',body,(0,-.003,.535))
# Pear silhouette, padded belly and narrowed neck are one tailored torso mesh.
levels=[]
for j in range(33):
 u=j/32;z=.052+u*.445;radius=math.sin(math.pi*u)**.60;rx=(.245-.095*u)*radius+.125*(1-u)**5;ry=(.194-.054*u)*radius+.105*(1-u)**5;levels.append((z,max(rx,.003),max(ry,.003),-.021*math.sin(math.pi*u)))
torso=rings('WangTorso',levels,body,gray,0,80)
# Continuous light/white cloth maps on custom surfaces, not overlapping white balls.
def cloth_map(headmap):
 h=512;w=1024;v,u=np.mgrid[0:h,0:w];phi=u/(w-1)*2*np.pi;theta=(1-v/(h-1))*np.pi;x=np.sin(phi)*np.sin(theta);z=np.cos(theta);front=np.cos(phi)*np.sin(theta)
 sh=np.minimum(((x+.35)/.61)**2+((z+.035)/.78)**2,((x-.35)/.61)**2+((z+.035)/.78)**2) if headmap else (x/.87)**2+((z+.09)/1.02)**2
 def ss(a,b,x):q=np.clip((x-a)/(b-a),0,1);return q*q*(3-2*q)
 
 if headmap:sh=np.minimum(sh,(x/.74)**2+((z+.40)/.71)**2)
 mask=ss(.15,.36,front)*(1-ss(.96,1.035,sh));g=np.array(GRAY);white=np.array(IVORY);rgb=g[None,None,:]*(1-mask[...,None])+white[None,None,:]*mask[...,None]
 if headmap:
  blush=(np.exp(-((x-.54)/.14)**2-((z+.17)/.11)**2)+np.exp(-((x+.54)/.14)**2-((z+.17)/.11)**2))*ss(.2,.5,front)*.18;rgb=rgb*(1-blush[...,None])+np.array([.80,.59,.54])*blush[...,None]
 return image('wang-face'if headmap else'wang-belly',np.concatenate([rgb,np.ones((h,w,1))],-1))
def colored(m,im,name):
 m=m.copy();m.name=name;t=m.node_tree.nodes.new('ShaderNodeTexImage');t.image=im;m.node_tree.links.new(t.outputs['Color'],m.node_tree.nodes.get('Principled BSDF').inputs['Base Color']);return m
# Use the same UV convention for the shaped pear torso.
torso.data.materials[0]=colored(gray,cloth_map(False),'Pear torso cloth')
def headfn(ph,th):
 x=.255*math.sin(ph)*math.sin(th);z=.228*math.cos(th);y=-.213*math.cos(ph)*math.sin(th)
 cheek=.012*(math.exp(-((x-.14)/.075)**2-((z+.04)/.085)**2)+math.exp(-((x+.14)/.075)**2-((z+.04)/.085)**2))
 y-=cheek*max(0,math.cos(ph));return(x,y,z)
ellhead=uvshape('WangHeadCloth',headfn,head,colored(gray,cloth_map(True),'Shaped gray and white head'),112,64)
def face_y(x,z):return -.213*math.sqrt(max(.02,1-(x/.255)**2-(z/.228)**2))-.004
for side,label in [(-1,'L'),(1,'R')]:
 pts=[]
 for i in range(9):
  u=i/8;x=side*.096+(u-.5)*.048;z=.032+.018*math.sin(math.pi*u);pts.append((x,face_y(x,z)-.002,z))
 eye=curve('WangEye'+label,pts,.0040,head,thread)
 # Subtle cap seam runs over the side/back of the stuffed head.
 pts=[headfn(1.69*side,.15+i/18*2.80)for i in range(19)];curve('WangHeadSeam'+label,pts,.0008,head,seam)
 flipper=empty('WangWing'+label,body,(side*.178,.004,.382))
 wing=rings('WangFlipper'+label,[(0,.024,.031,0),(-.035,.040,.039,0),(-.09,.040,.034,-.004),(-.15,.032,.027,-.010),(-.208,.019,.018,-.014),(-.225,.010,.012,-.015)],flipper,gray)
 for v in wing.data.vertices:v.co.x+=side*.070*(1-math.exp(-max(0,-v.co.z)/.060))
 # Rounded feet with cloth seam; short, no thin exposed legs.
 foot=empty('WangFoot'+label,wroot,(side*.108,-.014,0))
 ell('WangFootCloth'+label,(0,-.033,.039),(.087,.125,.039),foot,yellow)
 curve('WangFootSeam'+label,[(-.062,-.035,.023),(-.036,-.125,.025),(0,-.155,.027),(.036,-.125,.025),(.062,-.035,.023)],.0007,foot,beakseam)
 empty('WangSole'+label,foot,(0,-.036,0))
# Soft sculpted beak, with a narrow sewn mouth crease rather than a hard plastic disc.
ell('WangBeak',(0,-.222,-.040),(.042,.044,.023),head,yellow,64,36)
curve('WangMouth',[(-.034,-.249,-.043),(0,-.270,-.047),(.034,-.249,-.043)],.0009,head,beakseam)
backpack=empty('WangPack',body,(0,.163,.330));box('TinyPackShell',(0,0,0),(.148,.058,.178),backpack,packmat,.026)
box('PackTopFlap',(0,.030,.036),(.132,.010,.082),backpack,strapmat,.016)
for side in [-1,1]:
 curve('PackStrap'+str(side),[(side*.064,.012,.080),(side*.102,-.070,.12),(side*.124,-.137,.01),(side*.12,-.127,-.07)],.007,backpack,strapmat)
curve('PackStitch',[(-.054,.032,-.055),(0,.034,-.061),(.054,.032,-.055)],.0007,backpack,seam)
ell('WangStatusLight',(.046,.035,-.031),(.005,.004,.005),backpack,cyan,24,16)
box('ScannerHinge',(.084,0,.040),(.035,.032,.050),backpack,packmat,.006)
ell('ScannerLens',(.098,-.019,.051),(.010,.008,.012),backpack,cyan,32,20)
empty('WangPackPort',body,(.081,.265,.360))
# A tiny tactile port on the side of the removable pack, accessible to a glove.
ell('PackCheckButton',(.081,.090,.030),(.009,.012,.010),backpack,metal,24,16)
curve('PackCheckLoop',[(.045,.028,.03),(.07,.086,.03),(.095,.090,.03),(.108,.028,.03)],.005,backpack,strapmat)
# ASTRONAUT -----------------------------------------------------------------
aroot=empty('Astronaut');abody=empty('AstroBody',aroot)
# Shaped fabric trunk with padding in the chest and a distinct flexible waist.
rings('SuitTrunk',[(.87,.125,.092,0),(.92,.15,.108,0),(1.00,.157,.112,0),(1.10,.164,.108,0),(1.25,.198,.116,-.005),(1.39,.221,.126,-.009),(1.47,.229,.116,0),(1.53,.177,.102,0),(1.57,.105,.083,0)],abody,black,.009)
box('ChestPanel',(0,-.113,1.36),(.265,.031,.21),abody,panel,.035)
box('ChestControls',(0,-.139,1.35),(.12,.014,.067),abody,rubber,.009)
box('SingleSuitLED',(.042,-.150,1.36),(.027,.005,.004),abody,cyan,.001)
box('LifeSupportPack',(0,.137,1.28),(.29,.16,.43),abody,panel,.045)
for side in [-1,1]:
 box('PackRail'+str(side),(side*.108,.221,1.30),(.016,.019,.315),abody,metal,.006)
 curve('LifeSupportHose'+str(side),[(side*.11,.20,1.46),(side*.23,.14,1.44),(side*.23,-.065,1.41),(side*.14,-.13,1.31)],.012,abody,rubber)
 curve('SuitSeam'+str(side),[(side*.14,-.080,.94),(side*.175,-.086,1.11),(side*.193,-.08,1.34),(side*.16,-.073,1.51)],.0013,abody,stitch)
 # Small fabric waist pockets, not large robot armor blocks.
 box('WaistPocket'+str(side),(side*.17,-.017,1.02),(.068,.108,.125),abody,black,.013)
headbone=empty('AstroHead',abody,(0,0,1.59))
ell('HelmetShell',(0,0,.143),(.186,.173,.220),headbone,panel,80,48)
# The visor is a shaped curved patch on the helmet surface.
verts=[];faces=[]
for j in range(25):
 lat=-.40+j/24*.98
 for i in range(49):
  angle=-1.12+i/48*2.24;x=.189*math.sin(angle)*math.cos(lat);y=-.177*math.cos(angle)*math.cos(lat)-.003;z=.143+.221*math.sin(lat);verts.append((x,y,z))
for j in range(24):
 for i in range(48):q=j*49+i;faces.append((q,q+1,q+50,q+49))
mesh('OpaqueVisor',verts,faces,headbone,visor)
curve('HelmetGasket',[(-.169,-.07,.05),(-.13,-.132,.009),(0,-.174,-.002),(.13,-.132,.009),(.169,-.07,.05)],.007,headbone,rubber)
# Collar and garment articulation, without exposed spherical robot joints.
for label,side in [('L',-1),('R',1)]:
 upper=empty('AstroUpperArm'+label,abody,(side*.242,0,1.49))
 rings('SleeveUpper'+label,[(.035,.066,.071,0),(0,.079,.077,0),(-.055,.081,.077,0),(-.13,.071,.067,0),(-.23,.064,.062,0),(-.315,.065,.063,0)],upper,black,.035)
 box('ShoulderPatch'+label,(side*.056,.010,-.025),(.028,.10,.11),upper,panel,.014)
 fore=empty('AstroForearm'+label,upper,(0,0,-.30))
 rings('SleeveForearm'+label,[(.028,.065,.062,0),(-.02,.066,.064,0),(-.05,.059,.057,0),(-.11,.060,.056,0),(-.19,.056,.054,0),(-.267,.047,.047,0)],fore,black,.028)
 box('WristComputer'+label,(0,-.055,-.188),(.083,.024,.078),fore,panel,.01)
 box('WristScreen'+label,(0,-.069,-.187),(.058,.003,.045),fore,visor,.003)
 hand=empty('AstroHand'+label,fore,(0,0,-.267))
 # A unified sculpted glove from palm, thumb and four finger volumes.
 pieces=[ell('Palm'+label,(0,-.006,-.047),(.048,.032,.058),hand,black,36,24)]
 for k in range(4):
  x=(k-1.5)*.021;length=[.048,.062,.059,.044][k];pieces.append(ell('Finger'+label+str(k),(x,-.005,-.090),(.013,.022,length*.55),hand,black,28,20))
 pieces.append(ell('Thumb'+label,(-side*.047,-.017,-.045),(.019,.025,.034),hand,black,28,20))
 bpy.ops.object.select_all(action='DESELECT')
 for o in pieces:o.select_set(True)
 bpy.context.view_layer.objects.active=pieces[0];bpy.ops.object.join();glove=bpy.context.object;glove.name='TailoredGlove'+label
 rem=glove.modifiers.new('Unified glove sculpt','REMESH');rem.mode='VOXEL';rem.voxel_size=.004;rem.use_smooth_shade=True;bpy.ops.object.modifier_apply(modifier=rem.name)
 sm=glove.modifiers.new('Soft glove','SMOOTH');sm.factor=.6;sm.iterations=3;bpy.ops.object.modifier_apply(modifier=sm.name)
 empty('AstroGrip'+label,fore,(0,-.015,-.330))
 thigh=empty('AstroThigh'+label,abody,(side*.121,0,.95))
 rings('TrouserUpper'+label,[(.055,.086,.092,0),(0,.094,.099,0),(-.08,.092,.093,0),(-.20,.085,.084,0),(-.32,.075,.073,0),(-.465,.073,.073,0)],thigh,black,.030)
 shin=empty('AstroShin'+label,thigh,(0,0,-.44))
 rings('TrouserLower'+label,[(.026,.072,.071,0),(-.025,.074,.074,0),(-.085,.071,.070,0),(-.20,.066,.065,0),(-.33,.063,.064,0),(-.44,.062,.063,0)],shin,black,.027)
 box('KneePad'+label,(0,-.065,-.036),(.115,.028,.143),shin,panel,.030)
 boot=empty('AstroFoot'+label,shin,(0,0,-.44))
 # A continuous molded boot has a heel, toe box, shaft and actual flat sole.
 rings('BootShaft'+label,[(-.035,.069,.082,-.012),(.025,.072,.077,0),(.095,.071,.072,0),(.14,.066,.064,0)],boot,rubber,.010)
 box('BootUpper'+label,(0,-.055,-.004),(.158,.276,.122),boot,panel,.045)
 box('BootSole'+label,(0,-.052,-.054),(.17,.286,.032),boot,rubber,.013)
 curve('BootToeSeam'+label,[(-.065,-.120,.022),(0,-.180,.025),(.065,-.120,.022)],.002,boot,stitch)
 empty('AstroSole'+label,boot,(0,-.045,-.070))
# Export reusable groups with texture maps. Curves are converted so glTF is complete.
for o in list(bpy.context.scene.objects):
 if o.type=='CURVE':
  bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.convert(target='MESH')
for root,name in [(wroot,'wangdoo-sculpted'),(aroot,'astronaut-tailored')]:
 bpy.ops.object.select_all(action='DESELECT');root.select_set(True)
 for o in root.children_recursive:o.select_set(True)
 bpy.context.view_layer.objects.active=root
 bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,name+'.glb'),export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_materials='EXPORT',export_normals=True,export_texcoords=True,export_animations=False)
# Native editable modeling source, without embedding duplicate packed texture pixels.
bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'three-knocks-characters.blend'))
bpy.ops.file.make_paths_relative()
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'three-knocks-characters.blend'))
meta={'front':'+Z','up':'+Y','units':'meters','wangdooHeight':.763,'astronautHeight':1.953,'reference':'Refined from the supplied gray-and-white plush description and existing project renders. Definitive plush photograph unavailable; exact photographic match UNVERIFIED.','parts':'Tailored continuous surfaces, articulated groups, sculpted unified glove, baked woven normal maps.','models':['wangdoo-sculpted.glb','astronaut-tailored.glb']}
open(os.path.join(OUT,'character-assets.json'),'w').write(json.dumps(meta,indent=2)+'\n')
print('RESET CHARACTER ASSETS COMPLETE',flush=True)
