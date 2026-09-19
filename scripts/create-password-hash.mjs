import { scryptSync, randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const rl = createInterface({ input: stdin, output: stdout });
const password = await rl.question('New JARVIS password: ');
rl.close();
if (password.length < 10) throw new Error('Use at least 10 characters.');
const salt = randomBytes(16).toString('hex');
const hash = scryptSync(password, salt, 64).toString('hex');
stdout.write(`JARVIS_PASSWORD_HASH=${salt}:${hash}\n`);

