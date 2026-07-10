import { authenticateUser } from './services/userService.js';

async function test() {
  try {
    const user = await authenticateUser("demo@aloe.ulima.edu.pe", "123456");
    console.log("SUCCESS:", user);
  } catch (e) {
    console.error("ERROR:", e.message);
  }
}
test();
