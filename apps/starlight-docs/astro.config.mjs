import { defineConfig } from 'astro/config'
import { resolve } from 'path'
import starlight from '@astrojs/starlight'
import tailwind from '@astrojs/tailwind'

import svelte from '@astrojs/svelte'

const noExternal = ['three', 'troika-three-text', 'postprocessing', '@pmndrs/vanilla']
if (process.env.NODE_ENV === 'production') {
  noExternal.push('@theatre/core')
}

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Threlte',
      components: {
        // Override the default `SocialIcons` component.
        SocialIcons: './src/components/Socials/Socials.astro'
      },
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: 'Example Guide',
              link: '/guides/example/'
            }
          ]
        },
        {
          label: 'Reference',
          autogenerate: {
            directory: 'reference'
          }
        }
      ],
      customCss: ['./src/tailwind.css']
    }),
    tailwind({
      applyBaseStyles: false
    }),
    svelte()
  ],
  vite: {
    resolve: {
      alias: {
        $lib: resolve('./src/lib'),
        $components: resolve('./src/components'),
        $layouts: resolve('./src/layouts'),
        $pages: resolve('./src/pages'),
        $styles: resolve('./src/styles'),
        $assets: resolve('./src/assets'),
        $examples: resolve('./src/examples'),
        $hooks: resolve('./src/hooks')
      }
    },
    // Use https and generate a cert to allow XR debugging.
    server: {
      https: process.argv.includes('--https')
    },
    plugins: process.argv.includes('--https') ? [mkcert()] : [],
    ssr: {
      // "@theatre/core" needs to be externalized in development mode but not in production!
      noExternal: noExternal
    }
  }
})
