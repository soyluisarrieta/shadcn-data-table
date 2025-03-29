import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface PDFConfig {
  title: string
  startY: number
  lineHeight: number
  maxRowsPerPage: number
  filename?: string
  headerBackgroundColor?: string
  headerTextColor?: string
  alternateRowColors?: boolean
  evenRowColor?: string
  oddRowColor?: string
  borderColor?: string
  borderWidth?: number
}

const defaultConfig: PDFConfig = {
  title: 'Report',
  startY: 30,
  lineHeight: 10,
  maxRowsPerPage: 25,
  headerBackgroundColor: '#f3f4f6',
  headerTextColor: '#111827',
  alternateRowColors: true,
  evenRowColor: '#ffffff',
  oddRowColor: '#f9fafb',
  borderColor: '#e5e7eb',
  borderWidth: 0.5
}

export const createPDFDocument = (config: Partial<PDFConfig> = {}) => {
  const mergedConfig = { ...defaultConfig, ...config }
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text(mergedConfig.title, 14, 20)
  doc.setFontSize(10)

  return { doc, config: mergedConfig }
}

export interface PDFColumn {
  id: string
  header: string
  width: number
  accessor?: (row: any) => any
}

export const addTableHeaders = (doc: jsPDF, columns: PDFColumn[], startY: number, config: PDFConfig) => {
  doc.setFillColor(config.headerBackgroundColor || '#f3f4f6')
  doc.setTextColor(config.headerTextColor || '#111827')
  doc.setFont('helvetica', 'bold')
  doc.setDrawColor(config.borderColor || '#e5e7eb')
  doc.setLineWidth(config.borderWidth || 0.5)

  // Dibuja el fondo del encabezado
  const tableWidth = columns.reduce((acc, col) => acc + col.width, 30) // 30 para la columna #
  doc.rect(14, startY - 6, tableWidth, 8, 'F')

  let currentX = 14

  // Dibuja el texto del encabezado
  doc.text('#', currentX + 4, startY - 1)
  currentX += 16

  columns.forEach(column => {
    doc.text(column.header, currentX, startY - 1)
    currentX += column.width
  })

  // Dibuja la línea debajo del encabezado
  doc.line(14, startY + 1, 14 + tableWidth, startY + 1)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0) // Restaura el color de texto
}

export const generateTablePDF = <T extends Record<string, any>>(
  rows: T[],
  columns: PDFColumn[],
  config: Partial<PDFConfig> = {}
): void => {
  const { doc, config: mergedConfig } = createPDFDocument(config)
  const { startY, lineHeight, maxRowsPerPage } = mergedConfig

  addTableHeaders(doc, columns, startY, mergedConfig)

  let currentPage = 1
  let rowsOnCurrentPage = 0
  const tableWidth = columns.reduce((acc, col) => acc + col.width, 30) // 30 para la columna #

  rows.forEach((row, index) => {
    if (rowsOnCurrentPage >= maxRowsPerPage) {
      doc.addPage()
      currentPage++
      rowsOnCurrentPage = 0

      addTableHeaders(doc, columns, startY, mergedConfig)
    }

    const rowY = startY + (rowsOnCurrentPage + 1) * lineHeight

    // Aplica colores alternados a las filas si está habilitado
    if (mergedConfig.alternateRowColors) {
      doc.setFillColor(
        index % 2 === 0
          ? mergedConfig.evenRowColor || '#ffffff'
          : mergedConfig.oddRowColor || '#f9fafb'
      )
      doc.rect(14, rowY - 6, tableWidth, lineHeight, 'F')
    }

    // Dibuja los bordes de la fila
    doc.setDrawColor(mergedConfig.borderColor || '#e5e7eb')
    doc.setLineWidth(mergedConfig.borderWidth || 0.5)
    doc.line(14, rowY + 2, 14 + tableWidth, rowY + 2) // Línea inferior
    doc.line(14, rowY - 6, 14, rowY + 2) // Línea izquierda
    doc.line(14 + tableWidth, rowY - 6, 14 + tableWidth, rowY + 2) // Línea derecha

    // Dibuja las líneas verticales entre columnas
    let colX = 30 // Después de la columna #
    doc.line(colX, rowY - 6, colX, rowY + 2) // Línea después de la columna #
    columns.forEach(column => {
      colX += column.width
      doc.line(colX, rowY - 6, colX, rowY + 2)
    })

    doc.setTextColor(0, 0, 0)
    doc.text((index + 1).toString(), 18, rowY - 1) // Centrado en la columna #

    let currentX = 30

    columns.forEach(column => {
      let value = column.accessor ? column.accessor(row) : row[column.id]

      if (typeof value === 'string') {
        value = value.substring(0, 30)
      } else if (value !== undefined) {
        value = String(value)
      } else {
        value = ''
      }

      doc.text(value, currentX + 2, rowY - 1) // Añade un pequeño padding
      currentX += column.width
    })

    rowsOnCurrentPage++
  })

  // Dibuja la línea final de la tabla si hay filas
  if (rows.length > 0) {
    const finalY = startY + rowsOnCurrentPage * lineHeight + 2
    doc.line(14, finalY, 14 + tableWidth, finalY)
  }

  const pdfBlob = doc.output('blob')
  const pdfUrl = URL.createObjectURL(pdfBlob)
  window.open(pdfUrl, '_blank')
}
