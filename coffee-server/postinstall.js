/**
 * Created by Matthias on 14.08.17.
 */
const fs = require('fs');

/**
 * delete standard node-opcua type declaration file -> module resolution will then use from @types
 */
intallUAdefinitions = function () {
  const uaTypingsTarget = './node_modules/node-opcua/node-opcua.d.ts';
  const uaTypingsSource = './@types/node-opcua/node-opcua.d.ts';

  if (fs.existsSync(uaTypingsSource)) {
    // Delete only if exists
    if (fs.existsSync(uaTypingsTarget)) {
      fs.unlinkSync(uaTypingsTarget, function (error) {
        if (error) {
          throw error;
        }
        console.log('Deleted default node-opcua type definition file!');
      });
    }
    // copy custom index file
    const txt = fs.readFileSync(uaTypingsSource, 'utf-8');
    fs.writeFileSync(uaTypingsTarget, txt);
    console.log('Installed custom node-opcua type definition file!');
  } else {
    'Custom node-opcua type definition file missing.'
  }
}


intallUAdefinitions();
