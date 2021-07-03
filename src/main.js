// @ts-nocheck
import * as THREE from "three";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "https://threejs.org/examples/jsm/renderers/CSS3DRenderer.js";
import Side1 from './lib/cube/side1.svelte'
import Side2 from './lib/cube/side2.svelte'
import Side3 from './lib/cube/side3.svelte'
import Side4 from './lib/cube/side4.svelte'
import Side5 from './lib/cube/side5.svelte'
import Side6 from './lib/cube/side6.svelte'

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  60,
  innerWidth / innerHeight,
  0.05,
  1000
);
camera.position.set(7, 7, 7);
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

var labelRenderer = new CSS3DRenderer();
labelRenderer.setSize(innerWidth, innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
document.body.appendChild(labelRenderer.domElement);

var controls = new OrbitControls(camera, labelRenderer.domElement);

var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 30);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

//scene.add(new THREE.GridHelper(10, 10));

var box = new THREE.Mesh(
  new THREE.BoxBufferGeometry(2, 2, 2),
  new THREE.MeshLambertMaterial({ color: 0x000000, wireframe: false })
);
scene.add(box);
var pivot = new THREE.Group();
scene.add(pivot);
pivot.translateX(-2);
pivot.translateY(-2);
pivot.translateZ(-2);

var pos = new THREE.Vector3(-1, 0, 0);
var pos2 = new THREE.Vector3(1, 0, 0);
var pos3 = new THREE.Vector3(0, -1, 0);
var pos4 = new THREE.Vector3(0, 1, 0);
var pos5 = new THREE.Vector3(0, 0, 1);
var pos6 = new THREE.Vector3(0, 0, -1);

var normal = new THREE.Vector3(1, 0, 0);

var cNormal = new THREE.Vector3();
var cPos = new THREE.Vector3();
var m4 = new THREE.Matrix4();

let sides = [];

var div = document.createElement("div");
div.className = "label";
var label = new CSS3DObject(div);
label.position.copy(pos);
label.rotation.y = Math.PI * -0.5;
label.scale.set(0.025, 0.025, 1);
div.id = "face1";
box.add(label);

var div = document.createElement("div");
div.className = "label";
var face2 = new CSS3DObject(div);
face2.position.copy(pos2);
face2.rotation.y = Math.PI * 0.5;
face2.scale.set(0.025, 0.025, 1);
div.id = "face2";
box.add(face2);

var div = document.createElement("div");
div.className = "label";
var face3 = new CSS3DObject(div);
face3.position.copy(pos3);
face3.rotation.x = Math.PI * 0.5;
face3.scale.set(0.025, 0.025, 1);
div.id = "face3";
box.add(face3);

var div = document.createElement("div");
div.className = "label";
var face4 = new CSS3DObject(div);
face4.position.copy(pos4);
face4.rotation.x = Math.PI * -0.5;
face4.scale.set(0.025, 0.025, 1);
div.id = "face4";
box.add(face4);

var div = document.createElement("div");
div.className = "label";
var face5 = new CSS3DObject(div);
face5.position.copy(pos5);
face5.scale.set(0.025, 0.025, 1);
div.id = "face5";
box.add(face5);

var div = document.createElement("div");
div.className = "label";
var face6 = new CSS3DObject(div);
face6.position.copy(pos6);
face6.rotation.y = Math.PI;
face6.scale.set(0.025, 0.025, 1);
div.id = "face6";
box.add(face6);

sides.push(label, face2, face3, face4, face5, face6);

window.addEventListener("resize", onWindowResize, false);

animate();

function animate() {
  requestAnimationFrame(animate);

  sides.forEach((s) => {
    cNormal.copy(s.position).applyMatrix3(box.normalMatrix);
    cPos
      .copy(s.position)
      .applyMatrix4(
        m4.multiplyMatrices(camera.matrixWorldInverse, box.matrixWorld)
      );
    let d = cPos.negate().dot(cNormal);

    s.element.style.visibility = d < 0 ? "hidden" : "visible";
  });

  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  labelRenderer.setSize(window.innerWidth, window.innerHeight);
}

function addContent(component, face) {
  var newDiv = document.createElement("div");
  newDiv.className = "cell"
  const app = new component({
    target: newDiv
  })
  var currentDiv = document.getElementById(face);
  currentDiv.appendChild(newDiv);
}

addContent(Side1, "face1");
addContent(Side2, "face2");
addContent(Side3, "face3");
addContent(Side4, "face4");
addContent(Side5, "face5");
addContent(Side6, "face6");