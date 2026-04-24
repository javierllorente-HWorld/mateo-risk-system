# Mateo Risk System

Mateo Risk System es un sistema interno de análisis de riesgo para fintech que combina un agente IA de riesgo y un dashboard para que los analistas revisen clientes, solicitantes y pymes según su nivel de riesgo.

<img width="1366" height="613" alt="Acceso interno" src="https://github.com/user-attachments/assets/80be417d-0c82-46b8-b865-1d41cf8fda45" />

Acceso interno: pantalla de login para risk analysts con credenciales corporativas, pensada como puerta de entrada al sistema interno.

<img width="1366" height="1057" alt="Panel de riesgo" src="https://github.com/user-attachments/assets/21317800-d64d-49be-be48-5ba10bcdf179" />

Panel de riesgo: dashboard interno para revisar empresas o personas, con score, nivel de riesgo, decisión y detalle completo del caso.

## Features

- **Agente IA de riesgo** — Clasifica casos según nivel de riesgo antes de la revisión manual.
- **Dashboard interno para risk analysts** — Permite revisar casos en una interfaz pensada para uso interno.
- **Login interno** — Acceso restringido para analistas con credenciales predefinidas.
- **Flujo separado para Persona y Pyme** — Cada vista tiene su propia lógica, datos y estructura.
- **Lista de solicitantes** — Navegación lateral para seleccionar rápidamente el caso a revisar.
- **Detalle del caso** — Visualización de decisión, puntaje, datos clave, resumen, motivos y señales de riesgo.
- **Cambio manual de decisión** — El analista puede cambiar entre Rechazado, Aceptado o Revisión.
- **Riesgo desacoplado de la decisión** — El nivel de riesgo depende del score, no del estado manual.
- **UI interna orientada a operaciones** — Diseño pensado para parecer una herramienta de trabajo real.
- **Deploy público de demo** — Versión accesible para mostrar el producto funcionando.

## En qué me enfoqué

- diseñar una herramienta interna más cercana a un caso real de fintech
- construir un flujo separado para personas y pymes dentro del mismo sistema
- trabajar la lógica entre score, riesgo y decisión manual
- ordenar la experiencia para analistas, no para usuarios finales
- transformar una demo técnica en una interfaz con lógica de producto

## Stack

- HTML
- CSS
- JavaScript
- Vercel
- Cursor
- GitHub

## Estado del proyecto

Prototipo funcional en evolución.  
Actualmente muestra el flujo completo de login, selección de casos, revisión de riesgo y visualización separada para Persona y Pyme. El próximo paso es conectar el sistema a una base de datos real y reemplazar la data mock por fuentes reales.

## Demo

Acceso público de prueba:

- **Link:** https://mateo-risk-system.vercel.app/dashboard/login.html
- **Email:** `risk.analyst.demo@mateo.ai`
- **Password:** `MateoDemo123!`

## Instalación local

```bash
npm install
npm run dev
