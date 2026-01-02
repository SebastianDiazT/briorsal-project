from rest_framework.renderers import JSONRenderer

class CustomJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context['response'] if renderer_context else None

        if response and response.status_code >= 400:
            return super().render(data, accepted_media_type, renderer_context)

        formatted_data = {
            'status': 'success',
            'code': response.status_code if response else 200,
            'message': 'Operación realizada correctamente.',
            'data': data,
            'meta': None
        }

        if isinstance(data, dict) and 'results' in data and 'meta' in data:
            formatted_data['data'] = data['results']
            formatted_data['meta'] = data['meta']
            formatted_data['message'] = 'Lista obtenida correctamente.'

        return super().render(formatted_data, accepted_media_type, renderer_context)