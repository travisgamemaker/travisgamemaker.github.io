(function(Scratch) {
  'use strict';

  const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.min.js';

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      if (window.THREE) {
        resolve(); // Already loaded
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

      // Setup Three.js scene
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, 480 / 360, 0.1, 1000); // Match stage aspect ratio
      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this.renderer.setSize(480, 360);
      this.renderer.setClearColor(0x000000, 0); // Transparent background

      // Add light
      const light = new THREE.PointLight(0xffffff, 1);
      light.position.set(10, 10, 10);
      this.scene.add(light);

      // Set camera position
      this.camera.position.z = 5;

      // Append canvas into stage container
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
        console.warn('Could not find stage canvas. Appending to body as fallback.');
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
          }
        ]
      };
    }

    async setupScene() {
      if (this.initialized) {
        alert("A 3D scene already exists. Reload the project or remove the canvas manually.");
        return;
      }
      await this.init3DScene();
    }

    addCube(args) {
      if (!this.initialized) return;

      const geometry = new THREE.BoxGeometry();
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
