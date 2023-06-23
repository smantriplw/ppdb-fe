'use client';
import { Container } from '@/components/Contents/container';
import { Fields } from '@/components/Forms/fields';
import { removeNulledObject } from '@/lib/clean';
import { Routes, fetcher } from '@/lib/routes';
import { Form, Formik } from 'formik';
import Cookies from 'js-cookie';
import { Righteous } from 'next/font/google';
import { useRouter } from 'next/navigation';
import React from 'react';
import useSWR from 'swr';
import * as Yup from 'yup';

const righteous = Righteous({
    weight: '400',
    subsets: ['latin', 'latin-ext'],
});

type DataProps = {
    isError: boolean;
    message?: string;
}

export default function DaftarUlangPage() {
    const [jobs, salaries, educations, lives, trans] = [
        [
            'Tidak bekerja', 'Nelayan', 'Petani', 'Peternak',
            'PNS/TNI/Polri', 'Karyawan Swasta', 'Pedagang Kecil', 'Pedagang Besar',
            'Wiraswasta', 'Wirausaha', 'Buruh', 'Pensiunan', 'Tenaga Kerja Indonesia',
            'Karyawan BUMN', 'Tidak dapat diterapkan', 'Sudah Meninggal', 'Lainnya',
        ],
        [
            '< Rp.500.000', 'Rp.500.000 - Rp.999.999', 'Rp.1.000.000 - Rp.1.999.999',
            'Rp.2.000.000 - Rp.4.999.999', 'Rp.5.000.000 - Rp.20.000.000',
            '> Rp.20.000.000', 'Tidak Berpenghasilan',
        ],
        [
            'D1', 'D2', 'D3', 'D4',
            'Informal', 'Lainnya', 'Non formal',
            'Paket A', 'Paket B', 'Paket C', 'PAUD',
            'Putus SD', 'S1', 'S2', 'S2 Terapan', 'S3',
            'SD', 'SMP', 'SMA', 'Sp-1','Sp-2', 'Tidak sekolah', 'TK',
        ],
        [
            'Bersama orang tua', 'Wali', 'Kost', 'Asrama',
            'Panti Asuhan', 'Pesantren', 'Lainnya',
        ],
        [
            'Jalan Kaki', 'Angkutan umum/bus/pete-pete', 'Mobil/bus antar jemput',
            'Kereta Api', 'Ojek', 'Andong/bendi/sado/dokar/delman/becak',
            'Perahu penyeberangan/rakit/getek', 'Kuda', 'Sepeda',
        ]
    ];
    const daftarUlangSchema = Yup.object({
        no_kk: Yup.string().matches(/^[0-9]{16}$/, {
            message: 'No KK tidak valid',
        }).required(),
        kabupaten: Yup.string().max(255).min(4).required(),
        kecamatan: Yup.string().max(255).min(4).required(),
        no_kip: Yup.number().notRequired(),

        height_body: Yup.number().min(30).required(),
        width_body: Yup.number().required(),
        head_circumference: Yup.number().required(),
        school_distance: Yup.number().required(),
        school_est_time: Yup.number().required(),
        siblings: Yup.number().min(1).required(),
        siblings_position: Yup.number().min(1).required(),
        transportation: Yup.string().oneOf(trans).required(),
        live: Yup.string().oneOf(lives).required(),

        nik_mother: Yup.string().matches(/^[0-9]{16}$/).required(),
        birth_mother: Yup.number().required(),
        job_mother: Yup.string().oneOf(jobs).required(),
        last_edu_mother: Yup.string().oneOf(educations).required(),
        salary_mother: Yup.string().oneOf(salaries).required(),

        nik_father: Yup.string().matches(/^[0-9]{16}$/).required(),
        birth_father: Yup.number().required(),
        job_father: Yup.string().oneOf(jobs).required(),
        last_edu_father: Yup.string().oneOf(educations).required(),
        salary_father: Yup.string().oneOf(salaries).required(),

        nik_wali: Yup.string().matches(/^[0-9]{16}$/).notRequired(),
        birth_wali: Yup.number().notRequired(),
        job_wali: Yup.string().oneOf(jobs).notRequired(),
        last_edu_wali: Yup.string().oneOf(educations).notRequired(),
        salary_wali: Yup.string().oneOf(salaries).notRequired(),
    });
    const savedToken = Cookies.get('ppdb_session');
    const router = useRouter();
    const [state, setState] = React.useState<DataProps>({
        isError: false,
    });

    React.useEffect(() => {
        if (!savedToken) {
            router.push('/');
        }
    }, [router, savedToken]);

    const [route, daftarUlangRoute] = [Routes.route('auth.peserta'), Routes.route('peserta.daftar_ulang')];
    const { data, isLoading } = useSWR(route.url, url => fetcher(url, {
        headers: {
            Authorization: `Bearer ${savedToken}`,
        }
    }));
    const { data: daftarUlangData } = useSWR(data?.data?.verificator_id ? daftarUlangRoute.url : null, url => fetcher(url, {
        headers: {
            Authorization: `Bearer ${savedToken}`,
        }
    }));

    React.useEffect(() => {
        if (!isLoading && (data?.error || (data?.data && !data?.data?.verificator_id))) {
            if (data?.error) Cookies.remove('ppdb_session');
            router.push(data?.error ? '/' : '/profile');
        }
    }, [isLoading, data, router]);

    return (
        <React.Fragment>
            <div className="mb-4 py-3">
                <h1 className={`text-center text-4xl text-[#456583] font-medium ${righteous.className}`}>
                    {isLoading || !data?.data || !daftarUlangData?.data ? 'Loading...' : data?.data.verificator_id ? 'DASHBOARD DAFTAR ULANG' : 'NO ACCESS'}
                </h1>
            </div>
            {!isLoading && data?.data.verificator_id && daftarUlangData?.data && (
                <div>
                    <Container>
                        <button className="btn btn-primary bg-[#205280] border-none hover:bg-[#205280] hover:bg-opacity-75" onClick={() => router.back()}>
                            KEMBALI
                        </button>
                        <div>
                            <Formik
                                validationSchema={daftarUlangSchema}
                                initialValues={removeNulledObject({
                                    no_kk: '',
                                    kabupaten: '',
                                    kecamatan: '',
                                    no_kip: undefined,

                                    height_body: 0,
                                    width_body: 0,
                                    head_circumference: 0,
                                    school_distance: 0,
                                    school_est_time: 0,
                                    siblings: 1,
                                    siblings_position: 1,
                                    transportation: 'default',
                                    live: 'default',

                                    nik_mother: '',
                                    job_mother: '',
                                    birth_mother: 0,
                                    last_edu_mother: 'default',
                                    salary_mother: 'default',

                                    nik_father: '',
                                    job_father: '',
                                    birth_father: 0,
                                    last_edu_father: 'default',
                                    salary_father: 'default',
                                    ...daftarUlangData?.data,
                                })}
                                validateOnChange
                                onSubmit={(values, actions) => {
                                    setState({isError: false});
                                    actions.setSubmitting(true);

                                    fetcher(daftarUlangRoute.url, {
                                        headers: {
                                            Authorization: `Bearer ${savedToken}`,
                                            'Content-Type': 'application/json',
                                            'Accept': 'application/json',
                                        },
                                        method: 'POST',
                                        body: JSON.stringify(removeNulledObject(values)),
                                    }).then(res => {
                                        if (res.error || res.errors) {
                                            setState({
                                                isError: true,
                                                message: res.error || res.message,
                                            });
                                        } else {
                                            setState({
                                                isError: false,
                                                message: 'Data daftar ulang telah tersubmit',
                                            });
                                        }

                                        actions.setSubmitting(false);
                                    }).catch(e => {
                                        setState({
                                            isError: true,
                                            message: e.message,
                                        });
                                        actions.setSubmitting(false);
                                    });
                                }}
                            >
                                {(props) => (
                                    <Form>
                                        <div>
                                            <Fields _key='no_kk' type='text' placeholder='0XXXXXXXXXXXXXX' formikProps={props} label='NO KK' required />
                                            <Fields _key='kabupaten' type='text' placeholder='Sigi' formikProps={props} required label='Kabupaten' />
                                            <Fields _key='kecamatan' type='text' placeholder='Sigi Biromaru' formikProps={props} label='Kecamatan' required />
                                            <Fields _key='no_kip' type='text' placeholder='0XXXXXXXX' formikProps={props} label='NO KIP (jika ada)' required={false} />
                                            <Fields _key='height_body' type='number' placeholder='30' formikProps={props} label='Berat Badan (kg)' required />
                                            <Fields _key='width_body' type='number' placeholder='165' formikProps={props} label='Tinggi Badan (cm)' required />
                                            <Fields _key='head_circumference' type='number' placeholder='25' formikProps={props} label='Lingkar Kepala (cm)' required />
                                            <Fields _key='school_distance' type='number' placeholder='0.5' formikProps={props} label='Jarak ke Sekolah (km)' required />
                                            <Fields _key='school_est_time' type='number' placeholder='15' formikProps={props} label='Waktu tempuh ke Sekolah (menit)' required />
                                            <Fields _key='siblings' type='number' placeholder='2' formikProps={props} label='Jumlah saudara kandung' required />
                                            <Fields _key='siblings_position' type='number' placeholder='1' formikProps={props} label='Saudara ke berapa?' required />
                                            <Fields _key='live' type='text' selects={lives} placeholder='' formikProps={props} label='Tinggal dengan?' required />
                                            <Fields _key='transportation' type='text' selects={trans} formikProps={props} placeholder='' label='Transportasi' required />

                                            <hr className="border-t-black border-t-2 mt-5" />

                                            <Fields _key='nik_father' type='string' placeholder='0XXXXXXX' formikProps={props} label='NIK Ayah' required />
                                            <Fields _key='birth_father' type='number' placeholder='1970' formikProps={props} label='Tahun Lahir Ayah' required />
                                            <Fields _key='job_father' type='text' selects={jobs} placeholder='' formikProps={props} label='Pekerjaan Ayah' required />
                                            <Fields _key='salary_father' type='text' selects={salaries} placeholder='' formikProps={props} label='Gaji Ayah' required />
                                            <Fields _key='last_edu_father' type='text' selects={educations} placeholder='' formikProps={props} label='Pendidikan Terakhir' required />

                                            <hr className="border-t-black border-t-2 mt-5" />

                                            <Fields _key='nik_mother' type='string' placeholder='0XXXXXXX' formikProps={props} label='NIK Ibu' required />
                                            <Fields _key='birth_mother' type='number' placeholder='1970' formikProps={props} label='Tahun Lahir Ibu' required />
                                            <Fields _key='job_mother' type='text' selects={jobs} placeholder='' formikProps={props} label='Pekerjaan Ibu' required />
                                            <Fields _key='salary_mother' type='text' selects={salaries} placeholder='' formikProps={props} label='Gaji Ibu' required />
                                            <Fields _key='last_edu_mother' type='text' selects={educations} placeholder='' formikProps={props} label='Pendidikan Terakhir' required />

                                            <hr className="border-t-black border-t-2 mt-5" />

                                            <Fields _key='nik_wali' type='string' placeholder='0XXXXXXX' formikProps={props} label='NIK Wali' required={false} />
                                            <Fields _key='birth_wali' type='number' placeholder='1970' formikProps={props} label='Tahun Lahir Wali' required={false} />
                                            <Fields _key='job_wali' type='text' selects={jobs} placeholder='' formikProps={props} label='Pekerjaan Wali' required={false} />
                                            <Fields _key='salary_wali' type='text' selects={salaries} placeholder='' formikProps={props} label='Gaji Wali' required={false} />
                                            <Fields _key='last_edu_wali' type='text' selects={educations} placeholder='' formikProps={props} label='Pendidikan Terakhir' required />
                                        </div>
                                        <div className="text-center py-4">
                                            {state.message ? (
                                                <div className="text-center mt-2">
                                                    <div className={`alert alert-${state.isError ? 'error' : 'success'} shadow-sm`}>
                                                            {state.isError ?
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                : <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            }
                                                            <span>{state.isError ? 'Error' : 'Sukses'}! {data.message}</span>
                                                    </div>
                                                </div>
                                            ) : null}
                                            <div className="text-center">
                                                <button disabled={props.isSubmitting} className={`text-white btn border-none mt-2 btn-neutral bg-[#0E8A92] bg-opacity-90${props.isSubmitting ? ' loading' : ''}`}>
                                                    {props.isSubmitting ? 'submitting' : 'submit'}
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </Container>
                </div>
            )}
        </React.Fragment>
    )
}