from rest_framework.renderers import JSONRenderer

class CustomJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context['response'] if renderer_context else None

        if response and response.status_code >= 400:
            return super().render(data, accepted_media_type, renderer_context)

        custom_message = None
        meta_data = None
        final_data = data

        if isinstance(data, dict):
            custom_message = data.pop("custom_message", None)

            if 'results' in data and 'meta' in data:
                final_data = data['results']
                meta_data = data['meta']
                if not custom_message:
                    custom_message = "Lista obtenida correctamente."

        formatted_data = {
            'status': 'success',
            'code': response.status_code if response else 200,
            'message': custom_message or 'Operación realizada correctamente.',
            'data': final_data,
            'meta': meta_data
        }

        return super().render(formatted_data, accepted_media_type, renderer_context)