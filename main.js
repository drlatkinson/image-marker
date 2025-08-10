window.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  const arCanvasContainer = document.getElementById('ar-canvas');

  // Create and append Start AR button
  const startBtn = document.createElement('button');
  startBtn.textContent = "Start AR";
  startBtn.className = "ar-start-btn";
  intro.appendChild(startBtn);

  let mindarThree, renderer, scene, camera, anchor, plane;

  startBtn.addEventListener('click', async () => {
    intro.style.display = 'none';
    arCanvasContainer.style.display = 'block';

    mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: arCanvasContainer,
      imageTargetSrc: './targets.mind',
    });
    renderer = mindarThree.renderer;
    scene = mindarThree.scene;
    camera = mindarThree.camera;

    anchor = mindarThree.addAnchor(0);

    // Load the overlay image as a texture
    const loader = new window.THREE.TextureLoader();
    loader.load('assets/sun0060.png', (texture) => {
      const aspect = texture.image.width / texture.image.height;
      const geometry = new window.THREE.PlaneGeometry(aspect, 1);
      const material = new window.THREE.MeshBasicMaterial({ map: texture, transparent: true });
      plane = new window.THREE.Mesh(geometry, material);
      plane.position.set(0, 0, 0);

      // Show overlay when marker found, hide when lost
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
    });

    // Start AR
    await mindarThree.start();
    // Animation/render loop
    const run = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(run);
    };
    run();
  });
});
