import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);

const objectObjectTransparentTexture = textureLoader.load(
  "/images/logoTransparent1.png"
);
const geometry = new THREE.BoxGeometry(15, 15, 15);
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  // wireframe: true,
  map: objectObjectTransparentTexture,
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

const pointLight = new THREE.PointLight(0xfffff);
pointLight.position.set(15, -5, 15);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xfffff);
// scene.add(ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.IcosahedronGeometry(Math.random() * 0.5);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    wireframe: true,
  });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(300));

  star.position.set(x, y, z);
  scene.add(star);
  return star;
}

let starArray = Array(1000).fill().map(addStar);

// Background

// const spaceTexture = new THREE.TextureLoader().load("logoTransparent1.png");
const texture = cubeTextureLoader.load([
  "./images/wrath_ft.jpg",
  "./images/wrath_bk.jpg",
  "./images/wrath_up.jpg",
  "./images/wrath_dn.jpg",
  "./images/wrath_rt.jpg",
  "./images/wrath_lf.jpg",
]);
scene.background = texture;

const renderLoop = () => {
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  starArray = starArray.map((star) => {
    const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(100));
    star.rotation.x += Math.random() * 0.05;
    star.rotation.y += Math.random() * 0.005;
    star.rotation.z += Math.random() * 0.05;
    return star;
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(renderLoop);
};
renderLoop();
