const express=require("express")
const router=express.Router()
const User = require("../models/User");
const Card = require("../models/Card");
const bcrypt=require("bcrypt")
const Joi = require("Joi");



// create new card
const newCardSchema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    subtitle: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1024).required(),
    
    phone: Joi.string()
      .pattern(/^[0-9\- ]{10,15}$/) // Allows numbers, spaces, and hyphens
      .required(),
  
    email: Joi.string().email().required(),
  
    web: Joi.string().uri().optional(),
  
    image: Joi.object({
      url: Joi.string().uri().required().allow(""),
      alt: Joi.string().min(2).max(255).required().allow(""),
    }).required(),
  
    address: Joi.object({
      state: Joi.string().allow("").optional(),
      country: Joi.string().min(2).max(255).required(),
      city: Joi.string().min(2).max(255).required(),
      street: Joi.string().min(2).max(255).required(),
      houseNumber: Joi.number().required(),
      zip: Joi.number().optional(),
    }).required(),
  
    // bizNumber: Joi.number().optional(),
    likes: Joi.array().items(Joi.string()).optional(),     
    user_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    createdAt: Joi.date().default(() => new Date()),

  });

router.post("/",async (req,res)=>{
    try {
        console.log(req.body);
  
      // check input validation
      const { error } = await newCardSchema.validateAsync(req.body);
      if (error) return res.status(400).send("error schema");
  
      // create Card
      card = new Card(req.body);
      const newCard = await card.save();
  
     return res.status(200).send(`post / sucessful ${newCard}`);

    } catch (err) {

      console.log(err.message)
      res.status(400).send(`Invalide request - ${err.message}`);
    
    }})

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