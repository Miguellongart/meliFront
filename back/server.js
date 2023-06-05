const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const getCategory = require('./utils/getCategory');

const apiUrl = process.env.API_URL;

const app = express();
const PORT = 3000;

// Aplicar CORS
app.use(cors());

app.get('/', async (req, res) => {
    res.status(200).json('hola bienvenidos');
});

app.get('/api/items', async (req, res) => {
    try {
        const query = req.query.q;
        const response = await axios.get(`${apiUrl}sites/MLA/search?q=${query}`);
        const data = response.data;
        console.log(data.filters)

        const author = {
            name: 'Miguel',
            lastname: 'Longart'
        };
    
        const categories = getCategory(data);
    
        const items = data.results.map(item => ({
            id: item.id,
            title: item.title,
            price: {
                currency: item.currency_id,
                amount: Math.floor(item.price),
                decimals: Math.round((item.price % 1) * 100)
            },
            picture: item.thumbnail,
            condition: item.condition,
            free_shipping: item.shipping.free_shipping,
            address: item.address.state_name
        }));
    
        const responseObj = {
            author,
            categories,
            items
        };
        res.json(responseObj);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ha ocurrido un error en el servidor.' });
    }
});

app.get('/api/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;

        const itemResponse = await axios.get(`${apiUrl}items/${itemId}`);
        const descriptionResponse = await axios.get(`${apiUrl}items/${itemId}/description`);

        const itemData = itemResponse.data;
        const descriptionData = descriptionResponse.data;
        
        const author = {
            name: 'Miguel',
            lastname: 'Longart'
        };

        const item = {
            id: itemData.id,
            title: itemData.title,
            price: {
                currency: itemData.currency_id,
                amount: Math.floor(itemData.price),
                decimals: Math.round((itemData.price % 1) * 100)
            },
            picture: itemData.thumbnail,
            condition: itemData.condition,
            free_shipping: itemData.shipping.free_shipping,
            sold_quantity: itemData.sold_quantity,
            description: descriptionData.plain_text
        };

        const responseObj = {
            author,
            item
        };

        res.json(responseObj);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ha ocurrido un error en el servidor.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
