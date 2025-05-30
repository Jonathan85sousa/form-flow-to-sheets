
// Cole este código no Google Apps Script (script.google.com)
// Este arquivo é apenas para referência - não será usado na aplicação React

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
    
    // Tentar obter dados do POST primeiro, depois do GET
    if (e.postData && e.postData.contents) {
      console.log('Dados POST recebidos:', e.postData.contents);
      const formData = e.postData.contents.split('&');
      for (let pair of formData) {
        const [key, value] = pair.split('=');
        if (key === 'data') {
          data = JSON.parse(decodeURIComponent(value));
          break;
        }
      }
    } else if (e.parameter && e.parameter.data) {
      console.log('Dados GET recebidos:', e.parameter.data);
      data = JSON.parse(e.parameter.data);
    }
    
    if (!data) {
      throw new Error('Nenhum dado foi recebido');
    }
    
    console.log('Dados processados:', data);
    
    // ID da sua planilha do Google Sheets
    const SHEET_ID = 'SEU_ID_DA_PLANILHA_AQUI'; // Substitua pelo ID real
    
    // Abrir a planilha
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName('Checklist');
    
    // Criar a aba se não existir
    if (!sheet) {
      sheet = ss.insertSheet('Checklist');
      
      // Adicionar cabeçalhos
      const headers = [
        'Data', 'Timestamp', 'Categoria', 'Código', 
        'Descrição', 'Avaliação', 'Reparo', 'Assinatura'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Formatar cabeçalhos
      sheet.getRange(1, 1, 1, headers.length)
           .setBackground('#4285f4')
           .setFontColor('white')
           .setFontWeight('bold');
    }
    
    // Preparar os dados para inserção
    const rows = [];
    
    data.categories.forEach(category => {
      category.items.forEach(item => {
        rows.push([
          data.date,
          data.timestamp,
          category.name,
          item.code,
          item.description,
          item.evaluation,
          item.repair,
          data.signature ? 'Assinado' : 'Não assinado'
        ]);
      });
    });
    
    console.log('Linhas a serem inseridas:', rows.length);
    
    // Inserir os dados na planilha
    if (rows.length > 0) {
      const startRow = sheet.getLastRow() + 1;
      sheet.getRange(startRow, 1, rows.length, 8).setValues(rows);
      console.log('Dados inseridos com sucesso na linha:', startRow);
    }
    
    // Retornar sucesso
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Dados salvos com sucesso',
        rowsAdded: rows.length,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Erro no script:', error);
    
    // Retornar erro
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Função auxiliar para testar o script
function testScript() {
  const testData = {
    postData: {
      contents: 'data=' + encodeURIComponent(JSON.stringify({
        date: '2024-01-15',
        timestamp: new Date().toISOString(),
        categories: [
          {
            id: '1',
            name: 'TESTE',
            items: [
              {
                id: '1-1',
                code: '1.1',
                description: 'Item de teste',
                evaluation: 'SIM',
                repair: 'NÃO'
              }
            ]
          }
        ],
        signature: 'data:image/png;base64,test'
      }))
    }
  };
  
  const result = handleRequest(testData);
  console.log('Resultado do teste:', result.getContent());
}
