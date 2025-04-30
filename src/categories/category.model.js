import mongoose, {Schema,model} from "mongoose"

const CategorySchema = Schema({
    name: {type:String,required:true},
    description: {type:String,required:true},
    estado:{
        type:Boolean,
        default:true
    }
})

CategorySchema.methods.toJSON = function() {
    const {__v,_id,...category} = this.toObject()
    category.uid = _id
    return category
}

export default model('Category',CategorySchema)