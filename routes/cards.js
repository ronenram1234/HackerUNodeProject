const express=require("express")
const router=express.Router()
const User = require("../models/Users");
const Card = require("../models/Cards");

router.get("/",async (req,res)=>{
try{

    return res.status(200).send("get / sucessful")
}
catch (err){
   res.status(400).send(`Invalide request - ${err.message}`)
}

})

router.get("/my-cards",async (req,res)=>{
try{

    return res.status(200).send("get /my-cards sucessful")
}
catch (err){
   res.status(400).send(`Invalide request - ${err.message}`)
}

})
router.get("/:id",async (req,res)=>{
try{

    return res.status(200).send("get /:id sucessful")
}
catch (err){
   res.status(400).send(`Invalide request - ${err.message}`)
}

})


router.post("/",async (req,res)=>{
    try{
    
        return res.status(200).send("post / sucessful")
    }
    catch (err){
       res.status(400).send(`Invalide request - ${err.message}`)
    }
    
    })

    router.put("/:id",async (req,res)=>{
        try{
        
            return res.status(200).send("put /:id sucessful")
        }
        catch (err){
           res.status(400).send(`Invalide request - ${err.message}`)
        }
        
        })

        router.patch("/:id",async (req,res)=>{
            try{
            
                return res.status(200).send("patch /:id sucessful")
            }
            catch (err){
               res.status(400).send(`Invalide request - ${err.message}`)
            }
            
            })

            router.delete("/:id",async (req,res)=>{
                try{
                
                    return res.status(200).send("delete /:id sucessful")
                }
                catch (err){
                   res.status(400).send(`Invalide request - ${err.message}`)
                }
                
                })

module.exports=router