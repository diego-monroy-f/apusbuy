#!/usr/bin/env node
var Client = require('../models/client');
var Product = require('../models/product');
var Card = require('../models/card');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var async = require('async');

 var address = {
  street: "5th avenue",
  "postalCode": "05061",
  "number": 24,
  "state": "Atizapan",
  "city": "Mexico"
};

mongoose.connect('mongodb://localhost/apusbuy')
var db = mongoose.connection;
db.once('open', () =>{
	//Clearing DB
	Client.remove({}, () =>{		
		var client = new Client();
		client.name = "Steve";
        client.lastName = "Mc Stevens";
        client.email = "steve.stevenson@itesm.mx";
        client.password = "topKek";
        client.verified = true;
        client.address = address;        
        client.cards = [
            {
                "number": 5555555555554444,
                "code": 123,
                "expirationDate": "11/17"
            },
            {
                "number": 5105105105105100,
                "code": 456,
                "expirationDate": "08/19"
            }
        ],
        client.cart.discount = 0;
        Product.find().exec((err,products) =>{
            if(!err && products.length){
                async.eachSeries(products, (product, callback) =>{
                    client.cart.orders.push({product: product._id, ammount: 1});
                    client.save((err,c) =>{
                        callback();
                    });
                }, (err) =>{
                    console.log('Clients seeded');
                    process.exit();
                })
            }
        })

	});
});