const app = require('../index');
const supertest = require('supertest');
const request = supertest(app);
const mongoose = require('mongoose');
let connect;
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJpdHZpejUwNEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InNvbnVrNTA0IiwiaXNBZG1pbiI6dHJ1ZSwiaWQiOiI2MDQzMjFiODIwN2IzMDIzNTg5NTkwN2MiLCJkb2IiOiIxOTk3LTEwLTIzVDAwOjAwOjAwLjAwMFoiLCJpYXQiOjE2MTUxODU5NDR9.J9fXcSid3KIS-pQmIfOraCJvz9PaRO_vw-2-BbhLPto'
let userId;
const Users = require('../models/schema/user');

beforeAll(async () =>{
    const url = 'mongodb://localhost:27017/test';
    let connection = await mongoose.connect(url,{ useNewUrlParser: true });
    connect = mongoose.connection;
})

afterAll(async () => {
    await connect.dropDatabase();
    await mongoose.connection.close()
  })

describe('User Signup APIs', () => {
    it('200 on Successful User Signup', async (done) =>{
        const res = await request.post('/users/register')
        .send({
            firstName:"Ritviz",
            lastName:"Bro",
            userName:"ritvizz",
            password:"ritviz504504@",
            email:"sonuk504@gmaill.com",
            dob:"1997-10-23"
        })
        console.log(res.status);
        expect(res.status).toBe(200);
        done();
    })

    it('200 on Successful User Signup', async (done) =>{
        const res = await request.post('/users/register')
        .send({
            firstName:"Colt",
            lastName:"Steele",
            userName:"colt123",
            password:"colt@123",
            email:"steele@rediff.com",
            dob:"1997-10-23"
        })
        console.log(res.status);
        let user = await Users.find({firstName:"Colt"}).exec();
        userId = user[0]._id;
        expect(res.status).toBe(200);
        done();
    })

    it('409 on User Signup Again with same name or email', async (done) =>{
        const res = await request.post('/users/register')
        .send({
            firstName:"Ritviz",
            lastName:"Bro",
            userName:"ritvizz",
            password:"ritviz504504@",
            email:"sonuk504@gmaill.com",
            isAdmin:"true",
            dob:"1997-10-23"
        })
        console.log(res.status);
        expect(res.status).toBe(409);
        done();
    })


    it('200 on successful login', async (done) =>{
        const res = await request.post('/users/login')
        .send({
        
            userName:"ritvizz",
            password:"ritviz504504@",
            
        })
        console.log(res.status);
        expect(res.status).toBe(200);
        done();
    })

    it('200 on successful make admin request', async (done) =>{
        const res = await request.post(`/users/${userId}/makeAdmin`)
        .send()
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        expect(res.status).toBe(200);
        done();
    })

    it('400 on successful make admin request', async (done) =>{
        const res = await request.post(`/users/${userId}/makeAdmin`)
        .send()
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        expect(res.status).toBe(400);
        done();
    })

    it('200 on get amount spent in last 100 days', async (done) =>{
        const res = await request.get(`/users/${userId}/amount`)
        .send()
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        expect(res.status).toBe(200);
        done();
    })

    it('200 on get books rented by user', async (done) =>{
        const res = await request.get(`/users/${userId}/books`)
        .send()
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        expect(res.status).toBe(200);
        done();
    })
})
