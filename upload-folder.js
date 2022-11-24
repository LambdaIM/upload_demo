const LambdaStorage = require('./LambdaStorage');

const folderPath = './data/folder-to-upload/';

const lambdaStorage = new LambdaStorage();

console.log(`Uploading folder ${folderPath}...`);

lambdaStorage.upload(folderPath,true).then((response) => {
    console.log(response);
}).catch((error) => {
    console.log(error);
});