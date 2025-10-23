// Script de teste da API Gemini
const API_KEY = 'AIzaSyAMWFTeiS62Qk5lKrYGB4y9qjPfSehEJc8';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

async function testGeminiAPI() {
  console.log('🔍 Testando API do Google Gemini...\n');
  
  const requestBody = {
    contents: [{
      parts: [{
        text: 'Olá! Você está funcionando? Responda em português.'
      }]
    }]
  };

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ API funcionando perfeitamente!');
      console.log('\n📝 Resposta da Luma:');
      console.log(data.candidates[0].content.parts[0].text);
    } else {
      console.log('❌ Erro na API:');
      console.log('Status:', response.status);
      console.log('Erro:', JSON.stringify(data, null, 2));
      
      if (data.error?.status === 'PERMISSION_DENIED') {
        console.log('\n⚠️  A API não está ativada!');
        console.log('👉 Ative em: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
      }
    }
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message);
  }
}

testGeminiAPI();
