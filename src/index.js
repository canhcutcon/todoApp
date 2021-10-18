const app = require('./app');
const port = process.env.PORT;

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is up on port ' + port)
});