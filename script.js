// Ambil canvas dan buat renderer
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Buat scene & kamera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x889063); // retro green background

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, -30, 30);
camera.lookAt(0, 0, 0);

// Tambahkan cahaya
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 20);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Ambil slider dan nilai awal
const aSlider = document.getElementById('aSlider');
const bSlider = document.getElementById('bSlider');

// Buat penampil nilai slider
const aValueText = document.createElement('span');
const bValueText = document.createElement('span');
aSlider.parentNode.appendChild(aValueText);
bSlider.parentNode.appendChild(bValueText);

// Parameter permukaan
let a = parseFloat(aSlider.value);
let b = parseFloat(bSlider.value);

// Ukuran grid
const size = 50;
const step = 1;
const halfSize = size / 2;

// Material retro wireframe
const material = new THREE.MeshStandardMaterial({
  color: 0x33ff33,
  wireframe: true,
});

// Fungsi membuat geometri dari z = ax² + by²
function generateSurface(a, b) {
  const vertices = [];

  for (let x = -halfSize; x <= halfSize; x += step) {
    for (let y = -halfSize; y <= halfSize; y += step) {
      const z = a * x * x + b * y * y;
      vertices.push(x, y, z);
    }
  }

  const positions = new Float32Array(vertices);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const segments = size + 1;
  const indices = [];

  for (let i = 0; i < segments - 1; i++) {
    for (let j = 0; j < segments - 1; j++) {
      const a = i * segments + j;
      const b = a + 1;
      const c = a + segments;
      const d = c + 1;

      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }

  geometry.setIndex(indices);
  geometry.computeVertexNormals(); // opsional
  return geometry;
}

// Buat mesh awal
let geometry = generateSurface(a, b);
let mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Fungsi update mesh saat slider berubah
function updateSurface() {
  a = parseFloat(aSlider.value);
  b = parseFloat(bSlider.value);

  aValueText.textContent = ` ${a.toFixed(2)}`;
  bValueText.textContent = ` ${b.toFixed(2)}`;

  const newGeometry = generateSurface(a, b);
  mesh.geometry.dispose();              // buang geometri lama
  mesh.geometry = newGeometry;         // ganti dengan yang baru
}

// Jalankan update awal
updateSurface();

// Tambahkan event listener ke slider
aSlider.addEventListener('input', updateSurface);
bSlider.addEventListener('input', updateSurface);

// Animasi rotasi permukaan
function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.z += 0.002;
  mesh.rotation.x += 0.002;
  renderer.render(scene, camera);
}
animate();

// Responsif saat window di-resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
