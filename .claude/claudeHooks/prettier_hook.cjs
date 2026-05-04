const { execFileSync } = require('child_process');
const fs = require('fs');

const main = async () => {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    return;
  }

  const filePath = payload.tool_input?.file_path || payload.tool_response?.filePath || '';
  if (!filePath || !fs.existsSync(filePath)) return;

  let prettierBin;
  try {
    prettierBin = require.resolve('prettier/bin/prettier.cjs', { paths: [process.cwd()] });
  } catch {
    process.stderr.write('[prettier hook] prettier not installed in this project\n');
    return;
  }

  try {
    execFileSync(process.execPath, [prettierBin, '--write', '--ignore-unknown', filePath], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
  } catch (err) {
    process.stderr.write(`[prettier hook] ${err.message}\n`);
  }
};

main();
