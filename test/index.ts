import 'mocha';
import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

import server from '../src/index';

should();
chai.use(chaiHttp);

describe('Integration test', () => {
    describe('/POST check', () => {
        it('should return the correct text', (done) => {
            chai.request(server)
                .post('/check')
                .attach('textFile', './test/data/text.txt')
                .end((error, response) => {
                    const expectedText = 'По результатам исследований одного английского университета, не имеет значения, в каком порядке расположены буквы в слове. Главное, чтобы правая и последняя буквы были на месте. Остальные буквы могут следовать в полном беспорядке, все равно текст читается без проблем. Причиной этого является то, что мы не читаем каждую букву по отдельности, а все слово целиком.';

                    response.status.should.be.equal(StatusCodes.OK);
                    response.text.should.be.equal(expectedText);

                    done();
                });
        });

        it('should return multer error', (done) => {
            chai.request(server)
                .post('/check')
                .attach('textFile2', './test/data/text.txt')
                .end((error, response) => {
                    response.status.should.be.equal(StatusCodes.INTERNAL_SERVER_ERROR);
                    response.text.should.be.equal('Unexpected field');
                });

            chai.request(server)
                .post('/check')
                .attach('textFile2', './test/data/text.txt')
                .attach('textFile', './test/data/text.txt')
                .end((error, response) => {
                    response.status.should.be.equal(StatusCodes.INTERNAL_SERVER_ERROR);
                    response.text.should.be.equal('Unexpected field');

                    done();
                });
        });

        it('should return error for sending unsupported file', (done) => {
            chai.request(server)
                .post('/check')
                .attach('textFile', './test/data/text.docx')
                .end((error, response) => {
                    response.status.should.be.equal(StatusCodes.UNSUPPORTED_MEDIA_TYPE);
                    response.text.should.be.equal(ReasonPhrases.UNSUPPORTED_MEDIA_TYPE);

                    done();
                });
        });

        server.close();
    });
});
