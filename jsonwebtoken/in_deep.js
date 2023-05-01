/// https://www.telerik.com/blogs/json-web-token-jwt-implementation-using-nodejs
/**I M P O R T A N T !*/
 /***!!! this function is ONLY FOR example - for learning,
 it ISN`T using in any part of the application****/
const crypto = require ('crypto');
/**1 Convert a string to Base64: */
const toBase64 = obj => {
    // converts the obj to a string
    const str = JSON.stringify (obj);
    // returns string converted to base64
    return Buffer.from(str).toString ('base64');
 };

 /**2 Replace special symbols in a Base64 string: */
 const replaceSpecialChars = b64string => {
    /* create a regex to match any of
     the characters =,+ or / and replace 
     them with their // substitutes */
      return b64string.replace (/[=+/]/g, charToBeReplaced => {
        switch (charToBeReplaced) {
          case '=':
            return '';
          case '+':
            return '-';
          case '/':
            return '_';
        }
      });
    };
    

    /****STEP1: generating header */

    // suppose we have this header
const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const b64Header = toBase64 (header);
const jwtB64Header = replaceSpecialChars(b64Header);
console.log ("the header is: ","\x1b[31m", jwtB64Header, "\x1b[0m"); 

/**Step 2: Generating the Payload */
// a sample payload 
const payload = {
    iss: 'a_random_server_name',//information about the server that issued the token
    exp: Date.now() + (60000 *15),// tokens expiry date in milliseconds (15 minutes in this case)
    // information about some random user
    name: 'John Bobo',
    email: 'myemail@test.com',
    isHuman: true,
  };

  const b64Payload = toBase64 (payload);
  const jwtB64Payload = replaceSpecialChars (b64Payload);
  console.log( `The payload is:`,"\x1b[32m", jwtB64Payload, "\x1b[0m");

  /***************Step 3: Generating the Signature***************/


  const createSignature =(jwtB64Header, jwtB64Payload, secret)=>{
    // create a HMAC(hash based message authentication code) using sha256 hashing alg
        let signature = crypto.createHmac ('sha256', secret);
    
    // use the update method to hash a string formed from our jwtB64Header a period and 
    //jwtB64Payload 
        signature.update (jwtB64Header + '.' + jwtB64Payload);
    
    //signature needs to be converted to base64 to make it usable
        signature = signature.digest ('base64');
    
    //of course we need to clean the base64 string of URL special characters
        signature = replaceSpecialChars (signature);
        return signature
    }
     ///
    const secret = crypto.randomBytes(128).toString('hex');

    const signature = createSignature(jwtB64Header,jwtB64Payload, secret);
    console.log('signature is:',"\x1b[34m",signature,"\x1b[0m");

    //we now combine the results of the header,payload and signatue
const jsonWebToken = jwtB64Header + '.' + jwtB64Payload + '.' + signature;
console.log ("the JWT is :",jsonWebToken);
console.log('The secret is:',"\x1b[32m", secret, "\x1b[0m");


/**********D E C O D I N G*********** */
/** 1) split JWT into three parts: */
let enc2Parts = jsonWebToken.split('.');

 /**2 Replace special symbols in a Base64 string: */
 const restoreSpecialChars = b64string => {
    /* create a regex to match any of
     the characters =,+ or / and replace 
     them with their // substitutes */
      return b64string.replace (/[-_\u2205]/g, charToBeReplaced => {
            switch (charToBeReplaced) {
                case '':
                    return '=';
                case '-':
                    return '+';
                case '_':
                    return '/';
            }
      });
    };
/**2)Converting into the original Base64 strings - replace special characters:  */
let restoredHeader = restoreSpecialChars(enc2Parts[0]); 
let restoredPayload = restoreSpecialChars(enc2Parts[1]);
let restoredSign = restoreSpecialChars(enc2Parts[2]);
/***3) Restore the header, the payload to the original objects */
 let header2 = Buffer.from(restoredHeader,'Base64').toString('utf8');
 let payload2 = Buffer.from(restoredPayload, 'Base64').toString('utf8');
 /*****A function for validate a digital signature  */
    /**header,payload,signature - are in Base64 with REPLACED characters -i.e. from the RAW JWT:  */
function verifySignature(jwtB64Header, jwtB64Payload, jwtB64Signature, shared_secret) {
    ///replace special characters in signature - restore the one:
    let tokenSign = restoreSpecialChars(jwtB64Signature); 
    //create HMAC
	var hmac = crypto.createHmac('sha256', shared_secret);
	hmac.write(jwtB64Header + '.' + jwtB64Payload);
	hmac.end()
	var sig = hmac.read();
    // Compare buffers in constant time
    return crypto.timingSafeEqual( sig,  Buffer.from(tokenSign, 'base64'));
}

 console.log('header - >:',header2);
 console.log('payload - >:',payload2);
 console.log('sign - >:',restoredSign);
console.log('verification:', verifySignature(restoredHeader,restoredPayload, restoredSign, secret));
