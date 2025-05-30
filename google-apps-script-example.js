
// Cole este código no Google Apps Script (script.google.com)
// Este arquivo é apenas para referência - não será usado na aplicação React

function doGet(e) {
  try {
    // Obter os dados do parâmetro
    const data = JSON.parse(e.parameter.data);
    
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
        'Data', 'Timestamp', 'Categoria', 'Item', 'Código', 
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
          item.code,
          item.description,
          item.evaluation,
          item.repair,
          data.signature ? 'Assinado' : 'Não assinado'
        ]);
      });
    });
    
    // Inserir os dados na planilha
    if (rows.length > 0) {
      const startRow = sheet.getLastRow() + 1;
      sheet.getRange(startRow, 1, rows.length, 9).setValues(rows);
    }
    
    // Retornar sucesso
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Dados salvos com sucesso',
        rowsAdded: rows.length
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Retornar erro
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Função auxiliar para testar o script
function testScript() {
  const testData = {
    parameter: {
      data: JSON.stringify({
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
      })
    }
  };
  
  const result = doGet(testData);
  console.log(result.getContent());
}
