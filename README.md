# About

REST API service for checking text for typos. Based on [yandex-speller](https://github.com/hcodes/yandex-speller)

## Request
`POST /check`
```
curl -v -F textFile=@test/text.txt  http://localhost:5000/check > result.txt
```

## Response

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/plain; charset=utf-8
Content-Length: 663
ETag: W/"297-I2OR12CIl4dSv0Ts5hZ8FLt9k/4"
Date: Mon, 14 Dec 2020 07:33:08 GMT
Connection: keep-alive

[663 bytes data]
```

## Supported file formats
txt (utf-8)

## Supported languages
RU, EN, UK

# Install

```
npm install
```

# Build

```
npm run build
```

# Run

```
npm run start
```

# Run the tests

```
npm run test
```
