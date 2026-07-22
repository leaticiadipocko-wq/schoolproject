import http from 'http';
import fs from 'fs';

const PORT = parseInt(process.env.PORT || '8080', 10);
const FILE = '/tmp/siarm-complete.tar.gz';

http.createServer((req, res) => {
  const stat = fs.statSync(FILE);
  res.writeHead(200, {
    'Content-Type': 'application/gzip',
    'Content-Disposition': 'attachment; filename="siarm-complete.tar.gz"',
    'Content-Length': stat.size,
    'Access-Control-Allow-Origin': '*',
  });
  fs.createReadStream(FILE).pipe(res);
}).listen(PORT, '0.0.0.0', () => {
  console.log(`Archive server on http://0.0.0.0:${PORT}`);
});
