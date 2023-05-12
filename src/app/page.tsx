'use client';
import React, { useEffect } from 'react';
import { Righteous } from 'next/font/google';
import { Container } from '@/components/Contents/container';
import { LoginIcon } from '@/components/Forms/login_icon';
import { FormField } from '@/components/Forms/field';
import Link from 'next/link';
import * as Yup from 'yup';
import { isValidPassword } from '@/lib/date';
import { Field, Form, Formik } from 'formik';
import { Routes } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

declare module 'yup' {
  interface StringSchema {
    password_ppdb(msg?: string): this;
  }
}
const righteous = Righteous({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
});

Yup.addMethod(Yup.string, 'password_ppdb', function(this: Yup.StringSchema, msg: string) {
  return this.test({
    name: 'password_ppdb',
    message: msg,
    test: (value) => isValidPassword(value ?? ''),
  });
});

const loginPeserta = Yup.object().shape({
  nisn: Yup.string().required('NISN dibutuhkan').matches(/[0-9]{9,12}/g, 'NISN tidak valid'),
  birth: Yup.string().password_ppdb('Password tidak valid'),
});

type DataProps = {
  isError: boolean;
  message?: string;
}

export default function Login() {
  const [data, setData] = React.useState<DataProps>({
    isError: false,
  });
  const router = useRouter();

  const savedToken = Cookies.get('ppdb_session');
  useEffect(() => {
    if (savedToken) {
      router.push('/profile');
    }
  }, [router, savedToken]);

  return (
    <React.Fragment>
      <div className="mb-4">
        <div className="flex justify-center">
          <LoginIcon />
        </div>

        <h1 className={`text-center text-4xl text-[#456583] font-medium ${righteous.className}`}>
          LOGIN
        </h1>
      </div>
      <Container>
          <Formik
            validationSchema={loginPeserta}
            onSubmit={(values, helpers) => {
              helpers.setSubmitting(true);
              setData({ isError: false });

              const route = Routes.route('auth.peserta.login');
              fetch(route.url, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json', 
                },
                body: JSON.stringify(values),
              }).then(res => res.json()).then(res => {
                if (res.errors || res.error) {
                  setData({
                    isError: true,
                    message: res.error || res.message,
                  });
                  helpers.setSubmitting(false);
                } else {
                  if (!res?.data) {
                    setData({
                      isError: true,
                      message: 'Login failed, try again',
                    });
                    helpers.setSubmitting(false);
                    return;
                  }
                  Cookies.set('ppdb_session', res.data.token);

                  router.push('/profile');
                }
              }).catch((e) => setData({
                isError: true,
                message: e.message,
              }));
            }}
            initialValues={{
              nisn: '',
              birth: '',
            }}
          >
            {({ errors, touched, isSubmitting, handleChange }) => (
              <Form>
                <FormField labelKey="NISN" label="">
                  <Field onChange={handleChange} disabled={isSubmitting} type="text" placeholder="00XXXXXXXXXXXXX" className="input input-bordered w-full md:w-max max-w-xs" name="nisn" />
                </FormField>
                {errors.nisn && touched.nisn ? (
                    <p className="text-red-500">{errors.nisn}</p>
                  ) : null}
                <FormField labelKey="Password" label="">
                  <Field onChange={handleChange} disabled={isSubmitting} type="text" placeholder="Contoh: 24032007" className="input input-bordered w-full max-w-xs" name="birth" />
                </FormField>
                {errors.birth && touched.birth ? (
                    <p className="text-red-500">{errors.birth}</p>
                  ) : null}
                {data.message ? (
                  <div className="text-center mt-2">
                    <div className={`alert alert-${data.isError ? 'error' : 'success'} shadow-lg`}>
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{data.isError ? 'Error' : 'Sukses'}! {data.message}</span>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="text-center">
                  <p className="font-sans font-light py-3">
                    Belum punya akun? | <Link href={'/register'} className="text-blue-500">Registrasi</Link>
                  </p>
                </div>
                <div className="text-center">
                  <button disabled={isSubmitting} className={`btn border-none mt-2 bg-[#0E8A92] bg-opacity-90${isSubmitting ? ' loading' : ''}`}>login</button>
                </div>
              </Form>
            )}
          </Formik>
      </Container>
    </React.Fragment>
  )
}
