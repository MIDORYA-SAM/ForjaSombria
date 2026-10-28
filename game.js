
import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// =====================================
// FORJA SOMBRIA - MOTOR DO JOGO
// =====================================

const $ = s => document.querySelector(s);
const canvas = $("#world");

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});

renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x171716);
scene.fog = new THREE.Fog(0x171716, 10, 32);

const camera = new THREE.PerspectiveCamera(
  72, innerWidth / innerHeight, 0.1, 100
);

camera.rotation.order = "YXZ";
camera.position.set(0, 1.7, 4.5);

scene.add(new THREE.HemisphereLight(
  0x8994a4, 0x24170d, 1.25
));

const moon = new THREE.DirectionalLight(0x9ba7c0, 1.3);
moon.position.set(-5, 9, 5);
moon.castShadow = true;
scene.add(moon);

const fire = new THREE.PointLight(0xff5718, 5, 10);
fire.position.set(-3, 1.8, 0);
scene.add(fire);

const world = new THREE.Group();
scene.add(world);

// =====================================
// MATERIAIS E OBJETOS 3D
// =====================================

function material(color, roughness = 0.85, metalness = 0) {
  return new THREE.MeshStandardMaterial({
    color, roughness, metalness
  });
}

const stone = material(0x393633);
const darkStone = material(0x211f1d);
const wood = material(0x49301d);
const woodLight = material(0x69472b);
const iron = material(0x55585a, 0.38, 0.8);
const leather = material(0x30231a);
const ember = new THREE.MeshStandardMaterial({
  color: 0xff6419,
  emissive: 0xff3c05,
  emissiveIntensity: 3
});

function box(parent, x, y, z, sx, sy, sz, mat) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(sx, sy, sz), mat
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(parent, x, y, z, r1, r2, h, mat, sides = 12) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(r1, r2, h, sides), mat
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function sphere(parent, x, y, z, r, mat) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(r, 12, 8), mat
  );

  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

// =====================================
// OFICINA MEDIEVAL
// =====================================

box(world, 0, -0.2, 0, 24, 0.35, 24, darkStone);

for (let x = -10; x <= 10; x += 2) {
  for (let z = -10; z <= 10; z += 2) {
    box(
      world, x, 0.005, z, 1.94, 0.035, 1.94,
      (x + z) % 4 === 0 ? stone : darkStone
    );
  }
}

// Paredes
box(world, 0, 2.7, -7, 18, 5, 0.5, stone);
box(world, -8.7, 2.7, 0, 0.5, 5, 14, stone);
box(world, 8.7, 2.7, 0, 0.5, 5, 14, stone);

// Colunas e vigas
for (let x = -8; x <= 8; x += 4) {
  box(world, x, 2.6, -6.6, 0.55, 5, 0.65, wood);
  box(world, x, 4.95, -6.6, 1.2, 0.3, 0.9, woodLight);
}

for (let z = -5; z <= 5; z += 3) {
  const beam = box(world, 0, 5.1, z, 18, 0.22, 0.28, wood);
  beam.rotation.z = 0.07;
}

// FORNALHA
box(world, -3, 0.5, 0, 2.4, 1, 1.5, stone);
box(world, -3, 1.08, 0, 1.5, 0.18, 1.05, iron);
box(world, -3, 1.45, -0.1, 1.2, 0.65, 0.85, darkStone);

for (let i = 0; i < 6; i++) {
  sphere(
    world,
    -3 + (Math.random() - 0.5) * 0.8,
    1.55 + Math.random() * 0.25,
    (Math.random() - 0.5) * 0.5,
    0.13, ember
  );
}

box(world, -3, 2.05, -0.1, 1.4, 0.14, 1, iron);
cylinder(world, -3, 2.5, -0.1, 0.6, 0.8, 0.8, stone, 8);
box(world, -3, 2.95, -0.1, 0.7, 0.16, 0.7, darkStone);

// BIGORNA
box(world, 0, 0.55, -0.3, 1.35, 1.1, 0.85, wood);
box(world, 0, 1.2, -0.3, 1.7, 0.22, 1.1, iron);
box(world, 0, 1.38, -0.3, 1.2, 0.16, 0.55, iron);
box(world, 0.65, 1.37, -0.3, 0.5, 0.12, 0.32, iron);

// BANCADA
box(world, 3, 0.65, -1, 2.2, 1.3, 1.2, wood);
box(world, 3, 1.34, -1, 2.25, 0.12, 1.25, woodLight);

// TANQUE DE TÊMPERA
cylinder(world, 3, 1.08, -1, 0.5, 0.5, 0.35, iron, 24);

// ESTOQUE
for (const y of [1.3, 2.3, 3.3]) {
  box(world, 6, y, -4, 2, 0.12, 0.55, woodLight);
}

for (let i = 0; i < 5; i++) {
  const blade = box(
    world, 5.25 + i * 0.36, 1.85, -4,
    0.07, 0.85, 0.09, iron
  );

  blade.rotation.z = i % 2 ? -0.12 : 0.12;
  box(world, 5.25 + i * 0.36, 1.35, -4,
      0.18, 0.12, 0.15, leather);
}

// =====================================
// PÁTIO DE TREINAMENTO
// =====================================

box(world, 0, -0.05, -13, 30, 0.2, 18, material(0x252b24));

for (let i = 0; i < 7; i++) {
  cylinder(
    world, -8 + i * 2, 0.9, -12,
    0.14, 0.2, 1.8, wood, 7
  );

  sphere(
    world, -8 + i * 2, 2, -12,
    0.9, material(0x202c24)
  );
}

// Bonecos de treino
for (const z of [-10, -13, -16]) {
  box(world, -2, 0.65, z, 1.6, 1.3, 0.18, wood);
  sphere(world, -2, 0.7, z + 0.12, 0.58, leather);
}

// =====================================
// PERSONAGEM: ALDRIC
// =====================================

const npc = new THREE.Group();
npc.position.set(2, 0, 2);
world.add(npc);

cylinder(npc, 0, 0.8, 0, 0.28, 0.35, 0.9, leather, 10);
sphere(npc, 0, 1.48, 0, 0.25, material(0x9a7655));
cylinder(npc, 0, 1.75, 0, 0.3, 0.32, 0.18, wood, 10);
box(npc, 0, 1.08, -0.2, 0.55, 0.65, 0.25,
    material(0x4a4b4d));

// =====================================
// RECEITAS E PROGRESSÃO
// =====================================

const recipes = {
  Espada: {
    steps: [
      "Separe uma barra de ferro.",
      "Aqueça o metal na fornalha.",
      "Molde a lâmina na bigorna.",
      "Tempere a lâmina no tanque.",
      "Monte o cabo na bancada."
    ],
    need: { iron: 2, wood: 1, coal: 1 },
    desc: "Uma lâmina para defesa e combate."
  },

  Arco: {
    steps: [
      "Separe madeira flexível.",
      "Modele o arco na bancada.",
      "Prepare fibras para a corda.",
      "Monte e ajuste a tensão."
    ],
    need: { wood: 2, fiber: 2 },
    desc: "Arma de longa distância."
  },

  Flechas: {
    steps: [
      "Prepare as hastes de madeira.",
      "Forje pequenas pontas de ferro.",
      "Monte as flechas com fibras."
    ],
    need: { wood: 1, iron: 1, fiber: 1 },
    desc: "Um lote de três flechas."
  },

  Lança: {
    steps: [
      "Aqueça uma barra de ferro.",
      "Forje a ponta na bigorna.",
      "Prepare a haste longa.",
      "Fixe a ponta com reforço."
    ],
    need: { iron: 1, wood: 2, coal: 1, leather: 1 },
    desc: "Arma de alcance médio."
  },

  Escudo: {
    steps: [
      "Separe tábuas de madeira.",
      "Monte o corpo do escudo.",
      "Adicione reforços de ferro.",
      "Prenda a alça de couro."
    ],
    need: { wood: 3, iron: 1, leather: 1 },
    desc: "Proteção para o campo de batalha."
  }
};

const state = {
  gold: 25,
  level: 1,
  iron: 4,
  wood: 5,
  leather: 3,
  coal: 5,
  fiber: 4,
  crafted: {},
  selected: "Espada",
  step: 0,
  quest: 0,
  hammer: 0
};

function updateUI() {
  $("#gold").textContent = state.gold;
  $("#level").textContent = state.level;

  const quests = [
    "Fale com Aldric, o viajante.",
    "Fabrique uma arma para Aldric.",
    "Teste sua arma no campo de treinamento.",
    "Missão concluída! A estrada velha aguarda."
  ];

  $("#questText").textContent =
    quests[Math.min(state.quest, 3)];
}

let toastTimer;

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(
    () => el.classList.remove("show"), 2400
  );
}

function openPanel(tag, title, desc, html) {
  $("#panelTag").textContent = tag;
  $("#panelTitle").textContent = title;
  $("#panelDesc").textContent = desc;
  $("#panelContent").innerHTML = html;
  $("#panel").classList.remove("hidden");
}

function closePanel() {
  $("#panel").classList.add("hidden");
}

$("#closePanel").addEventListener("click", closePanel);

function btn(label, action, primary = false, disabled = false) {
  return `<button class="gamebtn ${primary ? "primary" : ""}"
    data-action="${action}" ${disabled ? "disabled" : ""}>
    ${label}
  </button>`;
}

function stockHTML() {
  const names = {
    iron: "Ferro",
    wood: "Madeira",
    coal: "Carvão",
    leather: "Couro",
    fiber: "Fibras"
  };

  return Object.entries(names).map(([key, name]) =>
    `<div class="material"><span>${name}</span>
    <b>${state[key]}</b></div>`
  ).join("");
}

function showStock() {
  openPanel(
    "INVENTÁRIO",
    "Estoque de materiais",
    "Gerencie os recursos da sua oficina.",
    stockHTML() +
    `<div class="btnrow">
      ${btn("Comprar pacote (5 ouro)", "buy", true)}
      ${btn("Fechar", "close")}
    </div>`
  );
}

function canAfford(recipe) {
  return Object.entries(recipe.need).every(
    ([key, amount]) => state[key] >= amount
  );
}

function showRecipe() {
  const recipe = recipes[state.selected];
  const complete = !!state.crafted[state.selected];

  const names = {
    iron: "ferro",
    wood: "madeira",
    coal: "carvão",
    leather: "couro",
    fiber: "fibras"
  };

  const needs = Object.entries(recipe.need)
    .map(([key, amount]) => `${amount} ${names[key]}`)
    .join(" · ");

  const choices = Object.keys(recipes).map(name =>
    btn(name, "select:" + name, name === state.selected)
  ).join("");

  openPanel(
    "PROJETO DE ARMA",
    state.selected,
    recipe.desc,
    `<div class="choice">${choices}</div>
    <p><b>Materiais:</b> ${needs}</p>
    <p><b>Etapa:</b> ${complete
      ? "Concluída"
      : `${state.step + 1} / ${recipe.steps.length}`}</p>
    <p>${complete
      ? "Arma pronta! Vá ao campo de treino."
      : recipe.steps[state.step]}</p>
    <div class="meter"><span style="width:${
      complete ? 100 : state.step / recipe.steps.length * 100
    }%"></span></div>
    <div class="btnrow">
      ${btn(complete ? "Fabricar outra" : "Executar etapa",
            "craft", true)}
      ${btn("Ver estoque", "stock")}
      ${btn("Fechar", "close")}
    </div>`
  );
}

function showForge() {
  openPanel(
    "OFICINA",
    "Mesa de projetos",
    "Escolha o equipamento que deseja fabricar.",
    `<div class="choice">${
      Object.keys(recipes).map(name =>
        btn(name, "select:" + name, name === state.selected)
      ).join("")
    }</div>
    <div class="btnrow">
      ${btn("Abrir projeto", "recipe", true)}
      ${btn("Consultar materiais", "stock")}
    </div>`
  );
}

function craft() {
  const recipe = recipes[state.selected];

  if (state.crafted[state.selected]) {
    if (!canAfford(recipe)) {
      toast("Faltam materiais para fabricar outra peça.");
      return;
    }

    state.crafted[state.selected] = false;
    state.step = 0;
  }

  if (state.step === 0) {
    if (!canAfford(recipe)) {
      toast("Materiais insuficientes. Visite o estoque.");
      return;
    }

    Object.entries(recipe.need).forEach(([key, amount]) => {
      state[key] -= amount;
    });
  }

  if (state.selected === "Espada" && state.step === 1) {
    fire.intensity = 7;
    toast("O metal está incandescente!");
  }

  if (
    (state.selected === "Espada" && state.step === 2) ||
    (state.selected === "Lança" && state.step === 1)
  ) {
    state.hammer++;
    toast("Golpe aplicado na bigorna!");
  }

  state.step++;

  if (state.step >= recipe.steps.length) {
    state.crafted[state.selected] = true;
    state.step = 0;
    state.level++;
    toast(state.selected + " fabricado com sucesso!");

    if (state.quest === 1) {
      toast("Arma pronta! Agora teste-a no pátio.");
    }
  }

  updateUI();
  showRecipe();
}

// =====================================
// CLIENTE E MISSÃO
// =====================================

function showNPC() {
  if (state.quest === 0) {
    openPanel(
      "CLIENTE • MISSÃO 01",
      "Aldric, o viajante",
      "A estrada velha está cheia de perigos.",
      `<p>“Preciso de uma arma confiável para minha viagem.”</p>
      <p><b>Objetivo:</b> fabrique uma arma e teste-a no pátio.</p>
      <p><b>Recompensa:</b> 20 moedas e experiência.</p>
      ${btn("Aceitar missão", "accept", true)}`
    );
  } else if (state.quest < 3) {
    openPanel(
      "CLIENTE",
      "Pedido de Aldric",
      "Prepare seu equipamento e teste-o no campo.",
      `<p>${Object.values(state.crafted).some(Boolean)
        ? "Você já fabricou uma arma."
        : "Você ainda precisa fabricar uma arma."}</p>
      <div class="btnrow">
        ${btn("Abrir projetos", "recipe", true)}
        ${btn("Fechar", "close")}
      </div>`
    );
  } else {
    openPanel(
      "CLIENTE",
      "Aldric, o viajante",
      "“Bom trabalho, ferreiro. Nos veremos na estrada.”",
      btn("Fechar", "close")
    );
  }
}

function showRange() {
  const available = Object.keys(state.crafted)
    .filter(name => state.crafted[name]);

  openPanel(
    "CAMPO DE TREINO",
    "Prova de aço",
    "Teste seu equipamento nos alvos.",
    `<p>Armas prontas: ${
      available.length ? available.join(", ") : "nenhuma"
    }</p>
    <div class="btnrow">
      ${btn("Testar espada", "test:Espada", false,
        !state.crafted.Espada)}
      ${btn("Testar arco", "test:Arco", false,
        !state.crafted.Arco || !state.crafted.Flechas)}
      ${btn("Testar flechas", "test:Flechas", false,
        !state.crafted.Flechas)}
      ${btn("Testar lança", "test:Lança", false,
        !state.crafted.Lança)}
      ${btn("Testar escudo", "test:Escudo", false,
        !state.crafted.Escudo)}
    </div>`
  );
}

// =====================================
// INTERAÇÃO COM ESTAÇÕES
// =====================================

const stations = [
  {
    name: "Fornalha",
    pos: new THREE.Vector3(-3, 1.4, 0),
    type: "forge"
  },
  {
    name: "Bigorna",
    pos: new THREE.Vector3(0, 1.5, -0.3),
    type: "anvil"
  },
  {
    name: "Tanque de têmpera",
    pos: new THREE.Vector3(3, 1.4, -1),
    type: "quench"
  },
  {
    name: "Bancada de montagem",
    pos: new THREE.Vector3(3, 1.4, -1),
    type: "bench"
  },
  {
    name: "Estoque de materiais",
    pos: new THREE.Vector3(6, 1.7, -4),
    type: "stock"
  },
  {
    name: "Aldric, o viajante",
    pos: new THREE.Vector3(2, 1.2, 2),
    type: "npc"
  },
  {
    name: "Campo de treinamento",
    pos: new THREE.Vector3(0, 1.5, -6),
    type: "range"
  }
];

function interact(type) {
  if (type === "forge" || type === "bench") {
    showForge();
  } else if (type === "anvil") {
    state.selected = "Espada";
    showRecipe();
  } else if (type === "quench") {
    toast("Aproxime-se do projeto para continuar a fabricação.");
    showRecipe();
  } else if (type === "stock") {
    showStock();
  } else if (type === "npc") {
    showNPC();
  } else if (type === "range") {
    showRange();
  }
}

function nearestStation() {
  let nearest = null;
  let minDistance = Infinity;

  for (const station of stations) {
    const distance = camera.position.distanceTo(station.pos);

    if (distance < minDistance) {
      minDistance = distance;
      nearest = station;
    }
  }

  return minDistance < 3.2 ? nearest : null;
}

function useNearest() {
  const station = nearestStation();

  if (station) {
    interact(station.type);
  } else {
    toast("Aproxime-se de uma estação ou personagem.");
  }
}

$("#actionBtn").addEventListener("click", useNearest);

$("#panelContent").addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if (!button || button.disabled) return;

  const action = button.dataset.action;

  if (action === "close") {
    closePanel();
  }

  if (action === "stock") {
    showStock();
  }

  if (action === "recipe") {
    showRecipe();
  }

  if (action === "buy") {
    if (state.gold < 5) {
      toast("Ouro insuficiente.");
      return;
    }

    state.gold -= 5;
    state.iron += 2;
    state.wood += 2;
    state.coal += 2;
    state.leather += 1;
    state.fiber += 2;

    updateUI();
    showStock();
    toast("Materiais comprados!");
  }

  if (action === "accept") {
    state.quest = 1;
    updateUI();
    showNPC();
    toast("Missão aceita!");
  }

  if (action === "craft") {
    craft();
  }

  if (action.startsWith("select:")) {
    state.selected = action.split(":")[1];
    state.step = 0;
    showRecipe();
  }

  if (action.startsWith("test:")) {
    const weapon = action.split(":")[1];

    if (state.quest === 1) {
      state.quest = 3;
      state.gold += 20;
      state.level++;
      updateUI();
      toast("Missão concluída! +20 ouro.");
    } else {
      toast("Teste concluído: " + weapon + ".");
    }

    closePanel();
  }
});

// =====================================
// CONTROLES PARA IPHONE
// =====================================

let yaw = 0;
let pitch = 0;
let moveX = 0;
let moveY = 0;

const stick = $("#stick");
const knob = $("#knob");

let stickId = null;
let stickCenter = null;
let lookId = null;
let lastX = 0;
let lastY = 0;

stick.addEventListener("pointerdown", event => {
  stickId = event.pointerId;
  stick.setPointerCapture(event.pointerId);

  const rect = stick.getBoundingClientRect();

  stickCenter = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };

  moveStick(event);
});

stick.addEventListener("pointermove", event => {
  if (event.pointerId === stickId) moveStick(event);
});

function moveStick(event) {
  let dx = event.clientX - stickCenter.x;
  let dy = event.clientY - stickCenter.y;
  const length = Math.hypot(dx, dy);
  const max = 34;

  if (length > max) {
    dx = dx / length * max;
    dy = dy / length * max;
  }

  knob.style.left = (34 + dx) + "px";
  knob.style.top = (34 + dy) + "px";

  moveX = dx / max;
  moveY = dy / max;
}

function resetStick() {
  stickId = null;
  moveX = 0;
  moveY = 0;
  knob.style.left = "34px";
  knob.style.top = "34px";
}

stick.addEventListener("pointerup", resetStick);
stick.addEventListener("pointercancel", resetStick);

canvas.addEventListener("pointerdown", event => {
  if (event.clientX < innerWidth * 0.35) return;

  lookId = event.pointerId;
  lastX = event.clientX;
  lastY = event.clientY;

  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", event => {
  if (event.pointerId !== lookId) return;

  const dx = event.clientX - lastX;
  const dy = event.clientY - lastY;

  lastX = event.clientX;
  lastY = event.clientY;

  yaw -= dx * 0.004;
  pitch -= dy * 0.003;

  pitch = Math.max(-1.1, Math.min(1.1, pitch));

  camera.rotation.set(pitch, yaw, 0, "YXZ");
});

function endLook(event) {
  if (event.pointerId === lookId) lookId = null;
}

canvas.addEventListener("pointerup", endLook);
canvas.addEventListener("pointercancel", endLook);

$("#lookBtn").addEventListener("click", () => {
  yaw += Math.PI / 4;
  camera.rotation.set(pitch, yaw, 0, "YXZ");
});

// Teclado opcional para computador
const keys = {};

window.addEventListener("keydown", event => {
  keys[event.key.toLowerCase()] = true;

  if (event.key.toLowerCase() === "e") useNearest();
  if (event.key === "Escape") closePanel();
});

window.addEventListener("keyup", event => {
  keys[event.key.toLowerCase()] = false;
});

// =====================================
// MOVIMENTO E LOOP 3D
// =====================================

const clock = new THREE.Clock();

function animate(time) {
  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), 0.05);

  fire.intensity = 4.5 + Math.sin(time * 0.008) * 0.6;

  const forward = new THREE.Vector3(
    -Math.sin(yaw), 0, -Math.cos(yaw)
  );

  const right = new THREE.Vector3(
    Math.cos(yaw), 0, -Math.sin(yaw)
  );

  const keyboardX =
    Number(!!keys.d) - Number(!!keys.a);

  const keyboardY =
    Number(!!keys.s) - Number(!!keys.w);

  const x = moveX + keyboardX;
  const y = moveY + keyboardY;

  const velocity = forward.multiplyScalar(-y)
    .add(right.multiplyScalar(x));

  if (velocity.length() > 1) velocity.normalize();

  camera.position.addScaledVector(
    velocity, 3.3 * dt
  );

  camera.position.x = THREE.MathUtils.clamp(
    camera.position.x, -8, 8
  );

  camera.position.z = THREE.MathUtils.clamp(
    camera.position.z, -16, 6
  );

  camera.position.y = 1.7;

  const station = nearestStation();

  $("#hint").textContent = station
    ? "Toque INTERAGIR: " + station.name
    : "Explore a oficina e aproxime-se das estações.";

  $("#actionBtn").textContent =
    station ? "INTERAGIR" : "USAR";

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
});

updateUI();
animate(0);
