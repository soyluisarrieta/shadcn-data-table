import jsPDF from 'jspdf'

interface PDFConfig {
  title: string
  startY: number
  lineHeight: number
  maxRowsPerPage: number
  filename?: string
}

const defaultConfig: PDFConfig = {
  title: 'Report',
  startY: 30,
  lineHeight: 10,
  maxRowsPerPage: 25
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

export const addTableHeaders = (doc: jsPDF, columns: PDFColumn[], startY: number) => {
  doc.setFont('helvetica', 'bold')

  let currentX = 14

  doc.text('#', currentX, startY)
  currentX += 16

  columns.forEach(column => {
    doc.text(column.header, currentX, startY)
    currentX += column.width
  })

  doc.setLineWidth(0.5)
  doc.line(14, startY + 2, 195, startY + 2)

  doc.setFont('helvetica', 'normal')
}

export const generateTablePDF = <T extends Record<string, any>>(
  rows: T[],
  columns: PDFColumn[],
  config: Partial<PDFConfig> = {}
): void => {
  const { doc, config: mergedConfig } = createPDFDocument(config)
  const { startY, lineHeight, maxRowsPerPage } = mergedConfig

  addTableHeaders(doc, columns, startY)

  let currentPage = 1
  let rowsOnCurrentPage = 0

  rows.forEach((row, index) => {
    if (rowsOnCurrentPage >= maxRowsPerPage) {
      doc.addPage()
      currentPage++
      rowsOnCurrentPage = 0

      addTableHeaders(doc, columns, startY)
    }

    const rowY = startY + (rowsOnCurrentPage + 1) * lineHeight

    doc.text((index + 1).toString(), 14, rowY)

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

      doc.text(value, currentX, rowY)
      currentX += column.width
    })

    rowsOnCurrentPage++
  })

  const pdfBlob = doc.output('blob')
  const pdfUrl = URL.createObjectURL(pdfBlob)
  window.open(pdfUrl, '_blank')
}
