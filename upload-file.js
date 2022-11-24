const LambdaStorage = require('./LambdaStorage');

const filePath = './data/file-to-upload.png';

const lambdaStorage = new LambdaStorage();

console.log(`Uploading ${filePath}...`);

lambdaStorage.upload(filePath).then((response) => {
    console.log(response);
}).catch((error) => {
    console.log(error);
});