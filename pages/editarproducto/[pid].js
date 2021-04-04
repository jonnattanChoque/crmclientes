import React from 'react';
import {useRouter} from 'next/router';
import Layout from '../../components/Layout';
import {useQuery, gql, useMutation} from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id:ID!) {
        obtenerProducto(id:$id) {
            nombre
            existencia
            precio
        }
    }
`;

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput) {
        actualizarProducto(id: $id, input: $input) {
            id
            nombre
            existencia
            precio
        }
    }
`;

export default function EditarProducto() {
    const router = useRouter();
    const { query: {id} } = router;

    const {data, loading, error} = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id
        }
    });
    
    const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);

    //Validaciones
    const schemaValidation = Yup.object({
        nombre: Yup.string().required('El nombre es obligatorio'),
        existencia: Yup.number().required('La cantidad es obligatoria').positive('No se aceptan negativos').integer("Solo se aceptan números enteros"),
        precio: Yup.number().required('El precio es obligatorio').positive('No se aceptan negativos')
    })

    if(loading) return <h1>Cargando...</h1>
    const {obtenerProducto} = data;

    const actualizarInfoProducto = async (valores) => {
        const { nombre, existencia, precio } = valores;
        try {
            const { data } = await actualizarProducto({
                variables: {
                    id,
                    input: {
                        nombre,
                        existencia,
                        precio
                    }
                }
            })
            
            Swal.fire({
                title: 'Actualizado',
                text: "El producto se actualizó correctamente",
                icon: 'success'
            }).then((result) => {
                router.push('/productos');
            })

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar producto</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik validationSchema={schemaValidation} enableReinitialize initialValues={obtenerProducto} onSubmit={(valores) => {
                        actualizarInfoProducto(valores)
                    }}>
                        {props => {
                            return (
                                <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={props.handleSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                                        <input 
                                            className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent" 
                                            type="text" id="nombre" placeholder="Escribe el nombre" value={props.values.nombre} onChange={props.handleChange} onBlur={props.handleBlur}
                                        />
                                        {props.touched.nombre && props.errors.nombre ? (<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><p className="font-bold">Error</p><p>{props.errors.nombre}</p></div>) : null}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">Existenci</label>
                                        <input 
                                            className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent" 
                                            type="number" id="existencia" placeholder="Escribe el apellido del cliente" value={props.values.existencia} onChange={props.handleChange} onBlur={props.handleBlur}
                                        />
                                        {props.touched.existencia && props.errors.existencia ? (<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><p className="font-bold">Error</p><p>{props.errors.existencia}</p></div>) : null}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">Precio</label>
                                        <input 
                                            className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent" 
                                            type="number" id="precio" placeholder="Escribe el correo del cliente" value={props.values.precio} onChange={props.handleChange} onBlur={props.handleBlur}
                                        />
                                        {props.touched.precio && props.errors.precio ? (<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><p className="font-bold">Error</p><p>{props.errors.precio}</p></div>) : null}
                                    </div>
                                    <input className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" type="submit" value="Guardar"/>
                                </form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </Layout>
    );
}