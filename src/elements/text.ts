interface props {
  x: number 
  y: number 
  width: number 
  fontSize: number
  children: string[]
}

export const draw = (ctx: CanvasRenderingContext2D, { x, y, width, fontSize, children }: props) => {
  ctx.font = `${fontSize}px sans-serif`
  const lines = children[0].split(' ').reduce((lines: string[][], word) => {
    const lastLine = lines[lines.length - 1]
    const size = ctx.measureText(lastLine.concat([word]).join(' '))
    
    if (size.width < width || lastLine.length === 0) {
      lastLine.push(word)
    } else {
      lines.push([word])
    }

    return lines
  }, [[]])

  lines.forEach((line, i) => {
    ctx.fillText(line.join(' '), x, y + (fontSize * i) + fontSize)
  })
}
