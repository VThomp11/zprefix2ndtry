const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');
const knex = require('knex')(require('./knexfile.js')["development"])
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const authRoutes = require('./authRoutes.js');

app.use(express.json());
app.use('/auth', authRoutes);
app.use(cors());



app.post('/items', (req, res) => {
    const itemData = req.body;

    knex('store_table')
        .insert({
            id: itemData.id,
            name: itemData.name,
            type: itemData.type,
            price: itemData.price,
        })
        .returning('*')
        .into('store_table')
        .then((insertedItems) => {
            const insertedItem = insertedItems[0];
            res.json({ message: 'Item added successfully', item: insertedItem});
        })

});

app.listen(port, () => {
    console.log(`Your applciation is running on port ${port}`)
    })
    
    app.get('/', (req, res) => {
        res.send(`Your application is running`)
    });
    
    app.get('/items', (req, res) => {
        knex('store_table')
            .select('*')
            .then(items => {
                res.json(items);
            })
    })

    app.get('/items/:id', (req, res) => {
        var { id } = req.params;
        knex('store_table')
            .select('*')
            .where('id', id)
            .then(data => {
                res.json(data);
            })
    
    })

    app.delete('/items/:id', (req, res) => {
        let itemID = req.params.id;
    
        knex('store_table')
            .where('id', itemID)
            .del()
            .then(() => res.json({ message: 'Item deleted successfully' }))
    });
    
    app.patch('/items/:id', (req, res) => {
        let itemID = req.params.id;
        let newItem = req.body
    
        knex('store_table')
            .where('id', itemID)
            .update({
                'name': newItem.name,
                'price': newItem.price
            })
            // .then(() => {
            //     return knex('store_table').where('id', itemId).first();
            // })
            .then(() => res.json(newItem))
    });