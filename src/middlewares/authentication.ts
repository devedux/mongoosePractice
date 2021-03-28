// ======== verificando token
import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';



export const verificaToken = (req: Request, res: Response , next: NextFunction ) => {
    let {token} : any = req.headers
    let seed : any;
    seed = process.env.SEED
    jwt.verify(token, seed  ,(err: any, decoded : any ) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.query.usuario = decoded.usuario
        next();
    })
}


export const verificaAdmin_Role = (req: Request, res: Response, next: NextFunction) => {
    // console.log(usuario,'abajo')
    if(req.query.usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            message: 'El usuario no es un Administrador'
        })
    }
    next();
}
