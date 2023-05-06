'use client';
import React from 'react';
import { Righteous } from 'next/font/google';
import { Container } from '@/components/Contents/container';
import { RegisterIcon } from '@/components/Forms/register_icon';
import { FormField } from '@/components/Forms/field';
import Link from 'next/link';
import { JalurPendaftaran, NisnShareContext } from '@/contexts/nisn_shared';

const righteous = Righteous({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
});

export default function Register() {
  let state = React.useContext(NisnShareContext);

  return (
    <React.Fragment>
      <div className="mb-4">
        <div className="flex justify-center">
          <RegisterIcon />
        </div>

        <h1 className={`text-center text-4xl text-[#456583] font-medium ${righteous.className}`}>
          REGISTRASI
        </h1>
      </div>
      <Container>
        <FormField label="" labelKey="NISN">
        <input value={state.nisn === 0 ? undefined : state.nisn} onChange={(ev) => state.setValue('nisn', parseInt(ev.target.value, 10))} type="number" placeholder="00XXXXXXXXXXXXX" className="input input-bordered w-screen max-w-xs" name="nisn" />
        </FormField>
        <FormField label="" labelKey="JALUR">
          <select value={state.jalur} className="select max-w-xs font-normal w-screen" name="jalur" onChange={(ev) => state.setValue('jalur', ev.target.value.toLowerCase() as JalurPendaftaran)}>
              <option value={'zonasi'}>Zonasi</option>
              <option value={'prestasi'}>Prestasi</option>
              <option value={'afirmasi'}>Afirmasi</option>
              <option value={'mutasi'}>Mutasi</option>
          </select>
        </FormField>
        <div>
          <p className="font-sans text-center text-[#FF0000] text-opacity-80">
            *Pemilihan jalur hanya satu kali, dan <span className="font-bold uppercase">tidak dapat</span> dirubah
          </p>
        </div>
        <button className="btn border-none mt-2 bg-[#0E8A92] bg-opacity-90">register</button>
        <div>
          <p className="font-sans font-light text-center py-3">
            Sudah memiliki akun? <Link className="text-blue-500" href={'/'}>login</Link> aja
          </p>
        </div>
      </Container>
    </React.Fragment>
  )
}
