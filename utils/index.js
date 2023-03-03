const {Ability ,AbillityBuilder}= require('@casl/ability')

function getToken (req){
    let token = 
    req.headers.authorization    
    ? req.headers.authorization.replace('Bearer ', '')
        : null;

        return token  && token.length ? token : null;
}

// policy

 const policies={
    guest (user,{can}){
        can('read','product');
    },
    user(user,{can}){
        can('view','Order');
        can('create','Order');
        can('read','Order',{user_id:user._id});
        can('update','User',{_id:user._id});
        can('read','Cart',{user_id:user._id});
        can('update','Cart',{user_id:user._id});
        can('view','DeliveryAddress');
        can('create','DeliveryAddress', {user_id:user._id});
        can('update','DeliveryAddress',{user_id:user._id});
        can('delete','DeliveryAddress',{user_id:user._id});
        can('read','Invoice',{user_id:user._id});
    },
    admin(user,{can}){
        can ('manage','all');
    },
 }

    const policyFor= user =>{
        let builder = new AbillityBuilder();
        if(user && typeof policies[user.role]==='function'){
            policies[user.role](user,builder);
        }else{
            policies['guest'](user,builder)
        }
        return new Abillity(builder.rules)
    }

module.exports={
    getToken,
    policyFor
} 