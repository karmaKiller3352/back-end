"use strict";

var words = {
  'а': 'a',
  'б': 'b',
  'в': 'v',
  'г': 'g',
  'д': 'd',
  'е': 'e',
  'ё': 'yo',
  'ж': 'zh',
  'з': 'z',
  'и': 'i',
  'й': 'y',
  'к': 'k',
  'л': 'l',
  'м': 'm',
  'н': 'n',
  'о': 'o',
  'п': 'p',
  'р': 'r',
  'с': 's',
  'т': 't',
  'у': 'u',
  'ф': 'f',
  'х': 'h',
  'ц': 'c',
  'ч': 'ch',
  'ш': 'sh',
  'щ': 'shch',
  'ъ': '',
  'ы': 'y',
  'ь': '',
  'э': 'e',
  'ю': 'yu',
  'я': 'ya'
};

var makePageUrl = function makePageUrl(title) {
  if (!title) return null;
  var prepared = title.trim().replace(/[\s,!?#|*&~/\//\\]/g, "-").toLowerCase();
  var result = prepared.split('').map(function (_char) {
    return words[_char] || _char;
  });
  return result.join('');
};

module.exports = makePageUrl;