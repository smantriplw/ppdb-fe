'use client';
import React from 'react';
import { Righteous } from 'next/font/google';
import { Container } from '@/components/Contents/container';
import { LoginIcon } from '@/components/Forms/login_icon';
import { FormField } from '@/components/Forms/field';
import Link from 'next/link';
import { NisnShareContext } from '@/contexts/nisn_shared';

const righteous = Righteous({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
});

export default function Login() {
  const state = React.useContext(NisnShareContext);

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
        <div className="max-w-screen">
          <FormField labelKey="NISN" label="">
            <input value={state.nisn === 0 ? undefined : state.nisn} onChange={(ev) => state.setValue('nisn', parseInt(ev.target.value, 10))} type="number" placeholder="00XXXXXXXXXXXXX" className="input input-bordered w-full max-w-xs" name="nisn" />
          </FormField>
          <FormField labelKey="TTL" label="">
            <input value={state.ttl} onChange={(ev) => state.setValue('ttl', ev.target.value)} type="text" placeholder="Palu, 24 Maret 2008" className="input input-bordered w-full max-w-xs" name="ttl" />
          </FormField>
        </div>

        <div>
          <p className="font-sans font-light py-3">
            Belum punya akun? | <Link href={'/register'} className="text-blue-500">Registrasi</Link>
          </p>
        </div>
        <button className="btn border-none mt-2 bg-[#0E8A92] bg-opacity-90">login</button>
      </Container>
    </React.Fragment>
  )
}
