import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scence = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scence, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
	color: 0xff6347,
});
const torus = new THREE.Mesh(geometry, material);

scence.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scence.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scence.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
	const geometry = new THREE.SphereGeometry(0.25, 24, 24);
	const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
	const star = new THREE.Mesh(geometry, material);
	const [x, y, z] = Array(3)
		.fill()
		.map(() => THREE.MathUtils.randFloatSpread(200));

	star.position.set(x, y, z);
	scence.add(star);
}

Array(200).fill().forEach(addStar);

//Background image
const spaceTexture = new THREE.TextureLoader().load("space.jpg");
scence.background = spaceTexture;

//Avatar

const yogTexture = new THREE.TextureLoader().load("yog.png");

const yog = new THREE.Mesh(
	new THREE.BoxGeometry(3, 3, 3),
	new THREE.MeshBasicMaterial({ map: yogTexture })
);

scence.add(yog);

//Moon

const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const moonNormalTexture = new THREE.TextureLoader().load("normal.jpg");

const moon = new THREE.Mesh(
	new THREE.SphereGeometry(3, 32, 32),
	new THREE.MeshStandardMaterial({
		map: moonTexture,
		normalMap: moonNormalTexture,
	})
);
scence.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

function moveCamera() {
	const t = document.body.getBoundingClientRect().top;
	moon.rotation.x += 0.05;
	moon.rotation.y += 0.075;
	moon.rotation.z += 0.05;

	yog.rotation.y += 0.01;
	yog.rotation.z += 0.01;

	camera.position.z = t * -0.01;
	camera.position.x = t * 0.001;
	camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
function animate() {
	requestAnimationFrame(animate);

	torus.rotation.x += 0.01;
	torus.rotation.y += 0.005;
	torus.rotation.z += 0.01;

	controls.update();
	renderer.render(scence, camera);
}

animate();
