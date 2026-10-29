#!/usr/bin/env node

const commands = {
  lint: require('../commands/lint'),
  // test: require('../commands/test'),
};

const [commandName, ...args] = process.argv.slice(2);

async function main() {
  const command = commands[commandName];

  if (!command) {
    console.error(
      `Unknown command: ${commandName ?? '(none)'}\n\n` +
      `Available commands: ${Object.keys(commands).join(', ')}`
    );

    process.exitCode = 1;
    return;
  }

  await command(args);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});