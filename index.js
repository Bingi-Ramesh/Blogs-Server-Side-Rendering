const express=require("express")
const path=require("path")
const mongoose=require("mongoose")
const cookieParser=require("cookie-parser")

const Blog=require("./models/blog.model.js")
const userRoute=require("./routes/user.route.js")
const blogRoute=require("./routes/blog.js")
const { checkForAuthenticationCookie } = require("./middlewares/authentication.js")

const app=express()

const PORT=8000;

mongoose.connect("mongodb://localhost:27017/piyush-blogify")
.then(()=>console.log("mongodb is connected..."))
.catch(()=>console.log("failed to connect mongodb..."))

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")))

app.get("/",async(req,res)=>{
    const allBlogs=await Blog.find({})
    return res.render("home",{
        user:req.user,
        blogs:allBlogs
    })

})

app.use("/user",userRoute)
app.use("/blog",blogRoute)

app.listen(PORT,()=>console.log(`server is started at port:${PORT}`))