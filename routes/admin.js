const route = require('express').Router()
const express=require('express')
const Categories = require('../db/models').Categories
const Products = require('../db/models').Products
const Users = require('../db/models').Users
const Requests = require('../db/models').Requests
const Notifications = require('../db/models').Notifications

route.get('/categories', (req, res) => {
    if(!req.user){
        res.redirect('/user/signin')
    }
    else if(req.user.role!="admin"){
        res.redirect('/shop')
    }
    Categories.findAll().then((cats)=>{
        Products.findAll().then((pros)=>{
            res.render('admincat',{cats:cats,pros:pros})
        })
    }
    )
    
})
route.get('/products',(req,res)=>{
    if(!req.user){
        res.redirect('/user/signin')
    }
    else if(req.user.role!="admin"){
        res.redirect('/shop')
    }
    Categories.findAll().then((cats)=>{
        Products.findAll().then((pros)=>{
            res.render('adminpro',{cats:cats,pros:pros})
        })
    }
    )
})
route.get('/requests', (req, res) => {
    if(!req.user){
        res.redirect('/user/signin')
    }
    else if(req.user.role!="admin"){
        res.redirect('/shop')
    }
    Requests.findAll().then((reqs)=>{
        
            res.render('adminreq',{requests:reqs})
        
    }
    )
    
})
route.get('/notifications', (req, res) => {
    if(!req.user){
        res.redirect('/user/signin')
    }
    else if(req.user.role!="admin"){
        res.redirect('/shop')
    }
    res.render('adminnot')
    
})


exports = module.exports = route