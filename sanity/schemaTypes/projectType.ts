import {defineField, defineType} from 'sanity'

const detectPlatform = (url?: string): string => {
  if (!url) return 'Empty'
  if (/tiktok/.test(url)) return 'TikTok'
  if (/instagram/.test(url)) return 'Instagram'
  if (/shorts/.test(url)) return 'YouTube Shorts'
  return 'Video'
}

export const projectType = defineType({
  name: 'proyecto',
  title: 'Trabajos',
  type: 'document',

  groups: [
    {name: 'header', title: 'Cabecera'},
    {name: 'content', title: 'Contenido'},
  ],

  fields: [
    defineField({
      name: 'order',
      type: 'number',
      title: 'Orden',
      group: 'header',
    }),

    defineField({
      name: 'title',
      type: 'string',
      title: 'Título',
      group: 'header',
    }),

    defineField({
      name: 'description',
      type: 'text',
      title: 'Bajada',
      group: 'header',
      rows: 3,
    }),

    defineField({
      name: 'tag',
      title: 'Categoría',
      type: 'reference',
      to: [{type: 'tag'}],
      group: 'header',
    }),

    defineField({
      name: 'image',
      title: 'Imagen principal',
      type: 'image',
      group: 'header',
      options: {hotspot: true},
    }),

    defineField({
      name: 'content',
      title: 'Contenido',
      group: 'content',
      type: 'array',
      of: [
        {type: 'block'},

        // Horizontal YouTube video
        {
          name: 'video',
          title: 'Video (YouTube)',
          type: 'object',
          options: {
            modal: {type: 'dialog'},
          },
          fields: [
            defineField({
              name: 'url',
              type: 'url',
              title: 'URL de YouTube',
              description: 'Video, playlist o Shorts de YouTube',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {url: 'url'},
            prepare({url}: {url?: string}) {
              return {title: 'YouTube', subtitle: url ?? 'Sin URL'}
            },
          },
        },

        // Vertical video grid — TikTok, Instagram, YouTube Shorts
        {
          name: 'videoGrid',
          title: 'Video Grid (vertical)',
          type: 'object',
          options: {
            modal: {type: 'dialog'},
          },
          fields: [
            defineField({
              name: 'columns',
              title: 'Number of videos',
              type: 'number',
              options: {
                list: [
                  {title: '1 video', value: 1},
                  {title: '2 videos', value: 2},
                ],
                layout: 'radio',
              },
              initialValue: 2,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'items',
              title: 'Videos',
              type: 'array',
              of: [
                {
                  name: 'videoItem',
                  title: 'Video',
                  type: 'object',
                  options: {
                    modal: {type: 'dialog'},
                  },
                  fields: [
                    defineField({
                      name: 'url',
                      type: 'url',
                      title: 'URL',
                      description:
                        'TikTok, Instagram (post o Reel), YouTube Shorts — usar la misma plataforma por fila',
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                  preview: {
                    select: {url: 'url'},
                    prepare({url}: {url?: string}) {
                      return {title: detectPlatform(url), subtitle: url ?? 'Sin URL'}
                    },
                  },
                },
              ],
              validation: (Rule) => Rule.max(3),
            }),
          ],
          preview: {
            select: {columns: 'columns', items: 'items'},
            prepare({
              columns,
              items,
            }: {
              columns?: number
              items?: {url?: string}[]
            }) {
              const count = items?.length ?? 0
              const platforms = [
                ...new Set((items ?? []).map((it) => detectPlatform(it.url))),
              ]
              const platformLabel = platforms.length ? platforms.join(' / ') : '—'
              return {
                title: `Video Grid — ${columns ?? '?'} col${(columns ?? 0) > 1 ? 's' : ''}`,
                subtitle: `${count} video${count !== 1 ? 's' : ''} · ${platformLabel}`,
              }
            },
          },
        },

        // Image block
        {
          name: 'imageBlock',
          title: 'Imagen',
          type: 'image',
          options: {hotspot: true},
        },
      ],
    }),
  ],
})
