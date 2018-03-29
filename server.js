

const express = require('express')
const session = require('express-session')
const app = express()
const passport = require('./passport')
const Products = require('./db/models').Products
const Categories = require('./db/models').Categories
const Usercart = require('./db/models').Usercart
const User = require('./db/models').User
const Requests = require('./db/models').Requests
const Notifications = require('./db/models').Notifications
const config = require('./config');
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: 'some very secret thing',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'hbs')
app.use('/user', require('./routes/user'))
app.use('/admin', require('./routes/admin'))




app.use('/',express.static(__dirname+'/views'))
app.use('/admin',express.static(__dirname+'/views'))

app.get('/getnot',(req,res)=>{
    Notifications.findAll({
        where:{
            uid: req.query.uid
        }}
    ).then(
        (nots)=>{
            res.send(nots)
        }
    ).catch((err)=>res.send('Error getting notifications'))
})



app.get('/addcat',(req,res)=>{
    Categories.create({
        catName:req.query.name,
        taxper:req.query.taxper
    }).then((cata)=>{
        res.send(cata)
    }).catch((err)=>res.send('Error adding category'))
})
app.get('/allcats',(req,res)=>{
    Categories.findAll().then((cats)=>res.send(cats)).catch((err)=>res.send('Error fetching categories'))
})
app.get('/allpros',(req,res)=>{
    Products.findAll().then((pros)=>res.send(pros)).catch((err)=>res.send('Error fetching products'))
})
app.get('/allreqs',(req,res)=>{
    Requests.findAll().then((reqs)=>res.send(reqs)).catch((err)=>res.send('Error fetching requests'))
})
app.get('/addpro',(req,res)=>{
    Products.create({
        name:req.query.name,
        imgurl:req.query.imgurl,
        vendor:req.query.vendor,
        price:parseInt(req.query.price),
        cat:req.query.cat,
        outofstock:false
    }).then((proa)=>{
        res.send(proa)
    }).catch((err)=>res.send('Error adding product'))
})

app.get('/', (r,s) => s.render('index'))
cart=[]

app.get('/addcart',(req,res)=>{
    console.log(req.query.pid)
    Categories.findOne({
        where:{
            catName:req.query.cat
        }}
    ).then((catb)=>{
        Usercart.create({
            proid:parseInt(req.query.pid),
            uid:parseInt(req.query.uid),
            name:req.query.name,
            price:parseInt(req.query.price),
            taxper:parseInt(catb.taxper),
            tax:(parseInt(catb.taxper)*parseInt(req.query.price))/100,
            total:parseInt(req.query.price)+(parseInt(catb.taxper)*parseInt(req.query.price))/100
        }).then((citem)=>{
            res.send(citem)
        }).catch((err)=>res.send('Error adding to cart'))
    }).catch((err)=>res.send('Error adding to cart'))
    
})
app.get('/getcart',(req,res)=>{
    Usercart.findAll({
        where:{
            uid:req.query.uid
        }
    }).then((data)=>{
        
        res.send(data)
    }).catch((err)=>res.send('Error getting cart'))
})


app.get('/rem',(req,res)=>{
    Usercart.destroy({
        where:{
            id:parseInt(req.query.id)
        }
    }).then((e)=>{
        res.send('removed')
    }).catch((err)=>res.send('Error removing item'))
})
app.get('/delreq',(req,res)=>{
    Requests.destroy({
        where:{
            id:parseInt(req.query.id)
        }
    }).then((x)=>{
        res.send('removed')
    }).catch((err)=>res.send('Error deleting request'))
})




    app.get('/cart', (r,s) => {
        if(!r.user){
            s.redirect('/user/signin')
        }
    s.render('cart',{user:r.user})
    })
    app.get('/bill', (r,s) => {
        if(!r.user){
            s.redirect('/user/signin')
        }
    s.render('bill',{user:r.user})
})
    app.get('/shop', (r,s) => {
        if(!r.user){
            s.redirect('/user/signin')
        }
        if(r.user.role=="admin"){
            s.render('main',{user:r.user,isAdmin:true})
        }
        else{
            s.render('main',{user:r.user,isAdmin:false})
        }
    })

    app.get('/addrequest',(req,res)=>{
        Requests.create({
            uid:parseInt(req.query.uid),
            pid:parseInt(req.query.pid),
            total:parseInt(req.query.total)
        }).then((x)=>{
            console.log(x)
            res.send(x)
        }).catch((err)=>res.send('Error adding request'))
    })
    app.get('/delcart',(req,res)=>{
        Usercart.destroy({
            where:{
                uid:parseInt(req.query.uid)
            }
        }).then((x)=>{
            res.status(204).send('deleted')
        }).catch((err)=>res.send('Error deleting from cart'))
    })
app.get('/getbycat',(req,res)=>{
    Products.findAll({
        where:{
            cat:req.query.catname
        }
    }).then((pros)=>{
        res.send(pros)
    }).catch((err)=>res.send('Error getting by category'))
})
app.get('/delpro',(req,res)=>{
    Products.destroy({
        where:{
            id:parseInt(req.query.id)
        }
    }).then(()=>{

       res.send('deleted')
    }).catch((err)=>res.send('Error deleting product'))
})
app.get('/delfromucart',(req,res)=>{
    Usercart.destroy({
        where:{
            proid:parseInt(req.query.id)
        }
    }).then(()=>{

       res.send('deleted')
    }).catch((err)=>res.send('Error deleting from user cart'))
})
app.get('/delnot',(req,res)=>{
    Notifications.destroy({
        where:{
            notid:parseInt(req.query.id)
        }
    }).then(()=>{
        res.send('deleted')
    }).catch((err)=>res.send('Error deleting notification'))
})
app.get('/sendnot',(req,res)=>{
    Notifications.create({
        uid: parseInt(req.query.usid),
        message: req.query.msg
    }).then((x)=>{
        res.send(x)
    }).catch((err)=>{
        console.log('Error sending notification')
    })
})
app.get('/clearnots',(req,res)=>{
    Notifications.destroy({
        where:{
            uid:parseInt(req.query.id)
        }
    }).then(()=>{
        res.send('Cleared notifications')
    }).catch((err)=>{
        console.log('Error clearing notifications')
    })
})
app.get('/getnots',(req,res)=>{
    Notifications.findAll({
        where:{
            uid: req.query.uid
        }
    }).then((nots)=>{
        res.send(nots)
    }).catch((err)=>{
        console.log('Error getting notifications')
    })
})
app.get('/sendall',(req,res)=>{
    User.findAll().then((users)=>{
        for(let i=0;i<users.length;i++){
            Notifications.create({
                uid: parseInt(users[i].id),
                message: req.query.msg
            }).then((x)=>{
                console.log('Sent')
            }).catch((err)=>{
                console.log('Error sending notification to all users')
            })
        }
        res.send('Sent')
    }).catch((err)=>{
        console.log('Error finding users')
    })
})
app.get('/psrch',(req,res)=>{
    Products.findAll().then((pros)=>{
        p=[]
        let k=0
        for(let i=0;i<pros.length;i++){
            if(pros[i].name.toLowerCase().indexOf(req.query.substr.toLowerCase())!=-1||pros[i].vendor.toLowerCase().indexOf(req.query.substr.toLowerCase())!=-1){
                p[k]=pros[i]
                k++
            }
        }
        res.send(p)
    }).catch((err)=>{
        console.log('Error getting searched product(s)')
    })
})
app.get('/changeoos',(req,res)=>{
    Products.findOne({
        where:{
            id:parseInt(req.query.pid)
        }
    }).then((p)=>{
        if(p.outofstock){
            Products.update({
                outofstock: false,
              }, {
                where: {
                  id: parseInt(req.query.pid)
                }
              }
            ).then((p)=>{
                res.send(p)
            }).catch((err)=>{
                console.log('Error in updating in if')
            })
        }
        else{
            Products.update({
                outofstock: true,
              }, {
                where: {
                  id: parseInt(req.query.pid)
                }
              }
            ).then((p)=>{
                res.send(p)
            }).catch((err)=>{
                console.log('Error in updating in else')
            })
        }
        
    }).catch((err)=>{
        console.log('Error changing out of stock condition')
    })
})
app.get('/getisoos',(req,res)=>{
    Products.findOne({
        where:{
            id:parseInt(req.query.pid)
        }
    }).then((p)=>{
        res.send(p.outofstock)
    }).catch((err)=>{
        console.log('Error getting is out of stock')
    })
})
app.get('/checkuser',(req,res)=>{
    User.findOne({
        where:{
            username:req.query.uname
        }
    }).then((user)=>{
        if(user==null){
            res.send(false)
        }
        else{
            res.send(true)
        }
    }).catch((err)=>{
        console.log('Error checking user')
    })
})
const path=require('path')
const multer=require('multer')
const fs=require('fs')
const upload=multer({dest:'uploads/'})
app.post('/up',upload.single('photo'),(req,res)=>{
    fs.readFile(req.file.path,(err,data)=>{
        fs.writeFile('public_static/images/'+req.file.originalname,data,(err)=>{
            fs.unlink(req.file.path,()=>{})
        })
    })
    User.update({
        isImg:true,
        image:`/images/${req.file.originalname}`
    },{
        where:{
            id:parseInt(req.user.id)
        }
    }).then((u)=>{
        User.findOne({
            where:{
                id:parseInt(req.user.id)
            }
        }).then((u)=>{
            res.render('profile',{user:u})
        }).catch((err)=>{
            console.log('Error finding user after updating image')
        })
        
    }).catch((err)=>{
        console.log('Error updating user')
    })
})
app.use('/',express.static(path.join(__dirname,'public_static')))


app.get('/changeadr',(req,res)=>{
    User.update({
        address:req.query.newadr
    },{
        where:{
            id:parseInt(req.query.uid)
        }
    }).then((u)=>{
        res.send('Changed address')
    }).catch((err)=>{
        console.log('Error updating address');
        
    })
})
app.get('/changemob',(req,res)=>{
    User.update({
        mobno:parseInt(req.query.newmob)
    },{
        where:{
            id:parseInt(req.query.uid)
        }
    }).then((u)=>{
        res.send('Changed mobile number')
    }).catch((err)=>{
        console.log('Error updating mobile number');
        
    })
})
app.listen(config.PORT, () => {
    console.log("Listening on port " + config.PORT);
  });