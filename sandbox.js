const bcrypt = require('bcryptjs');

async function main() {
  const password = 'Super secret passw0rd';
  const hashedPassword = await bcrypt.hash(password, 14);

  console.log('hashedPassword', hashedPassword);

  const arePasswordsSame = await bcrypt.compare('not the same', hashedPassword);

  console.log('arePasswordsSame', arePasswordsSame);
}

main();
