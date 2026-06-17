# Mateo Risk System

Mateo Risk System es un proyecto exploratorio de análisis de riesgo para fintech.

Lo construí después de una primera etapa de aprendizaje, con el objetivo de aplicar una lógica simple de evaluación sobre solicitantes, separar casos por nivel de riesgo y visualizar la información en un dashboard interno.

No busca representar un sistema financiero real ni un modelo de riesgo productivo. Es una práctica para entender cómo estructurar reglas de negocio, trabajar con datos simulados y transformar una lógica técnica en una interfaz clara para revisión.

<img width="1366" height="613" alt="Acceso interno" src="https://github.com/user-attachments/assets/80be417d-0c82-46b8-b865-1d41cf8fda45" />

Acceso interno: pantalla de login para risk analysts con credenciales corporativas, pensada como puerta de entrada al sistema interno.

<img width="1366" height="1057" alt="Panel de riesgo" src="https://github.com/user-attachments/assets/21317800-d64d-49be-be48-5ba10bcdf179" />

Panel de riesgo: dashboard interno para revisar empresas o personas, con score, nivel de riesgo, decisión y detalle completo del caso.

## Features

- Lógica de análisis de riesgo — Clasifica casos según score, señales y nivel de riesgo.
- Dashboard interno — Permite revisar solicitantes desde una interfaz pensada para analistas.
- Login de demo — Acceso simple con credenciales predefinidas.
- Flujo para Persona y PyME — Cada tipo de solicitante tiene datos y estructura propia.
- Lista de solicitantes — Navegación lateral para seleccionar rápidamente un caso.
- Detalle del caso — Muestra decisión, puntaje, datos clave, resumen, motivos y señales de riesgo.
- Cambio manual de decisión — El analista puede cambiar entre Aceptado, Rechazado o Revisión.
- Demo pública — Versión desplegada para mostrar el flujo funcionando.

## En qué me enfoqué

- Diseñar una herramienta interna cercana a un caso de uso fintech.
- Practicar la relación entre datos, score, riesgo y decisión.
- Separar la experiencia para personas y PyMEs.
- Ordenar la información para un usuario operativo, no para un cliente final.
- Convertir una lógica técnica simple en una interfaz clara de revisión.

## Stack

- HTML
- CSS
- JavaScript
- Vercel
- Cursor
- GitHub

## Estado del proyecto

Proyecto exploratorio funcional.

Actualmente muestra el flujo de login, selección de casos, revisión de riesgo y visualización separada para Persona y PyME. Usa datos simulados y reglas simples para representar el proceso de análisis.
No es un modelo financiero real ni un sistema listo para producción. El objetivo fue practicar lógica de negocio, estructura de datos e interfaz interna aplicada a un caso fintech.

## Demo

Acceso público de prueba:

- **Link:** https://mateo-risk-system.vercel.app/dashboard/login.html
- **Email:** `risk.analyst.demo@mateo.ai`
- **Password:** `MateoDemo123!`

## Instalación local

```bash
npm install
npm run dev
