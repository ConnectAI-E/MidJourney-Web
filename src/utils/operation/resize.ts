import { io_hook } from 'kiss-msg'
import type { figmaClient } from 'kiss-core/types'
import { client, env } from 'kiss-core'
import type { IAppConfig } from '../../../types/code'
import { event } from '@/event'
import { updateConfig } from '@/utils/operation/cache'
import { cacheName } from '@/code.state'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { allowFg, allowMg } from '@/utils/operation/selParse'

export class IconResizer {
  nodes: any
  config: IAppConfig

  constructor(nodes: any, config: IAppConfig) {
    this.nodes = nodes
    this.config = config
  }

  get frameAndComponentNodes() {
    return this.nodes.filter((node: any) => {
      return node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'GROUP'
    })
  }

  checkNoSelection() {
    if (this.frameAndComponentNodes.length === 0) {
      io_hook?.emit(event.WARN, '🥱没有找到可变换的图标')
      return true
    }
    return false
  }

  successTip(num = 1) {
    io_hook?.emit(event.NOTIFY, `🎉 已规范 ${num} 份图标的大小`)
  }

  updateCacheConfig() {
    updateConfig(cacheName, this.config).then()
  }

  run() {
    if (this.checkNoSelection())
      return
    const num = this.frameAndComponentNodes.length
    this.frameAndComponentNodes.forEach((node: any) => {
      const aNodeResize = new NodeResizer(node, this.config)
      aNodeResize.run()
    })
    this.updateCacheConfig()
    this.successTip(num)
  }
}

class NodeResizer {
  node: any
  cloneNode: any
  iconSize: number
  boxSize: number

  constructor(node: any, config: IAppConfig) {
    this.node = node
    this.iconSize = config.iconSize
    this.boxSize = config.boxSize
    this.cloneNode = this.clone(node)
  }

  clone(node: any) {
    let newNode
    if (env.inMg)
      newNode = node.clone()
    else
      newNode = this.changeGroupToFrame(node)

    // console.log(node)
    // newNode.x = node.x
    // newNode.y = node.y
    return newNode
  }

  changeGroupToFrame(node: figmaClient.GroupNode) {
    if (node.type !== 'GROUP')
      return node
    // figma group to frame
    const frame = figma.createFrame()
    node.parent?.insertChild(node.parent?.children.indexOf(node), frame as any)
    frame.x = node.x
    frame.y = node.y
    frame.fills = []
    frame.resize(node.width, node.height)
    frame.name = node.name
    node.children.forEach((child: any) => {
      frame.appendChild(child)
    })
    // no need to remove group
    // if all child add to frame, group will auto del
    return frame
  }

  groupChildren() {
    const childrenLength = this.cloneNode.children.length
    if (childrenLength > 1) {
      if (env.inMg)
        client.mg.group(this.cloneNode.children as any)
      else
        client.figma.group(this.cloneNode.children as any, this.cloneNode)
    }
  }

  get firstChild() {
    return this.cloneNode.children[0]
  }

  changeWH() {
    this.changeWH_mg()
    this.changeWH_figma()
  }

  @allowMg
  changeWH_mg() {
    const child = this.firstChild
    const resizeValue = this.iconSize
    if (child.height > child.width) {
      const sizeRatio = child.height / child.width
      child.width = resizeValue / sizeRatio
      child.height = resizeValue
    }
    else {
      const sizeRatio = child.width / child.height
      child.width = resizeValue
      child.height = resizeValue / sizeRatio
    }
  }

  @allowFg
  private changeWH_figma() {
    const child = this.firstChild
    const resizeValue = this.iconSize
    if (child.height > child.width) {
      const sizeRatio = child.height / child.width
      child.resize(resizeValue / sizeRatio, resizeValue)
    }
    else {
      const sizeRatio = child.width / child.height
      child.resize(resizeValue, resizeValue / sizeRatio)
    }
  }

  changeCenter() {
    const child = this.firstChild
    const frameWidth = this.boxSize
    const frameHeight = this.boxSize
    const groupWidth = child.width
    const groupHeight = child.height
    const centerValue = (frameWidth - groupWidth) / 2
    child.relativeTransform = [[1, 0, centerValue], [0, 1, (frameHeight - groupHeight) / 2]]
  }

  jsonClone(val: any) {
    return JSON.parse(JSON.stringify(val))
  }

  traverseConstraint(node: any) {
    if ('children' in node) {
      if (node.type !== 'INSTANCE') {
        for (const child of node.children) {
          if (child.constraints) {
            const constraints = this.jsonClone(child.constraints)
            constraints.vertical = 'SCALE'
            constraints.horizontal = 'SCALE'
            child.constraints = constraints
          }
          this.traverseConstraint(child)
        }
      }
    }
  }

  changeBox() {
    this.changeBox_mg()
    this.changeBox_figma()
  }

  @allowMg
  private changeBox_mg() {
    const node_clone = this.cloneNode
    node_clone.flexMode = 'VERTICAL'
    node_clone.mainAxisAlignItems = 'CENTER'
    node_clone.crossAxisAlignItems = 'CENTER'
    node_clone.mainAxisSizingMode = 'FIXED'
    node_clone.crossAxisSizingMode = 'FIXED'
    node_clone.width = this.boxSize
    node_clone.height = this.boxSize
  }

  @allowFg
  private changeBox_figma() {
    const node_clone = this.cloneNode
    node_clone.layoutMode = 'VERTICAL'
    node_clone.primaryAxisAlignItems = 'CENTER'
    node_clone.primaryAxisSizingMode = 'FIXED'

    node_clone.counterAxisAlignItems = 'CENTER'
    node_clone.counterAxisSizingMode = 'FIXED'

    node_clone.layoutAlign = 'CENTER'
    node_clone.resizeWithoutConstraints(this.boxSize, this.boxSize)
  }

  delNode() {
    if (env.inMg)
      this.node.remove()
  }

  run() {
    this.groupChildren()
    this.changeWH()
    this.changeBox()
    this.traverseConstraint(this.firstChild)
    this.changeCenter()
    this.delNode()
  }
}
