/**
 * Utilitários para formatação de texto HTML para exibição limpa
 */

/**
 * Remove tags HTML e formata o texto para exibição limpa
 * @param {string} htmlContent - Conteúdo HTML
 * @returns {string} - Texto formatado sem HTML
 */
export function stripHtmlAndFormat(htmlContent) {
  if (!htmlContent) return ''
  
  let text = htmlContent
  
  // Converter quebras de linha HTML para quebras de linha reais
  text = text.replace(/<br\s*\/?>/gi, '\n')
  text = text.replace(/<\/p>/gi, '\n\n')
  text = text.replace(/<p[^>]*>/gi, '')
  
  // Converter listas em texto formatado
  text = text.replace(/<li[^>]*>/gi, '• ')
  text = text.replace(/<\/li>/gi, '\n')
  text = text.replace(/<\/?[uo]l[^>]*>/gi, '\n')
  
  // Converter headings em texto com formatação
  text = text.replace(/<h[1-6][^>]*>/gi, '\n')
  text = text.replace(/<\/h[1-6]>/gi, '\n')
  
  // Converter divs em quebras de linha
  text = text.replace(/<div[^>]*>/gi, '\n')
  text = text.replace(/<\/div>/gi, '')
  
  // Remover todas as outras tags HTML
  text = text.replace(/<[^>]*>/g, '')
  
  // Decodificar entidades HTML
  text = text.replace(/&nbsp;/g, ' ')
  text = text.replace(/&amp;/g, '&')
  text = text.replace(/&lt;/g, '<')
  text = text.replace(/&gt;/g, '>')
  text = text.replace(/&quot;/g, '"')
  text = text.replace(/&#39;/g, "'")
  
  // Limpar espaços extras e quebras de linha múltiplas
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n') // Máximo 2 quebras consecutivas
  text = text.replace(/^\s+|\s+$/g, '') // Remover espaços no início e fim
  text = text.replace(/[ \t]+/g, ' ') // Normalizar espaços
  
  return text
}

/**
 * Formata texto para exibição em HTML preservando quebras de linha
 * @param {string} content - Conteúdo de texto
 * @returns {string} - HTML formatado para exibição
 */
export function formatTextForDisplay(content) {
  if (!content) return 'Sem conteúdo'
  
  // Se já é HTML limpo, apenas converter quebras de linha
  if (content.includes('<') && content.includes('>')) {
    return stripHtmlAndFormat(content).replace(/\n/g, '<br>')
  }
  
  // Se é texto puro, apenas converter quebras de linha
  return content.replace(/\n/g, '<br>')
}

/**
 * Cria preview do conteúdo limitando caracteres
 * @param {string} content - Conteúdo completo
 * @param {number} maxLength - Número máximo de caracteres
 * @returns {string} - Preview do conteúdo
 */
export function createContentPreview(content, maxLength = 150) {
  if (!content) return 'Sem conteúdo'
  
  // Limpar HTML primeiro
  const cleanText = stripHtmlAndFormat(content)
  
  // Limitar tamanho
  if (cleanText.length <= maxLength) {
    return cleanText
  }
  
  // Cortar no último espaço antes do limite para não quebrar palavras
  const truncated = cleanText.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > maxLength * 0.8) { // Se o último espaço não está muito longe
    return truncated.substring(0, lastSpace) + '...'
  }
  
  return truncated + '...'
}

/**
 * Formata conteúdo para exibição em modal com estrutura melhorada
 * @param {string} content - Conteúdo HTML
 * @returns {string} - HTML formatado para modal
 */
export function formatContentForModal(content) {
  if (!content) return '<p class="text-gray-500 italic">Sem conteúdo</p>'
  
  // Limpar e formatar o texto
  const cleanText = stripHtmlAndFormat(content)
  
  // Dividir em parágrafos
  const paragraphs = cleanText.split('\n\n').filter(p => p.trim())
  
  // Formatar cada parágrafo
  const formattedParagraphs = paragraphs.map(paragraph => {
    const lines = paragraph.split('\n').filter(line => line.trim())
    
    return lines.map(line => {
      const trimmedLine = line.trim()
      
      // Se é uma linha com bullet point
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        return `<li class="ml-4">${trimmedLine.substring(1).trim()}</li>`
      }
      
      // Se é uma linha numerada
      if (/^\d+\./.test(trimmedLine)) {
        return `<li class="ml-4">${trimmedLine.replace(/^\d+\.\s*/, '')}</li>`
      }
      
      // Se parece com um título (linha curta, maiúscula, etc.)
      if (trimmedLine.length < 50 && (trimmedLine === trimmedLine.toUpperCase() || trimmedLine.endsWith(':'))) {
        return `<h4 class="font-semibold text-gray-900 mt-4 mb-2">${trimmedLine}</h4>`
      }
      
      // Linha normal
      return `<p class="mb-2">${trimmedLine}</p>`
    }).join('')
  })
  
  return formattedParagraphs.join('<div class="mb-4"></div>')
}

/**
 * Detecta e formata listas no texto
 * @param {string} text - Texto com possíveis listas
 * @returns {string} - Texto com listas formatadas
 */
export function formatLists(text) {
  // Detectar listas com bullets
  text = text.replace(/^[•\-\*]\s+(.+)$/gm, '<li>$1</li>')
  
  // Detectar listas numeradas
  text = text.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
  
  // Envolver listas consecutivas em <ul>
  text = text.replace(/(<li>.*<\/li>\s*)+/gs, '<ul class="list-disc list-inside mb-4">$&</ul>')
  
  return text
}
