
// Cole este código no Google Apps Script (script.google.com)
// Este script cria automaticamente um Google Doc e salva todos os dados do formulário

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    console.log('Parâmetros recebidos:', e);
    
    let data;
    
    // Tentar obter dados do GET primeiro, depois do POST
    if (e.parameter && e.parameter.data) {
      console.log('Dados GET recebidos:', e.parameter.data);
      data = JSON.parse(e.parameter.data);
    } else if (e.postData && e.postData.contents) {
      console.log('Dados POST recebidos:', e.postData.contents);
      data = JSON.parse(e.postData.contents);
    }
    
    if (!data) {
      throw new Error('Nenhum dado foi recebido');
    }
    
    console.log('Dados processados:', data);
    
    // Criar um novo Google Doc automaticamente
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const docName = `Checklist_${data.localName || 'Local'}_${data.date}_${timestamp}`;
    
    // Criar o documento
    const doc = DocumentApp.create(docName);
    const body = doc.getBody();
    
    // Configurar estilos - Personalize as cores aqui
    const titleStyle = {};
    titleStyle[DocumentApp.Attribute.FONT_SIZE] = 18;
    titleStyle[DocumentApp.Attribute.BOLD] = true;
    titleStyle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
    titleStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#2563eb'; // Azul - altere aqui
    
    const headerStyle = {};
    headerStyle[DocumentApp.Attribute.FONT_SIZE] = 14;
    headerStyle[DocumentApp.Attribute.BOLD] = true;
    headerStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#1e40af'; // Azul escuro - altere aqui
    
    const normalStyle = {};
    normalStyle[DocumentApp.Attribute.FONT_SIZE] = 11;
    normalStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#374151'; // Cinza escuro - altere aqui
    
    // CONFIGURAÇÃO DA LOGO
    // Substitua 'SEU_ID_DA_LOGO_AQUI' pelo ID da sua imagem no Google Drive
    // Para obter o ID: Faça upload da logo no Drive > Abra a imagem > Copie o ID da URL
    const logoId = 'SEU_ID_DA_LOGO_AQUI'; // SUBSTITUA AQUI
    
    try {
      if (logoId && logoId !== 'SEU_ID_DA_LOGO_AQUI') {
        const logoFile = DriveApp.getFileById(logoId);
        const logoBlob = logoFile.getBlob();
        const logoImage = body.appendImage(logoBlob);
        logoImage.setWidth(150);
        logoImage.setHeight(100);
        body.appendParagraph(''); // Espaço após a logo
      }
    } catch (logoError) {
      console.log('Erro ao inserir logo (ignorado):', logoError);
      // Continua sem a logo se houver erro
    }
    
    // Adicionar título
    const title = body.appendParagraph('CHECKLIST DE PLATAFORMA DE LANÇAMENTO');
    title.setAttributes(titleStyle);
    
    body.appendParagraph(''); // Linha em branco
    
    // Adicionar informações gerais
    const infoHeader = body.appendParagraph('INFORMAÇÕES GERAIS');
    infoHeader.setAttributes(headerStyle);
    
    body.appendParagraph(`Data da Inspeção: ${data.date || 'N/A'}`).setAttributes(normalStyle);
    body.appendParagraph(`Nome do Local: ${data.localName || 'N/A'}`).setAttributes(normalStyle);
    body.appendParagraph(`Nome do Colaborador: ${data.collaboratorName || 'N/A'}`).setAttributes(normalStyle);
    body.appendParagraph(`Número da Ordem de Serviço: ${data.serviceOrderNumber || 'N/A'}`).setAttributes(normalStyle);
    body.appendParagraph(`Timestamp: ${data.timestamp || 'N/A'}`).setAttributes(normalStyle);
    
    body.appendParagraph(''); // Linha em branco
    
    // Adicionar descrição se existir
    if (data.description && data.description.trim()) {
      const descHeader = body.appendParagraph('DESCRIÇÃO');
      descHeader.setAttributes(headerStyle);
      body.appendParagraph(data.description).setAttributes(normalStyle);
      body.appendParagraph(''); // Linha em branco
    }
    
    // Adicionar observação se existir
    if (data.observation && data.observation.trim()) {
      const obsHeader = body.appendParagraph('OBSERVAÇÃO');
      obsHeader.setAttributes(headerStyle);
      body.appendParagraph(data.observation).setAttributes(normalStyle);
      body.appendParagraph(''); // Linha em branco
    }
    
    // Processar todas as categorias dinamicamente
    if (data.categories && Array.isArray(data.categories)) {
      const categoriesHeader = body.appendParagraph('ITENS DE VERIFICAÇÃO');
      categoriesHeader.setAttributes(headerStyle);
      body.appendParagraph(''); // Linha em branco
      
      data.categories.forEach((category, categoryIndex) => {
        // Adicionar nome da categoria
        const categoryHeader = body.appendParagraph(`${categoryIndex + 1}. ${category.name}`);
        categoryHeader.setAttributes(headerStyle);
        
        // Processar todos os itens da categoria
        if (category.items && Array.isArray(category.items)) {
          category.items.forEach((item, itemIndex) => {
            body.appendParagraph(`   ${item.code || `${categoryIndex + 1}.${itemIndex + 1}`} - ${item.description}`).setAttributes(normalStyle);
            body.appendParagraph(`       Avaliação: ${item.evaluation || 'N/A'}`).setAttributes(normalStyle);
            body.appendParagraph(`       Reparo: ${item.repair || 'N/A'}`).setAttributes(normalStyle);
            
            // Adicionar qualquer campo adicional que possa existir no item
            Object.keys(item).forEach(key => {
              if (!['id', 'code', 'description', 'evaluation', 'repair'].includes(key)) {
                body.appendParagraph(`       ${key}: ${item[key]}`).setAttributes(normalStyle);
              }
            });
            
            body.appendParagraph(''); // Linha em branco entre itens
          });
        }
        
        body.appendParagraph(''); // Linha em branco entre categorias
      });
    }
    
    // Processar assinatura digital
    if (data.signature && data.signature.trim()) {
      const sigHeader = body.appendParagraph('ASSINATURA DIGITAL');
      sigHeader.setAttributes(headerStyle);
      
      try {
        // Converter base64 para blob e inserir como imagem
        if (data.signature.startsWith('data:image/')) {
          const base64Data = data.signature.split(',')[1];
          const imageBlob = Utilities.newBlob(
            Utilities.base64Decode(base64Data),
            'image/png',
            'assinatura.png'
          );
          
          // Inserir a imagem no documento
          const image = body.appendImage(imageBlob);
          image.setWidth(300);
          image.setHeight(150);
          
          body.appendParagraph('Documento assinado digitalmente.').setAttributes(normalStyle);
        } else {
          body.appendParagraph('Assinatura digital presente (formato não suportado para exibição).').setAttributes(normalStyle);
        }
      } catch (imageError) {
        console.error('Erro ao processar assinatura:', imageError);
        body.appendParagraph('Documento assinado digitalmente (erro ao exibir imagem).').setAttributes(normalStyle);
      }
    } else {
      const sigHeader = body.appendParagraph('ASSINATURA DIGITAL');
      sigHeader.setAttributes(headerStyle);
      body.appendParagraph('Documento não foi assinado.').setAttributes(normalStyle);
    }
    
    body.appendParagraph(''); // Linha em branco
    
    // Adicionar campos adicionais dinâmicos
    const additionalFields = body.appendParagraph('CAMPOS ADICIONAIS');
    additionalFields.setAttributes(headerStyle);
    
    let hasAdditionalFields = false;
    Object.keys(data).forEach(key => {
      if (!['date', 'localName', 'collaboratorName', 'serviceOrderNumber', 'description', 'observation', 'timestamp', 'categories', 'signature'].includes(key)) {
        body.appendParagraph(`${key}: ${JSON.stringify(data[key])}`).setAttributes(normalStyle);
        hasAdditionalFields = true;
      }
    });
    
    if (!hasAdditionalFields) {
      body.appendParagraph('Nenhum campo adicional encontrado.').setAttributes(normalStyle);
    }
    
    // Adicionar rodapé
    body.appendParagraph(''); // Linha em branco
    body.appendParagraph('________________________________').setAttributes(normalStyle);
    body.appendParagraph(`Documento gerado automaticamente em: ${new Date().toLocaleString('pt-BR')}`).setAttributes(normalStyle);
    body.appendParagraph('Sistema de Checklist - Plataforma de Lançamento MSV').setAttributes(normalStyle);
    
    // Salvar o documento
    doc.saveAndClose();
    
    // Obter URL do documento
    const docUrl = doc.getUrl();
    const docId = doc.getId();
    
    console.log('Documento criado com sucesso:', docUrl);
    
    // Retornar sucesso
    const response = {
      status: 'success',
      message: 'Dados salvos com sucesso no Google Docs',
      docUrl: docUrl,
      docId: docId,
      docName: docName,
      localName: data.localName,
      collaboratorName: data.collaboratorName,
      serviceOrderNumber: data.serviceOrderNumber,
      hasSignature: !!data.signature,
      timestamp: new Date().toISOString()
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    console.error('Erro no script:', error);
    
    // Retornar erro
    const errorResponse = {
      status: 'error',
      message: error.toString(),
      details: error.stack || '',
      timestamp: new Date().toISOString()
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

// Função auxiliar para testar o script
function testScript() {
  const testData = {
    date: '2024-01-15',
    localName: 'Plataforma Norte',
    collaboratorName: 'João Silva',
    serviceOrderNumber: 'OS-2024-001',
    description: 'Inspeção de rotina da plataforma de lançamento',
    observation: 'Encontradas algumas irregularidades que necessitam reparo',
    timestamp: new Date().toISOString(),
    categories: [
      {
        id: '1',
        name: 'POSTES',
        items: [
          {
            id: '1-1',
            code: '1.1',
            description: 'Poste deteriorado',
            evaluation: 'SIM',
            repair: 'SIM'
          }
        ]
      }
    ],
    signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
  };
  
  const mockRequest = {
    parameter: {
      data: JSON.stringify(testData)
    }
  };
  
  const result = handleRequest(mockRequest);
  console.log('Resultado do teste:', result.getContent());
}

// Função para listar documentos criados (opcional)
function listCreatedDocs() {
  const files = DriveApp.getFilesByType(MimeType.GOOGLE_DOCS);
  const docs = [];
  
  while (files.hasNext()) {
    const file = files.next();
    if (file.getName().includes('Checklist_')) {
      docs.push({
        name: file.getName(),
        url: file.getUrl(),
        created: file.getDateCreated()
      });
    }
  }
  
  console.log('Documentos encontrados:', docs);
  return docs;
}
