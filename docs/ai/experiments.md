# Experimentos con IA en programación

Comparativa de resolver problemas con y sin IA, midiendo tiempo, calidad y comprensión.

---

## Experimento 1 — Problema general: Implementar una función `memoize`

### Sin IA

**Tiempo:** ~25 minutos

Sabía que memoize guarda resultados en caché. Empecé con un objeto plano como caché y luego me di cuenta de que tenía que manejar argumentos múltiples. Usé `JSON.stringify(arguments)` como clave. Al probarlo, fallé con funciones que reciben objetos circulares. Solución final funcional pero sin manejar ese edge case.

```javascript
function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) return cache[key];
    cache[key] = fn.apply(this, args);
    return cache[key];
  };
}
```

**Calidad:** Funcional para casos simples. No maneja objetos circulares ni funciones con `this` complejo.
**Comprensión:** Alta. Entendí exactamente por qué cada línea existe porque tuve que razonarla.

---

### Con IA

**Tiempo:** ~5 minutos (incluyendo revisar la respuesta)

**Prompt:** "Implementa una función memoize en JavaScript. Explica cómo manejas argumentos múltiples y qué limitaciones tiene tu implementación."

La IA generó una implementación similar pero usó un `Map` en lugar de un objeto plano (evita colisiones con claves como `__proto__`), y mencionó explícitamente la limitación de `JSON.stringify` con referencias circulares y funciones como argumento. También sugirió `WeakMap` para evitar memory leaks si los argumentos son objetos.

**Calidad:** Mejor. Eligió `Map` por una razón válida y documentó las limitaciones.
**Comprensión:** Media. Entendí la solución porque la revisé, pero no habría llegado a `WeakMap` yo solo en ese tiempo.

**Conclusión:** La IA fue 5x más rápida y el código fue de mejor calidad. Pero sin haber intentado resolverlo primero, no habría entendido por qué `Map` es mejor que un objeto plano.

---

## Experimento 2 — Problema general: Aplanar array anidado sin `Array.flat`

### Sin IA

**Tiempo:** ~15 minutos

Pensé en recursión desde el principio. La implementé con `reduce` y spread. Tardé un rato en recordar cómo manejar la profundidad variable (`depth` param).

```javascript
function flatten(arr, depth = Infinity) {
  return depth > 0
    ? arr.reduce((acc, val) => acc.concat(
        Array.isArray(val) ? flatten(val, depth - 1) : val
      ), [])
    : arr.slice();
}
```

**Calidad:** Correcta y completa con soporte de profundidad.
**Comprensión:** Muy alta. La recursión la entiendo bien porque la razoné desde cero.

---

### Con IA

**Tiempo:** ~2 minutos

La IA generó casi exactamente la misma solución. Añadió una versión iterativa con stack como alternativa más eficiente para arrays muy grandes (evita stack overflow en recursión profunda).

**Calidad:** Equivalente + bonus de la versión iterativa.
**Comprensión:** Alta, porque el problema ya lo tenía claro de haberlo resuelto antes.

**Conclusión:** Para este problema, la diferencia en tiempo fue grande (15 vs 2 min) pero la comprensión fue similar porque el algoritmo es directo. La IA aportó la variante iterativa que no habría considerado.

---

## Experimento 3 — Problema general: Implementar una función de debounce

### Sin IA

**Tiempo:** ~20 minutos

Conocía el concepto pero no la implementación exacta. Pasé tiempo entendiendo que `clearTimeout` necesita el ID que devuelve `setTimeout`, y que hay que cerrar sobre esa variable con un closure. Primer intento fallido porque puse `let timerId` dentro de la función devuelta en lugar de fuera.

```javascript
function debounce(fn, delay) {
  let timerId;
  return function(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

**Calidad:** Correcta.
**Comprensión:** Muy alta. El error inicial me hizo entender exactamente por qué el closure es necesario.

---

### Con IA

**Tiempo:** ~3 minutos

La IA generó la misma implementación y añadió una variante con opción `leading` (ejecutar al inicio del periodo en lugar del final). También mencionó la diferencia con throttle.

**Calidad:** Más completa con la opción `leading`.
**Comprensión:** Media. Sin haber fallado primero con el closure, el código correcto no me habría enseñado por qué funciona.

**Conclusión:** Este es el caso donde hacerlo sin IA primero tuvo más valor educativo. El error con el closure fue el aprendizaje real.

---

## Experimentos con TaskFlow

### Experimento 4 — Añadir ordenación de tareas sin IA

**Tiempo:** ~35 minutos
**Tarea:** Añadir un selector para ordenar tareas por fecha de creación (más nueva / más antigua) o por estado (completadas al final).

Tuve que modificar `getVisibleTasks()`, añadir estado `sortOrder`, actualizar el HTML y conectar el evento. Lo más complicado fue recordar que `Array.sort` muta el array original y que necesitaba `.slice()` antes de ordenar para no romper el estado.

**Calidad:** Funcional. El código quedó algo largo dentro de `getVisibleTasks`.
**Comprensión:** Alta.

---

### Experimento 5 — Añadir ordenación de tareas con IA

**Tiempo:** ~12 minutos (incluyendo revisión y adaptación)

**Prompt:** "Tengo una app de tareas con un array tasks = [{id, title, completed, createdAt}]. Quiero añadir ordenación por: fecha más nueva, fecha más antigua, completadas al final. Dame solo las modificaciones necesarias en app.js, asumiendo que ya existe una variable `filter` y una función `getVisibleTasks()`."

La IA generó el estado `sortOrder`, la lógica de ordenación separada en su propia función `sortTasks(tasks)` y la llamada desde `getVisibleTasks`. Mejor separación de responsabilidades que mi versión manual.

**Calidad:** Mejor estructura. `sortTasks` como función independiente es más testeable.
**Comprensión:** Alta porque conocía el problema de antemano.

---

### Experimento 6 — Añadir confirmación al borrar tareas

**Sin IA — Tiempo:** ~8 minutos. Usé `window.confirm` directamente en `deleteTask`. Simple.

**Con IA — Tiempo:** ~5 minutos. La IA sugirió evitar `window.confirm` (bloquea el hilo y no es personalizable) y propuso un pequeño modal inline con clases Tailwind consistentes con el resto del proyecto. Más trabajo de implementar pero mejor UX.

**Conclusión:** La IA propuso una solución de mayor calidad que la que habría elegido por velocidad.

---

## Resumen de los experimentos

| Experimento | Sin IA | Con IA | Diferencia tiempo | Mejor comprensión | Mejor calidad |
|---|---|---|---|---|---|
| Memoize | 25 min | 5 min | 5x | Sin IA | Con IA |
| Flatten | 15 min | 2 min | 7x | Igual | Con IA (variante) |
| Debounce | 20 min | 3 min | 6x | Sin IA | Similar |
| Ordenación TaskFlow | 35 min | 12 min | 3x | Similar | Con IA |
| Confirmación borrar | 8 min | 5 min | 1.6x | Igual | Con IA |

**Observación principal:** La IA es más rápida casi siempre, pero la comprensión es mayor cuando intentas resolverlo primero. El flujo óptimo parece ser: intenta 10-15 min → si no avanzas, usa IA y estudia por qué funciona su solución.