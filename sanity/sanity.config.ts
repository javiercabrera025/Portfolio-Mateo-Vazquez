import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Mateo-Portfolio',

  projectId: '471979z9',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    structureTool({
      structure: (S: any) =>
        S.list()
          .title('Contenido')
          .items([
            // Esto crea un acceso directo directo al documento "settings"
            S.listItem()
              .title('Configuración General')
              .id('settings')
              .child(S.document().schemaType('settings').documentId('settings')),
            // Filtramos para que "settings" no aparezca en la lista general de crear
            ...S.documentTypeListItems().filter(
              (listItem: any) => !['settings'].includes(listItem.getId() as string),
            ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
