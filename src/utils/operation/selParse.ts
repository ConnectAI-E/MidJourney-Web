import { client, env } from 'kiss-core'

export function allowMg(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    if (env.inMg)
      originalMethod.apply(this, args)
  }
}

export function allowFg(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value
  descriptor.value = function (...args: any[]) {
    if (!env.inMg)
      originalMethod.apply(this, args)
  }
}

export class SelParser {
  sel: any

  constructor() {
    this.commonSel()
  }

  @allowMg
  getMgSel() {
    this.sel = client.mg.document.currentPage.selection
  }

  @allowFg
  getFgSel() {
    this.sel = client.figma.currentPage.selection
  }

  commonSel() {
    this.getFgSel()
    this.getMgSel()
  }
}
