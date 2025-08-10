document.getElementById('start-ar').addEventListener('click', async () => {
  document.getElementById('start-ar').style.display = 'none';

  // Initialize MindAR only after user gesture
  const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: document.getElementById('ar-container'),
    imageTargetSrc: './targets.mind'
  });

  const {renderer, scene, camera} = mindarThree;

  // Simple AR overlay (an orange box)
  const anchor = mindarThree.addAnchor(0);
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({color: 0xff9900, transparent:true, opacity:0.8});
  const plane = new THREE.Mesh(geometry, material);
  anchor.group.add(plane);

  await mindarThree.start(); // <-- This line triggers the camera permission prompt!
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
});
