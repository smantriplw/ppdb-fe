'use client';
import React from 'react';
import { Righteous } from 'next/font/google';
import { Container } from '@/components/Contents/container';
import { RegisterIcon } from '@/components/Forms/register_icon';
import { FormField } from '@/components/Forms/field';
import Link from 'next/link';
import { type JalurPendaftaran, NisnShareContext } from '@/contexts/nisn_shared';
import { Routes } from '@/lib/routes';
import { useReCaptcha } from 'next-recaptcha-v3';

const righteous = Righteous({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
});

type CurrentFormState = {
  loading: boolean;
  errorMessage?: string;

  nisn: string;
  type: JalurPendaftaran;
}

export default function Register() {
  const [formState, setFormState] = React.useState<CurrentFormState>({
    loading: false,
    errorMessage: '',
    nisn: '',
    type: 'zonasi',
  });
  const { executeRecaptcha } = useReCaptcha();

  const router = Routes.route('archives.check');

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (
    ev
  ) => {
    ev.preventDefault();
    setFormState({
      ...formState,
      loading: true,
    });

    if (!executeRecaptcha) {
      setFormState({
        ...formState,
        loading: false,
        errorMessage: 'Recaptcha doesn\'t ready yet',
      });
      return;
    }
    if (!/[0-9]{10}/.test(formState.nisn)) {
      setFormState({
        ...formState,
        loading: false,
        errorMessage: 'NISN tidak valid',
      });
      return;
    }

    const token = await executeRecaptcha('check');
    fetch(router.url, {
      method: 'POST',
      body: JSON.stringify({
        nisn: formState.nisn,
        type: formState.type,
        '_gtoken': token,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(res => res.json()).then(res => {
      if (res.error || res.errors) {
        setFormState({
          ...formState,
          loading: false,
          errorMessage: res.error || res.message,
        });
      }
    });
  }

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
        <form action="#" onSubmit={submitHandler}>
          {formState.errorMessage?.length ? (
            <div className="alert alert-error shadow-lg">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{formState.errorMessage}</span>
              </div>
            </div>
          ) : ''}
          <FormField label="" labelKey="NISN">
            <input value={formState.nisn} onChange={(ev) => setFormState({...formState, nisn: ev.target.value})} type="number" placeholder="00XXXXXXXXXXXXX" className="input input-bordered w-screen max-w-xs" disabled={formState.loading} name="nisn" />
          </FormField>
          <FormField label="" labelKey="JALUR">
            <select value={formState.type} className="select max-w-xs font-normal w-screen" name="jalur" onChange={(ev) => setFormState({...formState, type: ev.target.value.toLowerCase() as JalurPendaftaran})} required disabled={formState.loading}>
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
          <div className="text-center">
            <button disabled={formState.loading} type="submit" className={`btn border-none mt-2 bg-[#0E8A92] bg-opacity-90${formState.loading ? ' loading' : ''}`}>
              {formState.loading ? 'checking' : 'register'}
            </button>
          </div>
          <div>
            <p className="font-sans font-light text-center py-3">
              Sudah memiliki akun? <Link className="text-blue-500" href={'/'}>login</Link> aja
            </p>
          </div>
        </form>
      </Container>
    </React.Fragment>
  )
}
