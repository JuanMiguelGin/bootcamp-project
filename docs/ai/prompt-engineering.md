# Prompt Engineering aplicado al desarrollo

Colección de prompts útiles descubiertos durante el desarrollo de TaskFlow, con explicación de por qué funcionan.

---

## Prompt 1 — Rol de desarrollador senior

```
Actúa como un desarrollador senior de JavaScript con 10 años de experiencia en
proyectos de producción. Revisa esta función y dime qué mejorarías en términos
de rendimiento, legibilidad y mantenibilidad:

[código]
```

**Por qué funciona:** Asignar un rol hace que la IA ajuste el nivel de detalle y el tipo de feedback. Sin el rol, la respuesta tiende a ser genérica. Con él, prioriza aspectos de código en producción real.

---

## Prompt 2 — Few-shot para detección de bugs

```
Voy a mostrarte funciones JavaScript con bugs. Responde con el formato:
BUG: [descripción breve]
CAUSA: [explicación técnica]
FIX: [código corregido]

Ejemplo:
Función: function suma(a,b) { return a - b; }
BUG: Operación incorrecta
CAUSA: Usa resta en lugar de suma
FIX: function suma(a,b) { return a + b; }

Ahora analiza esta función:
[tu función con bug]
```

**Por qué funciona:** El few-shot (dar un ejemplo antes de la pregunta real) fuerza a la IA a seguir un formato estructurado. Sin el ejemplo, las respuestas son narrativas y más difíciles de escanear.

---

## Prompt 3 — Razonamiento paso a paso

```
Quiero entender el event loop de JavaScript. Explícamelo paso a paso,
empezando desde cero. Después de cada paso, dame un ejemplo de código
pequeño que demuestre ese concepto específico antes de continuar.
```

**Por qué funciona:** "Paso a paso" activa un modo de razonamiento más metódico. Pedir ejemplos en cada paso previene que la IA salte a conclusiones sin que el concepto quede claro.

---

## Prompt 4 — Restricciones claras de respuesta

```
Genera una función JavaScript que implemente debounce. 

Restricciones:
- Máximo 20 líneas de código
- Sin dependencias externas
- Con comentarios JSDoc
- Un solo ejemplo de uso al final como comentario
- Sin explicaciones fuera del código
```

**Por qué funciona:** Las restricciones evitan respuestas largas con mucho texto introductorio. Cuando necesitas código usable directamente, las restricciones ahorran mucho tiempo de edición posterior.

---

## Prompt 5 — Revisión de código con criterios específicos

```
Revisa este código JavaScript con estos criterios específicos en este orden:
1. ¿Hay memory leaks potenciales?
2. ¿Los nombres de variables son descriptivos?
3. ¿Hay lógica duplicada que se pueda extraer?
4. ¿Qué test unitario añadirías primero?

[código]
```

**Por qué funciona:** Dar criterios ordenados evita que la IA responda de forma vaga ("el código se puede mejorar"). Cada punto del prompt corresponde a una sección de la respuesta, lo que la hace más accionable.

---

## Prompt 6 — Documentación de función existente

```
Eres un técnico que escribe documentación para otros desarrolladores del equipo.
Documenta esta función con JSDoc. La documentación debe ser útil para alguien
que no conoce el proyecto. Incluye: descripción, @param, @returns y un @example.

[función]
```

**Por qué funciona:** El rol de "técnico que escribe para el equipo" orienta el nivel de detalle. Sin él, JSDoc tiende a ser demasiado obvio o demasiado escueto.

---

## Prompt 7 — Generación de casos de test

```
Para la siguiente función JavaScript, genera 5 casos de test usando
la sintaxis de Jest (describe/it/expect). Cubre:
- El caso más común (happy path)
- Valores límite o edge cases
- Entradas inválidas o inesperadas

[función]
```

**Por qué funciona:** Especificar qué tipos de casos cubrir (happy path, edge cases, entradas inválidas) produce tests más completos. Sin esa guía, los tests tienden a repetir el caso normal con variantes triviales.

---

## Prompt 8 — Refactorización con objetivo concreto

```
Refactoriza esta función con un único objetivo: que sea más fácil de testear
de forma unitaria. No cambies la funcionalidad externa. Explica en dos frases
qué cambios hiciste y por qué mejoran la testabilidad.

[función]
```

**Por qué funciona:** Un objetivo único ("más fácil de testear") da dirección clara. Cuando el objetivo es vago ("mejora este código"), los cambios son impredecibles y a veces contradictorios.

---

## Prompt 9 — Explicación de código desconocido

```
Explícame este código como si fuera a explicárselo a un compañero de equipo
en una code review. Qué hace, por qué está escrito así y si hay algo que
cambiarías o que podría causar confusión en el futuro.

[código]
```

**Por qué funciona:** El contexto de "code review" produce explicaciones orientadas a la comprensión y al riesgo, no solo a describir lo que hace el código línea por línea.

---

## Prompt 10 — Ideas de mejora para un proyecto

```
Eres un product engineer con experiencia en apps de productividad.
Revisa esta descripción de TaskFlow (app de gestión de tareas):
[descripción breve]

Dame 5 ideas de nuevas funcionalidades ordenadas de menor a mayor esfuerzo
de implementación. Para cada una: nombre, descripción en una frase y
qué archivo(s) del proyecto habría que modificar.
```

**Por qué funciona:** Pedir ordenación por esfuerzo hace la lista accionable (puedes empezar por las fáciles). Pedir los archivos a modificar conecta la idea con el código real.

---

## Notas generales sobre prompt engineering

- **Ser específico siempre gana a ser general.** "Mejora este código" produce resultados mediocres. "Reduce el número de operaciones DOM en esta función" produce resultados accionables.
- **Los roles ayudan más en tareas de revisión que en tareas de generación.** Para generar código nuevo, las restricciones importan más que el rol.
- **Los ejemplos (few-shot) son especialmente útiles para formatear la salida.** Si necesitas la respuesta en un formato específico, muestra un ejemplo de ese formato antes de la pregunta real.
- **Pedir razonamiento paso a paso funciona mejor en conceptos, no en código.** Para código, es mejor pedir restricciones y criterios concretos.