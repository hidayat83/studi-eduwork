const mongoose = require('mongoose');
const{model,Schema}=mongoose;

const tagSchema= Schema({
    name:{
        type:String,
        minlength:[3,'Panjang nama makanan minimal 3 karakter'],
        maxLength:[20,'Panjang nama kategori minimal 20 karakter'],
        required:[true,'Nama Makanan harus diisi']
    }
})

module.exports=model('Tag',tagSchema);