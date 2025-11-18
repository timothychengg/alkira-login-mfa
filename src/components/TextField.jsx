import { clsx } from 'clsx'

export default function TextField({
  label, name, value, onChange, placeholder, type = 'text', error, autoComplete
}) {
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
