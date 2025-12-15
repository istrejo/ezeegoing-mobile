# Documentación Técnica - EzeeGoing Mobile

## Índice

1. [Descripción General](#descripción-general)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Manejo del Estado (NgRx)](#manejo-del-estado-ngrx)
4. [Consumo de APIs](#consumo-de-apis)
5. [Plugin de Apple Wallet](#plugin-de-apple-wallet)
6. [Estructura de Carpetas](#estructura-de-carpetas)
7. [Pruebas en Dispositivos iPhone](#pruebas-en-dispositivos-iphone)

---

## Descripción General

**EzeeGoing Mobile** es una aplicación móvil híbrida construida con **Ionic + Angular** y **Capacitor** para la gestión de reservaciones en edificios, estacionamientos y áreas comunes. La aplicación permite a los usuarios crear, editar y eliminar reservaciones, así como agregar pases de eventos a Apple Wallet.

### Stack Tecnológico

- **Framework Frontend**: Angular 18
- **Framework Móvil**: Ionic 8
- **Runtime Nativo**: Capacitor 7
- **Manejo de Estado**: NgRx (Store, Effects, Selectors)
- **Estilos**: TailwindCSS + Ionic Components
- **Iconos**: FontAwesome + Ionicons
- **HTTP Client**: Angular HttpClient
- **Manejo de Fechas**: DayJS + @formkit/tempo

### Dependencias Principales

```json
{
  "@angular/core": "^18.0.0",
  "@ionic/angular": "^8.0.0",
  "@capacitor/core": "^7.0.0",
  "@ngrx/store": "^18.1.1",
  "@ngrx/effects": "^18.1.1",
  "capacitor-pass-to-wallet": "^4.0.1"
}
```

---

## Arquitectura del Proyecto

La aplicación sigue una arquitectura modular basada en **Angular** con patrones de diseño como:

### 1. Arquitectura por Capas

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Pages, Components, Modals)      │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         State Management            │
│  (NgRx: Actions, Reducers, Effects) │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         Service Layer               │
│  (API, Auth, Reservation, Wallet)   │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         Data Layer                  │
│      (HTTP Client, Storage)         │
└─────────────────────────────────────┘
```

### 2. Patrón de Diseño

- **Singleton Services**: Todos los servicios están registrados con `providedIn: 'root'`
- **Reactive Programming**: Uso extensivo de RxJS Observables
- **Unidirectional Data Flow**: NgRx para flujo de datos predecible
- **Dependency Injection**: Inyección de dependencias nativa de Angular

---

## Manejo del Estado (NgRx)

La aplicación utiliza **NgRx** para el manejo centralizado del estado global.

### Estructura del Estado Global

```typescript
// src/app/state/app.state.ts
export interface AppState {
  auth: AuthState;
  user: UserState;
  reservations: ReservationState;
  reservationTypes: ReservationTypeState;
  buildings: BuildingState;
  visitors: VisitorState;
}
```

### Flujo de Datos NgRx

```
Component → Action → Effect → Service → API
                ↓                         ↓
            Reducer ← ← ← ← ← ← ← ← Response
                ↓
            Store (State)
                ↓
            Selector
                ↓
            Component (View Update)
```

### Ejemplo: Cargar Reservaciones

#### 1. **Action** (`src/app/state/actions/reservation.actions.ts`)

```typescript
export const loadReservations = createAction("[Reservation] Load Reservations");

export const loadReservationsSuccess = createAction("[Reservation] Load Reservations Success", props<{ reservations: Reservation[] }>());

export const loadReservationsFailure = createAction("[Reservation] Load Reservations Failure", props<{ error: any }>());
```

#### 2. **Effect** (`src/app/state/effects/reservation.effects.ts`)

```typescript
loadReservations$ = createEffect(() => {
  return this.actions$.pipe(
    ofType(loadReservations),
    mergeMap(() =>
      this.reservationService.getAll().pipe(
        map((reservations) => {
          const reversedReservations = reservations.reverse();
          return loadReservationsSuccess({ reservations: reversedReservations });
        }),
        catchError((error) => of(loadReservationsFailure({ error })))
      )
    )
  );
});
```

#### 3. **Reducer** (`src/app/state/reducers/reservation.reducer.ts`)

```typescript
export const reservationReducer = createReducer(
  initialState,
  on(loadReservations, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadReservationsSuccess, (state, { reservations }) => ({
    ...state,
    reservations: [...reservations],
    loading: false,
  })),
  on(loadReservationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
```

#### 4. **Selector** (`src/app/state/selectors/reservation.selectors.ts`)

```typescript
export const selectReservationState = (state: AppState) => state.reservations;

export const selectReservations = createSelector(selectReservationState, (state: ReservationState) => state.reservations);
```

#### 5. **Uso en Componente**

```typescript
export class ReservationsPage implements OnInit {
  private store = inject(Store);
  reservations$ = this.store.select(selectReservations);

  ngOnInit() {
    this.store.dispatch(loadReservations());
  }
}
```

### Estados Disponibles

| Estado             | Descripción              | Archivo                     |
| ------------------ | ------------------------ | --------------------------- |
| `auth`             | Autenticación y tokens   | `auth.state.interface.ts`   |
| `user`             | Datos del usuario actual | `user.state.intercafe.ts`   |
| `reservations`     | Lista de reservaciones   | `reservations.state.ts`     |
| `reservationTypes` | Tipos de reservación     | `reservation-type-state.ts` |
| `buildings`        | Edificios disponibles    | `building.state.ts`         |
| `visitors`         | Visitantes registrados   | `visitor.state.ts`          |

---

## Consumo de APIs

### Servicio Base de API

El servicio `ApiService` (`src/app/core/services/api/api.service.ts`) proporciona métodos genéricos para consumir APIs REST.

#### Características

- **Base URL Dinámica**: Se obtiene del estado de autenticación
- **Interceptores**: Token JWT automático mediante `checkToken()` context
- **Tipado Genérico**: Soporte para TypeScript generics
- **Métodos HTTP**: GET, POST, PUT, PATCH, DELETE

#### Implementación del ApiService

```typescript
@Injectable({
  providedIn: "root",
})
export class ApiService {
  private baseUrl = signal<string | null>(null);
  private store = inject(Store);
  private http = inject(HttpClient);

  constructor() {
    this.store.select(selectAuthState).subscribe((auth) => {
      this.baseUrl.set(`https://${auth.userData?.base_url}/api/`);
    });
  }

  public get<T>(endPoint: string, options?: RequestOptions): Observable<T> {
    return this.http.get<T>(`${this.baseUrl()}${endPoint}`, options);
  }

  public post<T>(endPoint: string, dto: any, options?: RequestOptions): Observable<T> {
    return this.http.post<T>(`${this.baseUrl()}${endPoint}`, dto, options);
  }

  public put<T>(endPoint: string, body: any, options?: RequestOptions): Observable<T> {
    return this.http.put<T>(`${this.baseUrl()}${endPoint}`, body, options);
  }

  public patch<T>(endPoint: string, body: any, options?: RequestOptions): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl()}${endPoint}`, body, options);
  }

  public delete<T>(endPoint: string, options?: RequestOptions): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl()}${endPoint}`, options);
  }
}
```

#### Ejemplo de Uso: ReservationService

```typescript
@Injectable({ providedIn: "root" })
export class ReservationService {
  private apiSvc = inject(ApiService);

  getAll(): Observable<Reservation[]> {
    return this.apiSvc.get<Reservation[]>("reservation/", { context: checkToken() }).pipe(
      map((reservations) =>
        reservations.map((item) => ({
          ...item,
          fullname: `${item.first_name} ${item.last_name}`,
        }))
      )
    );
  }

  createReservation(dto: any): Observable<any> {
    return this.apiSvc.post("reservation/", dto, { context: checkToken() });
  }

  update(id: any, dto: any): Observable<any> {
    return this.apiSvc.put(`reservation/${id}/`, dto, {
      context: checkToken(),
    });
  }

  delete(id: number): Observable<any> {
    return this.apiSvc.delete(`reservation/${id}/`, { context: checkToken() });
  }
}
```

### Configuración de Ambiente

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: "https://app.ezeeparking.com/api/",
  apiSecretKey: "Zh51ZiAIObSC!@#$%^&*(67jkBfH3VzYp@#$%&$kkRNr2K5W9r",
};
```

### Interceptor de Token

El interceptor `token.interceptor.ts` agrega automáticamente el token JWT a las peticiones que incluyan el contexto `checkToken()`.

```typescript
import { HttpContextToken } from "@angular/common/http";

export const CHECK_TOKEN = new HttpContextToken<boolean>(() => false);

export function checkToken() {
  return new HttpContext().set(CHECK_TOKEN, true);
}
```

---

## Plugin de Apple Wallet

### Descripción

El plugin **capacitor-pass-to-wallet** (versión 4.0.1) permite agregar pases de eventos (archivos `.pkpass`) a Apple Wallet en dispositivos iOS.

### Estado de Implementación

#### ✅ Completamente Implementado y Funcional

1. **Servicio de Wallet** (`src/app/core/services/wallet.service.ts`)
2. **Integración en Card Component** (`src/app/pages/reservations/components/card/`)
3. **Validación de Visibilidad** del botón basada en estado y fecha de expiración
4. **UI Button** condicional para agregar a Wallet

### Implementación del Servicio

```typescript
// src/app/core/services/wallet.service.ts
@Injectable({ providedIn: "root" })
export class WalletService {
  constructor(private http: HttpClient) {}

  getPassFile(reservationId: number): Observable<Blob> {
    const url = `${environment.apiUrl}wallet/event-pass/reservation/${reservationId}/download/`;
    const headers = new HttpHeaders({ "X-API-KEY": environment.apiSecretKey });

    return this.http.get(url, { headers, responseType: "blob" }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  public convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}
```

**Funcionalidades del servicio:**

- `getPassFile()`: Descarga el archivo `.pkpass` desde el backend como Blob
- `convertBlobToBase64()`: Convierte el Blob a Base64 para el plugin de Capacitor

### Implementación en el Componente

```typescript
// src/app/pages/reservations/components/card/card.component.ts
import { Component, inject, Input, OnInit, signal, computed } from "@angular/core";

export class CardComponent implements OnInit {
  private walletService = inject(WalletService);
  private toastController = inject(ToastController);

  // Computed property para verificar si la reservación ha expirado
  public isReservationExpired = computed(() => {
    const end = this.reservation?.end_date as any;
    const endDate = end ? new Date(end) : null;
    return !!endDate && isFinite(endDate.getTime()) && endDate.getTime() < Date.now();
  });

  // Computed property para determinar si se puede agregar a Wallet
  public canAddToWallet = computed(() => {
    return this.reservation?.is_active && !this.isReservationExpired();
  });

  async onAddToWallet() {
    try {
      const blob = await firstValueFrom(this.walletService.getPassFile(this.reservation.id));
      const dataUrl = (await this.walletService.convertBlobToBase64(blob)) as string;
      const commaIdx = dataUrl.indexOf(",");
      const base64 = commaIdx >= 0 ? dataUrl.substring(commaIdx + 1) : dataUrl;

      await CapacitorPassToWallet.addToWallet({ base64 });

      const toast = await this.toastController.create({
        message: "Pase agregado a Apple Wallet",
        duration: 2000,
        color: "success",
      });
      await toast.present();
    } catch (err: any) {
      const toast = await this.toastController.create({
        message: err?.message || "No se pudo agregar el pase.",
        duration: 2500,
        color: "danger",
      });
      await toast.present();
    }
  }
}
```

### Template con Validación

```html
<!-- src/app/pages/reservations/components/card/card.component.html -->
<ion-buttons class="mr-4" slot="end" class="flex flex-col">
  @if (canAddToWallet()) {
  <ion-button (click)="onAddToWallet()">
    <ion-icon slot="start" name="wallet-outline"></ion-icon>
  </ion-button>
  }
  <ion-button (click)="onEdit()">
    <img slot="icon-only" src="assets/svgs/edit.svg" alt="" />
  </ion-button>
  <ion-button (click)="deleteReservation()">
    <img slot="icon-only" src="assets/svgs/trash.svg" alt="" />
  </ion-button>
</ion-buttons>
```

### Lógica de Validación

El botón de Apple Wallet se muestra **únicamente** cuando se cumplen ambas condiciones:

1. ✅ **`is_active === true`**: La reservación está marcada como activa en el backend
2. ✅ **`end_date > Date.now()`**: La fecha de finalización es futura (no ha expirado)

**Modelo de Datos de Reservación:**

```typescript
export interface Reservation {
  id: number;
  external_id: string;
  is_active: boolean; // Indica si está activa
  start_date: string; // Fecha de inicio
  end_date: string; // Fecha de fin
  reservation_reference: string;
  first_name: string;
  last_name: string;
  email: string;
  // ... otros campos
}
```

### Casos de Uso y Validación

| Escenario                    | `is_active` | `end_date` | Botón Visible | Resultado                    |
| ---------------------------- | ----------- | ---------- | ------------- | ---------------------------- |
| Reservación activa válida    | `true`      | Futuro     | ✅ **Sí**     | Pase se agrega correctamente |
| Reservación activa vencida   | `true`      | Pasado     | ❌ **No**     | Botón oculto (expirada)      |
| Reservación inactiva         | `false`     | Futuro     | ❌ **No**     | Botón oculto (inactiva)      |
| Reservación inactiva vencida | `false`     | Pasado     | ❌ **No**     | Botón oculto                 |

### Consideración Importante sobre `is_active`

⚠️ **Nota Backend**: La propiedad `is_active` viene del backend y **no se actualiza automáticamente** cuando una reservación expira (`end_date < Date.now()`). Por esta razón, la validación en el frontend verifica **ambas condiciones** para asegurar que solo se muestren pases válidos.

**Recomendación para el Backend**: Implementar un job/cron que actualice automáticamente `is_active: false` cuando `end_date` ha pasado, o agregar un campo calculado `is_valid` que considere ambas condiciones.

### Endpoint del Backend

```
GET https://app.ezeeparking.com/api/wallet/event-pass/reservation/{reservationId}/download/

Headers:
  X-API-KEY: Zh51ZiAIObSC!@#$%^&*(67jkBfH3VzYp@#$%&$kkRNr2K5W9r

Response:
  Content-Type: application/vnd.apple.pkpass
  Body: Binary .pkpass file
```

### Configuración de Capacitor

```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: "com.myapp.ezeegoing",
  appName: "ezeegoing",
  webDir: "www",
  plugins: {
    SplashScreen: {
      /* ... */
    },
    StatusBar: {
      /* ... */
    },
  },
};
```

### Permisos iOS

El proyecto debe tener los permisos necesarios configurados en `Info.plist` para que el plugin funcione correctamente.

---

## Estructura de Carpetas

```
ezeegoing-mobile/
├── src/
│   ├── app/
│   │   ├── core/                    # Módulos core de la aplicación
│   │   │   ├── models/              # Interfaces y tipos
│   │   │   │   ├── auth.state.interface.ts
│   │   │   │   ├── building.state.ts
│   │   │   │   ├── reservation.interface.ts
│   │   │   │   ├── reservations.state.ts
│   │   │   │   ├── reservation-type-state.ts
│   │   │   │   ├── user.state.intercafe.ts
│   │   │   │   └── visitor.state.ts
│   │   │   └── services/            # Servicios de negocio
│   │   │       ├── api/             # Servicio base de API
│   │   │       │   └── api.service.ts
│   │   │       ├── auth/            # Autenticación
│   │   │       │   └── auth.service.ts
│   │   │       ├── reservation/     # Reservaciones
│   │   │       │   └── reservation.service.ts
│   │   │       ├── wallet.service.ts # ✅ Apple Wallet
│   │   │       ├── building/
│   │   │       ├── visitor/
│   │   │       ├── alert/
│   │   │       ├── loading/
│   │   │       ├── modal/
│   │   │       ├── toast/
│   │   │       └── token/
│   │   ├── pages/                   # Páginas de la aplicación
│   │   │   ├── login/
│   │   │   ├── reservations/        # Lista de reservaciones
│   │   │   │   ├── reservations.page.ts
│   │   │   │   └── components/
│   │   │   │       └── card/        # ✅ Card con validación de Wallet
│   │   │   │           ├── card.component.ts
│   │   │   │           ├── card.component.html
│   │   │   │           └── card.component.scss
│   │   │   ├── create-reservation/  # Crear reservación
│   │   │   ├── profile/             # Perfil de usuario
│   │   │   ├── visitors/            # Visitantes
│   │   │   ├── reserve/
│   │   │   └── charger-form/
│   │   ├── shared/                  # Componentes compartidos
│   │   │   ├── components/
│   │   │   ├── interceptors/        # HTTP Interceptors
│   │   │   │   └── token.interceptor.ts
│   │   │   └── guards/              # Route Guards
│   │   ├── state/                   # NgRx State Management
│   │   │   ├── actions/             # Actions
│   │   │   │   ├── auth.actions.ts
│   │   │   │   ├── reservation.actions.ts
│   │   │   │   ├── reservation-type.actions.ts
│   │   │   │   ├── building.actions.ts
│   │   │   │   ├── visitor.actions.ts
│   │   │   │   └── user.actions.ts
│   │   │   ├── effects/             # Effects (Side Effects)
│   │   │   │   ├── auth.effects.ts
│   │   │   │   ├── reservation.effects.ts
│   │   │   │   ├── reservation-type.effects.ts
│   │   │   │   ├── building.effect.ts
│   │   │   │   ├── visitor.effects.ts
│   │   │   │   └── user.effects.ts
│   │   │   ├── reducers/            # Reducers
│   │   │   │   ├── auth.reducer.ts
│   │   │   │   ├── reservation.reducer.ts
│   │   │   │   ├── reservation-type.reducer.ts
│   │   │   │   ├── building.reducer.ts
│   │   │   │   ├── visitor.reducer.ts
│   │   │   │   └── user.reducer.ts
│   │   │   ├── selectors/           # Selectors
│   │   │   │   ├── auth.selectors.ts
│   │   │   │   ├── reservation.selectors.ts
│   │   │   │   ├── reservation-type.selectors.ts
│   │   │   │   ├── building.selectors.ts
│   │   │   │   ├── visitor.selectors.ts
│   │   │   │   └── user.selectors.ts
│   │   │   └── app.state.ts         # Estado global
│   │   ├── tabs/                    # Tabs navigation
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── environments/                # Configuración de ambientes
│   │   ├── environment.ts           # Desarrollo
│   │   └── environment.prod.ts      # Producción
│   ├── assets/                      # Recursos estáticos
│   │   ├── svgs/
│   │   └── images/
│   └── theme/                       # Estilos globales
├── android/                         # Proyecto Android nativo
├── ios/                             # Proyecto iOS nativo
├── capacitor.config.ts              # Configuración de Capacitor
├── angular.json                     # Configuración de Angular
├── package.json                     # Dependencias
├── tailwind.config.js               # Configuración de Tailwind
└── tsconfig.json                    # Configuración de TypeScript
```

---

## Pruebas en Dispositivos iPhone

### Requisitos Previos

1. **macOS** con Xcode instalado (versión 14 o superior)
2. **iPhone físico** o **Simulador de iOS**
3. **Cuenta de desarrollador de Apple** (para pruebas en dispositivo físico)
4. **Node.js** y **npm** instalados
5. **Capacitor CLI** instalado

### Configuración Inicial

#### 1. Instalar Dependencias

```bash
npm install
```

#### 2. Compilar la Aplicación Web

```bash
npm run build
```

O para desarrollo con watch mode:

```bash
npm run watch
```

#### 3. Sincronizar Capacitor

```bash
npx cap sync ios
```

Este comando:

- Copia los archivos web compilados a `ios/App/App/public`
- Actualiza las dependencias nativas
- Sincroniza la configuración de `capacitor.config.ts`

### Pruebas en Simulador de iOS

#### 1. Abrir el Proyecto en Xcode

```bash
npx cap open ios
```

#### 2. Seleccionar el Simulador

En Xcode:

- Haz clic en el selector de dispositivos (parte superior izquierda)
- Selecciona un simulador de iPhone (ej: iPhone 15 Pro, iPhone 14, etc.)

#### 3. Ejecutar la Aplicación

- Presiona `Cmd + R` o haz clic en el botón "Play"
- Espera a que el simulador inicie y la app se instale

#### 4. Limitaciones del Simulador

⚠️ **IMPORTANTE**: El simulador de iOS **NO soporta completamente** la funcionalidad de Apple Wallet.

**Limitaciones:**

- No se puede agregar pases a Wallet en el simulador
- La app Wallet puede no estar disponible
- Para probar Apple Wallet, **es obligatorio usar un dispositivo físico**

### Pruebas en iPhone Físico

#### 1. Conectar el iPhone

- Conecta tu iPhone a la Mac mediante cable USB
- Desbloquea el dispositivo
- Si es la primera vez, acepta "Confiar en esta computadora"

#### 2. Configurar Equipo de Desarrollo en Xcode

1. Abre el proyecto en Xcode: `npx cap open ios`
2. Selecciona el proyecto en el navegador izquierdo
3. Ve a la pestaña `Signing & Capabilities`
4. En "Team", selecciona tu equipo de desarrollo
5. Asegúrate de que "Automatically manage signing" esté habilitado

#### 3. Seleccionar el Dispositivo

- En el selector de dispositivos de Xcode (parte superior), selecciona tu iPhone físico
- Debe aparecer con el nombre de tu dispositivo

#### 4. Ejecutar en el Dispositivo

- Presiona `Cmd + R` para compilar e instalar
- **Primera vez**: Es posible que necesites confiar en el certificado de desarrollador:
  1. En el iPhone, ve a `Ajustes > General > Administración de dispositivos`
  2. Toca en tu cuenta de desarrollador
  3. Toca "Confiar en [tu cuenta]"

### Probar la Funcionalidad de Apple Wallet

#### Flujo de Prueba

1. **Iniciar Sesión** en la aplicación
2. **Navegar a la sección de Reservaciones**
3. **Observar** que el botón de Wallet aparece solo en reservaciones activas y no vencidas
4. **Tocar el botón de Wallet** (ícono de cartera)
5. **Verificar** que el pase se descarga y se abre Apple Wallet
6. **Confirmar** que el pase se agregue correctamente

#### ✅ Escenarios de Prueba Validados

| Escenario                    | `is_active` | `end_date` | Botón Visible | Resultado Esperado           |
| ---------------------------- | ----------- | ---------- | ------------- | ---------------------------- |
| Reservación activa válida    | `true`      | Futuro     | ✅ **Sí**     | Pase se agrega correctamente |
| Reservación activa vencida   | `true`      | Pasado     | ❌ **No**     | Botón oculto automáticamente |
| Reservación inactiva         | `false`     | Futuro     | ❌ **No**     | Botón oculto automáticamente |
| Reservación inactiva vencida | `false`     | Pasado     | ❌ **No**     | Botón oculto automáticamente |

#### Verificar en Apple Wallet

Si el pase se agrega correctamente:

1. Abre la app **Wallet** en el iPhone
2. Verifica que el pase aparezca en la lista
3. Toca el pase para ver los detalles:
   - Nombre del evento
   - Fecha de inicio y fin
   - Código QR
   - Información del edificio/reservación

### Debugging en Dispositivo

#### Opción 1: Live Reload

```bash
npx cap run ios --livereload --external
```

Este comando:

- Compila la app
- La ejecuta en el dispositivo
- Habilita live reload (cambios en tiempo real)
- Muestra logs en la consola de la terminal

#### Opción 2: Safari Web Inspector

1. **En el iPhone**:

   - Ve a `Ajustes > Safari > Avanzado`
   - Habilita "Web Inspector"

2. **En la Mac**:

   - Abre Safari
   - Ve a `Develop > [Tu iPhone] > [ezeegoing]`
   - Se abrirá el inspector web

3. **Funcionalidades disponibles**:
   - Inspeccionar DOM
   - Ver logs de consola (`console.log`, `console.error`)
   - Debuggear JavaScript
   - Ver network requests
   - Inspeccionar storage (localStorage, sessionStorage)

#### Ver Logs del Sistema

```bash
# Listar dispositivos conectados
npx cap run ios --list

# Ejecutar en dispositivo específico con logs
npx cap run ios --target="iPhone de [Nombre]"
```

### Solución de Problemas Comunes

#### 1. El botón de Wallet no aparece

**Verificar**:

1. La reservación tiene `is_active: true`
2. La fecha `end_date` es futura
3. El plugin está instalado: `npm list capacitor-pass-to-wallet`
4. Los computed properties están funcionando correctamente

**Debugging**:

```typescript
// En card.component.ts, agregar logs temporales
console.log("is_active:", this.reservation.is_active);
console.log("end_date:", this.reservation.end_date);
console.log("isExpired:", this.isReservationExpired());
console.log("canAddToWallet:", this.canAddToWallet());
```

#### 2. El botón de Wallet no funciona

**Posibles causas:**

- El backend no devuelve un archivo `.pkpass` válido
- La API key es incorrecta
- El `reservationId` no existe en el backend
- Problemas de conectividad de red

**Cómo debuggear:**

1. Abre Safari Web Inspector
2. Ve a la pestaña "Network"
3. Toca el botón de Wallet
4. Verifica la petición HTTP:
   - Status code (debe ser 200)
   - Response headers (debe ser `application/vnd.apple.pkpass`)
   - Response body (debe ser un archivo binario)

#### 3. Error "No se pudo agregar el pase"

**Verificar:**

1. Que el archivo descargado sea un `.pkpass` válido
2. Que el plugin esté instalado: `npm list capacitor-pass-to-wallet`
3. Logs en Safari Web Inspector para ver el error exacto
4. Permisos de la app en iOS

#### 4. La app no se instala en el dispositivo

**Soluciones:**

1. Verifica que el dispositivo esté desbloqueado
2. Confía en la computadora (mensaje en el iPhone)
3. Verifica que el cable USB funcione
4. Reinicia Xcode y el dispositivo
5. Limpia el build: `Product > Clean Build Folder` (Cmd + Shift + K)

#### 5. Error de firma de código

**Soluciones:**

1. Verifica que tengas una cuenta de desarrollador activa
2. En Xcode, ve a `Signing & Capabilities`
3. Selecciona tu equipo correcto
4. Regenera los certificados si es necesario
5. Limpia el build y vuelve a compilar

#### 6. El simulador no inicia

**Soluciones:**

```bash
# Reiniciar todos los simuladores
xcrun simctl shutdown all

# Borrar simuladores y recrearlos
xcrun simctl erase all
```

### Comandos Útiles

```bash
# Compilar y sincronizar
npm run build && npx cap sync ios

# Abrir en Xcode
npx cap open ios

# Ejecutar con live reload
npx cap run ios --livereload --external

# Listar dispositivos disponibles
npx cap run ios --list

# Ejecutar en dispositivo específico
npx cap run ios --target="iPhone de [Nombre]"

# Limpiar y reconstruir
rm -rf ios/App/public
npm run build
npx cap sync ios

# Ver logs en tiempo real
npx cap run ios --livereload
```

### Checklist de Pruebas

#### Funcionalidad General

- [ ] La app se instala correctamente en el dispositivo
- [ ] El login funciona correctamente
- [ ] Las reservaciones se cargan desde el API
- [ ] La navegación entre tabs funciona
- [ ] Los formularios de creación/edición funcionan

#### Apple Wallet (Funcionalidad Completa)

- [ ] El botón de Wallet aparece solo en reservaciones activas y no vencidas
- [ ] El botón NO aparece en reservaciones vencidas
- [ ] El botón NO aparece en reservaciones inactivas
- [ ] Al tocar el botón, se inicia la descarga del pase
- [ ] Se muestra el toast de éxito cuando el pase se agrega
- [ ] Se muestra el toast de error si falla la descarga
- [ ] El pase se agrega a Apple Wallet correctamente
- [ ] El pase muestra información correcta en Wallet
- [ ] El código QR es legible y funcional

#### Validación de Lógica

- [ ] `isReservationExpired()` retorna `true` para fechas pasadas
- [ ] `isReservationExpired()` retorna `false` para fechas futuras
- [ ] `canAddToWallet()` retorna `true` solo cuando ambas condiciones se cumplen
- [ ] La UI se actualiza correctamente cuando cambia el estado

---

## Mejoras Futuras

### Frontend

1. **Indicador visual de estado**

   - Agregar badge o etiqueta que muestre "Vencida" en reservaciones expiradas
   - Usar colores diferentes para reservaciones activas vs inactivas

2. **Caché de pases**

   - Guardar pases descargados en storage local
   - Evitar descargas repetidas
   - Mostrar indicador si el pase ya está en Wallet

3. **Mejoras de UX**
   - Agregar loading spinner durante la descarga del pase
   - Mostrar preview del pase antes de agregarlo
   - Opción para compartir el pase

### Backend

1. **Actualización automática de `is_active`**

   - Implementar un job/cron que actualice `is_active: false` cuando `end_date < Date.now()`
   - O implementar un campo calculado `is_valid` en el API

2. **Validación en el endpoint**

   - El endpoint de descarga de pases debería validar que la reservación sea válida
   - Retornar error 400/403 si la reservación está vencida o inactiva

3. **Webhooks y notificaciones**
   - Notificar a los usuarios cuando una reservación está por expirar
   - Actualizar pases en Wallet automáticamente si cambia información

### Testing

1. **Unit Tests**

   - Tests para `isReservationExpired()` computed property
   - Tests para `canAddToWallet()` computed property
   - Tests para el WalletService

2. **E2E Tests**

   - Implementar tests end-to-end con Cypress o Playwright
   - Simular escenarios de reservaciones vencidas
   - Validar la visibilidad del botón en diferentes estados

3. **Integration Tests**
   - Probar la integración completa con el backend
   - Validar respuestas del API
   - Probar el flujo completo de agregar a Wallet

---

## Contacto y Soporte

Para preguntas o problemas relacionados con el proyecto, contacta al equipo de desarrollo.

**Última actualización**: Diciembre 2024
