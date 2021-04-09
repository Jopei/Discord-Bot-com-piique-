import axios from 'axios';

/*
  example of use:
  import translate from './translate.js';
  const config = {
    text: 'Some text in the language sent',
    sourceIso: 'in',
    targetIso: 'pt',
  };
  translate(config).then((resultado) => {
    const texto = resultado;
    console.log(texto);
  });

  author: piique
*/

const translate = async (config = {}) => {
  const sourceText = config.text ?? 'testing';
  const sourceLang = config.sourceIso ?? 'auto';
  const targetLang = config.targetIso ?? 'pt';

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${
    sourceLang}&tl=${targetLang}&dt=t&q=${encodeURI(sourceText)}`;

  let translatedText = '';

  return axios.get(url).then((response) => {
    const { data } = response;
    // just 1 line
    // translatedText = data[0][0][0];

    // many lines to translate
    data[0].forEach((element) => {
      translatedText += `${element[0]} `;
    });

    return translatedText;
  }).catch((error) => {
    // console.log(error);
  });
};

export default translate;
