"""Detailed reusable ship/station sets for the new Episode 1. Blender Z-up / -Y front."""
import bpy,math,os,sys,random
import numpy as np
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));OUT=os.path.join(ROOT,'public/fake-sos');random.seed(115)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def group(n,p=(0,0,0),parent=None):
 o=bpy.data.objects.new(n,None);bpy.context.collection.objects.link(o);o.location=p;o.parent=parent;return o
def mat(n,c,r=.75,m=.0,emit=0):
 q=bpy.data.materials.new(n);q.use_nodes=True;p=q.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*c,1);p.inputs['Roughness'].default_value=r;p.inputs['Metallic'].default_value=m
 if emit:p.inputs['Emission Color'].default_value=(*c,1);p.inputs['Emission Strength'].default_value=emit
 return q
wall=mat('Graphite powder-coated station panels',(.062,.066,.073),.81,.32);trim=mat('Worn structural alloy',(.15,.185,.21),.63,.52);floor=mat('Worn non-slip deck',(.041,.045,.050),.88,.25);dark=mat('Dark recesses',(.007,.014,.022),.93);white=mat('Printed paper and ceramic',(.70,.70,.65),.80);warm=mat('Warm practical light',(.72,.53,.30),.48,0,2.2);cool=mat('Cool practical light',(.30,.43,.52),.55,0,1.5);red=mat('Emergency red paint',(.30,.022,.014),.68,.13);mugred=mat('Personal red ceramic mug',(.36,.045,.022),.35);seat=mat('Teal woven seat',(.050,.065,.073),.91);screen=mat('Unlit dark glass',(.003,.012,.021),.25,.20);rubber=mat('Rubber and cables',(.010,.018,.024),.95);alum=mat('Scratched steel',(.18,.22,.25),.46,.65)
# Real baked wear color, used consistently by the final WebGL renderer.
rng=np.random.default_rng(84);size=512;y,x=np.mgrid[0:size,0:size];v=.92+.06*np.sin(x*.071)*np.cos(y*.053)+rng.normal(0,.018,(size,size))
for i in range(105):
 px=rng.integers(0,size);py=rng.integers(0,size);length=int(rng.integers(4,55));v[max(0,py-1):py+1,px:min(size,px+length)]+=.12
rgb=np.stack([v*.041,v*.045,v*.050,np.ones_like(v)],-1);im=bpy.data.images.new('deck-wear',width=size,height=size,alpha=True);im.pixels.foreach_set(rgb.astype(np.float32).ravel());im.filepath_raw=os.path.join(OUT,'deck-wear.png');im.file_format='PNG';im.save();nodes=floor.node_tree.nodes;tex=nodes.new('ShaderNodeTexImage');tex.image=im;mapping=nodes.new('ShaderNodeMapping');mapping.inputs['Scale'].default_value=(8,8,8);uv=nodes.new('ShaderNodeTexCoord');floor.node_tree.links.new(uv.outputs['UV'],mapping.inputs['Vector']);floor.node_tree.links.new(mapping.outputs['Vector'],tex.inputs['Vector']);floor.node_tree.links.new(tex.outputs['Color'],nodes.get('Principled BSDF').inputs['Base Color'])
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
 box('Keyboard',(0,.02,.904),(.48,.17,.018),root,dark,.006)
 for i in range(3):box('AbandonedDocument'+str(i),(-.11+i*.08,-.42+i*.04,.8975+i*.004),(.29,.36,.003),root,white,.001,rot=(0,0,-.13+i*.12))
 cup(root,(.22,-.55,.896),white,'WarmCup');return root

# Physical recorded-SOS apparatus behind a real inspection hatch.
door=group('FakeSOSDoor')
leaf=group('FakeLockedLeaf',(0,10.80,0),door)
for name,p,size in [('LeftDoorSlab',(-.90,0,1.46),(.26,.16,2.92)),('RightDoorSlab',(.90,0,1.46),(.26,.16,2.92)),('TopDoorSlab',(0,0,2.24),(1.58,.16,1.36)),('LowerDoorSlab',(0,0,.365),(1.58,.16,.51)),('WireNotchLeft',(-.585,0,.055),(.41,.16,.11)),('WireNotchRight',(.235,0,.055),(1.11,.16,.11))]:box(name,p,size,leaf,wall,.025)
for x in [-.80,.80]:box('InspectionFrameSide'+str(x),(x,-.12,1.09),(.045,.06,.97),leaf,alum,.009)
for z in [.62,1.56]:box('InspectionFrameEdge'+str(z),(0,-.12,z),(1.64,.06,.045),leaf,alum,.009)
hatch=group('InspectionShutter',(0,-.155,.62),leaf);box('InspectionCover',(0,0,.47),(1.53,.045,.91),hatch,trim,.025)
for x in [-.63,.63]:box('ShutterHandle'+str(x),(x,-.036,.24),(.026,.035,.16),hatch,rubber,.007)
box('InspectionLatch',(.93,-.16,1.17),(.11,.055,.10),leaf,red,.010)
# The compartment remains visibly empty except for the speaker and wired recorder.
box('CommsBackWall',(0,11.62,1.28),(2.1,.12,2.55),door,dark,.02)
box('CommsShelf',(0,11.14,.70),(1.50,.52,.055),door,trim,.015)
speaker=group('RecordedKnockSpeaker',(-.40,11.08,1.08),door)
box('SpeakerCabinet',(0,0,0),(.55,.25,.56),speaker,wall,.045)
torus('SpeakerRubberSurround',(0,-.138,0),.193,.018,speaker,rubber,(math.pi/2,0,0))
cone=group('SpeakerCone',(0,-.142,0),speaker)
# A real conical diaphragm, not a UI icon.
vs=[];fs=[];N=64
for rad,depth in [(0,-.041),(.055,-.046),(.12,-.024),(.18,0)]:
 for i in range(N):a=i/N*math.pi*2;vs.append((rad*math.cos(a),depth,rad*math.sin(a)))
for j in range(3):
 for i in range(N):a=j*N+i;b=j*N+(i+1)%N;fs.append((a,b,b+N,a+N))
me=bpy.data.meshes.new('FlexibleSpeakerCone');me.from_pydata(vs,[],fs);me.update();o=bpy.data.objects.new('PhysicalSpeakerDiaphragm',me);bpy.context.collection.objects.link(o);o.parent=cone;o.data.materials.append(rubber)
cyl('SpeakerDustCap',(0,-.047,0),.048,.014,cone,dark,(math.pi/2,0,0))
rec=group('SOSRecorder',(.38,11.07,1.09),door);box('CommsRecorderBody',(0,0,0),(.61,.26,.53),rec,wall,.032)
for side in [-1,1]:
 reel=group('RecorderReel'+('L'if side<0 else'R'),(side*.142,-.148,.10),rec)
 cyl('TapeReel'+str(side),(0,0,0),.103,.021,reel,alum,(math.pi/2,0,0));cyl('TapeHub'+str(side),(0,-.016,0),.027,.028,reel,dark,(math.pi/2,0,0))
 for i in range(3):
  a=i/3*math.pi*2;cyl('ReelWindow'+str(side)+str(i),(.061*math.cos(a),-.014,.061*math.sin(a)),.025,.009,reel,dark,(math.pi/2,0,0))
box('PlaybackButton',(0,-.148,-.128),(.14,.022,.062),rec,warm,.009)
curve('RecordingSignalWire',[(-.33,10.93,.83),(-.21,10.88,.77),(-.02,10.88,.77),(.15,10.93,.83),(.19,11.02,.86)],.013,door,mat('Signal cable orange insulation',(.75,.27,.042),.9))
curve('CommunicationsUplink',[(.66,11.04,1.05),(.79,11.18,1.06),(.78,11.35,1.55),(.4,11.53,1.65)],.016,door,rubber)
curve('ExposedSignalLead',[(-.33,10.93,.83),(-.35,10.85,.40),(-.35,10.80,.07),(-.35,10.62,.055),(-.42,10.35,.055)],.013,door,mat('Orange clue cable',(.75,.27,.042),.9))
# Industrial docking platform; bevels, grating, rails and service details.
dock=group('DockingVestibule')
for j in range(8):
 z=-5.5-j*.5;box('BridgeDeckPanel'+str(j),(0,z,-.075),(3.1,.485,.15),dock,floor,.018)
 for x in [-1.36,1.36]:box('DeckHazardMark'+str(j)+str(x),(x,z,.006),(.16,.24,.008),dock,warm,.003)
 for x in [-.9,-.5,-.1,.3,.7,1.1]:box('NonSlipRidge'+str(j)+str(x),(x,z,.008),(.18,.012,.006),dock,alum,.002)
for side in [-1,1]:
 for j in range(5):
  z=-5.6-j*.8;box('VestibuleRailPost'+str(side)+str(j),(side*1.58,z,.50),(.055,.055,1.0),dock,alum,.012)
 for h in [.45,.95]:curve('VestibuleRail'+str(side)+str(h),[(side*1.58,-5.4,h),(side*1.58,-9.0,h)],.023,dock,alum)
 for j in range(3):box('OuterHullPanel'+str(side)+str(j),(side*(2.05+j*.36),-5.68,1.55),(.34,.30,3.1),dock,wall,.05)
 box('PressureBeacon'+str(side),(side*1.48,-5.32,2.75),(.11,.17,.16),dock,red,.025)
barrier=group('SafetyBarrier',parent=dock);gate=group('BarrierLeaf',(0,-5.52,0),barrier)
box('SafetyDoorPressurePanel',(0,0,1.45),(2.42,.12,2.90),gate,wall,.035)
for x in [-.83,0,.83]:box('BarrierStiffener'+str(x),(x,-.082,1.45),(.07,.035,2.75),gate,trim,.009)
box('BarrierRubberSeal',(0,0,.032),(2.45,.18,.064),gate,rubber,.016)
for j in range(12):box('BarrierHazardStripe'+str(j),(-1.10+j*.20,-.084,.16),(.11,.009,.14),gate,warm if j%2 else dark,.004)
for x in [-1.18,1.18]:box('GateSlideChannel'+str(x),(x,-5.52,1.51),(.085,.23,3.02),barrier,alum,.014)
box('EmergencyHoldPanel',(.98,-5.72,1.18),(.29,.15,.36),barrier,red,.025);box('EmergencyHoldButton',(.98,-5.81,1.20),(.15,.045,.12),barrier,warm,.014)
# Loose tethered panel responds to the departure blast; no random monster.
debris=group('LooseCeilingPanel',(1.95,-6.35,2.5),dock);box('FallingServicePanel',(0,0,0),(.55,.90,.035),debris,trim,.015)
for n,root in [('fake-sos-door',door),('docking-vestibule',dock)]:
 bpy.ops.object.select_all(action='DESELECT')
 def select(o):
  o.select_set(True)
  for c in o.children:select(c)
 select(root);bpy.context.view_layer.objects.active=root;bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,n+'.glb'),export_format='GLB',use_selection=True,export_apply=True)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'fake-sos-environments.blend'))
print('FAKE SOS PHYSICAL SETS COMPLETE',flush=True)
