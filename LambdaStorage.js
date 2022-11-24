var fs = require('fs');
const path = require('path');
const axios = require('axios');
axios.interceptors.request.use(request => {
    request.maxContentLength = Infinity;
    request.maxBodyLength = Infinity;
    return request;
});

const FormData = require('form-data');

class LambdaStorage {

    constructor(options = {}) {
		this.uploadSingleURI = options.uploadSingleURI || 'https://lambda.im/upload/api/v0/add';
        this.uploadBatchURI = options.uploadBatchURI || 'https://lambda.im/upload/api/v0/add?recursive=true&wrap-with-directory=true&pin=true';
		this.lambdaGateway = options.lambdaGateway || 'https://lambda.im/lws/';
	}

    async prepareDirectory(dirPath,formData,stripTLD = true){
        
        var dirLTD = null;
        if(stripTLD && !dirLTD){
            dirLTD = dirPath;
            dirLTD = dirLTD.replace(/^\.\/|\/$/g, '');
            dirLTD = dirLTD.replace(/\/$/, '');
        }

        const filteredFilesAndDirectoriesRegExp = /(?:__MACOSX)|(?:\.DS_Store)|(^\.)/;

        async function _prepareDirectory(dirPath,formData,dirLTD,stripTLD){
            let files = await fs.promises.readdir(dirPath);
            let i = 0;
            for (let file of files) {

                if (filteredFilesAndDirectoriesRegExp.test(file)) {
                    continue;
                }

                let filePath = path.join(dirPath, file);
                
                let stat = await fs.promises.stat(filePath).catch(error =>{
                    throw error;
                });

                let stripedPath = filePath.replace(dirLTD + "/",'');
                if (stat.isFile()) {
                    var fileStream = fs.createReadStream(filePath);
                    formData.append(`file-${i}`, fileStream,{
                        filepath: stripedPath,
                        contentType: 'application/octet-stream',
                        knownLength: stat.size
                    });
                } else {
                    await _prepareDirectory(filePath,formData,dirLTD,stripTLD);
                }
                i++;
            }
        }
        
        await _prepareDirectory(dirPath,formData,dirLTD,stripTLD);
    }

    async upload(filePath,stripLTD=true) {

        const stats = await new Promise((accept, reject) => {
            fs.lstat(filePath, (err, stats) => {
              if (!err) {
                accept(stats);
              } else {
                reject(err);
              }
            });
        });
    
        if (stats.isFile()) {
            const formData = new FormData();
            formData.append('file', fs.createReadStream(filePath));
            const response = await axios.post(this.uploadSingleURI, formData, {headers: {
                'Content-Type': 'multipart/form-data','accept-Encoding': 'deflate'}}).catch(error =>{
                throw error;
            });
            
            //gzip
        
            var hash = response.data.Hash;
            return {hash:hash,url:this.lambdaGateway + hash,size:response.data.Size,name:response.data.Name};
        }  else {
            const formData = new FormData();
            await this.prepareDirectory(filePath,formData,stripLTD);
          
            const response = await axios.post(this.uploadBatchURI, formData, {headers: {'Content-Type': 'multipart/form-data','accept-Encoding': 'deflate'}}).catch(error =>{
                throw error;
            });
    
            let data = response.data.replace(/}/g, '},');
            let handledString = '[' + data.slice(0, data.length - 2) + ']';
            let files = JSON.parse(handledString);
            var dirResp = files.find(file => file.Name === '');
            var dirHash = dirResp.Hash;
            files = files.filter(file => file.Name !== '');
            var uploadResp = {hash:dirHash,url:this.lambdaGateway + dirHash,name:'',size:dirResp.Size,files:files};
            return uploadResp;
        }
    }
}

module.exports = LambdaStorage;