# EzeeGoing Mobile

Aplicación móvil híbrida para gestión de reservaciones en edificios, estacionamientos y áreas comunes.

## Ejemplo de Pull Request

### Título

feat: Implementar validación de reservaciones expiradas en Apple Wallet

### Descripción

Este PR agrega la lógica de validación para mostrar el botón de Apple Wallet únicamente cuando la reservación está activa y no ha expirado.

### Cambios realizados

- Agregado computed property `isReservationExpired` para verificar fecha de expiración
- Agregado computed property `canAddToWallet` para determinar visibilidad del botón
- Actualizado template con directiva `@if` para renderizado condicional

### Pruebas

- [x] Probado en simulador iOS
- [x] Probado en dispositivo físico
- [x] Verificado que el botón no aparece en reservaciones expiradas
- [x] Verificado que el botón no aparece en reservaciones inactivas

## Stack Tecnológico

- **Angular 18** - Framework frontend
- **Ionic 8** - Framework móvil
- **Capacitor 7** - Runtime nativo
- **NgRx** - Manejo de estado
- **TailwindCSS** - Estilos

## Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo Web

```bash
npm start
# o
ng serve
```

### Build

```bash
npm run build
```

### Sincronizar con Plataformas Nativas

```bash
# iOS
npx cap sync ios
npx cap open ios

# Android
npx cap sync android
npx cap open android
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/              # Servicios y modelos core
│   │   ├── models/        # Interfaces TypeScript
│   │   └── services/      # Servicios de negocio
│   ├── pages/             # Páginas de la aplicación
│   ├── shared/            # Componentes compartidos
│   └── state/             # NgRx (Actions, Reducers, Effects, Selectors)
├── environments/          # Configuración de ambientes
└── assets/               # Recursos estáticos
```

## Características Principales

### 1. Manejo de Estado con NgRx

El estado global incluye:

- `auth` - Autenticación
- `user` - Usuario actual
- `reservations` - Reservaciones
- `reservationTypes` - Tipos de reservación
- `buildings` - Edificios
- `visitors` - Visitantes

### 2. Apple Wallet Integration ✅

Plugin: `capacitor-pass-to-wallet`

**Funcionalidad**: Agregar pases de eventos a Apple Wallet en iOS.

**Estado**: ✅ **Completamente Implementado y Funcional**

El botón de Apple Wallet se muestra únicamente en reservaciones que cumplen:

- `is_active: true` (activa en el backend)
- `end_date > Date.now()` (no vencida)

### 3. Consumo de APIs

Servicio base `ApiService` con métodos HTTP genéricos y soporte para:

- Interceptores de token JWT
- Base URL dinámica
- Tipado TypeScript

## Pruebas en iPhone

### Simulador

```bash
npm run build
npx cap sync ios
npx cap open ios
```

En Xcode: Selecciona un simulador y presiona `Cmd + R`

⚠️ **Nota**: El simulador NO soporta Apple Wallet. Usa un dispositivo físico.

### Dispositivo Físico

1. Conecta el iPhone
2. Configura el equipo de desarrollo en Xcode
3. Selecciona el dispositivo
4. Ejecuta con `Cmd + R`

### Live Reload

```bash
npx cap run ios --livereload --external
```

### Debugging

Usa Safari Web Inspector:

1. iPhone: `Ajustes > Safari > Avanzado > Web Inspector`
2. Mac Safari: `Develop > [Tu iPhone] > [Tu App]`

## Apple Wallet - Casos de Prueba

| `is_active` | `end_date` | Botón Visible | Resultado           |
| ----------- | ---------- | ------------- | ------------------- |
| `true`      | Futuro     | ✅ Sí         | Pase se agrega      |
| `true`      | Pasado     | ❌ No         | Expirada            |
| `false`     | Futuro     | ❌ No         | Inactiva            |
| `false`     | Pasado     | ❌ No         | Inactiva y expirada |

## Comandos Útiles

```bash
# Desarrollo
npm start                          # Servidor de desarrollo
npm run build                      # Build producción
npm run watch                      # Build con watch mode

# Capacitor
npx cap sync                       # Sincronizar todas las plataformas
npx cap sync ios                   # Solo iOS
npx cap open ios                   # Abrir Xcode
npx cap run ios --livereload       # Ejecutar con live reload

# Linting
npm run lint                       # Ejecutar ESLint

# Testing
npm test                           # Ejecutar tests
```

## Configuración de Ambiente

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: "https://app.ezeeparking.com/api/",
  apiSecretKey: "[SECRET_KEY]",
};
```

## Documentación Completa

Para documentación detallada sobre arquitectura, estado, APIs y pruebas, consulta:

📖 **[DOCUMENTACION.md](./DOCUMENTACION.md)**

Incluye:

- Arquitectura del proyecto
- Manejo de estado (NgRx)
- Consumo de APIs
- **Plugin de Apple Wallet** (implementación completa con validación)
- Guía completa de pruebas en iPhone
- Estructura de carpetas
- Solución de problemas
- Mejoras futuras

## Implementación de Apple Wallet

### Validación Implementada

El botón de Wallet utiliza dos computed properties para validar:

```typescript
// Verifica si la reservación ha expirado
public isReservationExpired = computed(() => {
  const end = this.reservation?.end_date as any;
  const endDate = end ? new Date(end) : null;
  return !!endDate && isFinite(endDate.getTime()) && endDate.getTime() < Date.now();
});

// Determina si se puede agregar a Wallet
public canAddToWallet = computed(() => {
  return this.reservation?.is_active && !this.isReservationExpired();
});
```

### Template

```html
@if (canAddToWallet()) {
<ion-button (click)="onAddToWallet()">
  <ion-icon slot="start" name="wallet-outline"></ion-icon>
</ion-button>
}
```

## Soporte

Para preguntas o problemas, contacta al equipo de desarrollo.

---

**Última actualización**: Diciembre 2024
