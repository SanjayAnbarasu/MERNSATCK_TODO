//using express
const express = require('express');
const mongoose = require('mongoose');
const cors = require ('cors');
//create an instance of express
const app = express();
app.use(express.json())
app.use(cors())

//using mongo db hence it is not required
//sample in-memory storage
//let todos=[];
//sample how the working is done in todos backend is controlled via connection iof api and the configuratio9n of some regional api will be presen ted in the connection oriened framewolrks such as react andf express and anguular script


//connecting mongodb
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>console.log('connected to mongodb'))
.catch(err=>console.log(err))


//schema
const todoschema = new mongoose.Schema({
    title: {
        required : true,
        type: String
    },
    description:String
})


//creating model
const todoModel = mongoose.model('todo',todoschema);


//create a new todo item
app.post('/todos',async (req,res) => {
    const {title, description} =req.body;
   // const newTodo ={
        //id: todos.length +1,
       // title,
    //description
    //};
    //todos.push(newTodo);
    //console.log(todos);
try {
    const newTodo = new todoModel ({title,description});
    await  newTodo.save();
    res.status(201).json(newTodo);
} catch (error) {
    console.log(error)
    res.status(500).json({message:error.message});
}

})

//get all items
app.get('/todos', async(req,res) => {
    try {
        const todos =  await todoModel.find();
        res.json(todos);
    } catch(error){
        console.log(error)
        res.status(500).json({message:error.message});
    }
   // res.json(todos);
})
//update a todo item
app.put("/todos/:id", async(req,res) =>{
    try {
        const {title, description} =req.body;
    const id =  req.params.id;
    const updatetodo = await todoModel.findByIdAndUpdate(
        id,
        {title,description},
        {new:true}
    )
if(!updatetodo){
    return res.statusCode(404).json({message:"todo not found"})
}
res.json(updatetodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message});
    }
    
})

//delete a todo item
app.delete("/todos/:id", async(req,res) =>{
    try {
        const id =  req.params.id;
        const deletedtodo = await todoModel.findByIdAndDelete(id)
        if(!deletedtodo){
            return res.status(404).json({message:"todo not found"})
            }
            res.json({message:"todo deleted successfully"})
            } catch (error) {
                console.log(error)
                res.status(500).json({message:error.message});
                }
                })
            
//start the sever
const port = 8000;
app.listen(port,() => {
    console.log('Server is running on port '+port);
})