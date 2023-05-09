'use client';
import React from 'react';
import { Righteous } from 'next/font/google';
import { Container } from '@/components/Contents/container';
import { RegisterIcon } from '@/components/Forms/register_icon';
import { FormField } from '@/components/Forms/field';
import Link from 'next/link';
import { Routes } from '@/lib/routes';
import { useReCaptcha } from 'next-recaptcha-v3';
import { DetailsSubPage } from '@/subpages/details';
import { type JalurPendaftaran } from '@/resources/shared';
import { Field, Form, Formik } from 'formik';
import { useBoolean } from 'usehooks-ts';
import * as Yup from 'yup';

const righteous = Righteous({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
});

const registerSchema = Yup.object()
  .shape({
    nisn: Yup.string().required().matches(/^[0-9]{10}$/g, 'NISN harus 10 karakter'),
    type: Yup.string().required().oneOf(['zonasi', 'prestasi', 'afirmasi', 'mutasi']),
});

export default function Register() {
  const [error, setError] = React.useState('');
  const { value: pass, toggle: togglePass } = useBoolean();
  const [data, setData] = React.useState<{
    nisn: string;
    type: JalurPendaftaran;
  }>();

  const { executeRecaptcha } = useReCaptcha();

  return (
    <React.Fragment>
      <div className="mb-4">
          <div className="flex justify-center">
            <RegisterIcon />
          </div>

          <h1 className={`text-center text-4xl text-[#456583] font-medium ${righteous.className}`}>
            REGISTRASI
          </h1>
          <div className="text-center">
            <ul className="steps steps-vertical lg:steps-horizontal">
              <li className="step step-primary">Validasi</li>
              <li className={`step${pass ? ' step-primary' : ''}`}>Pendataan</li>
            </ul>
          </div>
        </div>
        {!pass ? (
        <Container>
          <div>
            <Formik
              validationSchema={registerSchema}
              onSubmit={(values, helpers) => {
                helpers.setSubmitting(true);
                setError('');

                const router = Routes.route('archives.check');

                executeRecaptcha('check').then(token => {
                  fetch(router.url, {
                    method: router.method,
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      ...values,
                      _gtoken: token,
                    }),
                  }).then(res => res.json()).then(res => {
                    if (res.error || res.errors) {
                      setError(res.error || res.message);
                      helpers.setSubmitting(false);
                    } else {
                      helpers.setSubmitting(false);
                      setData({
                        nisn: values.nisn,
                        type: values.type as JalurPendaftaran,
                      });
                      togglePass();
                    }
                  }).catch(e => {
                    helpers.setSubmitting(false);
                    setError(e.message);
                  });
                }).catch(e => {
                  setError(e.message);
                  helpers.setSubmitting(false);
                });
              }}

              initialValues={{
                nisn: '',
                type: 'zonasi'
              }} 
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="items-center justify-center">
                  {error.length ? (
                    <div className="alert alert-error shadow-sm">
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{error}</span>
                      </div>
                    </div>
                  ) : null}
                  <FormField label="" labelKey="NISN">
                    <Field type="number" placeholder="00XXXXXXXXXXXXX" className="input input-bordered w-full max-w-xs" disabled={isSubmitting} name="nisn" />
                  </FormField>
                  {errors.nisn && touched.nisn ? (
                      <p className="text-red-500">{errors.nisn}</p>
                    ) : null}
                  <FormField label="" labelKey="JALUR">
                    <Field as="select" className="select max-w-xs font-normal w-72 md:w-2/3" name="type" required disabled={isSubmitting}>
                      <option value={'zonasi'}>Zonasi</option>
                      <option value={'prestasi'}>Prestasi</option>
                      <option value={'afirmasi'}>Afirmasi</option>
                      <option value={'mutasi'}>Mutasi</option>
                    </Field>
                  </FormField>
                  {errors.type && touched.type ? (
                      <p className="text-red-500">{errors.type}</p>
                    ) : null}
                  <div className="text-center">
                    <p className="font-sans text-[#FF0000] text-opacity-80">
                      *Pemilihan jalur hanya satu kali, dan <span className="font-bold uppercase">tidak dapat</span> dirubah
                    </p>

                    <p className="font-sans font-light text-center py-3">
                      Sudah memiliki akun? <Link className="text-blue-500" href={'/'}>login</Link> aja
                    </p>
                  </div>
                  <div className="text-center">
                    <button disabled={isSubmitting} className={`btn border-none mt-2 bg-[#0E8A92] bg-opacity-90${isSubmitting ? ' loading' : ''}`}>
                      {isSubmitting ? 'checking' : 'register'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          </Container>
      ) : (
        <DetailsSubPage isNew={true} nisn={data?.nisn} jalur={data?.type} />
      )}
    </React.Fragment>
  )
}
