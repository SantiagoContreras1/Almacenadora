    import Employee from "./employee.model.js"

    export const saveEmployee = async (req, res) => {
        try {
            const {name,apellido,puesto} = req.body
            const employee = new Employee({name,apellido,puesto})

            await employee.save()

            res.status(200).json({
                message:"Employee saved successfully",
                employee
            })
        } catch (error) {
            res.status(500).json({
                message: "Error saving employee",
                error: error.message
            })
        }
    }

    export const getEmployees = async (req, res) =>{
        try {
            const query = {estado:true};
            
            const employees = await Employee.find(query).populate('puesto'); 
    
            res.status(200).json({
                employees
            });
        } catch (error) {
            res.status(500).json({
                message: "Error getting employees from database",
                error: error.message
            });
        }
    }

    export const getEmployeeId = async (req, res) =>{
        try {
            const { id } = req.params;
    
            const employee = await Employee.findById(id);
    
            if (!employee) {
                return res.status(404).json({
                    message: "Employee not found"
                });
            } else {
                res.status(200).json({
                    employee
                });
            }
        } catch (error) {
            res.status(500).json({
                message: "Error getting employee from database",
                error: error.message
            })
        }
    }

    export const updateEmployee = async (req, res) =>{
        try {
            const {id} = req.params
            const {...data} = req.body
    
            const updatedEmployee = await Employee.findByIdAndUpdate(id, data, { new: true });
    
            if (!updatedEmployee) {
                 return res.status(404).json({
                     message: "Employee not found"
                 });
            }

            res.status(200).json({
                message: "Employee updated successfully",
                employee: updatedEmployee 
            });
    
        } catch (error) {
            res.status(500).json({
                message: "Error updating employee",
                error: error.message
            });
        }
    }

    export const deleteEmployee = async (req, res) =>{
        try {
            const {id} = req.params

            const deletedEmployee = await Employee.findByIdAndUpdate(id,{estado:false},{new:true})

            res.status(200).json({
                message: "Employee deleted successfully",
                deletedEmployee
            })
        } catch (error) {
        res.status(500).json({
            message: "Error deleting employee",
            error: error.message
        })  
        }
    }