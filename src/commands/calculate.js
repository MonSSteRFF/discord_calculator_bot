const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calculate')
    .setDescription('calculate ur string')
    .addStringOption((option) =>
      option
        .setName('calc_string')
        .setDescription('The input to cal your string')
    ),
  async execute(interaction) {
    const str = interaction.options.getString('calc_string');

    const number = getNumber(str).replaceAll('*', `\\*`);

    await interaction.reply(number);
  },
};

const isSymbol = (s) => {
  return ['/', '-', '+', '*'].filter((j) => j === s).length > 0;
};

const checkWrongNumber = (str) => {
  let validStr = str;
  for (let i = 0; i < str.length; i++) {
    const n0 = str[i];
    const n1 = str[i + 1];
    const n2 = str[i + 2];

    if (isSymbol(n0) && isSymbol(n1) && isSymbol(n2)) {
      validStr =
        validStr.split('').splice(0, i).join('') +
        validStr
          .split('')
          .splice(i + 1, validStr.length - 1)
          .join('');
      return validStr;
    } else if (isSymbol(n0) && isSymbol(n1)) {
      if (
        (n0 === '*' && n1 !== '*') ||
        (n0 !== '*' && n1 === '*') ||
        (n0 !== '*' && n1 !== '*')
      ) {
        validStr =
          validStr.split('').splice(0, i).join('') +
          validStr
            .split('')
            .splice(i + 1, validStr.length - 1)
            .join('');

        console.log('validStr: ', validStr);

        return validStr;
      }
    } else if (n0 === '.' && n1 === '.') {
      validStr =
        validStr.split('').splice(0, i).join('') +
        validStr
          .split('')
          .splice(i + 1, validStr.length - 1)
          .join('');

      console.log('validStr: ', validStr);

      return validStr;
    }
  }
  return validStr;
};

const getNumber = (value) => {
  const str = value.replaceAll(' ', '').replace(/[^-()\d/*+.]/g, '');

  const validStr = checkWrongNumber(str);

  if (validStr !== str) {
    return getNumber(validStr);
  }

  try {
    if (str === '') {
      return `${validStr} = wrong string`;
    }

    const result = String(eval(str));

    if (String(result) === str || result === 'undefined' || result === 'NaN') {
      return `${validStr} = wrong string`;
    }

    if (result === 'Infinity') {
      return `${validStr} = Infinity`;
    }

    return `${validStr} = ${Number(result).toFixed(0)}`;
  } catch (e) {
    return 'error when calculate';
  }
};
