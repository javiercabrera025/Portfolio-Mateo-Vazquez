import {defineField, defineType} from 'sanity'

export const settingsType = defineType({
  name: 'settings',
  title: 'Configuración',
  type: 'document',

  groups: [
    {name: 'general', title: 'General'},
    {name: 'social', title: 'Redes sociales'},
  ],

  fields: [
    defineField({
      name: 'logoTitle',
      type: 'string',
      title: 'Título Logo',
      group: 'general',
    }),

    defineField({
      name: 'logoSubtitle',
      type: 'string',
      title: 'Subtítulo Logo',
      group: 'general',
    }),

    defineField({
      name: 'email',
      type: 'string',
      title: 'Email de contacto',
      group: 'general',
    }),

    defineField({
      name: 'coverVideo',
      type: 'file',
      title: 'Video de portada',
      description: 'Subí el video del reel de portada (MP4 recomendado)',
      group: 'general',
      options: {
        accept: 'video/*',
      },
    }),

    defineField({
      name: 'social',
      title: 'Redes',
      type: 'object',
      group: 'social',
      fields: [
        defineField({
          name: 'instagram',
          type: 'url',
          title: 'Instagram',
        }),
        defineField({
          name: 'tiktok',
          type: 'url',
          title: 'TikTok',
        }),
        defineField({
          name: 'linkedin',
          type: 'url',
          title: 'LinkedIn',
        }),
      ],
    }),
  ],
})
