var crypto = require('crypto');


class Cryptography {

    async hashPassword (rawPsw) {
        //generate salt
        let salt = await new Promise((resolve, reject) => {
            crypto.randomBytes(11, (err, buff)=>{
                if (err) {
                    reject(err)
                } else {
                    resolve(buff);
                }
            })
        });
        //hashing the password
        let hashed_psw = await new Promise((resolve, reject) => {
        crypto.pbkdf2(rawPsw, salt, 100000, 64, 'sha512', (err, derivedKey) => {
                if (err) {
                    reject(err)
                }
                resolve(derivedKey);   
              });
        });

         return { salt: salt, hashedPsw: hashed_psw };

    }
     /** the 'salt' ,the 'hashedTruePsw' - have been saved in DB later: it using for 
      * comparision between two hashes; the 'passowrd'- is from HTTP request */
    async validatePassword (password, salt, hashedTruePsw) {
           //hashing the password 
           let hashForComparision = await new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(derivedKey);  
                  });
            });
            //compare two hashes:
           return crypto.timingSafeEqual(hashForComparision, hashedTruePsw);

    }
}

module.exports = Cryptography;
 /*  //tests - no needs in production! 
process.stdin.on('data', function(data){
    go(data.toString());
})

async function go(test) {
    test = test.replace(/[\r\n]/gm, '');
    if(test === '$logoff'){
        process.exit();
    }
    let cr = new Cryptography();
let password, hashedPasswordAndSalt, hashForCompare;
password = 'cat';
hashedPasswordAndSalt = await cr.hashPassword(password);
console.log(`hash:${hashedPasswordAndSalt.hashedPsw.toString('hex')} /r/n salt: ${hashedPasswordAndSalt.salt.toString('hex')}`)
    if(await cr.validatePassword (test, hashedPasswordAndSalt.salt, hashedPasswordAndSalt.hashedPsw)) {
         console.log("\x1b[32m",'Correct!',"\x1b[0m")
    } else {
        console.log("\x1b[31m",'Wrong!',"\x1b[0m")
    }
}
*/

