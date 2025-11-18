import { HTMLInputTypeAttribute } from 'react'
import { clsx } from 'clsx'

type Props = {
  label: string
  name: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: HTMLInputTypeAttribute
  error?: string
  autoComplete?: string
}

export default function TextField({
  label, name, value, onChange, placeholder, type = 'text', error, autoComplete
}: Props) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      <input
        id={name}
        name={name}
        className={clsx('input', error && 'ring-2 ring-red-400')}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {error && <p className="err mt-1">{error}</p>}
    </div>
  )
}
