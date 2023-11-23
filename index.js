const express = require('express');
const axios = require('axios');

const cors = require('cors')

const app = express();
const port = 6000;
app.use(cors({
    origin: 'http://localhost:3000',  
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
  }));

app.get('/v1/users', async (req, res) => {
    try {
        // Fetching user data
        const usersResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
        const users = usersResponse.data;

        // Fetching post data
        const postsResponse = await axios.get('https://jsonplaceholder.typicode.com/posts');
        const posts = postsResponse.data;

        // Combined users data and post data based on thier id and userId
        const combinedData = users.map(user => {
            const userPosts = posts.filter(post => post.userId === user.id);
            return { ...user, posts: userPosts };
        });

        // Filtering  results based on search input
        const searchText = req.query.searchText;
        if (searchText) {
            const filteredData = combinedData.filter(user =>
                user.name.toLowerCase().includes(searchText.toLowerCase())
            );
            res.json(filteredData);
        } else {
            res.json(combinedData);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
