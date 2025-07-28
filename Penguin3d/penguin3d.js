(function(Scratch) {
  'use strict';

  const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.min.js';

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      if (window.THREE) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  class ThreeJSExtension {
    constructor() {
      this.initialized = false;
    }

    async init3DScene() {
      if (this.initialized) return;

      await loadScript(THREE_URL);

      const width = 480;
      const height = 360;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xffffff); // white for visibility

      this.camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
      this.camera.position.z = 5;

      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);

      // Lighting that actually works
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      this.scene.add(ambientLight);
      this.scene.add(directionalLight);

      // Attach canvas to stage container
      const stageCanvas = document.querySelector('#scratch-stage canvas') || document.querySelector('canvas');
      if (stageCanvas) {
        const container = stageCanvas.parentElement;
        container.appendChild(this.renderer.domElement);
        const style = this.renderer.domElement.style;
        style.position = 'absolute';
        style.top = '0px';
        style.left = '0px';
        style.width = stageCanvas.width + 'px';
        style.height = stageCanvas.height + 'px';
        style.pointerEvents = 'none';
        style.zIndex = '10';
      } else {
        console.warn('Stage not found, appending to body as fallback');
        document.body.appendChild(this.renderer.domElement);
      }

      this.initialized = true;
    }

    getInfo() {
      return {
        id: 'threejs3d',
        name: 'Three.js 3D',
        blocks: [
          {
            opcode: 'setupScene',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create 3D scene',
          },
          {
            opcode: 'addCube',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add cube at x: [X] y: [Y] z: [Z]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            }
          },
          {
            opcode: 'renderScene',
            blockType: Scratch.BlockType.COMMAND,
            text: 'render 3D scene',
          },
          {
            opcode: 'setCameraPosition',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set camera position x: [X] y: [Y] z: [Z]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
            }
          },
          {
            opcode: 'setCameraRotation',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set camera rotation x: [X] y: [Y] z: [Z] (degrees)',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              }
          },
          {
            opcode: 'setCameraFOV',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set camera FOV to [FOV] degrees',
            arguments: {
              FOV: { type: Scratch.ArgumentType.NUMBER, defaultValue: 75 },
            }
          },
          {
            opcode: 'getCameraFOV',
            blockType: Scratch.BlockType.REPORTER,
            text: 'camera FOV',
          },
          {
            opcode: 'destroyScene',
            blockType: Scratch.BlockType.COMMAND,
            text: 'destroy 3D scene',
          }
        ]
      };
    }

    setCameraPosition(args) {
      if (!this.camera) return;
      this.camera.position.set(args.X, args.Y, args.Z);
    }

    setCameraRotation(args) {
      if (!this.camera) return;
      const toRadians = deg => (deg * Math.PI) / 180;
      this.camera.rotation.set(toRadians(args.X), toRadians(args.Y), toRadians(args.Z));
    }


    async setupScene() {
      if (this.initialized) {
        alert('A 3D scene already exists, ya dummy. Use the "Destroy 3D scene" block to get rid of it.');
        return;
      }
      await this.init3DScene();
    }

    destroyScene() {
      if (!this.initialized) {
         alert("There are no scenes to destroy. You'll have to create one.");
         return;
      }

      // Remove renderer canvas from DOM
      if (this.renderer && this.renderer.domElement) {
        this.renderer.domElement.remove();
      }

      // Dispose all objects in the scene to free memory
      this.scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

        // Dispose renderer
        this.renderer.dispose();

        // Clear references
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.initialized = false;
    }

    setCameraFOV(args) {
      if (!this.camera) return;

      const fov = Number(args.FOV);
      if (isNaN(fov) || fov <= 0 || fov >= 180) {
        alert("WOAH, BUSTER! FOV must be a number between 1 and 179.");
        return;
      }

      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
    }

    getCameraFOV() {
      if (!this.camera) return 0;
      return this.camera.fov;
    }

    addCube(args) {
      if (!this.initialized) return;

      const geometry = new THREE.BoxGeometry(1, 1, 1); // standard size cube
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(args.X, args.Y, args.Z);
      this.scene.add(cube);
    }

    renderScene() {
      if (!this.initialized) return;
      this.renderer.render(this.scene, this.camera);
    }
  }

  Scratch.extensions.register(new ThreeJSExtension());
})(Scratch);
