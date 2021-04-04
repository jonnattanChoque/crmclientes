import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const AUTENTICAR = gql`
    mutation autenticarUsuario($input:AutenticarInput){
        autenticarUsuario(input: $input){
            token
        }
    }
`;

const Login = () => {
    const [ autenticarUsuario ] = useMutation(AUTENTICAR);
    const [mensaje, guardarMensaje] = useState(null);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().required('El correo es obligatorio').email('El correo no es válido'),
            password: Yup.string().required('La contraseña es obligatoria')
        }),
        onSubmit: async valores => {
            const { email, password } = valores;
            try {
                const {data} = await autenticarUsuario({
                    variables: {
                        input: {
                            "email": email,
                            "password": password
                        }
                    }
                });
                guardarMensaje(`Bienvenido`);
                
                setTimeout(() => {
                    const { token } = data.autenticarUsuario;
                    localStorage.setItem('token', token);

                    guardarMensaje(null);
                    router.push("/clientes");
                }, 2000);
            } catch (error) {
                guardarMensaje(error.message);
                setTimeout(() => {
                    guardarMensaje(null);
                }, 2000);
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
        <>
        <Layout>
            {mensaje && mostrarMensaje()}
            <h1 className="text-center text-2xl text-white font-light">Ingresar</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-sm">
                    <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Correo</label>
                            <input 
                                className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent" 
                                type="email" id="email" placeholder="Escribe tu correo" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email ? (<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><p className="font-bold">Error</p><p>{formik.errors.email}</p></div>) : null}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Contraseña</label>
                            <input 
                                className="shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:border-transparent" 
                                type="password" id="password" placeholder="Escribe tu contraseña" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                            />
                            {formik.touched.password && formik.errors.password ? (<div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"><p className="font-bold">Error</p><p>{formik.errors.password}</p></div>) : null}
                        </div>
                        <input
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercas hover:bg-gray-900" 
                            type="submit" value="Ingresar"
                        />
                    </form>
                </div>
            </div>
        </Layout>
        </>
    );
}
 
export default Login;