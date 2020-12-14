# About

REST API service for checking text for typos. Based on [yandex-speller](https://github.com/hcodes/yandex-speller)

## Request
`POST /check`
```
curl -v -F textFile=@test/text.txt  http://localhost:5000/check > result.txt
```

```
По рзеузльаттам исследовадний одонго анлигского универтисета,
не имеет занчения,в каокм проякде рсапжоолены бкувы в солве.
Глаовне, чотбы правая и послнедняя бквуы блыи на мсете.
Остаьлыне бкувы мгоут селдовтаь в полонм беспордяке, все равно ткест читсется без пробелм.
Причионй эгото ялвятеся то,что мы не читаем каджую бкуву по отдльенотси, а все солво цлиеком.
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
```
По результатам исследований одного английского университета,
не имеет значения, в каком порядке расположены буквы в слове.
Главное, чтобы правая и последняя буквы были на месте.
Остальные буквы могут следовать в полном беспорядке, все равно текст читается без проблем.
Причиной этого является то, что мы не читаем каждую букву по отдельности, а все слово целиком.
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
npm test
```
