export const esAdmin = (req,res,next) => {
    if (!req.user || req.user.role !== 'ADMIN_ROLE') {
        return res.status(403).json({
            ss: false,
            message: "Eres un usuario, no puedes realizar esta acción."
        })
    }
    next()
}