import fs from 'fs';
import https from 'https';

const url = 'https://images.weserv.nl/?url=https://cute-chebakia-000cb7.netlify.app/favicon.svg&output=png&w=32&h=32';

https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Request failed. Status Code: ${res.statusCode}`);
    res.consume();
    return;
  }

  const data = [];
  res.on('data', (chunk) => {
    data.push(chunk);
  });

  res.on('end', () => {
    const buffer = Buffer.concat(data);
    fs.writeFileSync('public/favicon.ico', buffer);
    console.log('Successfully downloaded and saved logo as public/favicon.ico!');
  });
}).on('error', (e) => {
  console.error(`Error: ${e.message}`);
});
