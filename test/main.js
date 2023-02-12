const chai = require('chai');
const expect = require("chai").expect;
const chaiHttp = require('chai-http');
require('dotenv').config();

chai.use(chaiHttp)

const api = chai.request(process.env.BASE_URL)

//Login
describe("User login", function(){
    it("User can login with credential that valid", (done) => {
        api.post("/authentications")
        .set('Content-Type', 'Application/json')
        .send({
            email: 'syahrill.ramadhan17@gmail.com',
            password: 'pass123'
        })
        .end(function(error, response){
            expect(response.status).to.equals(201);
            expect(response.body.data.accessToken).to.not.be.null
            global.token = response.body.data.accessToken;
            console.log(response.body.data.accessToken);
            done();
        })
    })

    it("User cannot login with credential that invalid", (done) => {
        api.post("/authentications")
        .set('Content-Type', 'Application/json')
        .send({
            email: 'test@gmail.com',
            password: 'pass123'
        })
        .end(function(error, response){
            expect(response.status).to.equals(401);
            expect(response.body.status).to.equal('fail');
            expect(response.body.message).to.equals('Kredensial yang Anda berikan salah');
            console.log(response.body);
            done();
        })
    })

    it("User cannot login with empty email", (done) => {
        api.post("/authentications")
        .set('Content-Type', 'Application/json')
        .send({
            email: '',
            password: 'pass123'
        })
        .end(function(error, response){
            expect(response.status).to.equals(400);
            expect(response.body.status).to.equal('fail');
            expect(response.body.message).to.equals('\"email\" is not allowed to be empty');
            console.log(response.body);
            done();
        })
    })

    it("User cannot login with empty password", (done) => {
        api.post("/authentications")
        .set('Content-Type', 'Application/json')
        .send({
            email: 'syahrill.ramadhan17@gmail.com',
            password: ''
        })
        .end(function(error, response){
            expect(response.status).to.equals(400);
            expect(response.body.status).to.equal('fail');
            expect(response.body.message).to.equals('\"password\" is not allowed to be empty');
            console.log(response.body);
            done();
        })
    })
})

//Add Customer
describe("Add Customer", function(){
    //positif case
    it("User can add data customer", (done) => {
        api.post("/customers")
        .set('Content-Type', 'Application/json')
        .set('Authorization', 'Bearer ' + global.token)
        .send({
            "name": "QA Testing",
            "phone": 08222,
            "address": "bekasi",
            "description": "QA Test"
         })
        .end(function(error, response){
            expect(response.status).to.equals(201);
            expect(response.body.status).to.equals('success');
            expect(response.body.message).to.include('berhasil');
            global.IDcustomer = response.body.data.customerId
            console.log(response.body);
            done();
        })
    })

    //Negatif test
    it("User cannot add data customer with input no.phone not number", (done) => {
        api.post("/customers")
       .set('Content-Type', 'Application/json')
       .set('Authorization', 'Bearer ' + global.token)
       .send({
           "name": "QA Testing",
           "phone": "testing",
           "address": "bekasi",
           "description": "QA Test"
           })
       .end(function(error, response){
           expect(response.status).to.equals(400);
           expect(response.body.status).to.equals('fail');
           expect(response.body.message).to.include('"phone" must be a number');
           console.log(response.body);
           done();
       })
   })
})

// Get customer
describe("Get Customer", function(){
    //positif case
    it("User can see get data customer after add customer", (done) => {
        api.get("/customers/"+global.IDcustomer)
        .set('Content-Type', 'Application/json')
        .set('Authorization', 'Bearer ' + global.token)
        .end(function(error, response){
            expect(response.status).to.equals(200);
            expect(response.body.data.customer.name).to.be.a('string');
            expect(response.body.data.customer.name).to.equal('QA Testing');   
            expect(response.body.data.customer.phone).to.be.a('string');
            expect(response.body.data.customer.address).to.be.a('string');
            expect(response.body.data.customer.description).to.be.a('string');
            console.log(response.body);
            done();
        })
    })
    //negatif test
    it("User cannot see get data customer with id customer not registered", (done) => {
        let dumyid = 123;
        api.get("/customers/"+dumyid)
        .set('Content-Type', 'Application/json')
        .set('Authorization', 'Bearer ' + global.token)
        .end(function(error, response){
            expect(response.status).to.equals(404);
            expect(response.body.status).to.equals('fail');
            expect(response.body.message).to.equals('id tidak valid');
            console.log(response.body);
            done();
        })
    })
})

//Update data customer
describe("Update Customer", function(){
    it("User can update data customer", (done) => {
        api.put("/customers/"+global.IDcustomer)
        .set('Content-Type', 'Application/json')
        .set('Authorization', 'Bearer ' + global.token)
        .send({
            "name": "Testing updated",
            "phone": 08987654321,
            "address": "Bekasi",
            "description": "QA Test"
        })
        .end(function(error, response){
            expect(response.status).to.equals(200);
            expect(response.body.data.name).to.equals('Testing updated');      
            console.log(response.body);
            done();
        })
    })

    it("User cannot update data customer when input nophone not number", (done) => {
        api.put("/customers/"+global.IDcustomer)
        .set('Content-Type', 'Application/json')
        .set('Authorization', 'Bearer ' + global.token)
        .send({
            "name": "Testing updated",
            "phone": "abc123",
            "address": "Bekasi",
            "description": "QA Test"
         })
        .end(function(error, response){
            expect(response.status).to.equals(400);      
            expect(response.body.status).to.equals('fail');
            expect(response.body.message).to.equals('"phone" must be a number');
            console.log(response.body);
            done();
        })
    })
})

describe("Delete Customer", function(){
    let invalidId = 1234
    //positif test
    it("success Delete Customer", (done) => {
        api.delete("/customers/"+global.IDcustomer)
        .set('Content-Type', 'Application/json')
        .set('Authorization', 'Bearer ' + global.token)
        .end(function(error, response){
            expect(response.status).to.equals(200);
            console.log(response.body);
            done();
        })
    })

    //negatif test
    it("User cannot Delete Customer when invalid id customer", (done) => {
        api.delete("/customers/"+invalidId)
        .set('Content-Type', 'Application/json')
        .set('Authorization', 'Bearer ' + global.token)
        .end(function(error, response){
            expect(response.status).to.equals(404);
            expect(response.body.status).to.equals('fail');
            expect(response.body.message).to.equals('id tidak valid')
            console.log(response.body);
            done();
        })
    })
})
