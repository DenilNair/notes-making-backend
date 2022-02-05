const moongoose=require('mongoose');


const userSchema=moongoose.Schema({
    blocks:Array,
  
});

module.exports=moongoose.model('Note',userSchema);