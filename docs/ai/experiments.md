# Experimentos con IA en programación

Comparativa de resolver problemas con y sin IA, midiendo tiempo, calidad y comprensión.

---

## Experimento 1 — Problema general: Implementar una función `memoize`

### Sin IA

**Tiempo:** ~25 minutos

Sabía más o menos qué hacía memoize (guardar resultados para no repetir cálculos), así que empecé usando un objeto como caché. Luego me di cuenta de que tenía que soportar varios argumentos, así que usé JSON.stringify para crear una clave.

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

**Calidad:** Funciona en casos simples, pero tiene limitaciones
**Comprensión:** Alta, porque tuve que pensar cada paso.

---

### Con IA

**Tiempo:** ~5 minutos (incluyendo revisar la respuesta)

**Prompt:** "Implementa una función memoize en JavaScript. Explica cómo manejas argumentos múltiples y qué limitaciones tiene tu implementación."

La IA dio una solución muy parecida, pero en lugar de usar un objeto, utilizó un Map, que es más seguro para este tipo de casos. También explicó claramente las limitaciones de usar JSON.stringify y mencionó alternativas como WeakMap.

**Calidad:** Mejor, tanto en implementación como en explicación.
**Comprensión:** Media. Lo entendí, pero no habría llegado solo a algunas ideas.

**Conclusión:** La IA fue mucho más rápida y dio una mejor solución. Aun así, intentar hacerlo primero ayudó a entender por qué su versión era mejor.

---

## Experimento 2 — Problema general: Aplanar array anidado sin `Array.flat`

### Sin IA

**Tiempo:** ~15 minutos

Desde el principio pensé en usar recursión. Lo implementé con reduce y tardé un poco en ajustar el tema de la profundidad.

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

La IA generó prácticamente la misma solución. Además, propuso otra forma de hacerlo sin recursión (usando una pila), que puede ser mejor en algunos casos.

**Calidad:** Igual de buena, con una mejora extra.
**Comprensión:** Alta, porque ya había entendido el problema antes.

**Conclusión:** La IA ahorra mucho tiempo, pero en este caso el aprendizaje fue similar porque el problema era bastante directo.

---

## Experimento 3 — Problema general: Implementar una función de debounce

### Sin IA

**Tiempo:** ~20 minutos

Sabía la idea general, pero no cómo implementarla exactamente. Cometí un error al principio colocando mal una variable, lo que me hizo entender mejor cómo funcionan los closures.

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

La IA generó la misma solución y añadió mejoras, como una opción extra para cambiar el comportamiento y una explicación de conceptos relacionados.

**Calidad:** Más completa con la opción `leading`.
**Comprensión:** Media. Sin haber fallado primero con el closure, el código correcto no me habría enseñado por qué funciona.

**Conclusión:** Este es un buen ejemplo de que equivocarse primero ayuda mucho a aprender.

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