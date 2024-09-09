var express=require('express');
var router=express.Router();
var dbconn=require('../lib/db');

//https://codeswithpankaj.medium.com/node-js-crud-with-mysql-f605755e9fcb -- Reference url

// display user page 

router.get('/', function(req,res,next){
    
    dbconn.query('select * from users order by id desc', function(err,rows){
        if(err){
            req.flash('error',err);
            // render to view/users/index.ejs
            res.render('users',{data:''});
        } else {
            

            // render to view/users/index.ejs
            res.render('users',{data:rows});
        }
    });
});

// display add user page

router.get('/add',function(req,res,next){
    //render add.ejs

    res.render('users/add',{
        name:'',
        email:'',
        position:''
    })

})

router.post('/add',function(req,res,next){

    let name=req.body.name;
    let email=req.body.email;
    let position=req.body.position;

    let errors=false;
    if(name.length === 0 || email.length === 0 || position.length === 0){
        errors=true;

        // set flash message

        req.flash('error',"Please enter name, email and Position");
        // render to add.ejs with flash message

        res.render('users/add',{
            name:name,
            email:email,
            position:position
        })
    }

    /// if no error

    if(!errors) {
        var form_data = {
            name:name,
            email:email,
            position:position
        }

        // isnert query
        dbconn.query('insert into  users set ?', form_data, function(err, result){
            //if error
            if(err){
                req.flash('error',err)
                // render to add.ejs

                res.render('users/add',{
                    name:form_data.name,
                    email:form_data.email,
                    position:form_data.position
                })
            } else {
                req.flash('success',' User Successfully added');
                res.redirect('/users');
            }
            
        })
    }

});

// User Edit

// display edit user page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbconn.query('SELECT * FROM users WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('/users')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('users/edit', {
                title: 'Edit User', 
                id: rows[0].id,
                name: rows[0].name,
                email: rows[0].email,
                position: rows[0].position
            })
        }
    })
})

// update user data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let email = req.body.email;
    let position = req.body.position;
    let errors = false;

    if(name.length === 0 || email.length === 0 || position.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter name and email and position");
        // render to add.ejs with flash message
        res.render('users/edit', {
            id: req.params.id,
            name: name,
            email: email,
            position:position
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            name: name,
            email: email,
            position:position
        }
        // update query
        dbconn.query('UPDATE users SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('users/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    email: form_data.email,
                    position: form_data.position
                })
            } else {
                req.flash('success', 'User successfully updated');
                res.redirect('/users');
            }
        })
    }
})

// delete user

router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbconn.query('DELETE FROM users WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to user page
            res.redirect('/users')
        } else {
            // set flash message
            req.flash('success', 'User successfully deleted! ID = ' + id)
            // redirect to user page
            res.redirect('/users')
        }
    })
})
module.exports = router;