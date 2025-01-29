const express=require("express")
const router=express.Router()
const multer=require("multer")
const path=require("path")
const Blog=require("../models/blog.model.js")
const Comment=require("../models/comment.js")


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,path.resolve("./public/uploads/"))
    },
    filename:function (req,file,cb){
        return cb(null,`${Date.now()}-${file.originalname}`)
       

    }
})
const upload=multer({storage})

router.get("/add-new",(req,res)=>{
        return res.render("addBlog",{
            user:req.user
        })
})


router.post("/",upload.single("coverImage"),async(req,res)=>{
        const {title,body}=req.body
     const blog= await Blog.create({
            body,
            title,
            createdBy:req.user._id,
            coverImageURL:`/uploads/${req.file.filename}`
        })
   return res.redirect(`/blog/${blog._id}`)
})

router.get("/:id",async(req,res)=>{

    const id=req.params.id
    const blog=await Blog.findById(id).populate("createdBy")
    const comments=await Comment.find({blogId:id}).populate("createdBy")
    return res.render("blog",{
        user:req.user,
        blog:blog,
        comments:comments
    })
})

router.post("/comment/:blogId",async(req,res)=>{
    const comment=await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id
    })
    return res.redirect(`/blog/${req.params.blogId}`)
})

module.exports=router