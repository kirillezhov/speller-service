import 'mocha';
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';

import server from '../src/index';

should();
chai.use(chaiHttp);

describe('Integration test', () => {
    describe('/POST check', () => {
        const expectedText = 'По результатам исследований одного английского университета, не имеет значения, в каком порядке расположены буквы в слове. Главное, чтобы правая и последняя буквы были на месте. Остальные буквы могут следовать в полном беспорядке, все равно текст читается без проблем. Причиной этого является то, что мы не читаем каждую букву по отдельности, а все слово целиком.';

        it('should return the correct text', (done) => {
            chai.request(server)
                .post('/check')
                .attach('textFile', './test/text.txt')
                .end((error, response) => {
                    response.text.should.equal(expectedText);

                    done();
                });
        });

        server.close();
    });
});
