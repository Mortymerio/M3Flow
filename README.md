# 🚀 M3Flow
> **The High-Performance, Local-First Knowledge Vault**

M3Flow es una plataforma de escritura de alto rendimiento diseñada para la claridad mental y el flujo creativo constante. A diferencia de otros editores, M3Flow vive en tu máquina, vuela con SQLite y se adapta a tu estilo visual mediante un motor de temas reactivo de última generación.

---

## 🔥 Novedades de esta Versión

- **🔍 Command Palette (Ctrl+P):** Navegación instantánea. Busca en el contenido de todas tus notas y salta entre notebooks en milisegundos con una interfaz limpia y desenfocada.
- **💎 New Experience Modal:** Un panel "About" completamente rediseñado con estética *glassmorphism*, animaciones sutiles y crédito de autoría profesional ("Created by Mariano").
- **🎓 Onboarding System:** Nueva capa de ayuda interactiva para usuarios nuevos que guía sobre las funciones principales sin interrumpir el flujo de trabajo.
- **🛠️ UI Hardening:** Sistema anti-overscroll y corrección de color reactiva. Los textos e iconos ahora cambian dinámicamente según el tema para garantizar legibilidad al 100%.

---

## ✨ Características Principales

| Característica | Detalle |
| :--- | :--- |
| **Local-First Architecture** | Privacidad total. SQLite local con rendimiento de grado empresarial. |
| **Mermaid & Markdown** | Soporte completo para diagramas de flujo, diagramas de secuencia y resaltado de sintaxis `hljs`. |
| **Editor Modeless** | Elige entre edición estándar, **VIM** o **Emacs** desde la configuración rápida. |
| **Temas Dinámicos** | Soporte para temas oscuros, claros y un modo **Custom** donde puedes definir tu propia paleta. |
| **Exportación PRO** | Genera archivos `.md` limpios o documentos `.pdf` profesionales con un solo clic. |

---

## 🛠️ Stack Tecnológico

- **Core:** `React 19` + `Vite` + `Tailwind CSS 4`.
- **Backend:** `Better-SQLite3` con optimización de persistencia asíncrona.
- **UI/UX:** `Lucide React` + `Framer Motion` (animaciones) + `Zustand` (estado global).
- **Editor:** `CodeMirror 6` con extensiones personalizadas de Markdown y Lenguajes.

---

## 🚀 Guía Rápida para Desarrolladores

### 1. Preparar el entorno
```bash
# Instalar dependencias
npm install

# Configurar binarios nativos de Electron
npm run postinstall
```

### 2. Lanzar en Desarrollo
```bash
# Servidor de desarrollo con Hot Module Replacement (HMR)
npm run dev
```

### 3. Build & Packaging
```bash
# Generar el instalable optimizado para Windows
npm run build
```

---

## ⌨️ Comandos Clave

- `Ctrl + P`: Abrir buscador global de notas.
- `B / I / S / </> / A`: Atajos visuales de formato en el toolbar del editor.

## ⌨️ Atajos de Teclado y Comandos

M3Flow utiliza **CodeMirror 6**, lo que permite una edición fluida con los siguientes comandos estándar:

### Edición e Historial
- `Ctrl + Z` / `Cmd + Z`: Deshacer.
- `Ctrl + Y` / `Cmd + Shift + Z`: Rehacer.
- `Alt + ↑ / ↓`: Mover línea actual hacia arriba o abajo.
- `Shift + Alt + ↑ / ↓`: Duplicar línea o bloque.
- `Ctrl + Shift + K`: Eliminar línea actual.

### Navegación y Selección
- `Ctrl + A`: Seleccionar todo el documento.
- `Ctrl + D`: Selección múltiple (selecciona la siguiente ocurrencia).
- `Alt + ← / →`: Mover cursor por palabras.
- `Ctrl + /`: Comentar o des-comentar línea.

### Búsqueda
- `Ctrl + F`: Buscar dentro de la nota actual.
- `Ctrl + H`: Buscar y reemplazar.
- `F3`: Saltar al siguiente resultado de búsqueda.

> [!IMPORTANT]
> Si tienes activado el **Modo VIM** o **Emacs**, estos comandos cambiarán para seguir los estándares de navegación de dichos editores.

---

## 👤 Créditos y Visión

Diseñado y desarrollado por **Mariano**.
*M3Flow nació de la necesidad de una herramienta que no solo guarde texto, sino que facilite el pensamiento estructurado sin distracciones externas ni latencia de red.*

---

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia **MIT**.

---
