import "https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js";
import "https://cdn.jsdelivr.net/npm/mind-ar@1.2.7/dist/mindar-image-three.prod.js";

// DOM elements
const intro = document.getElementById('intro');
const arCanvasContainer = document.getElementById('ar-canvas');

// Create and append Start AR button
const startBtn = document.createElement('button');
startBtn.textContent = "Start AR";
startBtn.className = "ar-start-btn";
intro.appendChild(startBtn);

// Setup AR system (but don't start yet)
let mindarThree, renderer, scene, camera, anchor, plane;

startBtn.addEventListener('click', async () => {
  // Hide intro, show AR canvas
  intro.style.display = 'none';
  arCanvasContainer.style.display = 'block';

  // Initialize MindAR
  mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: arCanvasContainer,
    imageTargetSrc: './targets.mind', // Created from your marker
  });
  ({ renderer, scene, camera } = mindarThree);

  // Prepare anchor for the first image target (your postcard marker)
  anchor = mindarThree.addAnchor(0);

  // Load sun0060.png as overlay
  const loader = new THREE.TextureLoader();
  loader.load('assets/sun0060.png', (texture) => {
    const aspect = texture.image.width / texture.image.height;
    const geometry = new THREE.PlaneGeometry(aspect, 1);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    plane = new THREE.Mesh(geometry, material);
    plane.position.set(0, 0, 0); // Centered on marker
  });

  // Only show overlay plane when marker is detected
  anchor.onTargetFound = () => {
    if (plane && !anchor.group.children.includes(plane)) {
      anchor.group.add(plane);
    }
  };
  anchor.onTargetLost = () => {
    if (plane && anchor.group.children.includes(plane)) {
      anchor.group.remove(plane);
    }
  };

  // Animation/render loop
  const run = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(run);
  };

  await mindarThree.start();
  run();
});
