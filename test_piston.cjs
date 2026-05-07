const axios = require('axios');

async function testPiston() {
  try {
    const res = await axios.post('https://emacs.piston.rs/api/v2/execute', {
      language: 'cpp',
      version: '10.2.0',
      files: [{ content: '#include <iostream>\nusing namespace std;\nint main() { int a, b; cin >> a >> b; cout << "X = " << a + b << endl; return 0; }' }],
      stdin: '10\n9'
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.message);
  }
}
testPiston();
