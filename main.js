import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let screenClicked = false;

// document.querySelector("#soundcloudFrame").addEventListener("click", () => {
//   screenClicked = true;
// });

// document
//   .querySelector("#soundcloudFrame")
//   .addEventListener("touchstart", () => {
//     screenClicked = true;
//   });

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
camera.position.setY(-50);

const objectObjectTransparentTexture = textureLoader.load(
  "assets/images/logoTransparent1.png"
);
const objectPlanetTexture = textureLoader.load(
  "assets/images/objectPlanetTexture.png"
);
const geometry = new THREE.SphereGeometry(15, 32, 16);
const normalTexture = textureLoader.load("assets/images/normal.jpg");
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  // wireframe: true,
  map: objectPlanetTexture,
  normal: normalTexture,
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(15, -15, 15);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xfffff);
// scene.add(ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.IcosahedronGeometry(Math.random() * 2);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    // wireframe: true,
    map: objectObjectTransparentTexture,
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
  "assets/images/wrath_ft.jpg",
  "assets/images/wrath_bk.jpg",
  "assets/images/wrath_up.jpg",
  "assets/images/wrath_dn.jpg",
  "assets/images/wrath_rt.jpg",
  "assets/images/wrath_lf.jpg",
]);
scene.background = texture;

const renderLoop = () => {
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  screenClicked =
    document.activeElement === document.getElementsByTagName("iframe")[0];
  starArray = starArray.map((star) => {
    if (screenClicked) {
      let x, y, z;
      if (Math.random() < 0.01) {
        [x, y, z] = Array(3)
          .fill()
          .map(() => THREE.MathUtils.randFloatSpread(300));
      } else {
        x =
          Math.random() > 0.9
            ? Number(star.position.x) + 0.1
            : Number(star.position.x) - 0.1;
        y =
          Math.random() > 0.9
            ? Number(star.position.y) - 0.1
            : Number(star.position.y) + 0.3;
        z =
          Math.random() > 0.9
            ? Number(star.position.z) + 0.1
            : Number(star.position.z) - 0.1;
      }
      star.position.set(x, y, z);
    }

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
