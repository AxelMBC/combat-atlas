const es = {
  'common.loading': 'CARGANDO',
  'common.loadingEllipsis': 'Cargando…',
  'common.retry': 'Reintentar',
  'common.accept': 'Aceptar',
  'common.close': 'Cerrar',

  'nav.backToWorldMap': '← Mapa Mundial',

  'language.toggleAria': 'Idioma',
  'language.toggle.es': 'Español',
  'language.toggle.en': 'Inglés',

  'worldMap.explorePrompt': 'Explora un país:',
  'worldMap.availableCountriesAria': 'Países disponibles',

  'country.mexico.name': 'México',
  'country.mexico.headerTitle': 'Boxeo al Estilo Mexicano',
  'country.mexico.topFightersTitle': 'Ídolos de México',
  'country.mexico.topEventsTitle': 'Peleas Históricas',

  'country.thailand.name': 'Tailandia',
  'country.thailand.headerTitle': 'Armas Thailandesas',
  'country.thailand.topFightersTitle': 'Leyendas Historicas',
  'country.thailand.topEventsTitle': 'Las guerras de Thailandia',

  'country.unitedStates.name': 'Estados Unidos',
  'country.unitedStates.headerTitle': 'Lucha con Garra Americana',
  'country.unitedStates.topFightersTitle': 'Leyendas del Tapete',
  'country.unitedStates.topEventsTitle': 'Duelos Olímpicos',

  'error.countryLoad': 'Ocurrió un error al cargar el país. Inténtalo de nuevo.',
  'error.formLoad': 'Error al cargar el formulario',
  'error.noMoreVideos': 'No hay más videos disponibles.',
  'error.noFighterEvent': 'No se encontró un evento principal para el peleador seleccionado.',

  'notFound.title': 'País no encontrado',
  'notFound.defaultMessage':
    'El país que buscas no existe o aún no está disponible en Combat Atlas.',
  'notFound.aria': 'Página no encontrada',

  'errorFallback.defaultTitle': 'Error de conexión',
  'errorFallback.defaultMessage':
    'No pudimos cargar la información. Revisa tu conexión e inténtalo de nuevo.',

  'mapFallback.title': 'No pudimos cargar el mapa',
  'mapFallback.message': 'Mientras tanto, puedes explorar los países disponibles en Combat Atlas.',
  'mapFallback.aria': 'No se pudo cargar el mapa',

  'mainEvent.searching': 'BUSCANDO COMBATE...',
  'mainEvent.anotherFight': 'Otro Combate',
  'mainEvent.fightsCount': 'combates',
  'mainEvent.lastUpdate': 'Última actualización',
  'mainEvent.division': 'División',
  'mainEvent.venue': 'Sede',
  'mainEvent.year': 'Año',
  'mainEvent.vs': 'VS',

  'fighter.noFights': 'Sin peleas',
  'fighter.exhausted': 'Agotado',
  'fighter.recordLabel': 'RÉCORD:',
  'fighter.fights.one': 'pelea',
  'fighter.fights.other': 'peleas',
  'fighter.koLabel': 'KO',
  'fighter.activeLabel': 'ACTIVO',
  'fighter.fightsTotalLabel': 'PELEAS',
  'fighter.profileCta': 'PERFIL',

  'fightCard.watchFight': 'Ver Pelea',

  'eventForm.pageTitle': 'Nuevo Evento de Pelea',
  'eventForm.pageDescription': 'Completá el formulario para ingresar un nuevo evento al sistema.',
  'eventForm.section.countryVideo': 'País y Video',
  'eventForm.section.eventInfo': 'Información del Evento',
  'eventForm.section.fighters': 'Peleadores',
  'eventForm.field.country': 'País',
  'eventForm.field.youtubeId': 'ID de YouTube',
  'eventForm.field.startTime': 'Tiempo de inicio (segundos)',
  'eventForm.field.title': 'Título',
  'eventForm.field.description': 'Descripción',
  'eventForm.field.tags': 'Etiquetas',
  'eventForm.field.mainFighterId': 'ID del peleador principal (opcional)',
  'eventForm.field.redCorner': 'Esquina Roja',
  'eventForm.field.blueCorner': 'Esquina Azul',
  'eventForm.help.youtubeIdFormat': '11 caracteres del ID del video (ej: dQw4w9WgXcQ)',
  'eventForm.help.mainFighterIdInfo': 'ID interno del peleador destacado en esta pelea',
  'eventForm.help.tagsAddInstruction': 'Presioná Enter para agregar',
  'eventForm.help.tagsMaxReached': 'Límite de {max} etiquetas alcanzado',
  'eventForm.loading.fighters': 'Cargando peleadores...',
  'eventForm.success.title': 'Evento creado exitosamente',
  'eventForm.error.title': 'Error al crear el evento',
  'eventForm.button.clear': 'Limpiar',
  'eventForm.button.submit': 'Enviar Evento',
  'eventForm.button.submitting': 'Enviando...',

  'videoPreview.invalidId': 'ID de YouTube inválido (debe tener 11 caracteres)',
  'videoPreview.promptForId': 'Ingresá el ID del video para previsualizar',

  'validation.countryRequired': 'El país es requerido.',
  'validation.youtubeIdInvalid': 'El ID de YouTube debe tener exactamente 11 caracteres.',
  'validation.startTimeInvalid': 'El tiempo de inicio debe ser ≥ 0.',
  'validation.titleLength': 'El título debe tener entre {min} y {max} caracteres.',
  'validation.descriptionLength': 'La descripción debe tener entre {min} y {max} caracteres.',
  'validation.tagsMax': 'Máximo {max} etiquetas.',
} as const;

export default es;

export type TranslationKey = keyof typeof es;
