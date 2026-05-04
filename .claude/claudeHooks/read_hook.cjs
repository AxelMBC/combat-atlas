const main = async () => {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const toolArgs = JSON.parse(Buffer.concat(chunks).toString());

  const readPath = toolArgs.tool_input?.file_path || toolArgs.tool_input?.path || '';

  if (readPath.includes('env')) {
    console.error('You can not read the .env file');
    process.exit(2);
  }
};

main();
