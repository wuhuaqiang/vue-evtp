export function getLinesPoints(result) {
  const points = []
  result.Fr[0].ik.map(line => {
    line.Hr.map(point => {
      points.push(point)
    })
  })
  return points
}

export function getLinePoints(result) {
  console.log(result)
  return result.Er[0].ik[0].Gr
}

