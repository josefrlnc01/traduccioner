
import { motion } from 'motion/react'

const sections = [
    {
        title: 'Información que recopilamos',
        content: [
            {
                subtitle: 'Datos de cuenta',
                text: 'Cuando te registras en AudWave recopilamos tu nombre, dirección de correo electrónico y contraseña (almacenada de forma encriptada). Si usas el inicio de sesión con Google, obtenemos tu nombre y email desde tu cuenta de Google a través de Firebase Authentication.'
            },
            {
                subtitle: 'Archivos de audio y vídeo',
                text: 'Los archivos que subes para transcribir se procesan temporalmente en nuestros servidores y se eliminan inmediatamente después de completar la transcripción. No almacenamos tus archivos de audio o vídeo de forma permanente.'
            },
            {
                subtitle: 'Transcripciones guardadas',
                text: 'Las transcripciones que eliges guardar en tu historial se almacenan en nuestra base de datos asociadas a tu cuenta para que puedas acceder a ellas cuando quieras.'
            },
            {
                subtitle: 'Datos de uso',
                text: 'Registramos los minutos de audio procesados para gestionar las cuotas de uso por plan. Esta información se asocia a tu cuenta y a tu dirección IP.'
            }
        ]
    },
    {
        title: 'Cómo usamos tu información',
        content: [
            {
                subtitle: 'Prestación del servicio',
                text: 'Usamos tu información para ofrecerte el servicio de transcripción y traducción, gestionar tu cuenta, y aplicar los límites correspondientes a tu plan.'
            },
            {
                subtitle: 'Servicios de terceros',
                text: 'Tus archivos de audio se envían a la API de Whisper de OpenAI para su transcripción, y el texto puede enviarse a la API de Google Translate para su traducción y a GPT-4 de OpenAI para la corrección semántica y generación de resúmenes. Estos servicios tienen sus propias políticas de privacidad.'
            },
            {
                subtitle: 'Comunicaciones',
                text: 'Podemos enviarte emails relacionados con tu cuenta, como confirmación de registro o restablecimiento de contraseña. No enviamos emails de marketing sin tu consentimiento.'
            }
        ]
    },
    {
        title: 'Almacenamiento y seguridad',
        content: [
            {
                subtitle: 'Dónde se almacenan tus datos',
                text: 'Tus datos se almacenan en MongoDB Atlas con servidores en Europa. El backend de AudWave está desplegado en servidores de CubePath.'
            },
            {
                subtitle: 'Medidas de seguridad',
                text: 'Implementamos autenticación con JWT usando access tokens de corta duración y refresh tokens almacenados en cookies httpOnly. Las contraseñas se almacenan con hashing bcrypt. Todas las comunicaciones se realizan sobre HTTPS.'
            },
            {
                subtitle: 'Retención de datos',
                text: 'Los datos de cuota de uso se eliminan automáticamente después de 30 días. Las transcripciones guardadas se conservan mientras mantengas tu cuenta activa. Puedes eliminar tu cuenta y todos tus datos en cualquier momento desde la configuración.'
            }
        ]
    },
    {
        title: 'Tus derechos',
        content: [
            {
                subtitle: 'Acceso y portabilidad',
                text: 'Tienes derecho a acceder a todos los datos que tenemos sobre ti. Puedes exportar tus transcripciones en múltiples formatos (TXT, PDF, SRT, VTT, DOCX, JSON, CSV) en cualquier momento.'
            },
            {
                subtitle: 'Eliminación',
                text: 'Puedes eliminar tu cuenta y todos los datos asociados en cualquier momento desde la configuración de tu perfil. La eliminación es permanente e irreversible.'
            },
            {
                subtitle: 'Corrección',
                text: 'Puedes editar el título de tus transcripciones guardadas en cualquier momento. Para modificar otros datos de tu cuenta como tu nombre o email, contacta con nosotros.'
            }
        ]
    },
    {
        title: 'Cookies',
        content: [
            {
                subtitle: 'Cookies de autenticación',
                text: 'Usamos una cookie httpOnly para almacenar tu refresh token de sesión. Esta cookie es estrictamente necesaria para mantener tu sesión activa y no puede ser desactivada.'
            },
            {
                subtitle: 'Almacenamiento local',
                text: 'Usamos localStorage para recordar si tienes una sesión activa. No usamos cookies de seguimiento, analítica ni publicidad.'
            }
        ]
    },
    {
        title: 'Cambios en esta política',
        content: [
            {
                subtitle: '',
                text: 'Podemos actualizar esta política de privacidad ocasionalmente. Cuando hagamos cambios significativos, te notificaremos por email o mediante un aviso destacado en la aplicación. La fecha de última actualización siempre estará visible al inicio de este documento.'
            }
        ]
    }
]

export default function PrivacyView() {
    return (
        <main className='min-h-screen bg-[#0a0e17] text-white'>

            <div className='max-w-3xl mx-auto px-6 py-16'>

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className='mb-12'
                >
                    <div className='flex items-center gap-3 mb-6'>
                        <div className='w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center'>
                            <svg className='w-5 h-5 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                            </svg>
                        </div>
                        <div>
                            <h1 className='text-3xl font-bold text-white'>Política de privacidad</h1>
                            <p className='text-slate-500 text-sm mt-0.5'>Última actualización: marzo 2026</p>
                        </div>
                    </div>

                    <div className='p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl'>
                        <p className='text-sm text-slate-300 leading-relaxed'>
                            En AudWave nos tomamos tu privacidad muy en serio. Este documento explica qué datos recopilamos,
                            cómo los usamos y qué derechos tienes sobre ellos. Si tienes cualquier duda, puedes contactarnos
                            en <a href='mailto:josefrlnc01@gmail.com' className='text-blue-400 hover:text-blue-300 transition-colors'>josefrlnc01@gmail.com</a>.
                        </p>
                    </div>
                </motion.div>

                {/* Contenido */}
                <div className='flex flex-col gap-10'>
                    {sections.map((section, i) => (
                        <motion.section
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                        >
                            <div className='flex items-center gap-3 mb-5'>
                                <span className='text-xs font-bold text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono'>
                                    0{i + 1}
                                </span>
                                <h2 className='text-lg font-bold text-white'>{section.title}</h2>
                            </div>

                            <div className='flex flex-col gap-4 pl-0 md:pl-8'>
                                {section.content.map((item, j) => (
                                    <div key={j} className='flex flex-col gap-1.5'>
                                        {item.subtitle && (
                                            <h3 className='text-sm font-semibold text-slate-300'>
                                                {item.subtitle}
                                            </h3>
                                        )}
                                        <p className='text-sm text-slate-400 leading-relaxed'>
                                            {item.text}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {i < sections.length - 1 && (
                                <div className='mt-10 border-b border-slate-800/60' />
                            )}
                        </motion.section>
                    ))}
                </div>

                {/* Contacto */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className='mt-14 p-6 bg-slate-900/40 border border-slate-800/60 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4'
                >
                    <div>
                        <p className='text-sm font-semibold text-white mb-1'>¿Tienes preguntas sobre privacidad?</p>
                        <p className='text-xs text-slate-400'>Responderemos en menos de 48 horas.</p>
                    </div>
                    <a
                        href='mailto:josefrlnc01@gmail.com'
                        className='shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors'
                    >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                        </svg>
                        Contactar
                    </a>
                </motion.div>

            </div>

            
        </main>
    )
}