import {Request, Response} from 'express';
import { Usuario } from '../db/mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'underscore';
import  {OAuth2Client } from 'google-auth-library'
const client = new OAuth2Client(process.env.CLIENT_ID);

export const logged = (req: Request, res: Response) => {
    let {body} = req

    Usuario.findOne({ email: body.email} , (err, usuarioDB : any ) => {

        if (err){
            res.status(500).json({
                ok: false,
                content: 'Error en la base de datos',
                err
            })
        }
        // email incorrecto
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                content: '',
                err : {
                    message: 'Usuario o contraseña incorrectos'
                }
            })
        }
        //  password incorrecto
        if ( !bcrypt.compareSync( body.password, usuarioDB.password ) ) {
            
            return res.status(404).json({
                ok: false,
                content: '',
                err : {
                    message: 'Usuario o contraseña incorrectos'
                }
            })
        }
        let seed_secret : any;
        seed_secret = process.env.SEED
        
        let caducidad : any;
        caducidad = process.env.CADUCIDAD_TOKEN;

        // console.log(seed_secret)
        let token = jwt.sign({
            usuario: usuarioDB
            //                        s, m,  horas, dias
        // },  'holu' , {expiresIn: 60* 60 * 24 * 30 } )
        },  seed_secret , {expiresIn: process.env.CADUCIDAD_TOKEN } )

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token
        })


    })
}


// configuraciones de google

async function verify(token:any) {
    let client_id : any = process.env.CLIENT_ID
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: client_id, 
    });
    const payload : any = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}

export const loggedGoogle = async (req: Request, res: Response) => {
    let token = req.body.idtoken
    let googleUser: any = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            });
        });
    
    Usuario.findOne( { email: googleUser.email }, (err, usuarioDB :any ) => {
        if (err){
            res.status(500).json({
                ok: false,
                content: 'Error en la base de datos',
                err
            })
        }
        if( usuarioDB ) {
            if( !usuarioDB.google ) {
                res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su authenticaión normal'
                    }
                })
            } else {
                let seed_secret : any;
                seed_secret = process.env.SEED
                
                let caducidad : any;
                caducidad = process.env.CADUCIDAD_TOKEN;
        
                // console.log(seed_secret)
                let token = jwt.sign({
                    usuario: usuarioDB
                },  seed_secret , {expiresIn: process.env.CADUCIDAD_TOKEN } )
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            // si el usuario no existe en nuestra base de datos
            let usuario : any = new Usuario();
            usuario.name = googleUser.name;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save( (err : any, usuarioDB: any) => {
                if (err){
                    res.status(500).json({
                        ok: false,
                        content: 'Error en la base de datos',
                        err
                    })
                }
                let seed_secret : any;
                seed_secret = process.env.SEED
                
                let caducidad : any;
                caducidad = process.env.CADUCIDAD_TOKEN;
        
                // console.log(seed_secret)
                let token = jwt.sign({
                    usuario: usuarioDB
                },  seed_secret , {expiresIn: process.env.CADUCIDAD_TOKEN } )
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            } )
        }
    })
}




export const postUsuario = (req: Request, res: Response) => {
    let body = req.body;

    let objUsuario = new Usuario({
        name:   body.name,
        email:  body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    objUsuario.save((err, usuarioDB) => {
       if (err){
           res.status(500).json({
               ok: false,
               content: 'Error en la base de datos',
               err
           })
       }
       res.status(200).json({
        ok: true,
        content: usuarioDB
        })                          
    })             
}


export const updateUsuario = (req: Request, res: Response) => {
    let { id } = req.params;
    //                          LO QUE SI SE VA A PODER ACTUALIZAR
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state' ]);
    

    const options = {
        // nos entrega el objeto cambiado
        new: true,
        // valida los validadores del schema
        runValidators: true
    }
    Usuario.findByIdAndUpdate(id, body, options ,(err, usuarioDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                content: 'Error en la base de datos',
                err
            })
        }

        res.status(200).json({
            ok: true,
            content: usuarioDB
        })
    })
}

export const getUsuario = (req: Request, res: Response) => {
    // exec => ejecutar | limit = limite | skipt = saltar - paginacion
   
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite)

    // let validator = {
    //     state: true
    // }

    // {} es como un where , y el siguiente argumento que es un string es para decirle a mongo que es lo que queremos traer y lo que no definamos no se traera
    Usuario.find({state: true}, 'name email role state google' )
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        content: 'Error en la base de datos',
                        err
                    })
                }
                Usuario.count({state: true}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        content: usuarios,
                        cuantos: conteo
                    }); 
                })
            })
}

// export const deleteUsuario = (req: Request, res: Response) => {
//     let {id} = req.params;
//             // 3 parametros - id, options, callback
//     Usuario.findByIdAndRemove(id, (err, usuarioDelete : any ) => {
//         if (err) {
//             res.status(500).json({
//                 ok: false,
//                 content: 'Error en la base de datos',
//                 err
//             })
//         }   

//         if (!usuarioDelete) {
//             res.status(500).json({
//                 ok: false,
//                 content: 'Error en la base de datos',
//                 err: {
//                     message: 'Usuario no encontrado'
//                 }
//             })
//         }
//         res.status(200).json({
//             ok: true,
//             usuario: usuarioDelete
//         })
//     })
// }
export const deleteUsuario = (req: Request, res: Response) => {
    let {id} = req.params;
    let estadoCambiado = {
        state: false
    }
    // console.log(Usuario)
    Usuario.findByIdAndUpdate(id, estadoCambiado, {new: true} ,(err, usuarioDB: any) => {
        if (err) {
            res.status(500).json({
                ok: false,
                content: 'Error en la base de datos',
                err
            })
        }  
        if (!usuarioDB) {
            res.status(500).json({
                ok: false,
                content: 'Error en la base de datos',
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioDB    
        }) 
    })
}