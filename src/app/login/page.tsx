import React from 'react';
import { Righteous } from 'next/font/google';
import { Container } from '@/components/Contents/container';
import { LoginIcon } from '@/components/Forms/login_icon';
import { FormField } from '@/components/Forms/field';

const righteous = Righteous({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
});

export default function Login() {
  return (
    <React.Fragment>
      <div className="mb-4">
        <div className="flex justify-center">
          <LoginIcon />
          <h1>
          </h1>
        </div>

        <h1 className={`text-center text-4xl text-[#456583] font-medium ${righteous.className}`}>
          LOGIN
        </h1>
      </div>
      <Container>
        <FormField labelKey="NISN" label="">
          <input type="number" placeholder="00XXXXXXXXXXXXX" className="input input-bordered w-screen max-w-xs" />
        </FormField>
        <FormField labelKey="TTL" label="">
          <input type="text" placeholder="Palu, 24 Maret 2008" className="input input-bordered w-screen max-w-xs" />
        </FormField>
        <button className="btn border-none mt-2 bg-[#0E8A92] bg-opacity-90">login</button>
      </Container>
    </React.Fragment>
  )
}
