import { Field, FormikProps } from 'formik';
import React from 'react';
import { FormField } from './field';

export const Fields = (props: React.PropsWithChildren<{
    label: string;
    type: React.HTMLInputTypeAttribute,
    _key: string;
    formikProps: FormikProps<any>,
    required: boolean;
    placeholder: string;
    selects?: string[];
}>) => {
    return (
        <FormField label={props.label}>
            {props.selects ? (
                <>
                    <Field className="select" as="select" disabled={props.formikProps.isSubmitting} name={props._key}>
                        <option disabled value='default'>Pilih satu:</option>
                        {props.selects.map((selection, index) => (
                            <option value={selection} key={index.toString()}>{selection}</option>
                        ))}
                    </Field>
                </>
            ) : <Field onChange={props.formikProps.handleChange} disabled={props.formikProps.isSubmitting} className="input max-w-xs w-full join-item" type={props.type} name={props._key} placeholder={props.placeholder} required={props.required} />}
            {props.formikProps.errors[props._key] && props.formikProps.touched[props._key] ? (
                <p className="text-red-500 join-item">{props.formikProps.errors[props._key] as string}</p>
            ) : null}
        </FormField>
    )
}