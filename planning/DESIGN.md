```js
const map = Map() // starts with insertion square
  .addPathway(eFront, 20)
  .addRoom(eRight, eWindow, pos: 0, size: [0.3, 0.8], depthRatio: 3.0)
  .addRoom(eFront, eDoor, pos: 0.5, size: [0.5, 0.5], depthRatio: 1.0)
  .addHallway(eFront, eDoor, pos: 0.5, length: 20)
  .addRoom(eLeft, eDoor, pos: 0.1, size: [0.1, 0.4], depthRatio: 0.8)
  .back() // return to previous (hallway)
  .addRoom(eLeft, eDoor, pos: 0.6, size: [0.1, 0.4], depthRatio: 0.8)
  .back() // return to previous (hallway)
  .addStaircase(eFront, eDoor, eUp) // zigzag staircase
  .addHallway(eFront, eDoor, pos: 0.5, length: 20) // second floor
```