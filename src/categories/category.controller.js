import Product from "../products/product.model.js"
import Category from "./category.model.js"

export const saveCategory = async (req,res) => {
    try {
        const {name,description} = req.body
        const category = new Category({name,description})

        await category.save()

        res.status(200).json({
            message:"Category saved successfully",
            category
        })

    } catch (error) {
        res.status(500).json({
            message: "Error saving category boludin",
            error: error.message
        })
    }


}

export const getCategories = async (req,res) => {
    try {
        const query = {estado:true}

        const categories = await Category.find(query)
           .populate({
               path: "proveedores",
               select: "nombre"
           })

        res.status(200).json({
            categories
        })

    } catch (error) {
        res.status(500).json({
            message: "Error getting categories boludin",
            error: error.message
        })
    }
}

export const updateCategory = async (req,res) => {
    try {
        const {id} = req.params
        const {...data} = req.body

        const updatedCategory = await Category.findByIdAndUpdate(id,data,{new:true})

        res.status(200).json({
            message: "Category updated successfully",
            updatedCategory
        })
    } catch (error) {
        res.status(500).json({
            message: "Error updating category boludin",
            error: error.message
        })
    }
}

export const deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const defaultCategory = await Category.findOne({ name: 'Productos Sin Categoria' });
  
      if (!defaultCategory) {
        const defaultCategoryData = new Category({
          name: 'Productos Sin Categoria',
          description: 'Categoría para productos sin categoría asignada.',
        });
        await defaultCategoryData.save();
      }
  
      const productosHuérfanos = await Product.find({ category: id });
  
      await Product.updateMany({ category: id }, { category: defaultCategory._id });
      defaultCategory.products.push(...productosHuérfanos.map(product => product._id));
      defaultCategory.markModified('products');
      await defaultCategory.save();
  
      const deletedCategory = await Category.findByIdAndUpdate(id, { estado: false }, { new: true });
  
      res.status(200).json({
        message: "Category deleted successfully",
        deletedCategory,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting category boludin",
        error: error.message,
      });
    }
  };