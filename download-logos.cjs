const https = require('https');
const fs = require('fs');
const path = require('path');

const domains = {
  'sap': 'sap.com',
  'temenos': 'temenos.com',
  'mbme': 'mbme.ae',
  'egyptpost': 'egyptpost.org',
  'mcit': 'mcit.gov.eg',
  'hdbank': 'hdb-egy.com',
  'sczone': 'sczone.eg',
  'egypttrust': 'egypttrust.com',
  'maridive': 'maridivegroup.net',
  'baheya': 'baheya.org',
  'prosecure': 'prosecureme.com',
  'itil': 'axelos.com',
  'cobit': 'isaca.org',
  'pmbok': 'pmi.org',
  'togaf': 'opengroup.org',
  'iso27001': 'iso.org',
  'prince2': 'axelos.com'
};

const outputDir = path.join(__dirname, 'public', 'logos');

Object.entries(domains).forEach(([name, domain]) => {
  const url = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  const dest = path.join(outputDir, `${name}.png`);
  
  https.get(url, (response) => {
    if (response.statusCode === 200) {
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${name} from ${domain}`);
      });
    } else {
      console.log(`Failed to download ${name} (${domain}): ${response.statusCode}`);
      response.resume(); // consume response data to free up memory
    }
  }).on('error', (err) => {
    console.error(`Error downloading ${name}: ${err.message}`);
  });
});
