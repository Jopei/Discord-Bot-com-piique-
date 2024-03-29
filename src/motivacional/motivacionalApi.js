const translate = require('../services/translate.js');
const messages = require('./messages.js');

/*
  example of use:

  import MotivacionalApi from '../motivacional/index.js';
  MotivacionalApi('pt').then((resultado) => {
    console.log(resultado);
  });

  author: piique
*/

const MotivacionalApi = (targetLanguageIso = 'pt') => {
  const randomMotivacional = messages[Math.floor(Math.random() * messages.length)];

  const config = {
    text: randomMotivacional.text,
    sourceIso: 'en',
    targetIso: targetLanguageIso,
  };

  return translate(config).then((resultado) => {
    const translatedText = resultado;
    return {
      originalText: randomMotivacional.text,
      translatedText,
      author: randomMotivacional.author,
    };
  });
};

module.exports = MotivacionalApi;
