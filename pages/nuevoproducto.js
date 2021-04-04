import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput) {
        nuevoProducto(input: $input){
            id
            nombre
            existencia
            precio
        }
    }
`;
const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      precio
      existencia
    }
  }
`;

const NuevoProducto = () => {
    const [ nuevoProducto ] = useMutation(NUEVO_PRODUCTO, {
        update(cache, {data: {nuevoProducto}}){
            //obtener el objeto del cache
            const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS });

            //reescribir el cache
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: [...obtenerProductos, nuevoProducto]
                }
            })
        }
    });
    const [mensaje, guardarMensaje] = useState(null);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            nombre: '',
            existencia: '',
            precio: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            existencia: Yup.number().required('La cantidad es obligatoria').positive('No se aceptan negativos').integer("Solo se aceptan números enteros"),
            precio: Yup.number().required('El precio es obligatorio').positive('No se aceptan negativos')
        }),
        onSubmit: async valores => {
            const { nombre, existencia, precio } = valores;
            try {
                const {data} = await nuevoProducto({
                    variables: {
                        input: {
                            "nombre": nombre,
                            "existencia": existencia,
                            "precio": precio
                        }
                    }
                });
                guardarMensaje(`Se creó el producto ${data.nuevoProducto.nombre}`);
                setTimeout(() => {
                    guardarMensaje(null);
                    router.push("/productos");
                }, 2000);
                
            } catch (error) {
                guardarMensaje(error.message);
            }
        }
    });

    const mostrarMensaje = () => {
        return (
            <div className="bg-red-400 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    }

    return (
        <Layout>
            {mensaje && mostrarMensaje()}
            <h1 className="text-2xl text-gray-800 font-light">Nuevo producto</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                            <input 
                                className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent" 
                                type="text" id="nombre" placeholder="Escribe el nombre del producto" value={formik.values.nombre} onChange={formik.handleChange}
                            />
                            {formik.touched.nombre && formik.errors.nombre ? (<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><p className="font-bold">Error</p><p>{formik.errors.nombre}</p></div>) : null}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">Cantidad disponible</label>
                            <input 
                                className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent" 
                                type="number" id="existencia" min="0" placeholder="Escribe la cantidad disponible" value={formik.values.existencia} onChange={formik.handleChange}
                            />
                            {formik.touched.existencia && formik.errors.existencia ? (<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><p className="font-bold">Error</p><p>{formik.errors.existencia}</p></div>) : null}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">Precio</label>
                            <input 
                                className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent" 
                                type="number" id="precio" placeholder="Escribe el precio" value={formik.values.precio} onChange={formik.handleChange} onBlur={formik.handleBlur}
                            />
                            {formik.touched.precio && formik.errors.precio ? (<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><p className="font-bold">Error</p><p>{formik.errors.precio}</p></div>) : null}
                        </div>
                        <input className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" type="submit" value="Guardar"/>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
 
export default NuevoProducto;