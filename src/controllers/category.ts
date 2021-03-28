import { Request, Response } from 'express';
import { Categoria } from '../db/mongoose';
import _ from 'underscore';

// populate -> lo que hara es ver si existe un ObjectID = fk en la collecion
// el primer parametro que recibe populate es el nombre del campo que tiene el fk
// el segundo parametro es de los campos que queremos que se muestre
// sort() -> lo que hace e sordenarlo por el nombre del campo que le pongamos
// GET Mostrar todas categorias - hecho
export const getCategorias = (req: Request, res: Response) => {
    Categoria.find()
        .sort('description')
        .populate('usuario', 'name email' )
        // .populate('productos', 'campos si tenemos mas fk igual normal ponemos mas populates ' )
        .exec((err, categorias) => {
        if(err) {
            res.status(500).json({
                ok: false,
                content: 'Error en la base de datos',
                err
            });
        }

        res.status(200).json({
            ok: true,
            categorias
        });
    });
}


// GET mostrar una categoria por ID finById(...)

export const getCategoriaById = (req: Request, res: Response) => {
    let { id } : any = req.params   

    Categoria.findById(id, (err, categoriaDB) => {
        if(err) {
            res.status(500).json({
                ok: false,
                content: 'Error en la base de datos',
                err
            });
        }
        if(!categoriaDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }
        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        })
    })
}


// POST una categoria   ->  req.usuario.id token
export const createCategoria = (req: Request, res: Response) => {
    let {body, query} = req;

    let objCategoria = new Categoria({
        description: body.description,
        usuario: query.usuario._id
    });

    objCategoria.save((err, categoriaDB) => {
        if(err) {
            res.status(500).json({
                ok: false,
                content: 'Error en la base de datos',
                err
            });
        }
        if(!categoriaDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }
        res.status(201).json({
            ok: true,
            categoria: categoriaDB
        });
    });
}

// PUT actualizar categoria por id
export const updateCategoriaById = (req: Request, res: Response) => {
    let {id} = req.params;
    let body = _.pick(req.body, ['description']);

    const options = {
        new: true
    }

    Categoria.findByIdAndUpdate(id, body, options, (err, categoriaDB) => {
        if(err) {
            res.status(500).json({
                ok: false,
                content: 'Error en la base de datos',
                err
            });
        }
        if(!categoriaDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }
        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        })
    })
}

// DELETE que recibe un id -> dos condiciones que solo pueda borrarlo un Administrador, y pedir el token
export const deleteCategoryById = (req: Request, res: Response) => {
    let {id} = req.params;
    let estadoCambiado = { state: false };

    Categoria.findByIdAndUpdate(id, estadoCambiado, {new: true}, (err, categoriaDB: any) => {
        if(err) {
            res.status(500).json({
                ok: false,
                content: 'Error en la base de datos',
                err
            });
        }  

        if(!categoriaDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }
        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        })
    })

}