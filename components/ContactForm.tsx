'use client'

import { useEffect, useState } from 'react'
import { client } from '@/lib/sanityClient'

type FormData = {
  name: string
  email: string
  subject: string
  message: string
}

type FormErrors = Partial<FormData>
type Status = 'idle' | 'sending' | 'success' | 'error'

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.name.trim() || data.name.trim().length < 2)
    errors.name = 'El nombre debe tener al menos 2 caracteres.'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!data.email.trim() || !emailRegex.test(data.email.trim()))
    errors.email = 'Ingresá un email válido.'
  if (!data.subject.trim() || data.subject.trim().length < 3)
    errors.subject = 'El asunto debe tener al menos 3 caracteres.'
  if (!data.message.trim() || data.message.trim().length < 10)
    errors.message = 'El mensaje debe tener al menos 10 caracteres.'
  return errors
}

export const ContactForm = () => {
  const [contactEmail, setContactEmail] = useState<string>('')
  const [form, setForm] = useState<FormData>({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    client
      .fetch<{ email?: string }>(`*[_type == "settings"][0]{ email }`)
      .then((data) => { if (data?.email) setContactEmail(data.email) })
      .catch(console.error)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, to: contactEmail }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className='w-full bg-black pt-[calc(72px+5rem)] pb-20'>
      <div className='max-w-2xl mx-auto px-4 md:px-8'>
        <h2 className='text-white text-4xl font-bold mb-[15px]' style={{ fontFamily: 'var(--font-syne)' }}>Contacto</h2>
        <p className='text-white/60 text-sm mb-10 font-light'>
          Enviame un mensaje y te respondo a la brevedad.
        </p>

        {status === 'success' ? (
          <div className='text-center py-16'>
            <div className='w-12 h-12 rounded-full border border-white/30 flex items-center justify-center mx-auto mb-6'>
              <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M5 13l4 4L19 7' />
              </svg>
            </div>
            <p className='text-white text-lg font-light'>¡Mensaje enviado! Te respondo pronto.</p>
            <button
              onClick={() => setStatus('idle')}
              className='mt-6 text-white/50 hover:text-white text-sm underline underline-offset-4 transition-colors'>
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className='space-y-6'>
            <div>
              <label className='block text-white/60 text-xs uppercase tracking-widest mb-2'>Nombre</label>
              <input
                type='text'
                name='name'
                value={form.name}
                onChange={handleChange}
                placeholder='Tu nombre'
                className={`w-full bg-transparent border-b py-2 text-white placeholder-white/20 text-sm outline-none transition-colors ${errors.name ? 'border-red-400/70' : 'border-white/20 focus:border-white/60'}`}
              />
              {errors.name && <p className='text-red-400/80 text-xs mt-1'>{errors.name}</p>}
            </div>

            <div>
              <label className='block text-white/60 text-xs uppercase tracking-widest mb-2'>Email</label>
              <input
                type='email'
                name='email'
                value={form.email}
                onChange={handleChange}
                placeholder='tu@email.com'
                className={`w-full bg-transparent border-b py-2 text-white placeholder-white/20 text-sm outline-none transition-colors ${errors.email ? 'border-red-400/70' : 'border-white/20 focus:border-white/60'}`}
              />
              {errors.email && <p className='text-red-400/80 text-xs mt-1'>{errors.email}</p>}
            </div>

            <div>
              <label className='block text-white/60 text-xs uppercase tracking-widest mb-2'>Asunto</label>
              <input
                type='text'
                name='subject'
                value={form.subject}
                onChange={handleChange}
                placeholder='¿En qué te puedo ayudar?'
                className={`w-full bg-transparent border-b py-2 text-white placeholder-white/20 text-sm outline-none transition-colors ${errors.subject ? 'border-red-400/70' : 'border-white/20 focus:border-white/60'}`}
              />
              {errors.subject && <p className='text-red-400/80 text-xs mt-1'>{errors.subject}</p>}
            </div>

            <div>
              <label className='block text-white/60 text-xs uppercase tracking-widest mb-2'>Mensaje</label>
              <textarea
                name='message'
                value={form.message}
                onChange={handleChange}
                placeholder='Tu mensaje...'
                rows={5}
                className={`w-full bg-transparent border-b py-2 text-white placeholder-white/20 text-sm outline-none transition-colors resize-none ${errors.message ? 'border-red-400/70' : 'border-white/20 focus:border-white/60'}`}
              />
              {errors.message && <p className='text-red-400/80 text-xs mt-1'>{errors.message}</p>}
            </div>

            {status === 'error' && (
              <p className='text-red-400/80 text-sm'>Hubo un error al enviar el mensaje. Intentá de nuevo.</p>
            )}

            <div className='pt-2'>
              <button
                type='submit'
                disabled={status === 'sending'}
                className='inline-flex items-center gap-3 text-white/70 hover:text-white text-sm font-light tracking-widest uppercase border border-white/20 hover:border-white/50 px-8 py-3 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed'>
                {status === 'sending' ? (
                  <>
                    <span className='w-4 h-4 border border-white/40 border-t-white rounded-full animate-spin' />
                    Enviando...
                  </>
                ) : (
                  'Enviar mensaje'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
