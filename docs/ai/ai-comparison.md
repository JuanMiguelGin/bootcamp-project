# Comparativa entre asistentes de IA: ChatGPT vs Claude

## Metodología

En este trabajo se compararon dos asistentes de inteligencia artificial: ChatGPT (GPT-4o) y Claude (Sonnet 4). Para hacerlo, se probaron en tres tipos de tareas: explicar conceptos, encontrar errores en código y generar código.

---

## 1. Explicación de conceptos técnicos

### 1.1 Closures

**Prompt utilizado:**
> "Explícame qué es un closure en JavaScript con un ejemplo práctico."

**ChatGPT:**
Explicó que un closure es cuando una función puede “recordar” variables de donde fue creada. Puso un ejemplo sencillo de un contador y mencionó algunos usos prácticos. La explicación fue clara y fácil de seguir.

**Claude:**
Empezó con una comparación (como si la función llevara una mochila con variables dentro), lo que lo hace más fácil de imaginar. Además del ejemplo del contador, añadió otro caso típico con bucles (let vs var) y explicó un error bastante común.

**Conclusión:** Claude dio una explicación más completa y con más ejemplos. ChatGPT fue más directo y fácil de leer.

---

### 1.2 Event Loop

**Prompt utilizado:**
> "Explícame el event loop de JavaScript paso a paso."

**ChatGPT:**
Explicó los conceptos principales como la pila de ejecución, la cola y las Web APIs. Usó setTimeout como ejemplo y lo organizó bien, pero no entró en detalles más avanzados.

**Claude:**
Además de lo anterior, explicó también las microtareas (microtasks) y la diferencia con otras tareas. Mostró por qué las Promises se ejecutan antes que un setTimeout, con un ejemplo práctico.

**Conclusión:** Claude fue más completo y explicó mejor cómo funciona realmente JavaScript en casos reales.

---

### 1.3 Hoisting

**Prompt utilizado:**
> "¿Qué es el hoisting en JavaScript? ¿Qué diferencias hay entre var, let y const en este contexto?"

**ChatGPT:**
Explicó que var se declara al principio con valor undefined, mientras que let y const no se pueden usar antes de declararse. Dio un ejemplo claro.

**Claude:**
Explicó lo mismo, pero añadió un detalle importante: las funciones declaradas se pueden usar antes de escribirse en el código, cosa que no pasa con funciones guardadas en variables. Incluyó un ejemplo para demostrarlo.

**Conclusión:** Claude cubrió más detalles importantes que ayudan a entender mejor cómo funciona JavaScript.

---

## 2. Detección de bugs

### Bug 1: Problema con arrays

```javascript
function duplicarElementos(arr) {
  const resultado = arr;
  resultado.push(99);
  return resultado;
}

const original = [1, 2, 3];
duplicarElementos(original);
console.log(original); // ¿Qué imprime?
```

**Prompt:** "¿Hay algún bug en esta función? Explica qué sucede."

**ChatGPT:** Detectó que no se estaba copiando el array, sino usando el mismo. Propuso soluciones simples.

**Claude:** Detectó el mismo error, pero además explicó por qué ocurre (cómo funcionan las referencias en JavaScript) y dio varias formas de solucionarlo.

---

### Bug 2: Problema con asincronía

```javascript
function obtenerDatos() {
  let datos;
  fetch('https://api.example.com/data')
    .then(res => res.json())
    .then(json => { datos = json; });
  return datos;
}

console.log(obtenerDatos());
```

**Prompt:** "Esta función siempre devuelve undefined. ¿Por qué y cómo lo arreglas?"

**ChatGPT:** Explicó que el problema es que la función es asíncrona y por eso devuelve undefined. Dio soluciones con async/await y Promises.

**Claude:** Lo mismo, pero añadió que es un error muy común al empezar y explicó un poco más el porqué. También incluyó comentarios dentro del código.

---

### Bug 3: Comparaciones raras

```javascript
function esIgual(a, b) {
  return a == b;
}

console.log(esIgual(0, false));  // true o false?
console.log(esIgual('', 0));     // true o false?
console.log(esIgual(null, undefined)); // true o false?
```

**Prompt:** "¿Hay algún problema con esta función? Explica los resultados."

**ChatGPT:** Explicó que usar == puede dar resultados inesperados y recomendó usar ===. Fue al grano.

**Claude:** Explicó más a fondo cómo JavaScript convierte los tipos automáticamente y por qué pasan esos resultados. Incluso mencionó en qué casos usar == puede tener sentido.

---

## 3. Generación de código

### Función 1: Debounce

**Prompt:** "Escribe una función `debounce(fn, delay)` que retrase la ejecución de fn hasta que pasen `delay` ms sin que se vuelva a llamar."

**ChatGPT:** Código correcto, limpio y sin complicaciones.

**Claude:** También correcto, pero además añadió comentarios, explicación y un ejemplo de uso.

**Calidad del código ChatGPT:** ✅ Correcto, mínimo
**Calidad del código Claude:** ✅ Correcto, documentado y contextualizado

---

### Función 2: Deep clone sin librería

**Prompt:** "Escribe una función `deepClone(obj)` que haga una copia profunda de un objeto sin usar librerías."

**ChatGPT:** Usó una solución rápida (JSON.parse(JSON.stringify(obj))), pero con limitaciones.

**Claude:** Hizo una función más completa que maneja mejor diferentes tipos de datos.

**Calidad del código ChatGPT:** ⚠️ Solución simplista con limitaciones importantes
**Calidad del código Claude:** ✅ Implementación real y correcta

---

### Función 3: Agrupar array de objetos por clave

**Prompt:** "Escribe una función que agrupe un array de objetos por el valor de una clave específica."

**ChatGPT:** Solución correcta y directa usando reduce.

**Claude:** Igual de correcta, pero con más extras como tipos y ejemplos.

**Calidad del código ChatGPT:** ✅ Correcto y conciso
**Calidad del código Claude:** ✅ Correcto, tipado y con ejemplos

---

## Conclusiones generales

| Criterio | ChatGPT | Claude |
|---|---|---|
| Claridad | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Profundidad técnica | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Calidad de ejemplos | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Detección de bugs | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Generación de código | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Concisión | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

**ChatGPT** es mejor cuando necesitas una respuesta rápida, clara y sin demasiadas vueltas.

**Claude** destaca más cuando quieres entender bien un tema, con explicaciones más completas y ejemplos más detallados.