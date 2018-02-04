const route = require('express').Router()
const User = require('../db/models').User
const passport = require('../passport')


route.get('/signin', (r,s) => s.render('signin'))
route.get('/signup', (r,s) => s.render('signup'))

route.post('/signup', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
        address:req.body.addr,
        mobno:req.body.mobno,
    }).then((user) => {
        res.redirect('/user/signin')
    })
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