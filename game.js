import * as THREE from 'three';
import Stats from 'https://unpkg.com/three@0.142.0/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.142.0/examples/jsm/loaders/GLTFLoader.js';
import { Octree } from 'https://unpkg.com/three@0.142.0/examples/jsm/math/Octree.js';
import { OctreeHelper } from 'https://unpkg.com/three@0.142.0/examples/jsm/helpers/OctreeHelper.js';
import { DRACOLoader } from 'https://unpkg.com/three@0.142.0/examples/jsm/loaders/DRACOLoader.js';
import { Capsule } from 'https://unpkg.com/three@0.142.0/examples/jsm/math/Capsule.js';
import { GUI } from 'https://unpkg.com/three@0.142.0/examples/jsm/libs/lil-gui.module.min.js';
import { PositionalAudioHelper } from 'https://unpkg.com/three@0.142.0/examples/jsm/helpers/PositionalAudioHelper.js';
import { OrbitControls } from 'https://unpkg.com/three@0.142.0/examples/jsm/controls/OrbitControls.js';

let mixer;

// Base URL for assets from the reference site
const ASSET_BASE = 'https://fiqart.vercel.app';

// --- PROCEDURAL PORTAL TEXTURES ---
// Creating dynamic HTML5 Canvases to replace original urban video elements
function createProceduralCanvas() {
	const canvas = document.createElement('canvas');
	canvas.width = 256;
	canvas.height = 256;
	const ctx = canvas.getContext('2d');
	return { canvas, ctx };
}

const p1 = createProceduralCanvas(); // Swirling Golden Fireflies
const p2 = createProceduralCanvas(); // Glowing Tree of Life
const p3 = createProceduralCanvas(); // Trapped Bioluminescent Spores
const p4 = createProceduralCanvas(); // Cosmic Portal
const p5 = createProceduralCanvas(); // Rippling Natural Energy

const texture1 = new THREE.CanvasTexture(p1.canvas);
const texture2 = new THREE.CanvasTexture(p2.canvas);
const texture3 = new THREE.CanvasTexture(p3.canvas);
const texture4 = new THREE.CanvasTexture(p4.canvas);
const texture5 = new THREE.CanvasTexture(p5.canvas);

const movieMaterial = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
const himMaterial   = new THREE.MeshBasicMaterial({ map: texture2, side: THREE.DoubleSide });
const devilMaterial = new THREE.MeshBasicMaterial({ map: texture3, side: THREE.DoubleSide });
const deathMaterial = new THREE.MeshBasicMaterial({ map: texture4, side: THREE.DoubleSide });
const cityMaterial  = new THREE.MeshBasicMaterial({ map: texture5, side: THREE.DoubleSide });

// Portal 1: Swirling Golden Fireflies
function drawPortal1(ctx, time) {
	ctx.fillStyle = '#0a0518';
	ctx.fillRect(0, 0, 256, 256);
	
	// Central glow
	let grad = ctx.createRadialGradient(128, 128, 5, 128, 128, 110);
	grad.addColorStop(0, 'rgba(216, 245, 60, 0.45)');
	grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, 256, 256);
	
	// Spiral fireflies
	const count = 24;
	for (let i = 0; i < count; i++) {
		let angle = i * (Math.PI * 2 / count) + time * 1.2;
		let dist = 35 + Math.sin(time * 0.8 + i) * 12 + i * 3.2;
		let x = 128 + Math.cos(angle) * dist;
		let y = 128 + Math.sin(angle) * dist;
		let size = 2 + Math.abs(Math.sin(time * 2 + i)) * 3.5;
		
		ctx.beginPath();
		ctx.arc(x, y, size, 0, Math.PI * 2);
		ctx.fillStyle = `hsla(${(i * 15 + time * 15) % 360}, 95%, 68%, 0.85)`;
		ctx.shadowColor = '#d8f53c';
		ctx.shadowBlur = 8;
		ctx.fill();
	}
	ctx.shadowBlur = 0;
}

// Portal 2: Glowing Tree of Life
function drawPortal2(ctx, time) {
	ctx.fillStyle = '#060a16';
	ctx.fillRect(0, 0, 256, 256);
	
	let grad = ctx.createRadialGradient(128, 160, 5, 128, 128, 90);
	grad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
	grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, 256, 256);

	// Draw Trunk
	ctx.strokeStyle = '#38bdf8';
	ctx.lineWidth = 4;
	ctx.shadowColor = '#00e1ff';
	ctx.shadowBlur = 8;
	ctx.beginPath();
	ctx.moveTo(128, 210);
	ctx.quadraticCurveTo(128, 140, 128, 120);
	ctx.stroke();

	// Branches
	const pulse = Math.sin(time * 2.5) * 8;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(128, 145);
	ctx.quadraticCurveTo(105, 115, 85 + pulse, 105);
	ctx.moveTo(128, 145);
	ctx.quadraticCurveTo(151, 115, 171 - pulse, 105);
	ctx.moveTo(128, 125);
	ctx.quadraticCurveTo(112, 85, 112, 65 + pulse * 0.5);
	ctx.moveTo(128, 125);
	ctx.quadraticCurveTo(144, 85, 144, 65 - pulse * 0.5);
	ctx.stroke();

	// Spores / Fruits
	const fruits = [
		{ x: 85 + pulse, y: 105, color: '#d8f53c' },
		{ x: 171 - pulse, y: 105, color: '#d8f53c' },
		{ x: 112, y: 65 + pulse * 0.5, color: '#38bdf8' },
		{ x: 144, y: 65 - pulse * 0.5, color: '#a855f7' }
	];
	fruits.forEach(f => {
		ctx.beginPath();
		ctx.arc(f.x, f.y, 5 + Math.sin(time * 3 + f.x) * 2, 0, Math.PI * 2);
		ctx.fillStyle = f.color;
		ctx.shadowColor = f.color;
		ctx.shadowBlur = 10;
		ctx.fill();
	});
	ctx.shadowBlur = 0;
}

// Portal 3: Bioluminescent Spores in Container
const jarParticles = [];
for (let i = 0; i < 22; i++) {
	jarParticles.push({
		x: Math.random() * 110 + 73,
		y: Math.random() * 140 + 60,
		vx: (Math.random() - 0.5) * 45,
		vy: (Math.random() - 0.5) * 45,
		size: Math.random() * 2.5 + 2,
		color: `hsla(${(Math.random() * 40 + 70) % 360}, 90%, 65%, 0.8)`
	});
}

function drawPortal3(ctx, time, dt) {
	ctx.fillStyle = '#090d0b';
	ctx.fillRect(0, 0, 256, 256);
	
	// Jar Wireframe
	ctx.strokeStyle = 'rgba(216, 245, 60, 0.35)';
	ctx.lineWidth = 3;
	ctx.strokeRect(68, 55, 120, 150);
	ctx.strokeRect(84, 42, 88, 13);
	
	// Spores update
	jarParticles.forEach(p => {
		p.x += p.vx * dt;
		p.y += p.vy * dt;
		
		if (p.x < 72 || p.x > 182) { p.vx *= -1; p.x = Math.max(72, Math.min(182, p.x)); }
		if (p.y < 59 || p.y > 201) { p.vy *= -1; p.y = Math.max(59, Math.min(201, p.y)); }
		
		ctx.beginPath();
		ctx.arc(p.x, p.y, p.size * (1.0 + Math.sin(time * 4 + p.x) * 0.25), 0, Math.PI * 2);
		ctx.fillStyle = p.color;
		ctx.shadowColor = p.color;
		ctx.shadowBlur = 6;
		ctx.fill();
	});
	ctx.shadowBlur = 0;
}

// Portal 4: Magical Nebula Vortex
function drawPortal4(ctx, time) {
	ctx.fillStyle = '#0c0714';
	ctx.fillRect(0, 0, 256, 256);
	
	let grad = ctx.createRadialGradient(128, 128, 2, 128, 128, 120);
	grad.addColorStop(0, '#a855f7');
	grad.addColorStop(0.5, '#ec4899');
	grad.addColorStop(1, 'transparent');
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, 256, 256);
	
	ctx.save();
	ctx.translate(128, 128);
	ctx.rotate(time * 0.7);
	
	ctx.shadowColor = '#f472b6';
	ctx.shadowBlur = 12;
	ctx.fillStyle = '#ffffff';
	
	for (let j = 0; j < 4; j++) {
		ctx.rotate(Math.PI / 2);
		for (let i = 1; i < 9; i++) {
			let x = i * 14;
			let y = Math.sin(time * 3 + i) * 6;
			ctx.beginPath();
			ctx.arc(x, y, 3.5 - i * 0.35, 0, Math.PI * 2);
			ctx.fill();
		}
	}
	ctx.restore();
	ctx.shadowBlur = 0;
}

// Portal 5: Rippling Natural Energy
function drawPortal5(ctx, time) {
	ctx.fillStyle = '#050c0c';
	ctx.fillRect(0, 0, 256, 256);
	
	ctx.shadowBlur = 10;
	for (let i = 0; i < 4; i++) {
		let r = ((time * 50 + i * 50) % 150);
		let alpha = 1.0 - r / 150;
		
		ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
		ctx.shadowColor = `rgba(16, 185, 129, ${alpha})`;
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.arc(128, 128, r, 0, Math.PI * 2);
		ctx.stroke();
	}
	ctx.shadowBlur = 0;
}

const clock = new THREE.Clock();

// --- SCENE 1 (ORIGINAL GAME SCENE) ---
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x070913 );
scene.fog = new THREE.FogExp2( 0x070913, 0.035 );

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.rotation.order = 'YXZ';

const fillLight1 = new THREE.HemisphereLight( 0x223366, 0x0a0f0d, 0.35 );
fillLight1.position.set( 2, 10, 1 );
scene.add( fillLight1 );

const directionalLight = new THREE.DirectionalLight( 0xaaccff, 0.45 );
directionalLight.position.set( - 10, 20, 3 );
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.01;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.right = 30;
directionalLight.shadow.camera.left = - 30;
directionalLight.shadow.camera.top	= 30;
directionalLight.shadow.camera.bottom = - 30;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.radius = 4;
directionalLight.shadow.bias = - 0.00006;
scene.add( directionalLight );

const container = document.getElementById( 'container' );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
container.appendChild( renderer.domElement );

const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
container.appendChild( stats.domElement );

const GRAVITY = 30;
const NUM_SPHERES = 100;
const SPHERE_RADIUS = 0.2;
const STEPS_PER_FRAME = 5;

const sphereGeometry = new THREE.IcosahedronGeometry( SPHERE_RADIUS, 5 );
const sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xd8f53c } );

const spheres = [];
let sphereIdx = 0;

const projectileLights = [];
const maxProjLights = 8;
for (let i = 0; i < maxProjLights; i++) {
	const pLight = new THREE.PointLight(0xd8f53c, 2.5, 12);
	scene.add(pLight);
	projectileLights.push(pLight);
}

// --- LOAD POHON (TREE) GLB MODEL ---
let originalTreeModel = null;
let originalTreeHeight = 1.0;
const treeModelLoader = new GLTFLoader();

function createMagicalTreeFromGLB(foliageMaterial, targetHeight = 2.0) {
	if (!originalTreeModel) return new THREE.Group();
	const treeGroup = originalTreeModel.clone();
	const scaleFactor = targetHeight / originalTreeHeight;
	treeGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
	
	treeGroup.traverse( child => {
		if ( child.isMesh ) {
			const matName = child.material.name.toLowerCase();
			if ( matName.includes('leaf') || matName.includes('green') ) {
				child.material = foliageMaterial;
			}
		}
	});
	
	return treeGroup;
}

const floatingLabels = [];

function createFloatingLabelForTree(treeMesh, text) {
	const canvas = document.createElement('canvas');
	canvas.width = 256;
	canvas.height = 64;
	const ctx = canvas.getContext('2d');
	
	ctx.clearRect(0, 0, 256, 64);
	
	// Draw capsule background
	ctx.fillStyle = 'rgba(10, 18, 32, 0.85)';
	ctx.strokeStyle = '#d8f53c';
	ctx.lineWidth = 3;
	
	const x = 6, y = 6, w = 244, h = 52, r = 26;
	ctx.beginPath();
	ctx.moveTo(x+r, y);
	ctx.arcTo(x+w, y, x+w, y+h, r);
	ctx.arcTo(x+w, y+h, x, y+h, r);
	ctx.arcTo(x, y+h, x, y, r);
	ctx.arcTo(x, y, x+w, y, r);
	ctx.closePath();
	
	ctx.shadowColor = '#d8f53c';
	ctx.shadowBlur = 8;
	ctx.fill();
	ctx.stroke();
	
	ctx.shadowBlur = 0;
	ctx.fillStyle = '#ffffff';
	ctx.font = 'bold 18px "Outfit", sans-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(text, 128, 32);
	
	const texture = new THREE.CanvasTexture(canvas);
	const spriteMaterial = new THREE.SpriteMaterial({
		map: texture,
		transparent: true,
		depthTest: true
	});
	
	const sprite = new THREE.Sprite(spriteMaterial);
	sprite.scale.set(1.5, 0.375, 1.0);
	
	sprite.position.copy(treeMesh.position);
	sprite.position.y += 2.6; // floats above tree foliage
	
	scene.add(sprite);
	
	floatingLabels.push({
		sprite: sprite,
		baseY: sprite.position.y,
		offset: Math.random() * Math.PI * 2
	});
}

let movieTree, himTree, devilTree, deathTree, cityTree;

treeModelLoader.load( 'assets/pohon.glb', function( gltf ) {
	originalTreeModel = gltf.scene;
	const box = new THREE.Box3().setFromObject(originalTreeModel);
	const size = new THREE.Vector3();
	box.getSize(size);
	originalTreeHeight = size.y || 1.0;
	
	originalTreeModel.traverse( child => {
		if ( child.isMesh ) {
			child.castShadow = true;
			child.receiveShadow = true;
		}
	});
	
	movieTree = createMagicalTreeFromGLB(movieMaterial, 3.5);
	movieTree.position.set(6, -1.8, 2);
	scene.add(movieTree);
	createFloatingLabelForTree(movieTree, "Klik Pohon 🌳");

	himTree = createMagicalTreeFromGLB(himMaterial, 3.5);
	himTree.position.set(-9, 0.0, 12); // elevated platform
	scene.add(himTree);
	createFloatingLabelForTree(himTree, "Klik Pohon 🌳");

	devilTree = createMagicalTreeFromGLB(devilMaterial, 3.5);
	devilTree.position.set(12, -1.8, 0);
	scene.add(devilTree);
	createFloatingLabelForTree(devilTree, "Klik Pohon 🌳");

	deathTree = createMagicalTreeFromGLB(deathMaterial, 3.5);
	deathTree.position.set(12, -1.8, -3);
	scene.add(deathTree);
	createFloatingLabelForTree(deathTree, "Klik Pohon 🌳");

	cityTree = createMagicalTreeFromGLB(cityMaterial, 3.5);
	cityTree.position.set(12, -1.8, -6);
	scene.add(cityTree);
	createFloatingLabelForTree(cityTree, "Klik Pohon 🌳");
	
	console.log("pohon.glb loaded, successfully spawned 5 portal trees! Height:", originalTreeHeight);
	loadCollisionWorld();
});

// --- AUTO-BOUNCING TRIANGLES & SPHERES (inside basket) ---
const bouncingShapes = [];
const BOUNCE_COLORS = [
	0xff6b6b, 0xfeca57, 0x48dbfb, 0xff9ff3, 0x54a0ff,
	0x5f27cd, 0x01a3a4, 0xf368e0, 0xff6348, 0x2ed573
];

const basketCenter = { x: 0.0, z: -4.0 };
let basketHeight = 1.0;
let basketWidth = 2.2;
let basketLength = 2.2;
let basketRadius = 0.9;

for (let i = 0; i < 10; i++) {
	const isTriangle = i < 5;
	let geo;
	if (isTriangle) {
		const size = 0.12 + Math.random() * 0.15;
		geo = new THREE.TetrahedronGeometry(size, 0);
	} else {
		const radius = 0.10 + Math.random() * 0.13;
		geo = new THREE.SphereGeometry(radius, 8, 8);
	}

	const color = BOUNCE_COLORS[i % BOUNCE_COLORS.length];
	const mat = new THREE.MeshStandardMaterial({
		color: color,
		roughness: 0.3,
		metalness: 0.6,
		emissive: color,
		emissiveIntensity: 0.3
	});
	const mesh = new THREE.Mesh(geo, mat);

	const angle = (i / 10) * Math.PI * 2;
	const dist = Math.random() * 0.4;
	mesh.position.set(
		basketCenter.x + Math.cos(angle) * dist,
		-1.5,
		basketCenter.z + Math.sin(angle) * dist
	);
	mesh.castShadow = true;
	scene.add(mesh);

	bouncingShapes.push({
		mesh: mesh,
		isTriangle: isTriangle,
		velocityY: 1.5 + Math.random() * 2,
		floorY: -1.8 + 0.25,
		speedX: (Math.random() - 0.5) * 1.0,
		speedZ: (Math.random() - 0.5) * 1.0,
		spinX: (Math.random() - 0.5) * 4,
		spinY: (Math.random() - 0.5) * 4,
		spinZ: (Math.random() - 0.5) * 4,
		bounceTimer: Math.random() * 3,
		jumpInterval: 1.5 + Math.random() * 2.5,
		jumpForce: 2.5 + Math.random() * 3.5
	});
}

// --- LOAD KERANJANG (BASKET) GLB MODEL ---
const basketLoader = new GLTFLoader();
basketLoader.load( 'assets/keranjang.glb', function( gltf ) {
	const basketGroup = new THREE.Group();
	const basketModel = gltf.scene;

	const box = new THREE.Box3().setFromObject(basketModel);
	const size = new THREE.Vector3();
	box.getSize(size);
	const center = new THREE.Vector3();
	box.getCenter(center);
	
	basketModel.position.set(-center.x, -box.min.y, -center.z);
	basketGroup.add(basketModel);

	basketModel.traverse( function( child ) {
		if ( child.isMesh ) {
			child.castShadow = true;
			child.receiveShadow = true;
		}
	});

	const maxDim = Math.max(size.x, size.z);
	const scaleFactor = 2.2 / maxDim;
	basketGroup.scale.set( scaleFactor, scaleFactor, scaleFactor );
	basketGroup.position.set( basketCenter.x, -1.8, basketCenter.z );
	scene.add( basketGroup );

	basketHeight = size.y * scaleFactor;
	basketWidth = size.x * scaleFactor;
	basketLength = size.z * scaleFactor;

	const actualFloorY = -1.8 + basketHeight * 0.42;
	bouncingShapes.forEach(shape => {
		shape.floorY = actualFloorY;
		shape.mesh.position.y = actualFloorY + Math.random() * 0.4;
	});
});

const listener = new THREE.AudioListener();
camera.add( listener );
const audioElement = document.getElementById( 'music' );
const positionalAudio = new THREE.PositionalAudio( listener );
positionalAudio.setMediaElementSource( audioElement );
positionalAudio.setRefDistance( 2 );
positionalAudio.setDirectionalCone( 180, 230, 0.1 );
const helper = new PositionalAudioHelper( positionalAudio, 0.1 );

const gltfLoader = new GLTFLoader();
gltfLoader.load( 'assets/BoomBox.glb', function ( gltf ) {
	const boomBox = gltf.scene;
	boomBox.position.set( 7.7, -0.1, -9.5 );
	boomBox.scale.set( 20, 20, 20 );
	boomBox.traverse( function ( object ) {
		if ( object.isMesh ) {
			object.geometry.rotateY( - Math.PI );
			object.castShadow = true;
		}
	} );
	boomBox.add( positionalAudio );
	scene.add( boomBox );
} );

// Sound wall damping
const wallGeometry = new THREE.BoxGeometry( 2, 4, 0.1 );
const wallMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, transparent: true, opacity: 0 } );
const wall = new THREE.Mesh( wallGeometry, wallMaterial );
wall.position.set( 5.7, 5, 11.5 );
scene.add( wall );

for ( let i = 0; i < NUM_SPHERES; i ++ ) {
	const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
	sphere.castShadow = true;
	sphere.receiveShadow = true;
	scene.add( sphere );
	spheres.push( {
		mesh: sphere,
		collider: new THREE.Sphere( new THREE.Vector3( 0, - 100, 0 ), SPHERE_RADIUS ),
		velocity: new THREE.Vector3()
	} );
}

// --- ADDING 150+ FLOATING FIREFLIES (Scene 1) ---
const fireflies = [];
const fireflyCount = 150;
const fireflyGeometry = new THREE.SphereGeometry(0.04, 6, 6);
const fireflyMaterial = new THREE.MeshBasicMaterial({
	color: 0xd8f53c,
	transparent: true,
	opacity: 0.85
});

const fireflyGroup = new THREE.Group();
scene.add(fireflyGroup);

const fireflyLights = [];
const maxLights = 6;
for (let i = 0; i < maxLights; i++) {
	const light = new THREE.PointLight(0xd8f53c, 1.5, 8);
	scene.add(light);
	fireflyLights.push(light);
}

for (let i = 0; i < fireflyCount; i++) {
	const mesh = new THREE.Mesh(fireflyGeometry, fireflyMaterial);
	const x = (Math.random() - 0.5) * 44;
	const y = Math.random() * 5.5 - 0.5;
	const z = (Math.random() - 0.5) * 44;
	mesh.position.set(x, y, z);
	fireflyGroup.add(mesh);
	
	fireflies.push({
		mesh: mesh,
		basePosition: mesh.position.clone(),
		speedX: (Math.random() - 0.5) * 0.15,
		speedY: 0.1 + Math.random() * 0.25,
		speedZ: (Math.random() - 0.5) * 0.15,
		phase: Math.random() * Math.PI * 2,
		amplitude: 0.25 + Math.random() * 0.5
	});
}

const worldOctree = new Octree();
const playerCollider = new Capsule( new THREE.Vector3( 0, 0.35, 0 ), new THREE.Vector3( 0, 1, 0 ), 0.35 );
const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();

let playerOnFloor = false;
let mouseTime = 0;

const keyStates = {};
const vector1 = new THREE.Vector3();
const vector2 = new THREE.Vector3();
const vector3 = new THREE.Vector3();

document.addEventListener( 'keydown', ( event ) => {
	if (isTamanAbadi) return; // Ignore controls in Scene 2
	keyStates[ event.code ] = true;
} );

document.addEventListener( 'keyup', ( event ) => {
	keyStates[ event.code ] = false;
} );

// Start Overlay & Mouse Lock
const overlay = document.getElementById('overlay');
const startButton = document.getElementById('startButton');

startButton.addEventListener('click', () => {
	overlay.style.opacity = '0';
	overlay.style.pointerEvents = 'none';
	setTimeout(() => {
		overlay.style.display = 'none';
	}, 800);

	document.body.requestPointerLock();

	if (audioElement) {
		audioElement.play().catch(err => console.error("Audio playback block:", err));
	}
	if (listener.context.state === 'suspended') {
		listener.context.resume();
	}
});

container.addEventListener( 'mousedown', () => {
	if (isTamanAbadi) return;
	if (overlay.style.display === 'none') {
		document.body.requestPointerLock();
	}
	mouseTime = performance.now();
} );

// Click triggers tree check first. If not a tree, throw ball
document.addEventListener( 'mouseup', (event) => {
	if (overlay.style.display !== 'none') return;
	
	if (isTamanAbadi) {
		// Handle Scene 2 Click Raycast
		raycaster.setFromCamera(mousePos, camera);
		const intersects = raycaster.intersectObject(returnButtonSprite);
		if (intersects.length > 0) {
			returnToSceneAwal();
		}
		return;
	}

	if (document.pointerLockElement !== null) {
		// Check if click aims at a tree
		if (checkTreeClick(event)) {
			return; // Transition triggers, skip throwing ball
		}
		throwBall();
	}
} );

document.body.addEventListener( 'mousemove', ( event ) => {
	if (isTamanAbadi) return; // Ignore mouse rotation in Scene 2 (OrbitControls active)
	if ( document.pointerLockElement === document.body ) {
		camera.rotation.y -= event.movementX / 500;
		camera.rotation.x -= event.movementY / 500;
	}
} );

window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function throwBall() {
	const sphere = spheres[ sphereIdx ];
	camera.getWorldDirection( playerDirection );
	sphere.collider.center.copy( playerCollider.end ).addScaledVector( playerDirection, playerCollider.radius * 1.5 );
	const impulse = 15 + 30 * ( 1 - Math.exp( ( mouseTime - performance.now() ) * 0.001 ) );
	sphere.velocity.copy( playerDirection ).multiplyScalar( impulse );
	sphere.velocity.addScaledVector( playerVelocity, 2 );
	sphereIdx = ( sphereIdx + 1 ) % spheres.length;
}

function playerCollisions() {
	const result = worldOctree.capsuleIntersect( playerCollider );
	playerOnFloor = false;
	if ( result ) {
		playerOnFloor = result.normal.y > 0;
		if ( ! playerOnFloor ) {
			playerVelocity.addScaledVector( result.normal, - result.normal.dot( playerVelocity ) );
		}
		playerCollider.translate( result.normal.multiplyScalar( result.depth ) );
	}
}

function updatePlayer( deltaTime ) {
	let damping = Math.exp( - 4 * deltaTime ) - 1;
	if ( ! playerOnFloor ) {
		playerVelocity.y -= GRAVITY * deltaTime;
		damping *= 0.1;
	}

	playerVelocity.addScaledVector( playerVelocity, damping );
	const deltaPosition = playerVelocity.clone().multiplyScalar( deltaTime );
	playerCollider.translate( deltaPosition );
	playerCollisions();
	camera.position.copy( playerCollider.end );
}

function playerSphereCollision( sphere ) {
	const center = vector1.addVectors( playerCollider.start, playerCollider.end ).multiplyScalar( 0.5 );
	const sphere_center = sphere.collider.center;
	const r = playerCollider.radius + sphere.collider.radius;
	const r2 = r * r;
	for ( const point of [ playerCollider.start, playerCollider.end, center ] ) {
		const d2 = point.distanceToSquared( sphere_center );
		if ( d2 < r2 ) {
			const normal = vector1.subVectors( point, sphere_center ).normalize();
			const v1 = vector2.copy( normal ).multiplyScalar( normal.dot( playerVelocity ) );
			const v2 = vector3.copy( normal ).multiplyScalar( normal.dot( sphere.velocity ) );
			playerVelocity.add( v2 ).sub( v1 );
			sphere.velocity.add( v1 ).sub( v2 );
			const d = ( r - Math.sqrt( d2 ) ) / 2;
			sphere_center.addScaledVector( normal, - d );
		}
	}
}

// Bouncing spheres collisions (against map, player, others)
function spheresCollisions() {
	for ( let i = 0, length = spheres.length; i < length; i ++ ) {
		const s1 = spheres[ i ];
		for ( let j = i + 1; j < length; j ++ ) {
			const s2 = spheres[ j ];
			const d2 = s1.collider.center.distanceToSquared( s2.collider.center );
			const r = s1.collider.radius + s2.collider.radius;
			const r2 = r * r;

			if ( d2 < r2 ) {
				const normal = vector1.subVectors( s1.collider.center, s2.collider.center ).normalize();
				const v1 = vector2.copy( normal ).multiplyScalar( normal.dot( s1.velocity ) );
				const v2 = vector3.copy( normal ).multiplyScalar( normal.dot( s2.velocity ) );
				s1.velocity.add( v2 ).sub( v1 );
				s2.velocity.add( v1 ).sub( v2 );
				const d = ( r - Math.sqrt( d2 ) ) / 2;
				s1.collider.center.addScaledVector( normal, d );
				s2.collider.center.addScaledVector( normal, - d );
			}
		}
	}
}

function updateSpheres( deltaTime ) {
	spheres.forEach( sphere => {
		sphere.collider.center.addScaledVector( sphere.velocity, deltaTime );
		const result = worldOctree.sphereIntersect( sphere.collider );

		if ( result ) {
			sphere.velocity.addScaledVector( result.normal, - result.normal.dot( sphere.velocity ) * 1.5 );
			sphere.collider.center.add( result.normal.multiplyScalar( result.depth ) );
		} else {
			sphere.velocity.y -= GRAVITY * deltaTime;
		}

		const damping = Math.exp( - 1.5 * deltaTime ) - 1;
		sphere.velocity.addScaledVector( sphere.velocity, damping );
		playerSphereCollision( sphere );
	} );

	spheresCollisions();
	for ( const sphere of spheres ) {
		sphere.mesh.position.copy( sphere.collider.center );
	}
}

function getForwardVector() {
	camera.getWorldDirection( playerDirection );
	playerDirection.y = 0;
	playerDirection.normalize();
	return playerDirection;
}

function getSideVector() {
	camera.getWorldDirection( playerDirection );
	playerDirection.y = 0;
	playerDirection.normalize();
	playerDirection.cross( camera.up );
	return playerDirection;
}

function controls( deltaTime ) {
	const speedDelta = deltaTime * ( playerOnFloor ? 25 : 8 );
	if ( keyStates[ 'KeyW' ] ) {
		playerVelocity.add( getForwardVector().multiplyScalar( speedDelta ) );
	}
	if ( keyStates[ 'KeyS' ] ) {
		playerVelocity.add( getForwardVector().multiplyScalar( - speedDelta ) );
	}
	if ( keyStates[ 'KeyA' ] ) {
		playerVelocity.add( getSideVector().multiplyScalar( - speedDelta ) );
	}
	if ( keyStates[ 'KeyD' ] ) {
		playerVelocity.add( getSideVector().multiplyScalar( speedDelta ) );
	}
	if ( playerOnFloor ) {
		if ( keyStates[ 'Space' ] ) {
			playerVelocity.y = 15;
		}
	}
}

// --- DYNAMIC MAGICAL HOURGLASS ---
const hourglassCanvas = document.createElement('canvas');
hourglassCanvas.width = 256;
hourglassCanvas.height = 256;
const hourglassCtx = hourglassCanvas.getContext('2d');
const hourglassTexture = new THREE.CanvasTexture(hourglassCanvas);

const hourglassMaterial = new THREE.SpriteMaterial({
	map: hourglassTexture,
	transparent: true
});
const hourglassSprite = new THREE.Sprite(hourglassMaterial);
hourglassSprite.position.set(5.7, 5.0, 11.5);
hourglassSprite.scale.set(3, 3, 3);
scene.add(hourglassSprite);

const hourglassLight = new THREE.PointLight(0xd8f53c, 3, 15);
hourglassLight.position.set(5.7, 5.2, 11.5);
scene.add(hourglassLight);

function drawHourglass(ctx, time) {
	ctx.clearRect(0, 0, 256, 256);
	let aura = ctx.createRadialGradient(128, 128, 5, 128, 128, 100);
	let glowPulse = 0.8 + Math.sin(time * 4) * 0.2;
	aura.addColorStop(0, `rgba(216, 245, 60, ${0.4 * glowPulse})`);
	aura.addColorStop(0.5, `rgba(216, 245, 60, ${0.1 * glowPulse})`);
	aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
	ctx.fillStyle = aura;
	ctx.beginPath();
	ctx.arc(128, 128, 100, 0, Math.PI * 2);
	ctx.fill();

	const cycleDuration = 10;
	const runDuration = 8;
	const localTime = time % cycleDuration;
	
	let angle = 0;
	let percent = 0;
	let isFlipping = false;
	
	if (localTime < runDuration) {
		percent = localTime / runDuration;
		angle = 0;
	} else {
		percent = 1.0;
		isFlipping = true;
		const flipProgress = (localTime - runDuration) / (cycleDuration - runDuration);
		const t = flipProgress * flipProgress * (3 - 2 * flipProgress);
		angle = t * Math.PI;
	}

	ctx.save();
	ctx.translate(128, 128);
	ctx.rotate(angle);
	
	ctx.strokeStyle = '#d4af37';
	ctx.lineWidth = 6;
	ctx.lineCap = 'round';
	ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
	ctx.shadowBlur = 8;

	ctx.beginPath();
	ctx.moveTo(-50, -80);
	ctx.lineTo(50, -80);
	ctx.moveTo(-50, 80);
	ctx.lineTo(50, 80);
	ctx.stroke();

	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.moveTo(-44, -80);
	ctx.lineTo(-44, 80);
	ctx.moveTo(44, -80);
	ctx.lineTo(44, 80);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(230, 245, 255, 0.75)';
	ctx.lineWidth = 3.5;
	ctx.shadowColor = 'rgba(230, 245, 255, 0.3)';
	ctx.shadowBlur = 6;
	ctx.beginPath();
	ctx.moveTo(-35, -75);
	ctx.bezierCurveTo(-35, -30, -8, -10, -8, 0);
	ctx.bezierCurveTo(-8, 10, -35, 30, -35, 75);
	ctx.lineTo(35, 75);
	ctx.bezierCurveTo(35, 30, 8, 10, 8, 0);
	ctx.bezierCurveTo(8, -10, 35, -30, 35, -75);
	ctx.closePath();
	ctx.stroke();

	ctx.fillStyle = '#d8f53c';
	ctx.shadowColor = '#d8f53c';
	ctx.shadowBlur = 10;

	if (percent < 1.0) {
		ctx.beginPath();
		const topY = -75 + percent * 67;
		ctx.moveTo(-32, topY);
		ctx.lineTo(32, topY);
		ctx.bezierCurveTo(20, -8, 8, -4, 0, -4);
		ctx.bezierCurveTo(-8, -4, -20, -8, -32, topY);
		ctx.fill();
	}

	if (percent > 0) {
		ctx.beginPath();
		const bottomY = 75 - percent * 52;
		ctx.moveTo(-32, 75);
		ctx.quadraticCurveTo(0, bottomY, 32, 75);
		ctx.closePath();
		ctx.fill();
		
		if (!isFlipping) {
			ctx.beginPath();
			ctx.moveTo(-10, 75);
			ctx.quadraticCurveTo(0, bottomY - 6, 10, 75);
			ctx.fill();
		}
	}

	if (percent < 1.0 && !isFlipping) {
		ctx.strokeStyle = '#d8f53c';
		ctx.lineWidth = 2.5;
		ctx.beginPath();
		ctx.moveTo(0, -4);
		ctx.lineTo(0, 75 - percent * 52);
		ctx.stroke();
		
		ctx.fillStyle = '#ffffff';
		const particleY = -4 + ((time * 90) % 70);
		if (particleY < 75 - percent * 52) {
			ctx.beginPath();
			ctx.arc(0, particleY, 2, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	ctx.restore();
	ctx.shadowBlur = 0;
}

// --- CUTE WALL ART CANVAS TEXTURES ---
function createArtCanvas() {
	const c = document.createElement('canvas');
	c.width = 512; c.height = 512;
	return { canvas: c, ctx: c.getContext('2d') };
}

function drawCuteTree(ctx) {
	ctx.fillStyle = '#1a2a1a';
	ctx.fillRect(0, 0, 512, 512);
	ctx.fillStyle = '#ffe066';
	for (let i = 0; i < 40; i++) {
		const sx = Math.random() * 512, sy = Math.random() * 250;
		ctx.beginPath(); ctx.arc(sx, sy, 1.5 + Math.random() * 2, 0, Math.PI * 2); ctx.fill();
	}
	ctx.fillStyle = '#fff9c4';
	ctx.beginPath(); ctx.arc(400, 80, 40, 0, Math.PI * 2); ctx.fill();
	ctx.fillStyle = '#1a2a1a';
	ctx.beginPath(); ctx.arc(380, 70, 35, 0, Math.PI * 2); ctx.fill();
	ctx.fillStyle = '#2d5a1e';
	ctx.fillRect(0, 380, 512, 132);
	ctx.fillStyle = '#3d7a2e';
	ctx.beginPath(); ctx.ellipse(256, 380, 280, 30, 0, 0, Math.PI * 2); ctx.fill();
	ctx.fillStyle = '#8B4513';
	ctx.fillRect(230, 220, 52, 170);
	const greens = ['#2ecc71', '#27ae60', '#1abc9c', '#55efc4'];
	[[256, 180, 85], [210, 210, 60], [300, 210, 60], [256, 140, 65]].forEach(([x,y,r], i) => {
		ctx.fillStyle = greens[i];
		ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
	});
	ctx.fillStyle = '#000';
	ctx.beginPath(); ctx.arc(244, 280, 5, 0, Math.PI * 2); ctx.fill();
	ctx.beginPath(); ctx.arc(268, 280, 5, 0, Math.PI * 2); ctx.fill();
	ctx.fillStyle = 'rgba(255,150,150,0.5)';
	ctx.beginPath(); ctx.arc(235, 292, 8, 0, Math.PI * 2); ctx.fill();
	ctx.beginPath(); ctx.arc(277, 292, 8, 0, Math.PI * 2); ctx.fill();
	ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
	ctx.beginPath(); ctx.arc(256, 288, 10, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
	['#ff6b6b','#feca57','#ff9ff3','#48dbfb'].forEach((c, i) => {
		const fx = 80 + i * 100, fy = 410 + Math.sin(i) * 15;
		ctx.fillStyle = c;
		for (let p = 0; p < 5; p++) {
			const ang = (p / 5) * Math.PI * 2;
			ctx.beginPath(); ctx.arc(fx + Math.cos(ang)*8, fy + Math.sin(ang)*8, 5, 0, Math.PI*2); ctx.fill();
		}
		ctx.fillStyle = '#feca57';
		ctx.beginPath(); ctx.arc(fx, fy, 4, 0, Math.PI*2); ctx.fill();
	});
}

function drawCuteMushroom(ctx) {
	ctx.fillStyle = '#0f1a2e';
	ctx.fillRect(0, 0, 512, 512);
	ctx.fillStyle = '#ffe066';
	for (let i = 0; i < 30; i++) {
		ctx.beginPath(); ctx.arc(Math.random()*512, Math.random()*200, 1+Math.random()*2, 0, Math.PI*2); ctx.fill();
	}
	ctx.fillStyle = '#1a4a1a';
	ctx.fillRect(0, 380, 512, 132);
	ctx.fillStyle = '#f5e6d3';
	ctx.fillRect(220, 260, 72, 130);
	ctx.fillStyle = '#8B4513';
	ctx.beginPath(); ctx.arc(256, 390, 20, Math.PI, 0); ctx.fill();
	ctx.fillRect(236, 370, 40, 20);
	ctx.fillStyle = '#feca57';
	ctx.beginPath(); ctx.arc(266, 378, 3, 0, Math.PI*2); ctx.fill();
	ctx.fillStyle = '#ffeaa7';
	ctx.beginPath(); ctx.arc(270, 310, 12, 0, Math.PI*2); ctx.fill();
	ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 2;
	ctx.beginPath(); ctx.moveTo(270, 298); ctx.lineTo(270, 322); ctx.stroke();
	ctx.beginPath(); ctx.moveTo(258, 310); ctx.lineTo(282, 310); ctx.stroke();
	ctx.fillStyle = '#ff6b6b';
	ctx.beginPath(); ctx.arc(256, 260, 100, Math.PI, 0); ctx.fill();
	ctx.fillStyle = '#fff';
	[[200,220,12],[256,180,15],[310,220,12],[230,195,10],[280,195,10]].forEach(([x,y,r]) => {
		ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
	});
	ctx.strokeStyle = '#2ecc71'; ctx.lineWidth = 3;
	for (let i = 0; i < 15; i++) {
		const gx = 50 + i * 30;
		ctx.beginPath(); ctx.moveTo(gx, 400); ctx.quadraticCurveTo(gx-5, 380, gx+3, 370); ctx.stroke();
	}
	ctx.fillStyle = '#d8f53c';
	ctx.shadowColor = '#d8f53c'; ctx.shadowBlur = 12;
	for (let i = 0; i < 8; i++) {
		ctx.beginPath(); ctx.arc(100+Math.random()*312, 160+Math.random()*200, 3, 0, Math.PI*2); ctx.fill();
	}
	ctx.shadowBlur = 0;
}

function drawFireflyFamily(ctx) {
	ctx.fillStyle = '#0a1628';
	ctx.fillRect(0, 0, 512, 512);
	ctx.fillStyle = '#fff9c4';
	ctx.shadowColor = '#fff9c4'; ctx.shadowBlur = 30;
	ctx.beginPath(); ctx.arc(256, 200, 100, 0, Math.PI * 2); ctx.fill();
	ctx.shadowBlur = 0;
	
	function drawFirefly(x, y, size, bodyColor) {
		ctx.fillStyle = 'rgba(200,230,255,0.3)';
		ctx.beginPath(); ctx.ellipse(x-size*1.2, y-size*0.5, size*1.0, size*0.5, -0.3, 0, Math.PI*2); ctx.fill();
		ctx.beginPath(); ctx.ellipse(x+size*1.2, y-size*0.5, size*1.0, size*0.5, 0.3, 0, Math.PI*2); ctx.fill();
		ctx.fillStyle = bodyColor;
		ctx.beginPath(); ctx.ellipse(x, y, size*0.8, size, 0, 0, Math.PI*2); ctx.fill();
		ctx.fillStyle = '#d8f53c';
		ctx.shadowColor = '#d8f53c'; ctx.shadowBlur = 15;
		ctx.beginPath(); ctx.arc(x, y+size*0.8, size*0.4, 0, Math.PI*2); ctx.fill();
		ctx.shadowBlur = 0;
		ctx.fillStyle = '#000';
		ctx.beginPath(); ctx.arc(x-size*0.3, y-size*0.4, size*0.15, 0, Math.PI*2); ctx.fill();
		ctx.beginPath(); ctx.arc(x+size*0.3, y-size*0.4, size*0.15, 0, Math.PI*2); ctx.fill();
		ctx.fillStyle = '#fff';
		ctx.beginPath(); ctx.arc(x-size*0.25, y-size*0.45, size*0.06, 0, Math.PI*2); ctx.fill();
		ctx.beginPath(); ctx.arc(x+size*0.35, y-size*0.45, size*0.06, 0, Math.PI*2); ctx.fill();
		ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5;
		ctx.beginPath(); ctx.arc(x, y-size*0.15, size*0.25, 0.1*Math.PI, 0.9*Math.PI); ctx.stroke();
		ctx.strokeStyle = '#555'; ctx.lineWidth = 1.5;
		ctx.beginPath(); ctx.moveTo(x-size*0.2, y-size); ctx.quadraticCurveTo(x-size*0.5, y-size*1.6, x-size*0.3, y-size*1.8); ctx.stroke();
		ctx.beginPath(); ctx.moveTo(x+size*0.2, y-size); ctx.quadraticCurveTo(x+size*0.5, y-size*1.6, x+size*0.3, y-size*1.8); ctx.stroke();
		ctx.fillStyle = '#d8f53c';
		ctx.beginPath(); ctx.arc(x-size*0.3, y-size*1.8, 3, 0, Math.PI*2); ctx.fill();
		ctx.beginPath(); ctx.arc(x+size*0.3, y-size*1.8, 3, 0, Math.PI*2); ctx.fill();
	}
	drawFirefly(200, 300, 35, '#4a3728');
	drawFirefly(310, 310, 30, '#5a4738');
	drawFirefly(250, 370, 18, '#6a5748');
	drawFirefly(290, 380, 15, '#6a5748');
	
	ctx.fillStyle = '#d8f53c';
	ctx.shadowColor = '#d8f53c'; ctx.shadowBlur = 8;
	for (let i = 0; i < 20; i++) {
		ctx.beginPath(); ctx.arc(Math.random()*512, Math.random()*512, 2, 0, Math.PI*2); ctx.fill();
	}
	ctx.shadowBlur = 0;
	ctx.fillStyle = '#fff9c4';
	ctx.font = 'bold 22px Outfit, sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText('Keluarga Kunang-Kunang', 256, 470);
}

function drawSleepingCat(ctx) {
	ctx.fillStyle = '#0d1b2a';
	ctx.fillRect(0, 0, 512, 512);
	ctx.fillStyle = '#ffe066';
	for (let i = 0; i < 50; i++) {
		const r = 1 + Math.random() * 2;
		ctx.beginPath(); ctx.arc(Math.random()*512, Math.random()*512, r, 0, Math.PI*2); ctx.fill();
	}
	ctx.fillStyle = '#ffeaa7';
	ctx.shadowColor = '#ffeaa7'; ctx.shadowBlur = 25;
	ctx.beginPath(); ctx.arc(256, 220, 90, 0, Math.PI * 2); ctx.fill();
	ctx.shadowBlur = 0;
	ctx.fillStyle = '#0d1b2a';
	ctx.beginPath(); ctx.arc(290, 190, 80, 0, Math.PI * 2); ctx.fill();
	ctx.fillStyle = '#555';
	ctx.beginPath(); ctx.ellipse(230, 265, 40, 20, -0.2, 0, Math.PI*2); ctx.fill();
	ctx.beginPath(); ctx.arc(195, 255, 18, 0, Math.PI*2); ctx.fill();
	ctx.beginPath(); ctx.moveTo(182, 242); ctx.lineTo(178, 225); ctx.lineTo(192, 238); ctx.fill();
	ctx.beginPath(); ctx.moveTo(202, 240); ctx.lineTo(205, 223); ctx.lineTo(212, 240); ctx.fill();
	ctx.fillStyle = '#ff9ff3';
	ctx.beginPath(); ctx.moveTo(184, 242); ctx.lineTo(181, 230); ctx.lineTo(190, 240); ctx.fill();
	ctx.beginPath(); ctx.moveTo(204, 241); ctx.lineTo(206, 228); ctx.lineTo(210, 241); ctx.fill();
	ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
	ctx.beginPath(); ctx.arc(190, 257, 5, 0, Math.PI); ctx.stroke();
	ctx.beginPath(); ctx.arc(200, 257, 5, 0, Math.PI); ctx.stroke();
	ctx.fillStyle = '#ff9ff3';
	ctx.beginPath(); ctx.moveTo(195, 262); ctx.lineTo(193, 265); ctx.lineTo(197, 265); ctx.fill();
	ctx.strokeStyle = '#555'; ctx.lineWidth = 6; ctx.lineCap = 'round';
	ctx.beginPath(); ctx.moveTo(270, 265); ctx.quadraticCurveTo(290, 250, 280, 230); ctx.stroke();
	ctx.fillStyle = '#fff9c4';
	ctx.font = 'bold 18px Outfit, sans-serif';
	ctx.fillText('z', 215, 230);
	ctx.font = 'bold 24px Outfit, sans-serif';
	ctx.fillText('Z', 230, 215);
	ctx.font = 'bold 30px Outfit, sans-serif';
	ctx.fillText('Z', 250, 195);
	ctx.fillStyle = '#d8f53c';
	ctx.shadowColor = '#d8f53c'; ctx.shadowBlur = 10;
	for (let i = 0; i < 12; i++) {
		ctx.beginPath(); ctx.arc(50+Math.random()*412, 300+Math.random()*180, 2.5, 0, Math.PI*2); ctx.fill();
	}
	ctx.shadowBlur = 0;
	ctx.fillStyle = '#fff9c4';
	ctx.font = 'bold 20px Outfit, sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText('Selamat Tidur~ 🌙', 256, 480);
}

const artCanvases = [createArtCanvas(), createArtCanvas(), createArtCanvas(), createArtCanvas()];
drawCuteTree(artCanvases[0].ctx);
drawCuteMushroom(artCanvases[1].ctx);
drawFireflyFamily(artCanvases[2].ctx);
drawSleepingCat(artCanvases[3].ctx);

const artTextures = artCanvases.map(ac => {
	const tex = new THREE.CanvasTexture(ac.canvas);
	tex.colorSpace = THREE.SRGBColorSpace;
	return tex;
});

// --- MOSS TEXTURE ---
function createMossTexture() {
	const canvas = document.createElement('canvas');
	canvas.width = 512;
	canvas.height = 512;
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = '#10250d';
	ctx.fillRect(0, 0, 512, 512);

	const colors = ['#1d3c16', '#254a1d', '#132810', '#2d5424', '#0d1c0b', '#3b6b31'];
	for (let i = 0; i < 600; i++) {
		const x = Math.random() * 512;
		const y = Math.random() * 512;
		const r = 15 + Math.random() * 45;
		ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2);
		ctx.fill();
	}

	for (let i = 0; i < 20000; i++) {
		const x = Math.random() * 512;
		const y = Math.random() * 512;
		const len = 4 + Math.random() * 9;
		const angle = Math.random() * Math.PI * 2;
		
		ctx.strokeStyle = Math.random() > 0.5 ? '#3b6b31' : '#4d8742';
		ctx.lineWidth = 1 + Math.random() * 1.5;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
		ctx.stroke();
	}

	ctx.fillStyle = 'rgba(216, 245, 60, 0.55)';
	ctx.shadowColor = 'rgba(216, 245, 60, 0.8)';
	ctx.shadowBlur = 4;
	for (let i = 0; i < 200; i++) {
		const x = Math.random() * 512;
		const y = Math.random() * 512;
		ctx.beginPath();
		ctx.arc(x, y, 1.2 + Math.random() * 1.8, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.shadowBlur = 0;

	const texture = new THREE.CanvasTexture(canvas);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(16, 16);
	return texture;
}

const mossTexture = createMossTexture();

function loadCollisionWorld() {
	const loader = new GLTFLoader().setPath( 'assets/' );
	loader.load( 'collision-world.glb', ( gltf ) => {
		const meshesToRemove = [];
		let artIndex = 0;
		gltf.scene.traverse( child => {
			if ( child.isMesh ) {
				if ( child.name.includes("Cylinder") ) {
					meshesToRemove.push(child);
				}
				if ( child.name === 'MAP' ) {
					child.material = new THREE.MeshStandardMaterial({
						map: mossTexture,
						roughness: 0.9,
						metalness: 0.1
					});
				}
				if ( child.name.match(/^art\d?$/) && artIndex < artTextures.length ) {
					child.material = new THREE.MeshBasicMaterial({
						map: artTextures[artIndex],
						side: THREE.DoubleSide
					});
					artIndex++;
				}
				child.castShadow = true;
				child.receiveShadow = true;
				if ( child.material.map ) {
					child.material.map.anisotropy = 4;
				}
			}
		} );

		let spawnedCenterpieceTree = false;
		meshesToRemove.forEach(mesh => {
			const worldPos = new THREE.Vector3();
			mesh.getWorldPosition(worldPos);

			if (mesh.name === "Cylinder" && !spawnedCenterpieceTree) {
				const centerFoliageMat = new THREE.MeshBasicMaterial({ color: 0x4ade80 });
				const centerTree = createMagicalTreeFromGLB(centerFoliageMat, 6.0);
				
				const centerTreeLight = new THREE.PointLight(0x4ade80, 4, 18);
				centerTreeLight.position.set(worldPos.x, 1.5, worldPos.z);
				scene.add(centerTreeLight);

				centerTree.position.set(worldPos.x, -1.8, worldPos.z);
				scene.add(centerTree);
				spawnedCenterpieceTree = true;
			}

			if (mesh.parent) {
				mesh.parent.remove(mesh);
			}
		});

		scene.add( gltf.scene );
		worldOctree.fromGraphNode( gltf.scene );

		const helper = new OctreeHelper( worldOctree );
		helper.visible = false;
		scene.add( helper );
		
		// Build the new Scene 2 "Taman Abadi"
		createTamanAbadiScene();
		
		// Start loop
		animate();
	} );
}

function teleportPlayerIfOob() {
	if ( camera.position.y <= - 25 ) {
		playerCollider.start.set( 0, 0.35, 0 );
		playerCollider.end.set( 0, 1, 0 );
		playerCollider.radius = 0.35;
		camera.position.copy( playerCollider.end );
		camera.rotation.set( 0, 0, 0 );
	}
}


// ==========================================
// SCENE 2: TAMAN ABADI (THE ETERNAL GARDEN)
// ==========================================
let isTamanAbadi = false;
let sceneTamanAbadi;
let controlsTaman;
let returnButtonSprite;
let returnCanvas, returnCtx, returnTexture;
let isReturnHovered = false;
let tamanFireflies;
const tamanFireflyCount = 150;
const tamanFireflyData = [];
const tamanLamps = [];
let hoverTimer = 0;
const hoverThreshold = 1.0;

// Raycast & Interaction
const raycaster = new THREE.Raycaster();
const mousePos = new THREE.Vector2(-9999, -9999);

window.addEventListener('mousemove', (event) => {
	mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
	mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function createTamanAbadiScene() {
	sceneTamanAbadi = new THREE.Scene();
	sceneTamanAbadi.background = new THREE.Color(0x04060f);
	sceneTamanAbadi.fog = new THREE.FogExp2(0x04060f, 0.045);
	
	// Lights
	const ambientLight = new THREE.AmbientLight(0x0c1424, 0.45);
	sceneTamanAbadi.add(ambientLight);
	
	const moonLight = new THREE.DirectionalLight(0x86efac, 0.3);
	moonLight.position.set(-15, 25, 10);
	moonLight.castShadow = true;
	sceneTamanAbadi.add(moonLight);
	
	// Garden Ground
	const groundGeo = new THREE.PlaneGeometry(60, 60, 32, 32);
	const posAttr = groundGeo.attributes.position;
	for (let i = 0; i < posAttr.count; i++) {
		const vx = posAttr.getX(i);
		const vy = posAttr.getY(i);
		const height = Math.sin(vx * 0.15) * Math.cos(vy * 0.15) * 0.8 + Math.sin(vx * 0.05) * 0.3;
		posAttr.setZ(i, height);
	}
	groundGeo.computeVertexNormals();
	
	const groundMat = new THREE.MeshStandardMaterial({
		color: 0x071e0f, // deep green grass
		roughness: 0.95,
		metalness: 0.01,
		flatShading: true
	});
	const ground = new THREE.Mesh(groundGeo, groundMat);
	ground.rotation.x = -Math.PI / 2;
	ground.position.y = -2;
	ground.receiveShadow = true;
	sceneTamanAbadi.add(ground);
	
	// Stars
	const starGeo = new THREE.BufferGeometry();
	const starCount = 600;
	const starPositions = [];
	for (let i = 0; i < starCount; i++) {
		const radius = 100 + Math.random() * 150;
		const u = Math.random(), v = Math.random();
		const theta = u * 2.0 * Math.PI;
		const phi = Math.acos(2.0 * v - 1.0);
		starPositions.push(
			radius * Math.sin(phi) * Math.cos(theta),
			Math.abs(radius * Math.sin(phi) * Math.sin(theta)) + 10,
			radius * Math.cos(phi)
		);
	}
	starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
	const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, transparent: true, opacity: 0.75 });
	const starPoints = new THREE.Points(starGeo, starMat);
	sceneTamanAbadi.add(starPoints);

	// Fallback Trees for Scene 2
	const treeGroup = new THREE.Group();
	sceneTamanAbadi.add(treeGroup);
	const spawnRange = 24;
	for (let i = 0; i < 8; i++) {
		const tree = createProceduralTamanTree();
		let tx = (Math.random() - 0.5) * spawnRange;
		let tz = (Math.random() - 0.5) * spawnRange;
		while (Math.sqrt(tx*tx + tz*tz) < 6) {
			tx = (Math.random() - 0.5) * spawnRange;
			tz = (Math.random() - 0.5) * spawnRange;
		}
		const ty = Math.sin(tx * 0.15) * Math.cos(tz * 0.15) * 0.8 + Math.sin(tx * 0.05) * 0.3 - 2;
		tree.position.set(tx, ty, tz);
		const scale = 0.8 + Math.random() * 0.8;
		tree.scale.set(scale, scale, scale);
		tree.rotation.y = Math.random() * Math.PI * 2;
		treeGroup.add(tree);
	}

	// Warm glowing lamp posts
	const lampPositions = [
		new THREE.Vector3(-5, -2, -5),
		new THREE.Vector3(5, -2, -7),
		new THREE.Vector3(0, -2, 5)
	];
	lampPositions.forEach((pos, idx) => {
		createTamanLampPost(pos, idx);
	});

	// Fireflies swarm
	createTamanFireflies();

	// Return Button Sprite
	createReturnButtonSprite();

	// Setup OrbitControls
	controlsTaman = new OrbitControls(camera, renderer.domElement);
	controlsTaman.enabled = false;
	controlsTaman.enableDamping = true;
	controlsTaman.dampingFactor = 0.05;
	controlsTaman.maxPolarAngle = Math.PI / 2 - 0.05;
	controlsTaman.minDistance = 3;
	controlsTaman.maxDistance = 22;
}

function createProceduralTamanTree() {
	const group = new THREE.Group();
	const trunkGeo = new THREE.CylinderGeometry(0.18, 0.3, 2.5, 8);
	const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.95 });
	const trunk = new THREE.Mesh(trunkGeo, trunkMat);
	trunk.position.y = 1.25;
	trunk.castShadow = true;
	group.add(trunk);
	
	const foliageMat = new THREE.MeshStandardMaterial({ color: 0x093818, roughness: 0.8, flatShading: true });
	const leaves1 = new THREE.DodecahedronGeometry(1.0, 1);
	const leaf1 = new THREE.Mesh(leaves1, foliageMat);
	leaf1.position.y = 2.4;
	leaf1.castShadow = true;
	group.add(leaf1);

	const leaves2 = new THREE.DodecahedronGeometry(0.7, 1);
	const leaf2 = new THREE.Mesh(leaves2, foliageMat);
	leaf2.position.y = 3.2;
	leaf2.castShadow = true;
	group.add(leaf2);

	return group;
}

function createTamanLampPost(position, index) {
	const lampGroup = new THREE.Group();
	lampGroup.position.copy(position);

	const postGeo = new THREE.CylinderGeometry(0.05, 0.07, 3.0, 8);
	const postMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.7, roughness: 0.5 });
	const post = new THREE.Mesh(postGeo, postMat);
	post.position.y = 1.5;
	post.castShadow = true;
	lampGroup.add(post);

	const bulbGeo = new THREE.SphereGeometry(0.12, 16, 16);
	const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffe280, emissive: 0xffaa00, emissiveIntensity: 2.0 });
	const bulb = new THREE.Mesh(bulbGeo, bulbMat);
	bulb.position.set(0, 3.05, 0);
	lampGroup.add(bulb);

	const light = new THREE.PointLight(0xffb703, 3.5, 12);
	light.position.set(0, 3.0, 0);
	light.castShadow = true;
	lampGroup.add(light);

	tamanLamps.push({ light: light, bulb: bulb, offset: index * Math.PI * 0.5 });
	sceneTamanAbadi.add(lampGroup);
}

function createTamanFireflies() {
	const canvas = document.createElement('canvas');
	canvas.width = 32; canvas.height = 32;
	const ctx = canvas.getContext('2d');
	let grad = ctx.createRadialGradient(16, 16, 1, 16, 16, 16);
	grad.addColorStop(0, 'rgba(216, 245, 60, 1.0)');
	grad.addColorStop(0.2, 'rgba(163, 230, 53, 0.8)');
	grad.addColorStop(0.5, 'rgba(101, 163, 13, 0.3)');
	grad.addColorStop(1, 'rgba(0,0,0,0)');
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, 32, 32);

	const texture = new THREE.CanvasTexture(canvas);
	const starGeo = new THREE.BufferGeometry();
	const positions = new Float32Array(tamanFireflyCount * 3);

	for (let i = 0; i < tamanFireflyCount; i++) {
		const x = (Math.random() - 0.5) * 25;
		const y = Math.random() * 4.5 - 1.2;
		const z = (Math.random() - 0.5) * 25;
		positions[i * 3] = x;
		positions[i * 3 + 1] = y;
		positions[i * 3 + 2] = z;

		tamanFireflyData.push({
			x: x, y: y, z: z,
			vx: (Math.random() - 0.5) * 0.5,
			vy: (Math.random() - 0.5) * 0.35,
			vz: (Math.random() - 0.5) * 0.5,
			freqX: 1.2 + Math.random() * 2.5,
			freqY: 1.2 + Math.random() * 2.5,
			freqZ: 1.2 + Math.random() * 2.5,
			ampX: 0.1 + Math.random() * 0.2,
			ampY: 0.08 + Math.random() * 0.15,
			ampZ: 0.1 + Math.random() * 0.2,
			offset: Math.random() * Math.PI * 2
		});
	}

	starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	const starMat = new THREE.PointsMaterial({
		size: 0.45,
		map: texture,
		transparent: true,
		blending: THREE.AdditiveBlending,
		depthWrite: false
	});
	tamanFireflies = new THREE.Points(starGeo, starMat);
	sceneTamanAbadi.add(tamanFireflies);
}

function createReturnButtonSprite() {
	returnCanvas = document.createElement('canvas');
	returnCanvas.width = 512;
	returnCanvas.height = 512;
	returnCtx = returnCanvas.getContext('2d');
	returnTexture = new THREE.CanvasTexture(returnCanvas);

	drawReturnCircle(false, 0);

	const returnGeo = new THREE.CircleGeometry(1.2, 32);
	const returnMat = new THREE.MeshBasicMaterial({
		map: returnTexture,
		transparent: true,
		side: THREE.DoubleSide
	});

	returnButtonSprite = new THREE.Mesh(returnGeo, returnMat);
	returnButtonSprite.position.set(0, 1.2, -6);
	sceneTamanAbadi.add(returnButtonSprite);
}

function drawReturnCircle(hovered, time) {
	const ctx = returnCtx;
	ctx.clearRect(0, 0, 512, 512);

	ctx.shadowColor = '#d8f53c';
	ctx.shadowBlur = hovered ? 25 : 12;

	ctx.fillStyle = hovered ? 'rgba(216, 245, 60, 0.15)' : 'rgba(10, 15, 30, 0.8)';
	ctx.strokeStyle = '#d8f53c';
	ctx.lineWidth = 10;

	ctx.beginPath();
	ctx.arc(256, 256, 210, 0, Math.PI * 2);
	ctx.fill();
	ctx.stroke();

	ctx.save();
	ctx.translate(256, 256);
	ctx.rotate(time * 0.4);
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
	ctx.lineWidth = 4;
	ctx.setLineDash([15, 12]);
	ctx.beginPath();
	ctx.arc(0, 0, 185, 0, Math.PI * 2);
	ctx.stroke();
	ctx.restore();

	ctx.shadowBlur = 0;
	ctx.fillStyle = '#ffffff';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	ctx.font = 'bold 36px Outfit, sans-serif';
	ctx.fillText('BALIK KE', 256, 205);

	ctx.fillStyle = '#d8f53c';
	ctx.font = '800 64px Outfit, sans-serif';
	ctx.fillText('SCENE AWAL', 256, 268);

	ctx.fillStyle = '#94a3b8';
	ctx.font = '600 24px Outfit, sans-serif';
	ctx.fillText(hovered ? 'LEPASKAN...' : 'ARAHKAN KURSOR', 256, 335);

	returnTexture.needsUpdate = true;
}

// Raycasting Tree check
function checkTreeClick(event) {
	if (isTamanAbadi) return false;

	if (document.pointerLockElement === document.body) {
		raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
	} else {
		raycaster.setFromCamera(mousePos, camera);
	}

	const targetTrees = [];
	if (movieTree) targetTrees.push(movieTree);
	if (himTree) targetTrees.push(himTree);
	if (devilTree) targetTrees.push(devilTree);
	if (deathTree) targetTrees.push(deathTree);
	if (cityTree) targetTrees.push(cityTree);

	const intersects = raycaster.intersectObjects(targetTrees, true);

	if (intersects.length > 0) {
		enterTamanAbadi();
		return true;
	}
	return false;
}

// State saving variables
const savedPlayerStart = new THREE.Vector3();
const savedPlayerEnd = new THREE.Vector3();
const savedPlayerVelocity = new THREE.Vector3();
const savedCameraRotation = new THREE.Euler();

function enterTamanAbadi() {
	if (isTamanAbadi) return;

	// Save original state
	savedPlayerStart.copy(playerCollider.start);
	savedPlayerEnd.copy(playerCollider.end);
	savedPlayerVelocity.copy(playerVelocity);
	savedCameraRotation.copy(camera.rotation);

	// Trigger black transition
	const transition = document.getElementById('transition-overlay');
	if (transition) transition.classList.add('active');

	setTimeout(() => {
		isTamanAbadi = true;
		
		const sceneBadge = document.getElementById('scene-badge');
		if (sceneBadge) {
			sceneBadge.textContent = "Taman Abadi";
			sceneBadge.style.color = "#d8f53c";
			sceneBadge.style.borderColor = "rgba(216, 245, 60, 0.4)";
		}

		// Position camera in Scene 2
		camera.position.set(0, 2.8, 8);
		camera.rotation.set(0, 0, 0);

		if (controlsTaman) {
			controlsTaman.target.set(0, 1.2, -6);
			controlsTaman.update();
			controlsTaman.enabled = true;
		}

		document.exitPointerLock();

		// Show description card for Taman Abadi
		const descCard = document.getElementById('taman-desc-card');
		if (descCard) {
			descCard.style.display = 'block';
			setTimeout(() => {
				descCard.style.opacity = '1';
			}, 50);
		}

		setTimeout(() => {
			if (transition) transition.classList.remove('active');
		}, 300);
	}, 800);
}

function returnToSceneAwal() {
	if (!isTamanAbadi) return;

	const transition = document.getElementById('transition-overlay');
	if (transition) transition.classList.add('active');

	setTimeout(() => {
		isTamanAbadi = false;

		const sceneBadge = document.getElementById('scene-badge');
		if (sceneBadge) {
			sceneBadge.textContent = "Taman Labirin Awal";
			sceneBadge.style.color = "#00f3ff";
			sceneBadge.style.borderColor = "rgba(6, 182, 212, 0.4)";
		}

		if (controlsTaman) {
			controlsTaman.enabled = false;
		}

		// Restore original state
		playerCollider.start.copy(savedPlayerStart);
		playerCollider.end.copy(savedPlayerEnd);
		playerVelocity.copy(savedPlayerVelocity);
		camera.rotation.copy(savedCameraRotation);
		camera.position.copy(playerCollider.end);

		document.body.requestPointerLock();

		// Hide description card
		const descCard = document.getElementById('taman-desc-card');
		if (descCard) {
			descCard.style.opacity = '0';
			setTimeout(() => {
				descCard.style.display = 'none';
			}, 500);
		}

		setTimeout(() => {
			if (transition) transition.classList.remove('active');
		}, 300);
	}, 800);
}

function animate() {
	const frameDelta = clock.getDelta();
	const totalTime = clock.getElapsedTime();

	if (isTamanAbadi) {
		// --- RENDER SCENE 2 ---
		if (controlsTaman) controlsTaman.update();

		// Pulse lanterns bulb glows
		tamanLamps.forEach(lamp => {
			const glow = 2.0 + Math.sin(totalTime * 4.0 + lamp.offset) * 0.6;
			lamp.light.intensity = glow * 1.8;
			lamp.bulb.material.emissiveIntensity = glow;
		});

		// Billboard return button facing camera
		returnButtonSprite.lookAt(camera.position);

		// Raycast hover check
		raycaster.setFromCamera(mousePos, camera);
		const intersects = raycaster.intersectObject(returnButtonSprite);
		const isHovered = intersects.length > 0;

		if (isHovered) {
			if (!isReturnHovered) {
				isReturnHovered = true;
				drawReturnCircle(true, totalTime);
			}
			hoverTimer += frameDelta;
			returnButtonSprite.scale.set(1.1, 1.1, 1.1);

			if (hoverTimer >= hoverThreshold) {
				returnToSceneAwal();
			}
		} else {
			if (isReturnHovered) {
				isReturnHovered = false;
				drawReturnCircle(false, totalTime);
			}
			hoverTimer = Math.max(0, hoverTimer - frameDelta * 2.0);
			returnButtonSprite.scale.set(1.0, 1.0, 1.0);
		}

		// Animate fireflies
		const posAttr = tamanFireflies.geometry.attributes.position;
		for (let i = 0; i < tamanFireflyCount; i++) {
			const p = tamanFireflyData[i];
			p.x += p.vx * frameDelta;
			p.y += p.vy * frameDelta;
			p.z += p.vz * frameDelta;

			const wx = p.x + Math.sin(totalTime * p.freqX + p.offset) * p.ampX;
			const wy = p.y + Math.cos(totalTime * p.freqY + p.offset) * p.ampY;
			const wz = p.z + Math.sin(totalTime * p.freqZ + p.offset) * p.ampZ;

			const limit = 15.0;
			if (Math.abs(p.x) > limit) { p.vx *= -1; p.x = Math.sign(p.x) * limit; }
			if (p.y < -1.8 || p.y > 4.5) { p.vy *= -1; p.y = Math.max(-1.8, Math.min(4.5, p.y)); }
			if (Math.abs(p.z) > limit) { p.vz *= -1; p.z = Math.sign(p.z) * limit; }

			posAttr.setXYZ(i, wx, wy, wz);
		}
		posAttr.needsUpdate = true;

		renderer.render(sceneTamanAbadi, camera);
	} else {
		// --- RENDER SCENE 1 (ORIGINAL GAME SCENE) ---
		const deltaTime = Math.min( 0.05, frameDelta ) / STEPS_PER_FRAME;
		for ( let i = 0; i < STEPS_PER_FRAME; i ++ ) {
			controls( deltaTime );
			updatePlayer( deltaTime );
			updateSpheres( deltaTime );
			teleportPlayerIfOob();
		}
		
		if ( mixer ) mixer.update( frameDelta );

		// Animate Scene 1 tree labels bobbing
		floatingLabels.forEach(label => {
			label.sprite.position.y = label.baseY + Math.sin(totalTime * 3.0 + label.offset) * 0.12;
		});

		// Animate Scene 1 fireflies
		fireflies.forEach((ff, index) => {
			ff.mesh.position.y = ff.basePosition.y + Math.sin(totalTime * ff.speedY + ff.phase) * ff.amplitude;
			ff.mesh.position.x = ff.basePosition.x + Math.sin(totalTime * ff.speedX + ff.phase) * 2.0;
			ff.mesh.position.z = ff.basePosition.z + Math.cos(totalTime * ff.speedZ + ff.phase) * 2.0;
			
			if (Math.abs(ff.mesh.position.x) > 25) ff.basePosition.x *= -1;
			if (Math.abs(ff.mesh.position.z) > 25) ff.basePosition.z *= -1;

			if (index < maxLights) {
				fireflyLights[index].position.copy(ff.mesh.position);
				fireflyLights[index].intensity = 1.2 + Math.sin(totalTime * 3.5 + index) * 0.4;
			}
		});

		// Projectile glows
		projectileLights.forEach(l => l.position.set(0, -999, 0));
		let activeLightIdx = 0;
		spheres.forEach(s => {
			if (s.collider.center.y > -50) {
				if (activeLightIdx < maxProjLights) {
					projectileLights[activeLightIdx].position.copy(s.collider.center);
					projectileLights[activeLightIdx].intensity = 2.0 + Math.sin(totalTime * 8 + activeLightIdx) * 0.6;
					activeLightIdx++;
				}
			}
		});

		drawHourglass(hourglassCtx, totalTime);
		hourglassTexture.needsUpdate = true;

		hourglassSprite.position.y = 5.0 + Math.sin(totalTime * 2.8) * 0.35;
		hourglassLight.position.y = hourglassSprite.position.y + 0.1;
		hourglassLight.intensity = 2.5 + Math.sin(totalTime * 5.5) * 0.6;

		drawPortal1(p1.ctx, totalTime);
		drawPortal2(p2.ctx, totalTime);
		drawPortal3(p3.ctx, totalTime, frameDelta);
		drawPortal4(p4.ctx, totalTime);
		drawPortal5(p5.ctx, totalTime);

		texture1.needsUpdate = true;
		texture2.needsUpdate = true;
		texture3.needsUpdate = true;
		texture4.needsUpdate = true;
		texture5.needsUpdate = true;

		bouncingShapes.forEach(shape => {
			const dt = Math.min(frameDelta, 0.05);
			shape.velocityY -= 15 * dt;
			shape.mesh.position.y += shape.velocityY * dt;

			if (shape.mesh.position.y <= shape.floorY) {
				shape.mesh.position.y = shape.floorY;
				shape.velocityY = Math.abs(shape.velocityY) * 0.6;
				if (shape.velocityY < 0.5) shape.velocityY = 0.5;
			}

			shape.bounceTimer += dt;
			if (shape.bounceTimer >= shape.jumpInterval) {
				shape.bounceTimer = 0;
				shape.velocityY = shape.jumpForce;
				shape.speedX = (Math.random() - 0.5) * 2;
				shape.speedZ = (Math.random() - 0.5) * 2;
			}

			shape.mesh.position.x += shape.speedX * dt;
			shape.mesh.position.z += shape.speedZ * dt;

			const dx = shape.mesh.position.x - basketCenter.x;
			const dz = shape.mesh.position.z - basketCenter.z;
			const halfW = basketWidth * 0.38;
			const halfL = basketLength * 0.38;

			if (Math.abs(dx) > halfW) {
				shape.mesh.position.x = basketCenter.x + Math.sign(dx) * halfW;
				shape.speedX = -shape.speedX * 0.8;
			}
			if (Math.abs(dz) > halfL) {
				shape.mesh.position.z = basketCenter.z + Math.sign(dz) * halfL;
				shape.speedZ = -shape.speedZ * 0.8;
			}

			shape.mesh.rotation.x += shape.spinX * dt;
			shape.mesh.rotation.y += shape.spinY * dt;
			if (shape.isTriangle) {
				shape.mesh.rotation.z += shape.spinZ * dt;
			}
		});

		renderer.render(scene, camera);
	}

	stats.update();
	requestAnimationFrame(animate);
}
