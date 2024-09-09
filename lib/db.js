var mysql= require('mysql');

var connection=mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'',
    database:'p4n'
});
connection.connect(function(error){
    if(!error){
        console.log(error);
    } else {
        console.log('Database connected!!!')
    }
});

module.exports=connection;