// Genera un código como "DSCT-5F9KX2"
export const generarCodigoDescuento = () => {
  const prefijo = "DSCT"
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const longitud = 6
  let codigo = ""

  for (let i = 0; i < longitud; i++) {
    const indice = Math.floor(Math.random() * caracteres.length)
    codigo += caracteres[indice]
  }
  return `${prefijo}-${codigo}`
}
