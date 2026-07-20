import fs from 'fs';
import path from 'path';

const pngData = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // Reserved
header.writeUInt16LE(1, 2); // ICO type
header.writeUInt16LE(1, 4); // Number of images

const dirEntry = Buffer.alloc(16);
dirEntry.writeUInt8(1, 0); // Width
dirEntry.writeUInt8(1, 1); // Height
dirEntry.writeUInt8(0, 2); // Color palette
dirEntry.writeUInt8(0, 3); // Reserved
dirEntry.writeUInt16LE(1, 4); // Color planes
dirEntry.writeUInt16LE(32, 6); // Bits per pixel
dirEntry.writeUInt32LE(pngData.length, 8); // Size of PNG data
dirEntry.writeUInt32LE(22, 12); // Offset to PNG data

const icoData = Buffer.concat([header, dirEntry, pngData]);
const targetPath = path.join('public', 'favicon.ico');
fs.writeFileSync(targetPath, icoData);
console.log('favicon.ico generated successfully!');
