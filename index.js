const express = require('express')
const { MongoClient, ObjectId } = require('mongodb');
const objectId = require('mongodb').objectId;

require('dotenv').config()
const cors = require('cors');

const app = express()
const port = process.env.PORT || 5000


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uk5kj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);
async function run() {
    try {
      await client.connect();
      const database = client.db('e-commerce-1');
      const productsCollection = database.collection('products');
      const ordersCollection = database.collection('orders');
      const usersCollection = database.collection('users');
    
      app.get('/ok', (req, res)=>{
          res.send('ok got it e-com')
      })

    //   ALL PRODUCT SEND!
      app.post('/products', async (req, res)=>{
        const newProduct = req.body;
        const allProducts = await productsCollection.insertOne(newProduct);

        res.json(allProducts);
      });
    
    
      //   ALL orders SEND!
      app.post('/orders', async (req, res)=>{
        const newOrders = req.body;
        const allOrders = await ordersCollection.insertOne(newOrders);

        res.json(allOrders);
      });
      
      
      //   ALL users SEND!
      app.post('/users', async (req, res)=>{
        const users = req.body;
        const allUsers = await usersCollection.insertOne(users);

        res.json(allUsers);
      });

      app.put('/users', async (req, res) =>{
        const user = req.body;
        const filter = {email: user.email};
        const option = { upsert: true };
        const updateDoc = {$set: user};
        const result = await usersCollection.updateOne(filter, updateDoc, option);

        res.json(result);
      });

      // Admin update
      app.put('users/admin', async (req, res)=>{
        const user = req.body;
        const filter = {email: user.email};
        const updateDoc = {$set: {role: 'admin'}};
        const result = await usersCollection.updateOne(filter, updateDoc);

        res.json(result);
      });

      app.get('/users/:email', async (req, res) =>{
        const email = req.params.email;
        const query = { email:email };
        const user = await usersCollection.findOne(query);

        let isAdmin = false;
        if(user?.role === 'admin'){
          isAdmin = true;
        }
        res.json({ admin: isAdmin })
      });

    //   ALL PRODUCT get from database!
      app.get('/products', async (req, res)=>{
        const getProduct = productsCollection.find({});
        const getProducts = await getProduct.toArray();

        res.send(getProducts);
      });
    
      //   ALL ORDERS get from database!
      app.get('/orders', async (req, res)=>{
        const getOrder = ordersCollection.find({});
        const getOrders = await getOrder.toArray();

        res.send(getOrders);
      });

      //   ALL ORDERS get from database!
      app.get('/orders/:email', async (req, res)=>{
        const email = req.params.email;
        const query = {email: email};
        const cursor = ordersCollection.find(query);
        const myOrder = await cursor.toArray();

        res.send(myOrder);
      });
      
      //   ALL ORDERS get from database!
      app.get('/orders/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: objectId(id)};
        const product = await ordersCollection.findOne(query);

        res.json(product);
      });

    //   Get product one by one!
    app.get('/products/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const product = await productsCollection.findOne(query);
        res.json(product);
    });

    // USER!
    app.get('/users', async (req, res)=>{
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();

      res.send(users);
    })

      console.log('Database connected');
    } 
    finally {

    //   await client.close();
    }
  }

run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('E-Commerce ok')
})

app.listen(port, () => {
  console.log(`OK E-COMMERCE got`)
})