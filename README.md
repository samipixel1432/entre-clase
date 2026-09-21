# Entre Clase

Aplicación web para organizar los huecos entre clases en la Universidad Icesi. Permite combinar actividades, elegir origen y destino dentro del campus, personalizar ritmo, presupuesto, ambiente y accesibilidad, y abrir el recorrido sugerido en Google Maps.

## Funciones

- Planes de 30 minutos a 3 horas o más.
- Hasta cuatro actividades por plan.
- Directorio de edificios, servicios y espacios del campus.
- Rutas y búsquedas conectadas con Google Maps.
- Diseño responsive para computador y celular.

## Desarrollo local

El proyecto es una aplicación web estática. Los archivos públicos se encuentran en `dist/`.

```bash
python -m http.server 4173 --directory dist
```

Luego abre `http://localhost:4173`.

## Despliegue en Vercel

Importa este repositorio en Vercel. La configuración incluida publica automáticamente la carpeta `dist` y no requiere un comando de compilación.
