import logging
from django.conf import settings
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger('django')

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        logger.error(f"Error 500: {str(exc)}", exc_info=True)

        error_detail = str(exc) if settings.DEBUG else "Error interno del servidor."

        return Response({
            'status': 'error',
            'code': 500,
            'message': 'Ocurrió un error inesperado en el servidor.',
            'errors': {'detail': error_detail}
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    message = 'Ha ocurrido un error en la solicitud.'

    error_messages = {
        400: 'Los datos enviados no son válidos.',
        401: 'No estás autorizado. Por favor inicia sesión.',
        403: 'No tienes permiso para realizar esta acción.',
        404: 'El recurso solicitado no fue encontrado.',
        405: 'Método HTTP no permitido para este recurso.',
        429: 'Has excedido el límite de peticiones. Intenta más tarde.'
    }

    message = error_messages.get(response.status_code, message)

    response.data = {
        'status': 'error',
        'code': response.status_code,
        'message': message,
        'errors': response.data
    }

    return response