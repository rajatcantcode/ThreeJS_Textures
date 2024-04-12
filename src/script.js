import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//Textures are the images that will conver the surface of the geometrics
//Many types with many different effects

/*Textures - class in Three js*/
//Loading an image
//We cannot use the image directly we first need to convert it to the texture
//Texture class will make the image GPU friendly to help WebGL render

// 1.Native way to load the image
// const image = new Image();
// const texture = new THREE.Texture(image);

// image.onload = () => {
//   try {
//     //texture needs to update
//     texture.needsUpdate = true;
//   } catch (e) {
//     console.log(e);
//   }
// };
// image.src = "/textures/door/ambientOcclusion.jpg";

// 2. There is also another way Three js offers as class
//                              +
// The LoadingManager is used to centralize events, making it useful for tracking
// the global loading process. It's beneficial if we want to monitor the overall loading
// progress or be notified when everything has been loaded.

// In Simple a bar of 100% will tell us whether our webExperience has been loaded yet or not

const loadingManager = new THREE.LoadingManager();

// loadingManager.onStart = () =>
// {
//     console.log('loadingManager: loading started')
// }
// loadingManager.onLoad = () =>
// {
//     console.log('loadingManager: loading finished')
// }
// loadingManager.onProgress = () =>
// {
//     console.log('loadingManager: loading progressing')
// }
// loadingManager.onError = () =>
// {
//     console.log('loadingManager: loading error')
// }

const textureLoader = new THREE.TextureLoader(loadingManager);

const alphaTexture = textureLoader.load(
  "/textures/door/alpha.jpg",
  () => {
    console.log("Load finished");
  },
  () => {
    console.log("Progress");
  },
  () => {
    console.log("error");
  }
);

const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const colorTexture = textureLoader.load("/textures/door/color.jpg");
const checkboard = textureLoader.load("/textures/checkerboard-1024x1024.png");
const checkboard2 = textureLoader.load("/textures/door/checkerboard-8x8.png");

colorTexture.colorSpace = THREE.SRGBColorSpace; //This is used to fix the color
//We can repeat the texture by using the repeat property
//It's a Vector2 with x and y coordinates
// colorTexture.repeat.x = 1;
// colorTexture.repeat.y = 1;
// //This wont' be enought doing some strange results
// //To fix that add this 3 * 2 = 6 pixels will be shown
// colorTexture.wrapS = THREE.RepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;

// //We can even useOffset
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;

//We can even do rotation
//It's just rotation in 2D space and demands radians
//Doing rotation on bottom left

colorTexture.rotation = Math.PI * 0.25;

//What if we want it rotate from center?
colorTexture.center.x = 0.5;
colorTexture.center.y = 0.5;

//If we notice at the top of cube we can notice the texture is blurry
//This is due to filtering and mipmapping
//Two types of algo used to use mipmapping
// https://medium.com/@rgbguy/mipmaps-and-why-they-are-useful-6d3e33c68b16
// Minification Filter : Pixels of textures smaller then the pixels of render
// In short , texture is too big to cover the surface of the gemoetry
//Try it with checkboard for better results
//We can even deactive the mipmapping
checkboard.generateMipmaps = false;
// checkboard.minFilter = THREE.NearestFilter;
checkboard.maxFilter = THREE.NearestFilter;

//When Preparing our textures 3 things to keep in mind
// 1. The Weight
// jpg loosely compression but usually lighter
// png lossless compression but usually heavier
// Website - https://tinypng.com/
// 2. The Size(Resolution)
// Each pixel of the image has to be stored on the GPU regardless of the image's weight
// GPU has storage limitations
// It's even more as because mipmapping increases the number of pixels to store
// Try to reduce the sizes of your images as much as possible
//Make sure the image height and width is powerd by 2 that is 512 * 512 , 1024 * 1024 , 512 * 2048
// 3. The data
//Texture supports transparency but we cant have transparency in JPG so only PNG file :)
// Good websites for textures
//https://www.arroway-textures.ch/
//https://3dtextures.me/
//https://www.poliigon.com/

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  map: checkboard,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//We can see the UV Coordinates
// console.log(geometry.attributes.uv);
//If we create our own geometry we need to specify the UV coordinates
//Even if we are using 3D sofware we need to specify the UV coordinates

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
