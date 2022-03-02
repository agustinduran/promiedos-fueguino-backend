const request = require('supertest');
const { app, server } = require('../../../index');
const User = require('../../users/models/user');

const api = request(app);

beforeEach(async () => {
    // FIXME: Warning with production database
    await User.destroy({where: {}});
    await User.create({
        username: "agustin",
        password: "$2a$10$k5C5nQxeDS3TSvD/Ya/rm.OWgdlaMTMeyc1So4JVUgLpQuiwvTObu", // 123456
        email: "agustineduran@gmail.com",
        name: "Agustín",
        surname: "Durán",
        phone: "2964547877"
    });
});

describe('POST /auth/register', () => {
    test('Register successful', async () => {
        const body = {
            "username": "vbuterin",
            "password": "123456",
            "password-confirmation": "123456",
            "name": "Vitalik",
            "surname": "Buterin",
            "email" : "vitalik-buterin@gmail.com",
            "phone" : "5349546546387"
        };
        const response = await 
            api.post('/auth/register')
               .send(body)
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/);
        expect(201);
        expect(response.body.success).toBeTruthy();
        expect(response.body.user).toBeDefined();
    });

    test('Register without body', async () => {
        const body = {};
        const response = await 
            api.post('/auth/register')
               .send(body)
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/);
        expect(400);
        expect(response.body.success).toBeFalsy();
    });

    test('Register without username', async () => {
        const body = {
            "password": "123456",
            "password-confirmation": "123456",
            "name": "Satoshi",
            "surname": "Nakamoto",
            "email" : "satoshi-nakamoto@gmail.com",
            "phone" : "5349219546548"
        };
        const response = await 
            api.post('/auth/register')
               .send(body)
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/);
        expect(400);
        expect(response.body.success).toBeFalsy();
    });

    test('Register without password', async () => {
        const body = {
            "username": "snakamoto",
            "password-confirmation": "123456",
            "name": "Satoshi",
            "surname": "Nakamoto",
            "email" : "satoshi-nakamoto@gmail.com",
            "phone" : "5349219546548"
        };
        const response = await 
            api.post('/auth/register')
               .send(body)
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/);
        expect(400);
        expect(response.body.success).toBeFalsy();
    });

    test('Register without password-confirmation', async () => {
        const body = {
            "username": "snakamoto",
            "password": "123456",
            "name": "Satoshi",
            "surname": "Nakamoto",
            "email" : "satoshi-nakamoto@gmail.com",
            "phone" : "5349219546548"
        };
        const response = await 
            api.post('/auth/register')
               .send(body)
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/);
        expect(400);
        expect(response.body.success).toBeFalsy();
    });

    test('Register with differents password and password-confirmation', async () => {
        const body = {
            "username": "snakamoto",
            "password": "123456",
            "password-confirmation": "789123",
            "name": "Satoshi",
            "surname": "Nakamoto",
            "email" : "satoshi-nakamoto@gmail.com",
            "phone" : "5349219546548"
        };
        const response = await 
            api.post('/auth/register')
               .send(body)
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/);
        expect(400);
        expect(response.body.success).toBeFalsy();
    });

    test('Register with passwords length less 6 characters', async () => {
        const body = {
            "username": "snakamoto",
            "password": "12345",
            "password-confirmation": "12345",
            "name": "Satoshi",
            "surname": "Nakamoto",
            "email" : "satoshi-nakamoto@gmail.com",
            "phone" : "5349219546548"
        };
        const response = await 
            api.post('/auth/register')
               .send(body)
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/);
        expect(400);
        expect(response.body.success).toBeFalsy();
    });

    test('Register with invalid email', async () => {
        const body = {
            "username": "snakamoto",
            "password": "123456",
            "password-confirmation": "123456",
            "name": "Satoshi",
            "surname": "Nakamoto",
            "email" : "satoshi-nakamoto",
            "phone" : "5349219546548"
        };
        const response = await 
            api.post('/auth/register')
               .send(body)
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/);
        expect(400);
        expect(response.body.success).toBeFalsy();
    });

    test('Register with a username busy', async () => {
        const body = {
            "username": "agustin",
            "password": "123456",
            "password-confirmation": "123456",
            "name": "Agustín",
            "surname": "Durán",
            "email" : "other-email@gmail.com",
            "phone" : "2964547877"
        };
        const response = await 
            api.post('/auth/register')
               .send(body)
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/);
        expect(400);
        expect(response.body.success).toBeFalsy();
    });

    test('Register with a email busy', async () => {
        const body = {
            "username": "other-username",
            "password": "123456",
            "password-confirmation": "123456",
            "name": "Agustín",
            "surname": "Durán",
            "email" : "agustineduran@gmail.com",
            "phone" : "2964547877"
        };
        const response = await 
            api.post('/auth/register')
               .send(body)
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/);
        expect(400);
        expect(response.body.success).toBeFalsy();
    });

});

describe('POST /auth/login', () => {
    test('Login by username successful', async () => {
        const body = {
            username: "agustin",
            password: "123456"
        };
        const response = await 
            api.post('/auth/login')
               .send(body)
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/);
        expect(201);
        expect(response.body.success).toBeTruthy();
        expect(response.body.token).toBeDefined();
    });

    test('Login by email successful', async () => {
        const body = {
            username: "agustineduran@gmail.com",
            password: "123456"
        };
        const response = await 
            api.post('/auth/login')
               .send(body)
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/);
        expect(201);
        expect(response.body.success).toBeTruthy();
        expect(response.body.token).toBeDefined();
    });

    test('Login with password wrong using username', async () => {
        const body = {
            username: "agustin",
            password: "123456789"
        };
        await api
            .post('/auth/login')
            .send(body)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ success: false, message: 'Credenciales inválidas' });
    });

    test('Login with password wrong using email', async () => {
        const body = {
            username: "agustineduran@gmail.com",
            password: "123456789"
        };
        await api
            .post('/auth/login')
            .send(body)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ success: false, message: 'Credenciales inválidas' });
    });

    test('Login with an username doesnt exists', async () => {
        const body = {
            username: "username-fake",
            password: "123456789"
        };
        await api
            .post('/auth/login')
            .send(body)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ success: false, message: 'Credenciales inválidas' });
    });

    test('Login with an email doesnt exists', async () => {
        const body = {
            username: "username-fake@gmail.com",
            password: "123456789"
        };
        await api
            .post('/auth/login')
            .send(body)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ success: false, message: 'Credenciales inválidas' });
    });

    test('Login without body', async () => {
        const body = {};
        const response = await 
            api.post('/auth/login')
               .send(body)
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/);
        expect(400)
        expect(response.body.success).toBeFalsy();
        expect(response.body.errors).toBeDefined();
    });

    test('Login without username', async () => {
        const body = {
            password: "123456789"
        };
        const response = await 
            api.post('/auth/login')
               .send(body)
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/);
        expect(400)
        expect(response.body.success).toBeFalsy();
        expect(response.body.errors).toBeDefined();
    });

    test('Login without password', async () => {
        const body = {
            username: "agustin"
        };
        const response = await 
            api.post('/auth/login')
               .send(body)
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/);
        expect(400)
        expect(response.body.success).toBeFalsy();
        expect(response.body.errors).toBeDefined();
    });

    test('Login with username empty', async () => {
        const body = {
            username: "",
            password: "123456789"
        };
        const response = await 
            api.post('/auth/login')
               .send(body)
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/);
        expect(400)
        expect(response.body.success).toBeFalsy();
        expect(response.body.errors).toBeDefined();
    });

    test('Login with password empty', async () => {
        const body = {
            username: "agustin",
            password: ""
        };
        const response = await 
            api.post('/auth/login')
               .send(body)
               .set('Accept', 'application/json')
               .expect('Content-Type', /json/);
        expect(400)
        expect(response.body.success).toBeFalsy();
        expect(response.body.errors).toBeDefined();
    });

    // TODO: LOGIN WITH SQL INJECT

});

afterAll(() => {
    server.close();
});