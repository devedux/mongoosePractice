import { Request, Response } from 'express';
import { Producto } from '../db/mongoose';
import _ from 'underscore';


export const getProductos = (req: Request, res: Response) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite)

    Producto.find({disponible: true})
            .populate('usuario', 'name email')
            .populate('categoria', 'descripcion')
            .skip(desde)
            .limit(limite)
            .exec((err, productos) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        content: 'Error en la base de datos',
                        err
                    })
                }
                Producto.count({disponible: true},(err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        content: productos,
                        cuantos: conteo
                    })
                })
            })
}

export const getProductoById = (req: Request, res: Response) => {
    let {id} = req.params;
    Producto.findById(id)
        .populate('usuario', 'name email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                content: 'Error en la base de datos',
                err
            })
        }
        if (!productoDB) {
            res.status(404).json({
                ok: false,
                err: {
                    message: 'El id no se ha encontrado'
                }
            })
        }

        res.status(200).json({
            ok: true,
            producto: productoDB
        })
    })
}


// busqueda
export const searchProducto = (req: Request, res: Response) => {

    let {termino} = req.params;
    //  expresion regular -> funcion de javascript
    // quiero crear una expresion regular basada en el termino y colocamos la i para que sea insensible a las mayuscular y minisculas
    let regex = new RegExp(termino, 'i');


    Producto.find({nombre: regex})
        .populate('categoria', 'description')
        .exec((err, productos) => {
            if(err) {
                res.status(500).json({
                    ok: false,
                    content: 'Error en la base de datos',
                    err
                });
            }
            res.status(200).json({
                ok: true,
                productos
            })
        })

}


export const createProducto = (req: Request, res: Response) => {
    let {body, query} = req;
    
    let objProducto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: query.usuario._id
    })

    objProducto.save((err, productoDB) => {
        if(err) {
            res.status(500).json({
                ok: false,
                content: 'Error en la base de datos',
                err
            });
        }
        if(!productoDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })
}

export const updateProductoById = (req: Request, res: Response) => {
    let {id} = req.params;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria', 'disponible'] );
    const options = { new: true};

    Producto.findByIdAndUpdate(id, body, options, (err, productoDB) => {
        if(err) {
            res.status(500).json({
                ok: false,
                content: 'Error en la base de datos',
                err
            });
        }
        if(!productoDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }
        res.status(200).json({
            ok: true,
            producto: productoDB
        })
    })
}


export const deleteProductoById = (req: Request, res: Response) => {
    let {id} = req.params;

    let estadoCambiado = {disponible: false};
    Producto.findByIdAndUpdate(id, estadoCambiado, {new: true} ,(err, productoDB) => {
        if(err) {
            res.status(500).json({
                ok: false,
                content: 'Error en la base de datos',
                err
            });
        }  
        if(!productoDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        } 
        res.status(200).json({
            ok: true,
            message: 'Eliminado exitosamente',
            producto: productoDB
        })
    })
}