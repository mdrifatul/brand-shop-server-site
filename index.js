const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.80a5m0b.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const CarCollection = client.db("DriverBD").collection("cars") 
    const cartCollection = client.db("DriverBD").collection('carts')

    // read data
    app.get('/cars', async(req, res)=>{
      const cursor = CarCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    
    // create data
    app.post('/cars',async (req, res)=>{
      const newCars = req.body
      const result = await CarCollection.insertOne(newCars)
      res.send(result)
    })

     // get data by id
     app.get('/cars/:id', async(req, res) =>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await CarCollection.findOne(query)
      res.send(result)
    })

    // get data by brand name
    app.get('/car/:brandName', async(req, res) =>{
      const brandNames = req.params.brandName
      const query = {brand_name: brandNames}
      const cursor = CarCollection.find(query);
      const result = await cursor.toArray();
      res.send(result)
    })

    // update data
    app.put('/cars/:id', async(req, res) =>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updateCar = req.body;
      const car = {
        $set: {
          name:updateCar.name,
          brand_name:updateCar.brand_name,
          type:updateCar.type, 
          price:updateCar.price,
          description:updateCar.description,
          photo:updateCar.photo,
          rating:updateCar.rating
        },
      }
      const result = await CarCollection.updateOne(filter,car,options)
      res.send(result)
    })

    //add cart data
    app.post('/carts', async(req, res) =>{
      const addCart = req.body
      const result = await cartCollection.insertOne(addCart)
      res.send(result)
    })
    //read add cart
    app.get('/carts', async(req, res) =>{
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/carts/:id', async(req, res) =>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.findOne(query)
      res.send(result)
    })

    // delete from add cart
    app.delete('/carts/:id', async(req, res) =>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })
     


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', async(req, res)=>{
  res.send('Drive serve in running')
})
app.listen(port, () =>{
  console.log(`drive server in running on port : ${port}`);
})