const shell = require("shelljs");
const program = require('commander');

program
  .option('-n, --name', 'Name of ')
  .parse(process.argv);

var pkgs = program.args;

if (!pkgs.length) {
  console.error('packages required');
  process.exit(1);
}

console.log();
if (program.force) console.log('  force: install');
pkgs.forEach(function(pkg){
  console.log('  install : %s', pkg);
});
console.log();

if (true) {
  let info = 'publish';
  console.log(info)
}
// shell.exec("now");