const route = require('express').Router()
const User = require('../db/models').User
const passport = require('../passport')


route.get('/signin', (r,s) => s.render('signin'))
route.get('/signup', (r,s) => s.render('signup'))
route.get('/logout',(req, res)=>{
    req.logout();
    res.redirect('/user/signin');}
  );
route.post('/signup', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
        address:req.body.addr,
        mobno:req.body.mobno,
        role:req.body.username,
        isImg:false,
        image:'https://openclipart.org/download/247324/abstract-user-flat-1.svg'
    }).then((user) => {
        res.redirect('/user/signin')
    })
})
route.get('/profile',(req,res)=>{
    if(!req.user){
        res.redirect('/user/signin')
    }
    else{
        
            res.render('profile',{user:req.user})
        
    }
})

route.post('/signin',passport.authenticate('local', {
    successRedirect: '/shop',
    failureRedirect: '/user/signin',

}))
// route.post('/updatepass',(req,res)=>{
//     User.update({
//         password:req.body.newpass
//     },{
//         where: {
//           id: parseInt(req.body.uid)
//         }
//       }).then((user)=>res.redirect('/user/signin'))
// })
// route.post('/deleteacc',(req,res)=>{
//     User.destroy({
//         where: {
//             id:parseInt(req.body.uid1)
//         }
//     }).then((user)=>res.redirect('/'))
// })

exports = module.exports = route