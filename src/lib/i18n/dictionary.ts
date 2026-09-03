export type Lang = "es" | "en";

export const CATEGORY_LABELS: Record<string, { es: string; en: string }> = {
  no_access_code: { es: "Sin código de acceso", en: "No access code" },
  gate_locked: { es: "Portón/edificio cerrado", en: "Gate/building locked" },
  customer_unavailable: { es: "Cliente no disponible", en: "Customer unavailable" },
  unsafe_location: { es: "Ubicación insegura", en: "Unsafe location" },
  damaged_package: { es: "Paquete dañado", en: "Damaged package" },
  missing_package: { es: "Paquete faltante", en: "Missing package" },
  wrong_address: { es: "Dirección incorrecta/inaccesible", en: "Wrong/inaccessible address" },
  delivery_instructions: { es: "Problema con instrucciones de entrega", en: "Delivery instructions problem" },
  vehicle_route_issue: { es: "Problema de vehículo/ruta", en: "Vehicle/route issue" },
  weather_or_external: { es: "Clima u otra condición externa", en: "Weather or other external condition" },
  other: { es: "Otro", en: "Other" },
};

export const ACTION_TAKEN_LABELS: Record<string, { es: string; en: string }> = {
  marked_in_app: { es: "Marcado en la app", en: "Marked in the app" },
  called_support: { es: "Llamé a Soporte", en: "Called Support" },
  emailed_amazon: { es: "Envié un email a Amazon", en: "Emailed Amazon" },
  returned_no_action: { es: "Devolví el paquete a la estación", en: "Returned the package to the station" },
  other: { es: "Otro", en: "Other" },
};

export interface Dictionary {
  appName: string;
  nav: {
    dashboard: string;
    stations: string;
    blocks: string;
    search: string;
    logout: string;
  };
  auth: {
    loginTitle: string;
    signupTitle: string;
    email: string;
    password: string;
    loginButton: string;
    signupButton: string;
    noAccount: string;
    hasAccount: string;
    error: string;
    checkEmail: string;
    emailNotConfirmed: string;
    alreadyRegistered: string;
  };
  dashboard: {
    title: string;
    activeBlock: string;
    noActiveBlock: string;
    quickIncident: string;
    newBlock: string;
    recentIncidents: string;
    noIncidents: string;
  };
  stations: {
    title: string;
    new: string;
    name: string;
    code: string;
    address: string;
    save: string;
    active: string;
    inactive: string;
    none: string;
  };
  blocks: {
    title: string;
    new: string;
    date: string;
    startTime: string;
    endTime: string;
    station: string;
    payAmount: string;
    save: string;
    none: string;
    viewDetail: string;
    deleteConfirm: string;
    delete: string;
    finish: string;
    finishConfirm: string;
    closedAt: string;
    open: string;
    closed: string;
  };
  incident: {
    quickCapture: string;
    sectionPackage: string;
    sectionWhatHappened: string;
    sectionWhatYouDid: string;
    sectionEvidence: string;
    scope: string;
    scopePackage: string;
    scopeBlock: string;
    tba: string;
    category: string;
    actionTaken: string;
    record: string;
    stop: string;
    recording: string;
    playback: string;
    narrativeAudio: string;
    narrativeText: string;
    narrativePlaceholder: string;
    photo: string;
    micError: string;
    micDenied: string;
    micNotFound: string;
    micUnsupported: string;
    save: string;
    saving: string;
    saved: string;
    detail: string;
    timestamp: string;
    linkedPackages: string;
    noLinkedPackages: string;
    actionTakenLabel: string;
    actionTakenRequired: string;
    narrativeLabel: string;
    addCommunication: string;
    commType: string;
    commSummary: string;
    commReference: string;
    commSave: string;
    communications: string;
    evidence: string;
    saveChanges: string;
    recordNarrativeAudio: string;
    recordCommAudio: string;
    savedWithComm: string;
  };
  search: {
    title: string;
    date: string;
    station: string;
    tba: string;
    category: string;
    any: string;
    submit: string;
    results: string;
    none: string;
  };
  common: {
    loading: string;
    cancel: string;
    delete: string;
    edit: string;
    back: string;
  };
}

export const COMMUNICATION_TYPE_LABELS: Record<string, { es: string; en: string }> = {
  support_call: { es: "Llamada a Soporte", en: "Support call" },
  support_email: { es: "Email recibido de Amazon", en: "Email received from Amazon" },
  driver_email: { es: "Email enviado a Amazon", en: "Email sent to Amazon" },
  other: { es: "Otro", en: "Other" },
};

export const dictionary: Record<Lang, Dictionary> = {
  es: {
    appName: "Bitácora de Incidentes",
    nav: {
      dashboard: "Inicio",
      stations: "Estaciones",
      blocks: "Bloques",
      search: "Buscar",
      logout: "Cerrar sesión",
    },
    auth: {
      loginTitle: "Iniciar sesión",
      signupTitle: "Crear cuenta",
      email: "Correo electrónico",
      password: "Contraseña",
      loginButton: "Entrar",
      signupButton: "Crear cuenta",
      noAccount: "¿No tienes cuenta? Regístrate",
      hasAccount: "¿Ya tienes cuenta? Inicia sesión",
      error: "No se pudo completar la acción. Verifica tus datos.",
      checkEmail: "Revisa tu correo para confirmar la cuenta.",
      emailNotConfirmed: "Confirma tu correo antes de iniciar sesión (revisa la bandeja de entrada).",
      alreadyRegistered: "Ese correo ya tiene una cuenta. Inicia sesión en su lugar.",
    },
    dashboard: {
      title: "Inicio",
      activeBlock: "Bloque activo",
      noActiveBlock: "No tienes un bloque activo. Crea uno para empezar.",
      quickIncident: "Incidente rápido",
      newBlock: "Nuevo bloque",
      recentIncidents: "Incidentes recientes",
      noIncidents: "Todavía no hay incidentes registrados.",
    },
    stations: {
      title: "Estaciones",
      new: "Nueva estación",
      name: "Nombre",
      code: "Código de estación",
      address: "Dirección",
      save: "Guardar",
      active: "Activa",
      inactive: "Inactiva",
      none: "Todavía no tienes estaciones. Crea la primera.",
    },
    blocks: {
      title: "Bloques",
      new: "Nuevo bloque",
      date: "Fecha",
      startTime: "Hora de inicio",
      endTime: "Hora de fin (opcional)",
      station: "Estación",
      payAmount: "Valor a pagar ($)",
      save: "Guardar bloque",
      none: "Todavía no tienes bloques registrados.",
      viewDetail: "Ver detalle",
      deleteConfirm: "¿Borrar este bloque? Se eliminarán también sus incidentes y evidencia. Esta acción no se puede deshacer.",
      delete: "Borrar bloque",
      finish: "Finalizar bloque",
      finishConfirm: "¿Marcar este bloque como finalizado? La hora que Amazon programó no cambia, solo se registra la hora real en que terminaste.",
      closedAt: "Cerrado",
      open: "Activo",
      closed: "Cerrado",
    },
    incident: {
      quickCapture: "Incidente rápido",
      sectionPackage: "Paquete",
      sectionWhatHappened: "Qué pasó",
      sectionWhatYouDid: "Qué hiciste",
      sectionEvidence: "Evidencia",
      scope: "¿A qué aplica este incidente?",
      scopePackage: "Un paquete / TBA específico",
      scopeBlock: "Todo el bloque",
      tba: "TBA (opcional)",
      category: "¿Qué pasó?",
      actionTaken: "¿Qué hiciste?",
      record: "Grabar audio",
      stop: "Detener",
      recording: "Grabando…",
      playback: "Escuchar",
      narrativeAudio: "🎙 Audio",
      narrativeText: "✍️ Texto",
      narrativePlaceholder: "Describe brevemente qué pasó...",
      photo: "Adjuntar foto",
      micError: "No se pudo grabar el audio. Intenta de nuevo.",
      micDenied: "Permiso de micrófono denegado. Revisa los permisos del navegador para este sitio.",
      micNotFound: "No se encontró un micrófono en este dispositivo.",
      micUnsupported: "Este navegador no soporta grabación de audio. Prueba con Chrome o Safari actualizado.",
      save: "Guardar incidente",
      saving: "Guardando…",
      saved: "Incidente guardado",
      detail: "Detalle del incidente",
      timestamp: "Fecha y hora",
      linkedPackages: "Paquetes/TBA vinculados",
      noLinkedPackages: "Sin paquete específico (incidente de bloque).",
      actionTakenLabel: "Acción tomada",
      actionTakenRequired: "Selecciona qué hiciste antes de guardar.",
      narrativeLabel: "Descripción",
      addCommunication: "Registrar comunicación con Soporte",
      commType: "Tipo",
      commSummary: "¿Qué te dijeron / qué pasó?",
      commReference: "Número de referencia (opcional)",
      commSave: "Guardar comunicación",
      communications: "Comunicaciones",
      evidence: "Evidencia",
      saveChanges: "Guardar cambios",
      recordNarrativeAudio: "Grabar audio del incidente",
      recordCommAudio: "Grabar audio de la llamada",
      savedWithComm: "Incidente guardado. También se registró tu comunicación con soporte.",
    },
    search: {
      title: "Buscar incidentes",
      date: "Fecha",
      station: "Estación",
      tba: "TBA",
      category: "Categoría",
      any: "Cualquiera",
      submit: "Buscar",
      results: "Resultados",
      none: "No se encontraron incidentes con esos filtros.",
    },
    common: {
      loading: "Cargando…",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      back: "Volver",
    },
  },
  en: {
    appName: "Incident Log",
    nav: {
      dashboard: "Home",
      stations: "Stations",
      blocks: "Blocks",
      search: "Search",
      logout: "Log out",
    },
    auth: {
      loginTitle: "Log in",
      signupTitle: "Create account",
      email: "Email",
      password: "Password",
      loginButton: "Log in",
      signupButton: "Create account",
      noAccount: "No account? Sign up",
      hasAccount: "Already have an account? Log in",
      error: "Could not complete the action. Check your details.",
      checkEmail: "Check your email to confirm your account.",
      emailNotConfirmed: "Confirm your email before logging in (check your inbox).",
      alreadyRegistered: "That email already has an account. Log in instead.",
    },
    dashboard: {
      title: "Home",
      activeBlock: "Active block",
      noActiveBlock: "You don't have an active block. Create one to start.",
      quickIncident: "Quick incident",
      newBlock: "New block",
      recentIncidents: "Recent incidents",
      noIncidents: "No incidents recorded yet.",
    },
    stations: {
      title: "Stations",
      new: "New station",
      name: "Name",
      code: "Station code",
      address: "Address",
      save: "Save",
      active: "Active",
      inactive: "Inactive",
      none: "You don't have any stations yet. Create the first one.",
    },
    blocks: {
      title: "Blocks",
      new: "New block",
      date: "Date",
      startTime: "Start time",
      endTime: "End time (optional)",
      station: "Station",
      payAmount: "Pay amount ($)",
      save: "Save block",
      none: "You don't have any blocks yet.",
      viewDetail: "View detail",
      deleteConfirm: "Delete this block? Its incidents and evidence will be deleted too. This cannot be undone.",
      delete: "Delete block",
      finish: "Finish block",
      finishConfirm: "Mark this block as finished? Amazon's scheduled time doesn't change — this only records the actual time you finished.",
      closedAt: "Closed",
      open: "Active",
      closed: "Closed",
    },
    incident: {
      quickCapture: "Quick incident",
      sectionPackage: "Package",
      sectionWhatHappened: "What happened",
      sectionWhatYouDid: "What you did",
      sectionEvidence: "Evidence",
      scope: "What does this incident apply to?",
      scopePackage: "A specific package / TBA",
      scopeBlock: "The whole block",
      tba: "TBA (optional)",
      category: "What happened?",
      actionTaken: "What did you do?",
      record: "Record audio",
      stop: "Stop",
      recording: "Recording…",
      playback: "Play",
      narrativeAudio: "🎙 Audio",
      narrativeText: "✍️ Text",
      narrativePlaceholder: "Briefly describe what happened...",
      photo: "Attach photo",
      micError: "Could not record audio. Please try again.",
      micDenied: "Microphone permission denied. Check this site's permissions in your browser settings.",
      micNotFound: "No microphone was found on this device.",
      micUnsupported: "This browser doesn't support audio recording. Try an updated Chrome or Safari.",
      save: "Save incident",
      saving: "Saving…",
      saved: "Incident saved",
      detail: "Incident detail",
      timestamp: "Date & time",
      linkedPackages: "Linked packages/TBA",
      noLinkedPackages: "No specific package (block-level incident).",
      actionTakenLabel: "Action taken",
      actionTakenRequired: "Choose what you did before saving.",
      narrativeLabel: "Description",
      addCommunication: "Log a Support communication",
      commType: "Type",
      commSummary: "What did they tell you / what happened?",
      commReference: "Reference number (optional)",
      commSave: "Save communication",
      communications: "Communications",
      evidence: "Evidence",
      saveChanges: "Save changes",
      recordNarrativeAudio: "Record incident audio",
      recordCommAudio: "Record call audio",
      savedWithComm: "Incident saved. Your support communication was also logged.",
    },
    search: {
      title: "Search incidents",
      date: "Date",
      station: "Station",
      tba: "TBA",
      category: "Category",
      any: "Any",
      submit: "Search",
      results: "Results",
      none: "No incidents found for those filters.",
    },
    common: {
      loading: "Loading…",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      back: "Back",
    },
  },
};
