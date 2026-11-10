const fs = require('fs');
const path = require('path');

const origDir = path.join(process.env.USERPROFILE, 'Downloads', 'Wedding', 'bride');
const galleryDir = path.join(__dirname, '..', 'public', 'images', 'gallery');

const captions = [
  'Flaunting those new rings and that forever kind of vibe', // 1
  'Glowing against that striking backdrop', // 2
  'Candid moments', // 3
  'Sweet smiles that say it all', // 4
  'Lost in a quiet, beautiful moment', // 5
  'Just engaged and ready for the sweetest journey ahead', // 6
  'Keeping it stylish together with pose', // 7
  'Cutting into celebration mode ', // 8
  'Striking a pose with effortless grace and timeless elegance', // 9
  'Showcasing those special symbols of a brand new journey together', // 10
  'Caught in a dreamy spotlight with a look of pure grace', // 11
  'Sharing a close, quiet moment wrapped in love and warmth', // 12
  'Crowning the celebration with a beautiful ring ceremony cake', // 13
  'Where the celebrations and unforgettable memories come to life at Hotel Meenar' // 14
];

console.log('Captions list:');
captions.forEach((c, i) => console.log(`${i+1}: ${c}`));
