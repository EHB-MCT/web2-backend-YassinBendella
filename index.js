import express from 'express'
import mongodb from 'mongodb'
import { Database } from './db.js'
import bodyparser from 'body-parser'
import cors from 'cors'
import { config } from 'dotenv'
config();
const app = express()
const port = process.env.PORT || 9000
const db = new Database(mongodb.MongoClient)
app.use(bodyparser.json())
app.use(cors())

app.listen(port, async ()=>{
    console.log(`Backend is running on port ${port}`)
})

app.get("/",(req,res)=>{
    res.send("backend api")
})

app.get("/api/dogs/:user", async (req,res)=>{
    let user = req.params.user
    let dogs = await db.getDogs(user)
    if (dogs){
        res.send(dogs)
    }else{
        res.status(400).send("invalid request, username is empty")
    }
})

app.post("/api/insert", async (req,res) =>{
    console.log("inserting")
    console.log(req.body)
    let body = req.body
    let dog = body.dog
    console.log(dog);
    let user = body.username
    console.log(user);
    let insertedDog = await db.addDog(user,dog)
    if (insertedDog){
        res.send(insertedDog)
    }else{
        res.status(400).send("invalid request, dog is undefined, or dog has no name")
    }
})

app.put("/api/update", async (req,res)=>{
    let body = req.body
    let dog = body.dog
    let user = body.username
    let oldname = body.oldname;
    let updatedDog = await db.updateDog(user, oldname, dog)
    console.log(updatedDog);
    if (updatedDog){
        res.send(updatedDog)
    }else{
        res.status(400).send("invalid request, newdog is undefined")
    }
})

app.delete("/api/delete", async (req,res) =>{
    let body = req.body
    let user = body.username
    let dogName = body.dogname
    let result = await db.deleteDog(user,dogName)
    if (result){
        res.send(result);
    }else{
        res.status(400).send("invalid request, dogname is empty")
    }
})

