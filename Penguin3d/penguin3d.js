// I DIDN'T WRITE THIS, NEITHER DID A HUMAN. I WISH I KNEW HOW TO CODE IN JAVASCRIPT SO I COULD'VE.
// DON'T GIVE CREDIT TO ME AT ALL WHEN USING THIS PLEASE FOR THE LOVE OF GOD.

// PenguinMod 3D Extension using Three.js
// Full-featured toolkit: scene, camera, objects, materials, shaders, skybox, physics

(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
        throw new Error('you gotta run it unsandboxed.');
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
      this.debugPhysics = false;
      this.debugMeshes = {};
      // Keep sizes in sync with the Scratch stage
      this._resizeHandler = () => {
        const w = Scratch.vm.runtime.stageWidth;
        const h = Scratch.vm.runtime.stageHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h, false);
      };
    }

    // Modern ESM loader (no global THREE)
    async _ensureThree(version = 'latest') {
      if (this.THREE) return; // already loaded
      const base = `https://cdn.jsdelivr.net/npm/three@${version}`;
      // Load core
      this.THREE = await import(`${base}/build/three.module.js`);
      // Store module URLs for loaders you need
      this._threeUrls = {
        GLTFLoader: `${base}/examples/jsm/loaders/GLTFLoader.js`,
        CubeTextureLoader: `${base}/examples/jsm/loaders/CubeTextureLoader.js`,
      // add more here if needed (e.g., OrbitControls, FontLoader, TextGeometry)
      };
    }

    async _ensureRapier() {
      if (this.rapier) return;

      const rapierModule = await import('https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@0.12.1/rapier3d.js');
      await rapierModule.init();
      this.rapier = rapierModule;
      this.physicsWorld = new this.rapier.World({ x: 0, y: -9.81, z: 0 });
      this.physicsBodies = {}; // Map from ID to { body, collider }
      this.colliderSet = this.physicsWorld?.colliders;
    }


    // Convenience: get a GLTFLoader instance
    async _getGLTFLoader() {
      await this._ensureThree(); // ensures this.THREE is ready
      const { GLTFLoader } = await import(this._threeUrls.GLTFLoader);
      return new GLTFLoader();
    }

    // (Optional) CubeTextureLoader via jsm (rarely needed directly; see skybox note)
    async _getCubeTextureLoader() {
      await this._ensureThree();
      // Most people still use THREE.CubeTextureLoader global; with modules you can do:
      // In jsm, a cubemap is typically loaded with THREE.CubeTextureLoader from core,
      // which is available as a class on this.THREE namespace:
      return new this.THREE.CubeTextureLoader();
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
        { opcode: 'toggleBackground',           blockType: Scratch.BlockType.COMMAND, text: 'background visible: [VISIBLE]', arguments: { VISIBLE: { type: Scratch.ArgumentType.BOOLEAN}}},

        { blockType: Scratch.BlockType.LABEL, text: Scratch.translate("Camera") },

        { opcode: 'changeCameraAxis', blockType: Scratch.BlockType.COMMAND, text: 'change camera\'s [AXIS] position by [VALUE]', arguments: { AXIS: { type: Scratch.ArgumentType.STRING, menu: 'axisMenu' }, VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }}},
        { opcode: 'changeCameraPosition', blockType: Scratch.BlockType.COMMAND, text: 'change camera\'s position by x: [X] y: [Y] z: [Z]', arguments: { X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }}},
        { opcode: 'setCameraAxis', blockType: Scratch.BlockType.COMMAND, text: 'set camera\'s [AXIS] position to [VALUE]', arguments: { AXIS: { type: Scratch.ArgumentType.STRING, menu: 'axisMenu' }, VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }}},
        { opcode: 'setCameraPosition', blockType: Scratch.BlockType.COMMAND, text: 'set camera\'s position to x: [X] y: [Y] z: [Z]', arguments: { X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }}},

        "---",

        { opcode: 'rotateCameraAxis', blockType: Scratch.BlockType.COMMAND, text: 'rotate camera around [AXIS] by [DEGREES] degrees', arguments: { AXIS: { type: Scratch.ArgumentType.STRING, menu: 'axisMenu' }, DEGREES: { type: Scratch.ArgumentType.NUMBER, defaultValue: 15 }}},
        { opcode: 'setCameraRotation', blockType: Scratch.BlockType.COMMAND, text: 'set camera rotation to x: [X] y: [Y] z: [Z]', arguments: { X: { type: Scratch.ArgumentType.NUMBER }, Y: { type: Scratch.ArgumentType.NUMBER }, Z: { type: Scratch.ArgumentType.NUMBER }}},

        "---",
        
        { opcode: 'getCameraCoordinate',        blockType: Scratch.BlockType.REPORTER, text: 'camera [AXIS] position', arguments: { AXIS: { type: Scratch.ArgumentType.STRING, menu: 'axisMenu'}}},
        { opcode: 'getCameraRotation',        blockType: Scratch.BlockType.REPORTER, text: 'camera [AXIS] rotation', arguments: { AXIS: { type: Scratch.ArgumentType.STRING, menu: 'axisMenu'}}},

        "---",

        { opcode: 'setCameraFOV',               blockType: Scratch.BlockType.COMMAND, text: 'set camera FOV to [FOV] degrees', arguments: { FOV: { type: Scratch.ArgumentType.NUMBER, defaultValue: 75}}},
        { opcode: 'getCameraFOV',               blockType: Scratch.BlockType.REPORTER, text: 'camera FOV' },
        { opcode: 'setCameraClipping',          blockType: Scratch.BlockType.COMMAND, text: 'set camera clipping near [NEAR] far [FAR]', arguments: { NEAR: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.1 }, FAR: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1000 }}},

        { blockType: Scratch.BlockType.LABEL, text: Scratch.translate("Objects & Materials") },

        { opcode: 'loadGLTFModel',              blockType: Scratch.BlockType.COMMAND, text: 'create object from glTF model [URL] as [ID]', arguments:{URL:{type:Scratch.ArgumentType.STRING},ID:{type:Scratch.ArgumentType.STRING}}},
        { opcode: 'replaceModel',               blockType: Scratch.BlockType.COMMAND, text: 'replace object [ID] model with glTF model [URL]', arguments:{ID:{type:Scratch.ArgumentType.STRING},URL:{type:Scratch.ArgumentType.STRING}}},
        
        "---",

        { opcode: 'changeObjectAxis', blockType: Scratch.BlockType.COMMAND, text: 'change object [ID] [AXIS] position by [VALUE]', arguments: { ID: { type: Scratch.ArgumentType.STRING }, AXIS: { type: Scratch.ArgumentType.STRING, menu: 'axisMenu' }, VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }}},
        { opcode: 'changeObjectPosition', blockType: Scratch.BlockType.COMMAND, text: 'change object [ID] position by x: [X] y: [Y] z: [Z]', arguments: { ID: { type: Scratch.ArgumentType.STRING }, X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }}},
        { opcode: 'setObjectAxis', blockType: Scratch.BlockType.COMMAND, text: 'set object [ID] [AXIS] position to [VALUE]', arguments: { ID: { type: Scratch.ArgumentType.STRING }, AXIS: { type: Scratch.ArgumentType.STRING, menu: 'axisMenu' }, VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }}},
        { opcode: 'setObjectPosition', blockType: Scratch.BlockType.COMMAND, text: 'set object [ID] position to x: [X] y: [Y] z: [Z]', arguments: { ID: { type: Scratch.ArgumentType.STRING }, X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }}},
        { opcode: 'createPrimitive', blockType: Scratch.BlockType.COMMAND, text: 'create [TYPE] primitive as [ID]', arguments: { TYPE: { type: Scratch.ArgumentType.STRING, menu: 'primitiveMenu' }, ID: { type: Scratch.ArgumentType.STRING }}},

        
        "---",

        { opcode: 'rotateObjectAxis', blockType: Scratch.BlockType.COMMAND, text: 'rotate object [ID] around [AXIS] by [DEGREES] degrees', arguments: { ID: { type: Scratch.ArgumentType.STRING }, AXIS: { type: Scratch.ArgumentType.STRING, menu: 'axisMenu' }, DEGREES: { type: Scratch.ArgumentType.NUMBER, defaultValue: 15 }}},
        { opcode: 'setObjectRotation', blockType: Scratch.BlockType.COMMAND, text: 'set object [ID] rotation to x: [X] y: [Y] z: [Z]', arguments: { ID: { type: Scratch.ArgumentType.STRING }, X: { type: Scratch.ArgumentType.NUMBER }, Y: { type: Scratch.ArgumentType.NUMBER }, Z: { type: Scratch.ArgumentType.NUMBER }}},

        "---",
        
        { opcode: 'setObjectScale', blockType: Scratch.BlockType.COMMAND, text: 'set object [ID] scale to x: [X] y: [Y] z: [Z]', arguments: { ID: { type: Scratch.ArgumentType.STRING }, X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }, Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }, Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }}},

        "---",
        
        { opcode: 'getObjectCoordinate',        blockType: Scratch.BlockType.REPORTER, text: 'object [ID] [AXIS] position', arguments:{ID:{type:Scratch.ArgumentType.STRING},AXIS:{type:Scratch.ArgumentType.STRING,menu:'axisMenu'}}},
        { opcode: 'getObjectRotation',        blockType: Scratch.BlockType.REPORTER, text: 'object [ID] [AXIS] rotation', arguments:{ID:{type:Scratch.ArgumentType.STRING},AXIS:{type:Scratch.ArgumentType.STRING,menu:'axisMenu'}}},

        "---",

        { opcode: 'objectExists',               blockType: Scratch.BlockType.BOOLEAN, text: 'object [ID] exists?', arguments:{ID:{type:Scratch.ArgumentType.STRING}}},

        "---",

        { opcode: 'setMaterialColor',           blockType: Scratch.BlockType.COMMAND, text: 'set object [ID] material color to [COLOR]', arguments:{ID:{type:Scratch.ArgumentType.STRING},COLOR:{type:Scratch.ArgumentType.STRING}}},
        { opcode: 'setMaterialTexture',         blockType: Scratch.BlockType.COMMAND, text: 'set object [ID] texture to [URL]', arguments:{ID:{type:Scratch.ArgumentType.STRING},URL:{type:Scratch.ArgumentType.STRING}}},
        { opcode: 'setMaterialType',            blockType: Scratch.BlockType.COMMAND, text: 'set material type of [ID] to [TYPE]', arguments:{ID:{type:Scratch.ArgumentType.STRING},TYPE:{type:Scratch.ArgumentType.STRING,menu:'materialMenu'}}},
        { opcode: 'injectShader',               blockType: Scratch.BlockType.COMMAND, text: 'apply custom shader to [ID] (frag:[FRAG] vert:[VERT])', arguments:{ID:{type:Scratch.ArgumentType.STRING},FRAG:{type:Scratch.ArgumentType.STRING},VERT:{type:Scratch.ArgumentType.STRING}}},

        { blockType: Scratch.BlockType.LABEL, text: Scratch.translate("Physics") },

        { opcode: 'addPhysicsToObject', blockType: Scratch.BlockType.COMMAND, text: 'add physics to object [ID]', arguments: { ID: { type: Scratch.ArgumentType.STRING }}},
        { opcode: 'setCollisionShape', blockType: Scratch.BlockType.COMMAND, text: 'set object [ID] collider to [SHAPE]', arguments: { ID: { type: Scratch.ArgumentType.STRING }, SHAPE: { type: Scratch.ArgumentType.STRING, menu: 'shapeMenu' }}},

        { opcode: 'removePhysicsFromObject', blockType: Scratch.BlockType.COMMAND, text: 'remove physics from object [ID]', arguments: { ID: { type: Scratch.ArgumentType.STRING }}},
        { opcode: 'setObjectVelocity', blockType: Scratch.BlockType.COMMAND, text: 'set velocity of object [ID] x: [VX] y: [VY] z: [VZ]', arguments: { ID: { type: Scratch.ArgumentType.STRING }, VX: { type: Scratch.ArgumentType.NUMBER }, VY: { type: Scratch.ArgumentType.NUMBER }, VZ: { type: Scratch.ArgumentType.NUMBER }}},
        { opcode: 'objectIsTouchingAnything', blockType: Scratch.BlockType.BOOLEAN, text: 'object [ID] is touching anything?', arguments: { ID: { type: Scratch.ArgumentType.STRING }}},
        { opcode: 'objectIsTouchingObject', blockType: Scratch.BlockType.BOOLEAN, text: 'object [A] is touching [B]?', arguments: { A: { type: Scratch.ArgumentType.STRING }, B: { type: Scratch.ArgumentType.STRING }}},
        { opcode: 'toggleDebugPhysics', blockType: Scratch.BlockType.COMMAND, text: 'debug physics: [DEBUG]', arguments: { DEBUG: { type: Scratch.ArgumentType.BOOLEAN }}},

        { blockType: Scratch.BlockType.LABEL, text: Scratch.translate("Skybox") },

        { opcode: 'loadSkybox',                 blockType: Scratch.BlockType.COMMAND, text: 'set skybox using cubemap URLs: +X [URL1] −X [URL2] +Y [URL3] −Y [URL4] +Z [URL5] −Z [URL6]', arguments:{URL1:{type:Scratch.ArgumentType.STRING},URL2:{type:Scratch.ArgumentType.STRING},URL3:{type:Scratch.ArgumentType.STRING},URL4:{type:Scratch.ArgumentType.STRING},URL5:{type:Scratch.ArgumentType.STRING},URL6:{type:Scratch.ArgumentType.STRING}}},

        { blockType: Scratch.BlockType.LABEL, text: Scratch.translate("Lights") },

        { opcode: 'addLight',                   blockType: Scratch.BlockType.COMMAND, text: 'add [TYPE] light at x: [X] y: [Y] z: [Z]', arguments:{TYPE:{type:Scratch.ArgumentType.STRING,menu:'lightMenu'},X:{type:Scratch.ArgumentType.NUMBER},Y:{type:Scratch.ArgumentType.NUMBER},Z:{type:Scratch.ArgumentType.NUMBER}}},

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
        },
        shapeMenu: {
          acceptReporters: true,
          items: ['cuboid', 'sphere', 'capsule']
        },
        primitiveMenu: {
          acceptReporters: true,
          items: ['cube', 'sphere', 'plane', 'cylinder', 'cone']
        }
      }
    };
  }

  /* --------- Block Implementations --------- */

  rotateCameraAxis(args) {
    if (!this.camera) return;
    const radians = this.THREE.MathUtils.degToRad(Number(args.DEGREES));
    this.camera.rotation[args.AXIS] += radians;
  }

  setCameraRotation(args) {
    if (!this.camera) return;
    this.camera.rotation.set(
      this.THREE.MathUtils.degToRad(Number(args.X)),
      this.THREE.MathUtils.degToRad(Number(args.Y)),
      this.THREE.MathUtils.degToRad(Number(args.Z))
    );
  }

  rotateObjectAxis(args) {
    const obj = this.objects[args.ID];
    if (!obj) return;
    const radians = this.THREE.MathUtils.degToRad(Number(args.DEGREES));
    obj.rotation[args.AXIS] += radians;

    if (this.physicsBodies[args.ID]) {
      obj.updateMatrixWorld();
      obj.getWorldQuaternion(obj.quaternion);
      this.physicsBodies[args.ID].body.setRotation(obj.quaternion, true);
    }
  }

  setObjectRotation(args) {
    const obj = this.objects[args.ID];
    if (!obj) return;
    obj.rotation.set(
      this.THREE.MathUtils.degToRad(Number(args.X)),
      this.THREE.MathUtils.degToRad(Number(args.Y)),
      this.THREE.MathUtils.degToRad(Number(args.Z))
    );
    if (this.physicsBodies[args.ID]) {
      obj.updateMatrixWorld();
      obj.getWorldQuaternion(obj.quaternion);
      this.physicsBodies[args.ID].body.setRotation(obj.quaternion, true);
    }
  }
  

  changeCameraAxis(args) {
    if (!this.camera) return;
    this.camera.position[args.AXIS] += Number(args.VALUE);
  }

  changeCameraPosition(args) {
    if (!this.camera) return;
    this.camera.position.x += Number(args.X);
    this.camera.position.y += Number(args.Y);
    this.camera.position.z += Number(args.Z);
  }

  setCameraAxis(args) {
    if (!this.camera) return;
    this.camera.position[args.AXIS] = Number(args.VALUE);
  }

  setCameraPosition(args) {
    if (!this.camera) return;
    this.camera.position.set(Number(args.X), Number(args.Y), Number(args.Z));
  }

  changeObjectAxis(args) {
    const obj = this.objects[args.ID];
    if (!obj) return;
    obj.position[args.AXIS] += Number(args.VALUE);
    if (this.physicsBodies[args.ID]) {
      this.physicsBodies[args.ID].body.setTranslation(obj.position, true);
    }
  }

  createPrimitive(args) {
    if (!this.scene || !this.THREE) return;

    let geometry;
    switch (args.TYPE.toLowerCase()) {
      case 'cube':     geometry = new this.THREE.BoxGeometry(1, 1, 1); break;
      case 'sphere':   geometry = new this.THREE.SphereGeometry(0.5, 16, 16); break;
      case 'plane':    geometry = new this.THREE.PlaneGeometry(1, 1); break;
      case 'cylinder': geometry = new this.THREE.CylinderGeometry(0.5, 0.5, 1, 16); break;
      case 'cone':     geometry = new this.THREE.ConeGeometry(0.5, 1, 16); break;
      default: return;
    }

    const material = new this.THREE.MeshStandardMaterial({ color: 0xcccccc });
    const mesh = new this.THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    this.objects[args.ID] = mesh;
  }


  changeObjectPosition(args) {
    const obj = this.objects[args.ID];
    if (!obj) return;
    obj.position.x += Number(args.X);
    obj.position.y += Number(args.Y);
    obj.position.z += Number(args.Z);
    if (this.physicsBodies[args.ID]) {
      this.physicsBodies[args.ID].body.setTranslation(obj.position, true);
    }
  }

  setObjectScale(args) {
    const obj = this.objects[args.ID];
    if (!obj) return;
    obj.scale.set(Number(args.X), Number(args.Y), Number(args.Z));
  }


  setObjectAxis(args) {
    const obj = this.objects[args.ID];
    if (!obj) return;
    obj.position[args.AXIS] = Number(args.VALUE);
    if (this.physicsBodies[args.ID]) {
      this.physicsBodies[args.ID].body.setTranslation(obj.position, true);
    }
  }

  setObjectPosition(args) {
    const obj = this.objects[args.ID];
    if (!obj) return;
    obj.position.set(Number(args.X), Number(args.Y), Number(args.Z));
    if (this.physicsBodies[args.ID]) {
      this.physicsBodies[args.ID].body.setTranslation(obj.position, true);
    }
  }


  async createSceneAntiAliased() {
    if (this.initialized) { alert('3D scene already exists!'); return; }
    await this._ensureThree('latest');
    this.clock = new this.THREE.Clock();
    this.scene = new this.THREE.Scene();
    this.camera = new this.THREE.PerspectiveCamera(
      75,
      Scratch.vm.runtime.stageWidth / Scratch.vm.runtime.stageHeight,
      0.1, 1000
    );
    this.renderer = new this.THREE.WebGLRenderer({ alpha: true, antialias: true });
  
    const baseCanvas = Scratch?.vm?.runtime?.renderer?.canvas;
    if (!baseCanvas || !baseCanvas.parentElement) {
      alert('Could not find the stage canvas. Are you running unsandboxed and after the project has loaded?');
      return;
    }
    const container = baseCanvas.parentElement;
    container.style.position = container.style.position || 'relative';
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.pointerEvents = 'none';

    this.renderer.setPixelRatio(Math.max(1, window.devicePixelRatio || 1));
    this.renderer.setSize(Scratch.vm.runtime.stageWidth, Scratch.vm.runtime.stageHeight, false);
    container.appendChild(this.renderer.domElement);

    this.initialized = true;
    window.addEventListener('resize', this._resizeHandler);
  }

  setLinearFog(args) {
    if (!this.scene || !this.renderer) { alert('Create a scene first.'); return; }
    const color = new this.THREE.Color(args.COLOR);
    const near = Math.max(0.0001, Number(args.NEAR));
    const far  = Math.max(near + 0.0001, Number(args.FAR));
    this.scene.fog = new this.THREE.Fog(color, near, far);
    // Optional: also tint clear color to match
    // this.renderer.setClearColor(color, 1);
  }

  setExpFog(args) {
    if (!this.scene || !this.renderer) { alert('Create a scene first.'); return; }
    const color = new this.THREE.Color(args.COLOR);
    const density = Math.max(0, Number(args.DENSITY));
    this.scene.fog = new this.THREE.FogExp2(color, density);
    // Optional: this.renderer.setClearColor(color, 1);
  }

  clearFog() {
    if (!this.scene) { alert('Create a scene first.'); return; }
    this.scene.fog = null;
  }


  async createScene() {
    if (this.initialized) { alert('3D scene already exists!'); return; }
    await this._ensureThree('latest');
    this.clock = new this.THREE.Clock();
    this.scene = new this.THREE.Scene();
    this.camera = new this.THREE.PerspectiveCamera(
      75,
      Scratch.vm.runtime.stageWidth / Scratch.vm.runtime.stageHeight,
      0.1, 1000
    );
    this.renderer = new this.THREE.WebGLRenderer({ alpha: true, antialias: false });
  
    const baseCanvas = Scratch?.vm?.runtime?.renderer?.canvas;
    if (!baseCanvas || !baseCanvas.parentElement) {
      alert('Could not find the stage canvas. Are you running unsandboxed and after the project has loaded?');
      return;
    }
    const container = baseCanvas.parentElement;
    container.style.position = container.style.position || 'relative';
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.pointerEvents = 'none';

    this.renderer.setPixelRatio(Math.max(1, window.devicePixelRatio || 1));
    this.renderer.setSize(Scratch.vm.runtime.stageWidth, Scratch.vm.runtime.stageHeight, false);
    container.appendChild(this.renderer.domElement);

    this.initialized = true;
    window.addEventListener('resize', this._resizeHandler);
  }

  destroyScene() {
    if (!this.initialized) { alert('No 3D scene to destroy.'); return; }

    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
      this._resizeHandler = null;
    }
    
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
    if (this.physicsWorld) {
      this.physicsWorld.step();
      // Update Three.js objects from physics
      for (const [id, { body }] of Object.entries(this.physicsBodies)) {
        const obj = this.objects[id];
        if (!obj) continue;
        const pos = body.translation();
        const rot = body.rotation();
        obj.position.set(pos.x, pos.y, pos.z);
        obj.quaternion.set(rot.x, rot.y, rot.z, rot.w);
        
        if (this.debugPhysics) {
          let dbg = this.debugMeshes[id];
          if (!dbg) continue;
          const halfExtents = this._getHalfExtentsFromObject({ ID: id });
          dbg.scale.set(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);
          dbg.position.copy(obj.position);
          dbg.quaternion.copy(obj.quaternion);
        }
      }
    }
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
    this.renderer.setClearColor(new this.THREE.Color(args.COLOR));
  }

  toggleBackground(args) {
    if (!this.renderer) { alert('Create a scene first.'); return; }
    this.renderer.domElement.style.display = args.VISIBLE ? 'block' : 'none';
  }

  getCameraCoordinate(args) {
    if (!this.camera) { alert('Create a scene first.'); return 0; }
    return this.camera.position[args.AXIS];
  }

  getCameraRotation(args) {
    if (!this.camera) { alert('Create a scene first.'); return 0; }
    return this.camera.rotation[args.AXIS];
  }

  setCameraFOV(args) {
    if (!this.camera) { alert('Create a scene first.'); return; }
    this.camera.fov = args.FOV; 
    this.camera.updateProjectionMatrix();
  }

  getCameraFOV() { return this.camera? this.camera.fov:0; }

  async loadGLTFModel(args) {
    if (!this.scene) return;

      const loader = await this._getGLTFLoader();
      loader.load(
        args.URL,
        (gltf) => {
        const model = gltf.scene;
        this.scene.add(model);
        this.objects[args.ID] = model;

        if (gltf.animations && gltf.animations.length) {
          const mixer = new this.THREE.AnimationMixer(model);
          model.mixer = mixer;
          model.animations = gltf.animations;
          this.mixers.push(mixer);
        }
      },
      undefined,
      (err) => {
        alert('Failed to load GLTF: ' + (err?.message || err));
      }
    );
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

  getObjectRotation(args) {
    const obj=this.objects[args.ID];
    return obj? obj.rotation[args.AXIS]:0;
  }

  setMaterialColor(args) {
    const obj=this.objects[args.ID]; if(!obj?.material) return;
    obj.material.color=new this.THREE.Color(args.COLOR);
  }

  async setMaterialTexture(args) {
    const obj=this.objects[args.ID]; if(!obj?.material) return;
    const tex=new this.THREE.TextureLoader().load(args.URL);
    obj.material.map=tex; obj.material.needsUpdate=true;
  }

  setMaterialType(args) {
    const obj=this.objects[args.ID]; if(!obj) return;
    let mat;
    switch(args.TYPE.toLowerCase()){
      case 'basic': mat=new this.THREE.MeshBasicMaterial({color:obj.material.color}); break;
      case 'phong': mat=new this.THREE.MeshPhongMaterial({color:obj.material.color}); break;
      case 'standard': mat=new this.THREE.MeshStandardMaterial({color:obj.material.color}); break;
      default: return;
    }
    obj.material.dispose(); obj.material=mat;
  }

  injectShader(args) {
    const obj=this.objects[args.ID]; if(!obj) return;
    obj.material=new this.THREE.ShaderMaterial({
      vertexShader: args.VERT,
      fragmentShader: args.FRAG
    });
  }

  loadSkybox(args) {
    if (!this.scene) {
      alert('Create a scene first.');
      return;
    }

    // Preferred path: 6 labeled URLs in +X, -X, +Y, -Y, +Z, -Z order.
    const six = [args.URL1, args.URL2, args.URL3, args.URL4, args.URL5, args.URL6]
      .map(u => (u ?? '').trim())
      .filter(Boolean);

    // Backward-compatible: allow prior single comma-separated "URL"
    // e.g., "px.png,nx.png,py.png,ny.png,pz.png,nz.png"
    let faces = six.length === 6 ? six : null;
    if (!faces) {
      const legacy = (args.URL ?? '').split(',').map(s => s.trim()).filter(Boolean);
        if (legacy.length === 6) {
        faces = legacy;
      }
    }

    if (!faces || faces.length !== 6) {
      alert('Provide six URLs (url1..url6) in +X, -X, +Y, -Y, +Z, -Z order.');
      return;
    }

    const loader = new this.THREE.CubeTextureLoader();
    if (loader.setCrossOrigin) loader.setCrossOrigin('anonymous'); // safe if supported
    loader.setPath(''); // keep path neutral; you’re passing full URLs

    loader.load(
      faces,
      (tex) => {
        this.scene.background = tex;
        this.skybox = tex;
      },
      undefined,
      (err) => {
        alert('Failed to load skybox: ' + (err?.message || err));
      }
    );
  }


  addLight(args) {
    let light;
    switch(args.TYPE){
      case 'ambient': light=new this.THREE.AmbientLight(0xffffff); break;
      case 'point': light=new this.THREE.PointLight(0xffffff); break;
      case 'directional': light=new this.THREE.DirectionalLight(0xffffff); break;
    }
    light.position.set(args.X,args.Y,args.Z);
    this.scene.add(light);
  }

  _getHalfExtentsFromObject(args) {
    const obj = this.objects[args.ID];
    if (!obj) return { x: 1, y: 1, z: 1 }; // fallback

    const box = new this.THREE.Box3().setFromObject(obj);
    const size = new this.THREE.Vector3();
    box.getSize(size);

    return {
      x: Math.max(0.001, size.x / 2),
      y: Math.max(0.001, size.y / 2),
      z: Math.max(0.001, size.z / 2)
    };
  }


  playAnimationLooped(args) {
    const obj = this.objects[args.ID];
    if (!obj || !obj.animations || !obj.mixer) return;
    const clip = obj.animations.find(a => a.name === args.NAME);
    if (!clip) return;
    const action = obj.mixer.clipAction(clip);
    action.reset().play();
    action.setLoop(args.LOOP ? this.THREE.LoopRepeat : this.THREE.LoopOnce);
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

  async addPhysicsToObject(args) {
    await this._ensureRapier();
    const obj = this.objects[args.ID];
    if (!obj || this.physicsBodies[args.ID]) return;

    const box = new this.THREE.Box3().setFromObject(obj);
    const size = new this.THREE.Vector3();
    box.getSize(size);
    const scale = new this.THREE.Vector3().copy(size).multiplyScalar(0.5);

    const rbDesc = this.rapier.RigidBodyDesc.dynamic().setTranslation(obj.position.x, obj.position.y, obj.position.z);
    const body = this.physicsWorld.createRigidBody(rbDesc);

    const colliderDesc = this.rapier.ColliderDesc.cuboid(scale.x, scale.y, scale.z);
    const collider = this.physicsWorld.createCollider(colliderDesc, body);

    this.physicsBodies[args.ID] = { body, collider };

    // Create debug mesh immediately if debug is enabled
    if (this.debugPhysics) {
      const geo = new this.THREE.BoxGeometry(scale.x * 2, scale.y * 2, scale.z * 2);
      const mat = new this.THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
      const dbgMesh = new this.THREE.Mesh(geo, mat);
      dbgMesh.position.copy(obj.position);
      this.scene.add(dbgMesh);
      this.debugMeshes[args.ID] = dbgMesh;
    }
  }

  setCollisionShape(args) {
    const obj = this.objects[args.ID];
    if (!obj || !this.rapier || !this.physicsWorld || !this.physicsBodies[args.ID]) return;

    // Remove old collider
    const { body, collider } = this.physicsBodies[args.ID];
    this.physicsWorld.removeCollider(collider, false);

    // Get object size for scale
    const box = new this.THREE.Box3().setFromObject(obj);
    const size = new this.THREE.Vector3();
    box.getSize(size);

    const halfExtents = {
      x: Math.max(0.001, size.x / 2),
      y: Math.max(0.001, size.y / 2),
      z: Math.max(0.001, size.z / 2)
    };

    const radius = Math.max(halfExtents.x, halfExtents.z) || 0.5;
    const shapeType = args.SHAPE.toLowerCase();

    const colliderDesc = {
      cuboid: this.rapier.ColliderDesc.cuboid(halfExtents.x, halfExtents.y, halfExtents.z),
      sphere: this.rapier.ColliderDesc.ball(radius),
      capsule: this.rapier.ColliderDesc.capsuleY(halfExtents.y * 0.5, radius)
    }[shapeType];

    if (!colliderDesc) return;

    const newCollider = this.physicsWorld.createCollider(colliderDesc, body);
    this.physicsBodies[args.ID].collider = newCollider;
  }


  removePhysicsFromObject(args) {
    const data = this.physicsBodies[args.ID];
    if (!data) return;
    this.physicsWorld.removeRigidBody(data.body);
    delete this.physicsBodies[args.ID];
    if (this.debugMeshes[args.ID]) {
      this.scene.remove(this.debugMeshes[args.ID]);
      delete this.debugMeshes[args.ID];
    }
  }

  setObjectVelocity(args) {
    const data = this.physicsBodies[args.ID];
    if (!data) return;
    data.body.setLinvel({ x: Number(args.VX), y: Number(args.VY), z: Number(args.VZ) }, true);
  }

  objectIsTouchingAnything(args) {
    const data = this.physicsBodies[args.ID];
    if (!data) return false;
    const collider = data.collider;
    const pairs = this.physicsWorld.narrowPhase.contactPairsWith(collider.handle);
    return pairs.length > 0;
  }

  objectIsTouchingObject(args) {
    const a = this.physicsBodies[args.A];
    const b = this.physicsBodies[args.B];
    if (!a || !b) return false;
    const pairs = this.physicsWorld.narrowPhase.contactPairsWith(a.collider.handle);
    return pairs.some(pair => pair.collider2 === b.collider.handle);
  }

  toggleDebugPhysics(args) {
    this.debugPhysics = !!args.DEBUG;

    // Remove old debug meshes if turning off
    if (!this.debugPhysics) {
      for (const mesh of Object.values(this.debugMeshes)) {
        this.scene.remove(mesh);
      }
      this.debugMeshes = {};
    }
  }



}

  Scratch.extensions.register(new ThreeDExtension());
})(Scratch);
