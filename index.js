import express from 'express'
import mongodb from 'mongodb'
import { Database } from './db.js'
import bodyparser from 'body-parser'
import cors from 'cors'
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
    res.send(dogs)
})

app.post("/api/insert", async (req,res) =>{
    let body = req.body
    let dog = body.dog
    let user = body.username
    let insertedDog = await db.addDog(user,dog)
    res.send(insertedDog)
})

app.put("/api/update", async (req,res)=>{
    let body = req.body
    let dog = body.dog
    let user = body.username
    let updatedDog = await db.updateDog(user, dog.id, dog)
    res.send(updatedDog)
})

app.delete("/api/delete", async (req,res) =>{
    let body = req.body
    let user = body.username
    let dogId = body.dogid
    let result = await db.deleteDog(user,dogId)
    res.send(result)
})

