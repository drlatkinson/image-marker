import "https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js";
import "https://cdn.jsdelivr.net/npm/mind-ar@1.2.7/dist/mindar-image-three.prod.js";

document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  const arCanvasContainer = document.getElementById('ar-canvas');

  // Create and append Start AR button
  const startBtn = document.createElement('button');
  startBtn.textContent = "Start AR";
  startBtn.className = "ar-start-btn";
  intro.appendChild(startBtn);

  // AR setup
  let mindarThree, renderer, scene, camera, anchor, plane;

  startBtn.addEventListener('click', async () => {
    intro.style.display = 'none';
    arCanvasContainer.style.display = 'block';

    mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: arCanvasContainer,
      imageTargetSrc: './targets.mind',
    });
    ({ renderer, scene, camera } = mindarThree);

    anchor = mindarThree.addAnchor(0);

    const loader = new THREE.TextureLoader();
    loader.load('assets/sun0060.png', (texture) => {
      const aspect = texture.image.width / texture.image.height;
      const geometry = new THREE.PlaneGeometry(aspect, 1);
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
      plane = new THREE.Mesh(geometry, material);
      plane.position.set(0, 0, 0);
    });

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

    const run = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(run);
    };

    await mindarThree.start();
    run();
  });
});
