const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes
const config = require('../config')

const db = new Sequelize(config.DATABASE_URL);
const User = db.define('users',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username:{
        type:DataTypes.STRING,
        unique:true
    },
    address:{
        type:DataTypes.STRING
    },
    mobno:DataTypes.STRING,
    role:{
        type:DataTypes.STRING,
        allowNull:true
    },
    password:DataTypes.STRING
})
const Usercart = db.define('usercart',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uid:DataTypes.INTEGER,
    proid:DataTypes.INTEGER,
    name:DataTypes.STRING,
    price:DataTypes.INTEGER,
    taxper:DataTypes.INTEGER,
    tax:DataTypes.INTEGER,
    total:DataTypes.INTEGER
})
const Categories = db.define('categories', {
    catId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    catName:{
        type: DataTypes.STRING,
        unique:true
    },
    taxper:DataTypes.INTEGER
    

})
const Products = db.define('products', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    imgurl:DataTypes.STRING,
    name:DataTypes.STRING,
    vendor:DataTypes.STRING,
    price:DataTypes.INTEGER,
    cat:DataTypes.STRING
    
})
const Requests = db.define('requests', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uid:DataTypes.INTEGER,
    pid:DataTypes.INTEGER,
    total:DataTypes.INTEGER
    
})
Products.belongsTo(Categories);
db.sync({alter:true}).then(() => "Database created")

exports = module.exports = {
    Categories,Products,User,Usercart,Requests
}