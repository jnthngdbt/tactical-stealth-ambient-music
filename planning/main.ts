import * as THREE from 'three';

import { App } from './app.ts';
import { Layout } from './layout.ts';
import * as MATERIAL from './material.ts';

// App running the show.
const app = new App({});
app.animate();

// Map layout.
var layout = new Layout(app.scene);
layout.addTerrain({ size: [100, 100] });
layout.addRoom({ position: [0 , 0], size: [16, 20] });
layout.addRoom({ position: [16,  0], size: [16, 20] });
layout.addRoom({ position: [0 , 20], size: [16, 20] });
layout.addRoom({ position: [0 , 20], size: [16, 20], level: 1 });
layout.addRoom({ position: [16 , 20], size: [16, 20], level: 1 });

(app.scene.children[1] as THREE.Mesh).material = MATERIAL.active;
(app.scene.children[2] as THREE.Mesh).material = MATERIAL.active;
(app.scene.children[3] as THREE.Mesh).material = MATERIAL.highlight;
