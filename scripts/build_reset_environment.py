"""Detailed reusable ship/station sets for the new Episode 1. Blender Z-up / -Y front."""
import bpy,math,os,sys,random
import numpy as np
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));OUT=os.path.join(ROOT,'public/reset');random.seed(115)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def group(n,p=(0,0,0),parent=None):
 o=bpy.data.objects.new(n,None);bpy.context.collection.objects.link(o);o.location=p;o.parent=parent;return o
def mat(n,c,r=.75,m=.0,emit=0):
 q=bpy.data.materials.new(n);q.use_nodes=True;p=q.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*c,1);p.inputs['Roughness'].default_value=r;p.inputs['Metallic'].default_value=m
 if emit:p.inputs['Emission Color'].default_value=(*c,1);p.inputs['Emission Strength'].default_value=emit
 return q
wall=mat('Blue-gray powder-coated station panels',(.045,.069,.092),.81,.32);trim=mat('Worn structural alloy',(.15,.185,.21),.63,.52);floor=mat('Worn non-slip deck',(.035,.050,.064),.88,.25);dark=mat('Dark recesses',(.007,.014,.022),.93);white=mat('Printed paper and ceramic',(.70,.70,.65),.80);warm=mat('Warm practical light',(.72,.53,.30),.48,0,2.2);cool=mat('Cool practical light',(.30,.43,.52),.55,0,1.5);red=mat('Emergency red paint',(.30,.022,.014),.68,.13);mugred=mat('Personal red ceramic mug',(.36,.045,.022),.35);seat=mat('Teal woven seat',(.025,.095,.105),.91);screen=mat('Unlit dark glass',(.003,.012,.021),.25,.20);rubber=mat('Rubber and cables',(.010,.018,.024),.95);alum=mat('Scratched steel',(.18,.22,.25),.46,.65)
# Real baked wear color, used consistently by the final WebGL renderer.
rng=np.random.default_rng(84);size=512;y,x=np.mgrid[0:size,0:size];v=.92+.06*np.sin(x*.071)*np.cos(y*.053)+rng.normal(0,.018,(size,size))
for i in range(105):
 px=rng.integers(0,size);py=rng.integers(0,size);length=int(rng.integers(4,55));v[max(0,py-1):py+1,px:min(size,px+length)]+=.12
rgb=np.stack([v*.035,v*.050,v*.064,np.ones_like(v)],-1);im=bpy.data.images.new('deck-wear',width=size,height=size,alpha=True);im.pixels.foreach_set(rgb.astype(np.float32).ravel());im.filepath_raw=os.path.join(OUT,'deck-wear.png');im.file_format='PNG';im.save();nodes=floor.node_tree.nodes;tex=nodes.new('ShaderNodeTexImage');tex.image=im;mapping=nodes.new('ShaderNodeMapping');mapping.inputs['Scale'].default_value=(8,8,8);uv=nodes.new('ShaderNodeTexCoord');floor.node_tree.links.new(uv.outputs['UV'],mapping.inputs['Vector']);floor.node_tree.links.new(mapping.outputs['Vector'],tex.inputs['Vector']);floor.node_tree.links.new(tex.outputs['Color'],nodes.get('Principled BSDF').inputs['Base Color'])
def box(n,p,s,parent,m,bevel=.015,rot=None):
 bpy.ops.mesh.primitive_cube_add(size=1);o=bpy.context.object;o.name=n;o.location=p;o.scale=s;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.parent=parent;o.data.materials.append(m)
 if rot:o.rotation_euler=rot
 if bevel:
  z=o.modifiers.new('Manufactured bevel','BEVEL');z.width=bevel;z.segments=3;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=z.name)
 for f in o.data.polygons:f.use_smooth=True
 return o
def cyl(n,p,r,depth,parent,m,rot=None):
 bpy.ops.mesh.primitive_cylinder_add(vertices=32,radius=r,depth=depth,location=p);o=bpy.context.object;o.name=n;o.parent=parent;o.data.materials.append(m)
 if rot:o.rotation_euler=rot
 bevel=o.modifiers.new('Soft machine edges','BEVEL');bevel.width=min(.008,r*.15);bevel.segments=3;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=bevel.name)
 for f in o.data.polygons:f.use_smooth=True
 return o
def curve(n,pts,r,parent,m):
 cu=bpy.data.curves.new(n,'CURVE');cu.dimensions='3D';cu.bevel_depth=r;cu.bevel_resolution=2;cu.resolution_u=12;s=cu.splines.new('BEZIER');s.bezier_points.add(len(pts)-1)
 for p,c in zip(s.bezier_points,pts):p.co=c;p.handle_left_type='AUTO';p.handle_right_type='AUTO'
 o=bpy.data.objects.new(n,cu);bpy.context.collection.objects.link(o);o.parent=parent;o.data.materials.append(m);return o
def torus(n,p,R,r,parent,m,rot=(0,0,0)):
 bpy.ops.mesh.primitive_torus_add(major_segments=64,minor_segments=12,major_radius=R,minor_radius=r,location=p,rotation=rot);o=bpy.context.object;o.name=n;o.parent=parent;o.data.materials.append(m)
 for f in o.data.polygons:f.use_smooth=True
 return o
def cup(parent,p,m,n='CoffeeCup'):
 root=group(n,p,parent);N=48;vs=[];fs=[]
 for z,r in [(0,.041),(.10,.044),(.10,.036),(.012,.034)]:
  for i in range(N):a=i/N*2*math.pi;vs.append((math.sin(a)*r,math.cos(a)*r,z))
 for j in range(3):
  for i in range(N):a=j*N+i;b=j*N+(i+1)%N;fs.append((a,b,b+N,a+N))
 me=bpy.data.meshes.new(n);me.from_pydata(vs,[],fs);me.update();o=bpy.data.objects.new(n,me);bpy.context.collection.objects.link(o);o.parent=root;o.data.materials.append(m)
 torus('CupHandle',(.052,0,.058),.031,.006,root,m,(math.pi/2,0,0));cyl('Coffee',(0,0,.079),.034,.002,root,mat('Coffee dark surface',(.013,.007,.003),.28));return root

def chair(parent,p,name='Chair',fallen=False,teal=False):
 root=group(name,p,parent)
 if fallen:root.rotation_euler=(0,1.34,.36);root.location.z=.35
 col=seat if teal else rubber
 box(name+'Seat',(0,0,.49),(.54,.50,.115),root,col,.045);box(name+'Back',(0,.19,.89),(.52,.11,.69),root,col,.07);cyl(name+'Post',(0,0,.23),.035,.43,root,alum)
 for side in [-1,1]:
  box(name+'Arm'+str(side),(side*.28,0,.69),(.055,.38,.055),root,rubber,.022)
  curve(name+'Leg'+str(side),[(0,0,.11),(side*.17,0,.09),(side*.34,0,.06)],.017,root,alum)
  curve(name+'LegBack'+str(side),[(0,0,.11),(0,side*.17,.09),(0,side*.34,.06)],.017,root,alum)
 return root

def desk(parent,p):
 root=group('ResearchDesk',p,parent);box('DeskSurface',(0,0,.86),(.85,1.65,.07),root,trim,.03)
 for j in [-.65,.65]:box('DeskLeg',(0,j,.42),(.10,.09,.84),root,alum,.01)
 box('MonitorStem',(0,.46,1.01),(.05,.05,.25),root,alum,.008);box('Monitor',(0,.49,1.27),(.54,.06,.38),root,screen,.018)
 box('Keyboard',(0,.02,.914),(.48,.17,.018),root,dark,.006)
 for i in range(3):box('AbandonedDocument'+str(i),(-.11+i*.08,-.42+i*.04,.909+i*.004),(.29,.36,.003),root,white,.001,rot=(0,0,-.13+i*.12))
 cup(root,(.22,-.55,.91),white,'WarmCup');return root
# SHIP: a recognizable small lived-in cockpit, not the station.
ship=group('ResetShipInterior');box('ShipDeck',(0,-.35,-.075),(3.8,7.7,.15),ship,floor,.02)
for side in [-1,1]:
 box('ShipLowerWall'+str(side),(side*1.82,-.1,.50),(.16,7.0,1.0),ship,wall,.04)
 box('ShipUpperWall'+str(side),(side*1.70,-.5,2.05),(.16,6.0,1.5),ship,wall,.04,rot=(0,side*.19,0))
 for y in [-2.4,-.8,.8,2.4]:
  curve('ArchedShipRib'+str(side)+str(y),[(side*1.77,y,.15),(side*1.77,y,1.6),(side*1.52,y,2.6),(side*.9,y,2.9),(0,y,3.0)],.055,ship,trim)
 box('ShipWallLight'+str(side),(side*1.65,.0,1.9),(.035,.90,.055),ship,warm if side<0 else cool,.01)
# Circular front window, visible through every cockpit angle.
box('ShipNose',(0,3.32,1.55),(3.7,.13,2.95),ship,wall,.04)
# A curved dark aperture and functional rim, star view is added by the final renderer.
cyl('FrontWindowAperture',(0,3.23,1.90),1.04,.025,ship,screen,(math.pi/2,0,0));torus('RoundShipWindow',(0,3.20,1.90),1.06,.065,ship,alum,(math.pi/2,0,0));torus('WarmWindowSeal',(0,3.15,1.90),.98,.013,ship,warm,(math.pi/2,0,0))
box('ShipConsole',(0,2.57,.57),(2.8,.70,1.14),ship,wall,.065);box('ShipControlDesk',(0,2.43,.93),(2.85,.92,.10),ship,trim,.03,rot=(.12,0,0));box('MainShipScreen',(-.35,2.50,1.43),(1.04,.05,.35),ship,screen,.02)
for i in range(7):box('ShipButton'+str(i),(-.72+i*.18,2.16,.994),(.075,.035,.015),ship,cool if i%3 else dark,.004)
chair(ship,(1.05,1.76,0),'PilotSeat',teal=True);cup(ship,(1.22,2.40,1.03),mugred,'YourRedMug')
box('DeparturePanel',(.65,2.30,1.04),(.26,.19,.035),ship,red,.012);box('DepartureButton',(.65,2.30,1.07),(.10,.065,.015),ship,rubber,.005)
# Usable entry frame; the open aperture never becomes a decorative solid wall.
for side in [-1,1]:box('ShipEntryPost'+str(side),(side*.95,-3.33,1.35),(.16,.23,2.70),ship,trim,.035)
box('ShipEntryHeader',(0,-3.33,2.75),(2.05,.23,.16),ship,trim,.035)
# STATION: no giant empty test room; work areas are outside both walking lanes.
station=group('ResetStationInterior');box('StationDeck',(0,2.5,-.08),(5.5,17,.16),station,floor,.02)
for side in [-1,1]:
 for j in range(7):
  y=-4.2+j*2.2;box('WallPanel'+str(side)+str(j),(side*2.66,y,1.55),(.15,2.12,3.1),station,wall,.02)
  box('RecessedWornSkirt'+str(side)+str(j),(side*2.54,y,.27),(.10,1.85,.40),station,dark,.012)
  for z in [1.0,2.15]:box('WallSeam'+str(side)+str(j)+str(z),(side*2.57,y,z),(.012,1.86,.017),station,trim,.002)
 for y in [-4.6,-.8,3.0,6.8,10.5]:
  box('StationRib'+str(side)+str(y),(side*2.43,y,1.55),(.12,.15,3.1),station,trim,.02)
  box('CeilingFixture'+str(side)+str(y),(side*1.50,y,3.02),(.55,.68,.05),station,cool,.02)
 # Real cable conduit and ventilation rather than decorative neon.
 curve('CableRun'+str(side),[(side*2.42,-5.0,2.68),(side*2.42,-1,2.68),(side*2.42,3,2.68),(side*2.42,10.8,2.68)],.025,station,rubber)
 for j in range(6):box('VentSlat'+str(side)+str(j),(side*2.55,1.1+j*.095,.75),(.08,.04,.38),station,alum,.005)
for y in [-4,-2,0,2,4,6,8,10]:box('DeckJoin'+str(y),(0,y,.008),(4.65,.015,.004),station,trim,.001)
box('Ceiling',(0,2.5,3.18),(5.5,17,.12),station,wall,.02)
desk(station,(-2.08,1.60,0));desk(station,(2.08,5.4,0));chair(station,(-2.08,.55,0),'LeftBehindChair',fallen=True);chair(station,(2.0,6.0,0),'EmptyWorkChair')
# A recently used eating area and personal belongings in the left recess.
box('MealTable',(-1.96,5.0,.75),(.80,1.30,.06),station,trim,.03);box('MealTableLeg',(-1.96,5,.36),(.08,.08,.72),station,alum,.01);cup(station,(-1.86,4.8,.79),white,'MealCup')
box('PersonalBag',(-2.05,3.48,.21),(.43,.48,.42),station,rubber,.075);curve('BagHandle',[(-2.2,3.48,.40),(-2.20,3.48,.49),(-1.91,3.48,.49),(-1.91,3.48,.40)],.013,station,alum)
box('PostcardFrame',(-2.51,3.45,1.55),(.045,.30,.38),station,alum,.016)
box('SecurityCameraBase',(2.39,7.5,2.67),(.12,.18,.16),station,alum,.02);box('SecurityCamera',(2.24,7.35,2.62),(.25,.30,.15),station,dark,.04)
# Locked door frame and its housing. The door and wheel are dynamic film parts.
for side in [-1,1]:box('LockedDoorJamb'+str(side),(side*1.12,10.95,1.50),(.22,.40,3.0),station,trim,.025)
box('LockedDoorTop',(0,10.95,3.0),(2.45,.40,.25),station,trim,.025)
for side in [-1,1]:box('EndWall'+str(side),(side*2.0,11.0,1.55),(1.6,.20,3.1),station,wall,.025)
# Entry portal to the ship remains plainly visible behind the characters.
for side in [-1,1]:box('AirlockJamb'+str(side),(side*1.30,-5.52,1.5),(.22,.40,3.0),station,trim,.025)
box('AirlockTop',(0,-5.52,3.0),(2.85,.4,.22),station,trim,.025)
# The locked leaf and entry leaf are independent moving groups.
locked=group('LockedDoorLeaf',(0,10.80,0),station)
for side in [-1,1]:
 box('DoorPanel'+str(side),(side*.49,0,1.47),(.96,.16,2.90),locked,wall,.035)
 box('DoorPanelInset'+str(side),(side*.47,-.091,1.46),(.69,.025,2.35),locked,trim,.025)
 for z in [.30,2.55]:box('DoorLatch'+str(side)+str(z),(side*.86,-.12,z),(.12,.08,.17),locked,alum,.012)
curve('DoorDentedSeam',[(0,-.11,.08),(.008,-.12,.90),(-.025,-.13,1.45),(.012,-.12,2.10),(0,-.11,2.90)],.012,locked,dark)
for i in range(9):
 x=-.65+(i%4)*.28;z=.80+i*.15;curve('DoorScratch'+str(i),[(x,-.112,z),(x+.11,-.113,z+.05),(x+.20,-.113,z+.07)],.0018,locked,alum)
control=group('ManualRelease',(1.36,10.72,1.23),station);box('ReleaseBackplate',(0,0,0),(.35,.13,.53),control,dark,.035);torus('RedReleaseWheel',(0,-.11,0),.125,.019,control,red,(math.pi/2,0,0))
for angle in [0,2.094,4.188]:curve('ReleaseSpoke'+str(angle),[(0,-.11,0),(.10*math.sin(angle),-.11,.10*math.cos(angle))],.009,control,alum)
box('GuardedDoorSwitch',(-.14,-.11,.30),(.10,.07,.08),control,red,.012)
entry=group('EntryAirlockLeaf',(0,-5.52,0),station);box('EntryLeaf',(0,0,1.43),(2.45,.12,2.86),entry,wall,.035)
# A small rescue shuttle with a continuous pressure hull and a distinctive window.
craft=group('ResetRescueCraft');verts=[];faces=[];levels=[(-4.15,1.35,1.31),(-3.7,1.85,1.46),(-2.2,2.16,1.50),(0,2.20,1.50),(2.0,2.14,1.49),(3.35,1.89,1.43),(3.60,1.72,1.32)];N=64
for y,rx,rz in levels:
 for i in range(N):a=2*math.pi*i/N;verts.append((rx*math.sin(a),y,1.50+rz*math.cos(a)))
for j in range(len(levels)-1):
 for i in range(N):q=j*N+i;faces.append((q,j*N+(i+1)%N,(j+1)*N+(i+1)%N,q+N))
faces.extend([tuple(range(N-1,-1,-1)),tuple((len(levels)-1)*N+i for i in range(N))]);me=bpy.data.meshes.new('ContinuousRescueHull');me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new('ContinuousRescueHull',me);bpy.context.collection.objects.link(o);o.parent=craft;o.data.materials.append(trim)
for f in me.polygons:f.use_smooth=True
m=o.modifiers.new('Hull refinement','SUBSURF');m.levels=1;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=m.name)
cyl('ShuttleFrontGlass',(0,3.61,1.84),1.03,.035,craft,screen,(math.pi/2,0,0));torus('ShuttleWindowFrame',(0,3.65,1.84),1.065,.052,craft,alum,(math.pi/2,0,0))
for side in [-1,1]:
 box('Wing'+str(side),(side*2.3,-.8,1.03),(1.10,3.9,.12),craft,wall,.045,rot=(0,side*.13,side*-.07))
 cyl('Thruster'+str(side),(side*2.55,-1.8,1.1),.35,1.40,craft,alum,(math.pi/2,0,0));cyl('ThrusterNozzle'+str(side),(side*2.55,-2.51,1.1),.28,.05,craft,dark,(math.pi/2,0,0))
 curve('ShuttleGrabRail'+str(side),[(side*1.5,-3.5,1.2),(side*1.7,-3.5,1.5),(side*1.5,-3.5,2.0)],.035,craft,alum)
 for y in [-2.3,-.8,.7,2.2]:box('HullSmallPanel'+str(side)+str(y),(side*2.10,y,1.5),(.06,.70,.50),craft,wall,.03)
torus('ShuttleRearDock',(0,-4.17,1.35),1.16,.11,craft,alum,(math.pi/2,0,0))
# Large orbital habitat, distinct in scale and form from the small rescue craft.
orbital=group('ResetOrbitalStation');torus('HabitatRing',(0,0,8),12,.80,orbital,trim)
cyl('CentralPressureHub',(0,0,7.5),2.2,6.0,orbital,wall)
for i in range(8):
 a=i*math.pi/4;root=group('StationSpoke'+str(i),parent=orbital);root.rotation_euler[2]=a
 box('RadialPressureTunnel',(0,6.5,8),(.65,11.5,.70),root,trim,.20)
 cyl('HabitatModule',(0,11.8,8),.95,3.4,root,wall,(math.pi/2,0,0))
 for j in [-.8,0,.8]:box('HabitatWindow'+str(j),(0,13.53,8+j*.4),(.50,.02,.12),root,screen,.03)
for side in [-1,1]:
 root=group('SolarArray'+str(side),(side*4.3,0,4.0),orbital)
 box('SolarBoom',(side*5,0,0),(10,.20,.20),root,alum,.025)
 for j in range(6):
  box('SolarPanel'+str(j),(side*(1+j*1.3),0,.10),(1.24,5,.05),root,screen,.012)
  for k in [-1.8,-.6,.6,1.8]:box('SolarCellFrame'+str(j)+str(k),(side*(1+j*1.3),k,.135),(1.20,.018,.014),root,trim,.001)
curve('DockAccessTunnel',[(0,0,4.8),(0,0,2.1),(0,2.7,1.45),(0,6.5,1.45)],.92,orbital,wall)
torus('StationDockPort',(0,6.5,1.45),1.17,.13,orbital,alum,(math.pi/2,0,0))
# Separate glTF scenes keep model loading and source editing straightforward.
for root,name in [(ship,'ship-interior'),(station,'station-interior'),(craft,'rescue-craft'),(orbital,'orbital-station')]:
 if '--ship' in sys.argv and root==station:continue
 for o in list(root.children_recursive):
  if o.type=='CURVE':bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o;bpy.ops.object.convert(target='MESH')
 bpy.ops.object.select_all(action='DESELECT');root.select_set(True)
 for o in root.children_recursive:o.select_set(True)
 bpy.context.view_layer.objects.active=root;bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,name+'.glb'),export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_animations=False)
print('RESET ENVIRONMENT ASSETS COMPLETE',flush=True)
