// I DIDN'T WRITE THIS, NEITHER DID A HUMAN. I WISH I KNEW HOW TO CODE IN JAVASCRIPT SO I COULD'VE.
// DON'T GIVE CREDIT TO ME AT ALL WHEN USING THIS PLEASE FOR THE LOVE OF GOD.

// PenguinMod 3D Extension using Three.js
// Full-featured toolkit: scene, camera, objects, materials, shaders, skybox, physics, post-processing

(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
        throw new Error('you gotta run it unsandboxed.');
  }

  //3D Engine
  const THREE_CDN = 'https://cdn.jsdelivr.net/npm/three@0.178.0/build/three.module.js';
  const GLTF_LOADER_CDN = 'https://cdn.jsdelivr.net/npm/three@0.178.0/examples/jsm/loaders/GLTFLoader.js';
  const POSTPROCESSING_CDN = 'https://cdn.jsdelivr.net/npm/three@0.178.0/examples/jsm/postprocessing/EffectComposer.js';

  //physics
  const CANNON_CDN = 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';

  function loadScript(url, module=false) {
    return new Promise((resolve, reject) => {
      if (module) {
        import(url).then(resolve).catch(reject);
      } else if (window.THREE && url === THREE_CDN) {
        resolve();
      } else {
        const s = document.createElement('script'); s.src = url; s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
      }
    });
  }

  class ThreeDExtension {
    constructor() {
      this.initialized = false;
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.objects = {};
      this.mixers = [];
      this.clock = null;
      this.isRendering = false;
      this.skybox = null;
      this.physicsWorld = null;
      this.enablePhysics = false;
      this.composer = null;
    }

    getInfo() {
      return { id: 'threejs3d', name: '3D Toolkit', blocks: [
        
        { blockType: Scratch.BlockType.LABEL, text: Scratch.translate("Rendering & Scene") },

        { opcode: 'createScene',                blockType: Scratch.BlockType.COMMAND, text: 'create 3D scene' },
        { opcode: 'createSceneAntiAliased',     blockType: Scratch.BlockType.COMMAND, text: 'create 3D scene with anti-aliasing' },
        { opcode: 'destroyScene',               blockType: Scratch.BlockType.COMMAND, text: 'destroy 3D scene' },
        { opcode: 'sceneExists',                blockType: Scratch.BlockType.BOOLEAN, text: 'scene exists?' },
        { opcode: 'setBackgroundColor',         blockType: Scratch.BlockType.COMMAND, text: 'set background color to [COLOR]', arguments:{COLOR:{type: Scratch.ArgumentType.STRING,defaultValue:'#000000'}}},
        { opcode: 'setLinearFog',               blockType: Scratch.BlockType.COMMAND, text: 'set linear fog color [COLOR] near [NEAR] far [FAR]', arguments: {COLOR: { type: Scratch.ArgumentType.STRING, defaultValue: '#88aaff' }, NEAR: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }, FAR: {type: Scratch.ArgumentType.NUMBER, defaultValue: 50 }}},
        { opcode: 'setExpFog',                  blockType: Scratch.BlockType.COMMAND, text: 'set exponential fog color [COLOR] density [DENSITY]', arguments: {COLOR:   { type: Scratch.ArgumentType.STRING, defaultValue: '#88aaff' }, DENSITY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.02 }}},
        { opcode: 'clearFog',                   blockType: Scratch.BlockType.COMMAND, text: 'clear fog'},

        "---",
        
        { opcode: 'renderSceneWithDelta',       blockType: Scratch.BlockType.COMMAND, text: 'render scene with delta [DELTA]', arguments: { DELTA: { type :Scratch.ArgumentType.NUMBER, defaultValue: 0.016 }}},
        { opcode: 'isRenderingScene',           blockType: Scratch.BlockType.BOOLEAN, text: 'rendering?' },
        { opcode: 'setRendererPixelRatio',      blockType: Scratch.BlockType.COMMAND, text: 'set renderer pixel ratio to [DPR] (0 = auto)', arguments: { DPR: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }}},
        { opcode: 'setRendererFixedResolution', blockType: Scratch.BlockType.COMMAND, text: 'set renderer fixed resolution width [W] height [H]', arguments: { W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 480 }, H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 360 }}},
        { opcode: 'toggleBackground',           blockType: Scratch.BlockType.COMMAND, text: 'background visible: [VISIBLE]', arguments: { VISIBLE: { type: Scratch.ArgumentType.BOOLEAN}}},

        { blockType: Scratch.BlockType.LABEL, text: Scratch.translate("Camera") },

        { opcode: 'getCameraCoordinate',        blockType: Scratch.BlockType.REPORTER, text: 'camera [AXIS] position', arguments: { AXIS: { type: Scratch.ArgumentType.STRING, menu: 'axisMenu'}}},
        { opcode: 'setCameraFOV',               blockType: Scratch.BlockType.COMMAND, text: 'set camera FOV to [FOV] degrees', arguments: { FOV: { type: Scratch.ArgumentType.NUMBER, defaultValue: 75}}},
        { opcode: 'getCameraFOV',               blockType: Scratch.BlockType.REPORTER, text: 'camera FOV' },
        { opcode: 'setCameraClipping',          blockType: Scratch.BlockType.COMMAND, text: 'set camera clipping near [NEAR] far [FAR]', arguments: { NEAR: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.1 }, FAR: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1000 }}},

        { blockType: Scratch.BlockType.LABEL, text: Scratch.translate("Objects & Materials") },

        { opcode: 'loadGLTFModel',              blockType: Scratch.BlockType.COMMAND, text: 'create object from glTF model [URL] as [ID]', arguments:{URL:{type:Scratch.ArgumentType.STRING},ID:{type:Scratch.ArgumentType.STRING}}},
        { opcode: 'replaceModel',               blockType: Scratch.BlockType.COMMAND, text: 'replace object [ID] model with glTF model [URL]', arguments:{ID:{type:Scratch.ArgumentType.STRING},URL:{type:Scratch.ArgumentType.STRING}}},
        { opcode: 'objectExists',               blockType: Scratch.BlockType.BOOLEAN, text: 'object [ID] exists?', arguments:{ID:{type:Scratch.ArgumentType.STRING}}},
        { opcode: 'getObjectCoordinate',        blockType: Scratch.BlockType.REPORTER, text: 'object [ID] [AXIS] position', arguments:{ID:{type:Scratch.ArgumentType.STRING},AXIS:{type:Scratch.ArgumentType.STRING,menu:'axisMenu'}}},
        { opcode: 'setMaterialColor',           blockType: Scratch.BlockType.COMMAND, text: 'set object [ID] material color to [COLOR]', arguments:{ID:{type:Scratch.ArgumentType.STRING},COLOR:{type:Scratch.ArgumentType.STRING}}},
        { opcode: 'setMaterialTexture',         blockType: Scratch.BlockType.COMMAND, text: 'set object [ID] texture to [URL]', arguments:{ID:{type:Scratch.ArgumentType.STRING},URL:{type:Scratch.ArgumentType.STRING}}},
        { opcode: 'setMaterialType',            blockType: Scratch.BlockType.COMMAND, text: 'set material type of [ID] to [TYPE]', arguments:{ID:{type:Scratch.ArgumentType.STRING},TYPE:{type:Scratch.ArgumentType.STRING,menu:'materialMenu'}}},
        { opcode: 'injectShader',               blockType: Scratch.BlockType.COMMAND, text: 'apply custom shader to [ID] (frag:[FRAG] vert:[VERT])', arguments:{ID:{type:Scratch.ArgumentType.STRING},FRAG:{type:Scratch.ArgumentType.STRING},VERT:{type:Scratch.ArgumentType.STRING}}},

        { blockType: Scratch.BlockType.LABEL, text: Scratch.translate("Skybox") },

        { opcode: 'loadSkybox',                 blockType: Scratch.BlockType.COMMAND, text: 'set skybox using cubemap URL [URL]', arguments:{URL:{type:Scratch.ArgumentType.STRING}}},

        { blockType: Scratch.BlockType.LABEL, text: Scratch.translate("Lights") },

        { opcode: 'addLight',                   blockType: Scratch.BlockType.COMMAND, text: 'add [TYPE] light at x:[X] y:[Y] z:[Z]', arguments:{TYPE:{type:Scratch.ArgumentType.STRING,menu:'lightMenu'},X:{type:Scratch.ArgumentType.NUMBER},Y:{type:Scratch.ArgumentType.NUMBER},Z:{type:Scratch.ArgumentType.NUMBER}}},

        { blockType: Scratch.BlockType.LABEL, text: Scratch.translate("Physics") },

        { opcode: 'initializePhysics',          blockType: Scratch.BlockType.COMMAND, text: 'initialize physics' },
        { opcode: 'addPhysicsTo',               blockType: Scratch.BlockType.COMMAND, text: 'add physics to [ID] mass [MASS]', arguments:{ID:{type:Scratch.ArgumentType.STRING},MASS:{type:Scratch.ArgumentType.NUMBER}}},

        { blockType: Scratch.BlockType.LABEL, text: Scratch.translate("Animations") },

        { opcode: 'playAnimationLooped',        blockType: Scratch.BlockType.COMMAND, text: 'play animation [NAME] on [ID] loop: [LOOP]', arguments:{NAME:{type:Scratch.ArgumentType.STRING},ID:{type:Scratch.ArgumentType.STRING},LOOP:{type:Scratch.ArgumentType.BOOLEAN}}},
        { opcode: 'stopAllAnimations',          blockType: Scratch.BlockType.COMMAND, text: 'stop all animations on [ID]', arguments:{ID:{type:Scratch.ArgumentType.STRING}}},
        { opcode: 'fadeAnimation',              blockType: Scratch.BlockType.COMMAND, text: 'fade from [FROM] to [TO] on [ID] over [SECONDS] sec', arguments:{FROM:{type:Scratch.ArgumentType.STRING},TO:{type:Scratch.ArgumentType.STRING},ID:{type:Scratch.ArgumentType.STRING},SECONDS:{type:Scratch.ArgumentType.NUMBER}}},
        { opcode: 'setAnimationSpeed',          blockType: Scratch.BlockType.COMMAND, text: 'set animation speed of [ID] to [SPEED]', arguments:{ID:{type:Scratch.ArgumentType.STRING},SPEED:{type:Scratch.ArgumentType.NUMBER}}}
        
      ],
      menus: {
        axisMenu: {
          acceptReporters: true, 
          items: [
            { text: 'x', value: 'x' },
            { text: 'y', value: 'y' },
            { text: 'z', value: 'z' }
          ] 
        },
        lightMenu: {
          acceptReporters: true, 
          items:[
            { text: 'ambient', value: 'ambient' },
            { text: 'point', value: 'point' },
            { text: 'directional', value: 'directional' },
          ] 
        },
        materialMenu: {
          acceptReporters: true, 
          items:[
            { text: 'basic', value: 'basic' },
            { text: 'phong', value: 'phong' },
            { text: 'standard', value: 'standard' },
          ]
        },
        onOffMenu: {
          acceptReporters: true, 
          items: ['on', 'off'] 
        }
      };
    }

  /* --------- Block Implementations --------- */

    async createSceneAntiAliased() {
      if (this.initialized) { alert('3D scene already exists!'); return; }
      await loadScript(THREE_CDN);
      this.clock = new THREE.Clock();
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, Scratch.vm.runtime.stageWidth/Scratch.vm.runtime.stageHeight, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true });
      this.renderer.setSize(Scratch.vm.runtime.stageWidth, Scratch.vm.runtime.stageHeight);
      const stage = document.querySelector('#scratch-stage .stage-canvas') || document.querySelector('#scratch-stage');
      stage.appendChild(this.renderer.domElement);
      this.initialized = true;
    }

    setLinearFog(args) {
      if (!this.scene || !this.renderer) { alert('Create a scene first.'); return; }
      const color = new THREE.Color(args.COLOR);
      const near = Math.max(0.0001, Number(args.NEAR));
      const far  = Math.max(near + 0.0001, Number(args.FAR));
      this.scene.fog = new THREE.Fog(color, near, far);
      // Optional: also tint clear color to match
      // this.renderer.setClearColor(color, 1);
    }

    setExpFog(args) {
      if (!this.scene || !this.renderer) { alert('Create a scene first.'); return; }
      const color = new THREE.Color(args.COLOR);
      const density = Math.max(0, Number(args.DENSITY));
      this.scene.fog = new THREE.FogExp2(color, density);
      // Optional: this.renderer.setClearColor(color, 1);
    }

    clearFog() {
      if (!this.scene) { alert('Create a scene first.'); return; }
      this.scene.fog = null;
    }


    async createScene() {
    if (this.initialized) { alert('3D scene already exists!'); return; }
    await loadScript(THREE_CDN);
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, Scratch.vm.runtime.stageWidth/Scratch.vm.runtime.stageHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha:true, antialias:false });
    this.renderer.setSize(Scratch.vm.runtime.stageWidth, Scratch.vm.runtime.stageHeight);
    const stage = document.querySelector('#scratch-stage .stage-canvas') || document.querySelector('#scratch-stage');
    stage.appendChild(this.renderer.domElement);
    this.initialized = true;
  }

  destroyScene() {
    if (!this.initialized) { alert('No 3D scene to destroy.'); return; }
    this.renderer.domElement.remove();
    this.scene = this.camera = this.renderer = null;
    this.objects = {}; this.mixers=[]; this.skybox=null;
    this.initialized=false;
  }

  sceneExists() { 
    return this.initialized; 
  }
  
  isRenderingScene() { 
    return this.isRendering; 
  }

  setRendererPixelRatio(args) {
  if (!this.renderer) { alert('Create a scene first.'); return; }
  const dpr = Number(args.DPR);
  const target = (dpr && dpr > 0) ? dpr : Math.max(1, window.devicePixelRatio || 1);
  this.renderer.setPixelRatio(target);
  }

  setRendererFixedResolution(args) {
    if (!this.initialized) { alert('Create a scene first.'); return; }
    const w = Math.max(1, Math.floor(Number(args.W)));
    const h = Math.max(1, Math.floor(Number(args.H)));
    this.renderer.setSize(w, h, false);
  }

  setCameraClipping(args) {
    if (!this.camera) { alert('Create a scene first.'); return; }
    const near = Math.max(0.0001, Number(args.NEAR));
    const far  = Math.max(near + 0.0001, Number(args.FAR));
    this.camera.near = near;
    this.camera.far  = far;
    this.camera.updateProjectionMatrix();
  }

  renderSceneWithDelta(args) {
    if (!this.initialized) { alert('Create a scene first.'); return; }
    const delta = parseFloat(args.DELTA);
    this.isRendering=true;
    // update animations
    this.mixers.forEach(m=>m.update(delta));
    // physics step
    if (this.enablePhysics && this.physicsWorld) this.physicsWorld.step(delta);
    // render
    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene,this.camera);
    this.isRendering=false;
  }

  getRenderedDataURL() {
    if (!this.initialized) { alert('Render a frame first.'); return ''; }
    this.renderer.render(this.scene,this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  setBackgroundColor(args) {
    if (!this.scene) { alert('Create a scene first.'); return; }
    this.renderer.setClearColor(new THREE.Color(args.COLOR));
  }

  toggleBackground(args) {
    if (!this.renderer) { alert('Create a scene first.'); return; }
    this.renderer.domElement.style.display = args.VISIBLE ? 'block' : 'none';
  }

  getCameraCoordinate(args) {
    if (!this.camera) { alert('Create a scene first.'); return 0; }
    return this.camera.position[args.AXIS];
  }

  setCameraFOV(args) {
    if (!this.camera) { alert('Create a scene first.'); return; }
    this.camera.fov = args.FOV; 
    this.camera.updateProjectionMatrix();
  }

  getCameraFOV() { return this.camera? this.camera.fov:0; }

  async loadGLTFModel(args) {
    await loadScript(GLTF_LOADER_CDN, true);
    const loader = new THREE.GLTFLoader();
    loader.load(args.URL, gltf=>{
      const model=gltf.scene; this.scene.add(model);
      this.objects[args.ID]=model;
      if (gltf.animations.length){
        const mixer=new THREE.AnimationMixer(model);
        model.mixer=mixer; model.animations=gltf.animations;
        this.mixers.push(mixer);
      }
    });
  }

  replaceModel(args) {
    const old=this.objects[args.ID]; if(!old) return;
    this.scene.remove(old); delete this.objects[args.ID];
    this.loadGLTFModel({URL:args.URL,ID:args.ID});
  }

  objectExists(args) { return !!this.objects[args.ID]; }

  getObjectCoordinate(args) {
    const obj=this.objects[args.ID];
    return obj? obj.position[args.AXIS]:0;
  }

  setMaterialColor(args) {
    const obj=this.objects[args.ID]; if(!obj?.material) return;
    obj.material.color=new THREE.Color(args.COLOR);
  }

  async setMaterialTexture(args) {
    const obj=this.objects[args.ID]; if(!obj?.material) return;
    const tex=new THREE.TextureLoader().load(args.URL);
    obj.material.map=tex; obj.material.needsUpdate=true;
  }

  setMaterialType(args) {
    const obj=this.objects[args.ID]; if(!obj) return;
    let mat;
    switch(args.TYPE.toLowerCase()){
      case 'basic': mat=new THREE.MeshBasicMaterial({color:obj.material.color}); break;
      case 'phong': mat=new THREE.MeshPhongMaterial({color:obj.material.color}); break;
      case 'standard': mat=new THREE.MeshStandardMaterial({color:obj.material.color}); break;
      default: return;
    }
    obj.material.dispose(); obj.material=mat;
  }

  injectShader(args) {
    const obj=this.objects[args.ID]; if(!obj) return;
    obj.material=new THREE.ShaderMaterial({
      vertexShader: args.VERT,
      fragmentShader: args.FRAG
    });
  }

  loadSkybox(args) {
    const urls=args.URL.split(',');
    new THREE.CubeTextureLoader().setPath('').load(urls,(tex)=>{
      this.scene.background=tex; this.skybox=tex;
    });
  }

  addLight(args) {
    let light;
    switch(args.TYPE){
      case 'ambient': light=new THREE.AmbientLight(0xffffff); break;
      case 'point': light=new THREE.PointLight(0xffffff); break;
      case 'directional': light=new THREE.DirectionalLight(0xffffff); break;
    }
    light.position.set(args.X,args.Y,args.Z);
    this.scene.add(light);
  }

  async initializePhysics() {
    await loadScript(CANNON_CDN);
    this.physicsWorld=new CANNON.World();
    this.physicsWorld.gravity.set(0,-9.82,0);
    this.enablePhysics=true;
  }

  addPhysicsTo(args) {
    if(!this.enablePhysics||!this.physicsWorld) { alert("Physics aren't initialized!"); return; }
    const obj=this.objects[args.ID]; if(!obj) return;
    const shape=new CANNON.Box(new CANNON.Vec3(1,1,1));
    const body=new CANNON.Body({mass:args.MASS,shape});
    this.physicsWorld.addBody(body);
    obj.userData.physicsBody=body;
  }

  async addPostProcessing(args) {
    await loadScript(POSTPROCESSING_CDN, true);
    this.composer=new THREE.EffectComposer(this.renderer);
    // user can specify effect type: blur, bloom etc—stub for future
  }

  playAnimationLooped(args) {
    const obj = this.objects[args.ID];
    if (!obj || !obj.animations || !obj.mixer) return;
    const clip = obj.animations.find(a => a.name === args.NAME);
    if (!clip) return;
    const action = obj.mixer.clipAction(clip);
    action.reset().play();
    action.setLoop(args.LOOP ? THREE.LoopRepeat : THREE.LoopOnce);
  }

  stopAllAnimations(args) {
    const obj = this.objects[args.ID];
    if (!obj || !obj.mixer) return;
    obj.mixer.stopAllAction();
  }

  fadeAnimation(args) {
    const obj = this.objects[args.ID];
    if (!obj || !obj.mixer) return;
    const from = obj.animations.find(a => a.name === args.FROM);
    const to = obj.animations.find(a => a.name === args.TO);
    if (!from || !to) return;
    const fromAction = obj.mixer.clipAction(from);
    const toAction = obj.mixer.clipAction(to);
    fromAction.crossFadeTo(toAction, args.SECONDS, false);
  }

  setAnimationSpeed(args) {
    const obj = this.objects[args.ID];
    if (!obj || !obj.mixer) return;
    obj.mixer.timeScale = args.SPEED;
  }
    
}

  Scratch.extensions.register(new ThreeDExtension());
})(Scratch);
