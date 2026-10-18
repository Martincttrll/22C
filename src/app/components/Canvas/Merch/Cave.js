import * as THREE from "three";

const createRandom = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const ROOM = {
  floor: -4,
  ceiling: 6,
  wall: 7,
  front: 6,
  back: -28,
};

export const PIPE_REST = new THREE.Vector3(0, -1.2, -4);

export class Cave {
  constructor({ seed = 22, quality = "high" } = {}) {
    this.random = createRandom(seed);
    this.density = quality === "high" ? 1 : 0.6;
    this.group = new THREE.Group();

    this.blocks = [];
    this.cylinders = [];

    this.materials = {
      concrete: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.95,
      }),
      metal: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.55,
        metalness: 0.35,
      }),
      cable: new THREE.MeshStandardMaterial({
        color: 0x0b0b0b,
        roughness: 0.8,
      }),
    };

    this.createShell();
    this.createWalls();
    this.createCeilingBeams();
    this.createHeaps();
    this.createWallPipes();
    this.createColumns();
    this.createCurvedPipes();
    this.createCentralPipe();
    this.createCables();

    this.createInstances();
  }

  range(min, max) {
    return min + this.random() * (max - min);
  }

  pick(list) {
    return list[Math.floor(this.random() * list.length)];
  }

  shade(min = 0.05, max = 0.12) {
    return new THREE.Color().setScalar(this.range(min, max));
  }

  addBlock(
    position,
    scale,
    rotation = new THREE.Euler(),
    color = this.shade(),
  ) {
    this.blocks.push({ position, scale, rotation, color });
  }

  addCylinder(start, end, radius, color = this.shade(0.08, 0.16)) {
    this.cylinders.push({ start, end, radius, color });
  }

  addTube(
    curve,
    radius,
    material = this.materials.metal,
    color = this.shade(0.08, 0.16),
  ) {
    const geometry = new THREE.TubeGeometry(curve, 64, radius, 12, false);
    const mesh = new THREE.Mesh(geometry, material.clone());
    mesh.material.color = color;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.group.add(mesh);
    return mesh;
  }

  createShell() {
    const { floor, ceiling, wall, front, back } = ROOM;
    const depth = front - back;
    const centerZ = (front + back) / 2;

    this.addBlock(
      new THREE.Vector3(0, floor - 0.5, centerZ),
      new THREE.Vector3(wall * 2 + 6, 1, depth),
      undefined,
      this.shade(0.04, 0.05),
    );
    this.addBlock(
      new THREE.Vector3(0, ceiling + 0.5, centerZ),
      new THREE.Vector3(wall * 2 + 6, 1, depth),
      undefined,
      this.shade(0.03, 0.04),
    );
  }

  createWalls() {
    const { floor, ceiling, wall, front, back } = ROOM;

    [-1, 1].forEach((side) => {
      for (let z = front; z > back; z -= this.range(1.2, 3)) {
        for (let y = floor; y < ceiling; ) {
          const height = this.range(0.6, 3);
          const depth = this.range(1, 3);
          const protrusion =
            this.random() < 0.15 ? this.range(1, 2.5) : this.range(0, 0.8);
          const width = this.range(1, 2.5) + protrusion;

          this.addBlock(
            new THREE.Vector3(
              side * (wall + 1 - protrusion / 2),
              y + height / 2,
              z - depth / 2,
            ),
            new THREE.Vector3(width, height, depth),
            new THREE.Euler(
              0,
              this.range(-0.05, 0.05),
              this.range(-0.03, 0.03),
            ),
          );

          y += height * this.range(0.85, 1);
        }
      }
    });

    for (let x = -ROOM.wall; x < ROOM.wall; x += this.range(1.5, 3)) {
      const height = this.range(4, ceiling - floor);
      this.addBlock(
        new THREE.Vector3(x, floor + height / 2, back - this.range(0, 4)),
        new THREE.Vector3(this.range(1.5, 3), height, this.range(1, 3)),
      );
    }
  }

  createCeilingBeams() {
    const { ceiling, wall, front, back } = ROOM;

    for (let z = front; z > back; z -= this.range(2.5, 5)) {
      const drop = this.range(0.4, 1.4);
      this.addBlock(
        new THREE.Vector3(this.range(-1, 1), ceiling - drop / 2, z),
        new THREE.Vector3(wall * 2 + 2, drop, this.range(0.5, 1.2)),
        new THREE.Euler(0, this.range(-0.15, 0.15), 0),
      );
    }

    for (let i = 0; i < 25 * this.density; i++) {
      const size = this.range(0.5, 2);
      this.addBlock(
        new THREE.Vector3(
          this.range(-wall, wall),
          ceiling - size / 2,
          this.range(back, front),
        ),
        new THREE.Vector3(
          size * this.range(1, 3),
          size,
          size * this.range(1, 2),
        ),
      );
    }
  }

  createHeaps() {
    const { floor, wall, back } = ROOM;
    const heaps = [
      { x: -wall + 1.5, z: -2, radius: 3, height: 2.5 },
      { x: wall - 1.5, z: -7, radius: 3.5, height: 3 },
      { x: -wall + 2, z: -13, radius: 4, height: 3.5 },
      { x: 3, z: -17, radius: 3, height: 2 },
      { x: -3, z: -22, radius: 4, height: 3 },
      { x: wall - 2, z: back + 6, radius: 4, height: 4 },
    ];

    heaps.forEach(({ x, z, radius, height }) => {
      const count = Math.round(40 * this.density);

      for (let i = 0; i < count; i++) {
        const angle = this.range(0, Math.PI * 2);
        const distance = Math.sqrt(this.random()) * radius;
        const falloff = 1 - distance / radius;
        const size = this.range(0.2, 0.9) * (0.5 + falloff);

        this.addBlock(
          new THREE.Vector3(
            x + Math.cos(angle) * distance,
            floor + size / 2 + falloff * height * this.range(0.5, 1),
            z + Math.sin(angle) * distance,
          ),
          new THREE.Vector3(
            size * this.range(0.8, 2),
            size,
            size * this.range(0.8, 1.6),
          ),
          new THREE.Euler(
            this.range(-0.6, 0.6),
            this.range(0, Math.PI),
            this.range(-0.6, 0.6),
          ),
        );
      }
    });
  }

  createWallPipes() {
    const { floor, ceiling, wall, front, back } = ROOM;

    [-1, 1].forEach((side) => {
      const bundles = 2 + Math.floor(this.random() * 2);

      for (let b = 0; b < bundles; b++) {
        const y = this.range(floor + 1, ceiling - 1);
        const x = side * (wall - this.range(0.8, 1.6));
        const pipes = 2 + Math.floor(this.random() * 4);

        for (let p = 0; p < pipes; p++) {
          const radius = this.range(0.08, 0.3);
          const offset = p * (radius * 2 + 0.08);
          const start = new THREE.Vector3(
            x - side * offset * 0.3,
            y + offset,
            front,
          );
          const end = new THREE.Vector3(
            x - side * offset * 0.3,
            y + offset,
            back,
          );

          this.addCylinder(start, end, radius);
          this.addFlanges(start, end, radius);
        }
      }
    });
  }

  createColumns() {
    const { floor, ceiling, wall, front, back } = ROOM;

    for (let i = 0; i < 14 * this.density; i++) {
      const side = this.random() < 0.5 ? -1 : 1;
      const x = side * this.range(wall - 3.5, wall - 0.5);
      const z = this.range(back + 2, front - 2);
      const radius = this.pick([0.15, 0.25, 0.4, 0.7]);
      const lean = this.range(-0.6, 0.6);

      const start = new THREE.Vector3(x, floor, z);
      const end = new THREE.Vector3(
        x + lean,
        ceiling,
        z + this.range(-0.5, 0.5),
      );
      this.addCylinder(start, end, radius);
      this.addFlanges(start, end, radius);
    }
  }

  createCurvedPipes() {
    const { floor, ceiling, wall, back } = ROOM;

    for (let i = 0; i < 9 * this.density; i++) {
      const side = this.random() < 0.5 ? -1 : 1;
      const z = this.range(back + 3, 2);
      const fromWall = new THREE.Vector3(
        side * wall,
        this.range(floor + 1, ceiling - 2),
        z,
      );
      const toCeiling = new THREE.Vector3(
        -side * this.range(0, wall),
        ceiling,
        z + this.range(-6, 6),
      );
      const sag = new THREE.Vector3(
        (fromWall.x + toCeiling.x) / 2,
        this.range(1, ceiling - 1),
        (fromWall.z + toCeiling.z) / 2 + this.range(-3, 3),
      );

      const curve = new THREE.CatmullRomCurve3([
        fromWall,
        fromWall.clone().add(new THREE.Vector3(-side * 1.2, 0, 0)),
        sag,
        toCeiling.clone().add(new THREE.Vector3(0, -1.2, 0)),
        toCeiling,
      ]);

      this.addTube(curve, this.range(0.1, 0.35));
    }
  }

  createCentralPipe() {
    const { floor, wall } = ROOM;
    const radius = 0.35;
    const { y, z } = PIPE_REST;
    const bendX = 4;

    const path = new THREE.CurvePath();
    path.add(
      new THREE.LineCurve3(
        new THREE.Vector3(-wall - 1, y, z),
        new THREE.Vector3(bendX, y, z),
      ),
    );
    path.add(
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(bendX, y, z),
        new THREE.Vector3(bendX + 1.2, y, z),
        new THREE.Vector3(bendX + 1.2, y - 1.2, z),
      ),
    );
    path.add(
      new THREE.LineCurve3(
        new THREE.Vector3(bendX + 1.2, y - 1.2, z),
        new THREE.Vector3(bendX + 1.2, floor, z),
      ),
    );

    this.centralPipe = this.addTube(
      path,
      radius,
      this.materials.metal,
      this.shade(0.14, 0.16),
    );

    [-6, -3, 2].forEach((x) =>
      this.addCylinder(
        new THREE.Vector3(x - 0.08, y, z),
        new THREE.Vector3(x + 0.08, y, z),
        radius * 1.35,
      ),
    );

    this.addBlock(
      new THREE.Vector3(-3, (floor + y) / 2 - 0.2, z),
      new THREE.Vector3(0.3, y - floor - 0.4, 0.3),
    );
  }

  createCables() {
    const { ceiling, wall, front, back } = ROOM;

    for (let i = 0; i < 18 * this.density; i++) {
      const z = this.range(back, front - 2);
      const start = new THREE.Vector3(
        this.range(-wall, wall),
        ceiling - 0.2,
        z,
      );
      const end = new THREE.Vector3(
        start.x + this.range(-4, 4),
        ceiling - 0.2,
        z + this.range(-3, 3),
      );
      const middle = start.clone().lerp(end, 0.5);
      middle.y -= this.range(0.8, 3.5);

      this.addTube(
        new THREE.QuadraticBezierCurve3(start, middle, end),
        this.range(0.015, 0.05),
        this.materials.cable,
        this.shade(0.03, 0.06),
      );
    }
  }

  addFlanges(start, end, radius) {
    const direction = end.clone().sub(start);
    const length = direction.length();
    direction.normalize();

    for (let d = this.range(1, 3); d < length; d += this.range(2.5, 6)) {
      const center = start.clone().addScaledVector(direction, d);
      this.addCylinder(
        center.clone().addScaledVector(direction, -0.06),
        center.clone().addScaledVector(direction, 0.06),
        radius * 1.3,
      );
    }
  }

  createInstances() {
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);

    const blocks = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      this.materials.concrete,
      this.blocks.length,
    );

    this.blocks.forEach(({ position, scale, rotation, color }, i) => {
      quaternion.setFromEuler(rotation);
      matrix.compose(position, quaternion, scale);
      blocks.setMatrixAt(i, matrix);
      blocks.setColorAt(i, color);
    });

    const cylinders = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(1, 1, 1, 16),
      this.materials.metal,
      this.cylinders.length,
    );

    this.cylinders.forEach(({ start, end, radius, color }, i) => {
      const direction = end.clone().sub(start);
      const length = direction.length();
      quaternion.setFromUnitVectors(up, direction.normalize());
      matrix.compose(
        start.clone().lerp(end, 0.5),
        quaternion,
        new THREE.Vector3(radius, length, radius),
      );
      cylinders.setMatrixAt(i, matrix);
      cylinders.setColorAt(i, color);
    });

    [blocks, cylinders].forEach((mesh) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.group.add(mesh);
    });
  }

  dispose() {
    this.group.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    });
  }
}
