import * as THREE from 'three'

class UniformGrid {
  constructor (origin: THREE.Vector3, dimension: THREE.Vector3, gridSize: number, scene?: THREE.Scene) {
    this.origin = origin
    this.dimension = dimension
    this.gridSize = gridSize

    this.grid = []
    this.lookUp = {}
    this.scene = scene

    this.cellMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: 'green' })
    this.boxGeometry = new THREE.BoxGeometry(this.gridSize, this.gridSize, this.gridSize)
  }

  calculateOffsetPosition (position: THREE.Vector3) {
    const AAA = this.origin.clone().sub(this.dimension.clone().multiplyScalar(0.5))
    return position.clone().sub(AAA)
  }

  validateOffsetPosition (offsetPosition: THREE.Vector3): boolean {
    if (
      offsetPosition.x < 0 || offsetPosition.y < 0 || offsetPosition.z < 0 ||
      offsetPosition.x > this.dimension.x || offsetPosition.y > this.dimension.y || offsetPosition.z > this.dimension.z
    ) {
      return false
    }
    return true
  }

  register (entity: { id: string, position: THREE.Vector3 }) {
    const offsetPosition = this.calculateOffsetPosition(entity.position)
    if (!this.validateOffsetPosition(offsetPosition)) {
      return
    }
    const i = Math.floor(offsetPosition.x / this.gridSize)
    const j = Math.floor(offsetPosition.y / this.gridSize)
    const k = Math.floor(offsetPosition.z / this.gridSize)

    if (!this.grid[i]) this.grid[i] = []
    if (!this.grid[i][j]) this.grid[i][j] = []
    if (!this.grid[i][j][k]) this.grid[i][j][k] = { }

    if (this.lookUp[entity.id] &&
      this.lookUp[entity.id].i === i &&
      this.lookUp[entity.id].j === j &&
      this.lookUp[entity.id].k === k) {
      return
    }

    if (this.lookUp[entity.id]) this.unregister(entity)
    this.lookUp[entity.id] = { i, j, k }

    if (Object.keys(this.grid[i][j][k]).length <= 0) this.addCellMesh(i, j, k)
    this.grid[i][j][k][entity.id] = entity
  }

  unregister (entity: { id: string }) {
    const { i, j, k } = this.lookUp[entity.id]
    const cell = this.grid[i][j][k]
    delete cell[entity.id]
    if (Object.keys(this.grid[i][j][k]).length <= 0) this.removeCellMesh(i, j, k)
  }

  addCellMesh (i, j, k) {
    if (!this.scene) return
    const geometry = this.boxGeometry.clone()
    geometry.translate(i * this.gridSize, j * this.gridSize, k * this.gridSize)
    geometry.translate(
      -(this.origin.x + this.dimension.x / 2),
      -(this.origin.y + this.dimension.y / 2),
      -(this.origin.x + this.dimension.x / 2)
    )

    const mesh = new THREE.Mesh(geometry, this.cellMaterial)
    mesh.name = `grid-${i}${j}${k}`

    this.scene.add(mesh)
  }

  removeCellMesh (i, j, k) {
    if (!this.scene) return
    const cell = this.scene.getObjectByName(`grid-${i}${j}${k}`)

    this.scene.remove(cell)
  }
}

export default UniformGrid
