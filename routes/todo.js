var express = require('express');
var router = express.Router();
var app = express()
var db = require('../db');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
  app.get('/', function(req, res, next) {
    // Handle the get for this route
  });
  
  app.post('/', function(req, res, next) {
   // Handle the post for this route
  });

//Get All To-do's
router.get('/',(req,res)=>{
    db.query('SELECT * FROM tasks',(err,result)=>{
        if(err){
            console.error(err);
            return res.status(400).json({success: false, data: err});
        };

        return res.json(result.rows);
    });
});

//Get To-do by ID
router.get('/:id',(req,res)=>{
    var { id } = req.params;
    db.query('SELECT * FROM tasks WHERE id = $1',[id],(err,result)=>{
        if(err){
            console.error(err);
            return res.status(400).json({success: false, data: err});
        };
        
        return result.rows.length ?
            res.json({success: true, data: result.rows})
            :
            res.status(404).json({success:false,data: 'Couldnt find any matched relations with the id '+ id +'.'})
    });
});

//Post new to-do
router.post('/',(req,res)=>{
    
    var data = {
        title: req.body.title,
        content: req.body.content,
        checked: false,
        createdat: new Date()
    }
    
    if (data.title == '') data.title = 'Untitled'
    if (data.content == '') data.content = 'Empty'

    db.query('INSERT INTO tasks(title,content,createdat,checked) VALUES($1,$2,$3,$4)',[data.title,data.content,data.createdat,data.checked],(err,result)=>{
        if(err){
            console.error(err);
            return res.status(400).json({success: false,data: err});
            };

        return res.status(201).send({message: 'Created'});   
    });
});

//Delete Todo
router.delete('/:id',(req,res) => {
    let { id } = req.params
    db.query('DELETE FROM tasks WHERE tasks.id = $1',[id],(err, result) => {
        if (err) return res.status(400).json({success: false,data: err})
        console.log(result)
        return res.status(204).send({message: 'Deleted'})
    })
})

//Toggle Todo
router.post('/toggle/:id',(req,res) => {
    let { id } = req.params
    console.log(id)
    db.query('UPDATE tasks SET checked = NOT checked WHERE id = $1',[id],(err, result) => {
        if(err) {
            console.log(err)
            return res.status(400).send({success: false, data: err})
        }
        return res.status(200).send({message: 'OK'})
    })
})

//Exports
module.exports = router;