/**
 * This function aligns a graph in the center.
 * It provides methods to specify alignment direction (horizontal or vertical),
 * the target element to align, and the container for alignment.
 */
const alignGraph = () => {
  // Flags to control alignment direction
  this.isVertical = false
  this.isHorizontal = false

  // Method to set vertical alignment
  this.vertical = () => {
    if(!this.remainBox) throw new Error(
      "You should provide a container object:\n" +
      "alignGraph().container({ x: number, y: number, width: number, height: number})"
    )
    if(!this.content) throw new Error(
      "You should provide a target element:\n" +
      "alignGraph().target(d3.selection())"
    )
    this.isVertical = true
    setTranslate(this.isVertical, this.isHorizontal)
    return this
  }

  // Method to set horizontal alignment
  this.horizontal = () => {
    if(!this.remainBox) throw new Error(
      "You should provide a container:\n" +
      "alignGraph().container({ x: number, y: number, width: number, height: number})"
    )
    if(!this.content) throw new Error(
      "You should provide a target element:\n" +
      "alignGraph().target(d3.selection())"
    )
    this.isHorizontal = true
    setTranslate(this.isVertical, this.isHorizontal)
    return this
  }

  // Method to specify the target element for alignment
  this.target = (selection) => {
    // Wrap the given element with a <g> tag
    this.content = selection.node()
    this.parent = this.content.parentNode
    wrapContent(this.content)
    return this
  }

  // Method to specify the container for alignment
  this.container = (remainBox) => {
    this.remainBox = {
      x0: (remainBox.x0 != undefined) ? remainBox.x0 : remainBox.x,
      y0: (remainBox.y0 != undefined) ? remainBox.y0 : remainBox.y,
      remainWidth: (remainBox.remainWidth != undefined) ? remainBox.remainWidth : remainBox.width,
      remainHeight: (remainBox.remainHeight != undefined) ? remainBox.remainHeight : remainBox.height,
    }
    this.remainCenter = {
      x: this.remainBox.x0 + this.remainBox.remainWidth / 2,
      y: this.remainBox.y0 + this.remainBox.remainHeight / 2
    }
    return this
  }

  // Translation offsets for alignment
  this.translate = { x: 0, y: 0 }

  // Function to calculate and set the translation
  const setTranslate = (isVertical, isHorizontal) => {
    // Calculate vertical alignment
    if (isVertical) {
      const wrapperCY = this.wrapperCenter.y
      const remainCY = this.remainCenter.y
      if (wrapperCY > remainCY) {
        this.translate.y = -Math.abs(wrapperCY - remainCY)
      }
      if (wrapperCY < remainCY) {
        this.translate.y = Math.abs(remainCY - wrapperCY)
      }
    }

    // Calculate horizontal alignment
    if (isHorizontal) {
      const wrapperCX = this.wrapperCenter.x
      const remainCX = this.remainCenter.x
      if (wrapperCX > remainCX) {
        this.translate.x = -Math.abs(wrapperCX - remainCX)
      }
      if (wrapperCX < remainCX) {
        this.translate.x = Math.abs(remainCX - wrapperCX)
      }
    }

    // Set transform attribute for alignment
    this.wrapper.setAttribute(
      "transform",
      `translate(${this.translate.x},${this.translate.y})`
    )
  }

  // Function to wrap content with a <g> tag
  const wrapContent = () => {
    this.wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g")
    this.parent.appendChild(this.wrapper)
    this.parent.replaceChild(this.wrapper, this.content)
    this.wrapper.appendChild(this.content)

    // Calculate center of the wrapperBox
    this.wrapperBox = this.wrapper.getBBox()
    this.wrapperCenter = {
      x: this.wrapperBox.x + this.wrapperBox.width / 2,
      y: this.wrapperBox.y + this.wrapperBox.height / 2
    }
  }

  return this
}

export { alignGraph }
