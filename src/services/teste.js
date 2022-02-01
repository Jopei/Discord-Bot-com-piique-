/*
  testing file

  author: piique
*/

const translate = require('./translate.js');
const MotivacionalApi = require('../motivacional/motivacionalApi.js');

MotivacionalApi('pt').then((resultado) => {
  const texto = resultado;
  console.log(resultado);
});

// import data from '../motivacional/data.js';
// const fraseMotivacionalAleatoria = data[Math.floor(Math.random() * data.length)];

// const config = {
//   text: data[Math.floor(Math.random() * data.length)].text,
//   sourceIso: 'en',
//   targetIso: 'pt',
// };

// const config = {
//   text: "It's so simple to be wise.",
//   sourceIso: 'en',
//   targetIso: 'pt',
// };

// console.log(JSON.stringify(config.text));

// translate(config).then((resultado) => {
//   const texto = resultado;
//   console.log(texto);
// });
