# Risk Analyst Agent (Fintech) — Minimal

## Qué hace
Este proyecto contiene un **agente mínimo de risk** para **solicitudes de crédito**. Evalúa una solicitud, calcula un **score** simple, y devuelve una **decisión** junto con banderas y motivos.

## Inputs
El agente analiza un objeto `CreditApplication` (ver `agent/risk_schema.ts`) con campos como:
- `requestedAmount`, `monthlyIncome`
- `employmentStatus`, `monthsAtJob`
- `hasDefaults`
- `country`, `currency`, `applicantAgeYears`, `id`

## Outputs
El agente devuelve un `RiskAssessment` con:
- `score`: número (mayor = más riesgoso)
- `decision`: `"approve" | "review" | "reject"`
- `summary`: texto corto explicando la decisión
- `flags`: lista de flags (strings)
- `reasons`: lista de motivos (strings)

## Cómo correr el test
Ejecuta los 3 casos (approve / review / reject) e imprime el resultado en consola:

```bash
node agent/test_risk_agent.ts
```

