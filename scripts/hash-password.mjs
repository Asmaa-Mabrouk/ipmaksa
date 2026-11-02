// Usage: npm run admin:hash -- you@example.com 'your password'
import crypto from "node:crypto";
const [email, password] = process.argv.slice(2);
if (!email || !password) { console.error("Usage: npm run admin:hash -- <email> <password>"); process.exit(1); }
const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto.scryptSync(password, salt, 64).toString("hex");
console.log(`\nAdd to ADMIN_USERS (comma-separate several users):\n${email.toLowerCase()}:${salt}:${hash}\n`);
