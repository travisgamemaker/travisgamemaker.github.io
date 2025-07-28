(function(Scratch) {
  'use strict';

  // Dynamically load Three.js from CDN
  const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.min.js';

  // Helper to load external JS
  function loadScript(url) {
    return new Promise((resolve, reject) => {
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
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(640, 480);

      // Attach to document
      document.body.appendChild(this.renderer.domElement);

      // Set up lighting
      const light = new THREE.PointLight(0xffffff);
      light.position.set(10, 10, 10);
      this.scene.add(light);

      this.camera.position.z = 5;

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
