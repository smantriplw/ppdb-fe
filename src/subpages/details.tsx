import { Container } from '@/components/Contents/container'
import { Modal } from '@/components/Contents/modal';
import { FormField } from '@/components/Forms/field';
import { isValidDate, parsedate, parsedate2, replaceDateWithMaps } from '@/lib/date';
import { Routes } from '@/lib/routes';
import { SharedData } from '@/resources/shared';
import { Field, Form, Formik } from 'formik';
import { useReCaptcha } from 'next-recaptcha-v3';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useBoolean } from 'usehooks-ts';
import * as Yup from 'yup'

declare module 'yup' {
    interface StringSchema {
        lahir(msg: string): this;
    }
  }

Yup.addMethod(Yup.string, 'lahir', function(this: Yup.StringSchema, msg: string) {
    return this.test({
        name: 'lahir',
        message: msg,
        test: (v) => {
            return isValidDate(replaceDateWithMaps(v?.split(',').at(-1)?.trim() ?? ''));
        },
    });
});

const daftarSchema = Yup.object()
    .shape({
        nik: Yup.string().matches(/^[0-9]{16}$/, {
            message: 'NIK must be 16 chars',
        }),
        name: Yup.string().required().min(3),
        gender: Yup.string().oneOf(['L', 'P']),
        religion: Yup.string().oneOf(['islam', 'kristen', 'katolik', 'hindu', 'buddha', 'konghucu']),
        mother_name: Yup.string().required().min(3),
        father_name: Yup.string().required().min(3),
        birthday: Yup.string().matches(/^([a-zA-Z\s-]+)(\s+)?,\s+([0-9]+)\s+([a-zA-Z]+)\s+([0-9]{4})$/gi, 'Format: "NAMA TEMPAT, TANGGAL BULAN TAHUN"').lahir('Pastikan nama bulan dan tanggal sesuai'),
        email: Yup.string().email(),
        phone: Yup.string().matches(/^(08[0-9]{9,10})$/, 'Phone number must be 11 or 12 digits'),
        graduated_year: Yup.number().required(),
        school: Yup.string().min(10).max(50),
        address: Yup.string().min(5).max(50),
    });

export const DetailsSubPage = (props:{ isNew: boolean; token?: string; } & SharedData) => {
    const [fetchError, setFetchError] = React.useState('');
    const [data, setData] = React.useState<{
        nisn: string;
        birthday: string;
    }>();
    const router = useRouter();
    const { value: wait, toggle: toggleWait } = useBoolean(false);

    const nextRouter = useRouter();
    const { executeRecaptcha } = useReCaptcha();

    return (
        <React.Fragment>
            <div>
                <Container>
                    <button className="btn btn-primary bg-[#205280] border-none hover:bg-[#205280] hover:bg-opacity-75" onClick={() => router.back()}>
                        KEMBALI
                    </button>
                    <div>
                        <Formik
                            validationSchema={daftarSchema}
                            onSubmit={async (values, helpers) => {
                                helpers.setSubmitting(true);
                                helpers.setErrors({});
                                toggleWait();

                                if (!executeRecaptcha) {
                                    setFetchError('reCaptcha doesn\'t ready yet');
                                    helpers.setSubmitting(false);
                                    return;
                                }

                                const tokenCaptcha = await executeRecaptcha('create');
                                if (props.isNew) {
                                    const formatter = new Intl.DateTimeFormat('id-ID', {
                                        month: 'long',
                                        day: '2-digit',
                                        year: 'numeric',
                                    });
                                    const router = Routes.route('archives.create');
                                    fetch(router.url, {
                                        method: router.method,
                                        body: JSON.stringify({
                                            ...values,
                                            type: props.jalur,
                                            nisn: props.nisn,
                                            birthday: values.birthday.split(',').at(0) + ', ' + formatter.format(parsedate2(values.birthday)),
                                            _gtoken: tokenCaptcha,
                                        }),
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                    }).then(res => res.json()).then(res => {
                                        if (res.errors || res.error) {
                                            setFetchError(res.error || res.message);
                                            helpers.setSubmitting(false);
                                            toggleWait();
                                        } else {
                                            setData(res.data);
                                            helpers.setSubmitting(false);
                                            toggleWait();
                                        }
                                    }).catch((e) => {
                                        setFetchError(e.message);
                                        toggleWait();
                                    });
                                } else {
                                    const router = Routes.route('archives.edit.details');
                                    fetch(router.url, {
                                        method: router.method,
                                        body: JSON.stringify(Object.assign(values, {
                                            type: props.jalur,
                                            nisn: props.nisn,
                                        })),
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${props.token}`
                                        },
                                    }).then(res => res.json()).then(res => {
                                        if (res.errors || res.error) {
                                            setFetchError(res.error || res.message);
                                            helpers.setSubmitting(false);
                                            toggleWait();
                                        } else {
                                            setData(res.data);
                                            helpers.setSubmitting(false);
                                        }
                                    }).catch((e) => {
                                        setFetchError(e.message);
                                        toggleWait();
                                    });
                                }
                            }}
                            initialValues={{
                                nik: '',
                                name: '',
                                gender: 'L',
                                religion: 'islam',
                                mother_name: '',
                                father_name: '',
                                birthday: '',
                                email: '',
                                phone: '',
                                graduated_year: '2023',
                                school: '',
                                address: '',
                                ...props,
                            }}
                            validateOnChange
                        >
                            {({ errors, touched, isSubmitting, handleChange }) => (
                                <Form>
                                    <FormField label="NIK">
                                        <Field onChange={handleChange} disabled={isSubmitting} className="input max-w-xs w-full" type="number" name="nik" placeholder="00XXXXXXXXXXXXX" required />
                                        {errors.nik && touched.nik ? (
                                            <p className="text-red-500">{errors.nik}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="NAMA">
                                        <Field onChange={handleChange} disabled={isSubmitting} className="input max-w-xs w-full" type="text" name="name" placeholder="Contoh: Hanif Dwy Putra S" required />
                                        {errors.name && touched.name ? (
                                            <p className="text-red-500">{errors.name}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="GENDER">
                                        <Field onChange={handleChange} as="select" disabled={isSubmitting} defaultValue={'L'} name="gender" className="max-w-xs font-normal w-screen select" required>
                                            <option value="L">Laki</option>
                                            <option value="P">Perempuan</option>
                                        </Field>
                                        {errors.gender && touched.gender ? (
                                            <p className="text-red-500">{errors.gender}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="AGAMA">
                                        <Field onChange={handleChange} as="select" disabled={isSubmitting} defaultValue={'islam'} name="religion" className="max-w-xs font-normal w-screen select" required>
                                            <option value="islam">Islam</option>
                                            <option value="kristen">Kristen</option>
                                            <option value="katolik">Katolik</option>
                                            <option value="hindu">Hindu</option>
                                            <option value="buddha">Buddha</option>
                                            <option value="konghucu">Konghucu</option>
                                        </Field>
                                        {errors.religion && touched.religion ? (
                                            <p className="text-red-500">{errors.religion}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="NAMA IBU">
                                        <Field onChange={handleChange} disabled={isSubmitting} className="input max-w-xs w-full" type="text" name="mother_name" placeholder="Contoh: Puan Maharani" required />
                                        {errors.mother_name && touched.mother_name ? (
                                            <p className="text-red-500">{errors.mother_name}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="NAMA AYAH">
                                        <Field onChange={handleChange} disabled={isSubmitting} className="input max-w-xs w-full" type="text" name="father_name" placeholder="Contoh: Erick Tohir" required />
                                        {errors.father_name && touched.father_name ? (
                                            <p className="text-red-500">{errors.father_name}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="TTL">
                                        <Field onChange={handleChange} disabled={props.isNew ? isSubmitting : true} className="input max-w-xs w-full" type="text" name="birthday" placeholder="Contoh: Palu, 24 Maret 2007" required />
                                        {errors.birthday && touched.birthday ? (
                                            <p className="text-red-500 break-words">{errors.birthday}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="EMAIL">
                                        <Field onChange={handleChange} disabled={isSubmitting} className="input max-w-xs w-full" type="email" name="email" placeholder="Masukan email aktif disini, contoh: hansputera@sman3palu.sch.id" required />
                                        {errors.email && touched.email ? (
                                            <p className="text-red-500">{errors.email}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="NO. TELP">
                                        <Field onChange={handleChange} disabled={isSubmitting} className="input max-w-xs w-full" type="tel" name="phone" placeholder="Masukan nomor telepon aktif untuk dihubungi. Contoh: 6281346757451" required />
                                        {errors.phone && touched.phone ? (
                                            <p className="text-red-500">{errors.phone}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="TAHUN LULUS">
                                        <Field onChange={handleChange} disabled={isSubmitting} className="input max-w-xs w-full" type="number" name="graduated_year" placeholder="Kamu lulus SMP kapan? Contoh: 2019" required />
                                        {errors.graduated_year && touched.graduated_year ? (
                                            <p className="text-red-500">{errors.graduated_year}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="ASAL SEKOLAH">
                                        <Field onChange={handleChange} disabled={isSubmitting} className="input max-w-xs w-full" type="text" name="school" placeholder="Kamu asal sekolah mana? Masukin disini ya, contohnya: SMP Negeri 6 Palu" required />
                                        {errors.school && touched.school ? (
                                            <p className="text-red-500">{errors.school}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="ALAMAT">
                                        <Field onChange={handleChange} disabled={isSubmitting} className="input max-w-xs w-full" type="text" name="address" placeholder="Kamu tinggal dimana? Masukin disini ya. Contohnya: Jl. Bikini Bottom, Blok 16" required/>
                                        {errors.address && touched.address ? (
                                            <p className="text-red-500">{errors.address}</p>
                                        ) : null}
                                    </FormField>
                                    <div className="text-center py-3">
                                        {fetchError.length ? (
                                            <div className="alert alert-error">
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    <span>{fetchError}</span>
                                                </div>
                                            </div>
                                        ) : null}
                                        <button disabled={wait} type="submit" className={`btn border-none bg-[#0E8A92] bg-opacity-90${wait ? ' loading' : ''}`}>
                                            submit
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </Container>
            </div>

            <Modal opened={!!data} onClose={() => {
                nextRouter.push('/');
            }}>
               <h3 className="font-bold text-2xl">
                    {props.isNew ? 'PENDAFTARAN BERHASIL' : 'UBAH DATA BERHASIL' }
               </h3>

               <p className="py-4">
                    {props.isNew ? (
                        <>
                            Mohon simpan data dibawah ini untuk digunakan login di halaman berikutnya:<br />
                            Username: <span className="font-bold">{data?.nisn}</span><br />
                            Password: <span className="font-bold">{parsedate(data?.birthday!)}</span>
                        </>
                    ) : (
                        <>
                            Ubah data berhasil, Anda akan dikembalikan ke halaman utama
                        </>
                    )}
               </p>

               <div className="modal-action mt-4">
                <button className="btn btn-primary" onClick={() => {
                    nextRouter.push(props.isNew ? '/' : '/profile');
                }}>OK</button>
               </div>
            </Modal>
        </React.Fragment>
    )
}