import { FormField } from '@/components/Forms/field';
import { berkases } from '@/lib/berkas_type';
import { Routes } from '@/lib/routes';
import { JalurPendaftaran } from '@/resources/shared';
import { Field, Form, Formik } from 'formik';
import React from 'react';

type BerkasHardSubPageProps = {
    type: JalurPendaftaran;
    skhu_path?: string;
    kk_path?: string;
    certificate_path?: string;
    kip_path?: string;
    mutation_path?: string;
    photo_path?: string;
    token: string;
}

export const BerkasHardSubPage = (props: BerkasHardSubPageProps) => {
    const p = berkases[props.type];
    const [files, setFiles] = React.useState<{
        photo?: File;
        skhu?: File;
        kk?: File;
        certificate?: File;
        kip?: File;
        mutation?: File;
    }>({});
    const [data, setData] = React.useState<{
        isError: boolean;
        message?: string;
    }>({
        isError: false,
    });

    const handleFileChange = <K extends keyof typeof files>(
        key: string,
        file: File,
        setFieldErr?: (field: K, message: string | undefined) => void,
    ) => {
        setData({isError: false});
        setFiles({ ...files, [key as K]: undefined });
        if (!file) {
            if (setFieldErr)
                setFieldErr(key as K, 'Couldn\'t process this file');
            setData({
                isError: true,
                message: `Couldn't process ${key} file, reupload please`,
            });

            return 0;
        }

        if (Math.floor(file.size / 1024 / 1024) > 1) {
            if (setFieldErr)
                setFieldErr(key as K, 'Maximum file size reached');
            setData({
                isError: true,
                message: `Couldn't process ${key} file, your file has a bigger size`,
            });

            return 0;
        }
        if (!/^(application|image)\/(png|jpeg|jpg|pdf)$/gi.test(file.type)) {
            if (setFieldErr)
                setFieldErr(key as K, 'Invalid mimetype');
            setData({
                isError: true,
                message: `${key} file is invalid`,
            });
            return 0;
        }

        if (setFieldErr) setFieldErr(key as K, undefined);
        setFiles({
            ...files,
            [key]: file,
        });

        return 1;
    }

    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    photo: undefined,
                    skhu: undefined,
                    [p.key]: undefined,
                }}
                onSubmit={(_, helpers) => {
                    helpers.setSubmitting(true);
                    setData({isError: false});

                    for (const file of Object.keys(files)) {
                        if (!handleFileChange(file, files[file as keyof typeof files]!)) {
                            if (!data.message?.length) setData({
                                isError: true,
                                message: `${file} is invalid`,
                            });
                            break;
                        }
                    }

                    if (data.isError) {
                        helpers.setSubmitting(false);
                        return;
                    }

                    const route = Routes.route('archives.edit.files');
                    const form = new FormData();

                    for (const file of Object.keys(files)) {
                        const fl = files[file as keyof typeof files]!;
                        form.set(file, fl, fl.name);
                    }

                    fetch(route.url, {
                        method: route.method,
                        body: form,
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${props.token}`
                        }
                    }).then(r => r.json())
                    .then(r => {
                        if (r.error || r.errors) {
                            setData({
                                isError: true,
                                message: r.message || r.error,
                            });
                        } else {
                            setData({
                                isError: false,
                                message: r.message,
                            });
                        }
                        helpers.setSubmitting(false);
                    }).catch(e => {
                        setData({isError: true, message: e.message});
                        helpers.setSubmitting(false);
                    });
                }}
            >
                {({ errors, setFieldError, isSubmitting }) => (
                    <Form>
                            <FormField label="Foto Pas 3x4" viewUrl={props.photo_path?.replace('public', Routes.baseUrl + '/storage')}>
                                <Field disabled={isSubmitting} onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                                    handleFileChange('photo', (ev.target.files as FileList)[0] as File, setFieldError);
                                }} type="file" className="w-full file-input file-input-bordered max-w-xs" name="photo" required={!props.photo_path} />
                                {errors.photo ? (
                                    <p className="text-red-500">{errors.photo}</p>
                                ) : null}
                            </FormField>
                            <FormField label="Foto SKHU" viewUrl={props.skhu_path?.replace('public', Routes.baseUrl + '/storage')}>
                                <Field disabled={isSubmitting} onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                                    handleFileChange('skhu', (ev.target.files as FileList)[0] as File, setFieldError);
                                }} type="file" className="w-full file-input file-input-bordered max-w-xs" name="skhu" required={!props.skhu_path} />
                                {errors.skhu ? (
                                    <p className="text-red-500">{errors.skhu}</p>
                                ) : null}
                            </FormField>
                            <FormField viewUrl={props[(p.key + '_path') as keyof BerkasHardSubPageProps]?.replace('public', Routes.baseUrl + '/storage')} label={p.name}>
                                <Field disabled={isSubmitting} onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                                    handleFileChange(p.key, (ev.target.files as FileList)[0] as File, setFieldError);
                                }} type="file" className="w-full file-input file-input-bordered max-w-xs" name={p.key} required={!props[(`${p.key}_path`) as keyof BerkasHardSubPageProps]} />
                                {errors[p.key] ? (
                                    <p className="text-red-500">{errors[p.key]}</p>
                                ) : null}
                            </FormField>
                            {data.message ? (
                                <div className="text-center mt-2">
                                    <div className={`alert alert-${data.isError ? 'error' : 'success'} shadow-lg`}>
                                        <div>
                                            {data.isError ?
                                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                : <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            }
                                            <span>{data.isError ? 'Error' : 'Sukses'}! {data.message}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                            <div className="text-center py-3">
                                <button type="submit" disabled={isSubmitting} className={`btn bg-[#0E8A92] border-none${isSubmitting ? ' loading' : ''}`}>Upload</button>
                            </div>
                    </Form>
                )}
            </Formik>
        </React.Fragment>
    )
}