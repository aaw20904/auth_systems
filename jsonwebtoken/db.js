const mysql = require('mysql2'); //relative database mamnagement system - MySQL


class Rdbms {

    constructor(){
        this.connectionDB = null;
    }

    /*---
█▀▀ █▀█ █▄░█ █▄░█ █▀▀ █▀▀ ▀█▀   ▀█▀ █▀█   █▀▄▀█ █▄█ █▀ █▀█ █░░
█▄▄ █▄█ █░▀█ █░▀█ ██▄ █▄▄ ░█░   ░█░ █▄█   █░▀░█ ░█░ ▄█ ▀▀█ █▄▄ ---*/

    async init(opts={
        user: 'root',
        password: '65535258',
        host: 'localhost',
        database: 'myappbase',
    }) {
        let that = this;

          //// 1. Create MySQL Connection
          this.connectionDB  = mysql.createConnection(opts);
            /***try to connect */
      
            await new Promise((resolve, reject) => {
            
                this.connectionDB.connect((err)=> {
                    if (err) {
                        //handle an error
                    reject(err);
                    }
                    resolve();
                })
            });
        /***create table - when absent */
            await new Promise((resolve, reject) => {
                this.connectionDB.query("CREATE TABLE IF NOT EXISTS users (\
                 `userid` INT NOT NULL AUTO_INCREMENT,\
                 `username` VARCHAR(16) NULL,\
                 `hashed_psw` BLOB NULL,\
                 `salt` BLOB NULL,\
                 PRIMARY KEY (`userid`),\
                 UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE );",(err, rows)=>{
                      if(err) {
                        reject(err);
                      } else{
                       console.log('Table created!...')
                         resolve(rows);
                      }
                  })
            });

    }
/**
█▀▀ █░░ █▀█ █▀ █▀▀   █▀█ █▀▄ █▄▄ █▀▄▀█ █▀   █▀▀ █▀█ █▄░█ █▄░█ █▀▀ █▀▀ ▀█▀ █ █▀█ █▄░█
█▄▄ █▄▄ █▄█ ▄█ ██▄   █▀▄ █▄▀ █▄█ █░▀░█ ▄█   █▄▄ █▄█ █░▀█ █░▀█ ██▄ █▄▄ ░█░ █ █▄█ █░▀█
 */
    async  deinit() {
        await new Promise((resolve, reject) => {
            this.connectionDB.end((err)=>{
                if(err){
                    reject(err)
                }
                resolve(true)
            })
        });
       
    }


    /**
     * 
█▀▀ █▀█ █▀▀ ▄▀█ ▀█▀ █▀▀   █▄░█ █▀▀ █░█░█   █░█ █▀ █▀▀ █▀█
█▄▄ █▀▄ ██▄ █▀█ ░█░ ██▄   █░▀█ ██▄ ▀▄▀▄▀   █▄█ ▄█ ██▄ █▀▄
     */
    async addNewUser (name, hashedPassw, salt) {
        ///
    return  await  new Promise((resolve, reject) => {
            this.connectionDB.query('INSERT  INTO users (username, hashed_psw, salt) VALUES (?, ?, ?)',
             [ name, hashedPassw, salt ],
             (err,rows)=>{
                     if(err) {
                        console.log(JSON.stringify(err))
                        if(err.errno === 1062){
                            //when a user already  exists- set an error property
                            err.duplicateName = true;
                        }
                         reject(err);
                     } else{
                         resolve(rows);
                     }
             })
        });
        ///
    }
    /*-----
    
█▀█ █▀▀ ▄▀█ █▀▄
█▀▄ ██▄ █▀█ █▄▀
    ----*/
    async readUser (name) {
      return  await new Promise((resolve, reject) => {
           this.connectionDB.query(`SELECT username, userid, hashed_psw, salt FROM users WHERE username="${name}" `,
             (err,rows)=>{
                            if (err) {
                                reject(err);
                            } else{
                                if (rows.length === 0) {
                                    resolve (false);
                                }
                         
                                resolve(rows[0]);
                            }
             })
        });
    }

    /*---
    
█▀█ █▀▀ █▀▄▀█ █▀█ █░█ █▀▀
█▀▄ ██▄ █░▀░█ █▄█ ▀▄▀ ██▄
    ----- */
    async removeUser (name) {
      return  await new Promise((resolve, reject) => {
            this.connectionDB.query(`DELETE  FROM users WHERE username="${name}"`,
             (err,rows)=>{
                            if (err) {
                                reject(err);
                            } else{
                      
                                resolve(rows);
                            }
             })
        });
    }


}

let db;

async function main() {
    db = new Rdbms();
    await db.init();
}

main();


module.exports = db;