# Barber Shop Caleb — Guía para publicar tu link real

No necesitas saber programar para esto. Son solo clics.

## Paso 1: Crear cuenta en GitHub (guarda tus archivos)
1. Ve a https://github.com y crea una cuenta gratis.
2. Crea un repositorio nuevo (botón "New repository"), ponle de nombre `barber-shop-caleb`, y déjalo público o privado, como prefieras.
3. Dentro del repositorio, busca el botón "Add file" → "Upload files".
4. Arrastra TODA esta carpeta (todos los archivos y carpetas que te entregué) a esa pantalla y dale "Commit changes".

## Paso 2: Publicarlo con Vercel (le da el link real)
1. Ve a https://vercel.com y crea una cuenta gratis usando tu cuenta de GitHub (botón "Continue with GitHub").
2. Click en "Add New" → "Project".
3. Busca el repositorio `barber-shop-caleb` que subiste y dale "Import". Vercel reconoce automáticamente que es un proyecto Next.js.
4. Antes de darle "Deploy", abre la sección "Environment Variables" y agrega estas dos (ya vienen en el archivo `.env.local` que subiste, pero Vercel necesita que las repitas aquí manualmente):
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://jiqubivvduztbybcvbir.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_LzoabKnC1hSevYXcgdfCTA_snluBHbJ`
5. Dale click a "Deploy" y espera 1-2 minutos.
6. Cuando termine, Vercel te da un link real (algo como `barber-shop-caleb.vercel.app`). Ese es el link que compartes con tus clientes.

## Nota importante de seguridad
Por ahora el panel de administrador solo está protegido por el PIN `1234` dentro de la app — no es una protección real de nivel profesional, cualquiera que sepa el PIN puede entrar. Antes de compartir el link ampliamente, avísame y le agregamos un sistema de login real.

## Si algo falla
Copia el mensaje de error que te muestre Vercel y pégamelo aquí — lo reviso contigo.
