from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 100
    page_size = 10

    def paginate_queryset(self, queryset, request, view=None):
        if request.query_params.get('no_page') == 'true':
            return None
        return super().paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        return Response({
            'results': data,
            'meta': {
                'page': self.page.number,
                'total_pages': self.page.paginator.num_pages,
                'total_records': self.page.paginator.count,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            }
        })