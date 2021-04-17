/* eslint-disable */
const app = require('../index');
const supertest = require('supertest');
const request = supertest(app);
const mongoose = require('mongoose');
let bookCollection = require('../models/schema/book');
let connect;
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJpdHZpejUwNEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InNvbnVrNTA0IiwiaXNBZG1pbiI6dHJ1ZSwiaWQiOiI2MDQzMjFiODIwN2IzMDIzNTg5NTkwN2MiLCJkb2IiOiIxOTk3LTEwLTIzVDAwOjAwOjAwLjAwMFoiLCJpYXQiOjE2MTUxODU5NDR9.J9fXcSid3KIS-pQmIfOraCJvz9PaRO_vw-2-BbhLPto'
let bookId;




beforeAll(async () =>{
    const url = 'mongodb://localhost:27017/test';
    let connection = await mongoose.connect(url,{ useNewUrlParser: true });
    connect = mongoose.connection;
})

afterAll(async () => {
    await connect.dropDatabase();
    await mongoose.connection.close()
  })

// before(function(done) {
//     request
//       .post('/users/login')
//       .send({ userName:"ritvizz",password:"ritviz504504@",})new'

describe('Book APIs', () => {
    // beforeAll(async (done) => {
    //     request
    //       .post('/users/login')
    //       .send({ userName:"ritvizz",password:"ritviz504504@",})
    //       .end(function(err, res) {
    //         token = res.body.data.token; // Or something
    //         done();
    //       });
    // })

    it('200 on Adding new book', async (done) =>{
        const res = await request.post('/books/new')
        .send({
            title:"The Ultimate Gift",
            copies:"3",
            author:{"fName":"Robinn","lName":"Sharma"},
            price:"399",
            genre:"Educational",
            minAgeCategory:"13"
        })
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        let book = await bookCollection.find({});
        bookId = book[0]._id;

        expect(res.status).toBe(200);
        done();
    })

    it('409 on Adding existing book', async (done) =>{
        const res = await request.post('/books/new')
        .send({
            title:"The Ultimate Gift",
            copies:"3",
            author:{"fName":"Robinn","lName":"Sharma"},
            price:"399",
            genre:"Educational",
            minAgeCategory:"13"
        })
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        expect(res.status).toBe(409);
        done();
    })

    it('200 issuing a book', async (done) =>{
        const res = await request.post(`/books/${bookId}/issue`)
        .send()
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        expect(res.status).toBe(200);
        done();
    })

    it('200 on getting book by genre', async (done) =>{
        const res = await request.get('/books?genre=Educational')
        .send()
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        expect(res.status).toBe(200);
        done();
    })

    it('200 on getting count of all books', async (done) =>{
        const res = await request.get('/books/all')
        .send()
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        expect(res.status).toBe(200);
        done();
    })

    it('200 on getting count of all rented books', async (done) =>{
        const res = await request.get('/books/rented')
        .send()
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        expect(res.status).toBe(200);
        done();
    })

    it('200 on getting number of days after which book can be rented', async (done) =>{
        const res = await request.get(`/books/${bookId}/days`)
        .send()
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        expect(res.status).toBe(200);
        done();
    })

    it('400 on getting number of days after which book can be rented for incorrect bookID', async (done) =>{
        const res = await request.get(`/books/${bookId+1}/days`)
        .send()
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        expect(res.status).toBe(400);
        done();
    })

    it('200 on getting books by author name', async (done) =>{
        const res = await request.get('/books/author?author=Robinn Sharma')
        .send()
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        expect(res.status).toBe(200);
        done();
    })

    it('404 on getting books by wrong author name', async (done) =>{
        const res = await request.get('/books/author?author=Robert Steele')
        .send()
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        expect(res.status).toBe(404);
        done();
    })

    it('200 on getting books by author name pattern', async (done) =>{
        const res = await request.get('/books/authorName?pattern=Robin')
        .send()
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        expect(res.status).toBe(200);
        done();
    })

    it('404 on getting books by wrong author name pattern', async (done) =>{
        const res = await request.get('/books/authorName?pattern=Albert')
        .send()
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        expect(res.status).toBe(404);
        done();
    })

    it('200 on successful book update', async (done) =>{
        const res = await request.patch(`/books/${bookId}`)
        .send({price:"450"})
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        expect(res.status).toBe(200);
        done();
    })

    it('200 on successful book delete', async (done) =>{
        const res = await request.delete(`/books/${bookId}`)
        .send({price:"450"})
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        expect(res.status).toBe(200);
        done();
    })

    it('400 on no book found for already discarded book', async (done) =>{
        const res = await request.delete(`/books/${bookId}`)
        .send({price:"450"})
        .set('Authorization', 'Bearer ' + token)
        console.log(res.status);
        expect(res.status).toBe(400);
        done();
    })
})