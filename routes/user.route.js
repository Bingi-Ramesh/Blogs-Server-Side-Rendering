const express=require("express")
const router=express.Router()

const User=require("../models/user.model.js")
const { createTokenForUser } = require("../services/authentication.js")

router.get("/signin",(req,res)=>{
    return res.render("signin")
})

router.get("/signup",(req,res)=>{
    return res.render("signup")
})

router.post("/signup",async(req,res)=>{
    const {fullname,email,password}=req.body

    await User.create({
        fullname,
        email,
        password
    }
    )
    

    return res.redirect("signin")
})

router.post("/signin",async(req,res)=>{
    const {email,password}=req.body

   try {
    const token=await User.matchPasswordAndGenerateToken(email,password)
    console.log(token)
    return res.cookie("token",token).redirect("/")
   } catch (error) {
        return res.render("signin",{error:"Incorrect email or password"})
   }

})

router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/")
})

module.exports=router;