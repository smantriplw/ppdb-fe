import React from 'react';
import { Righteous } from 'next/font/google';
import { Container } from '@/components/Contents/container';
import { RegisterIcon } from '@/components/Forms/register_icon';
import { FormField } from '@/components/Forms/field';

const righteous = Righteous({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
});

export default function Home() {
  return (
    <React.Fragment>
      <div className="mb-4">
        <div className="flex justify-center">
          <RegisterIcon />
          <h1>
          </h1>
        </div>

        <h1 className={`text-center text-4xl text-[#456583] font-medium ${righteous.className}`}>
          REGISTRASI
        </h1>
      </div>
      <Container>
        <FormField label="" labelKey="NISN">
        <input type="number" placeholder="00XXXXXXXXXXXXX" className="input input-bordered w-screen max-w-xs" />
        </FormField>
        <FormField label="" labelKey="JALUR">
          <select className="select max-w-xs w-screen font-normal">
              <option>Zonasi</option>
              <option>Prestasi</option>
              <option>Afirmasi</option>
              <option>Mutasi</option>
          </select>
        </FormField>
        <div>
          <p className="font-sans text-center text-[#FF0000] text-opacity-80">
            *Pemilihan jalur hanya satu kali, dan <span className="font-bold uppercase">tidak dapat</span> dirubah
          </p>
        </div>
        <button className="btn border-none mt-2 bg-[#0E8A92] bg-opacity-90">register</button>
      </Container>
    </React.Fragment>
  )
}
