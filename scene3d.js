/**
 * ============================================================================
 * 3D SCENE CONTROLLER (Three.js WebGL)
 * 1st Anniversary Web - "Blue Rose of Fire & Ice" Theme
 * True Flat Butterfly Ribbon Bow with Swallowtail Tails & 4-Way Explosion Box
 * ============================================================================
 */

class LoveUniverseScene {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.state = 'GIFT_BOX'; // 'GIFT_BOX', 'TRANSITIONING', 'UNIVERSE', 'PLANET_FOCUS'
    this.currentThemeName = 'BLUE_ROSE'; // Default: 'BLUE_ROSE' (as requested)
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    
    // Gift Box 3D Objects
    this.giftBoxGroup = new THREE.Group();
    this.boxBasePlate = null;
    this.boxWalls = {
      front: null,
      back: null,
      left: null,
      right: null,
    };
    this.boxLidGroup = new THREE.Group();
    this.boxBowGroup = new THREE.Group();
    this.boxSparkles = null;
    this.boxLight = null;
    this.innerHeartGroup = new THREE.Group();
    this.pedestal = null;

    // Materials dictionary for dynamic theme switching
    this.materials = {};
    this.lights = {};

    // Universe Objects
    this.universeGroup = new THREE.Group();
    this.starfield = null;
    this.planets = [];
    this.constellationLine = null;
    this.meteors = [];
    this.hoveredPlanet = null;
    this.focusedPlanetIndex = -1;

    // Camera animation targets
    this.targetCameraPos = new THREE.Vector3(0, 2.7, 6.8);
    this.targetLookAt = new THREE.Vector3(0, 0.45, 0);
    this.currentLookAt = new THREE.Vector3(0, 0.45, 0);

    // Callbacks
    this.onPlanetHover = null;
    this.onPlanetLeave = null;
    this.onPlanetClick = null;
    this.onBoxClick = null;

    this.clock = new THREE.Clock();
  }

  // Theme definitions (Blue Rose & Golden Flame vs Pastel Love)
  static get THEMES() {
    return {
      BLUE_ROSE: {
        name: 'Blue Rose & Fire Flame',
        boxColor: 0x112845,       // Deep Sapphire Velvet Navy
        boxEmissive: 0x061122,
        innerColor: 0x1b406b,     // Royal Blue Velvet
        ribbonColor: 0xffffff,    // Pure Diamond Silk White
        ribbonEmissive: 0xe0f7fa, // Icy Cyan Shimmer
        cushionColor: 0x0c1e36,
        heartColor: 0x2196f3,     // Blue Rose Core
        heartEmissive: 0x0d47a1,
        pedestalColor: 0x122947,
        ambientColor: 0xe0f2fe,
        keyLightColor: 0xfff8ed,
        rimLightColor: 0xff9900,  // Golden Flame Accent
        coolRimColor: 0x38ef7d,   // Ice Mint/Teal
        fogColor: 0x050811,
      },
      PASTEL_PINK: {
        name: 'Pastel Love',
        boxColor: 0xff6694,
        boxEmissive: 0x2d0818,
        innerColor: 0xff99bb,
        ribbonColor: 0xffffff,
        ribbonEmissive: 0xffffff,
        cushionColor: 0xff99bb,
        heartColor: 0xff2a6d,
        heartEmissive: 0xaa0033,
        pedestalColor: 0xffb8cf,
        ambientColor: 0xffe0eb,
        keyLightColor: 0xffffff,
        rimLightColor: 0xff4076,
        coolRimColor: 0x4ef2d2,
        fogColor: 0x060210,
      }
    };
  }

  init() {
    const theme = LoveUniverseScene.THEMES[this.currentThemeName];

    // 1. Scene setup with deep dark cosmic isolation
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(theme.fogColor, 0.012);

    // 2. Camera setup
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(46, aspect, 0.1, 1000);

    // 3. Renderer setup with high-contrast tone mapping & soft shadows
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 4. Controls setup
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxDistance = 55;
      this.controls.minDistance = 3.2;
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 1.0;
      this.controls.target.set(0, 0.35, 0);
    }

    // 5. Lighting: Warm vs Cool Fire & Ice Contrast
    this.setupLighting(theme);

    // 6. Build 3D Explosion Gift Box
    this.buildGiftBox(theme);

    // 6.1 Initialize responsive camera & box position for current aspect ratio
    this.updateCameraForAspect(aspect);

    // 7. Build Universe & Galaxy
    this.buildUniverse(theme);

    // Initially hide the universe completely
    this.universeGroup.visible = false;
    this.scene.add(this.universeGroup);
    this.scene.add(this.giftBoxGroup);

    // 8. Event listeners
    this.bindEvents();

    // 9. Start render loop
    this.animate();
  }

  setupLighting(theme) {
    this.lights.ambient = new THREE.AmbientLight(theme.ambientColor, 0.85);
    this.scene.add(this.lights.ambient);

    // Key Light (Warm Sunlight / Flame Warmth)
    this.lights.key = new THREE.DirectionalLight(theme.keyLightColor, 1.45);
    this.lights.key.position.set(6, 12, 8);
    this.lights.key.castShadow = true;
    this.lights.key.shadow.mapSize.width = 2048;
    this.lights.key.shadow.mapSize.height = 2048;
    this.lights.key.shadow.bias = -0.0004;
    this.lights.key.shadow.radius = 2.5;
    this.scene.add(this.lights.key);

    // Front fill light
    this.lights.front = new THREE.DirectionalLight(0xffffff, 0.95);
    this.lights.front.position.set(0, 4, 8);
    this.scene.add(this.lights.front);

    // Fire/Golden Flame Rim Light
    this.lights.flameRim = new THREE.DirectionalLight(theme.rimLightColor, 1.25);
    this.lights.flameRim.position.set(8, -3, -5);
    this.scene.add(this.lights.flameRim);

    // Ice Cyan/Teal Rim Light (Fire & Ice contrast)
    this.lights.coolRim = new THREE.DirectionalLight(theme.coolRimColor, 1.0);
    this.lights.coolRim.position.set(-8, 6, -6);
    this.scene.add(this.lights.coolRim);

    // Internal burst point light inside gift box
    this.boxLight = new THREE.PointLight(theme.rimLightColor, 0, 22);
    this.boxLight.position.set(0, 0.4, 0);
    this.giftBoxGroup.add(this.boxLight);
  }

  /* =========================================================================
     CIRCULAR GLOW SPRITE TEXTURE FOR SOFT DUST & CONFETTI
     ========================================================================= */
  createGlowParticleTexture() {
    if (this._glowParticleTex) return this._glowParticleTex;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.85)');
    grad.addColorStop(0.6, 'rgba(114, 239, 221, 0.45)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    this._glowParticleTex = new THREE.CanvasTexture(canvas);
    return this._glowParticleTex;
  }

  /* =========================================================================
     DYNAMIC CAMERA DISTANCE & OFFSET Y FOR MOBILE VERTICAL VIEWPORT
     ========================================================================= */
  updateCameraForAspect(aspect) {
    if (this.state === 'GIFT_BOX') {
      if (aspect < 1) {
        // Mobile portrait: dynamically calculate Z distance & lift gift box up to upper screen
        const zDist = Math.max(7.2, Math.min(10.5, 6.2 / aspect));
        this.camera.position.set(0, 2.0, zDist);
        this.giftBoxGroup.position.set(0, 1.05, 0);
      } else {
        // Desktop / Landscape
        this.camera.position.set(0, 1.4, 6.4);
        this.giftBoxGroup.position.set(0, 0.35, 0);
      }
      const targetY = this.giftBoxGroup.position.y;
      this.camera.lookAt(0, targetY, 0);
      if (this.controls) {
        this.controls.target.set(0, targetY, 0);
      }
    }
  }

  /* =========================================================================
     BUILD 3D EXPLOSION GIFT BOX (SYMMETRICAL 4 WALLS + TRUE FLAT RIBBON BOW)
     ========================================================================= */
  buildGiftBox(theme) {
    const boxSize = 2.5;
    const boxHeight = 2.2;
    const wallThick = 0.08;
    const ribWidth = 0.42;
    const ribThick = 0.015;

    this.giftBoxGroup.position.set(0, 0.35, 0);

    // 1. MATERIALS (Blue Rose Sapphire & Pure White Silk)
    this.materials.box = new THREE.MeshStandardMaterial({
      color: theme.boxColor,
      roughness: 0.28,
      metalness: 0.18,
      emissive: theme.boxEmissive,
      emissiveIntensity: 0.28,
    });

    this.materials.inner = new THREE.MeshStandardMaterial({
      color: theme.innerColor,
      roughness: 0.38,
      metalness: 0.08,
    });

    // Pure White Silk Ribbon (Crisp white with luminous sheen)
    this.materials.ribbon = new THREE.MeshStandardMaterial({
      color: theme.ribbonColor,
      roughness: 0.22,
      metalness: 0.15,
      emissive: theme.ribbonEmissive,
      emissiveIntensity: 0.32,
    });

    // 2. CIRCULAR FROSTED PEDESTAL UNDERNEATH
    const pedGeo = new THREE.CylinderGeometry(2.8, 3.1, 0.12, 64);
    this.materials.pedestal = new THREE.MeshStandardMaterial({
      color: theme.pedestalColor,
      roughness: 0.25,
      metalness: 0.15,
      transparent: true,
      opacity: 0.8,
    });
    this.pedestal = new THREE.Mesh(pedGeo, this.materials.pedestal);
    this.pedestal.position.set(0, -boxHeight / 2 - 0.06, 0);
    this.pedestal.receiveShadow = true;
    this.giftBoxGroup.add(this.pedestal);

    // Contact shadow
    const shadowGeo = new THREE.CircleGeometry(2.3, 48);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x03060c,
      transparent: true,
      opacity: 0.65,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, -boxHeight / 2 - 0.05, 0);
    this.giftBoxGroup.add(contactShadow);

    // 3. BOTTOM BASE PLATE
    const baseGeo = new THREE.BoxGeometry(boxSize, wallThick, boxSize);
    this.boxBasePlate = new THREE.Mesh(baseGeo, this.materials.box);
    this.boxBasePlate.position.set(0, -boxHeight / 2 + wallThick / 2, 0);
    this.boxBasePlate.castShadow = true;
    this.boxBasePlate.receiveShadow = true;
    this.giftBoxGroup.add(this.boxBasePlate);

    const halfH = boxHeight / 2;
    const halfS = boxSize / 2;

    // 4. FOUR DISTINCT HINGED WALLS (FOLD OUTWARD IN 4 SEPARATE DIRECTIONS)
    // Front Wall (pivots on X at z = +halfS)
    this.boxWalls.front = new THREE.Group();
    this.boxWalls.front.position.set(0, -halfH, halfS);
    {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(boxSize, boxHeight, wallThick), this.materials.box);
      panel.position.set(0, halfH, -wallThick / 2);
      panel.castShadow = true;
      panel.receiveShadow = true;
      this.boxWalls.front.add(panel);

      const ribbon = new THREE.Mesh(new THREE.BoxGeometry(ribWidth, boxHeight, ribThick), this.materials.ribbon);
      ribbon.position.set(0, halfH, ribThick / 2);
      ribbon.castShadow = true;
      this.boxWalls.front.add(ribbon);
    }
    this.giftBoxGroup.add(this.boxWalls.front);

    // Back Wall (pivots on X at z = -halfS)
    this.boxWalls.back = new THREE.Group();
    this.boxWalls.back.position.set(0, -halfH, -halfS);
    {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(boxSize, boxHeight, wallThick), this.materials.box);
      panel.position.set(0, halfH, wallThick / 2);
      panel.castShadow = true;
      panel.receiveShadow = true;
      this.boxWalls.back.add(panel);

      const ribbon = new THREE.Mesh(new THREE.BoxGeometry(ribWidth, boxHeight, ribThick), this.materials.ribbon);
      ribbon.position.set(0, halfH, -ribThick / 2);
      ribbon.castShadow = true;
      this.boxWalls.back.add(ribbon);
    }
    this.giftBoxGroup.add(this.boxWalls.back);

    // Left Wall (pivots on Z at x = -halfS)
    this.boxWalls.left = new THREE.Group();
    this.boxWalls.left.position.set(-halfS, -halfH, 0);
    {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(wallThick, boxHeight, boxSize), this.materials.box);
      panel.position.set(wallThick / 2, halfH, 0);
      panel.castShadow = true;
      panel.receiveShadow = true;
      this.boxWalls.left.add(panel);

      const ribbon = new THREE.Mesh(new THREE.BoxGeometry(ribThick, boxHeight, ribWidth), this.materials.ribbon);
      ribbon.position.set(-ribThick / 2, halfH, 0);
      ribbon.castShadow = true;
      this.boxWalls.left.add(ribbon);
    }
    this.giftBoxGroup.add(this.boxWalls.left);

    // Right Wall (pivots on Z at x = +halfS)
    this.boxWalls.right = new THREE.Group();
    this.boxWalls.right.position.set(halfS, -halfH, 0);
    {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(wallThick, boxHeight, boxSize), this.materials.box);
      panel.position.set(-wallThick / 2, halfH, 0);
      panel.castShadow = true;
      panel.receiveShadow = true;
      this.boxWalls.right.add(panel);

      const ribbon = new THREE.Mesh(new THREE.BoxGeometry(ribThick, boxHeight, ribWidth), this.materials.ribbon);
      ribbon.position.set(ribThick / 2, halfH, 0);
      ribbon.castShadow = true;
      this.boxWalls.right.add(ribbon);
    }
    this.giftBoxGroup.add(this.boxWalls.right);

    // 5. INNER SURPRISE: BLUE ROSE CRYSTAL HEART ON VELVET CUSHION
    const cushionGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.22, 32);
    const cushion = new THREE.Mesh(cushionGeo, this.materials.inner);
    cushion.position.set(0, -halfH + 0.12, 0);
    this.giftBoxGroup.add(cushion);

    // 3D Heart Geometry
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.25);
    heartShape.bezierCurveTo(0, 0.45, -0.4, 0.7, -0.65, 0.7);
    heartShape.bezierCurveTo(-0.95, 0.7, -1.05, 0.35, -1.05, 0.15);
    heartShape.bezierCurveTo(-1.05, -0.2, -0.7, -0.55, 0, -1.05);
    heartShape.bezierCurveTo(0.7, -0.55, 1.05, -0.2, 1.05, 0.15);
    heartShape.bezierCurveTo(1.05, 0.35, 0.95, 0.7, 0.65, 0.7);
    heartShape.bezierCurveTo(0.4, 0.7, 0, 0.45, 0, 0.25);

    const extrudeSettings = {
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.12,
      bevelThickness: 0.15,
    };

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeo.center();
    this.materials.heart = new THREE.MeshPhysicalMaterial({
      color: theme.heartColor,
      emissive: theme.heartEmissive,
      emissiveIntensity: 0.95,
      metalness: 0.15,
      roughness: 0.1,
      transmission: 0.9,
      ior: 1.5,
      thickness: 1.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });

    const heartMesh = new THREE.Mesh(heartGeo, this.materials.heart);
    heartMesh.scale.set(0.92, 0.92, 0.92);
    heartMesh.rotation.z = 0; // Upright: lobes on top, tip pointing down
    heartMesh.castShadow = true;
    this.innerHeartGroup.add(heartMesh);

    // Dedicated PointLight at the center of the heart illuminating surrounding flaps
    this.heartPointLight = new THREE.PointLight(theme.coolRimColor || 0x72efdd, 3.6, 16);
    this.heartPointLight.position.set(0, 0, 0);
    this.innerHeartGroup.add(this.heartPointLight);

    this.innerHeartGroup.position.set(0, 0.1, 0);
    this.innerHeartGroup.scale.set(0.01, 0.01, 0.01);
    this.giftBoxGroup.add(this.innerHeartGroup);

    // 6. BOX LID GROUP
    const lidSize = boxSize + 0.18;
    const lidHeight = 0.48;
    this.boxLidGroup.position.set(0, halfH + lidHeight / 2 - 0.02, 0);

    const lidGeo = new THREE.BoxGeometry(lidSize, lidHeight, lidSize);
    const lidMesh = new THREE.Mesh(lidGeo, this.materials.box);
    lidMesh.castShadow = true;
    lidMesh.receiveShadow = true;
    this.boxLidGroup.add(lidMesh);

    // Cross Ribbons on Lid (X & Z)
    const ribLid1 = new THREE.Mesh(
      new THREE.BoxGeometry(ribWidth, lidHeight + 0.015, lidSize + 0.02),
      this.materials.ribbon
    );
    ribLid1.castShadow = true;
    this.boxLidGroup.add(ribLid1);

    const ribLid2 = new THREE.Mesh(
      new THREE.BoxGeometry(lidSize + 0.02, lidHeight + 0.015, ribWidth),
      this.materials.ribbon
    );
    ribLid2.castShadow = true;
    this.boxLidGroup.add(ribLid2);

    // 7. TRUE FLAT BUTTERFLY RIBBON BOW WITH SWALLOWTAIL TAILS
    this.boxBowGroup = this.buildButterflyBow(this.materials.ribbon);
    this.boxBowGroup.position.set(0, lidHeight / 2 + 0.01, 0);
    this.boxLidGroup.add(this.boxBowGroup);
    this.giftBoxGroup.add(this.boxLidGroup);

    // 8. FLOATING STARDUST & FLAME EMBERS AROUND BOX
    const sparkleCount = 150;
    const sparkleGeo = new THREE.BufferGeometry();
    const sparklePos = new Float32Array(sparkleCount * 3);
    const sparkleColors = new Float32Array(sparkleCount * 3);

    for (let i = 0; i < sparkleCount; i++) {
      const radius = 2.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.45) * 3.8;

      sparklePos[i * 3] = Math.cos(theta) * radius;
      sparklePos[i * 3 + 1] = y;
      sparklePos[i * 3 + 2] = Math.sin(theta) * radius;

      // Golden Flame Embers mixed with Diamond Cyan sparkles (Fire & Ice)
      const rVal = Math.random();
      if (rVal < 0.45) {
        // Flame Gold
        sparkleColors[i * 3] = 1.0;
        sparkleColors[i * 3 + 1] = 0.68;
        sparkleColors[i * 3 + 2] = 0.12;
      } else if (rVal < 0.75) {
        // Ice Diamond White
        sparkleColors[i * 3] = 1.0;
        sparkleColors[i * 3 + 1] = 1.0;
        sparkleColors[i * 3 + 2] = 1.0;
      } else {
        // Celestial Cyan
        sparkleColors[i * 3] = 0.28;
        sparkleColors[i * 3 + 1] = 0.88;
        sparkleColors[i * 3 + 2] = 0.95;
      }
    }

    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));
    sparkleGeo.setAttribute('color', new THREE.BufferAttribute(sparkleColors, 3));

    const sparkleMat = new THREE.PointsMaterial({
      size: 0.24,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      map: this.createGlowParticleTexture(),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.boxSparkles = new THREE.Points(sparkleGeo, sparkleMat);
    this.giftBoxGroup.add(this.boxSparkles);
  }

  /* =========================================================================
     BUILD TRUE FLAT BUTTERFLY RIBBON BOW (HOLLOW SILK LOOPS + SWALLOWTAIL TAILS)
     ========================================================================= */
  buildButterflyBow(ribbonMat) {
    const bowGroup = new THREE.Group();

    // Helper: Create a realistic curved fabric ribbon loop (starts at knot, loops out, returns to knot)
    const createRibbonLoopGeometry = (length = 1.1, maxHeight = 0.46, width = 0.38) => {
      const segments = 36;
      const vertices = [];
      const uvs = [];
      const indices = [];

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 2;

        // Realistic teardrop loop:
        // Starts at x=0, arches out to -length, turns smoothly and returns to x=0
        const x = -(1 - Math.cos(angle)) * 0.5 * length;
        // Smooth height curvature (highest at the curve apex)
        const y = Math.sin(angle) * maxHeight * (0.65 + 0.35 * (1 - Math.cos(angle)));
        // Subtle organic depth wave along the ribbon for natural fabric drape
        const zWave = Math.sin(angle) * 0.05;

        const halfW = width / 2;
        vertices.push(x, y, -halfW + zWave);
        vertices.push(x, y, halfW + zWave);

        uvs.push(0, t);
        uvs.push(1, t);
      }

      for (let i = 0; i < segments; i++) {
        const p1 = i * 2;
        const p2 = i * 2 + 1;
        const p3 = (i + 1) * 2;
        const p4 = (i + 1) * 2 + 1;

        indices.push(p1, p3, p2);
        indices.push(p2, p3, p4);
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      return geo;
    };

    // Helper: Ribbon tail with swallowtail cut (sharp V-notch cut at tip)
    const createTailGeometry = (length = 1.25, width = 0.36) => {
      const shape = new THREE.Shape();
      const hw = width / 2;
      const notchDepth = 0.22;

      // Start at top under knot
      shape.moveTo(-hw, 0);
      shape.lineTo(hw, 0);
      // Flow down to bottom right tip
      shape.lineTo(hw, -length);
      // V-notch inward cut to center
      shape.lineTo(0, -(length - notchDepth));
      // Out to bottom left tip
      shape.lineTo(-hw, -length);
      shape.closePath();

      return new THREE.ExtrudeGeometry(shape, {
        depth: 0.02,
        bevelEnabled: true,
        bevelThickness: 0.008,
        bevelSize: 0.008,
        bevelSegments: 2,
      });
    };

    // 1. Central Plump Ribbon Knot (Pillow Core + Wrapped Knot Ring)
    const knotCore = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), ribbonMat);
    knotCore.scale.set(1.25, 0.82, 1.1);
    knotCore.position.set(0, 0.12, 0);
    knotCore.castShadow = true;
    bowGroup.add(knotCore);

    const knotBand = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.08, 14, 24), ribbonMat);
    knotBand.rotation.x = Math.PI / 2;
    knotBand.position.set(0, 0.12, 0);
    knotBand.castShadow = true;
    bowGroup.add(knotBand);

    // 2. Primary Large Left & Right Butterfly Wing Loops
    const mainLoopGeo = createRibbonLoopGeometry(1.15, 0.48, 0.38);

    const leftMain = new THREE.Mesh(mainLoopGeo, ribbonMat);
    leftMain.rotation.set(0.12, 0.15, Math.PI / 7);
    leftMain.position.set(-0.12, 0.12, 0);
    leftMain.castShadow = true;
    leftMain.receiveShadow = true;
    bowGroup.add(leftMain);

    const rightMain = new THREE.Mesh(mainLoopGeo, ribbonMat);
    rightMain.rotation.set(0.12, Math.PI - 0.15, -Math.PI / 7);
    rightMain.position.set(0.12, 0.12, 0);
    rightMain.castShadow = true;
    rightMain.receiveShadow = true;
    bowGroup.add(rightMain);

    // 3. Secondary Upward Volumetric Loops (Giving luxury plush fullness)
    const upperLoopGeo = createRibbonLoopGeometry(0.92, 0.42, 0.32);

    const leftUpper = new THREE.Mesh(upperLoopGeo, ribbonMat);
    leftUpper.rotation.set(-0.25, 0.35, Math.PI / 4.2);
    leftUpper.position.set(-0.1, 0.16, -0.06);
    leftUpper.castShadow = true;
    leftUpper.receiveShadow = true;
    bowGroup.add(leftUpper);

    const rightUpper = new THREE.Mesh(upperLoopGeo, ribbonMat);
    rightUpper.rotation.set(-0.25, Math.PI - 0.35, -Math.PI / 4.2);
    rightUpper.position.set(0.1, 0.16, -0.06);
    rightUpper.castShadow = true;
    rightUpper.receiveShadow = true;
    bowGroup.add(rightUpper);

    // 4. Two Forward Accent Small Loops
    const frontLoopGeo = createRibbonLoopGeometry(0.72, 0.32, 0.28);

    const leftFront = new THREE.Mesh(frontLoopGeo, ribbonMat);
    leftFront.rotation.set(0.38, -0.25, 0.14);
    leftFront.position.set(-0.08, 0.1, 0.08);
    leftFront.castShadow = true;
    bowGroup.add(leftFront);

    const rightFront = new THREE.Mesh(frontLoopGeo, ribbonMat);
    rightFront.rotation.set(0.38, Math.PI + 0.25, -0.14);
    rightFront.position.set(0.08, 0.1, 0.08);
    rightFront.castShadow = true;
    bowGroup.add(rightFront);

    // 5. Two Elegant Ribbon Tails Flowing Forward with Swallowtail (V-cut) Ends
    const tailGeo = createTailGeometry(1.35, 0.34);

    const leftTail = new THREE.Mesh(tailGeo, ribbonMat);
    leftTail.rotation.set(-Math.PI / 2.3, 0.12, 0.32);
    leftTail.position.set(-0.16, 0.04, 0.16);
    leftTail.castShadow = true;
    bowGroup.add(leftTail);

    const rightTail = new THREE.Mesh(tailGeo, ribbonMat);
    rightTail.rotation.set(-Math.PI / 2.3, -0.12, -0.32);
    rightTail.position.set(0.16, 0.04, 0.16);
    rightTail.castShadow = true;
    bowGroup.add(rightTail);

    return bowGroup;
  }

  /* =========================================================================
     BUILD UNIVERSE & PLANETS (FIRE & ICE AESTHETIC)
     ========================================================================= */
  buildUniverse(theme) {
    const starCount = 4500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color(0xffffff), // Pure white
      new THREE.Color(0x72efdd), // Icy cyan
      new THREE.Color(0x48bfe3), // Sapphire blue
      new THREE.Color(0xffb703), // Flame gold
      new THREE.Color(0xfb8500), // Fire amber
      new THREE.Color(0xd8b4fe), // Lavender starlight
    ];

    for (let i = 0; i < starCount; i++) {
      const r = 40 + Math.random() * 140;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.44,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
    });

    this.starfield = new THREE.Points(starGeo, starMat);
    this.universeGroup.add(this.starfield);

    // 2. Timeline Spline
    const planetConfigs = [
      {
        name: 'Hành Tinh Trang Sách',
        subtitle: 'Mua Sách & Cuộc Gặp Đầu Tiên',
        color: 0x48bfe3,
        emissive: 0x0f3659,
        radius: 1.2,
        pos: new THREE.Vector3(-18, -2, -12),
        hasRings: false,
      },
      {
        name: 'Hành Tinh Chiếc Lắc Tay',
        subtitle: 'Tặng Lắc Tay & Buổi Hẹn Cà Phê',
        color: 0x72efdd,
        emissive: 0x0c3766,
        radius: 1.3,
        pos: new THREE.Vector3(-10, 3, -6),
        hasRings: true,
        ringColor: 0xffd166,
      },
      {
        name: 'Hành Tinh Đêm Giao Thừa',
        subtitle: 'Lời Tỏ Tình Dưới Pháo Hoa',
        color: 0xffaa00,
        emissive: 0x5e3a00,
        radius: 1.5,
        pos: new THREE.Vector3(-1, -1.5, 0),
        hasRings: true,
        ringColor: 0xff3377,
      },
      {
        name: 'Hành Tinh Phố & Hồ Gươm',
        subtitle: 'Rạp Phim & Vòng Xe Hồ Gươm',
        color: 0x256da6,
        emissive: 0x0e283d,
        radius: 1.35,
        pos: new THREE.Vector3(8, 3.5, 4),
        hasRings: false,
      },
      {
        name: 'Hành Tinh Bếp Ấm',
        subtitle: 'Bữa Cơm Anh Nấu Cho Em',
        color: 0xfb8500,
        emissive: 0x471d00,
        radius: 1.4,
        pos: new THREE.Vector3(16, -1, 10),
        hasRings: true,
        ringColor: 0xffd166,
      },
      {
        name: 'Hành Tinh 365 Ngày Yêu',
        subtitle: 'Tròn 1 Năm - Trăm Năm Hạnh Phúc',
        color: 0x00b4d8,
        emissive: 0x023e8a,
        radius: 1.9,
        pos: new THREE.Vector3(26, 4, 16),
        hasRings: true,
        isCrown: true,
        ringColor: 0xffd166,
      },
    ];

    const curvePoints = planetConfigs.map(p => p.pos);
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 100, 0.09, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0x72efdd,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    this.constellationLine = new THREE.Mesh(tubeGeo, tubeMat);
    this.universeGroup.add(this.constellationLine);

    // 3. Build each Planet Mesh
    planetConfigs.forEach((cfg, idx) => {
      const planetGroup = new THREE.Group();
      planetGroup.position.copy(cfg.pos);

      const texture = this.createPlanetTexture(cfg.color);
      const planetMat = new THREE.MeshStandardMaterial({
        map: texture,
        color: cfg.color,
        roughness: 0.55,
        metalness: 0.2,
        emissive: cfg.emissive,
        emissiveIntensity: 0.45,
      });

      const sphereGeo = new THREE.SphereGeometry(cfg.radius, 48, 48);
      const sphereMesh = new THREE.Mesh(sphereGeo, planetMat);
      sphereMesh.userData = { milestoneIndex: idx, config: cfg };
      planetGroup.add(sphereMesh);

      // Planet Glow Aura Mesh (Flame Gold on Planet 3 & 6, Cyan on others)
      const auraColor = (idx === 2 || idx === 4 || idx === 5) ? 0xffaa00 : 0x72efdd;
      const glowGeo = new THREE.SphereGeometry(cfg.radius * 1.25, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: auraColor,
        transparent: true,
        opacity: 0.24,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      planetGroup.add(glowMesh);

      // Planetary Ring
      if (cfg.hasRings) {
        const ringGeo = new THREE.RingGeometry(cfg.radius * 1.5, cfg.radius * 2.3, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: cfg.ringColor || 0x72efdd,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.72,
          blending: THREE.AdditiveBlending,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        ringMesh.rotation.y = Math.PI / 6;
        planetGroup.add(ringMesh);
      }

      // Golden Flame Halo Crown for Planet 6
      if (cfg.isCrown) {
        const crownGroup = this.createFireCrownHalo(cfg.radius * 2.5);
        planetGroup.add(crownGroup);
      }

      // 3D Milestone-Specific Micro-World Animations
      const effects = this.buildPlanetMilestoneFeatures(idx, cfg, planetGroup);

      this.universeGroup.add(planetGroup);
      this.planets.push({
        group: planetGroup,
        mesh: sphereMesh,
        glow: glowMesh,
        config: cfg,
        index: idx,
        effects,
      });
    });

    // 3.5 Build Floating Pinned Screen Badges
    this.buildPlanetScreenBadges();

    // 4. Build 3D Meteor Streaks
    this.build3DMeteors();
  }

  rebuildPlanets(milestones) {
    if (!milestones || milestones.length === 0) return;
    this.currentMilestonesData = milestones;

    // 1. Remove old planets from universeGroup
    if (this.planets && this.planets.length > 0) {
      this.planets.forEach(p => {
        if (p.group) this.universeGroup.remove(p.group);
      });
      this.planets = [];
    }

    // 2. Remove old constellation tube
    if (this.constellationLine) {
      this.universeGroup.remove(this.constellationLine);
      if (this.constellationLine.geometry) this.constellationLine.geometry.dispose();
      this.constellationLine = null;
    }

    // 3. Clear badges
    const container = document.getElementById('planet-badges-container');
    if (container) container.innerHTML = '';
    this.badgeElements = [];

    // 4. Generate dynamic configurations
    const n = milestones.length;
    const basePalette = [
      { color: 0x48bfe3, emissive: 0x0f3659, hasRings: false },
      { color: 0x72efdd, emissive: 0x0c3766, hasRings: true, ringColor: 0xffd166 },
      { color: 0xffaa00, emissive: 0x5e3a00, hasRings: true, ringColor: 0xff3377 },
      { color: 0x256da6, emissive: 0x0e283d, hasRings: false },
      { color: 0xfb8500, emissive: 0x471d00, hasRings: true, ringColor: 0xffd166 },
      { color: 0x00b4d8, emissive: 0x023e8a, hasRings: true, ringColor: 0xffd166, isCrown: true },
      { color: 0xe040fb, emissive: 0x4a148c, hasRings: true, ringColor: 0x72efdd },
      { color: 0xff4081, emissive: 0x880e4f, hasRings: false },
      { color: 0x00e676, emissive: 0x1b5e20, hasRings: true, ringColor: 0xffeb3b },
    ];

    const planetConfigs = milestones.map((m, idx) => {
      const pal = basePalette[idx % basePalette.length];
      const progress = n <= 1 ? 0.5 : idx / (n - 1);
      const posX = -20 + progress * 48;
      const posY = Math.sin(progress * Math.PI * 2.5) * 4.5 + ((idx % 2 === 0) ? -1 : 1.5);
      const posZ = -14 + progress * 32 + Math.cos(progress * Math.PI * 2) * 4;

      return {
        name: m.planetName || `Hành Tinh ${idx + 1}`,
        subtitle: m.date || `Mốc ${idx + 1}`,
        color: pal.color,
        emissive: pal.emissive,
        radius: 1.15 + (idx === n - 1 ? 0.5 : 0.15 * Math.sin(idx)),
        pos: new THREE.Vector3(posX, posY, posZ),
        hasRings: pal.hasRings,
        ringColor: pal.ringColor,
        isCrown: idx === n - 1,
      };
    });

    // 5. Constellation tube
    if (planetConfigs.length > 1) {
      const curvePoints = planetConfigs.map(p => p.pos);
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const tubeGeo = new THREE.TubeGeometry(curve, Math.max(40, n * 18), 0.09, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0x72efdd,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      });
      this.constellationLine = new THREE.Mesh(tubeGeo, tubeMat);
      this.universeGroup.add(this.constellationLine);
    }

    // 6. Build Planet Meshes
    planetConfigs.forEach((cfg, idx) => {
      const planetGroup = new THREE.Group();
      planetGroup.position.copy(cfg.pos);

      const texture = this.createPlanetTexture(cfg.color);
      const planetMat = new THREE.MeshStandardMaterial({
        map: texture,
        color: cfg.color,
        roughness: 0.55,
        metalness: 0.2,
        emissive: cfg.emissive,
        emissiveIntensity: 0.45,
      });

      const sphereGeo = new THREE.SphereGeometry(cfg.radius, 48, 48);
      const sphereMesh = new THREE.Mesh(sphereGeo, planetMat);
      sphereMesh.userData = { milestoneIndex: idx, config: cfg };
      planetGroup.add(sphereMesh);

      // Aura
      const auraColor = (idx === n - 1 || idx % 2 === 0) ? 0xffaa00 : 0x72efdd;
      const glowGeo = new THREE.SphereGeometry(cfg.radius * 1.25, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: auraColor,
        transparent: true,
        opacity: 0.24,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      planetGroup.add(glowMesh);

      // Rings
      if (cfg.hasRings) {
        const ringGeo = new THREE.RingGeometry(cfg.radius * 1.5, cfg.radius * 2.3, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: cfg.ringColor || 0x72efdd,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.72,
          blending: THREE.AdditiveBlending,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        ringMesh.rotation.y = Math.PI / 6;
        planetGroup.add(ringMesh);
      }

      // Halo Crown
      if (cfg.isCrown) {
        const crownGroup = this.createFireCrownHalo(cfg.radius * 2.5);
        planetGroup.add(crownGroup);
      }

      // 3D Particles
      const effects = this.buildPlanetMilestoneFeatures(idx % 6, cfg, planetGroup);

      this.universeGroup.add(planetGroup);
      this.planets.push({
        group: planetGroup,
        mesh: sphereMesh,
        glow: glowMesh,
        config: cfg,
        index: idx,
        effects,
      });
    });

    // 7. Rebuild Badges
    this.buildPlanetScreenBadges(milestones);
  }

  build3DMeteors() {
    this.meteorsGroup = new THREE.Group();
    this.universeGroup.add(this.meteorsGroup);

    for (let i = 0; i < 6; i++) {
      const lineGeo = new THREE.BufferGeometry();
      const points = new Float32Array([
        0, 0, 0,
        -4, -2.5, -4
      ]);
      lineGeo.setAttribute('position', new THREE.BufferAttribute(points, 3));
      
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x72efdd,
        transparent: true,
        opacity: 0,
        linewidth: 2,
        blending: THREE.AdditiveBlending,
      });

      const meteorLine = new THREE.Line(lineGeo, lineMat);
      meteorLine.userData = {
        active: false,
        speed: 16,
        lifetime: 0,
      };
      this.meteorsGroup.add(meteorLine);
      this.meteors.push(meteorLine);
    }
  }

  trigger3DMeteor() {
    const inactive = this.meteors.find(m => !m.userData.active);
    if (!inactive) return;

    inactive.userData.active = true;
    inactive.userData.lifetime = 0;
    inactive.material.opacity = 1;

    const startX = 15 + (Math.random() - 0.5) * 30;
    const startY = 15 + Math.random() * 15;
    const startZ = (Math.random() - 0.5) * 20;

    inactive.position.set(startX, startY, startZ);
  }

  createPlanetTexture(baseHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, '#' + baseHex.toString(16).padStart(6, '0'));
    grad.addColorStop(0.7, '#a8dadc');
    grad.addColorStop(1, '#ffffff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    for (let i = 0; i < 18; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.25)' : 'rgba(78, 242, 210, 0.18)';
      ctx.beginPath();
      const y = Math.random() * 256;
      ctx.ellipse(256, y, 260, 10 + Math.random() * 16, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }

  createFireCrownHalo(radius) {
    const group = new THREE.Group();
    const particleCount = 55;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle * 3) * 0.45;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // Golden Flame Colors
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.75 + Math.random() * 0.25;
      colors[i * 3 + 2] = 0.1;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.95,
    });

    const points = new THREE.Points(geo, mat);
    group.add(points);
    return group;
  }

  /* =========================================================================
     3D MILESTONE-SPECIFIC MICRO-WORLD FEATURES & ANIMATIONS
     ========================================================================= */
  buildPlanetMilestoneFeatures(idx, cfg, planetGroup) {
    const effects = { type: idx, items: [] };

    // Planet 0 (Mốc 1: Sách & Buổi Gặp Đầu)
    if (idx === 0) {
      const bookOrbit = new THREE.Group();
      planetGroup.add(bookOrbit);
      effects.bookOrbit = bookOrbit;

      const pageMat = new THREE.MeshStandardMaterial({
        color: 0xfffcf0,
        roughness: 0.35,
        metalness: 0.1,
        side: THREE.DoubleSide,
        emissive: 0x48bfe3,
        emissiveIntensity: 0.3,
      });

      // 4 Open Books orbiting
      const books = [];
      for (let b = 0; b < 4; b++) {
        const book = new THREE.Group();
        const leftPage = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.26), pageMat);
        leftPage.position.x = -0.19;
        leftPage.rotation.y = 0.28;
        const rightPage = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.26), pageMat);
        rightPage.position.x = 0.19;
        rightPage.rotation.y = -0.28;
        book.add(leftPage, rightPage);

        const angle = (b / 4) * Math.PI * 2;
        const rad = cfg.radius * 1.85;
        book.position.set(Math.cos(angle) * rad, Math.sin(angle * 2) * 0.25, Math.sin(angle) * rad);
        book.rotation.y = angle + Math.PI / 2;
        book.rotation.z = 0.15;
        book.userData = { left: leftPage, right: rightPage, baseAngle: angle, rad };
        bookOrbit.add(book);
        books.push(book);
      }
      effects.books = books;

      // Golden sparkle trail points
      const pCount = 35;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = cfg.radius * (1.4 + Math.random() * 0.8);
        pPos[i * 3] = Math.cos(angle) * r;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
        pPos[i * 3 + 2] = Math.sin(angle) * r;
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        size: 0.25,
        color: 0xffd166,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      const sparkles = new THREE.Points(pGeo, pMat);
      bookOrbit.add(sparkles);
      effects.sparkles = sparkles;
    }

    // Planet 1 (Mốc 2: Chiếc Lắc Tay & Cà Phê)
    else if (idx === 1) {
      const braceletGroup = new THREE.Group();
      planetGroup.add(braceletGroup);
      effects.braceletGroup = braceletGroup;

      // Silver Torus Ring
      const bandGeo = new THREE.TorusGeometry(cfg.radius * 1.68, 0.04, 12, 48);
      const bandMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.15,
        metalness: 0.9,
        emissive: 0x72efdd,
        emissiveIntensity: 0.45,
      });
      const bandMesh = new THREE.Mesh(bandGeo, bandMat);
      bandMesh.rotation.x = Math.PI / 2.4;
      braceletGroup.add(bandMesh);

      // 10 Diamond Gem Octahedrons
      const gems = [];
      const gemMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.3,
        emissive: 0x72efdd,
        emissiveIntensity: 0.7,
      });
      for (let g = 0; g < 10; g++) {
        const angle = (g / 10) * Math.PI * 2;
        const r = cfg.radius * 1.68;
        const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.14), gemMat);
        gem.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
        gem.rotation.x = Math.PI / 2.4;
        braceletGroup.add(gem);
        gems.push(gem);
      }
      effects.gems = gems;

      // Floating coffee steam puffs
      const steamGroup = new THREE.Group();
      planetGroup.add(steamGroup);
      effects.steamGroup = steamGroup;
      const steamPuffs = [];
      const steamMat = new THREE.MeshBasicMaterial({
        color: 0xfff0dd,
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
      });
      for (let s = 0; s < 4; s++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(0.16 + s * 0.04, 12, 12), steamMat);
        puff.userData = { offset: s * 1.4 };
        steamGroup.add(puff);
        steamPuffs.push(puff);
      }
      effects.steamPuffs = steamPuffs;
    }

    // Planet 2 (Mốc 3: Tỏ Tình Đêm Giao Thừa - Fireworks Burst System)
    else if (idx === 2) {
      const fwGroup = new THREE.Group();
      planetGroup.add(fwGroup);
      effects.fwGroup = fwGroup;
      effects.sparks = [];
      effects.nextBurstTime = 0;
    }

    // Planet 3 (Mốc 4: Phố & Hồ Gươm - Autumn Leaves & Water Ripple)
    else if (idx === 3) {
      const autumnGroup = new THREE.Group();
      planetGroup.add(autumnGroup);
      effects.autumnGroup = autumnGroup;

      // 8 Autumn Leaves
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0xff9900,
        roughness: 0.45,
        metalness: 0.1,
        side: THREE.DoubleSide,
        emissive: 0xff6600,
        emissiveIntensity: 0.3,
      });
      const leaves = [];
      for (let l = 0; l < 8; l++) {
        const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.22), leafMat);
        const angle = (l / 8) * Math.PI * 2;
        const rad = cfg.radius * (1.65 + (l % 2) * 0.3);
        leaf.position.set(Math.cos(angle) * rad, (l - 4) * 0.22, Math.sin(angle) * rad);
        leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        leaf.userData = { speed: 0.8 + Math.random() * 0.4, angle, rad };
        autumnGroup.add(leaf);
        leaves.push(leaf);
      }
      effects.leaves = leaves;

      // Water Ripple Ring
      const ripGeo = new THREE.RingGeometry(cfg.radius * 1.25, cfg.radius * 2.35, 36);
      const ripMat = new THREE.MeshBasicMaterial({
        color: 0x48cae4,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      const ripple = new THREE.Mesh(ripGeo, ripMat);
      ripple.rotation.x = -Math.PI / 2;
      ripple.position.y = -cfg.radius * 0.65;
      autumnGroup.add(ripple);
      effects.ripple = ripple;
    }

    // Planet 4 (Mốc 5: Bếp Ấm Anh Nấu - Fire Embers & Floating Hearts)
    else if (idx === 4) {
      const hearthGroup = new THREE.Group();
      planetGroup.add(hearthGroup);
      effects.hearthGroup = hearthGroup;

      // Embers Points
      const emberCount = 35;
      const emberGeo = new THREE.BufferGeometry();
      const emberPos = new Float32Array(emberCount * 3);
      for (let i = 0; i < emberCount; i++) {
        emberPos[i * 3] = (Math.random() - 0.5) * (cfg.radius * 1.8);
        emberPos[i * 3 + 1] = -cfg.radius * 0.8 + Math.random() * (cfg.radius * 1.8);
        emberPos[i * 3 + 2] = (Math.random() - 0.5) * (cfg.radius * 1.8);
      }
      emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
      const emberMat = new THREE.PointsMaterial({
        size: 0.28,
        color: 0xff6600,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
      });
      const embersMesh = new THREE.Points(emberGeo, emberMat);
      hearthGroup.add(embersMesh);
      effects.embersMesh = embersMesh;

      // 4 Floating 3D Hearts
      const hearts = [];
      const heartMat = new THREE.MeshStandardMaterial({
        color: 0xff3366,
        roughness: 0.3,
        metalness: 0.1,
        emissive: 0xff0044,
        emissiveIntensity: 0.6,
      });
      for (let h = 0; h < 4; h++) {
        const heartShape = new THREE.Shape();
        const s = 0.1;
        heartShape.moveTo(0, s * 0.7);
        heartShape.bezierCurveTo(s * 1.2, s * 1.6, s * 2.2, s * 0.5, 0, -s * 1.5);
        heartShape.bezierCurveTo(-s * 2.2, s * 0.5, -s * 1.2, s * 1.6, 0, s * 0.7);
        const heartGeo = new THREE.ExtrudeGeometry(heartShape, { depth: 0.05, bevelEnabled: false });
        const heartMesh = new THREE.Mesh(heartGeo, heartMat);
        const angle = (h / 4) * Math.PI * 2;
        const r = cfg.radius * 1.7;
        heartMesh.position.set(Math.cos(angle) * r, (Math.random() - 0.5) * 0.5, Math.sin(angle) * r);
        heartMesh.userData = { angle, r, speed: 0.9 + h * 0.2 };
        hearthGroup.add(heartMesh);
        hearts.push(heartMesh);
      }
      effects.hearts = hearts;
    }

    // Planet 5 (Mốc 6: Tròn 1 Năm - Rose Petals Swirl)
    else if (idx === 5) {
      const roseGroup = new THREE.Group();
      planetGroup.add(roseGroup);
      effects.roseGroup = roseGroup;

      const petals = [];
      const bluePetalMat = new THREE.MeshStandardMaterial({
        color: 0x00b4d8,
        side: THREE.DoubleSide,
        emissive: 0x0077b6,
        emissiveIntensity: 0.5,
      });
      const redPetalMat = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        side: THREE.DoubleSide,
        emissive: 0xcc0044,
        emissiveIntensity: 0.5,
      });

      for (let p = 0; p < 20; p++) {
        const mat = (p % 2 === 0) ? bluePetalMat : redPetalMat;
        const petalGeo = new THREE.PlaneGeometry(0.36, 0.26);
        const petal = new THREE.Mesh(petalGeo, mat);
        const angle = (p / 20) * Math.PI * 2;
        const rad = cfg.radius * (1.85 + Math.sin(p) * 0.45);
        petal.position.set(Math.cos(angle) * rad, Math.cos(p * 2) * 0.6, Math.sin(angle) * rad);
        petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        petal.userData = { angle, rad, vRot: 0.02 + Math.random() * 0.03 };
        roseGroup.add(petal);
        petals.push(petal);
      }
      effects.petals = petals;
    }

    return effects;
  }

  updatePlanetMilestoneFeatures(p, idx, time, delta) {
    if (!p.effects) return;

    // 0. Books Orbit
    if (idx === 0 && p.effects.bookOrbit) {
      p.effects.bookOrbit.rotation.y = time * 0.35;
      if (p.effects.books) {
        p.effects.books.forEach((b, bIdx) => {
          b.position.y = Math.sin(time * 2 + bIdx) * 0.28;
          if (b.userData.left) {
            b.userData.left.rotation.y = 0.28 + Math.sin(time * 3 + bIdx) * 0.08;
            b.userData.right.rotation.y = -0.28 - Math.sin(time * 3 + bIdx) * 0.08;
          }
        });
      }
    }

    // 1. Bracelet & Coffee Steam
    else if (idx === 1 && p.effects.braceletGroup) {
      p.effects.braceletGroup.rotation.y = time * 0.4;
      p.effects.braceletGroup.rotation.z = Math.sin(time * 0.5) * 0.12;
      if (p.effects.gems) {
        p.effects.gems.forEach((gem) => {
          gem.rotation.y = time * 2;
        });
      }
      if (p.effects.steamPuffs) {
        p.effects.steamPuffs.forEach((puff) => {
          puff.position.y = ((time * 0.65 + puff.userData.offset) % 2.5) - 0.4;
          puff.scale.setScalar(0.7 + puff.position.y * 0.35);
          puff.material.opacity = Math.max(0, 0.35 * (1 - puff.position.y / 2.2));
        });
      }
    }

    // 2. New Year Fireworks Burst
    else if (idx === 2 && p.effects.fwGroup) {
      if (time > p.effects.nextBurstTime) {
        p.effects.nextBurstTime = time + 1.25;
        const colors = [0xffaa00, 0xff3377, 0x72efdd, 0xffd166, 0xffffff];
        const burstColor = colors[Math.floor(Math.random() * colors.length)];
        const sparkMat = new THREE.MeshBasicMaterial({
          color: burstColor,
          transparent: true,
          opacity: 1,
          blending: THREE.AdditiveBlending,
        });
        const sparkGeo = new THREE.SphereGeometry(0.065, 6, 6);

        for (let s = 0; s < 22; s++) {
          const spark = new THREE.Mesh(sparkGeo, sparkMat.clone());
          const angle = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const speed = 1.8 + Math.random() * 3.2;

          spark.position.set(0, p.config.radius * 1.35, 0);
          spark.userData = {
            vx: Math.sin(phi) * Math.cos(angle) * speed,
            vy: Math.sin(phi) * Math.sin(angle) * speed,
            vz: Math.cos(phi) * speed,
            life: 1.0,
          };
          p.effects.fwGroup.add(spark);
          p.effects.sparks.push(spark);
        }
      }

      for (let i = p.effects.sparks.length - 1; i >= 0; i--) {
        const sp = p.effects.sparks[i];
        sp.position.x += sp.userData.vx * delta;
        sp.position.y += sp.userData.vy * delta;
        sp.position.z += sp.userData.vz * delta;
        sp.userData.vy -= 1.6 * delta;
        sp.userData.life -= 0.85 * delta;
        sp.material.opacity = sp.userData.life;
        if (sp.userData.life <= 0) {
          p.effects.fwGroup.remove(sp);
          p.effects.sparks.splice(i, 1);
        }
      }
    }

    // 3. Autumn Leaves & Lake Ripples
    else if (idx === 3 && p.effects.autumnGroup) {
      p.effects.autumnGroup.rotation.y = time * 0.22;
      if (p.effects.leaves) {
        p.effects.leaves.forEach((leaf) => {
          leaf.rotation.x += 0.025;
          leaf.rotation.z += 0.015;
          leaf.position.y = Math.sin(time * 1.8 + leaf.userData.angle) * 0.35;
        });
      }
      if (p.effects.ripple) {
        const ripProgress = (time * 0.65) % 1;
        p.effects.ripple.scale.setScalar(0.85 + ripProgress * 0.45);
        p.effects.ripple.material.opacity = 0.45 * (1 - ripProgress);
      }
    }

    // 4. Kitchen Hearth Embers & Hearts
    else if (idx === 4 && p.effects.hearthGroup) {
      if (p.effects.embersMesh) {
        const posAttr = p.effects.embersMesh.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          let y = posAttr.getY(i) + 0.035;
          if (y > p.config.radius * 1.45) {
            y = -p.config.radius * 0.85;
          }
          posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
      }
      if (p.effects.hearts) {
        p.effects.hearts.forEach((heart, hIdx) => {
          heart.position.x = Math.cos(time * 0.85 + hIdx * Math.PI / 2) * (p.config.radius * 1.65);
          heart.position.z = Math.sin(time * 0.85 + hIdx * Math.PI / 2) * (p.config.radius * 1.65);
          heart.position.y = Math.sin(time * 2.2 + hIdx) * 0.32;
          heart.rotation.y = time * 1.6;
        });
      }
    }

    // 5. 365 Days Rose Petals Swirl
    else if (idx === 5 && p.effects.roseGroup) {
      p.effects.roseGroup.rotation.y = time * 0.45;
      if (p.effects.petals) {
        p.effects.petals.forEach((petal, pIdx) => {
          petal.rotation.x += petal.userData.vRot;
          petal.rotation.z += petal.userData.vRot * 0.5;
          petal.position.y = Math.sin(time * 1.6 + pIdx) * 0.48;
        });
      }
    }
  }

  /* =========================================================================
     FLOATING PINNED SCREEN BADGES FOR EACH PLANET
     ========================================================================= */
  buildPlanetScreenBadges(milestones) {
    const container = document.getElementById('planet-badges-container');
    if (!container) return;
    container.innerHTML = '';
    this.badgeElements = [];

    const defaultIcons = ['📖', '☕', '🎆', '🍂', '🍳', '🌹', '✨', '💖', '💍', '🌟'];
    const msList = milestones || this.currentMilestonesData;

    this.planets.forEach((p, idx) => {
      const ms = msList && msList[idx] ? msList[idx] : null;
      const tagText = `Mốc ${idx + 1}`;
      const titleText = ms ? (ms.planetName || ms.date) : (p.config.name || `Hành Tinh ${idx + 1}`);
      const icon = defaultIcons[idx % defaultIcons.length];

      const badge = document.createElement('div');
      badge.className = 'planet-floating-badge';
      badge.dataset.index = idx;
      badge.innerHTML = `
        <span class="badge-icon">${icon}</span>
        <div class="badge-texts">
          <span class="badge-tag">${tagText}</span>
          <span class="badge-title">${titleText}</span>
        </div>
        <span class="badge-arrow">🚀</span>
      `;
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof this.onPlanetClick === 'function') {
          this.onPlanetClick(idx);
        }
      });
      container.appendChild(badge);
      this.badgeElements.push(badge);
    });
  }

  updatePlanetScreenBadges() {
    const container = document.getElementById('planet-badges-container');
    if (!container) return;

    if (!this.badgeElements || this.badgeElements.length === 0) {
      this.buildPlanetScreenBadges();
      if (!this.badgeElements || this.badgeElements.length === 0) return;
    }

    if (this.state !== 'UNIVERSE') {
      container.style.opacity = '0';
      return;
    }

    container.style.opacity = '1';
    const tempV = new THREE.Vector3();

    this.planets.forEach((p, idx) => {
      const badge = this.badgeElements[idx];
      if (!badge) return;

      tempV.copy(p.group.position);
      tempV.y += p.config.radius + 1.55;
      tempV.project(this.camera);

      // Behind camera check
      if (tempV.z > 1) {
        badge.style.display = 'none';
        return;
      }

      const x = (tempV.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-(tempV.y * 0.5) + 0.5) * window.innerHeight;

      badge.style.display = 'flex';
      badge.style.left = `${x}px`;
      badge.style.top = `${y}px`;
    });
  }

  /* =========================================================================
     SMOOTH 3-STAGE TRANSITION: 4-WAY EXPLOSION -> BURST FLASH -> GALAXY
     ========================================================================= */

  openGiftBox(callback) {
    if (this.state !== 'GIFT_BOX') return;
    this.state = 'TRANSITIONING';

    if (this.controls) {
      this.controls.enabled = false;
      this.controls.autoRotate = false;
    }

    const startTime = performance.now();
    const totalDuration = 2800; // ms

    // Hide drag hint pill immediately
    const hintPill = document.getElementById('drag-hint-pill');
    if (hintPill) {
      hintPill.style.transition = 'opacity 0.3s ease';
      hintPill.style.opacity = '0';
      setTimeout(() => { if (hintPill) hintPill.style.display = 'none'; }, 300);
    }

    // Camera initial positions
    const camStartPos = this.camera.position.clone();
    const zoomInPos = camStartPos.clone().multiplyScalar(0.86);
    const camTargetPos = new THREE.Vector3(0, 9, 28);
    const lookAtStart = new THREE.Vector3(0, this.giftBoxGroup.position.y, 0);
    const lookAtTarget = new THREE.Vector3(3, 1, 0);
    const startBoxRotY = this.giftBoxGroup.rotation.y;

    // 3D Explosion Particle Burst System
    let explosionParticles = null;
    let burstTriggered = false;

    const createExplosionBurst = () => {
      const pCount = 180;
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(pCount * 3);
      const velocities = [];
      const colors = new Float32Array(pCount * 3);

      for (let i = 0; i < pCount; i++) {
        // Emit from center of gift box
        positions[i * 3] = 0;
        positions[i * 3 + 1] = this.giftBoxGroup.position.y + 0.2;
        positions[i * 3 + 2] = 0;

        // Spherical explosion velocity with high initial thrust
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const speed = 0.16 + Math.random() * 0.26;

        velocities.push({
          x: Math.sin(phi) * Math.cos(theta) * speed,
          y: Math.sin(phi) * Math.sin(theta) * speed + 0.06, // Slight upward lift
          z: Math.cos(phi) * speed
        });

        // Palette: Starlight Cyan, Radiant Gold, Pure White, Rose
        const rColor = Math.random();
        if (rColor < 0.38) {
          colors[i * 3] = 0.45; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 0.87; // Cyan
        } else if (rColor < 0.68) {
          colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.82; colors[i * 3 + 2] = 0.4;  // Gold
        } else if (rColor < 0.86) {
          colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.46; colors[i * 3 + 2] = 0.65; // Rose
        } else {
          colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0;   // Diamond White
        }
      }

      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.PointsMaterial({
        size: 0.32,
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        map: this.createGlowParticleTexture(),
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      explosionParticles = {
        mesh: new THREE.Points(geo, mat),
        velocities,
        count: pCount,
        positions,
        opacity: 1.0
      };

      this.scene.add(explosionParticles.mesh);

      // Trigger 2D confetti burst in sync
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 160,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#72efdd', '#ffd166', '#ff758f', '#ffffff', '#00b4d8']
        });
      }
    };

    const animateOpen = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      // =========================================================================
      // GIAI ĐOẠN 1: LẤY ĐÀ (Anticipation: 0ms -> 500ms, progress: 0 -> 0.18)
      // =========================================================================
      if (progress < 0.18) {
        const p1 = progress / 0.18;
        // Camera zooms in gently
        this.camera.position.lerpVectors(camStartPos, zoomInPos, p1);

        // Box wiggles with contained energy & aligns towards front view
        const wiggleAmp = Math.sin(p1 * Math.PI * 8) * (0.04 * (1 - p1) + 0.015);
        this.giftBoxGroup.rotation.z = wiggleAmp;
        this.giftBoxGroup.rotation.x = Math.cos(p1 * Math.PI * 8) * (wiggleAmp * 0.6);
        this.giftBoxGroup.rotation.y = THREE.MathUtils.lerp(startBoxRotY, 0, p1 * 0.6);

        // Build up interior light leaking from heart
        if (this.heartPointLight) {
          this.heartPointLight.intensity = p1 * 2.2;
        }
      }

      // =========================================================================
      // GIAI ĐOẠN 2: BUNG MỞ (Action: 500ms -> 1100ms, progress: 0.18 -> 0.40)
      // =========================================================================
      if (progress >= 0.18 && !burstTriggered) {
        burstTriggered = true;
        this.giftBoxGroup.rotation.z = 0;
        this.giftBoxGroup.rotation.x = 0;
        createExplosionBurst();
      }

      if (progress >= 0.18 && progress < 0.55) {
        const p2 = Math.min((progress - 0.18) / 0.22, 1);

        // 2.1 Nắp hộp bay vút lên cao kèm xoay nhẹ và mờ dần biến mất hoàn toàn
        const lidEase = Math.pow(p2, 1.8);
        const halfH = 2.2 / 2;
        this.boxLidGroup.position.y = (halfH + 0.48 / 2 - 0.02) + lidEase * 8.5;
        this.boxLidGroup.position.z = -lidEase * 2.2;
        this.boxLidGroup.rotation.x = lidEase * 0.9;
        this.boxLidGroup.rotation.y = lidEase * 0.6;

        if (p2 > 0.35) {
          const lidAlpha = Math.max(0, 1 - (p2 - 0.35) / 0.65);
          this.boxLidGroup.traverse((child) => {
            if (child.isMesh && child.material) {
              child.material.transparent = true;
              child.material.opacity = lidAlpha;
            }
          });
          if (lidAlpha <= 0) {
            this.boxLidGroup.visible = false;
          }
        }

        // 2.2 Bốn thành hộp ngả xuống mượt mà có độ nảy nhẹ (Back.out physics)
        const c1 = 1.70158;
        const c3 = c1 + 1;
        const backOut = 1 + c3 * Math.pow(p2 - 1, 3) + c1 * Math.pow(p2 - 1, 2);
        const flapAngle = (Math.PI / 2) * backOut;

        if (this.boxWalls.front) this.boxWalls.front.rotation.x = flapAngle;
        if (this.boxWalls.back) this.boxWalls.back.rotation.x = -flapAngle;
        if (this.boxWalls.left) this.boxWalls.left.rotation.z = flapAngle;
        if (this.boxWalls.right) this.boxWalls.right.rotation.z = -flapAngle;
      }

      // Update 3D Explosion Particles (Drag & Gravity & Fade)
      if (explosionParticles) {
        const pos = explosionParticles.positions;
        const vels = explosionParticles.velocities;
        for (let i = 0; i < explosionParticles.count; i++) {
          pos[i * 3] += vels[i].x;
          pos[i * 3 + 1] += vels[i].y;
          pos[i * 3 + 2] += vels[i].z;

          vels[i].x *= 0.94; // Air drag
          vels[i].y = (vels[i].y * 0.94) - 0.003; // Drag + slight gravity
          vels[i].z *= 0.94;
        }
        explosionParticles.mesh.geometry.attributes.position.needsUpdate = true;
        explosionParticles.opacity *= 0.955;
        explosionParticles.mesh.material.opacity = explosionParticles.opacity;

        if (explosionParticles.opacity < 0.01 && explosionParticles.mesh.parent) {
          this.scene.remove(explosionParticles.mesh);
          explosionParticles = null;
        }
      }

      // =========================================================================
      // GIAI ĐOẠN 3: THĂNG HOA (Follow-through: 1100ms -> 2800ms)
      // =========================================================================
      if (progress >= 0.35) {
        const p3 = Math.min((progress - 0.35) / 0.28, 1);
        const heartEase = 1 - Math.pow(1 - p3, 3);

        this.innerHeartGroup.scale.set(heartEase * 1.0, heartEase * 1.0, heartEase * 1.0);
        this.innerHeartGroup.position.y = 0.2 + heartEase * 1.35;
        this.innerHeartGroup.rotation.y += 0.04;

        if (this.heartPointLight) {
          this.heartPointLight.intensity = heartEase * 4.8;
        }
      }

      // Transition smoothly into Galaxy / Universe (progress 58% -> 100%)
      if (progress >= 0.58) {
        this.giftBoxGroup.visible = false;
        this.universeGroup.visible = true;

        const camP = (progress - 0.58) / 0.42;
        const camEase = 0.5 - Math.cos(camP * Math.PI) / 2;

        this.camera.position.lerpVectors(zoomInPos, camTargetPos, camEase);
        const currentLook = new THREE.Vector3().lerpVectors(lookAtStart, lookAtTarget, camEase);
        this.camera.lookAt(currentLook);
        this.currentLookAt.copy(currentLook);
      }

      if (progress < 1) {
        requestAnimationFrame(animateOpen);
      } else {
        this.giftBoxGroup.visible = false;
        this.universeGroup.visible = true;
        this.state = 'UNIVERSE';

        this.targetCameraPos.copy(camTargetPos);
        this.targetLookAt.copy(lookAtTarget);

        if (this.controls) {
          this.controls.enabled = true;
          this.controls.target.copy(lookAtTarget);
          this.controls.autoRotate = true;
          this.controls.autoRotateSpeed = 0.45;
        }

        if (typeof callback === 'function') callback();
      }
    };

    requestAnimationFrame(animateOpen);
  }

  focusPlanet(planetIndex, callback) {
    if (planetIndex < 0 || planetIndex >= this.planets.length) return;
    this.focusedPlanetIndex = planetIndex;
    this.state = 'PLANET_FOCUS';

    const planet = this.planets[planetIndex];
    const targetPos = planet.group.position;

    this.targetLookAt.copy(targetPos);
    this.targetCameraPos.set(
      targetPos.x,
      targetPos.y + 0.6,
      targetPos.z + planet.config.radius * 3.8
    );

    if (this.controls) {
      this.controls.autoRotate = false;
    }

    if (typeof callback === 'function') {
      setTimeout(callback, 700);
    }
  }

  resetToGalaxy() {
    this.state = 'UNIVERSE';
    this.focusedPlanetIndex = -1;
    this.targetCameraPos.set(0, 9, 28);
    this.targetLookAt.set(3, 1, 0);

    if (this.controls) {
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 0.45;
    }
  }

  resetToGiftBox() {
    this.state = 'GIFT_BOX';
    this.universeGroup.visible = false;
    this.giftBoxGroup.visible = true;

    // Restore gift lid visibility and opacity
    this.boxLidGroup.visible = true;
    this.boxLidGroup.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.opacity = 1;
      }
    });

    if (this.boxWalls.front) this.boxWalls.front.rotation.set(0, 0, 0);
    if (this.boxWalls.back) this.boxWalls.back.rotation.set(0, 0, 0);
    if (this.boxWalls.left) this.boxWalls.left.rotation.set(0, 0, 0);
    if (this.boxWalls.right) this.boxWalls.right.rotation.set(0, 0, 0);

    this.giftBoxGroup.rotation.set(0, 0, 0);

    const halfH = 2.2 / 2;
    this.boxLidGroup.position.set(0, halfH + 0.48 / 2 - 0.02, 0);
    this.boxLidGroup.rotation.set(0, 0, 0);

    this.innerHeartGroup.scale.set(0.01, 0.01, 0.01);
    this.innerHeartGroup.position.set(0, 0.1, 0);
    if (this.boxLight) this.boxLight.intensity = 0;
    if (this.heartPointLight) this.heartPointLight.intensity = 0;

    // Apply aspect ratio responsive camera position
    const aspect = window.innerWidth / window.innerHeight;
    this.updateCameraForAspect(aspect);

    if (this.controls) {
      this.controls.enabled = true;
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 1.0;
    }
  }

  // Toggle or Set Theme Dynamically
  switchTheme(themeName) {
    if (!LoveUniverseScene.THEMES[themeName]) return;
    this.currentThemeName = themeName;
    const theme = LoveUniverseScene.THEMES[themeName];

    // Update Materials
    if (this.materials.box) {
      this.materials.box.color.setHex(theme.boxColor);
      this.materials.box.emissive.setHex(theme.boxEmissive);
    }
    if (this.materials.inner) {
      this.materials.inner.color.setHex(theme.innerColor);
    }
    if (this.materials.ribbon) {
      this.materials.ribbon.color.setHex(theme.ribbonColor);
      this.materials.ribbon.emissive.setHex(theme.ribbonEmissive);
    }
    if (this.materials.heart) {
      this.materials.heart.color.setHex(theme.heartColor);
      this.materials.heart.emissive.setHex(theme.heartEmissive);
    }
    if (this.materials.pedestal) {
      this.materials.pedestal.color.setHex(theme.pedestalColor);
    }

    // Update Lights & Fog
    if (this.lights.flameRim) this.lights.flameRim.color.setHex(theme.rimLightColor);
    if (this.lights.coolRim) this.lights.coolRim.color.setHex(theme.coolRimColor);
    if (this.heartPointLight) this.heartPointLight.color.setHex(theme.coolRimColor || 0x72efdd);
    if (this.scene && this.scene.fog) this.scene.fog.color.setHex(theme.fogColor);
    if (this.renderer) this.renderer.setClearColor(theme.fogColor, 0);
  }

  /* =========================================================================
     MOUSE & RAYCAST EVENTS
     ========================================================================= */
  bindEvents() {
    window.addEventListener('resize', () => this.onWindowResize());

    let pointerDownPos = { x: 0, y: 0 };
    let pointerDownTime = 0;

    window.addEventListener('pointerdown', (e) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
      pointerDownTime = performance.now();

      // Dismiss 3D drag hint pill on user interaction
      const hintPill = document.getElementById('drag-hint-pill');
      if (hintPill) {
        hintPill.style.transition = 'opacity 0.4s ease';
        hintPill.style.opacity = '0';
        setTimeout(() => { if (hintPill) hintPill.style.display = 'none'; }, 400);
      }
    });

    window.addEventListener('pointermove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.checkRaycastHover(e);
    });

    window.addEventListener('pointerup', (e) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      const duration = performance.now() - pointerDownTime;

      // Distinguish 3D rotation from click: only open if delta < 5px and quick tap (< 400ms)
      if (dist < 5 && duration < 400) {
        this.handlePointerClick(e);
      }
    });
  }

  checkRaycastHover(e) {
    if (this.state === 'TRANSITIONING') return;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.state === 'GIFT_BOX') {
      const boxMeshes = [
        this.boxLidGroup,
        this.boxBasePlate,
        this.boxWalls.front,
        this.boxWalls.back,
        this.boxWalls.left,
        this.boxWalls.right,
      ];
      const boxIntersects = this.raycaster.intersectObjects(boxMeshes, true);
      if (boxIntersects.length > 0) {
        document.body.style.cursor = 'pointer';
        return;
      }
      document.body.style.cursor = 'default';
      return;
    }

    if (this.state === 'UNIVERSE' || this.state === 'PLANET_FOCUS') {
      const planetMeshes = this.planets.map(p => p.mesh);
      const intersects = this.raycaster.intersectObjects(planetMeshes);

      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        const hitMesh = intersects[0].object;
        const planetIdx = hitMesh.userData.milestoneIndex;
        const config = hitMesh.userData.config;

        if (this.hoveredPlanet !== planetIdx) {
          this.hoveredPlanet = planetIdx;
          if (typeof this.onPlanetHover === 'function') {
            this.onPlanetHover(planetIdx, config, e.clientX, e.clientY);
          }
        }
      } else {
        document.body.style.cursor = 'default';
        if (this.hoveredPlanet !== null) {
          this.hoveredPlanet = null;
          if (typeof this.onPlanetLeave === 'function') {
            this.onPlanetLeave();
          }
        }
      }
    }
  }

  handlePointerClick(e) {
    if (e.target.closest('#main-header') || 
        e.target.closest('#gift-intro-overlay') || 
        e.target.closest('#planet-modal') || 
        e.target.closest('#edit-modal') ||
        e.target.closest('.audio-control-bar') ||
        e.target.closest('#bottom-timeline') ||
        e.target.closest('.meteor-item')) {
      return;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.state === 'GIFT_BOX') {
      const boxMeshes = [
        this.boxLidGroup,
        this.boxBasePlate,
        this.boxWalls.front,
        this.boxWalls.back,
        this.boxWalls.left,
        this.boxWalls.right,
      ];
      const boxIntersects = this.raycaster.intersectObjects(boxMeshes, true);
      if (boxIntersects.length > 0) {
        if (typeof this.onBoxClick === 'function') {
          this.onBoxClick();
        }
      }
      return;
    }

    if (this.state === 'UNIVERSE' || this.state === 'PLANET_FOCUS') {
      const planetMeshes = this.planets.map(p => p.mesh);
      const intersects = this.raycaster.intersectObjects(planetMeshes);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const planetIdx = hitMesh.userData.milestoneIndex;
        if (typeof this.onPlanetClick === 'function') {
          this.onPlanetClick(planetIdx);
        }
      }
    }
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    this.camera.aspect = aspect;
    this.updateCameraForAspect(aspect);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /* =========================================================================
     ANIMATION LOOP
     ========================================================================= */
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    if (this.controls && this.controls.enabled) {
      this.controls.update();
    }

    if (this.state === 'PLANET_FOCUS') {
      this.camera.position.lerp(this.targetCameraPos, 0.05);
      this.currentLookAt.lerp(this.targetLookAt, 0.05);
      if (this.controls && this.controls.enabled) {
        this.controls.target.lerp(this.targetLookAt, 0.05);
      }
    }

    // Floating fireflies stardust around gift box (gently drifting upwards)
    if (this.boxSparkles && this.giftBoxGroup.visible) {
      const posAttr = this.boxSparkles.geometry.attributes.position;
      const posArr = posAttr.array;
      for (let i = 0; i < posArr.length / 3; i++) {
        posArr[i * 3 + 1] += 0.005;
        if (posArr[i * 3 + 1] > 2.8) {
          posArr[i * 3 + 1] = -1.8;
        }
      }
      posAttr.needsUpdate = true;
      this.boxSparkles.rotation.y = time * 0.18;
    }

    // Galaxy Planets & Starfield Animation
    if (this.universeGroup.visible) {
      this.planets.forEach((p, idx) => {
        p.mesh.rotation.y += 0.008 + (idx * 0.002);
        const floatOffset = Math.sin(time * 1.5 + idx) * 0.08;
        p.group.position.y = p.config.pos.y + floatOffset;
        const pulse = 1.25 + Math.sin(time * 2.5 + idx) * 0.05;
        p.glow.scale.set(pulse, pulse, pulse);

        // Update 3D milestone-specific features & animations
        this.updatePlanetMilestoneFeatures(p, idx, time, delta);
      });

      // Update screen-projected HTML floating badges
      this.updatePlanetScreenBadges();

      if (this.starfield) {
        this.starfield.rotation.y = time * 0.015;
      }

      // 3D Meteors
      this.meteors.forEach(m => {
        if (m.userData.active) {
          m.position.x -= m.userData.speed * delta;
          m.position.y -= (m.userData.speed * 0.6) * delta;
          m.position.z -= (m.userData.speed * 0.4) * delta;
          m.userData.lifetime += delta;

          if (m.userData.lifetime > 1.2) {
            m.userData.active = false;
            m.material.opacity = 0;
          }
        }
      });

      if (Math.random() < 0.015) {
        this.trigger3DMeteor();
      }
    } else {
      const container = document.getElementById('planet-badges-container');
      if (container) container.style.opacity = '0';
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate global 3D Scene
window.LoveScene = new LoveUniverseScene();
