class Database{
    constructor(mongodbClient){
        const databaseName = process.env.databaseName;
        const collectionName = process.env.collectionName;
        const username = process.env.name;
        const password = process.env.password;
        this.mongodbClient = mongodbClient;
        this.database = databaseName;
        this.connectionString = `mongodb+srv://${username}:${password}@cluster0.1ttwg.mongodb.net/${this.database}?retryWrites=true&w=majority`;
        this.collectionName = collectionName;
    }

    async createConnection(){
        const client = await this.mongodbClient.connect(this.connectionString,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        return client
    }

    async getDogs(userName){
        const user = await this.findUser(userName);
        if (user){
            return user.dogs;
        }else{
            return []
        }
    }

    async addUser(user){
        if (user == ''){
            return undefined;
        }
        let client = await this.createConnection()
        const db = client.db(this.database).collection(this.collectionName)
        const addedUser = await db.insertOne(user)
        client.close()
        return addedUser
    }

    async findUser(user){
        if (user == ''){
            return undefined;
        }
        let client = await this.createConnection()
        const db = client.db(this.database).collection(this.collectionName)
        const foundUser = await db.findOne({name: user})
        client.close()
        return foundUser
    }
    
    async addDog(user,dog){
        if (!dog){
            return undefined;
        }
        if (dog.dogName == ''){
            return undefined
        }
        let foundUser = await this.findUser(user)
        if (foundUser == null){
            await this.addUser({name: user, dogs: []})
            foundUser = await this.findUser(user)
        }
        let client = await this.createConnection()
        const db = client.db(this.database).collection(this.collectionName)
        let result = await db.updateOne({_id: foundUser._id},{$push: {dogs: dog}})
        client.close()
        return result
    }
    
    async deleteDog(username, dogName){
        if (dogName == ''){
            return undefined;
        }
        let user = await this.findUser(username)
        let client = await this.createConnection()
        const db = client.db(this.database).collection(this.collectionName)
        if (user != null){
            let result = await db.updateOne({_id: user._id}, {$pull: {dogs: {dogName: dogName}}})
            console.log(result)
            client.close()
            return result
        }
        client.close()
        return undefined
    }
    
    async updateDog(username,name,newDog){
        if (!newDog){
            return undefined;
        }
        let user = await this.findUser(username);
        let client = await this.createConnection();
        const db = client.db(this.database).collection(this.collectionName);
        if (user != null){
            let result = await db.updateOne(
                {
                    _id:user._id,
                    'dogs.dogName':name
                }
                ,{
                    $set: 
                    {
                        "dogs.$.dogName":newDog.dogName
                    }
                });
        }
        return true;
    }
}

export {
    Database
}