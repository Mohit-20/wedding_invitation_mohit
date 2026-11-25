import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

(() => {
  const canvas = document.getElementById("storyWorldCanvas");
  const stage = document.querySelector(".story-stage");
  const track = document.querySelector(".story-scroll-track");
  if (!canvas || !stage || !track) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = () => window.matchMedia("(max-width: 760px)").matches;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas, alpha: true, antialias: !isMobile(),
      powerPreference: "high-performance"
    });
  } catch (error) {
    console.warn("3D scene unavailable; the original storybook parallax is still active.", error);
    canvas.hidden = true;
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile() ? 1.25 : 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0.1, isMobile() ? 13.8 : 10.8);
  const ambient = new THREE.HemisphereLight(0xffe8d3, 0x71616b, 2.15);
  scene.add(ambient);
  const keyLight = new THREE.DirectionalLight(0xffd4ae, 3.0);
  keyLight.position.set(-4, 7, 8); scene.add(keyLight);
  const fillLight = new THREE.PointLight(0xf2a88c, 34, 25);
  fillLight.position.set(3, 2, 5); scene.add(fillLight);
  const rimLight = new THREE.PointLight(0x9baf91, 24, 22);
  rimLight.position.set(-5, -1, -4); scene.add(rimLight);

  const mat = (color, roughness=.55, metalness=.02, extra={}) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
  const makeGroup = (x=0) => {
    const g = new THREE.Group();
    g.position.x = x - (isMobile() ? .25 : 2.05);
    scene.add(g);
    return g;
  };
  const addBox = (parent, size, material, position, rotation=[0,0,0]) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.position.set(...position); mesh.rotation.set(...rotation); parent.add(mesh);
    return mesh;
  };
  const addSphere = (parent, radius, material, position, scale=[1,1,1]) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 24), material);
    mesh.position.set(...position); mesh.scale.set(...scale); parent.add(mesh);
    return mesh;
  };
  const addLabel = (parent, title, subtitle, color="#65443c") => {
    const c=document.createElement("canvas"); c.width=900;c.height=360;
    const ctx=c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle="rgba(255,248,235,.94)";
    ctx.strokeStyle="rgba(181,119,91,.75)";ctx.lineWidth=7;
    ctx.beginPath();ctx.roundRect(12,12,876,336,26);ctx.fill();ctx.stroke();
    ctx.textAlign="center";ctx.fillStyle=color;
    ctx.font="italic 76px Georgia";ctx.fillText(title,450,155);
    ctx.font="bold 27px Arial";ctx.letterSpacing="7px";
    ctx.fillStyle="#a66c55";ctx.fillText(subtitle.toUpperCase(),450,235);
    const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2.9,1.16),new THREE.MeshBasicMaterial({map:texture,transparent:true,side:THREE.DoubleSide}));
    mesh.position.set(0,-1.65,.4);parent.add(mesh);return mesh;
  };
  const gold=mat(0xd6a76f,.25,.82);
  const cream=mat(0xfff0d9,.82,.02);
  const burgundy=mat(0x754653,.38,.18);
  const rose=mat(0xc77e75,.42,.16);
  const sage=mat(0x83977a,.9,0);
  const scenes=[];

  // 01 — A proper hinged storybook: cover, page block, spine, page stack and gold corners.
  const book=makeGroup(0);
  const bookBase=new THREE.Group();book.add(bookBase);
  addBox(bookBase,[3.9,2.65,.28],mat(0xf0dfc7,.92),[0,0,0]);
  addBox(bookBase,[3.78,2.52,.035],cream,[0,0,.17]);
  addBox(bookBase,[.22,2.72,.34],burgundy,[-1.88,0,0]);
  for(let i=0;i<7;i++) addBox(bookBase,[3.66,.018,.025],mat(i%2?0xe8d5bb:0xf9ecd8,.9),[0,-1.12+i*.065,.2]);
  const coverPivot=new THREE.Group();coverPivot.position.set(-1.82,0,.22);bookBase.add(coverPivot);
  addBox(coverPivot,[1.86,2.62,.16],burgundy,[.93,0,0]);
  addBox(coverPivot,[1.68,2.42,.025],gold,[.93,0,.09]);
  const coverArt=new THREE.Mesh(new THREE.PlaneGeometry(1.57,2.27),new THREE.MeshBasicMaterial({color:0x754653}));
  coverArt.position.set(.93,0,.11);coverPivot.add(coverArt);
  const coverTitle=addLabel(coverPivot,"Mohit & Akanksha","our little story","#754653");
  coverTitle.position.set(.93,0,.13);coverTitle.scale.set(.5,.75,1);
  for(const [x,y] of [[.13,1.14],[1.73,1.14],[.13,-1.14],[1.73,-1.14]]) {
    const corner=new THREE.Mesh(new THREE.SphereGeometry(.075,16,12),gold);corner.position.set(x,y,.12);coverPivot.add(corner);
  }
  const pageTurners=[];
  for(let i=0;i<4;i++){
    const pivot=new THREE.Group();pivot.position.set(-1.72,0,.21+i*.006);bookBase.add(pivot);
    const page=addBox(pivot,[1.7,2.45,.018],mat(i%2?0xfff5e4:0xf7e8d3,.96),[.85,0,0]);
    pageTurners.push(pivot);
  }
  scenes.push({group:book,center:0,coverPivot,pageTurners});

  // 02 — The first message: phone in perspective with raised chat bubbles.
  const phoneGroup=makeGroup(7);
  const phoneBody=addBox(phoneGroup,[1.9,3.5,.22],mat(0x292b3b,.26,.55),[-.1,0,0],[.04,-.16,-.04]);
  addBox(phoneGroup,[1.72,3.28,.035],mat(0xf6e9dc,.78),[-.1,0,.13],[.04,-.16,-.04]);
  addBox(phoneGroup,[.38,.045,.025],mat(0x8a7778),[-.1,1.55,.16],[0,-.16,0]);
  const bubble1=addLabel(phoneGroup,"Hi!","26 May · Jeevansathi","#fff4e5");
  bubble1.position.set(.8,1.3,.55);bubble1.scale.set(.68,.52,1);
  const bubble2=addLabel(phoneGroup,"Kaisa aahe?","Akanksha","#68483f");
  bubble2.position.set(-1.45,.1,.7);bubble2.scale.set(.76,.54,1);
  const bubble3=addLabel(phoneGroup,"Bas zinda hai","Mohit 😂","#68483f");
  bubble3.position.set(.9,-.85,.65);bubble3.scale.set(.76,.54,1);
  const phoneHalo=new THREE.Mesh(new THREE.TorusGeometry(2.3,.018,10,100),new THREE.MeshBasicMaterial({color:0xc9826e,transparent:true,opacity:.6}));
  phoneHalo.position.z=-.6;phoneGroup.add(phoneHalo);
  scenes.push({group:phoneGroup,center:1});

  // 03 — Two little family homes, each with a roof, windows, door and warm lights.
  const homes=makeGroup(14);
  function buildHouse(parent,x,wall,roof) {
    const g=new THREE.Group();g.position.set(x,-.1,0);parent.add(g);
    addBox(g,[1.65,1.3,1.25],mat(wall,.88),[0,-.35,0]);
    const roofMesh=new THREE.Mesh(new THREE.ConeGeometry(1.3,.92,4),mat(roof,.8));
    roofMesh.position.set(0,.78,0);roofMesh.rotation.y=Math.PI/4;g.add(roofMesh);
    addBox(g,[.4,.78,.09],mat(0x6b4b49),[0,-.63,.67]);
    for(const wx of [-.48,.48]){
      addBox(g,[.3,.34,.07],mat(0xffd99c,.3,0,{emissive:0xd98e53,emissiveIntensity:.32}),[wx,-.22,.67]);
    }
    const lamp=new THREE.PointLight(0xffc88c,2.3,4);lamp.position.set(0,.1,1.2);g.add(lamp);
    return g;
  }
  buildHouse(homes,-1.35,0xd4a78d,0x81515c);
  buildHouse(homes,1.35,0xb7bb91,0x687d69);
  for(let i=0;i<22;i++){
    const t=i/21;
    addSphere(homes,.035,gold,[-1.25+2.5*t,-1.35+Math.sin(t*Math.PI)*-.12,.65]);
  }
  addLabel(homes,"Two homes","one family").position.set(0,1.85,.2);
  scenes.push({group:homes,center:2});

  // 04 — Matheran: a layered mountain diorama, tiny trees and a warm sun.
  const hills=makeGroup(21);
  const hillColors=[0x6d806b,0x8e9b78,0xb78d78,0x52685f];
  for(let layer=0;layer<3;layer++){
    for(let i=0;i<7;i++){
      const h=1.6+((i*7+layer*3)%9)*.23;
      const cone=new THREE.Mesh(new THREE.ConeGeometry(1.15+layer*.12,h,5),mat(hillColors[(i+layer)%4],.95));
      cone.position.set(-4.2+i*1.35,-.8-layer*.18,-.8-layer*.7);cone.rotation.y=.25;hills.add(cone);
    }
  }
  const sun=addSphere(hills,.65,mat(0xf4c68f,.35,0,{emissive:0xeaa66d,emissiveIntensity:.35}),[2.8,2.1,-1.3]);
  for(let i=0;i<15;i++){
    const x=-4.4+i*.62, height=.6+(i%5)*.17;
    const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.035,.06,height*.75,7),mat(0x665045));
    trunk.position.set(x,-1.3+height*.3,.35);hills.add(trunk);
    const crown=new THREE.Mesh(new THREE.ConeGeometry(.28,height,7),mat(i%2?0x728568:0x8b9876));
    crown.position.set(x,-1.25+height*.7,.35);hills.add(crown);
  }
  addLabel(hills,"Matheran","22 August · A little detour").position.set(0,-2.1,.5);
  scenes.push({group:hills,center:3});

  // 05 — Sakharpuda: two interlocked 3D rings and a cut-gem centerpiece.
  const rings=makeGroup(28);
  const ringMat=mat(0xe8c17d,.19,.88);
  const ringA=new THREE.Mesh(new THREE.TorusGeometry(.9,.12,24,120),ringMat);
  ringA.position.set(-.5,.15,.15);ringA.rotation.set(1.18,.3,.24);rings.add(ringA);
  const ringB=new THREE.Mesh(new THREE.TorusGeometry(.9,.12,24,120),mat(0xffe7bd,.17,.9));
  ringB.position.set(.5,.15,.2);ringB.rotation.set(1.18,-.3,-.24);rings.add(ringB);
  const diamond=new THREE.Mesh(new THREE.OctahedronGeometry(.33,1),mat(0xfff1df,.1,.45,{emissive:0x9c6574,emissiveIntensity:.4}));
  diamond.position.set(0,.9,.3);rings.add(diamond);
  const halo=new THREE.Mesh(new THREE.TorusGeometry(2.05,.015,10,120),new THREE.MeshBasicMaterial({color:0xd9a56d,transparent:true,opacity:.7}));
  halo.position.z=-.5;rings.add(halo);
  addLabel(rings,"A promise","28 July · Sakharpuda").position.set(0,-1.8,.3);
  scenes.push({group:rings,center:4});

  // A real framed photograph using the supplied storybook artwork, not a placeholder image.
  const photoScene=makeGroup(35);
  const photoFrame=new THREE.Group();photoScene.add(photoFrame);
  addBox(photoFrame,[3.25,3.55,.2],gold,[0,0,0]);
  addBox(photoFrame,[3.04,3.34,.08],mat(0xfff0dc,.8),[0,0,.12]);
  const photoMat=new THREE.MeshBasicMaterial({color:0xf4dfca});
  const photo=new THREE.Mesh(new THREE.PlaneGeometry(2.9,3.18),photoMat);photo.position.z=.18;photoFrame.add(photo);
  const loader=new THREE.TextureLoader();
  loader.load("assets/mohit-akanksha-storybook-couple.jpg",texture=>{
    texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
    photo.material.map=texture;photo.material.color.set(0xffffff);photo.material.needsUpdate=true;
  },undefined,error=>console.warn("Couple illustration could not load into 3D frame.",error));
  const hearts=[];
  for(let i=0;i<9;i++){
    const heart=new THREE.Mesh(new THREE.IcosahedronGeometry(.12,1),mat(0xd98779,.4,0,{emissive:0x5b2735,emissiveIntensity:.15}));
    heart.position.set((Math.random()-.5)*5,(Math.random()-.5)*4,.4+Math.random());photoScene.add(heart);hearts.push(heart);
  }
  addLabel(photoScene,"From Hi to forever","Mohit & Akanksha").position.set(0,-2.25,.4);
  scenes.push({group:photoScene,center:5});

  // Floating paper petals in real 3D space.
  const petals=[];
  const petalMaterial=[mat(0xe6a58e,.65),mat(0xf0d19e,.7),mat(0xd6b7a1,.72)];
  for(let i=0;i<(isMobile()?24:52);i++){
    const mesh=new THREE.Mesh(new THREE.SphereGeometry(.13,12,8),petalMaterial[i%3]);
    mesh.scale.set(.65,.22,.08);
    mesh.position.set((Math.random()-.5)*22,(Math.random()-.5)*10,-2-Math.random()*5);
    mesh.userData={phase:Math.random()*Math.PI*2,speed:.4+Math.random()*.8,baseY:mesh.position.y};
    scene.add(mesh);petals.push(mesh);
  }

  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);};
  let progress=0,targetProgress=0,raf=0,lastWidth=0,lastHeight=0;
  const resize=()=>{
    const w=stage.clientWidth,h=stage.clientHeight;
    if(!w||!h)return;
    renderer.setSize(w,h,false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,isMobile()?1.25:1.8));
    camera.aspect=w/h;camera.updateProjectionMatrix();lastWidth=w;lastHeight=h;
  };
  const getProgress=()=>{
    const rect=track.getBoundingClientRect();
    const travel=Math.max(1,track.offsetHeight-window.innerHeight);
    return clamp(-rect.top/travel,0,1)*5;
  };
  const onScroll=()=>{targetProgress=getProgress();};
  addEventListener("scroll",onScroll,{passive:true});
  addEventListener("resize",resize,{passive:true});
  resize();onScroll();

  const clock=new THREE.Clock();
  function render(){
    raf=requestAnimationFrame(render);
    const elapsed=clock.getElapsedTime();
    const dt=Math.min(clock.getDelta(),.05);
    if(lastWidth!==stage.clientWidth||lastHeight!==stage.clientHeight)resize();
    targetProgress=getProgress();
    progress=THREE.MathUtils.damp(progress,targetProgress,reduceMotion?30:5.5,dt);
    const mobile=isMobile();
    const active=Math.min(4,Math.floor(progress));
    const local=progress-active;
    const sceneBlend=smooth(.1,.9,local);
    const chapterCenter=active+sceneBlend;
    const worldX=chapterCenter*7;
    const desiredZ=mobile?13.8:10.8;
    camera.position.x=THREE.MathUtils.damp(camera.position.x,worldX,.09,dt);
    camera.position.y=THREE.MathUtils.damp(camera.position.y,mobile?-.15:.12,.08,dt);
    camera.position.z=THREE.MathUtils.damp(camera.position.z,desiredZ,.08,dt);
    camera.lookAt(worldX,0,0);

    scenes.forEach((entry,index)=>{
      const d=Math.abs(progress-entry.center);
      const visibility=1-smooth(.62,1.08,d);
      entry.group.visible=visibility>.015;
      entry.group.position.y=Math.sin(elapsed*.65+index)*.075;
      entry.group.rotation.y=Math.sin(elapsed*.34+index*.8)*.045;
      entry.group.scale.setScalar(.91+visibility*.11);
    });

    const bookEntry=scenes[0];
    if(bookEntry){
      const open=smooth(.04,.8,progress);
      bookEntry.coverPivot.rotation.y=-open*1.9;
      bookEntry.pageTurners.forEach((page,i)=>{
        const turn=smooth(.18+i*.12,.62+i*.12,progress);
        page.rotation.y=-turn*(.28+i*.08);
      });
    }
    ringA.rotation.z=elapsed*.22;ringB.rotation.z=-elapsed*.2;
    diamond.rotation.y=elapsed*.62;diamond.rotation.x=elapsed*.3;
    sun.material.emissiveIntensity=.25+Math.sin(elapsed*.5)*.1;
    hearts.forEach((h,i)=>{h.position.y+=Math.sin(elapsed+i)*.0015;h.rotation.y=elapsed*.25+i;});
    petals.forEach(p=>{
      p.position.y=p.userData.baseY+Math.sin(elapsed*p.userData.speed+p.userData.phase)*.28;
      p.rotation.z=Math.sin(elapsed*.6+p.userData.phase)*.65;
    });
    const hour=Number(new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",hourCycle:"h23"}).format(new Date()));
    const mood=hour>=5&&hour<11?0xffdfb4:hour>=11&&hour<16?0xffe7c5:hour>=16&&hour<19?0xf1b18e:0x9eabd3;
    const tint=new THREE.Color(mood);
    ambient.color.lerp(tint,.012);keyLight.color.lerp(tint,.012);
    renderer.render(scene,camera);
  }
  render();
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden){cancelAnimationFrame(raf);}else{clock.start();render();}
  });
})();
