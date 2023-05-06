import React from 'react'

type FormFieldProps = React.PropsWithChildren<{
    label: string;
    labelKey?: string;
}>;

export const FormField = (props: FormFieldProps) => {
    return (
        <div className="form-control">
            <label className="label">
                <span className="label-text text-[#08105B] text-opacity-70 text-2xl font-semibold">
                    {props.label}
                </span>
            </label>
            <label className={props.labelKey ? 'input-group' : ''}>
                <span>{props.labelKey}</span>
                {props.children}
            </label>
        </div>
    )
}