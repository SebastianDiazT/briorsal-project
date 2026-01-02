from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return Response({
            'status': 'error',
            'code': 500,
            'message': 'Ocurrió un error inesperado en el servidor.',
            'errors': str(exc)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    message = 'Ha ocurrido un error en la solicitud.'

    if response.status_code == 400:
        message = 'Los datos enviados no son válidos.'
    elif response.status_code == 401:
        message = 'No estás autorizado. Por favor inicia sesión.'
    elif response.status_code == 403:
        message = 'No tienes permiso para realizar esta acción.'
    elif response.status_code == 404:
        message = 'El recurso solicitado no fue encontrado.'
    elif response.status_code == 405:
        message = 'Método HTTP no permitido para este recurso.'

    response.data = {
        'status': 'error',
        'code': response.status_code,
        'message': message,
        'errors': response.data
    }

    return response