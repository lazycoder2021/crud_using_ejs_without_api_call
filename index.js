const express = require('express'); 
const app = express(); 
const { MongoClient } = require('mongodb'); 
var ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser'); 

app.use(bodyParser()); 
app.set('view engine', 'ejs'); 

const uri = 'mongodb://localhost:27017/wrestlersDB';
const client = new MongoClient(uri);

async function connectDB() {
    await client.connect(); 
    console.log('db connected...')
}

connectDB();

app.get('/', async function (req, res) {
    try {
        let list = [];
        client.connect()
        const database = await client.db('wrestlers');
        const response = await database.collection('wcw').find({});
        await response.forEach((res) => {
            console.log(res)
            list.push(res);
        })

        //res.status(200).json({ "msg": "fetch successful", list })

        res.render('index.ejs', { list: list })

    } catch (e) {
        console.log(e)
    }
})

app.post('/createWrestler', async function (req, res) {
    try {
        client.connect()
        const database = await client.db('wrestlers');
        const wcw = await database.collection('wcw'); 
        const response = await wcw.insertOne({
            name: req.body.name, 
            age: req.body.email, 
        })
        console.log(response)
        res.send('insert successful')
        client.close()

    } catch (e) {
        console.log(e)
    }
})

app.post('/deleteWrestler', async function (req, res) {
    try {
        console.log(req.body.userId)
        client.connect()
        const database = await client.db('wrestlers');
        const wcw = await database.collection('wcw');
        const covertingStringToObjectId = new ObjectId(req.body.userId);
        const response = await wcw.deleteOne({ _id: covertingStringToObjectId})
        console.log(response)
        res.send('delete successful')
        client.close()
        
        
    } catch (e) {
        console.log(e)
    }
})

app.post('/updateWrestler', async function (req, res) {
    try {
        console.log(req.body)
        
        client.connect()
        const database = await client.db('wrestlers');
        const wcw = await database.collection('wcw');
        const covertingStringToObjectId = new ObjectId(req.body.userId);
        const response = await wcw.updateOne({ _id: covertingStringToObjectId }, { $set: { name: req.body.name, age:req.body.age } })
        
        console.log(response)

        res.send('record updated successfully')
        client.close()


    } catch (e) {
        console.log(e)
    }
})

app.get('/:id', async function (req, res) {
    try {
        //console.log(req.params.id)
        let string = req.params.id; 
        string = string.slice(3); 
        client.connect()
        const database = await client.db('wrestlers');
        const wcw = await database.collection('wcw');
        const covertingStringToObjectId = new ObjectId(string);
        //console.log(covertingStringToObjectId)

        const response = await wcw.findOne({ _id: covertingStringToObjectId })
        console.log(response)
        
        res.render('data.ejs', { user: response })
    } catch (e) {
        console.log(e)
    }
})






app.listen('3000', function () {
    console.log('server up and running....')
})
