import { Container } from '@/components/Contents/container'
import { Modal } from '@/components/Contents/modal';
import { FormField } from '@/components/Forms/field';
import { parsedate } from '@/lib/date';
import { Routes } from '@/lib/routes';
import { SharedData } from '@/resources/shared';
import { Field, Form, Formik } from 'formik';
import { useReCaptcha } from 'next-recaptcha-v3';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useBoolean } from 'usehooks-ts';
import * as Yup from 'yup'

const daftarSchema = Yup.object()
    .shape({
        nik: Yup.string().matches(/^[0-9]{16}$/, {
            message: 'NIK must be 16 chars',
        }),
        name: Yup.string().required().min(3),
        gender: Yup.string().oneOf(['L', 'P']).required(),
        religion: Yup.string().required().oneOf(['islam', 'kristen', 'katolik', 'hindu', 'buddha', 'konghucu']),
        mother_name: Yup.string().required().min(3),
        father_name: Yup.string().required().min(3),
        birthday: Yup.string().required().matches(/^([a-zA-Z]+)(\s+)?,\s+([0-9]+)\s+([a-zA-Z]+)\s+([0-9]+)$/gi, 'Format: "NAMA TEMPAT, TANGGAL BULAN TAHUN"'),
        email: Yup.string().required().email(),
        phone: Yup.string().required().matches(/[0-9]{10,14}/, 'Phone number must be 11 or 12 digits'),
        graduated_year: Yup.number().required(),
        school: Yup.string().required().min(10).max(50),
        address: Yup.string().required().min(5).max(50),
    });

export const DetailsSubPage = (props:{ isNew: boolean; } & SharedData) => {
    const [fetchError, setFetchError] = React.useState('');
    const [data, setData] = React.useState<{
        nisn: string;
        birthday: string;
    }>();

    const nextRouter = useRouter();
    const { executeRecaptcha } = useReCaptcha();

    return (
        <React.Fragment>
            <div>
                <Container>
                    <div>
                        <Formik
                            validationSchema={daftarSchema}
                            onSubmit={async (values, helpers) => {
                                helpers.setSubmitting(true);
                                helpers.setErrors({});

                                if (!executeRecaptcha) {
                                    setFetchError('reCaptcha doesn\'t ready yet');
                                    helpers.setSubmitting(false);
                                    return;
                                }

                                const tokenCaptcha = await executeRecaptcha('create');
                                if (props.isNew) {
                                    const router = Routes.route('archives.create');

                                    fetch(router.url, {
                                        method: router.method,
                                        body: JSON.stringify(Object.assign(values, {
                                            type: props.jalur,
                                            nisn: props.nisn,
                                            _gtoken: tokenCaptcha,
                                        })),
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                    }).then(res => res.json()).then(res => {
                                        if (res.errors || res.error) {
                                            setFetchError(res.error || res.message);
                                            helpers.setSubmitting(false);
                                        } else {
                                            setData(res.data);
                                            helpers.setSubmitting(false);
                                        }
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
                            }}
                        >
                            {({ errors, touched, isSubmitting }) => (
                                <Form>
                                    <FormField label="NIK">
                                        <Field disabled={isSubmitting} className="input max-w-xs w-full" type="number" name="nik" placeholder="00XXXXXXXXXXXXX" required />
                                        {errors.nik && touched.nik ? (
                                            <p className="text-red-500">{errors.nik}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="NAMA">
                                        <Field disabled={isSubmitting} className="input max-w-xs w-full" type="text" name="name" placeholder="Contoh: Hanif Dwy Putra S" required />
                                        {errors.name && touched.name ? (
                                            <p className="text-red-500">{errors.name}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="GENDER">
                                        <select disabled={isSubmitting} defaultValue={'L'} name="gender" className="max-w-xs font-normal w-screen select" required>
                                            <option value="L">Laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                        {errors.gender && touched.gender ? (
                                            <p className="text-red-500">{errors.gender}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="AGAMA">
                                        <select disabled={isSubmitting} defaultValue={'islam'} name="religion" className="max-w-xs font-normal w-screen select" required>
                                            <option value="islam">Islam</option>
                                            <option value="kristen">Kristen</option>
                                            <option value="katolik">Katolik</option>
                                            <option value="hindu">Hindu</option>
                                            <option value="Buddha">Buddha</option>
                                            <option value="konghucu">Konghucu</option>
                                        </select>
                                        {errors.religion && touched.religion ? (
                                            <p className="text-red-500">{errors.religion}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="NAMA IBU">
                                        <Field disabled={isSubmitting} className="input max-w-xs w-full" type="text" name="mother_name" placeholder="Contoh: Puan Maharani" required />
                                        {errors.mother_name && touched.mother_name ? (
                                            <p className="text-red-500">{errors.mother_name}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="NAMA AYAH">
                                        <Field disabled={isSubmitting} className="input max-w-xs w-full" type="text" name="father_name" placeholder="Contoh: Erick Tohir" required />
                                        {errors.father_name && touched.father_name ? (
                                            <p className="text-red-500">{errors.father_name}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="TTL">
                                        <Field disabled={isSubmitting} className="input max-w-xs w-full" type="text" name="birthday" placeholder="Contoh: Palu, 24 Maret 2007" required />
                                        {errors.birthday && touched.birthday ? (
                                            <p className="text-red-500 break-words">{errors.birthday}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="EMAIL">
                                        <Field disabled={isSubmitting} className="input max-w-xs w-full" type="email" name="email" placeholder="Masukan email aktif disini, contoh: hansputera@sman3palu.sch.id" required />
                                        {errors.email && touched.email ? (
                                            <p className="text-red-500">{errors.email}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="NO. TELP">
                                        <Field disabled={isSubmitting} className="input max-w-xs w-full" type="tel" name="phone" placeholder="Masukan nomor telepon aktif untuk dihubungi. Contoh: 6281346757451" required />
                                        {errors.phone && touched.phone ? (
                                            <p className="text-red-500">{errors.phone}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="TAHUN LULUS">
                                        <Field disabled={isSubmitting} className="input max-w-xs w-full" type="number" name="graduated_year" placeholder="Kamu lulus SMP kapan? Contoh: 2019" required />
                                        {errors.graduated_year && touched.graduated_year ? (
                                            <p className="text-red-500">{errors.graduated_year}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="ASAL SEKOLAH">
                                        <Field disabled={isSubmitting} className="input max-w-xs w-full" type="text" name="school" placeholder="Kamu asal sekolah mana? Masukin disini ya, contohnya: SMP Negeri 6 Palu" required />
                                        {errors.school && touched.school ? (
                                            <p className="text-red-500">{errors.school}</p>
                                        ) : null}
                                    </FormField>
                                    <FormField label="ALAMAT">
                                        <Field disabled={isSubmitting} className="input max-w-xs w-full" type="text" name="address" placeholder="Kamu tinggal dimana? Masukin disini ya. Contohnya: Jl. Bikini Bottom, Blok 16" required/>
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
                                        <button disabled={isSubmitting || !!data} type="submit" className={`btn border-none bg-[#0E8A92] bg-opacity-90${isSubmitting || !!data ? ' loading' : ''}`}>
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
                    PENDAFTARAN BERHASIL
               </h3>

               <p className="py-4">
                    Mohon simpan data dibawah ini disimpan untuk digunakan login di halaman berikutnya:<br />
                    Username: <span className="font-bold">{data?.nisn}</span><br />
                    Password: <span className="font-bold">{parsedate(data?.birthday!)}</span>
               </p>

               <div className="modal-action mt-4">
                <button className="btn btn-primary" onClick={() => {
                    nextRouter.push('/');
                }}>OK</button>
               </div>
            </Modal>
        </React.Fragment>
    )
}