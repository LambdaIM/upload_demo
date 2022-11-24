## Lambda Storage Upload Demo

This demo shows how to upload file/folder to Lambda Storage.


## Installation

```bash
$ yarn install
```

## Run

```bash
//upload file
$ yarn upload-file

//upload folder
$ yarn upload-folder
```

## Response

* upload single file response
```json
{
  hash: 'QmPp83kuUQu3NNGd1FQsSMs5fCHhbyT2RgARSxZ9SvxMuz',
  url: 'https://lambda.im/lws/QmPp83kuUQu3NNGd1FQsSMs5fCHhbyT2RgARSxZ9SvxMuz',
  size: '38605',
  name: 'file-to-upload.png'
}
```

* upload folder response
```json
{
  hash: 'QmQsz27VuonHMqNnxzD4t5fVxRikWcboLUi4w1McZy9eg4',
  url: 'https://lambda.im/lws/QmQsz27VuonHMqNnxzD4t5fVxRikWcboLUi4w1McZy9eg4',
  name: '',
  size: '71511',
  files: [
    {
      Name: 'logo-dark.png',
      Hash: 'QmVXBfNspcyqU791zRBeMd13ApXGwWx9rLVyMoT6m65A3s',
      Size: '32787'
    },
    {
      Name: 'logo-light.png',
      Hash: 'QmPp83kuUQu3NNGd1FQsSMs5fCHhbyT2RgARSxZ9SvxMuz',
      Size: '38605'
    }
  ]
}
```
